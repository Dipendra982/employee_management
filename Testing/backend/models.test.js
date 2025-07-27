const { User, Task, Attendance, Leave } = require('../../backend/models');
const { Sequelize } = require('sequelize');

// Mock Sequelize
jest.mock('sequelize');

describe('Database Models', () => {
  describe('User Model', () => {
    test('should have required fields', () => {
      const userFields = Object.keys(User.rawAttributes || {});
      
      expect(userFields).toContain('name');
      expect(userFields).toContain('email');
      expect(userFields).toContain('password');
      expect(userFields).toContain('role');
    });

    test('should validate email format', () => {
      const emailField = User.rawAttributes?.email;
      expect(emailField?.validate?.isEmail).toBe(true);
    });

    test('should have unique email constraint', () => {
      const emailField = User.rawAttributes?.email;
      expect(emailField?.unique).toBe(true);
    });
  });

  describe('Task Model', () => {
    test('should have required fields', () => {
      const taskFields = Object.keys(Task.rawAttributes || {});
      
      expect(taskFields).toContain('title');
      expect(taskFields).toContain('description');
      expect(taskFields).toContain('status');
      expect(taskFields).toContain('assigned_to');
      expect(taskFields).toContain('due_date');
    });

    test('should have valid status values', () => {
      const statusField = Task.rawAttributes?.status;
      const validStatuses = ['pending', 'in_progress', 'completed'];
      
      expect(statusField?.validate?.isIn).toEqual([validStatuses]);
    });
  });

  describe('Attendance Model', () => {
    test('should have required fields', () => {
      const attendanceFields = Object.keys(Attendance.rawAttributes || {});
      
      expect(attendanceFields).toContain('user_id');
      expect(attendanceFields).toContain('date');
      expect(attendanceFields).toContain('check_in_time');
      expect(attendanceFields).toContain('check_out_time');
      expect(attendanceFields).toContain('status');
    });

    test('should have valid status values', () => {
      const statusField = Attendance.rawAttributes?.status;
      const validStatuses = ['present', 'absent', 'late'];
      
      expect(statusField?.validate?.isIn).toEqual([validStatuses]);
    });
  });

  describe('Leave Model', () => {
    test('should have required fields', () => {
      const leaveFields = Object.keys(Leave.rawAttributes || {});
      
      expect(leaveFields).toContain('user_id');
      expect(leaveFields).toContain('start_date');
      expect(leaveFields).toContain('end_date');
      expect(leaveFields).toContain('reason');
      expect(leaveFields).toContain('status');
    });

    test('should have valid status values', () => {
      const statusField = Leave.rawAttributes?.status;
      const validStatuses = ['pending', 'approved', 'rejected'];
      
      expect(statusField?.validate?.isIn).toEqual([validStatuses]);
    });
  });

  describe('Model Associations', () => {
    test('User should have many tasks', () => {
      expect(User.associations?.tasks).toBeDefined();
    });

    test('User should have many attendance records', () => {
      expect(User.associations?.attendances).toBeDefined();
    });

    test('User should have many leaves', () => {
      expect(User.associations?.leaves).toBeDefined();
    });

    test('Task should belong to user', () => {
      expect(Task.associations?.user).toBeDefined();
    });

    test('Attendance should belong to user', () => {
      expect(Attendance.associations?.user).toBeDefined();
    });

    test('Leave should belong to user', () => {
      expect(Leave.associations?.user).toBeDefined();
    });
  });
});
