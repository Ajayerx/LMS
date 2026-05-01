import { useState, forwardRef } from 'react'
import { motion } from 'framer-motion'
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

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const containerClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim()

  const inputClasses = `
    w-full
    bg-white
    border rounded-lg
    px-4 py-2.5
    text-gray-900
    placeholder:text-gray-400
    transition-all duration-200
    focus:outline-none
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error 
      ? 'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20' 
      : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
    }
    ${success && !error ? 'border-success-500' : ''}
    ${Icon ? 'pl-11' : ''}
    ${isPassword || success ? 'pr-11' : ''}
  `.trim()

  return (
    <motion.div 
      className={containerClasses}
      animate={shake ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-danger-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />

        {/* Success Icon */}
        {success && !error && !isPassword && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-success-500"
          >
            <Check className="w-5 h-5" />
          </motion.div>
        )}

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Error / Helper Text */}
      {(error || helperText) && (
        <div className={`mt-1.5 flex items-center gap-1.5 text-sm ${error ? 'text-danger-600' : 'text-gray-500'}`}>
          {error && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{error || helperText}</span>
        </div>
      )}
    </motion.div>
  )
})

Input.displayName = 'Input'

export default Input
