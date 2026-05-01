import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { CourseCard, CourseCardSkeleton } from '../components/courses'
import { StaggerContainer, StaggerItem, AnimatedPage } from '../components/ui'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses')
      setCourses(response.data.courses || response.data)
    } catch (err) {
      setError('Failed to fetch courses')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId, e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/login')
      return
    }

    try {
      await axios.post(`/api/enrollments/${courseId}`)
      navigate(`/courses/${courseId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed')
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-8">All Courses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <CourseCardSkeleton count={6} />
        </div>
      </div>
    )
  }

  return (
    <AnimatedPage>
      <div className="w-full py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient mb-6 lg:mb-8 tracking-tight"
      >
        All Courses
      </motion.h1>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl mb-6"
        >
          {error}
        </motion.div>
      )}

      {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop, 4 col large */}
      <StaggerContainer 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        staggerDelay={0.05}
      >
        {courses.map((course) => (
          <StaggerItem key={course.id}>
            <CourseCard course={course} />
          </StaggerItem>
        ))}
      </StaggerContainer>
      </div>
    </AnimatedPage>
  )
}

export default Courses
