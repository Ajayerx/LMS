import { createContext, useState, useContext, useEffect } from 'react'
import api from '../api/axios'
import { initializeSocket, disconnectSocket } from '../services/socket.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (token) => {
    try {
      // Authorization header now handled by api interceptor
      const response = await api.get('/auth/me')
      setUser(response.data.user)
      // Initialize Socket.io connection
      initializeSocket(token)
    } catch (error) {
      localStorage.removeItem('token')
      // Authorization header now handled by api interceptor
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      // Authorization header now handled by api interceptor
      setUser(user)
      // Initialize Socket.io connection
      initializeSocket(token)
      return user
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      // Authorization header now handled by api interceptor
      setUser(user)
      // Initialize Socket.io connection
      initializeSocket(token)
      return user
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    // Disconnect Socket.io
    disconnectSocket()
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
