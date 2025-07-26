import { sequelize } from './config/database.js';
import models from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const createSampleUsers = async () => {
  try {
    console.log('🔄 Creating sample users...');

    // Check if admin user already exists
    const adminExists = await models.User.findOne({
      where: { email: 'admin@worknest.com' }
    });
    
    if (!adminExists) {
      // Create admin user
      await models.User.create({
        name: 'Admin User',
        email: 'admin@worknest.com',
        password: 'admin123',
        role: 'admin',
        department: 'Management',
        position: 'System Administrator',
        is_active: true
      });
      
      console.log('✅ Admin user created');
      console.log('📧 Email: admin@worknest.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Check if staff user already exists
    const staffExists = await models.User.findOne({
      where: { email: 'staff@worknest.com' }
    });
    
    if (!staffExists) {
      // Create staff user
      await models.User.create({
        name: 'Staff User',
        email: 'staff@worknest.com',
        password: 'staff123',
        role: 'staff',
        department: 'IT',
        position: 'Software Developer',
        is_active: true
      });
      
      console.log('✅ Staff user created');
      console.log('📧 Email: staff@worknest.com');
      console.log('🔑 Password: staff123');
    } else {
      console.log('ℹ️  Staff user already exists');
    }

    console.log('✅ Sample users created successfully');

  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await sequelize.close();
  }
};

createSampleUsers(); 