
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiClient } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/dashboard.css';

const MyAttendance = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [stats, setStats] = useState({
    thisMonth: 0,
    totalPresent: 0,
    lateArrivals: 0,
    absentDays: 0
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Fetch attendance data
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/attendance/user');
      const { attendance, todayAttendance: today, stats: attendanceStats } = response;
      
      setAttendanceHistory(attendance || []);
      setTodayAttendance(today);
      setStats(attendanceStats || {
        thisMonth: 0,
        totalPresent: 0,
        lateArrivals: 0,
        absentDays: 0
      });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckIn = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      if (!todayAttendance || !todayAttendance.check_in_time) {
        // Check in
        const response = await apiClient.post('/attendance/checkin');
        toast.success('Checked in successfully!');
        await fetchAttendanceData(); // Refresh data
      } else if (!todayAttendance.check_out_time) {
        // Check out
        const response = await apiClient.post('/attendance/checkout');
        toast.success('Checked out successfully!');
        await fetchAttendanceData(); // Refresh data
      }
    } catch (error) {
      console.error('Error with attendance:', error);
      
      // Show specific error message for "already checked in" case
      if (error.message && error.message.includes('Already checked in today')) {
        toast.warning('You have already checked in today!');
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to update attendance');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '0';
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours.toFixed(2);
  };
  
  const getAttendanceStatus = (record) => {
    if (!record.check_in_time) return 'Absent';
    
    const checkInTime = new Date(record.check_in_time);
    const workStartTime = new Date(record.check_in_time);
    workStartTime.setHours(9, 0, 0, 0); // 9:00 AM
    
    if (checkInTime > workStartTime) return 'Late';
    return 'Present';
  };
  
  const isCheckedIn = todayAttendance?.check_in_time && !todayAttendance?.check_out_time;
  const hasCheckedOut = todayAttendance?.check_out_time;
  
  const todayDate = new Date().toDateString();
  
  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar userRole="staff" />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading attendance data...</p>
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
          <h1 className="dashboard-title">My Attendance</h1>
          <p className="dashboard-subtitle">Track your daily attendance and work hours</p>
        </div>
        
        <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '16px', color: '#333' }}>{todayDate}</h3>
          
          {isCheckedIn ? (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#28a745', fontSize: '18px', marginBottom: '8px' }}>
                ✅ Checked in at {formatTime(todayAttendance?.check_in_time)}
              </p>
              <p style={{ color: '#666' }}>
                You've been working for {todayAttendance ? calculateHours(todayAttendance.check_in_time, new Date()) : '0'} hours
              </p>
            </div>
          ) : hasCheckedOut ? (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#28a745', fontSize: '18px', marginBottom: '8px' }}>
                ✅ Checked out at {formatTime(todayAttendance?.check_out_time)}
              </p>
              <p style={{ color: '#666' }}>
                Total work hours: {calculateHours(todayAttendance?.check_in_time, todayAttendance?.check_out_time)} hours
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#666', fontSize: '18px' }}>
                ⏰ Ready to start your day?
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
            disabled={hasCheckedOut || isSubmitting}
          >
            {isSubmitting ? 'Processing...' :
             hasCheckedOut ? 'Already Checked Out' : 
             isCheckedIn ? '🚪 Check Out' : '⏰ Check In'}
          </button>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#28a745' }}>{stats.thisMonth} days</div>
            <div className="stat-label">This Month</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#007bff' }}>{stats.totalPresent} days</div>
            <div className="stat-label">Total Present</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#ffc107' }}>{stats.lateArrivals} days</div>
            <div className="stat-label">Late Arrivals</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#dc3545' }}>{stats.absentDays} days</div>
            <div className="stat-label">Absent Days</div>
          </div>
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
              {attendanceHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendanceHistory.map((record, index) => (
                  <tr key={index}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{formatTime(record.check_in_time)}</td>
                    <td>{formatTime(record.check_out_time)}</td>
                    <td>{calculateHours(record.check_in_time, record.check_out_time)}h</td>
                    <td>
                      <span className={`status-badge ${
                        getAttendanceStatus(record) === 'Present' ? 'status-present' :
                        getAttendanceStatus(record) === 'Absent' ? 'status-absent' :
                        'status-pending'
                      }`}>
                        {getAttendanceStatus(record)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Attendance Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {stats.totalPresent > 0 ? Math.round((stats.totalPresent / (stats.totalPresent + stats.absentDays)) * 100) : 0}%
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Attendance Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                {attendanceHistory.length > 0 ? 
                  (attendanceHistory.reduce((total, record) => 
                    total + parseFloat(calculateHours(record.check_in_time, record.check_out_time) || 0), 0
                  ) / attendanceHistory.length).toFixed(1) : 0}h
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Avg. Daily Hours</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
                {attendanceHistory.reduce((total, record) => 
                  total + parseFloat(calculateHours(record.check_in_time, record.check_out_time) || 0), 0
                ).toFixed(0)}h
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Total This Month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;
