import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Admin from './components/Admin'
import authService from './services/authService'
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
      const user = authService.getUser()
      setIsLoggedIn(true)
      setUserRole(user?.role)
      // Route based on role
      setCurrentPage(user?.role === 'ADMIN' ? 'admin' : 'dashboard')
    } catch (error) {
      console.error('Error after login:', error)
    }
  }

  const handleRegisterSuccess = () => {
    try {
      const user = authService.getUser()
      setIsLoggedIn(true)
      setUserRole(user?.role)
      // Route based on role
      setCurrentPage(user?.role === 'ADMIN' ? 'admin' : 'dashboard')
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      {isLoggedIn ? (
        userRole === 'ADMIN' ? (
          <Admin onLogout={handleLogout} />
        ) : (
          <Dashboard onLogout={handleLogout} />
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
