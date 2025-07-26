import { sequelize, testConnection, syncDatabase } from '../config/database.js';
import models from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const insertSampleData = async () => {
  try {
    console.log('🔄 Inserting sample data...');

    // Check if admin user already exists
    const adminExists = await models.User.findOne({
      where: { email: 'admin@worknest.com' }
    });
    
    if (!adminExists) {
      // Create admin user
      await models.User.create({
        username: 'admin',
        email: 'admin@worknest.com',
        password: 'admin123',
        role: 'admin'
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
        username: 'staff',
        email: 'staff@worknest.com',
        password: 'staff123',
        role: 'staff'
      });
      
      console.log('✅ Staff user created');
      console.log('📧 Email: staff@worknest.com');
      console.log('🔑 Password: staff123');
    } else {
      console.log('ℹ️  Staff user already exists');
    }

    console.log('✅ Sample data inserted successfully');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    throw error;
  }
};

const setupDatabase = async () => {
  try {
    console.log('🚀 Setting up WorkNest database with Sequelize...\n');

    // Test connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Cannot connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Sync database (create tables)
    const syncSuccess = await syncDatabase(false); // false = don't force recreate
    if (!syncSuccess) {
      console.error('❌ Database sync failed.');
      process.exit(1);
    }

    // Insert sample data
    await insertSampleData();

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Access the API at: http://localhost:5000');
    console.log('3. Test the health endpoint: http://localhost:5000/api/health');
    console.log('\n🔐 Default login credentials:');
    console.log('Admin: admin@worknest.com / admin123');
    console.log('Staff: staff@worknest.com / staff123');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase }; 