import { motion } from 'framer-motion'
import Button from './Button'

const EmptyState = ({
  icon: Icon,
  title = 'Nothing here yet',
  description = 'Get started by creating your first item.',
  action,
  actionLabel,
  onAction,
  secondaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        flex flex-col items-center justify-center
        text-center
        py-12 px-4
        ${className}
      `}
    >
      {/* Icon */}
      {Icon && (
        <div className="mb-6">
          <div className="w-20 h-20 rounded-2xl bg-light-tertiary dark:bg-dark-tertiary flex items-center justify-center">
            <Icon className="w-10 h-10 text-text-muted" />
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary max-w-md mb-6">
        {description}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {action && (
          <Button
            variant="primary"
            onClick={onAction}
            icon={action}
          >
            {actionLabel}
          </Button>
        )}
        
        {secondaryAction && (
          <Button
            variant="ghost"
            onClick={onSecondaryAction}
            icon={secondaryAction}
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

// Preset empty states for common scenarios
export const EmptyCourses = ({ onBrowse, onCreate }) => (
  <EmptyState
    icon={BookOpen}
    title="No courses yet"
    description="Browse our catalog to find courses that interest you, or create your first course as an instructor."
    action={Compass}
    actionLabel="Browse Courses"
    onAction={onBrowse}
    secondaryAction={Plus}
    secondaryActionLabel="Create Course"
    onSecondaryAction={onCreate}
  />
)

export const EmptySearch = ({ searchTerm, onClear }) => (
  <EmptyState
    icon={Search}
    title="No results found"
    description={`We couldn't find any matches for "${searchTerm}". Try adjusting your search terms.`}
    action={XCircle}
    actionLabel="Clear Search"
    onAction={onClear}
  />
)

export const EmptyNotifications = () => (
  <EmptyState
    icon={Bell}
    title="No notifications"
    description="You're all caught up! We'll let you know when something important happens."
  />
)

export const EmptyEnrollments = ({ onBrowse }) => (
  <EmptyState
    icon={GraduationCap}
    title="No enrollments yet"
    description="Start your learning journey by enrolling in a course today."
    action={BookOpen}
    actionLabel="Browse Courses"
    onAction={onBrowse}
  />
)

// Icons for preset empty states
import { 
  BookOpen, 
  Compass, 
  Plus, 
  Search, 
  XCircle, 
  Bell, 
  GraduationCap 
} from 'lucide-react'

export default EmptyState
