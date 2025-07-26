import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  res.status(200).json({ message: 'Tasks route - to be implemented' });
});

// Create new task
router.post('/', async (req, res) => {
  res.status(200).json({ message: 'Create task route - to be implemented' });
});

export default router; 