import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  // Check role if allowedRoles is specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on user's role
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin" />
    } else if (user.role === 'INSTRUCTOR') {
      return <Navigate to="/instructor" />
    } else {
      return <Navigate to="/dashboard" />
    }
  }

  return children
}

export default PrivateRoute
