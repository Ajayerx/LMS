import { motion } from 'framer-motion'

const shimmerVariants = {
  initial: { x: '-100%', opacity: 0 },
  animate: { 
    x: '100%', 
    opacity: [0, 1, 1, 0],
    transition: {
      x: { duration: 1.5, repeat: Infinity, ease: 'linear' },
      opacity: { duration: 1.5, repeat: Infinity, ease: 'linear' }
    }
  }
}

const ShimmerBlock = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-light-tertiary dark:bg-dark-tertiary ${className}`}>
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
    />
  </div>
)

const CourseCardSkeleton = ({ count = 1, className = '' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`
            bg-light-surface dark:bg-dark-surface
            rounded-2xl
            overflow-hidden
            border border-border-color
            shadow-soft
            ${className}
          `}
        >
          {/* Thumbnail Skeleton */}
          <div className="relative aspect-video overflow-hidden">
            <ShimmerBlock className="w-full h-full" />
            
            {/* Category Badge Skeleton */}
            <div className="absolute top-3 left-3">
              <ShimmerBlock className="w-20 h-6 rounded-full" />
            </div>
            
            {/* Duration Skeleton */}
            <div className="absolute top-3 right-3">
              <ShimmerBlock className="w-16 h-6 rounded-lg" />
            </div>
          </div>

          {/* Body Skeleton */}
          <div className="p-5 space-y-4">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <ShimmerBlock className="w-full h-5 rounded-lg" />
              <ShimmerBlock className="w-3/4 h-5 rounded-lg" />
            </div>

            {/* Instructor Skeleton */}
            <div className="flex items-center gap-2">
              <ShimmerBlock className="w-6 h-6 rounded-full" />
              <ShimmerBlock className="w-32 h-4 rounded-lg" />
            </div>

            {/* Stats Row Skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShimmerBlock className="w-12 h-4 rounded-lg" />
              </div>
              <ShimmerBlock className="w-16 h-4 rounded-lg" />
            </div>

            {/* Price Skeleton */}
            <div className="flex items-center justify-between">
              <ShimmerBlock className="w-16 h-7 rounded-lg" />
              <ShimmerBlock className="w-20 h-4 rounded-lg" />
            </div>

            {/* Button Skeleton */}
            <ShimmerBlock className="w-full h-11 rounded-xl" />
          </div>
        </div>
      ))}
    </>
  )
}

// Grid of skeleton cards
export const CourseCardSkeletonGrid = ({ count = 4, columns = 4, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      <CourseCardSkeleton count={count} />
    </div>
  )
}

// Horizontal scroll skeleton
export const CourseCardSkeletonScroll = ({ count = 4 }) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      <CourseCardSkeleton count={count} className="flex-shrink-0 w-80" />
    </div>
  )
}

export default CourseCardSkeleton
