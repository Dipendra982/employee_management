import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  check_in: {
    type: DataTypes.TIME,
    allowNull: true
  },
  check_out: {
    type: DataTypes.TIME,
    allowNull: true
  },
  total_hours: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'half-day'),
    defaultValue: 'present',
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'attendance',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id', 'date']
    }
  ]
});

// Define associations
Attendance.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Attendance, { foreignKey: 'user_id', as: 'attendances' });

export default Attendance; 