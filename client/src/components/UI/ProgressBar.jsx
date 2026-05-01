import { motion } from 'framer-motion'

const ProgressBar = ({
  progress,
  max = 100,
  size = 'md',
  showLabel = true,
  labelPosition = 'right',
  animated = true,
  className = '',
  gradient = true,
}) => {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100)

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const getProgressColor = (value) => {
    if (value >= 80) return 'from-success to-success/80'
    if (value >= 50) return 'from-primary to-primary-300'
    if (value >= 20) return 'from-secondary to-warning'
    return 'from-danger to-danger/80'
  }

  const barContent = (
    <div 
      className={`
        w-full bg-light-tertiary dark:bg-dark-tertiary 
        rounded-full overflow-hidden
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <motion.div
        initial={animated ? { width: 0 } : { width: `${percentage}%` }}
        animate={{ width: `${percentage}%` }}
        transition={animated ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
        className={`
          h-full rounded-full
          ${gradient 
            ? `bg-gradient-to-r ${getProgressColor(percentage)}` 
            : 'bg-primary'
          }
          shadow-sm
        `}
      />
    </div>
  )

  if (!showLabel) {
    return barContent
  }

  if (labelPosition === 'inside') {
    return (
      <div className={`relative w-full ${sizeClasses[size]} bg-light-tertiary dark:bg-dark-tertiary rounded-full overflow-hidden ${className}`}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
          className={`
            h-full rounded-full flex items-center justify-end pr-2
            ${gradient ? `bg-gradient-to-r ${getProgressColor(percentage)}` : 'bg-primary'}
          `}
        >
          {percentage > 20 && (
            <span className="text-xs font-semibold text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        {barContent}
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-text-secondary min-w-[3rem] text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}

// Circular progress variant
export const CircularProgress = ({
  progress,
  max = 100,
  size = 60,
  strokeWidth = 6,
  showLabel = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const getColor = (value) => {
    if (value >= 80) return '#10B981'
    if (value >= 50) return '#6C63FF'
    if (value >= 20) return '#F59E0B'
    return '#EF4444'
  }

  const color = getColor(percentage)

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-light-tertiary dark:text-dark-tertiary"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-semibold text-text-primary">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}

export default ProgressBar
