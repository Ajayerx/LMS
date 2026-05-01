import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown, 
  GraduationCap, 
  LayoutDashboard, 
  Shield,
  Sun,
  Moon,
  BookOpen
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { subscribeToNotifications, unsubscribeFromNotifications } from '../../services/socket.js'
import api from '../../api/axios'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsDropdownOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch initial unread count
  useEffect(() => {
    if (user) {
      fetchUnreadCount()
    }
  }, [user])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/notifications?unreadOnly=true')
      setUnreadCount(response.data.unreadCount || 0)
    } catch (err) {
      // Error handling
    }
  }

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return

    const handleNewNotification = (data) => {
      toast.info(data.notification.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setUnreadCount(prev => prev + 1)
    }

    subscribeToNotifications(handleNewNotification)

    return () => {
      unsubscribeFromNotifications()
    }
  }, [user])

  // Role-based navigation links
  const getNavLinks = () => {
    const common = [
      { to: '/courses', label: 'Courses', icon: BookOpen }
    ]

    if (!user) return common

    switch (user.role) {
      case 'ADMIN':
        return [
          ...common,
          { to: '/admin', label: 'Admin Panel', icon: Shield },
          { to: '/instructor', label: 'Instructor', icon: GraduationCap }
        ]
      case 'INSTRUCTOR':
        return [
          ...common,
          { to: '/instructor', label: 'My Courses', icon: GraduationCap },
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
        ]
      case 'STUDENT':
      default:
        return [
          ...common,
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/dashboard/my-courses', label: 'My Learning', icon: BookOpen }
        ]
    }
  }

  const navLinks = getNavLinks()

  return (
    <>
      <nav className="sticky top-0 z-50 glass-morphism border-b border-glass shadow-premium-glow transition-all duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center premium-glow group-hover:premium-glow-lg transition-all duration-300 hover-scale">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient hidden sm:block tracking-tight">LMS</span>
            </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Search Bar - Pill Shape */}
            <form onSubmit={handleSearch} className="relative mx-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full sm:w-72 bg-glass border border-glass rounded-full text-sm text-text-primary placeholder:text-text-muted focus:bg-glass focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 backdrop-blur-sm"
              />
            </form>

            {/* Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                  location.pathname === link.to
                    ? 'text-primary bg-primary/10 border-l-2 border-primary shadow-sm'
                    : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                }`}
              >
                <link.icon className="w-4 h-4 mr-1.5" />
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center ml-4 gap-2">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl text-text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center hover-lift"
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notification Bell with Animated Badge */}
                <Link to="/notifications" className="relative p-2.5 min-h-[44px] min-w-[44px] text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 flex items-center justify-center hover-lift">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full animate-pulse">
                      <span className="absolute inset-0 bg-danger rounded-full animate-ping opacity-75"></span>
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 min-h-[44px] rounded-full bg-glass hover:bg-glass border border-glass transition-all duration-300 hover-lift backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-300 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.[0] || '?'}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 glass-morphism rounded-2xl premium-shadow border border-glass py-2 z-50 animate-fade-in"
                    >
                      <div className="px-4 py-3 border-b border-border-color">
                        <p className="font-semibold text-text-primary">{user.name}</p>
                        <p className="text-sm text-text-secondary">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          {user.role}
                        </span>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to={user.role === 'STUDENT' ? '/dashboard/my-courses' : user.role === 'INSTRUCTOR' ? '/instructor/courses' : '/admin'}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          My Courses
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                      </div>
                      
                      <div className="border-t border-border-color pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-danger hover:bg-danger/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center ml-4 gap-3">
                {/* Theme Toggle for guests */}
                <button
                  onClick={toggleTheme}
                  className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary transition-colors flex items-center justify-center"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                <Link
                  to="/login"
                  className="px-4 py-2.5 min-h-[44px] text-text-secondary hover:text-primary font-medium transition-colors flex items-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-4 py-2.5 min-h-[44px] flex items-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-1 lg:hidden">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 min-h-[44px] min-w-[44px] text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary rounded-xl transition-colors flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2.5 min-h-[44px] min-w-[44px] text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary rounded-xl transition-colors flex items-center justify-center"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 min-h-[44px] min-w-[44px] text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary rounded-xl transition-colors flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      </nav>

      {/* Mobile Slide-in Drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Drawer */}
        <div className={`absolute right-0 top-0 bottom-0 w-80 max-w-full bg-light-surface dark:bg-dark-surface shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-color">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-300 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-text-primary">Menu</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-4 overflow-y-auto h-[calc(100%-65px)]">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-light-tertiary dark:bg-dark-tertiary border border-border-color rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </form>

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    location.pathname === link.to
                      ? 'text-primary bg-primary/10 border-l-2 border-primary'
                      : 'text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to="/notifications"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary rounded-xl transition"
                  >
                    <Bell className="w-5 h-5" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto w-2 h-2 bg-danger rounded-full animate-pulse" />
                    )}
                  </Link>
                  
                  <div className="border-t border-border-color mt-4 pt-4">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-300 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-secondary">{user.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary rounded-xl transition"
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        handleLogout()
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-danger hover:bg-danger/10 rounded-xl transition"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-border-color mt-4 pt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary rounded-xl transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 btn-primary rounded-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className={`fixed inset-0 z-[70] lg:hidden transition-opacity duration-300 ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        />
        
        {/* Search Panel */}
        <div className={`absolute top-0 left-0 right-0 glass-morphism p-4 shadow-premium transform transition-transform duration-300 ${isSearchOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchOpen}
                className="w-full pl-12 pr-4 py-3 bg-light-tertiary dark:bg-dark-tertiary border border-border-color rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[48px]"
              />
            </form>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-3 min-h-[48px] min-w-[48px] text-text-secondary hover:text-primary hover:bg-light-tertiary dark:hover:bg-dark-tertiary rounded-xl transition-colors flex items-center justify-center"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
