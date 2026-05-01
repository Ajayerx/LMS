import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const PageWrapper = ({ 
  children, 
  className = '',
  maxWidth = '7xl',
  padding = true,
  animate = true,
  fullscreen = false
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Animation variants
  const pageVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
        staggerChildren: 0.1,
      },
    },
  }

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  // Max width classes
  const maxWidthClasses = {
    'sm': 'max-w-screen-sm',
    'md': 'max-w-screen-md',
    'lg': 'max-w-screen-lg',
    'xl': 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full',
    'none': '',
  }

  const containerClasses = `
    ${fullscreen ? 'h-full min-h-[calc(100vh-4rem)]' : ''}
    ${maxWidth !== 'none' ? 'mx-auto' : ''}
    ${maxWidthClasses[maxWidth] || maxWidthClasses['7xl']}
    ${padding ? 'px-4 sm:px-6 lg:px-8 py-6 lg:py-8' : ''}
    ${className}
  `.trim()

  // If animation is disabled, just render the container
  if (!animate) {
    return (
      <div className={containerClasses}>
        {children}
      </div>
    )
  }

  // Wrap children with motion.div for stagger effect
  const wrappedChildren = Array.isArray(children) 
    ? children.map((child, index) => (
        <motion.div key={index} variants={childVariants}>
          {child}
        </motion.div>
      ))
    : (
        <motion.div variants={childVariants}>
          {children}
        </motion.div>
      )

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={pageVariants}
      className={containerClasses}
    >
      {wrappedChildren}
    </motion.div>
  )
}

// Sub-components for layout structure
export const PageHeader = ({ 
  title, 
  subtitle, 
  children,
  className = '' 
}) => (
  <div className={`mb-6 lg:mb-8 ${className}`}>
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-text-secondary">
          {subtitle}
        </p>
      )}
    </motion.div>
    {children && (
      <div className="mt-4 flex items-center gap-3">
        {children}
      </div>
    )}
  </div>
)

export const PageSection = ({ 
  children, 
  title,
  className = '',
  delay = 0 
}) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={`mb-8 ${className}`}
  >
    {title && (
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        {title}
      </h2>
    )}
    {children}
  </motion.section>
)

export const CardGrid = ({ 
  children, 
  columns = 3,
  gap = 6,
  className = '' 
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${gridClasses[columns] || gridClasses[3]} gap-${gap} ${className}`}>
      {children}
    </div>
  )
}

export default PageWrapper
