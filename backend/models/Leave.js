import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

const Leave = sequelize.define('Leave', {
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
  leave_type: {
    type: DataTypes.ENUM('sick', 'casual', 'annual', 'maternity', 'paternity', 'other'),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  total_days: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  },
  approved_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attachment: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'leaves',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id', 'status']
    }
  ]
});

// Define associations
Leave.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Leave.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });
User.hasMany(Leave, { foreignKey: 'user_id', as: 'leaves' });
User.hasMany(Leave, { foreignKey: 'approved_by', as: 'approved_leaves' });

export default Leave; 