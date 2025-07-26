
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const AdminLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employee: 'Alice Brown', type: 'Sick Leave', startDate: '2023-12-15', endDate: '2023-12-16', days: 2, reason: 'Medical appointment', status: 'Pending' },
    { id: 2, employee: 'Tom Wilson', type: 'Vacation', startDate: '2023-12-20', endDate: '2023-12-24', days: 5, reason: 'Family vacation', status: 'Pending' },
    { id: 3, employee: 'John Doe', type: 'Personal', startDate: '2023-12-18', endDate: '2023-12-18', days: 1, reason: 'Personal work', status: 'Approved' },
    { id: 4, employee: 'Jane Smith', type: 'Sick Leave', startDate: '2023-12-10', endDate: '2023-12-12', days: 3, reason: 'Flu symptoms', status: 'Rejected' }
  ]);
  
  const handleLeaveAction = (id, action) => {
    setLeaveRequests(leaveRequests.map(leave => 
      leave.id === id ? { ...leave, status: action } : leave
    ));
  };
  
  const stats = [
    { label: 'Total Requests', value: leaveRequests.length.toString() },
    { label: 'Pending', value: leaveRequests.filter(l => l.status === 'Pending').length.toString() },
    { label: 'Approved', value: leaveRequests.filter(l => l.status === 'Approved').length.toString() },
    { label: 'Rejected', value: leaveRequests.filter(l => l.status === 'Rejected').length.toString() }
  ];
  
  return (
    <div className="dashboard-layout">
      <Sidebar userRole="admin" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Leave Requests</h1>
          <p className="dashboard-subtitle">Review and manage employee leave applications</p>
        </div>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Leave Requests</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.employee}</td>
                  <td>{leave.type}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.days}</td>
                  <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>{leave.reason}</td>
                  <td>
                    <span className={`status-badge ${
                      leave.status === 'Approved' ? 'status-approved' :
                      leave.status === 'Rejected' ? 'status-rejected' :
                      'status-pending'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    {leave.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-success"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => handleLeaveAction(leave.id, 'Approved')}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-danger"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => handleLeaveAction(leave.id, 'Rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {leave.status !== 'Pending' && (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {leave.status === 'Approved' ? '✓ Processed' : '✗ Processed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Leave Management Actions</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">Export Leave Report</button>
            <button className="btn btn-secondary">Set Leave Policies</button>
            <button className="btn btn-success">View Leave Calendar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaves;
