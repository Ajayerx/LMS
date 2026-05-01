import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon, Monitor } from 'lucide-react'

const ThemeToggle = ({ variant = 'button', size = 'md', showLabel = false }) => {
  const { theme, isDark, toggleTheme, setLightTheme, setDarkTheme } = useTheme()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  // Simple toggle button (switches between light/dark)
  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          ${sizeClasses[size]}
          rounded-full
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${isDark 
            ? 'bg-dark-surface hover:bg-dark-surface-hover text-yellow-400' 
            : 'bg-light-surface hover:bg-light-surface-hover text-slate-600'
          }
          border border-border-color
          hover:shadow-glow
          focus:outline-none focus:ring-2 focus:ring-primary/50
        `}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <Sun className={`${iconSizes[size]} animate-fade-in`} />
        ) : (
          <Moon className={`${iconSizes[size]} animate-fade-in`} />
        )}
      </button>
    )
  }

  // Segmented control with all three options
  if (variant === 'segmented') {
    return (
      <div className="inline-flex items-center bg-light-surface dark:bg-dark-surface rounded-lg p-1 border border-border-color">
        <button
          onClick={setLightTheme}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
            ${!isDark 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-text-secondary hover:text-text-primary'
            }
          `}
        >
          <Sun className="w-4 h-4" />
          {showLabel && 'Light'}
        </button>
        <button
          onClick={setDarkTheme}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
            ${isDark 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-text-secondary hover:text-text-primary'
            }
          `}
        >
          <Moon className="w-4 h-4" />
          {showLabel && 'Dark'}
        </button>
      </div>
    )
  }

  // Dropdown style toggle
  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-border-color hover:border-primary transition-colors"
        >
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span className="text-sm capitalize">{theme}</span>
        </button>
        
        <div className="absolute right-0 mt-2 w-40 bg-light-surface dark:bg-dark-surface rounded-lg shadow-soft-lg border border-border-color opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <button
            onClick={setLightTheme}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-light-surface-hover dark:hover:bg-dark-surface-hover first:rounded-t-lg ${!isDark ? 'text-primary font-medium' : 'text-text-secondary'}`}
          >
            <Sun className="w-4 h-4" />
            Light
          </button>
          <button
            onClick={setDarkTheme}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-light-surface-hover dark:hover:bg-dark-surface-hover last:rounded-b-lg ${isDark ? 'text-primary font-medium' : 'text-text-secondary'}`}
          >
            <Moon className="w-4 h-4" />
            Dark
          </button>
        </div>
      </div>
    )
  }

  // Icon only (for navbars)
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-light-surface-hover dark:hover:bg-dark-surface-hover transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
}

export default ThemeToggle
