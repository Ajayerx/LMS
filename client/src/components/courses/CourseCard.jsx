import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Users, Play, CheckCircle, Clock } from 'lucide-react'
import { Button, Badge, ProgressBar } from '../UI'

const CourseCard = ({ 
  course, 
  enrollment = null,
  showProgress = true,
  className = '' 
}) => {
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false)

  const {
    id,
    title,
    thumbnail,
    price,
    instructor,
    rating = 4.8,
    reviewCount = 120,
    students = 2500,
    category = 'Development',
    duration = '12h 30m',
    lessons = 24
  } = course

  const isFree = price === 0 || price === undefined || price === null
  const isEnrolled = !!enrollment
  const progress = enrollment?.progress || 0

  // Get instructor initials
  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate consistent avatar color
  const getAvatarColor = (name) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600',
    ]
    let hash = 0
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  const handleEnroll = () => {
    navigate(`/courses/${id}`)
  }

  const handleContinue = () => {
    navigate(`/learn/${id}`)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        group
        bg-light-surface dark:bg-dark-surface
        rounded-2xl
        overflow-hidden
        border border-border-color
        shadow-soft
        hover:shadow-soft-lg
        transition-all duration-300
        ${className}
      `}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-light-tertiary dark:bg-dark-tertiary animate-pulse" />
        )}
        
        {/* Image */}
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          className={`
            w-full h-full object-cover
            transition-transform duration-500 ease-out
            group-hover:scale-105
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Category Badge - Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="primary" size="sm">
            {category}
          </Badge>
        </div>

        {/* Duration - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg">
            <Clock className="w-3 h-3" />
            {duration}
          </div>
        </div>

        {/* Enrolled Badge */}
        {isEnrolled && (
          <div className="absolute bottom-3 left-3 z-10">
            <Badge variant="success" size="sm" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Enrolled
            </Badge>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-text-primary mb-3 line-clamp-2 min-h-[3rem]">
          {title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarColor(instructor?.name)} flex items-center justify-center text-white text-xs font-medium`}>
            {getInitials(instructor?.name)}
          </div>
          <span className="text-sm text-text-secondary truncate">
            {instructor?.name || 'Unknown Instructor'}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center text-secondary">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-sm font-medium text-text-primary">
                {rating}
              </span>
            </div>
            <span className="text-text-muted text-xs">
              ({reviewCount})
            </span>
          </div>

          {/* Students */}
          <div className="flex items-center gap-1 text-text-muted text-sm">
            <Users className="w-4 h-4" />
            <span>{students >= 1000 ? `${(students / 1000).toFixed(1)}k` : students}</span>
          </div>
        </div>

        {/* Progress (if enrolled and showProgress) */}
        {isEnrolled && showProgress && progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-text-secondary">Progress</span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <ProgressBar progress={progress} size="sm" showLabel={false} />
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          {isFree ? (
            <span className="text-success font-bold text-xl">Free</span>
          ) : (
            <span className="text-text-primary font-bold text-xl">
              ${price}
            </span>
          )}
          <span className="text-text-muted text-sm">
            {lessons} lessons
          </span>
        </div>

        {/* Footer - Action Button */}
        <div className="pt-2">
          {isEnrolled ? (
            <Button
              variant="primary"
              fullWidth
              onClick={handleContinue}
              icon={Play}
            >
              {progress > 0 ? 'Continue Learning' : 'Start Learning'}
            </Button>
          ) : (
            <Button
              variant="primary"
              fullWidth
              onClick={handleEnroll}
            >
              Enroll Now
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CourseCard
