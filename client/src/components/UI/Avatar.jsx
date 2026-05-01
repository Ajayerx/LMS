import { useState, useMemo } from 'react'

const Avatar = ({
  src,
  alt,
  name = '',
  size = 'md',
  className = '',
  fallbackColor,
  border = false,
  online = false,
  statusPosition = 'bottom-right',
}) => {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  }

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  }

  const statusPositionClasses = {
    'top-right': '-top-0.5 -right-0.5',
    'top-left': '-top-0.5 -left-0.5',
    'bottom-right': '-bottom-0.5 -right-0.5',
    'bottom-left': '-bottom-0.5 -left-0.5',
  }

  // Generate consistent color from name
  const getColorFromName = (name) => {
    const colors = [
      'from-red-500 to-pink-500',
      'from-orange-500 to-amber-500',
      'from-amber-500 to-yellow-500',
      'from-green-500 to-emerald-500',
      'from-emerald-500 to-teal-500',
      'from-teal-500 to-cyan-500',
      'from-cyan-500 to-sky-500',
      'from-sky-500 to-blue-500',
      'from-blue-500 to-indigo-500',
      'from-indigo-500 to-violet-500',
      'from-violet-500 to-purple-500',
      'from-purple-500 to-fuchsia-500',
      'from-fuchsia-500 to-pink-500',
      'from-pink-500 to-rose-500',
      'from-rose-500 to-red-500',
    ]
    
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const initials = useMemo(() => getInitials(name), [name])
  const bgGradient = useMemo(() => 
    fallbackColor || getColorFromName(name), 
    [name, fallbackColor]
  )

  const showImage = src && !imageError
  const showInitials = !showImage

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          flex items-center justify-center
          font-semibold
          overflow-hidden
          ${border ? 'ring-2 ring-light-surface dark:ring-dark-surface' : ''}
          ${showImage ? '' : `bg-gradient-to-br ${bgGradient} text-white`}
        `}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="select-none">{initials}</span>
        )}
      </div>

      {/* Online status indicator */}
      {online && (
        <span 
          className={`
            absolute ${statusPositionClasses[statusPosition]}
            ${statusSizeClasses[size]}
            bg-success rounded-full
            ring-2 ring-light-surface dark:ring-dark-surface
          `}
        />
      )}
    </div>
  )
}

// Avatar Group component
export const AvatarGroup = ({
  users = [],
  max = 4,
  size = 'md',
  className = '',
}) => {
  const visibleUsers = users.slice(0, max)
  const remaining = users.length - max

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {visibleUsers.map((user, index) => (
        <Avatar
          key={index}
          src={user.avatar}
          name={user.name}
          size={size}
          border
          className="relative hover:z-10 transition-transform hover:scale-110"
        />
      ))}
      {remaining > 0 && (
        <div className={`
          ${sizeClasses[size]}
          rounded-full
          bg-light-tertiary dark:bg-dark-tertiary
          border-2 border-light-surface dark:border-dark-surface
          flex items-center justify-center
          text-xs font-medium text-text-secondary
        `}>
          +{remaining}
        </div>
      )}
    </div>
  )
}

export default Avatar
