
import React from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const StaffNotices = () => {
  const notices = [
    {
      id: 1,
      title: 'Holiday Schedule Update',
      content: 'Please note the updated holiday schedule for December 2023. The office will be closed from December 25th to January 1st. All pending work should be completed before December 22nd. Emergency contacts will be available during the holiday period.',
      date: '2023-12-10',
      priority: 'High',
      author: 'HR Department'
    },
    {
      id: 2,
      title: 'New Security Protocols',
      content: 'We are implementing new security measures starting next week. All employees must update their passwords and enable two-factor authentication. Please attend the security briefing scheduled for December 15th at 2:00 PM in the main conference room.',
      date: '2023-12-08',
      priority: 'Medium',
      author: 'IT Security Team'
    },
    {
      id: 3,
      title: 'Team Building Event',
      content: 'Join us for our annual team building event on December 22nd at Central Park. Activities include team games, lunch, and awards ceremony. Please confirm your attendance by December 18th. Dress code: casual outdoor attire.',
      date: '2023-12-05',
      priority: 'Low',
      author: 'Admin'
    },
    {
      id: 4,
      title: 'Performance Review Process',
      content: 'The annual performance review process will begin on January 2nd, 2024. Please complete your self-assessment forms by January 15th. Review meetings will be scheduled throughout January. Contact HR for any questions about the process.',
      date: '2023-12-03',
      priority: 'Medium',
      author: 'HR Department'
    },
    {
      id: 5,
      title: 'Office Renovation Notice',
      content: 'The 3rd floor will undergo renovation from January 8-12, 2024. Affected departments will be temporarily relocated to the 2nd floor. Please coordinate with your managers for seating arrangements. We apologize for any inconvenience.',
      date: '2023-12-01',
      priority: 'High',
      author: 'Facilities Management'
    }
  ];
  
  const stats = [
    { label: 'Total Notices', value: notices.length.toString() },
    { label: 'High Priority', value: notices.filter(n => n.priority === 'High').length.toString() },
    { label: 'This Month', value: notices.filter(n => new Date(n.date).getMonth() === new Date().getMonth()).length.toString() },
    { label: 'Unread', value: '2' } // Mock unread count
  ];
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'status-rejected';
      case 'Medium': return 'status-pending';
      default: return 'status-approved';
    }
  };
  
  return (
    <div className="dashboard-layout">
      <Sidebar userRole="staff" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Company Notices</h1>
          <p className="dashboard-subtitle">Stay updated with company announcements and important information</p>
        </div>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>All Notices</h3>
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '14px' }}>
              Mark All as Read
            </button>
          </div>
          
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
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '18px' }}>
                      {notice.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        📅 {new Date(notice.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        👤 {notice.author}
                      </span>
                      <span className={`status-badge ${getPriorityColor(notice.priority)}`}>
                        {notice.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>
                
                <p style={{ 
                  margin: '0', 
                  lineHeight: '1.6', 
                  color: '#555',
                  fontSize: '16px'
                }}>
                  {notice.content}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #dee2e6'
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }}>
                      Mark as Read
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>
                      Save for Later
                    </button>
                  </div>
                  
                  {notice.priority === 'High' && (
                    <div style={{ 
                      color: '#dc3545', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      ⚠️ Action Required
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Notice Categories</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ 
              padding: '16px', 
              background: '#e3f2fd', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📢</div>
              <div style={{ fontWeight: 'bold', color: '#1976d2' }}>General</div>
            </div>
            <div style={{ 
              padding: '16px', 
              background: '#f3e5f5', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏢</div>
              <div style={{ fontWeight: 'bold', color: '#7b1fa2' }}>HR</div>
            </div>
            <div style={{ 
              padding: '16px', 
              background: '#e8f5e8', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💻</div>
              <div style={{ fontWeight: 'bold', color: '#388e3c' }}>IT</div>
            </div>
            <div style={{ 
              padding: '16px', 
              background: '#fff3e0', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</div>
              <div style={{ fontWeight: 'bold', color: '#f57c00' }}>Events</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffNotices;
