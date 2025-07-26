import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

const Notice = sequelize.define('Notice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('general', 'important', 'urgent', 'announcement'),
    defaultValue: 'general',
    allowNull: false
  },
  published_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  publish_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  target_audience: {
    type: DataTypes.ENUM('all', 'admin', 'staff'),
    defaultValue: 'all',
    allowNull: false
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  tableName: 'notices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['is_published', 'publish_date']
    }
  ]
});

// Define associations
Notice.belongsTo(User, { foreignKey: 'published_by', as: 'publisher' });
User.hasMany(Notice, { foreignKey: 'published_by', as: 'published_notices' });

export default Notice; 