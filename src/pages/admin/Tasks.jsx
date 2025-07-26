
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/dashboard.css';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Update website content', assignedTo: 'John Doe', priority: 'High', dueDate: '2023-12-20', status: 'In Progress' },
    { id: 2, title: 'Prepare monthly report', assignedTo: 'Jane Smith', priority: 'Medium', dueDate: '2023-12-18', status: 'Completed' },
    { id: 3, title: 'Client meeting preparation', assignedTo: 'Mike Johnson', priority: 'High', dueDate: '2023-12-16', status: 'Pending' },
    { id: 4, title: 'Database backup', assignedTo: 'Sarah Williams', priority: 'Low', dueDate: '2023-12-22', status: 'Pending' }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
    description: ''
  });
  
  const staffMembers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Tom Wilson'];
  
  const handleAddTask = (e) => {
    e.preventDefault();
    const task = {
      id: Date.now(),
      ...newTask,
      status: 'Pending'
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', assignedTo: '', priority: 'Medium', dueDate: '', description: '' });
    setShowAddForm(false);
  };
  
  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };
  
  const stats = [
    { label: 'Total Tasks', value: tasks.length.toString() },
    { label: 'Pending', value: tasks.filter(t => t.status === 'Pending').length.toString() },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length.toString() },
    { label: 'Completed', value: tasks.filter(t => t.status === 'Completed').length.toString() }
  ];
  
  return (
    <div className="dashboard-layout">
      <Sidebar userRole="admin" />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Task Assignment</h1>
          <p className="dashboard-subtitle">Assign and manage tasks for your team</p>
        </div>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Assign New Task'}
          </button>
        </div>
        
        {showAddForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '20px' }}>Assign New Task</h3>
            <form onSubmit={handleAddTask}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select
                    className="form-control"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    required
                  >
                    <option value="">Select Staff Member</option>
                    {staffMembers.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-control"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Task description and requirements..."
                />
              </div>
              <button type="submit" className="btn btn-success">Assign Task</button>
            </form>
          </div>
        )}
        
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Current Tasks</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.assignedTo}</td>
                  <td>
                    <span className={`status-badge ${
                      task.priority === 'High' ? 'status-rejected' :
                      task.priority === 'Medium' ? 'status-pending' :
                      'status-approved'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${
                      task.status === 'Completed' ? 'status-approved' :
                      task.status === 'In Progress' ? 'status-pending' :
                      'status-absent'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
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

export default AdminTasks;
