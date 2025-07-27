
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiClient } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/dashboard.css';

const AdminLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/leaves');
      setLeaveRequests(response.leaves || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLeaveAction = async (id, action) => {
    try {
      await apiClient.put(`/leaves/${id}/status`, {
        status: action,
        admin_notes: `${action} by admin`
      });
      
      toast.success(`Leave request ${action} successfully`);
      
      // Refresh the data
      await fetchLeaveRequests();
      
    } catch (error) {
      console.error(`Error ${action} leave:`, error);
      toast.error(`Failed to ${action} leave request`);
    }
  };
  
  const stats = [
    { label: 'Total Requests', value: leaveRequests.length.toString() },
    { label: 'Pending', value: leaveRequests.filter(l => l.status === 'pending').length.toString() },
    { label: 'Approved', value: leaveRequests.filter(l => l.status === 'approved').length.toString() },
    { label: 'Rejected', value: leaveRequests.filter(l => l.status === 'rejected').length.toString() }
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
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                    Loading leave requests...
                  </td>
                </tr>
              ) : leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No leave requests found
                  </td>
                </tr>
              ) : (
                leaveRequests.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.user?.username || 'Unknown'}</td>
                    <td>{leave.leave_type?.charAt(0).toUpperCase() + leave.leave_type?.slice(1)}</td>
                    <td>{new Date(leave.start_date).toLocaleDateString()}</td>
                    <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                    <td>{leave.total_days}</td>
                    <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>{leave.reason}</td>
                    <td>
                      <span className={`status-badge ${
                        leave.status === 'approved' ? 'status-approved' :
                        leave.status === 'rejected' ? 'status-rejected' :
                        'status-pending'
                      }`}>
                        {leave.status?.charAt(0).toUpperCase() + leave.status?.slice(1)}
                      </span>
                    </td>
                    <td>
                      {leave.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-success"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
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
                        </div>
                      )}
                      {leave.status !== 'pending' && (
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          {leave.status === 'approved' ? '✓ Processed' : '✗ Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
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
