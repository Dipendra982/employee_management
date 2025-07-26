import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        status: 'unauthorized'
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not found in environment variables');
      return res.status(500).json({
        error: 'Server configuration error.',
        status: 'error'
      });
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err.message);
        return res.status(403).json({
          error: 'Invalid or expired token.',
          status: 'forbidden'
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      error: 'Authentication error.',
      status: 'error'
    });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      error: 'Access denied. Admin privileges required.',
      status: 'forbidden'
    });
  }
};

// Middleware to check if user is staff or admin
export const requireStaff = (req, res, next) => {
  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      error: 'Access denied. Staff privileges required.',
      status: 'forbidden'
    });
  }
}; 