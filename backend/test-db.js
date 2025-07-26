import { sequelize, testConnection } from './config/database.js';
import models from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing database connection with Sequelize...');
console.log('Environment variables:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

try {
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('✅ Database connection successful!');
    
    // Test if tables exist
    const tablesResult = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Existing tables:');
    if (tablesResult[0].length === 0) {
      console.log('❌ No tables found. Database setup needed.');
    } else {
      tablesResult[0].forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }

    // Test model queries
    try {
      const userCount = await models.User.count();
      console.log(`👥 Users in database: ${userCount}`);
      
      if (userCount > 0) {
        const users = await models.User.findAll({
          attributes: ['id', 'name', 'email', 'role']
        });
        console.log('📋 Users:');
        users.forEach(user => {
          console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
        });
      }
    } catch (modelError) {
      console.log('⚠️  Model test failed (tables might not exist yet):', modelError.message);
    }
  } else {
    console.log('❌ Database connection failed!');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await sequelize.close();
} 