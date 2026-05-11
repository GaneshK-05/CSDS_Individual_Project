import { useState, useEffect } from 'react'
import authService from '../services/authService'
import taskService from '../services/taskService'
import submissionService from '../services/submissionService'
import TaskCard from './TaskCard'
import SubmissionModal from './SubmissionModal'
import { showToast } from '../utils/toast'
import './UserDashboard.css'

export default function UserDashboard({ onLogout }) {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, submitted, expired

  useEffect(() => {
    const currentUser = authService.getUser()
    setUser(currentUser)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tasksData, submissionsData] = await Promise.all([
        taskService.getAllTasks(),
        submissionService.getUserSubmissions()
      ])
      // Ensure data is always arrays
      setTasks(Array.isArray(tasksData) ? tasksData : [])
      setSubmissions(Array.isArray(submissionsData) ? submissionsData : [])
    } catch (err) {
      showToast.error('Failed to load data: ' + (err.message || 'Unknown error'))
      console.error('LoadData error:', err)
      // Set empty arrays so component can still render
      setTasks([])
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const isTaskSubmitted = (taskId) => {
    return submissions.some(sub => {
      // Handle both object and string task references with null safety
      if (!sub || !sub.task) return false
      const taskRef = typeof sub.task === 'object' ? sub.task._id : sub.task
      return taskRef === taskId
    })
  }

  const handleLogout = () => {
    authService.logout()
    onLogout()
  }

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const now = new Date()
      const deadline = new Date(task.deadline)
      const submitted = isTaskSubmitted(task._id)

      switch (filter) {
        case 'upcoming':
          return !submitted && now <= deadline
        case 'submitted':
          return submitted
        case 'expired':
          return now > deadline
        default:
          return task.status === 'Active'
      }
    })
  }

  const filteredTasks = getFilteredTasks()

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="logo">⏰ CSDS</h1>
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
          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-value">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{submissions.length}</div>
              <div className="stat-label">Submitted</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {tasks.filter(t => new Date(t.deadline) > new Date()).length}
              </div>
              <div className="stat-label">Active</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </button>
            <button
              className={`tab ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`tab ${filter === 'submitted' ? 'active' : ''}`}
              onClick={() => setFilter('submitted')}
            >
              Submitted
            </button>
            <button
              className={`tab ${filter === 'expired' ? 'active' : ''}`}
              onClick={() => setFilter('expired')}
            >
              Expired
            </button>
          </div>

          {/* Tasks Grid */}
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No tasks found</h3>
              <p>
                {filter === 'all'
                  ? 'No active tasks available'
                  : `No ${filter} tasks`}
              </p>
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  submitted={isTaskSubmitted(task._id)}
                  onSubmit={(task) => setSelectedTask(task)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedTask && (
        <SubmissionModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSuccess={() => {
            loadData()
            setSelectedTask(null)
            showToast.success('Task submitted successfully!')
          }}
        />
      )}
    </div>
  )
}
