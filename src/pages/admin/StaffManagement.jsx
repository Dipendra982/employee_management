
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiClient } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/dashboard.css';

const StaffManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [newStaff, setNewStaff] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff'
  });

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users');
      setStaffList(response.data || []);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      toast.error('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddStaff = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      await apiClient.post('/auth/register', newStaff);
      
      toast.success('Staff member added successfully!');
      setNewStaff({ username: '', email: '', password: '', role: 'staff' });
      setShowAddForm(false);
      
      // Refresh staff list
      await fetchStaffData();
      
    } catch (error) {
      console.error('Error adding staff:', error);
      toast.error(error.response?.data?.message || 'Failed to add staff member');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteStaff = async (id, username) => {
    if (window.confirm(`Are you sure you want to remove ${username}? This action cannot be undone.`)) {
      try {
        await apiClient.delete(`/users/${id}`);
        toast.success('Staff member removed successfully!');
        
        // Refresh staff list
        await fetchStaffData();
        
      } catch (error) {
        console.error('Error removing staff:', error);
        if (error.message.includes('Access denied')) {
          toast.error('Access denied. Admin privileges required.');
        } else if (error.message.includes('not found')) {
          toast.error('Staff member not found.');
        } else {
          toast.error(error.message || 'Failed to remove staff member');
        }
      }
    }
  };
  
  return (
    <div className="dashboard-layout">
      <Sidebar userRole="admin" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Staff Management</h1>
          <p className="dashboard-subtitle">Manage your team members and their information</p>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add New Staff'}
          </button>
        </div>
        
        {showAddForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '20px' }}>Add New Staff Member</h3>
            <form onSubmit={handleAddStaff}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newStaff.username}
                    onChange={(e) => setNewStaff({...newStaff, username: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-control"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                    required
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Staff Member'}
              </button>
            </form>
          </div>
        )}
        
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Current Staff Members ({staffList.length})</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Loading staff data...
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No staff members found
                  </td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.username}</td>
                    <td>{staff.email}</td>
                    <td>
                      <span className={`status-badge ${
                        staff.role === 'admin' ? 'status-pending' : 'status-approved'
                      }`}>
                        {staff.role?.charAt(0).toUpperCase() + staff.role?.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(staff.created_at || staff.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="status-badge status-present">Active</span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => handleDeleteStaff(staff.id, staff.username)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
