const Card = ({
  children,
  className = '',
  hover = true,
  padding = true,
  onClick,
}) => {
  const baseClasses = `
    bg-white
    rounded-xl
    border border-gray-200
    transition-all duration-200
  `.trim()

  const hoverClasses = hover ? `
    hover:shadow-lg hover:shadow-gray-200/50
    hover:border-gray-300
  ` : ''

  const classes = `
    ${baseClasses}
    ${hoverClasses}
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
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  )
}

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  )
}

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-gray-500 mt-1 ${className}`}>
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
    <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl ${className}`}>
      {children}
    </div>
  )
}

export default Card
