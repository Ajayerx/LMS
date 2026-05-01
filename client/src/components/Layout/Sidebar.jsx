import { useState, createContext, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Avatar, Badge, Button } from '../ui'
import {
  LayoutDashboard,
  BookOpen,
  Search,
  Award,
  Users,
  Clock,
  PlusCircle,
  GraduationCap,
  LogOut
} from 'lucide-react'

// Sidebar context for managing state across components
const SidebarContext = createContext(null)
export const useSidebar = () => useContext(SidebarContext)

const Sidebar = ({ variant = 'student', isSidebarOpen, toggleSidebar }) => {
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    if (toggleSidebar) toggleSidebar()
  }

  // Define navigation items based on variant
  const getNavItems = () => {
    if (variant === 'student') {
      return [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/dashboard/my-courses', icon: BookOpen, label: 'My Courses' },
        { to: '/dashboard/certificates', icon: Award, label: 'Certificates' },
        { to: '/courses', icon: Search, label: 'Browse Courses' }
      ]
    } else if (variant === 'instructor') {
      return [
        { to: '/instructor', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/instructor/courses', icon: BookOpen, label: 'My Courses' },
        { to: '/instructor/courses/create', icon: PlusCircle, label: 'Create Course' }
      ]
    } else if (variant === 'admin') {
      return [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/users', icon: Users, label: 'Users' },
        { to: '/admin/pending-courses', icon: Clock, label: 'Pending Courses' },
        { to: '/admin/courses', icon: BookOpen, label: 'All Courses' }
      ]
    }
    return []
  }

  const navItems = getNavItems()
  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border
        transform transition-transform duration-300 ease-in-out z-50
        lg:relative lg:transform-none lg:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-300 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">LearnHub</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.to)
            
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (toggleSidebar) toggleSidebar()
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl mx-2 text-sm font-medium transition-all duration-200
                  ${active 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-primary/5 hover:text-primary'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-light-border dark:border-dark-border">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Avatar 
                name={user?.name || 'User'}
                size="sm"
                className="w-10 h-10"
              />
              <div>
                <div className="font-semibold text-white">{user?.name || 'User'}</div>
                <Badge variant="secondary" className="text-xs">
                  {user?.role || 'STUDENT'}
                </Badge>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
