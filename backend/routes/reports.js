import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  res.status(200).json({ message: 'Dashboard reports route - to be implemented' });
});

// Get attendance report
router.get('/attendance', async (req, res) => {
  res.status(200).json({ message: 'Attendance reports route - to be implemented' });
});

export default router; 