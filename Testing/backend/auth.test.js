const request = require('supertest');
const app = require('../../backend/server');
const { User } = require('../../backend/models');
const jwt = require('jsonwebtoken');

// Mock the database
jest.mock('../../backend/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn()
  },
  Task: {
    count: jest.fn()
  },
  Attendance: {
    count: jest.fn()
  },
  Leave: {
    count: jest.fn()
  }
}));

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    test('should login user with valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'staff',
        password: '$2b$10$hashedpassword'
      };

      User.findOne.mockResolvedValue(mockUser);
      
      // Mock bcrypt comparison
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'staff'
      });
    });

    test('should return 401 for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
          // missing password
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });
  });

  describe('POST /api/auth/signup', () => {
    test('should create new user with valid data', async () => {
      const mockNewUser = {
        id: 2,
        email: 'newuser@example.com',
        name: 'New User',
        role: 'staff'
      };

      User.findOne.mockResolvedValue(null); // User doesn't exist
      User.create.mockResolvedValue(mockNewUser);

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          role: 'staff'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        id: 2,
        email: 'newuser@example.com',
        name: 'New User',
        role: 'staff'
      });
    });

    test('should return 400 for existing user', async () => {
      const existingUser = {
        id: 1,
        email: 'existing@example.com'
      };

      User.findOne.mockResolvedValue(existingUser);

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
          role: 'staff'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('GET /api/auth/me', () => {
    test('should return user data for valid token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'staff'
      };

      User.findOne.mockResolvedValue(mockUser);

      const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'testsecret');

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject(mockUser);
    });

    test('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });

    test('should return 401 for missing token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('GET /api/auth/stats', () => {
    test('should return dashboard statistics', async () => {
      // Mock all count queries
      User.count.mockResolvedValue(10);
      require('../../backend/models').Task.count.mockResolvedValue(25);
      require('../../backend/models').Attendance.count.mockResolvedValue(8);
      require('../../backend/models').Leave.count.mockResolvedValue(3);

      const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'testsecret');

      const response = await request(app)
        .get('/api/auth/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        totalUsers: 10,
        totalTasks: 25,
        totalAttendance: 8,
        totalLeaves: 3
      });
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/auth/stats');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });
  });
});
