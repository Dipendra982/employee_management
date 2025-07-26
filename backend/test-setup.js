import { sequelize, testConnection, syncDatabase } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing database setup...');

try {
  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Cannot connect to database.');
    process.exit(1);
  }

  console.log('✅ Database connection successful');

  // Import models to ensure they're loaded
  console.log('📦 Loading models...');
  await import('./models/index.js');
  console.log('✅ Models loaded');

  // Sync database
  console.log('🔄 Syncing database...');
  const syncSuccess = await syncDatabase(false);
  if (syncSuccess) {
    console.log('✅ Database synced successfully');
  } else {
    console.log('❌ Database sync failed');
  }

} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await sequelize.close();
} 