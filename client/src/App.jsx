import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Login from './components/Login'
import Register from './components/Register'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'
import authService from './services/authService'
import './styles/globals.css'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token')
        const user = authService.getUser()
        if (token && user) {
          setIsLoggedIn(true)
          setUserRole(user.role)
          // Route based on role
          setCurrentPage(user.role === 'ADMIN' ? 'admin' : 'dashboard')
        } else {
          setIsLoggedIn(false)
          setCurrentPage('login')
          setUserRole(null)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsLoggedIn(false)
        setCurrentPage('login')
        setUserRole(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLoginSuccess = () => {
    try {
      // Immediate redirect - localStorage is synchronous
      const user = authService.getUser()
      if (user) {
        setIsLoggedIn(true)
        setUserRole(user.role)
        setCurrentPage(user.role === 'ADMIN' ? 'admin' : 'dashboard')
      }
    } catch (error) {
      console.error('Error after login:', error)
    }
  }

  const handleRegisterSuccess = () => {
    try {
      // Immediate redirect - localStorage is synchronous
      const user = authService.getUser()
      if (user) {
        setIsLoggedIn(true)
        setUserRole(user.role)
        setCurrentPage(user.role === 'ADMIN' ? 'admin' : 'dashboard')
      }
    } catch (error) {
      console.error('Error after register:', error)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage('login')
    setUserRole(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const switchToLogin = () => setCurrentPage('login')
  const switchToRegister = () => setCurrentPage('register')

  if (isLoading) {
    return (
      <div className="App">
        <Toaster position="top-right" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1a1f35 100%)' }}>
          <div style={{ color: '#f1f5f9', fontSize: '18px' }}>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <Toaster position="top-right" />
      {isLoggedIn ? (
        userRole === 'ADMIN' ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <UserDashboard onLogout={handleLogout} />
        )
      ) : currentPage === 'register' ? (
        <Register
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={switchToLogin}
        />
      ) : (
        <Login
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegister}
        />
      )}
    </div>
  )
}

export default App
