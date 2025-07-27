import express from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }

    // Create new user (password will be hashed by the model hook)
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'staff'
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
    });
    res.status(500).json({ 
        message: 'Server error during registration', 
        error: error.message 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', {
      timestamp: new Date().toISOString(),
      body: req.body,
      headers: req.headers
    });

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing credentials:', { email: !!email, password: !!password });
      return res.status(400).json({ 
        message: 'Email and password are required',
        details: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Find user by email
    const user = await User.findOne({ 
      where: { email },
      raw: false 
    }).catch(err => {
      console.error('Database query error:', err);
      throw new Error('Database query failed');
    });
    
    console.log('User lookup result:', {
      found: !!user,
      email: email,
      userId: user?.id
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password
    let isValidPassword = false;
    try {
      isValidPassword = await user.validatePassword(password);
      console.log('Password validation:', { valid: isValidPassword });
    } catch (error) {
      console.error('Password validation error:', error);
      throw new Error('Password validation failed');
    }

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

// Profile endpoint - get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      department: user.department,
      position: user.position,
      employeeId: user.employeeId,
      joinDate: user.joinDate,
      manager: user.manager,
      address: user.address,
      emergencyContact: user.emergencyContact,
      is_active: user.is_active
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      message: 'Error fetching profile',
      error: error.message 
    });
  }
});

// Update profile endpoint
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { phone, address, emergencyContact } = req.body;
    
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only the fields that users can modify (username is read-only)
    const updates = {};
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    if (emergencyContact !== undefined) updates.emergencyContact = emergencyContact;

    await user.update(updates);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department: user.department,
        position: user.position,
        employeeId: user.employeeId,
        joinDate: user.joinDate,
        manager: user.manager,
        address: user.address,
        emergencyContact: user.emergencyContact,
        is_active: user.is_active
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Error updating profile',
      error: error.message 
    });
  }
});

// Get user statistics endpoint
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get attendance statistics
    const attendanceStats = await sequelize.query(`
      SELECT 
        COUNT(*) as total_days,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_days
      FROM attendance 
      WHERE user_id = :userId 
      AND DATE_PART('year', check_in_time) = DATE_PART('year', CURRENT_DATE)
    `, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT
    });

    // Get tasks statistics
    const taskStats = await sequelize.query(`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks
      FROM tasks 
      WHERE assigned_to = :userId
    `, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT
    });

    // Get leave statistics
    const leaveStats = await sequelize.query(`
      SELECT 
        COALESCE(SUM(CASE 
          WHEN status = 'approved' 
          THEN DATE_PART('day', end_date - start_date) + 1 
          ELSE 0 
        END), 0) as leave_days_used
      FROM leaves 
      WHERE user_id = :userId 
      AND DATE_PART('year', start_date) = DATE_PART('year', CURRENT_DATE)
    `, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT
    });

    // Calculate attendance rate
    const totalDays = attendanceStats[0]?.total_days || 0;
    const presentDays = attendanceStats[0]?.present_days || 0;
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    // Get completed tasks count
    const completedTasks = taskStats[0]?.completed_tasks || 0;

    // Get leave days used
    const leaveDaysUsed = parseInt(leaveStats[0]?.leave_days_used) || 0;

    // Calculate performance rating (simple formula based on attendance and task completion)
    const totalTasks = taskStats[0]?.total_tasks || 1;
    const taskCompletionRate = (completedTasks / totalTasks) * 100;
    const performanceRating = ((attendanceRate * 0.6) + (taskCompletionRate * 0.4)) / 20; // Scale to 5.0
    const roundedRating = Math.min(5.0, Math.max(1.0, Number(performanceRating.toFixed(1))));

    res.json({
      attendanceRate: `${attendanceRate}%`,
      tasksCompleted: completedTasks,
      leaveDaysUsed: leaveDaysUsed,
      performanceRating: roundedRating
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ 
      message: 'Error fetching user statistics',
      error: error.message 
    });
  }
});

// Verify token endpoint
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      message: 'Error verifying token',
      error: error.message 
    });
  }
});

// Test endpoint to create a staff user (remove in production)
router.post('/create-test-user', async (req, res) => {
  try {
    const testUser = await User.create({
      username: "teststaff",
      email: "staff@example.com",
      password: "staff123",
      role: "staff"
    });

    res.status(201).json({
      message: 'Test staff user created successfully',
      user: {
        username: testUser.username,
        email: testUser.email,
        role: testUser.role
      }
    });
  } catch (error) {
    console.error('Test user creation error:', error);
    res.status(500).json({ 
      message: 'Error creating test user',
      error: error.message 
    });
  }
});

export default router;