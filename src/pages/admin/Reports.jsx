
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', description: 'Staff attendance summary and statistics' },
    { id: 'leave', name: 'Leave Report', description: 'Leave requests and approvals summary' },
    { id: 'task', name: 'Task Report', description: 'Task completion and productivity metrics' },
    { id: 'staff', name: 'Staff Report', description: 'Employee information and statistics' }
  ];
  
  const handleGenerateReport = () => {
    // Mock report generation
    const reportData = {
      attendance: {
        totalDays: 30,
        averageAttendance: '85%',
        totalAbsences: 45,
        lateArrivals: 12
      },
      leave: {
        totalRequests: 15,
        approved: 12,
        rejected: 2,
        pending: 1
      },
      task: {
        totalTasks: 48,
        completed: 35,
        inProgress: 8,
        overdue: 5
      },
      staff: {
        totalStaff: 24,
        activeStaff: 22,
        departments: 5,
        averageTenure: '2.5 years'
      }
    };
    
    alert(`${reportTypes.find(r => r.id === selectedReport)?.name} generated successfully!\n\nThis would normally download a PDF/Excel file with detailed data.`);
  };
  
  return (
    <div className="dashboard-layout">
      <Sidebar userRole="admin" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Reports & Analytics</h1>
          <p className="dashboard-subtitle">Generate comprehensive reports for analysis and record-keeping</p>
        </div>
        
        <div className="content-grid">
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>Generate Report</h3>
            
            <div className="form-group">
              <label className="form-label">Report Type</label>
              <select
                className="form-control"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                {reportTypes.map(report => (
                  <option key={report.id} value={report.id}>{report.name}</option>
                ))}
              </select>
              <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                {reportTypes.find(r => r.id === selectedReport)?.description}
              </small>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button className="btn btn-primary" onClick={handleGenerateReport}>
                📊 Generate Report
              </button>
              <button className="btn btn-secondary">
                📧 Email Report
              </button>
            </div>
          </div>
          
          <div className="quick-actions">
            <h3 className="actions-title">Quick Reports</h3>
            <button className="action-btn" onClick={() => alert('Today\'s attendance summary downloaded!')}>
              📅 Today's Attendance
            </button>
            <button className="action-btn" onClick={() => alert('Weekly summary report generated!')}>
              📈 Weekly Summary
            </button>
            <button className="action-btn" onClick={() => alert('Monthly overview downloaded!')}>
              📊 Monthly Overview
            </button>
            <button className="action-btn" onClick={() => alert('Staff directory exported!')}>
              👥 Staff Directory
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Recent Reports</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated On</th>
                <th>Generated By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>November Attendance Report</td>
                <td>Attendance</td>
                <td>2023-12-01</td>
                <td>Admin</td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', marginRight: '8px' }}>
                    Download
                  </button>
                  <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    Delete
                  </button>
                </td>
              </tr>
              <tr>
                <td>Q4 Leave Summary</td>
                <td>Leave</td>
                <td>2023-11-28</td>
                <td>Admin</td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', marginRight: '8px' }}>
                    Download
                  </button>
                  <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    Delete
                  </button>
                </td>
              </tr>
              <tr>
                <td>Task Completion Report</td>
                <td>Task</td>
                <td>2023-11-25</td>
                <td>Admin</td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', marginRight: '8px' }}>
                    Download
                  </button>
                  <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
