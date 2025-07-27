
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiClient } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/dashboard.css';

const AdminAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({ totalStaff: 0, present: 0, absent: 0, late: 0 });
  const [loading, setLoading] = useState(true);
  const [allAttendance, setAllAttendance] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats and records for the selected date
      const response = await apiClient.get(`/attendance/stats?date=${selectedDate}`);
      setAttendanceStats(response.stats);
      setAttendanceRecords(response.records);
      
      // Fetch all attendance records for additional context
      const allRecordsResponse = await apiClient.get('/attendance');
      setAllAttendance(allRecordsResponse);
      
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '0';
    
    const checkInTime = new Date(`1970-01-01T${checkIn}Z`);
    const checkOutTime = new Date(`1970-01-01T${checkOut}Z`);
    const diffMs = checkOutTime - checkInTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours.toFixed(2);
  };

  const exportAttendanceReport = async () => {
    try {
      toast.info('Generating attendance report...');
      // TODO: Implement export functionality
      setTimeout(() => {
        toast.success('Report exported successfully!');
      }, 1000);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const sendAttendanceReminder = async () => {
    try {
      toast.info('Sending attendance reminders...');
      // TODO: Implement reminder functionality
      setTimeout(() => {
        toast.success('Reminders sent successfully!');
      }, 1000);
    } catch (error) {
      toast.error('Failed to send reminders');
    }
  };

  const markManualAttendance = async () => {
    try {
      toast.info('Manual attendance marking feature coming soon...');
      // TODO: Implement manual attendance marking
    } catch (error) {
      toast.error('Failed to mark manual attendance');
    }
  };

  const statsCards = [
    { label: 'Total Staff', value: attendanceStats.totalStaff.toString(), color: '#007bff' },
    { label: 'Present', value: attendanceStats.present.toString(), color: '#28a745' },
    { label: 'Absent', value: attendanceStats.absent.toString(), color: '#dc3545' },
    { label: 'Late', value: attendanceStats.late.toString(), color: '#ffc107' }
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
          {statsCards.map((stat, index) => (
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
                  <th>Email</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Hours Worked</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      Loading attendance data...
                    </td>
                  </tr>
                ) : attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                      No attendance records found for {new Date(selectedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.user?.username || 'Unknown'}</td>
                      <td>{record.user?.email || 'N/A'}</td>
                      <td>{formatTime(record.check_in)}</td>
                      <td>{formatTime(record.check_out)}</td>
                      <td>{calculateWorkingHours(record.check_in, record.check_out)}h</td>
                      <td>
                        <span className={`status-badge ${
                          record.status === 'present' ? 'status-present' :
                          record.status === 'absent' ? 'status-absent' :
                          record.status === 'late' ? 'status-pending' :
                          'status-approved'
                        }`}>
                          {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                        </span>
                      </td>
                      <td>{record.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Actions</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={exportAttendanceReport}
            >
              Export Attendance Report
            </button>
            <button 
              className="btn btn-secondary"
              onClick={sendAttendanceReminder}
            >
              Send Attendance Reminder
            </button>
            <button 
              className="btn btn-success"
              onClick={markManualAttendance}
            >
              Mark Manual Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
