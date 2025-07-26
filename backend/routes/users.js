import express from 'express';
import { query } from '../config/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, department, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (role) {
      paramCount++;
      whereClause += ` AND role = $${paramCount}`;
      params.push(role);
    }

    if (department) {
      paramCount++;
      whereClause += ` AND department = $${paramCount}`;
      params.push(department);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM users ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get users with pagination
    paramCount++;
    const usersResult = await query(
      `SELECT id, name, email, role, department, position, phone, address, hire_date, is_active, created_at 
       FROM users ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...params, limit, offset]
    );

    res.status(200).json({
      message: 'Users retrieved successfully',
      data: usersResult.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to retrieve users',
      status: 'error'
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    // Users can only view their own profile unless they're admin
    if (role !== 'admin' && parseInt(id) !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        status: 'forbidden'
      });
    }

    const userResult = await query(
      'SELECT id, name, email, role, department, position, phone, address, hire_date, is_active, created_at FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        status: 'not_found'
      });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      data: userResult.rows[0]
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user',
      status: 'error'
    });
  }
});

// Create new user (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role = 'staff', department, position, phone, address } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email, and password are required',
        status: 'bad_request'
      });
    }

    // Check if user already exists
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'User with this email already exists',
        status: 'bad_request'
      });
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const newUser = await query(
      `INSERT INTO users (name, email, password, role, department, position, phone, address, hire_date, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id, name, email, role, department, position, phone, address, hire_date, is_active`,
      [name, email, hashedPassword, role, department, position, phone, address, new Date(), true]
    );

    res.status(201).json({
      message: 'User created successfully',
      data: newUser.rows[0]
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Failed to create user',
      status: 'error'
    });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, department, position, phone, address, is_active } = req.body;
    const { userId, role: userRole } = req.user;

    // Users can only update their own profile unless they're admin
    if (userRole !== 'admin' && parseInt(id) !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        status: 'forbidden'
      });
    }

    // Check if user exists
    const existingUser = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        status: 'not_found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingUser.rows[0].email) {
      const emailExists = await query('SELECT * FROM users WHERE email = $1 AND id != $2', [email, id]);
      if (emailExists.rows.length > 0) {
        return res.status(400).json({
          error: 'Email already exists',
          status: 'bad_request'
        });
      }
    }

    // Build update query
    const updateFields = [];
    const params = [];
    let paramCount = 0;

    if (name) {
      paramCount++;
      updateFields.push(`name = $${paramCount}`);
      params.push(name);
    }

    if (email) {
      paramCount++;
      updateFields.push(`email = $${paramCount}`);
      params.push(email);
    }

    if (role && userRole === 'admin') {
      paramCount++;
      updateFields.push(`role = $${paramCount}`);
      params.push(role);
    }

    if (department) {
      paramCount++;
      updateFields.push(`department = $${paramCount}`);
      params.push(department);
    }

    if (position) {
      paramCount++;
      updateFields.push(`position = $${paramCount}`);
      params.push(position);
    }

    if (phone) {
      paramCount++;
      updateFields.push(`phone = $${paramCount}`);
      params.push(phone);
    }

    if (address) {
      paramCount++;
      updateFields.push(`address = $${paramCount}`);
      params.push(address);
    }

    if (is_active !== undefined && userRole === 'admin') {
      paramCount++;
      updateFields.push(`is_active = $${paramCount}`);
      params.push(is_active);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        status: 'bad_request'
      });
    }

    paramCount++;
    updateFields.push(`updated_at = $${paramCount}`);
    params.push(new Date());

    paramCount++;
    params.push(id);

    const updateResult = await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount} 
       RETURNING id, name, email, role, department, position, phone, address, hire_date, is_active`,
      params
    );

    res.status(200).json({
      message: 'User updated successfully',
      data: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      status: 'error'
    });
  }
});

// Delete user (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        status: 'not_found'
      });
    }

    // Delete user
    await query('DELETE FROM users WHERE id = $1', [id]);

    res.status(200).json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      status: 'error'
    });
  }
});

export default router; 