
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiClient } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { icon: '👥', number: '0', label: 'Total Staff' },
    { icon: '✅', number: '0', label: 'Present Today' },
    { icon: '📋', number: '0', label: 'Pending Tasks' },
    { icon: '📄', number: '0', label: 'Leave Requests' }
  ]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Initialize data arrays to prevent undefined errors
      let usersData = [];
      let attendanceData = [];
      let leavesData = [];
      
      // Fetch leave requests first (this should work)
      try {
        const leavesResponse = await apiClient.get('/leaves');
        leavesData = leavesResponse.leaves || leavesResponse.data || leavesResponse || [];
      } catch (leaveError) {
        console.warn('Failed to fetch leaves:', leaveError.message);
      }
      
      // Try to fetch users, but handle errors gracefully
      try {
        const usersResponse = await apiClient.get('/users');
        usersData = usersResponse.data || usersResponse.users || usersResponse || [];
      } catch (userError) {
        console.warn('Failed to fetch users:', userError.message);
        // Continue without user data
      }
      
      // Try to fetch attendance data
      try {
        const attendanceResponse = await apiClient.get('/attendance');
        attendanceData = attendanceResponse.data || attendanceResponse || [];
      } catch (attendanceError) {
        console.warn('Failed to fetch attendance:', attendanceError.message);
        // Continue without attendance data
      }
      
      // Calculate stats with null checks
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = (attendanceData || []).filter(record => record.date === today);
      const presentToday = todayAttendance.filter(record => record.status === 'present' || record.status === 'late').length;
      const pendingLeaveRequests = (leavesData || []).filter(leave => leave.status === 'pending');
      
      setStats([
        { icon: '👥', number: (usersData || []).length.toString(), label: 'Total Staff' },
        { icon: '✅', number: presentToday.toString(), label: 'Present Today' },
        { icon: '📋', number: '0', label: 'Pending Tasks' }, // TODO: Add tasks API
        { icon: '📄', number: (pendingLeaveRequests || []).length.toString(), label: 'Leave Requests' }
      ]);
      
      // Set recent attendance (today's records) with null checks
      setRecentAttendance((todayAttendance || []).slice(0, 5).map(record => ({
        name: record.user?.username || record.username || 'Unknown',
        status: record.status === 'present' ? 'Present' : record.status === 'late' ? 'Late' : 'Absent',
        time: record.check_in ? new Date(`2000-01-01T${record.check_in}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'
      })));
      
      // Set pending leaves
      setPendingLeaves(pendingLeaveRequests.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load some dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveAction = async (leaveId, action) => {
    try {
      await apiClient.put(`/leaves/${leaveId}/status`, {
        status: action,
        admin_notes: `${action} by admin`
      });
      
      toast.success(`Leave request ${action} successfully`);
      
      // Refresh data
      await fetchDashboardData();
      
    } catch (error) {
      console.error(`Error ${action} leave:`, error);
      toast.error(`Failed to ${action} leave request`);
    }
  };
  
  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar userRole="admin" />
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
                {recentAttendance.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                      No attendance records for today
                    </td>
                  </tr>
                ) : (
                  recentAttendance.map((record, index) => (
                    <tr key={index}>
                      <td>{record.name}</td>
                      <td>
                        <span className={`status-badge ${
                          record.status === 'Present' ? 'status-present' :
                          record.status === 'Late' ? 'status-pending' :
                          'status-absent'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td>{record.time}</td>
                    </tr>
                  ))
                )}
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
              {pendingLeaves.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No pending leave requests
                  </td>
                </tr>
              ) : (
                pendingLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.user?.username || 'Unknown'}</td>
                    <td>{leave.leave_type?.charAt(0).toUpperCase() + leave.leave_type?.slice(1)}</td>
                    <td>{new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}</td>
                    <td>
                      <span className="status-badge status-pending">{leave.status}</span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-success" 
                        style={{ marginRight: '8px', padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => handleLeaveAction(leave.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => handleLeaveAction(leave.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
