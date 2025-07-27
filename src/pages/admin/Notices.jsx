
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiClient } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/dashboard.css';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({ total: 0, published: 0, urgent: 0, important: 0 });
  const { toast } = useToast();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    type: 'general',
    target_audience: 'all',
    priority: 1
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/notices');
      setNotices(response.notices || []);
      setStats(response.stats || { total: 0, published: 0, urgent: 0, important: 0 });
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddNotice = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      await apiClient.post('/notices', newNotice);
      
      toast.success('Notice posted successfully!');
      setNewNotice({ title: '', content: '', type: 'general', target_audience: 'all', priority: 1 });
      setShowAddForm(false);
      
      // Refresh notices
      await fetchNotices();
      
    } catch (error) {
      console.error('Error creating notice:', error);
      toast.error(error.response?.data?.error || 'Failed to post notice');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteNotice = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await apiClient.delete(`/notices/${id}`);
        toast.success('Notice deleted successfully!');
        
        // Refresh notices
        await fetchNotices();
        
      } catch (error) {
        console.error('Error deleting notice:', error);
        toast.error('Failed to delete notice');
      }
    }
  };

  const formatType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'urgent': return 'status-rejected';
      case 'important': return 'status-pending';
      case 'announcement': return 'status-approved';
      default: return 'status-present';
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
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#007bff' }}>{stats.total}</div>
            <div className="stat-label">Total Notices</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#28a745' }}>{stats.published}</div>
            <div className="stat-label">Published</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#dc3545' }}>{stats.urgent}</div>
            <div className="stat-label">Urgent</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#ffc107' }}>{stats.important}</div>
            <div className="stat-label">Important</div>
          </div>
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
                <label className="form-label">Notice Type</label>
                <select
                  className="form-control"
                  value={newNotice.type}
                  onChange={(e) => setNewNotice({...newNotice, type: e.target.value})}
                  style={{ width: '200px' }}
                >
                  <option value="general">General</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select
                  className="form-control"
                  value={newNotice.target_audience}
                  onChange={(e) => setNewNotice({...newNotice, target_audience: e.target.value})}
                  style={{ width: '200px' }}
                >
                  <option value="all">All Staff</option>
                  <option value="admin">Admin Only</option>
                  <option value="staff">Staff Only</option>
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
              
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Notice'}
              </button>
            </form>
          </div>
        )}
        
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Published Notices ({notices.length})</h3>
          
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              Loading notices...
            </p>
          ) : notices.length === 0 ? (
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          Posted on {new Date(notice.publish_date || notice.created_at).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          By: {notice.publisher?.username || 'Unknown'}
                        </span>
                        <span className={`status-badge ${getTypeColor(notice.type)}`}>
                          {formatType(notice.type)}
                        </span>
                        <span className="status-badge status-approved">
                          {notice.target_audience === 'all' ? 'All Staff' : 
                           notice.target_audience === 'admin' ? 'Admin Only' : 'Staff Only'}
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={() => handleDeleteNotice(notice.id, notice.title)}
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
