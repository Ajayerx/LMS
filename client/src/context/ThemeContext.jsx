import { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext(null)

// Theme constants
const THEME_LIGHT = 'light'
const THEME_DARK = 'dark'
const STORAGE_KEY = 'lms-theme'

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === THEME_LIGHT || stored === THEME_DARK) {
        return stored
      }
      
      // Fall back to system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return THEME_DARK
      }
    }
    return THEME_LIGHT
  })

  const [isTransitioning, setIsTransitioning] = useState(false)

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    // Add transition class before changing theme
    setIsTransitioning(true)
    root.classList.add('theme-transitioning')
    
    if (theme === THEME_DARK) {
      root.setAttribute('data-theme', 'dark')
      root.classList.add('dark')
    } else {
      root.removeAttribute('data-theme')
      root.classList.remove('dark')
    }
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, theme)
    
    // Remove transition class after animation completes
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning')
      setIsTransitioning(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        setTheme(e.matches ? THEME_DARK : THEME_LIGHT)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(prev => prev === THEME_LIGHT ? THEME_DARK : THEME_LIGHT)
  }

  // Set specific theme
  const setLightTheme = () => {
    setTheme(THEME_LIGHT)
  }

  const setDarkTheme = () => {
    setTheme(THEME_DARK)
  }

  // Computed values
  const isDark = theme === THEME_DARK
  const isLight = theme === THEME_LIGHT

  const value = {
    theme,
    isDark,
    isLight,
    isTransitioning,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook for using theme
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Higher-order component for class-based components (if needed)
export const withTheme = (Component) => {
  return function WithThemeComponent(props) {
    const theme = useTheme()
    return <Component {...props} theme={theme} />
  }
}

export default ThemeContext
