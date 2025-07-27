
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiClient } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/dashboard.css';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/tasks');
      setTasks(response.tasks || []);
      setStats(response.stats || { total: 0, pending: 0, inProgress: 0, completed: 0 });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'inprogress') return task.status === 'in-progress';
    return task.status === filter;
  });
  
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await apiClient.put(`/tasks/${taskId}/status`, { status: newStatus });
      toast.success('Task status updated successfully!');
      
      // Refresh tasks
      await fetchTasks();
      
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatStatus = (status) => {
    if (status === 'in-progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const statsCards = [
    { label: 'Total Tasks', value: stats.total.toString() },
    { label: 'Pending', value: stats.pending.toString() },
    { label: 'In Progress', value: stats.inProgress.toString() },
    { label: 'Completed', value: stats.completed.toString() }
  ];
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'status-approved';
      case 'in-progress': return 'status-pending';
      default: return 'status-absent';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high':
      case 'urgent': return 'status-rejected';
      case 'medium': return 'status-pending';
      default: return 'status-approved';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar userRole="staff" />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Loading tasks...
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
          <h1 className="dashboard-title">My Tasks</h1>
          <p className="dashboard-subtitle">Manage your assigned tasks and track progress</p>
        </div>
        
        <div className="stats-grid">
          {statsCards.map((stat, index) => (
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
                      {task.description || 'No description provided'}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#666' }}>
                      <span>👤 Assigned by: <strong>{task.assigner?.username || 'Unknown'}</strong></span>
                      <span>📅 Due: <strong>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</strong></span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className={`status-badge ${getPriorityColor(task.priority)}`}>
                      {formatPriority(task.priority)} Priority
                    </span>
                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                      {formatStatus(task.status)}
                    </span>
                  </div>
                </div>
                
                {task.status !== 'completed' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    {task.status === 'pending' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleStatusChange(task.id, 'in-progress')}
                        style={{ padding: '6px 12px', fontSize: '14px' }}
                      >
                        Start Task
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <button 
                        className="btn btn-success"
                        onClick={() => handleStatusChange(task.id, 'completed')}
                        style={{ padding: '6px 12px', fontSize: '14px' }}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                )}
                
                {task.status === 'completed' && (
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
