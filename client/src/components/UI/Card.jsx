const Card = ({
  children,
  className = '',
  hover = true,
  padding = true,
  shadow = 'soft',
  border = true,
  onClick,
}) => {
  const baseClasses = `
    glass-morphism
    rounded-2xl
    transition-all duration-300
    ${hover ? 'hover-lift premium-glow' : 'premium-shadow'}
  `.trim()

  const classes = `
    bg-light-surface dark:bg-dark-surface
    ${baseClasses}
    ${border ? 'border border-border-color' : ''}
    ${padding ? 'p-6' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim()

  return (
    <div 
      className={classes}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Card sub-components for structured content
export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pb-4 border-b border-glass ${className}`}>
      {children}
    </div>
  )
}

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-semibold text-text-primary tracking-tight ${className}`}>
      {children}
    </h3>
  )
}

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-text-secondary mt-1 leading-relaxed ${className}`}>
      {children}
    </p>
  )
}

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pt-4 border-t border-glass ${className}`}>
      {children}
    </div>
  )
}

export default Card
