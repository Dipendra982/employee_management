
import React from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const StaffDashboard = () => {
  // Mock data for current user
  const userStats = [
    { icon: '📅', number: '22', label: 'Days Present' },
    { icon: '⏰', number: '2', label: 'Late Arrivals' },
    { icon: '✅', number: '8', label: 'Tasks Completed' },
    { icon: '📝', number: '3', label: 'Pending Tasks' }
  ];
  
  const recentTasks = [
    { title: 'Update project documentation', dueDate: '2023-12-18', status: 'In Progress', priority: 'High' },
    { title: 'Review code changes', dueDate: '2023-12-20', status: 'Pending', priority: 'Medium' },
    { title: 'Attend team meeting', dueDate: '2023-12-15', status: 'Completed', priority: 'Low' }
  ];
  
  const recentNotices = [
    { title: 'Holiday Schedule Update', date: '2023-12-10', priority: 'High' },
    { title: 'New Security Protocols', date: '2023-12-08', priority: 'Medium' }
  ];
  
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="dashboard-layout">
      <Sidebar userRole="staff" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, John!</h1>
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
                {recentTasks.map((task, index) => (
                  <tr key={index}>
                    <td>{task.title}</td>
                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${
                        task.priority === 'High' ? 'status-rejected' :
                        task.priority === 'Medium' ? 'status-pending' :
                        'status-approved'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        task.status === 'Completed' ? 'status-approved' :
                        task.status === 'In Progress' ? 'status-pending' :
                        'status-absent'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
            {recentNotices.map((notice, index) => (
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
                      {new Date(notice.date).toLocaleDateString()}
                    </span>
                    <span className={`status-badge ${
                      notice.priority === 'High' ? 'status-rejected' :
                      notice.priority === 'Medium' ? 'status-pending' :
                      'status-approved'
                    }`}>
                      {notice.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
