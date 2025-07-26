
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const AdminNotices = () => {
  const [notices, setNotices] = useState([
    { id: 1, title: 'Holiday Schedule Update', content: 'Please note the updated holiday schedule for December 2023...', date: '2023-12-10', priority: 'High' },
    { id: 2, title: 'New Security Protocols', content: 'We are implementing new security measures starting next week...', date: '2023-12-08', priority: 'Medium' },
    { id: 3, title: 'Team Building Event', content: 'Join us for our annual team building event on December 22nd...', date: '2023-12-05', priority: 'Low' }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    priority: 'Medium'
  });
  
  const handleAddNotice = (e) => {
    e.preventDefault();
    const notice = {
      id: Date.now(),
      ...newNotice,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices([notice, ...notices]);
    setNewNotice({ title: '', content: '', priority: 'Medium' });
    setShowAddForm(false);
  };
  
  const handleDeleteNotice = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      setNotices(notices.filter(notice => notice.id !== id));
    }
  };
  
  return (
    <div className="dashboard-layout">
      <Sidebar userRole="admin" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Notices & Announcements</h1>
          <p className="dashboard-subtitle">Post and manage company-wide announcements</p>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Post New Notice'}
          </button>
        </div>
        
        {showAddForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '20px' }}>Post New Notice</h3>
            <form onSubmit={handleAddNotice}>
              <div className="form-group">
                <label className="form-label">Notice Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  placeholder="Enter notice title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <select
                  className="form-control"
                  value={newNotice.priority}
                  onChange={(e) => setNewNotice({...newNotice, priority: e.target.value})}
                  style={{ width: '200px' }}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Notice Content</label>
                <textarea
                  className="form-control"
                  rows="5"
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                  placeholder="Enter the full notice content here..."
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-success">Post Notice</button>
            </form>
          </div>
        )}
        
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Published Notices ({notices.length})</h3>
          
          {notices.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No notices posted yet. Click "Post New Notice" to add one.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {notices.map((notice) => (
                <div key={notice.id} style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '20px',
                  background: '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{notice.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          Posted on {new Date(notice.date).toLocaleDateString()}
                        </span>
                        <span className={`status-badge ${
                          notice.priority === 'High' ? 'status-rejected' :
                          notice.priority === 'Medium' ? 'status-pending' :
                          'status-approved'
                        }`}>
                          {notice.priority} Priority
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={() => handleDeleteNotice(notice.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <p style={{ 
                    margin: '0', 
                    lineHeight: '1.6', 
                    color: '#555',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotices;
