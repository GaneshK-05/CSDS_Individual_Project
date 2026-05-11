import { useState, useEffect } from 'react'
import authService from '../services/authService'
import submissionService from '../services/submissionService'
import './Dashboard.css'

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deadline, setDeadline] = useState(null)

  useEffect(() => {
    const currentUser = authService.getUser()
    setUser(currentUser)
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      const data = await submissionService.getMySubmissions()
      setSubmissions(data)
    } catch (err) {
      console.error('Failed to load submissions:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!content.trim()) {
      setError('Please enter your submission content')
      setLoading(false)
      return
    }

    try {
      await submissionService.submitEntry(content)
      setSuccess('Submission successful!')
      setContent('')
      loadSubmissions()
    } catch (err) {
      setError(err.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear state before logout
    setUser(null)
    setSubmissions([])
    setContent('')
    setError('')
    setSuccess('')
    authService.logout()
    // onLogout() may not be called due to logout redirect
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="csds-logo">⏰ CSDS</h1>
          <div className="header-right">
            <span className="user-info">
              Welcome, <strong>{user?.name}</strong>
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
            <h2>Submit Your Work</h2>
            <form onSubmit={handleSubmit} className="submission-form">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-group">
                <label htmlFor="content">Your Submission</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your submission here..."
                  rows="8"
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>

          <div className="submissions-section">
            <h2>Your Submissions</h2>
            {submissions.length === 0 ? (
              <p className="no-submissions">No submissions yet</p>
            ) : (
              <div className="submissions-list">
                {submissions.map((submission, idx) => (
                  <div key={submission._id} className="submission-item">
                    <div className="submission-header">
                      <span className="submission-number">#{idx + 1}</span>
                      <span className="submission-date">
                        {new Date(submission.submittedAt).toLocaleDateString()} at{' '}
                        {new Date(submission.submittedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="submission-content">
                      {submission.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
