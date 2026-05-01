const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  const variantClasses = {
    // Status variants
    default: 'bg-light-tertiary dark:bg-dark-tertiary text-text-secondary',
    approved: 'bg-success/10 text-success border border-success/20',
    pending: 'bg-secondary/10 text-secondary border border-secondary/20',
    rejected: 'bg-danger/10 text-danger border border-danger/20',
    
    // Role variants
    admin: 'bg-primary/10 text-primary border border-primary/20',
    instructor: 'bg-info/10 text-info border border-info/20',
    student: 'bg-success/10 text-success border border-success/20',
    
    // Other variants
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
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
