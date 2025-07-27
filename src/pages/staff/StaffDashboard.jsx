
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiClient } from '../../lib/api';
import '../../styles/dashboard.css';

const StaffDashboard = () => {
  const [userStats, setUserStats] = useState([
    { icon: '📅', number: '0', label: 'Days Present' },
    { icon: '⏰', number: '0', label: 'Late Arrivals' },
    { icon: '✅', number: '0', label: 'Tasks Completed' },
    { icon: '📝', number: '0', label: 'Pending Tasks' }
  ]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  
  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const userResponse = await apiClient.get('/auth/profile');
      setUserName(userResponse.username || 'User');
      
      // Fetch attendance stats
      const attendanceResponse = await apiClient.get('/attendance/user');
      const { stats } = attendanceResponse;
      
      // Fetch tasks
      const tasksResponse = await apiClient.get('/tasks');
      const { tasks, stats: taskStats } = tasksResponse;
      setRecentTasks(tasks.slice(0, 3)); // Show only recent 3 tasks
      
      // Fetch notices
      const noticesResponse = await apiClient.get('/notices');
      const { notices } = noticesResponse;
      setRecentNotices(notices.slice(0, 3)); // Show only recent 3 notices
      
      // Update stats
      setUserStats([
        { icon: '📅', number: stats?.totalPresent?.toString() || '0', label: 'Days Present' },
        { icon: '⏰', number: stats?.lateArrivals?.toString() || '0', label: 'Late Arrivals' },
        { icon: '✅', number: taskStats?.completed?.toString() || '0', label: 'Tasks Completed' },
        { icon: '📝', number: taskStats?.pending?.toString() || '0', label: 'Pending Tasks' }
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar userRole="staff" />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-layout">
      <Sidebar userRole="staff" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {userName}!</h1>
          <p className="dashboard-subtitle">Today is {todayDate}</p>
        </div>
        
        <div className="stats-grid">
          {userStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="content-grid">
          <div className="table-container">
            <div className="table-header">
              <h3 className="table-title">My Recent Tasks</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                      No tasks assigned yet
                    </td>
                  </tr>
                ) : (
                  recentTasks.map((task, index) => (
                    <tr key={index}>
                      <td>{task.title}</td>
                      <td>{new Date(task.due_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${
                          task.priority === 'high' ? 'status-rejected' :
                          task.priority === 'medium' ? 'status-pending' :
                          'status-approved'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${
                          task.status === 'completed' ? 'status-approved' :
                          task.status === 'in_progress' ? 'status-pending' :
                          'status-absent'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="quick-actions">
            <h3 className="actions-title">Quick Actions</h3>
            <a href="/staff/attendance" className="action-btn">⏰ Mark Attendance</a>
            <a href="/staff/leaves" className="action-btn">🛌 Apply for Leave</a>
            <a href="/staff/tasks" className="action-btn">✅ View All Tasks</a>
            <a href="/staff/profile" className="action-btn">👤 Update Profile</a>
          </div>
        </div>
        
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Recent Notices</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {recentNotices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No recent notices
              </div>
            ) : (
              recentNotices.map((notice, index) => (
                <div key={index} style={{
                  padding: '16px',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  background: '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: '0', color: '#333' }}>{notice.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        {new Date(notice.created_at).toLocaleDateString()}
                      </span>
                      <span className={`status-badge ${
                        notice.priority === 'high' ? 'status-rejected' :
                        notice.priority === 'medium' ? 'status-pending' :
                        'status-approved'
                      }`}>
                        {notice.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <a href="/staff/notices" className="btn btn-primary">View All Notices</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
