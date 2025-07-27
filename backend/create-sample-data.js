import { sequelize } from './config/database.js';
import models from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const createSampleData = async () => {
  try {
    console.log('🔄 Creating sample data for testing...');

    // Get existing users
    const adminUser = await models.User.findOne({ where: { email: 'admin@worknest.com' } });
    const staffUser = await models.User.findOne({ where: { email: 'staff@worknest.com' } });

    if (!adminUser || !staffUser) {
      console.error('❌ Admin or staff user not found. Please run setup first.');
      return;
    }

    // Create sample tasks
    console.log('📝 Creating sample tasks...');
    const sampleTasks = [
      {
        title: 'Update project documentation',
        description: 'Review and update the project documentation with latest changes and improvements',
        assigned_to: staffUser.id,
        assigned_by: adminUser.id,
        priority: 'high',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'in-progress',
        progress: 30
      },
      {
        title: 'Review code changes',
        description: 'Review the pull request #123 and provide detailed feedback',
        assigned_to: staffUser.id,
        assigned_by: adminUser.id,
        priority: 'medium',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'pending',
        progress: 0
      },
      {
        title: 'Client presentation preparation',
        description: 'Prepare slides and demo for upcoming client presentation',
        assigned_to: staffUser.id,
        assigned_by: adminUser.id,
        priority: 'high',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'pending',
        progress: 0
      }
    ];

    for (const task of sampleTasks) {
      const existingTask = await models.Task.findOne({ where: { title: task.title } });
      if (!existingTask) {
        await models.Task.create(task);
        console.log(`✅ Created task: ${task.title}`);
      }
    }

    // Create sample attendance records
    console.log('📅 Creating sample attendance records...');
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    for (const date of last7Days) {
      const existingAttendance = await models.Attendance.findOne({
        where: { user_id: staffUser.id, date }
      });

      if (!existingAttendance) {
        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
        if (!isWeekend) {
          const checkInHour = Math.random() > 0.8 ? 9 + Math.floor(Math.random() * 2) : 8 + Math.floor(Math.random() * 2);
          const checkInMinute = Math.floor(Math.random() * 60);
          const checkOutHour = 17 + Math.floor(Math.random() * 3);
          const checkOutMinute = Math.floor(Math.random() * 60);

          const checkIn = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')}:00`;
          const checkOut = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}:00`;
          
          const checkInTime = new Date(`${date}T${checkIn}`);
          const checkOutTime = new Date(`${date}T${checkOut}`);
          const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

          await models.Attendance.create({
            user_id: staffUser.id,
            date,
            check_in: checkIn,
            check_out: checkOut,
            total_hours: parseFloat(totalHours.toFixed(2)),
            status: checkInHour > 9 ? 'late' : 'present'
          });
        }
      }
    }
    console.log('✅ Created sample attendance records');

    // Create sample notices
    console.log('📢 Creating sample notices...');
    const sampleNotices = [
      {
        title: 'Holiday Schedule Update',
        content: 'Please note the updated holiday schedule for the upcoming months. The office will be closed during national holidays. All pending work should be completed in advance.',
        type: 'important',
        published_by: adminUser.id,
        is_published: true,
        publish_date: new Date(),
        target_audience: 'all',
        priority: 2
      },
      {
        title: 'New Security Protocols',
        content: 'We are implementing new security measures. All employees must update their passwords and enable two-factor authentication. Please attend the security briefing.',
        type: 'urgent',
        published_by: adminUser.id,
        is_published: true,
        publish_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        target_audience: 'all',
        priority: 3
      },
      {
        title: 'Team Building Event',
        content: 'Join us for our quarterly team building event. Activities include team games, lunch, and awards ceremony. Please confirm your attendance.',
        type: 'general',
        published_by: adminUser.id,
        is_published: true,
        publish_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        target_audience: 'all',
        priority: 1
      }
    ];

    for (const notice of sampleNotices) {
      const existingNotice = await models.Notice.findOne({ where: { title: notice.title } });
      if (!existingNotice) {
        await models.Notice.create(notice);
        console.log(`✅ Created notice: ${notice.title}`);
      }
    }

    console.log('\n🎉 Sample data created successfully!');
    console.log('\n📋 You can now test the following features:');
    console.log('- Staff Dashboard with real data');
    console.log('- Attendance tracking and history');
    console.log('- Task management');
    console.log('- Leave applications');
    console.log('- Notice board');
    console.log('- User profile');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await sequelize.close();
  }
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createSampleData();
}

export { createSampleData };
