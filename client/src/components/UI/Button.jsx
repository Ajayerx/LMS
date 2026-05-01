import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  // Base classes
  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold
    rounded-xl
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `.trim()

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  }

  // Premium Variant classes
  const variantClasses = {
    primary: `
      premium-gradient
      text-white
      font-semibold
      premium-shadow
      hover:premium-shadow-lg
      focus:ring-primary/30
      hover-lift
      relative
      overflow-hidden
    `,
    secondary: `
      bg-glass
      text-text-primary
      font-medium
      hover:bg-primary/10
      focus:ring-primary/30
      border border-glass
      hover-lift
      backdrop-blur-sm
    `,
    ghost: `
      text-text-secondary
      font-medium
      hover:text-primary
      hover:bg-primary/5
      focus:ring-primary/30
      hover-lift
    `,
    outline: `
      border-2 border-primary
      text-primary
      font-medium
      hover:bg-primary
      hover:text-white
      focus:ring-primary/30
      hover-lift
      transition-all duration-300
    `,
    success: `
      bg-gradient-to-r from-success to-success-600
      text-white
      font-semibold
      premium-shadow
      hover:premium-shadow-lg
      focus:ring-success/30
      hover-lift
    `,
    danger: `
      bg-gradient-to-r from-danger to-danger-600
      text-white
      font-semibold
      premium-shadow
      hover:premium-shadow-lg
      focus:ring-danger/30
      hover-lift
    `,
    warning: `
      bg-gradient-to-r from-warning to-warning-600
      text-white
      font-semibold
      premium-shadow
      hover:premium-shadow-lg
      focus:ring-warning/30
      hover-lift
    `,
    info: `
      bg-gradient-to-r from-info to-info-600
      text-white
      font-semibold
      premium-shadow
      hover:premium-shadow-lg
      focus:ring-info/30
      hover-lift
    `
  }

  const classes = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${variant === 'primary' ? 'btn-shimmer' : ''}
    ${className}
  `.trim()

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4" />
      )}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4" />
      )}
    </motion.button>
  )
}

export default Button
