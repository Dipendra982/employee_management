import express from 'express';
import { query } from '../config/database.js';
import models from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all notices (visible to both admin and staff)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    // Staff can only see published notices targeted to them
    const whereClause = userRole === 'staff' 
      ? { 
          is_published: true,
          target_audience: ['all', 'staff']
        }
      : {}; // Admin can see all notices

    const notices = await models.Notice.findAll({
      where: whereClause,
      include: [
        { model: models.User, as: 'publisher', attributes: ['id', 'username', 'email'] }
      ],
      order: [['priority', 'DESC'], ['publish_date', 'DESC']]
    });

    // Calculate stats for staff
    if (userRole === 'staff') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthNotices = notices.filter(notice => {
        const noticeDate = new Date(notice.publish_date);
        return noticeDate.getMonth() === currentMonth && 
               noticeDate.getFullYear() === currentYear;
      });

      const stats = {
        total: notices.length,
        thisMonth: thisMonthNotices.length,
        urgent: notices.filter(n => n.type === 'urgent').length,
        important: notices.filter(n => n.type === 'important').length
      };
      
      res.status(200).json({ notices, stats });
    } else {
      // Calculate stats for admin
      const stats = {
        total: notices.length,
        published: notices.filter(n => n.is_published).length,
        urgent: notices.filter(n => n.type === 'urgent').length,
        important: notices.filter(n => n.type === 'important').length
      };
      
      res.status(200).json({ notices, stats });
    }
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// Get notice by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    
    const whereClause = userRole === 'staff' 
      ? { 
          id,
          is_published: true,
          target_audience: ['all', 'staff']
        }
      : { id };

    const notice = await models.Notice.findOne({
      where: whereClause,
      include: [
        { model: models.User, as: 'publisher', attributes: ['id', 'username', 'email'] }
      ]
    });

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.status(200).json(notice);
  } catch (error) {
    console.error('Error fetching notice:', error);
    res.status(500).json({ error: 'Failed to fetch notice' });
  }
});

// Create new notice (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { 
      title, 
      content, 
      type, 
      target_audience, 
      publish_date, 
      expiry_date, 
      priority,
      attachments 
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const notice = await models.Notice.create({
      title,
      content,
      type: type || 'general',
      published_by: req.user.userId,
      is_published: true,
      publish_date: publish_date ? new Date(publish_date) : new Date(),
      expiry_date: expiry_date ? new Date(expiry_date) : null,
      target_audience: target_audience || 'all',
      priority: priority || 1,
      attachments: attachments || null
    });

    const noticeWithDetails = await models.Notice.findByPk(notice.id, {
      include: [
        { model: models.User, as: 'publisher', attributes: ['id', 'username', 'email'] }
      ]
    });

    res.status(201).json({
      message: 'Notice created successfully',
      notice: noticeWithDetails
    });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

// Update notice (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    const { 
      title, 
      content, 
      type, 
      target_audience, 
      publish_date, 
      expiry_date, 
      priority,
      attachments,
      is_published 
    } = req.body;

    const notice = await models.Notice.findByPk(id);
    
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (type) updateData.type = type;
    if (target_audience) updateData.target_audience = target_audience;
    if (publish_date) updateData.publish_date = new Date(publish_date);
    if (expiry_date) updateData.expiry_date = new Date(expiry_date);
    if (priority !== undefined) updateData.priority = priority;
    if (attachments) updateData.attachments = attachments;
    if (is_published !== undefined) updateData.is_published = is_published;

    await notice.update(updateData);

    const updatedNotice = await models.Notice.findByPk(id, {
      include: [
        { model: models.User, as: 'publisher', attributes: ['id', 'username', 'email'] }
      ]
    });

    res.status(200).json({
      message: 'Notice updated successfully',
      notice: updatedNotice
    });
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({ error: 'Failed to update notice' });
  }
});

// Delete notice (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    const notice = await models.Notice.findByPk(id);
    
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    await notice.destroy();

    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

// Get notices by type
router.get('/type/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    const userRole = req.user.role;
    
    const whereClause = userRole === 'staff' 
      ? { 
          type,
          is_published: true,
          target_audience: ['all', 'staff']
        }
      : { type };

    const notices = await models.Notice.findAll({
      where: whereClause,
      include: [
        { model: models.User, as: 'publisher', attributes: ['id', 'username', 'email'] }
      ],
      order: [['priority', 'DESC'], ['publish_date', 'DESC']]
    });

    res.status(200).json(notices);
  } catch (error) {
    console.error('Error fetching notices by type:', error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

export default router;