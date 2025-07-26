import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Get all notices
router.get('/', async (req, res) => {
  res.status(200).json({ message: 'Notices route - to be implemented' });
});

// Create new notice
router.post('/', async (req, res) => {
  res.status(200).json({ message: 'Create notice route - to be implemented' });
});

export default router; 