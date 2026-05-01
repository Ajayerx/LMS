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
    font-medium
    rounded-lg
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    cursor-pointer
  `.trim()

  // Size classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2',
    xl: 'px-6 py-3.5 text-base gap-2.5',
  }

  // Clean Light Theme Variants
  const variantClasses = {
    primary: `
      bg-primary-600
      text-white
      hover:bg-primary-700
      focus:ring-primary-500/30
      shadow-sm hover:shadow-md
      active:bg-primary-800
    `,
    secondary: `
      bg-gray-100
      text-gray-700
      hover:bg-gray-200
      focus:ring-gray-500/30
      border border-gray-200
      active:bg-gray-300
    `,
    ghost: `
      text-gray-600
      hover:text-gray-900
      hover:bg-gray-100
      focus:ring-gray-500/20
    `,
    outline: `
      border-2 border-primary-600
      text-primary-600
      hover:bg-primary-50
      focus:ring-primary-500/30
      active:bg-primary-100
    `,
    success: `
      bg-success-600
      text-white
      hover:bg-success-700
      focus:ring-success-500/30
      shadow-sm hover:shadow-md
    `,
    danger: `
      bg-danger-600
      text-white
      hover:bg-danger-700
      focus:ring-danger-500/30
      shadow-sm hover:shadow-md
    `,
    warning: `
      bg-warning-500
      text-white
      hover:bg-warning-600
      focus:ring-warning-500/30
      shadow-sm hover:shadow-md
    `,
    info: `
      bg-info-600
      text-white
      hover:bg-info-700
      focus:ring-info-500/30
      shadow-sm hover:shadow-md
    `,
    link: `
      text-primary-600
      hover:text-primary-700
      hover:underline
      underline-offset-4
      p-0
    `
  }

  const classes = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim()

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
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
