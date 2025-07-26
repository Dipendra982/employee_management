
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const ApplyLeave = () => {
  const [leaveApplications, setLeaveApplications] = useState([
    { id: 1, type: 'Sick Leave', startDate: '2023-11-15', endDate: '2023-11-16', days: 2, reason: 'Medical appointment', status: 'Approved' },
    { id: 2, type: 'Personal', startDate: '2023-10-20', endDate: '2023-10-20', days: 1, reason: 'Personal work', status: 'Approved' },
    { id: 3, type: 'Vacation', startDate: '2023-12-25', endDate: '2023-12-29', days: 5, reason: 'Christmas holidays', status: 'Pending' }
  ]);
  
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [newApplication, setNewApplication] = useState({
    type: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  
  const leaveTypes = ['Sick Leave', 'Vacation', 'Personal', 'Emergency', 'Maternity/Paternity'];
  
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };
  
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    
    const days = calculateDays(newApplication.startDate, newApplication.endDate);
    const application = {
      id: Date.now(),
      ...newApplication,
      days,
      status: 'Pending'
    };
    
    setLeaveApplications([application, ...leaveApplications]);
    setNewApplication({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
    setShowApplicationForm(false);
    alert('Leave application submitted successfully!');
  };
  
  const leaveBalance = {
    total: 20,
    used: 8,
    remaining: 12
  };
  
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
            <div className="stat-number" style={{ color: '#ffc107' }}>{leaveApplications.filter(l => l.status === 'Pending').length}</div>
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
                    value={newApplication.type}
                    onChange={(e) => setNewApplication({...newApplication, type: e.target.value})}
                    required
                  >
                    {leaveTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newApplication.startDate}
                    onChange={(e) => setNewApplication({...newApplication, startDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newApplication.endDate}
                    onChange={(e) => setNewApplication({...newApplication, endDate: e.target.value})}
                    min={newApplication.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Total Days</label>
                  <input
                    type="text"
                    className="form-control"
                    value={calculateDays(newApplication.startDate, newApplication.endDate) || '0'}
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
              
              <button type="submit" className="btn btn-success">Submit Application</button>
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
                    <td>{application.type}</td>
                    <td>{new Date(application.startDate).toLocaleDateString()}</td>
                    <td>{new Date(application.endDate).toLocaleDateString()}</td>
                    <td>{application.days}</td>
                    <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>{application.reason}</td>
                    <td>
                      <span className={`status-badge ${
                        application.status === 'Approved' ? 'status-approved' :
                        application.status === 'Rejected' ? 'status-rejected' :
                        'status-pending'
                      }`}>
                        {application.status}
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
