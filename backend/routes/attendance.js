import express from 'express';
import { query } from '../config/database.js';
import models from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all attendance records (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const attendance = await models.Attendance.findAll({
      include: [
        { model: models.User, as: 'user', attributes: ['id', 'username', 'email'] }
      ],
      order: [['date', 'DESC'], ['created_at', 'DESC']]
    });

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Get current user's attendance (must come before parameterized route)
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const attendance = await models.Attendance.findAll({
      where: { user_id: userId },
      include: [
        { model: models.User, as: 'user', attributes: ['id', 'username', 'email'] }
      ],
      order: [['date', 'DESC']]
    });

    // Calculate stats
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthAttendance = attendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });

    const stats = {
      thisMonth: thisMonthAttendance.filter(r => r.status === 'present' || r.status === 'late').length,
      totalPresent: attendance.filter(r => r.status === 'present' || r.status === 'late').length,
      lateArrivals: attendance.filter(r => r.status === 'late').length,
      absentDays: attendance.filter(r => r.status === 'absent').length
    };

    // Get today's attendance
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.find(record => record.date === today);

    res.status(200).json({
      attendance,
      todayAttendance,
      stats
    });
  } catch (error) {
    console.error('Error fetching user attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Get user attendance (staff can see their own, admin can see any)
router.get('/user/:userId?', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    
    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user.userId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const attendance = await models.Attendance.findAll({
      where: { user_id: userId },
      include: [
        { model: models.User, as: 'user', attributes: ['id', 'username', 'email'] }
      ],
      order: [['date', 'DESC']]
    });

    // Calculate stats
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthAttendance = attendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });

    const stats = {
      thisMonth: thisMonthAttendance.filter(r => r.status === 'present').length,
      totalPresent: attendance.filter(r => r.status === 'present').length,
      lateArrivals: attendance.filter(r => r.status === 'late').length,
      absentDays: attendance.filter(r => r.status === 'absent').length
    };

    // Get today's attendance
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.find(record => record.date === today);

    res.status(200).json({
      attendance,
      todayAttendance,
      stats
    });
  } catch (error) {
    console.error('Error fetching user attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Get attendance statistics (admin only)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { date } = req.query;
    const filterDate = date || new Date().toISOString().split('T')[0];

    // Get total staff count
    const totalStaff = await models.User.count();

    // Get attendance for the specified date
    const attendanceRecords = await models.Attendance.findAll({
      where: { date: filterDate },
      include: [
        { model: models.User, as: 'user', attributes: ['id', 'username', 'email'] }
      ]
    });

    // Calculate statistics
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = totalStaff - attendanceRecords.length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;

    const stats = {
      totalStaff,
      present,
      absent,
      late
    };

    res.status(200).json({ stats, records: attendanceRecords });
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ error: 'Failed to fetch attendance statistics' });
  }
});

// Check in
router.post('/checkin', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    // Check if already checked in today
    const existingAttendance = await models.Attendance.findOne({
      where: {
        user_id: userId,
        date: today
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    // Determine status based on check-in time
    const checkInHour = new Date().getHours();
    const checkInMinute = new Date().getMinutes();
    const isLate = checkInHour > 9 || (checkInHour === 9 && checkInMinute > 0); // After 9:00 AM

    const attendance = await models.Attendance.create({
      user_id: userId,
      date: today,
      check_in: currentTime,
      status: isLate ? 'late' : 'present',
      notes: req.body.notes || null
    });

    res.status(201).json({
      message: 'Checked in successfully',
      attendance,
      checkInTime: currentTime,
      status: isLate ? 'late' : 'present'
    });
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(500).json({ error: 'Failed to check in' });
  }
});

// Check out
router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    // Find today's attendance record
    const attendance = await models.Attendance.findOne({
      where: {
        user_id: userId,
        date: today
      }
    });

    if (!attendance) {
      return res.status(400).json({ error: 'No check-in record found for today' });
    }

    if (attendance.check_out) {
      return res.status(400).json({ error: 'Already checked out today' });
    }

    // Calculate total hours
    const checkIn = new Date(`${today}T${attendance.check_in}`);
    const checkOut = new Date(`${today}T${currentTime}`);
    const totalHours = (checkOut - checkIn) / (1000 * 60 * 60);

    await attendance.update({
      check_out: currentTime,
      total_hours: parseFloat(totalHours.toFixed(2)),
      notes: req.body.notes || attendance.notes
    });

    res.status(200).json({
      message: 'Checked out successfully',
      attendance,
      checkOutTime: currentTime,
      totalHours: parseFloat(totalHours.toFixed(2))
    });
  } catch (error) {
    console.error('Error checking out:', error);
    res.status(500).json({ error: 'Failed to check out' });
  }
});

// Get today's attendance status
router.get('/today', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await models.Attendance.findOne({
      where: {
        user_id: userId,
        date: today
      }
    });

    res.status(200).json({
      attendance,
      isCheckedIn: attendance ? !!attendance.check_in && !attendance.check_out : false,
      checkInTime: attendance?.check_in || null,
      checkOutTime: attendance?.check_out || null
    });
  } catch (error) {
    console.error('Error fetching today\'s attendance:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s attendance' });
  }
});

export default router; 