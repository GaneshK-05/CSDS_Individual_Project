import { useState, useEffect } from 'react'
import authService from '../services/authService'
import submissionService from '../services/submissionService'
import './Dashboard.css'

export default function Admin({ onLogout }) {
  const [user, setUser] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [deadline, setDeadline] = useState('')
  const [currentDeadline, setCurrentDeadline] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const currentUser = authService.getUser()
    setUser(currentUser)
    loadSubmissions()
    loadDeadline()
  }, [])

  const loadSubmissions = async () => {
    try {
      const data = await submissionService.getAllSubmissions()
      setSubmissions(data)
    } catch (err) {
      console.error('Failed to load submissions:', err)
      setError('Failed to load submissions')
    }
  }

  const loadDeadline = async () => {
    try {
      const data = await submissionService.getDeadline()
      if (data) {
        setCurrentDeadline(new Date(data.deadline))
        setDeadline(new Date(data.deadline).toISOString().slice(0, 16))
      }
    } catch (err) {
      console.error('Failed to load deadline:', err)
    }
  }

  const handleSetDeadline = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!deadline) {
      setError('Please select a deadline')
      setLoading(false)
      return
    }

    try {
      await submissionService.setDeadline(deadline)
      setSuccess('Deadline set successfully!')
      setCurrentDeadline(new Date(deadline))
      loadSubmissions()
    } catch (err) {
      setError(err.message || 'Failed to set deadline')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    onLogout()
  }

  const isSubmissionOnTime = (submissionDate) => {
    if (!currentDeadline) return null
    return new Date(submissionDate) <= currentDeadline
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' at ' + 
           new Date(dateString).toLocaleTimeString()
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="csds-logo">⏰ CSDS - Admin Panel</h1>
          <div className="header-right">
            <span className="user-info">
              Welcome, <strong>{user?.name}</strong> (Admin)
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="submission-section">
            <h2>Set Deadline</h2>
            <form onSubmit={handleSetDeadline} className="submission-form">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-group">
                <label htmlFor="deadline">Deadline Date & Time</label>
                <input
                  type="datetime-local"
                  id="deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              {currentDeadline && (
                <div className="current-deadline-info">
                  <p>
                    <strong>Current Deadline:</strong> {formatDate(currentDeadline)}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Setting...' : 'Set Deadline'}
              </button>
            </form>
          </div>

          <div className="submissions-section">
            <h2>All Submissions ({submissions.length})</h2>
            {submissions.length === 0 ? (
              <p className="no-submissions">No submissions yet</p>
            ) : (
              <div className="submissions-list admin-list">
                {submissions.map((submission, idx) => {
                  const onTime = isSubmissionOnTime(submission.submittedAt)
                  return (
                    <div 
                      key={submission._id} 
                      className={`submission-item ${onTime ? 'on-time' : 'late'}`}
                    >
                      <div className="submission-header">
                        <span className="submission-number">#{idx + 1}</span>
                        <span className="submission-user">
                          {submission.user?.name || 'Unknown'} ({submission.user?.email || 'N/A'})
                        </span>
                        <span className={`status-badge ${onTime ? 'status-on-time' : 'status-late'}`}>
                          {onTime ? '✓ On Time' : '✗ Late'}
                        </span>
                      </div>
                      <div className="submission-meta">
                        <span className="submission-date">
                          Submitted: {formatDate(submission.submittedAt)}
                        </span>
                      </div>
                      <div className="submission-content">
                        {submission.content}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
