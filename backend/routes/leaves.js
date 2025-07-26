import express from 'express';
import { query } from '../config/database.js';
import models from '../models/index.js';

const router = express.Router();

// Get all leave requests (admin only)
router.get('/', async (req, res) => {
  try {
    const leaves = await models.Leave.findAll({
      include: [
        { model: models.User, as: 'user', attributes: ['id', 'name', 'email', 'role'] },
        { model: models.User, as: 'approver', attributes: ['id', 'name', 'email', 'role'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

// Apply for leave
router.post('/apply', async (req, res) => {
  res.status(200).json({ message: 'Apply leave route - to be implemented' });
});

export default router; 