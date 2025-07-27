import express from 'express';
import { query } from '../config/database.js';
import models from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks (admin can see all, staff can see only assigned to them)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const whereClause = req.user.role === 'admin' ? {} : { assigned_to: req.user.userId };
    
    const tasks = await models.Task.findAll({
      where: whereClause,
      include: [
        { model: models.User, as: 'assignee', attributes: ['id', 'username', 'email'] },
        { model: models.User, as: 'assigner', attributes: ['id', 'username', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });

    // Calculate stats for staff
    if (req.user.role === 'staff') {
      const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length
      };
      
      res.status(200).json({ tasks, stats });
    } else {
      // Calculate stats for admin
      const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length
      };
      
      res.status(200).json({ tasks, stats });
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get tasks by status
router.get('/status/:status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.params;
    const whereClause = { 
      status,
      ...(req.user.role === 'staff' ? { assigned_to: req.user.userId } : {})
    };
    
    const tasks = await models.Task.findAll({
      where: whereClause,
      include: [
        { model: models.User, as: 'assignee', attributes: ['id', 'username', 'email'] },
        { model: models.User, as: 'assigner', attributes: ['id', 'username', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create new task (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { title, description, assigned_to, priority, due_date, tags } = req.body;

    if (!title || !assigned_to) {
      return res.status(400).json({ error: 'Title and assigned_to are required' });
    }

    const task = await models.Task.create({
      title,
      description,
      assigned_to,
      assigned_by: req.user.userId,
      priority: priority || 'medium',
      due_date: due_date ? new Date(due_date) : null,
      tags: tags || null,
      status: 'pending',
      progress: 0
    });

    const taskWithDetails = await models.Task.findByPk(task.id, {
      include: [
        { model: models.User, as: 'assignee', attributes: ['id', 'username', 'email'] },
        { model: models.User, as: 'assigner', attributes: ['id', 'username', 'email'] }
      ]
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: taskWithDetails
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task status and progress (staff can update their own tasks)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress } = req.body;

    const task = await models.Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Staff can only update tasks assigned to them
    if (req.user.role === 'staff' && task.assigned_to !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied. You can only update your own tasks.' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = Math.min(100, Math.max(0, progress));
    
    // Set completed_at if status is completed
    if (status === 'completed') {
      updateData.completed_at = new Date();
      updateData.progress = 100;
    }

    await task.update(updateData);

    const updatedTask = await models.Task.findByPk(id, {
      include: [
        { model: models.User, as: 'assignee', attributes: ['id', 'username', 'email'] },
        { model: models.User, as: 'assigner', attributes: ['id', 'username', 'email'] }
      ]
    });

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Update entire task (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    const { title, description, assigned_to, priority, due_date, tags, status, progress } = req.body;

    const task = await models.Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (assigned_to) updateData.assigned_to = assigned_to;
    if (priority) updateData.priority = priority;
    if (due_date) updateData.due_date = new Date(due_date);
    if (tags) updateData.tags = tags;
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = Math.min(100, Math.max(0, progress));
    
    if (status === 'completed') {
      updateData.completed_at = new Date();
      updateData.progress = 100;
    }

    await task.update(updateData);

    const updatedTask = await models.Task.findByPk(id, {
      include: [
        { model: models.User, as: 'assignee', attributes: ['id', 'username', 'email'] },
        { model: models.User, as: 'assigner', attributes: ['id', 'username', 'email'] }
      ]
    });

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    const task = await models.Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router; 