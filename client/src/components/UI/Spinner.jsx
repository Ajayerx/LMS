import { motion } from 'framer-motion'

const Spinner = ({
  size = 'md',
  fullPage = false,
  text,
  overlay = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  const spinnerContent = (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Animated Spinner */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer ring - pulsing */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full bg-primary/20"
        />
        
        {/* Middle ring - spinning */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary"
        />
        
        {/* Inner ring - spinning reverse */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-2 rounded-full border-2 border-primary/20 border-b-primary-300"
        />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      </div>

      {/* Loading Text */}
      {text && (
        <p className={`${textSizes[size]} text-text-secondary font-medium`}>
          {text}
        </p>
      )}
    </div>
  )

  // Full page spinner
  if (fullPage) {
    return (
      <div className={`
        fixed inset-0 
        flex items-center justify-center 
        bg-light-bg/80 dark:bg-dark-bg/80 
        backdrop-blur-sm
        z-50
      `}>
        {spinnerContent}
      </div>
    )
  }

  // With overlay (for loading states within a container)
  if (overlay) {
    return (
      <div className={`
        absolute inset-0 
        flex items-center justify-center 
        bg-light-surface/80 dark:bg-dark-surface/80 
        backdrop-blur-sm
        z-10
        rounded-inherit
      `}>
        {spinnerContent}
      </div>
    )
  }

  // Inline spinner
  return spinnerContent
}

// Inline spinner for buttons/forms
export const InlineSpinner = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="30 60"
          className="text-primary"
        />
      </svg>
    </motion.div>
  )
}

// Skeleton loader
export const Skeleton = ({ 
  width = '100%', 
  height = '1rem', 
  circle = false,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-light-tertiary dark:bg-dark-tertiary
        animate-pulse
        ${circle ? 'rounded-full' : 'rounded-lg'}
        ${className}
      `}
      style={{ width, height }}
    />
  )
}

// Skeleton text lines
export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '75%' : '100%'}
          height="0.875rem"
        />
      ))}
    </div>
  )
}

export default Spinner
