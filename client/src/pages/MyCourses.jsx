import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { PlayCircle, BookOpen, Award, Clock } from 'lucide-react'
import { Button } from '../components/ui'

const MyCourses = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/enrollments/my-courses')
      setEnrollments(response.data.enrollments || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch enrolled courses')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
        <p className="text-gray-600 mt-2">Continue where you left off</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Enrollments Yet</h3>
          <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
          <Button
            onClick={() => navigate('/courses')}
            variant="primary"
          >
            Browse Courses
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => {
            const course = enrollment.course
            const stats = enrollment.stats || {}

            return (
              <div
                key={enrollment.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Course Thumbnail */}
                <div className="relative h-48">
                  {course?.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-full flex items-center justify-center">
                      <span className="text-white text-6xl">📚</span>
                    </div>
                  )}
                  {/* Progress Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                    <span className={`font-semibold ${stats.progress === 100 ? 'text-green-600' : 'text-primary-600'}`}>
                      {stats.progress || 0}%
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Course Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course?.title || 'Untitled Course'}
                  </h3>

                  {/* Instructor */}
                  <p className="text-sm text-gray-500 mb-4">
                    By {course?.instructor?.name || 'Unknown'}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {stats.watchedChapters || 0} / {stats.totalChapters || 0} chapters
                      </span>
                      <span className={stats.progress === 100 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                        {stats.progress === 100 ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          stats.progress === 100 ? 'bg-green-500' : 'bg-primary-600'
                        }`}
                        style={{ width: `${stats.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {stats.totalChapters || 0} chapters
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {stats.remainingChapters || 0} left
                    </div>
                  </div>

                  {/* Action Button */}
                  {stats.progress === 100 ? (
                    <Button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      variant="success"
                      className="w-full"
                      icon={Award}
                      iconPosition="left"
                    >
                      View Certificate
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(`/learn/${course.id}`)}
                      variant="primary"
                      className="w-full"
                      icon={PlayCircle}
                      iconPosition="left"
                    >
                      {stats.watchedChapters > 0 ? 'Continue Learning' : 'Start Learning'}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyCourses
