import express from 'express';
import { query } from '../config/database.js';
import models from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all leave requests (admin can see all, staff can see only their own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const whereClause = req.user.role === 'admin' ? {} : { user_id: req.user.userId };
    
    const leaves = await models.Leave.findAll({
      where: whereClause,
      include: [
        { model: models.User, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: models.User, as: 'approver', attributes: ['id', 'username', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });

    // Calculate leave balance for staff
    if (req.user.role === 'staff') {
      const currentYear = new Date().getFullYear();
      const thisYearLeaves = leaves.filter(leave => {
        const leaveYear = new Date(leave.start_date).getFullYear();
        return leaveYear === currentYear && leave.status === 'approved';
      });
      
      const usedDays = thisYearLeaves.reduce((total, leave) => total + leave.total_days, 0);
      const leaveBalance = {
        total: 20, // Default annual leave
        used: usedDays,
        remaining: 20 - usedDays
      };
      
      res.status(200).json({ leaves, leaveBalance });
    } else {
      res.status(200).json({ leaves });
    }
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

// Apply for leave (staff only)
router.post('/apply', authenticateToken, async (req, res) => {
  try {
    const { leave_type, start_date, end_date, reason } = req.body;
    
    console.log('Leave application received:', {
      leave_type,
      start_date,
      end_date,
      reason,
      userId: req.user.userId
    });

    if (!leave_type || !start_date || !end_date || !reason) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Calculate total days
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (startDate > endDate) {
      return res.status(400).json({ error: 'Start date cannot be after end date' });
    }

    // Allow same-day applications for emergency leave
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for comparison
    const startDateNormalized = new Date(start_date);
    startDateNormalized.setHours(0, 0, 0, 0);
    
    console.log('Date comparison:', {
      today: today.toISOString(),
      startDate: startDateNormalized.toISOString(),
      isValid: startDateNormalized >= today
    });
    
    if (startDateNormalized < today) {
      return res.status(400).json({ error: 'Start date cannot be in the past' });
    }

    const timeDiff = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Check if user has enough leave balance
    const currentYear = new Date().getFullYear();
    const existingLeaves = await models.Leave.findAll({
      where: {
        user_id: req.user.userId,
        status: 'approved'
      }
    });

    const thisYearLeaves = existingLeaves.filter(leave => {
      const leaveYear = new Date(leave.start_date).getFullYear();
      return leaveYear === currentYear;
    });

    const usedDays = thisYearLeaves.reduce((total, leave) => total + leave.total_days, 0);
    const remainingDays = 20 - usedDays; // 20 is annual leave allowance

    if (totalDays > remainingDays) {
      return res.status(400).json({ 
        error: `Insufficient leave balance. You have ${remainingDays} days remaining.` 
      });
    }

    const leave = await models.Leave.create({
      user_id: req.user.userId,
      leave_type,
      start_date,
      end_date,
      total_days: totalDays,
      reason,
      status: 'pending'
    });

    const leaveWithDetails = await models.Leave.findByPk(leave.id, {
      include: [
        { model: models.User, as: 'user', attributes: ['id', 'username', 'email'] }
      ]
    });

    res.status(201).json({
      message: 'Leave application submitted successfully',
      leave: leaveWithDetails
    });
  } catch (error) {
    console.error('Error applying for leave:', error);
    res.status(500).json({ error: 'Failed to apply for leave' });
  }
});

// Update leave status (admin only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be approved or rejected.' });
    }

    const leave = await models.Leave.findByPk(id);
    
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ error: 'Leave request has already been processed' });
    }

    await leave.update({
      status,
      approved_by: req.user.userId,
      approved_at: new Date(),
      admin_notes: admin_notes || null
    });

    const updatedLeave = await models.Leave.findByPk(id, {
      include: [
        { model: models.User, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: models.User, as: 'approver', attributes: ['id', 'username', 'email'] }
      ]
    });

    res.status(200).json({
      message: `Leave request ${status} successfully`,
      leave: updatedLeave
    });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ error: 'Failed to update leave status' });
  }
});

// Cancel leave request (staff can cancel their own pending requests)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await models.Leave.findByPk(id);
    
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // Staff can only cancel their own pending requests
    if (req.user.role === 'staff' && 
        (leave.user_id !== req.user.userId || leave.status !== 'pending')) {
      return res.status(403).json({ 
        error: 'You can only cancel your own pending leave requests' 
      });
    }

    await leave.destroy();

    res.status(200).json({ message: 'Leave request cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling leave:', error);
    res.status(500).json({ error: 'Failed to cancel leave request' });
  }
});

// Get leave balance (staff only)
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Access denied. Staff only.' });
    }

    const currentYear = new Date().getFullYear();
    const leaves = await models.Leave.findAll({
      where: {
        user_id: req.user.userId,
        status: 'approved'
      }
    });

    const thisYearLeaves = leaves.filter(leave => {
      const leaveYear = new Date(leave.start_date).getFullYear();
      return leaveYear === currentYear;
    });
    
    const usedDays = thisYearLeaves.reduce((total, leave) => total + leave.total_days, 0);
    const leaveBalance = {
      total: 20,
      used: usedDays,
      remaining: 20 - usedDays
    };

    res.status(200).json(leaveBalance);
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
});

export default router; 