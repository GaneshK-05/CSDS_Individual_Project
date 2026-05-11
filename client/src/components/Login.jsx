import { useState } from 'react'
import authService from '../services/authService'
import { showToast } from '../utils/toast'
import './Auth.css'

export default function Login({ onSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email || !formData.password) {
      showToast.error('Email and password are required')
      setLoading(false)
      return
    }

    try {
      await authService.login(formData.email, formData.password)
      showToast.success('Login successful!')
      onSuccess()
    } catch (err) {
      const errorMsg = err.message || 'Login failed'
      setError(errorMsg)
      showToast.invalidLogin(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="csds-logo">⏰ CSDS</h1>
          <h2>Sign in to your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="link-btn"
              onClick={onSwitchToRegister}
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
