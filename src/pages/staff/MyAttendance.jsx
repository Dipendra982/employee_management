
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const MyAttendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [attendanceHistory] = useState([
    { date: '2023-12-11', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: '8.25', status: 'Present' },
    { date: '2023-12-10', checkIn: '09:30 AM', checkOut: '06:15 PM', hours: '7.75', status: 'Present' },
    { date: '2023-12-09', checkIn: '-', checkOut: '-', hours: '0', status: 'Absent' },
    { date: '2023-12-08', checkIn: '08:45 AM', checkOut: '05:45 PM', hours: '9', status: 'Present' },
    { date: '2023-12-07', checkIn: '10:00 AM', checkOut: '07:00 PM', hours: '8', status: 'Late' }
  ]);
  
  const stats = [
    { label: 'This Month', value: '18 days', color: '#28a745' },
    { label: 'Total Present', value: '22 days', color: '#007bff' },
    { label: 'Late Arrivals', value: '2 days', color: '#ffc107' },
    { label: 'Absent Days', value: '3 days', color: '#dc3545' }
  ];
  
  const handleCheckIn = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      // Check out
      setIsCheckedIn(false);
      alert(`Checked out successfully at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }
  };
  
  const todayDate = new Date().toDateString();
  
  return (
    <div className="dashboard-layout">
      <Sidebar userRole="staff" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Attendance</h1>
          <p className="dashboard-subtitle">Track your daily attendance and work hours</p>
        </div>
        
        <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '16px', color: '#333' }}>{todayDate}</h3>
          
          {isCheckedIn ? (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#28a745', fontSize: '18px', marginBottom: '8px' }}>
                ✅ Checked in at {checkInTime}
              </p>
              <p style={{ color: '#666' }}>
                You've been working for {Math.floor(Math.random() * 8 + 1)} hours
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#666', fontSize: '18px' }}>
                {checkInTime ? '✅ Checked out for today' : '⏰ Ready to start your day?'}
              </p>
            </div>
          )}
          
          <button
            className={`btn ${isCheckedIn ? 'btn-danger' : 'btn-success'}`}
            onClick={handleCheckIn}
            style={{ 
              padding: '16px 32px', 
              fontSize: '18px',
              minWidth: '200px'
            }}
            disabled={checkInTime && !isCheckedIn}
          >
            {checkInTime && !isCheckedIn ? 'Already Checked Out' : 
             isCheckedIn ? '🚪 Check Out' : '⏰ Check In'}
          </button>
        </div>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Attendance History</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours Worked</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.map((record, index) => (
                <tr key={index}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
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
        
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Attendance Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>92%</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Attendance Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>8.2h</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Avg. Daily Hours</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>164h</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Total This Month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;
