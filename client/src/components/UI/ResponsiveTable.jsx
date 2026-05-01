import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Badge from './Badge'

/**
 * ResponsiveTable - Shows as table on desktop, cards on mobile
 * 
 * @param {Array} data - Array of data objects
 * @param {Array} columns - Column config: [{ key: 'name', label: 'Name', render: (value, item) => ... }]
 * @param {Function} onRowClick - Callback when row/card is clicked
 * @param {String} emptyMessage - Message when no data
 * @param {String} className - Additional classes
 */
const ResponsiveTable = ({ 
  data = [], 
  columns = [], 
  onRowClick,
  emptyMessage = 'No data available',
  className = '' 
}) => {
  if (data.length === 0) {
    return (
      <div className={`text-center py-12 text-text-muted ${className}`}>
        {emptyMessage}
      </div>
    )
  }

  // Mobile Card View
  const MobileCard = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onRowClick?.(item)}
      className={`
        bg-light-surface dark:bg-dark-surface
        border border-border-color
        rounded-xl p-4
        ${onRowClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
      `}
    >
      {columns.map((column, colIndex) => {
        const value = item[column.key]
        const displayValue = column.render ? column.render(value, item) : value
        
        // First column is usually the title/primary info
        if (colIndex === 0) {
          return (
            <div key={column.key} className="flex items-center justify-between mb-2">
              <span className="font-semibold text-text-primary">
                {displayValue}
              </span>
              {onRowClick && <ChevronRight className="w-5 h-5 text-text-muted" />}
            </div>
          )
        }
        
        // Skip hidden columns on mobile
        if (column.hideOnMobile) return null
        
        return (
          <div key={column.key} className="flex items-center justify-between py-1.5 border-t border-border-color/50">
            <span className="text-sm text-text-muted">{column.label}</span>
            <span className="text-sm text-text-secondary">
              {displayValue}
            </span>
          </div>
        )
      })}
    </motion.div>
  )

  // Desktop Table View
  const DesktopTable = () => (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-border-color">
            {columns.map((column) => (
              <th 
                key={column.key}
                className="text-left py-3 px-4 text-sm font-medium text-text-muted whitespace-nowrap"
              >
                {column.label}
              </th>
            ))}
            {onRowClick && <th className="w-10"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {data.map((item, index) => (
            <motion.tr
              key={item.id || index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onRowClick?.(item)}
              className={`
                hover:bg-light-tertiary/50 dark:hover:bg-dark-tertiary/50
                transition-colors
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
            >
              {columns.map((column) => {
                const value = item[column.key]
                const displayValue = column.render ? column.render(value, item) : value
                
                return (
                  <td key={column.key} className="py-4 px-4 text-text-secondary whitespace-nowrap">
                    {displayValue}
                  </td>
                )
              })}
              {onRowClick && (
                <td className="py-4 px-4">
                  <ChevronRight className="w-5 h-5 text-text-muted" />
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className={className}>
      {/* Mobile Cards - visible only on small screens */}
      <div className="block sm:hidden space-y-3">
        {data.map((item, index) => (
          <MobileCard key={item.id || index} item={item} index={index} />
        ))}
      </div>
      
      {/* Desktop Table - visible on sm and up */}
      <div className="hidden sm:block">
        <DesktopTable />
      </div>
    </div>
  )
}

export default ResponsiveTable
