import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('admin_token')
    if (storedToken) {
      setToken(storedToken)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (password) => {
    try {
      const API_BASE = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:8001'
      console.log('Attempting login to:', `${API_BASE}/admin/login`)
      
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      console.log('Login response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Invalid password' }))
        throw new Error(errorData.detail || 'Invalid password')
      }

      const data = await response.json()
      console.log('Login response data:', data)
      
      if (data.success) {
        setToken(data.token)
        setIsAuthenticated(true)
        localStorage.setItem('admin_token', data.token)
        return { success: true }
      }
      throw new Error('Login failed')
    } catch (error) {
      console.error('Login error:', error)
      // Provide more helpful error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return { success: false, error: 'Cannot connect to admin API. Make sure the Admin API server is running on port 8001.' }
      }
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem('admin_token')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

