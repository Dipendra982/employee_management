
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { apiClient } from '../../lib/api';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    employeeId: '',
    joinDate: '',
    manager: '',
    address: '',
    emergencyContact: ''
  });
  
  const [editData, setEditData] = useState({ ...profileData });
  const [stats, setStats] = useState({
    attendanceRate: '0%',
    tasksCompleted: 0,
    leaveDaysUsed: 0,
    performanceRating: 0.0
  });

  useEffect(() => {
    if (user) {
      const userData = {
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        position: user.position || '',
        employeeId: user.employeeId || '',
        joinDate: user.joinDate || '',
        manager: user.manager || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || ''
      };
      setProfileData(userData);
      setEditData(userData);
      
      // Fetch user statistics
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const userStats = await apiClient.getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast.error('Failed to load user statistics');
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Only send fields that users can edit (username is read-only)
      const updateData = {
        phone: editData.phone,
        address: editData.address,
        emergencyContact: editData.emergencyContact
      };

      const response = await apiClient.updateProfile(updateData);
      
      // Update local state
      setProfileData({ ...profileData, ...updateData });
      setIsEditing(false);
      
      // Update user context if available
      if (setUser && response.user) {
        setUser(response.user);
      }
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
  };
  
  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateYearsOfService = (joinDateString) => {
    if (!joinDateString) return 0;
    const joinDate = new Date(joinDateString);
    const today = new Date();
    const years = Math.floor((today - joinDate) / (365.25 * 24 * 60 * 60 * 1000));
    return Math.max(0, years);
  };

  if (!user) {
    return (
      <div className="dashboard-layout">
        <Sidebar userRole="staff" />
        <div className="main-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Profile</h1>
            <p className="dashboard-subtitle">Loading...</p>
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
          <h1 className="dashboard-title">My Profile</h1>
          <p className="dashboard-subtitle">View and update your personal information</p>
        </div>
        
        <div className="content-grid">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3>Personal Information</h3>
              {!isEditing ? (
                <button className="btn btn-primary" onClick={handleEdit}>
                  ✏️ Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-success" 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? '💾 Saving...' : '💾 Save Changes'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px', color: '#666' }}>
                    {profileData.username} (Read-only)
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px', color: '#666' }}>
                    {profileData.email} (Read-only)
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="form-control"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                      {profileData.phone || 'Not set'}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px', color: '#666' }}>
                    {profileData.department || 'Not assigned'} (Read-only)
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Position</label>
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px', color: '#666' }}>
                    {profileData.position || 'Not assigned'} (Read-only)
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Employee ID</label>
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px', color: '#666' }}>
                    {profileData.employeeId || 'Not assigned'} (Read-only)
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Address</label>
                {isEditing ? (
                  <textarea
                    className="form-control"
                    rows="2"
                    value={editData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address"
                  />
                ) : (
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                    {profileData.address || 'Not set'}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Name - Phone Number"
                  />
                ) : (
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                    {profileData.emergencyContact || 'Not set'}
                  </div>
                )}
              </div>
            </form>
          </div>
          
          <div>
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '16px' }}>Employment Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Join Date:</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {formatDate(profileData.joinDate)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Manager:</span>
                  <span style={{ fontWeight: 'bold' }}>{profileData.manager || 'Not assigned'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Years of Service:</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {calculateYearsOfService(profileData.joinDate)} years
                  </span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="action-btn">🔒 Change Password</button>
                <button className="action-btn">📱 Update 2FA Settings</button>
                <button className="action-btn">📄 Download Profile Summary</button>
                <button className="action-btn">📧 Update Notification Preferences</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Account Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{stats.attendanceRate}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Attendance Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{stats.tasksCompleted}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Tasks Completed</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>{stats.leaveDaysUsed}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Leave Days Used</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>{stats.performanceRating}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Performance Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
