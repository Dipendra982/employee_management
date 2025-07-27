import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiClient } from '../../lib/api';
import '../../styles/dashboard.css';

const ApplyLeave = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({
    total: 20,
    used: 0,
    remaining: 20
  });
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newApplication, setNewApplication] = useState({
    leave_type: 'sick',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const leaveTypes = ['sick', 'casual', 'annual', 'maternity', 'paternity', 'other'];
  
  // Fetch leave data on component mount
  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/leaves');
      const { leaves, leaveBalance: balance } = response;
      
      setLeaveApplications(leaves || []);
      if (balance) {
        setLeaveBalance(balance);
      }
    } catch (error) {
      console.error('Error fetching leave data:', error);
      alert('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };
  
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const applicationData = {
        ...newApplication,
        total_days: calculateDays(newApplication.start_date, newApplication.end_date)
      };
      
      await apiClient.post('/leaves/apply', applicationData);
      
      // Reset form and refresh data
      setNewApplication({ 
        leave_type: 'sick', 
        start_date: '', 
        end_date: '', 
        reason: '' 
      });
      setShowApplicationForm(false);
      alert('Leave application submitted successfully!');
      
      // Refresh leave data
      await fetchLeaveData();
    } catch (error) {
      console.error('Error submitting leave application:', error);
      alert(error.response?.data?.error || 'Failed to submit leave application');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };
  
  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar userRole="staff" />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading leave data...</p>
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
          <h1 className="dashboard-title">Apply for Leave</h1>
          <p className="dashboard-subtitle">Submit leave requests and track your applications</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#007bff' }}>{leaveBalance.total}</div>
            <div className="stat-label">Total Leave Days</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#dc3545' }}>{leaveBalance.used}</div>
            <div className="stat-label">Used This Year</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#28a745' }}>{leaveBalance.remaining}</div>
            <div className="stat-label">Remaining Days</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#ffc107' }}>{leaveApplications.filter(l => l.status === 'pending').length}</div>
            <div className="stat-label">Pending Requests</div>
          </div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowApplicationForm(!showApplicationForm)}
          >
            {showApplicationForm ? 'Cancel Application' : '+ Apply for Leave'}
          </button>
        </div>
        
        {showApplicationForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '20px' }}>New Leave Application</h3>
            <form onSubmit={handleSubmitApplication}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Leave Type</label>
                  <select
                    className="form-control"
                    value={newApplication.leave_type}
                    onChange={(e) => setNewApplication({...newApplication, leave_type: e.target.value})}
                    required
                  >
                    {leaveTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newApplication.start_date}
                    onChange={(e) => setNewApplication({...newApplication, start_date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newApplication.end_date}
                    onChange={(e) => setNewApplication({...newApplication, end_date: e.target.value})}
                    min={newApplication.start_date || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Total Days</label>
                  <input
                    type="text"
                    className="form-control"
                    value={calculateDays(newApplication.start_date, newApplication.end_date) || '0'}
                    readOnly
                    style={{ background: '#f8f9fa' }}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Reason for Leave</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newApplication.reason}
                  onChange={(e) => setNewApplication({...newApplication, reason: e.target.value})}
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
        
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">My Leave Applications</h3>
          </div>
          
          {leaveApplications.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              <p>No leave applications yet.</p>
              <p>Click "Apply for Leave" to submit your first request.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveApplications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.leave_type?.charAt(0).toUpperCase() + application.leave_type?.slice(1)}</td>
                    <td>{formatDate(application.start_date)}</td>
                    <td>{formatDate(application.end_date)}</td>
                    <td>{application.total_days}</td>
                    <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>{application.reason}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(application.status)}`}>
                        {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Leave Policy Guidelines</h3>
          <div style={{ color: '#666', lineHeight: '1.6' }}>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Submit leave requests at least 3 days in advance for planned leave</li>
              <li>Emergency leave can be applied on the same day with proper justification</li>
              <li>Annual leave quota is 20 days per calendar year</li>
              <li>Sick leave requires medical certificate for more than 2 consecutive days</li>
              <li>Leave approval is subject to work requirements and team availability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
