
import React from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  // Mock data
  const stats = [
    { icon: '👥', number: '24', label: 'Total Staff' },
    { icon: '✅', number: '18', label: 'Present Today' },
    { icon: '📋', number: '12', label: 'Pending Tasks' },
    { icon: '📄', number: '5', label: 'Leave Requests' }
  ];
  
  const recentAttendance = [
    { name: 'John Doe', status: 'Present', time: '09:15 AM' },
    { name: 'Jane Smith', status: 'Present', time: '09:30 AM' },
    { name: 'Mike Johnson', status: 'Absent', time: '-' },
    { name: 'Sarah Williams', status: 'Present', time: '08:45 AM' }
  ];
  
  const pendingLeaves = [
    { name: 'Alice Brown', type: 'Sick Leave', dates: 'Dec 15-16', status: 'Pending' },
    { name: 'Tom Wilson', type: 'Vacation', dates: 'Dec 20-24', status: 'Pending' }
  ];
  
  return (
    <div className="dashboard-layout">
      <Sidebar userRole="admin" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
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
              <h3 className="table-title">Today's Attendance</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Status</th>
                  <th>Check-in Time</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map((record, index) => (
                  <tr key={index}>
                    <td>{record.name}</td>
                    <td>
                      <span className={`status-badge ${record.status === 'Present' ? 'status-present' : 'status-absent'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="quick-actions">
            <h3 className="actions-title">Quick Actions</h3>
            <a href="/admin/staff" className="action-btn">👥 Manage Staff</a>
            <a href="/admin/tasks" className="action-btn">✅ Assign Tasks</a>
            <a href="/admin/notices" className="action-btn">📢 Post Notice</a>
            <a href="/admin/reports" className="action-btn">📊 Generate Report</a>
          </div>
        </div>
        
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Pending Leave Requests</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeaves.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.name}</td>
                  <td>{leave.type}</td>
                  <td>{leave.dates}</td>
                  <td>
                    <span className="status-badge status-pending">{leave.status}</span>
                  </td>
                  <td>
                    <button className="btn btn-success" style={{ marginRight: '8px', padding: '4px 8px', fontSize: '12px' }}>
                      Approve
                    </button>
                    <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
