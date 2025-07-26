import User from './User.js';
import Attendance from './Attendance.js';
import Leave from './Leave.js';
import Task from './Task.js';
import Notice from './Notice.js';

// Import all models to ensure associations are established
const models = {
  User,
  Attendance,
  Leave,
  Task,
  Notice
};

export default models; 