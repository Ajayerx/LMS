import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import PageWrapper from './PageWrapper'

/**
 * AppLayout - Full layout with Navbar and Sidebar
 * Use this for dashboard/admin/instructor pages
 */
export const AppLayout = ({ 
  sidebarVariant = 'dashboard',
  showSidebar = true,
  pageWrapperProps = {}
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Top Navbar */}
      <Navbar />
      
      <div className="flex pt-16">
        {/* Sidebar - Fixed left */}
        {showSidebar && (
          <div 
            className={`fixed left-0 top-16 bottom-0 transition-all duration-300 ${
              sidebarCollapsed ? 'w-20' : 'w-64'
            }`}
          >
            <Sidebar 
              variant={sidebarVariant}
              onCollapseChange={setSidebarCollapsed}
            />
          </div>
        )}
        
        {/* Main Content Area */}
        <main 
          className={`flex-1 transition-all duration-300 ${
            showSidebar ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : ''
          }`}
        >
          <PageWrapper {...pageWrapperProps}>
            <Outlet />
          </PageWrapper>
        </main>
      </div>
    </div>
  )
}

/**
 * SimpleLayout - Navbar only, no sidebar
 * Use this for public pages (home, courses, login, etc.)
 */
export const SimpleLayout = ({ 
  children,
  pageWrapperProps = {}
}) => {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Navbar />
      <main>
        <PageWrapper {...pageWrapperProps}>
          {children}
        </PageWrapper>
      </main>
    </div>
  )
}

/**
 * AuthLayout - Clean layout for auth pages
 * No navbar, centered content
 */
export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg to-light-tertiary dark:from-dark-bg dark:to-dark-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}

export default AppLayout
