import { motion } from 'framer-motion'

const PageWrapper = ({ children, className = '', title = '', subtitle = '', showBackground = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`w-full py-4 sm:py-6 lg:py-8 relative ${className}`}
    >
      {/* Premium Background Pattern */}
      {showBackground && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-success/10 to-info/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-warning/5 to-danger/5 rounded-full blur-3xl" />
        </div>
      )}
      
      {title && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient mb-3 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-4xl">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default PageWrapper
