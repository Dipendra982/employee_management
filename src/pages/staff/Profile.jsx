
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Information Technology',
    position: 'Software Developer',
    employeeId: 'EMP001',
    joinDate: '2022-03-15',
    manager: 'Jane Smith',
    address: '123 Main Street, City, State 12345',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543'
  });
  
  const [editData, setEditData] = useState({ ...profileData });
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    setProfileData({ ...editData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
  };
  
  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };
  
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
                  <button className="btn btn-success" onClick={handleSave}>
                    💾 Save Changes
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                    />
                  ) : (
                    <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                      {profileData.fullName}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="form-control"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  ) : (
                    <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                      {profileData.email}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="form-control"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  ) : (
                    <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                      {profileData.phone}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px', color: '#666' }}>
                    {profileData.department} (Read-only)
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Position</label>
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px', color: '#666' }}>
                    {profileData.position} (Read-only)
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Employee ID</label>
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px', color: '#666' }}>
                    {profileData.employeeId} (Read-only)
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
                    required
                  />
                ) : (
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                    {profileData.address}
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
                    required
                  />
                ) : (
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                    {profileData.emergencyContact}
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
                    {new Date(profileData.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Manager:</span>
                  <span style={{ fontWeight: 'bold' }}>{profileData.manager}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Years of Service:</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {Math.floor((new Date() - new Date(profileData.joinDate)) / (365.25 * 24 * 60 * 60 * 1000))} years
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
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>92%</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Attendance Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>15</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Tasks Completed</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>8</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Leave Days Used</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>4.8</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Performance Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
