const request = require('supertest');
const app = require('../../backend/server');
const { User } = require('../../backend/models');
const jwt = require('jsonwebtoken');

// Mock the database
jest.mock('../../backend/models', () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  }
}));

describe('Users Routes', () => {
  let adminToken, staffToken;

  beforeAll(() => {
    adminToken = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET || 'testsecret');
    staffToken = jwt.sign({ userId: 2, role: 'staff' }, process.env.JWT_SECRET || 'testsecret');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    test('should return all users for admin', async () => {
      const mockUsers = [
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
        { id: 2, name: 'Staff User', email: 'staff@example.com', role: 'staff' }
      ];

      User.findAll.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUsers);
    });

    test('should deny access for staff', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${staffToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('GET /api/users/:id', () => {
    test('should return specific user for admin', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'staff'
      };

      User.findByPk.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    test('should return 404 for non-existent user', async () => {
      User.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/users/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('POST /api/users', () => {
    test('should create new user for admin', async () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'staff'
      };

      const createdUser = {
        id: 3,
        ...newUser,
        password: 'hashedpassword'
      };

      User.create.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Incomplete User'
          // missing email, password, role
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update user for admin', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      User.update.mockResolvedValue([1]); // affected rows
      User.findByPk.mockResolvedValue({ id: 1, ...updateData, role: 'staff' });

      const response = await request(app)
        .put('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.email).toBe(updateData.email);
    });

    test('should return 404 for non-existent user', async () => {
      User.update.mockResolvedValue([0]); // no affected rows

      const response = await request(app)
        .put('/api/users/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should delete user for admin', async () => {
      User.destroy.mockResolvedValue(1); // affected rows

      const response = await request(app)
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted successfully');
    });

    test('should return 404 for non-existent user', async () => {
      User.destroy.mockResolvedValue(0); // no affected rows

      const response = await request(app)
        .delete('/api/users/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });
});
