
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const MyTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Update project documentation', description: 'Review and update the project documentation with latest changes', assignedBy: 'Admin', dueDate: '2023-12-18', priority: 'High', status: 'In Progress' },
    { id: 2, title: 'Review code changes', description: 'Review the pull request #123 and provide feedback', assignedBy: 'Team Lead', dueDate: '2023-12-20', priority: 'Medium', status: 'Pending' },
    { id: 3, title: 'Attend team meeting', description: 'Weekly team standup meeting', assignedBy: 'Admin', dueDate: '2023-12-15', priority: 'Low', status: 'Completed' },
    { id: 4, title: 'Client presentation preparation', description: 'Prepare slides for upcoming client presentation', assignedBy: 'Manager', dueDate: '2023-12-22', priority: 'High', status: 'Pending' },
    { id: 5, title: 'Database optimization', description: 'Optimize database queries for better performance', assignedBy: 'Tech Lead', dueDate: '2023-12-25', priority: 'Medium', status: 'Pending' }
  ]);
  
  const [filter, setFilter] = useState('all');
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status.toLowerCase().replace(' ', '') === filter;
  });
  
  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };
  
  const stats = [
    { label: 'Total Tasks', value: tasks.length.toString() },
    { label: 'Pending', value: tasks.filter(t => t.status === 'Pending').length.toString() },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length.toString() },
    { label: 'Completed', value: tasks.filter(t => t.status === 'Completed').length.toString() }
  ];
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'status-approved';
      case 'In Progress': return 'status-pending';
      default: return 'status-absent';
    }
  };
  
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
          <h1 className="dashboard-title">My Tasks</h1>
          <p className="dashboard-subtitle">Manage your assigned tasks and track progress</p>
        </div>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Task Filters</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter('all')}
                style={{ padding: '6px 12px', fontSize: '14px' }}
              >
                All Tasks
              </button>
              <button 
                className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter('pending')}
                style={{ padding: '6px 12px', fontSize: '14px' }}
              >
                Pending
              </button>
              <button 
                className={`btn ${filter === 'inprogress' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter('inprogress')}
                style={{ padding: '6px 12px', fontSize: '14px' }}
              >
                In Progress
              </button>
              <button 
                className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter('completed')}
                style={{ padding: '6px 12px', fontSize: '14px' }}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredTasks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No tasks found for the selected filter.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{task.title}</h4>
                    <p style={{ margin: '0 0 12px 0', color: '#666', lineHeight: '1.5' }}>
                      {task.description}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#666' }}>
                      <span>👤 Assigned by: <strong>{task.assignedBy}</strong></span>
                      <span>📅 Due: <strong>{new Date(task.dueDate).toLocaleDateString()}</strong></span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className={`status-badge ${getPriorityColor(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                
                {task.status !== 'Completed' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    {task.status === 'Pending' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleStatusChange(task.id, 'In Progress')}
                        style={{ padding: '6px 12px', fontSize: '14px' }}
                      >
                        Start Task
                      </button>
                    )}
                    {task.status === 'In Progress' && (
                      <button 
                        className="btn btn-success"
                        onClick={() => handleStatusChange(task.id, 'Completed')}
                        style={{ padding: '6px 12px', fontSize: '14px' }}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                )}
                
                {task.status === 'Completed' && (
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '8px 12px', 
                    background: '#d4edda', 
                    color: '#155724', 
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}>
                    ✅ Task completed successfully!
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Task Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100)}%
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Completion Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Overdue Tasks</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                {tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>High Priority</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
