
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const AdminAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const attendanceData = [
    { id: 1, name: 'John Doe', department: 'IT', checkIn: '09:15 AM', checkOut: '06:30 PM', status: 'Present', hours: '8.25' },
    { id: 2, name: 'Jane Smith', department: 'HR', checkIn: '09:30 AM', checkOut: '06:15 PM', status: 'Present', hours: '7.75' },
    { id: 3, name: 'Mike Johnson', department: 'Marketing', checkIn: '-', checkOut: '-', status: 'Absent', hours: '0' },
    { id: 4, name: 'Sarah Williams', department: 'Finance', checkIn: '08:45 AM', checkOut: '05:45 PM', status: 'Present', hours: '9' },
    { id: 5, name: 'Tom Wilson', department: 'IT', checkIn: '10:00 AM', checkOut: '07:00 PM', status: 'Late', hours: '8' }
  ];
  
  const stats = [
    { label: 'Total Staff', value: '24', color: '#007bff' },
    { label: 'Present', value: '18', color: '#28a745' },
    { label: 'Absent', value: '4', color: '#dc3545' },
    { label: 'Late', value: '2', color: '#ffc107' }
  ];
  
  return (
    <div className="dashboard-layout">
      <Sidebar userRole="admin" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Attendance Management</h1>
          <p className="dashboard-subtitle">Monitor and track staff attendance</p>
        </div>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Attendance Records</h3>
            <div>
              <label style={{ marginRight: '10px' }}>Filter by Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-control"
                style={{ width: 'auto', display: 'inline-block' }}
              />
            </div>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Hours Worked</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record.id}>
                    <td>{record.name}</td>
                    <td>{record.department}</td>
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut}</td>
                    <td>{record.hours}h</td>
                    <td>
                      <span className={`status-badge ${
                        record.status === 'Present' ? 'status-present' :
                        record.status === 'Absent' ? 'status-absent' :
                        'status-pending'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Actions</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">Export Attendance Report</button>
            <button className="btn btn-secondary">Send Attendance Reminder</button>
            <button className="btn btn-success">Mark Manual Attendance</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
