const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm',
  }

  // Clean Light Theme Variants
  const variantClasses = {
    // Status variants
    default: 'bg-gray-100 text-gray-700',
    approved: 'bg-success-50 text-success-700 border border-success-200',
    pending: 'bg-warning-50 text-warning-700 border border-warning-200',
    rejected: 'bg-danger-50 text-danger-700 border border-danger-200',
    
    // Role variants
    admin: 'bg-primary-50 text-primary-700 border border-primary-200',
    instructor: 'bg-info-50 text-info-700 border border-info-200',
    student: 'bg-success-50 text-success-700 border border-success-200',
    
    // Color variants
    primary: 'bg-primary-50 text-primary-700',
    secondary: 'bg-secondary-50 text-secondary-700',
    success: 'bg-success-50 text-success-700',
    danger: 'bg-danger-50 text-danger-700',
    warning: 'bg-warning-50 text-warning-700',
    info: 'bg-info-50 text-info-700',
    
    // Solid variants
    'primary-solid': 'bg-primary-600 text-white',
    'success-solid': 'bg-success-600 text-white',
    'danger-solid': 'bg-danger-600 text-white',
    'warning-solid': 'bg-warning-500 text-white',
  }

  const classes = `
    inline-flex items-center justify-center
    font-medium
    rounded-full
    whitespace-nowrap
    ${sizeClasses[size]}
    ${variantClasses[variant] || variantClasses.default}
    ${className}
  `.trim()

  return (
    <span className={classes}>
      {children}
    </span>
  )
}

// Helper function to get role badge
export const RoleBadge = ({ role, size = 'sm' }) => {
  const roleMap = {
    ADMIN: { variant: 'admin', label: 'Admin' },
    INSTRUCTOR: { variant: 'instructor', label: 'Instructor' },
    STUDENT: { variant: 'student', label: 'Student' },
  }

  const config = roleMap[role] || roleMap.STUDENT

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  )
}

// Helper function to get status badge
export const StatusBadge = ({ status, size = 'sm' }) => {
  const statusMap = {
    APPROVED: { variant: 'approved', label: 'Approved' },
    PENDING: { variant: 'pending', label: 'Pending' },
    REJECTED: { variant: 'rejected', label: 'Rejected' },
    ACTIVE: { variant: 'success', label: 'Active' },
    INACTIVE: { variant: 'danger', label: 'Inactive' },
    COMPLETED: { variant: 'success', label: 'Completed' },
    IN_PROGRESS: { variant: 'info', label: 'In Progress' },
  }

  const config = statusMap[status] || { variant: 'default', label: status }

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  )
}

export default Badge
