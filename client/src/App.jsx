import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Layout/Navbar'
import { PageTransition } from './components/ui/PageTransition'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Learning from './pages/Learning'
import MyCourses from './pages/MyCourses'
import Quiz from './pages/Quiz'
import Certificates from './pages/Certificates'
import NotFound from './pages/NotFound'
import InstructorDashboard from './pages/instructor/InstructorDashboard'
import InstructorCourses from './pages/instructor/InstructorCourses'
import CreateCourse from './pages/instructor/CreateCourse'
import InstructorCourseDetail from './pages/instructor/InstructorCourseDetail'
import QuizManager from './pages/instructor/QuizManager'
import StudentProgress from './pages/instructor/StudentProgress'
import AdminLayout from './components/Layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import PendingCourses from './pages/admin/PendingCourses'
import UserManagement from './pages/admin/UserManagement'
import AdminCourses from './pages/admin/AdminCourses'
import PrivateRoute from './components/Auth/PrivateRoute'

// Separate component to use useLocation inside Router
const AppContent = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <Navbar />
      <main className="w-full py-4 sm:py-6">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={
              <PageTransition><Home /></PageTransition>
            } />
            <Route path="/login" element={
              <PageTransition><Login /></PageTransition>
            } />
            <Route path="/register" element={
              <PageTransition><Register /></PageTransition>
            } />
            <Route path="/courses" element={
              <PageTransition><Courses /></PageTransition>
            } />
            <Route path="/courses/:id" element={
              <PageTransition><CourseDetail /></PageTransition>
            } />

            {/* Protected Student Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <PageTransition><Dashboard /></PageTransition>
              </PrivateRoute>
            } />
            <Route path="/dashboard/my-courses" element={
              <PrivateRoute>
                <PageTransition><MyCourses /></PageTransition>
              </PrivateRoute>
            } />
            <Route path="/dashboard/certificates" element={
              <PrivateRoute>
                <PageTransition><Certificates /></PageTransition>
              </PrivateRoute>
            } />
            <Route path="/learn/:courseId" element={
              <PrivateRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                <PageTransition><Learning /></PageTransition>
              </PrivateRoute>
            } />
            <Route path="/quiz/:quizId" element={
              <PrivateRoute allowedRoles={['STUDENT']}>
                <PageTransition><Quiz /></PageTransition>
              </PrivateRoute>
            } />

            {/* Protected Instructor Routes */}
            <Route path="/instructor" element={
              <PrivateRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <PageTransition><InstructorDashboard /></PageTransition>
              </PrivateRoute>
            } />
            <Route path="/instructor/courses" element={
              <PrivateRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <PageTransition><InstructorCourses /></PageTransition>
              </PrivateRoute>
            } />
            <Route path="/instructor/courses/create" element={
              <PrivateRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <PageTransition><CreateCourse /></PageTransition>
              </PrivateRoute>
            } />
            <Route path="/instructor/courses/:id" element={
              <PrivateRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <PageTransition><InstructorCourseDetail /></PageTransition>
              </PrivateRoute>
            } />
            <Route path="/instructor/courses/:id/quiz" element={
              <PrivateRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <PageTransition><QuizManager /></PageTransition>
              </PrivateRoute>
            } />
            <Route path="/instructor/courses/:id/students" element={
              <PrivateRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <PageTransition><StudentProgress /></PageTransition>
              </PrivateRoute>
            } />

            {/* Protected Admin Routes - With AdminLayout */}
            <Route path="/admin" element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminLayout>
                  <PageTransition><AdminDashboard /></PageTransition>
                </AdminLayout>
              </PrivateRoute>
            } />
            <Route path="/admin/pending-courses" element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminLayout>
                  <PageTransition><PendingCourses /></PageTransition>
                </AdminLayout>
              </PrivateRoute>
            } />
            <Route path="/admin/users" element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminLayout>
                  <PageTransition><UserManagement /></PageTransition>
                </AdminLayout>
              </PrivateRoute>
            } />
            <Route path="/admin/courses" element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminLayout>
                  <PageTransition><AdminCourses /></PageTransition>
                </AdminLayout>
              </PrivateRoute>
            } />

            {/* 404 Not Found */}
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="!top-16 sm:!top-20"
      />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
