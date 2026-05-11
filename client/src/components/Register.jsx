import { useState } from 'react'
import authService from '../services/authService'
import { showToast } from '../utils/toast'
import './Auth.css'

export default function Register({ onSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.name || !formData.email || !formData.password) {
      showToast.error('All fields are required')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      showToast.error('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      )
      showToast.success('Account created successfully!')
      onSuccess()
    } catch (err) {
      const errorMsg = err.message || 'Registration failed'
      setError(errorMsg)
      showToast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="csds-logo">⏰ CSDS</h1>
          <h2>Create your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">Student / User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="link-btn"
              onClick={onSwitchToLogin}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
