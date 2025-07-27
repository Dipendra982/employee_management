
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/sidebar.css';

const Sidebar = ({ userRole = 'admin' }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const adminMenuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/staff', icon: '👥', label: 'Staff Management' },
    { path: '/admin/attendance', icon: '📅', label: 'Attendance' },
    { path: '/admin/leaves', icon: '🛌', label: 'Leave Requests' },
    { path: '/admin/tasks', icon: '✅', label: 'Task Assignment' },
    { path: '/admin/notices', icon: '📢', label: 'Notices' },
    { path: '/admin/reports', icon: '🧾', label: 'Reports' }
  ];
  
  const staffMenuItems = [
    { path: '/staff/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/staff/attendance', icon: '📅', label: 'My Attendance' },
    { path: '/staff/leaves', icon: '🛌', label: 'Apply Leave' },
    { path: '/staff/tasks', icon: '✅', label: 'My Tasks' },
    { path: '/staff/notices', icon: '📢', label: 'Notices' },
    { path: '/staff/profile', icon: '👤', label: 'Profile' }
  ];
  
  const menuItems = userRole === 'admin' ? adminMenuItems : staffMenuItems;
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>WorkNest</h2>
        <p>{userRole === 'admin' ? 'Admin Panel' : 'Staff Portal'}</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.path} className="nav-item">
            <Link 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          </div>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
