
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const StaffManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', department: 'IT', position: 'Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'HR', position: 'Manager', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', department: 'Marketing', position: 'Specialist', status: 'Active' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@company.com', department: 'Finance', position: 'Analyst', status: 'Active' }
  ]);
  
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    department: '',
    position: ''
  });
  
  const handleAddStaff = (e) => {
    e.preventDefault();
    const staff = {
      id: Date.now(),
      ...newStaff,
      status: 'Active'
    };
    setStaffList([...staffList, staff]);
    setNewStaff({ name: '', email: '', department: '', position: '' });
    setShowAddForm(false);
  };
  
  const handleDeleteStaff = (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaffList(staffList.filter(staff => staff.id !== id));
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
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
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
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Position</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newStaff.position}
                    onChange={(e) => setNewStaff({...newStaff, position: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success">Add Staff Member</button>
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
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.name}</td>
                  <td>{staff.email}</td>
                  <td>{staff.department}</td>
                  <td>{staff.position}</td>
                  <td>
                    <span className="status-badge status-present">{staff.status}</span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={() => handleDeleteStaff(staff.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
