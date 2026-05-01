import { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  fullWidth = false,
  shake = false,
  success = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hasValue, setHasValue] = useState(!!value)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    setHasValue(!!e.target.value)
    onBlur?.(e)
  }

  const handleChange = (e) => {
    setHasValue(!!e.target.value)
    onChange?.(e)
  }

  const containerClasses = `
    relative
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim()

  const inputClasses = `
    w-full
    bg-light-tertiary dark:bg-dark-tertiary
    border-2 rounded-xl
    px-4 py-3
    text-text-primary
    placeholder:text-text-muted
    transition-all duration-200
    focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error 
      ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/10' 
      : 'border-border-color focus:border-primary focus:ring-4 focus:ring-primary/10'
    }
    ${Icon ? 'pl-12' : ''}
    ${isPassword ? 'pr-12' : ''}
  `.trim()

  const labelClasses = `
    absolute left-4 transition-all duration-200 pointer-events-none
    ${(isFocused || hasValue) 
      ? 'top-1.5 text-xs text-primary font-medium' 
      : 'top-1/2 -translate-y-1/2 text-text-muted'
    }
    ${Icon && !(isFocused || hasValue) ? 'left-12' : ''}
    ${error ? '!text-danger' : ''}
  `.trim()

  return (
    <motion.div 
      className={containerClasses}
      animate={shake ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* Label */}
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      {/* Icon */}
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
          <Icon className="w-5 h-5" />
        </div>
      )}

      {/* Success Icon */}
      {success && !error && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-success"
        >
          <Check className="w-5 h-5" />
        </motion.div>
      )}

      {/* Input */}
      <input
        ref={ref}
        type={inputType}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={!label ? placeholder : (isFocused || hasValue) ? placeholder : ''}
        disabled={disabled}
        className={inputClasses}
        style={{ paddingRight: success || isPassword ? '2.5rem' : undefined }}
        {...props}
      />

      {/* Password Toggle */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Error / Helper Text */}
      {(error || helperText) && (
        <div className={`mt-1.5 flex items-center gap-1.5 text-sm ${error ? 'text-danger' : 'text-text-muted'}`}>
          {error && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{error || helperText}</span>
        </div>
      )}
    </motion.div>
  )
})

Input.displayName = 'Input'

export default Input
