import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiClient } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/dashboard.css';

const StaffNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, urgent: 0, important: 0 });
  const { toast } = useToast();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/notices');
      setNotices(response.notices || []);
      setStats(response.stats || { total: 0, thisMonth: 0, urgent: 0, important: 0 });
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
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

  const statsCards = [
    { label: 'Total Notices', value: stats.total.toString() },
    { label: 'This Month', value: stats.thisMonth.toString() },
    { label: 'Urgent', value: stats.urgent.toString() },
    { label: 'Important', value: stats.important.toString() }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar userRole="staff" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Company Notices</h1>
          <p className="dashboard-subtitle">Stay updated with company announcements and important information</p>
        </div>
        
        <div className="stats-grid">
          {statsCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>All Notices ({notices.length})</h3>
          </div>
          
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              Loading notices...
            </p>
          ) : notices.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No notices available at the moment.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {notices.map((notice) => (
                <div key={notice.id} style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '20px',
                  background: '#f8f9fa',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '18px' }}>
                        {notice.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          📅 {new Date(notice.publish_date || notice.created_at).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          👤 By: {notice.publisher?.username || 'Admin'}
                        </span>
                        <span className={`status-badge ${getTypeColor(notice.type)}`}>
                          {formatType(notice.type)}
                        </span>
                        {notice.target_audience !== 'all' && (
                          <span className="status-badge status-approved">
                            {notice.target_audience === 'staff' ? 'Staff Only' : 'Admin Only'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '16px',
                    background: '#fff',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef'
                  }}>
                    <p style={{ 
                      margin: '0', 
                      lineHeight: '1.6', 
                      color: '#333',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {notice.content}
                    </p>
                  </div>
                  
                  {notice.expiry_date && new Date(notice.expiry_date) > new Date() && (
                    <div style={{ 
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: '#fff3cd',
                      color: '#856404',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}>
                      ⏰ Expires on: {new Date(notice.expiry_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffNotices;
