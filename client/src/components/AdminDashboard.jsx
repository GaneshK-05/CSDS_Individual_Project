import { useState, useEffect } from 'react'
import authService from '../services/authService'
import taskService from '../services/taskService'
import submissionService from '../services/submissionService'
import { showToast } from '../utils/toast'
import './AdminDashboard.css'

export default function AdminDashboard({ onLogout }) {
  const [user, setUser] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    deadline: '',
    allowedFileTypes: ['PDF', 'DOC', 'DOCX'],
    maxFileSize: 10,
    submissionType: 'Both'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getUser()
    setUser(currentUser)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [analyticsData, tasksData] = await Promise.all([
        submissionService.getAnalytics(),
        taskService.getAllTasks()
      ])
      setAnalytics(analyticsData)
      setTasks(tasksData)
    } catch (err) {
      showToast.error('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, formData)
        showToast.success('Task updated successfully')
      } else {
        await taskService.createTask(formData)
        showToast.success('Task created successfully')
      }
      setShowTaskForm(false)
      setEditingTask(null)
      loadData()
      resetForm()
    } catch (err) {
      showToast.error(err.message)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      subject: task.subject,
      description: task.description,
      deadline: task.deadline.split('T')[0],
      allowedFileTypes: task.allowedFileTypes,
      maxFileSize: task.maxFileSize,
      submissionType: task.submissionType
    })
    setShowTaskForm(true)
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId)
        showToast.success('Task deleted successfully')
        loadData()
      } catch (err) {
        showToast.error(err.message)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      description: '',
      deadline: '',
      allowedFileTypes: ['PDF', 'DOC', 'DOCX'],
      maxFileSize: 10,
      submissionType: 'Both'
    })
  }

  const handleLogout = () => {
    authService.logout()
    onLogout()
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Chart data
  const pieChartData = analytics ? {
    labels: ['On Time', 'Late', 'Missing'],
    datasets: [{
      data: [
        analytics.summary.onTimeSubmissions || 0,
        analytics.summary.lateSubmissions || 0,
        analytics.summary.missingSubmissions || 0
      ],
      backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
      borderColor: ['#059669', '#dc2626', '#d97706'],
      borderWidth: 2
    }]
  } : null

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="logo">⏰ CSDS - Admin</h1>
          <nav className="header-nav">
            <div className="user-greeting">
              Welcome, <strong>{user?.name}</strong>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Analytics Cards */}
          {analytics && (
            <div className="analytics-section">
              <h2>Dashboard Overview</h2>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="card-icon">📋</div>
                  <div className="card-content">
                    <div className="card-value">{analytics.summary.totalTasks}</div>
                    <div className="card-label">Total Tasks</div>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="card-icon">👥</div>
                  <div className="card-content">
                    <div className="card-value">{analytics.summary.totalUsers}</div>
                    <div className="card-label">Users</div>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="card-icon">✓</div>
                  <div className="card-content">
                    <div className="card-value">{analytics.summary.totalSubmissions}</div>
                    <div className="card-label">Submissions</div>
                  </div>
                </div>
                <div className="analytics-card on-time">
                  <div className="card-icon">🎯</div>
                  <div className="card-content">
                    <div className="card-value">{analytics.summary.onTimeSubmissions}</div>
                    <div className="card-label">On Time</div>
                  </div>
                </div>
                <div className="analytics-card late">
                  <div className="card-icon">⏱️</div>
                  <div className="card-content">
                    <div className="card-value">{analytics.summary.lateSubmissions}</div>
                    <div className="card-label">Late</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          {analytics && (
            <div className="charts-section">
              <h2>Submission Summary</h2>
              <div className="summary-stats">
                <div className="summary-card on-time">
                  <div className="summary-label">On Time</div>
                  <div className="summary-value">{analytics.summary.onTimeSubmissions}</div>
                </div>
                <div className="summary-card late">
                  <div className="summary-label">Late</div>
                  <div className="summary-value">{analytics.summary.lateSubmissions}</div>
                </div>
                <div className="summary-card missing">
                  <div className="summary-label">Missing</div>
                  <div className="summary-value">{analytics.summary.missingSubmissions}</div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Submissions */}
          {analytics?.recentActivity && analytics.recentActivity.length > 0 && (
            <div className="submissions-section">
              <h2>Recent Submissions</h2>
              <div className="submissions-list">
                {analytics.recentActivity.map((submission, idx) => (
                  <div key={idx} className="submission-item">
                    <div className="submission-info">
                      <div className="submission-user">👤 {submission.user?.name || 'Unknown'}</div>
                      <div className="submission-task">📋 {submission.task?.title || 'Unknown Task'}</div>
                      <div className="submission-time">⏰ {new Date(submission.submittedAt).toLocaleString()}</div>
                      {submission.status && (
                        <div className={`submission-status status-${submission.status.toLowerCase()}`}>
                          {submission.status}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Task Management */}
          <div className="task-management-section">
            <div className="section-header">
              <h2>Task Management</h2>
              <button className="btn btn-primary" onClick={() => { setEditingTask(null); setShowTaskForm(!showTaskForm); resetForm(); }}>
                {showTaskForm ? '✕ Cancel' : '+ New Task'}
              </button>
            </div>

            {showTaskForm && (
              <form className="task-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <input
                    type="text"
                    name="title"
                    placeholder="Task title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <textarea
                  name="description"
                  placeholder="Task description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="4"
                  required
                />

                <div className="form-row">
                  <input
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleFormChange}
                    required
                  />
                  <input
                    type="number"
                    name="maxFileSize"
                    placeholder="Max file size (MB)"
                    value={formData.maxFileSize}
                    onChange={handleFormChange}
                    min="1"
                    max="100"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </form>
            )}

            {/* Tasks List */}
            <div className="tasks-list">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <p>No tasks created yet</p>
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task._id} className="task-item">
                    <div className="task-info">
                      <h4>{task.title}</h4>
                      <p>{task.subject}</p>
                      <div className="task-meta">
                        <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                        <span>Status: <span className="badge">{task.status}</span></span>
                      </div>
                    </div>
                    <div className="task-actions">
                      <button className="btn btn-secondary" onClick={() => handleEditTask(task)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
