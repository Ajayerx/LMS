import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Lock, PlayCircle, CheckCircle } from 'lucide-react'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [enrollment, setEnrollment] = useState(null)

  useEffect(() => {
    fetchCourse()
    if (user) {
      checkEnrollment()
    }
  }, [id, user])

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/api/courses/${id}`)
      setCourse(response.data.course || response.data)
    } catch (err) {
      setError('Failed to fetch course details')
    } finally {
      setLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const response = await api.get(`/api/enrollments/course/${id}`)
      setEnrollment(response.data.enrollment)
    } catch (err) {
      setEnrollment(null)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setEnrolling(true)
    setError('')
    setSuccess('')

    try {
      await api.post(`/api/enrollments/${id}`)
      setSuccess('Successfully enrolled!')
      checkEnrollment()
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  const isEnrolled = !!enrollment
  const isInstructor = course?.instructorId === user?.id

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Course Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative h-64 bg-gradient-to-r from-primary-500 to-primary-600">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-white text-8xl">📚</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
            <p className="text-white/90 text-lg">{course.description}</p>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center text-primary-700 text-xl font-bold">
                {course.instructor?.name?.[0] || '?'}
              </div>
              <div className="ml-4">
                <p className="font-semibold text-lg">{course.instructor?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">Instructor</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">${course.price || 'Free'}</div>
                <div className="text-sm text-gray-500">Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{course._count?.enrollments || 0}</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{course.chapters?.length || 0}</div>
                <div className="text-sm text-gray-500">Chapters</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4">
              {success}
            </div>
          )}

          {!isEnrolled && !isInstructor && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 text-lg"
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}

          {isEnrolled && !isInstructor && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Your Progress</span>
                  <span className="font-bold">{enrollment?.progress || 0}%</span>
                </div>
                <div className="mt-2 bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${enrollment?.progress || 0}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/learn/${id}`)}
                className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 text-lg flex items-center justify-center"
              >
                <PlayCircle className="w-6 h-6 mr-2" />
                Continue Learning
              </button>
            </div>
          )}

          {isInstructor && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg text-center font-medium">
              You are the instructor of this course
            </div>
          )}
        </div>
      </div>

      {/* Course Chapters */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Course Content</h2>
        {course.chapters && course.chapters.length > 0 ? (
          <div className="space-y-3">
            {course.chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`p-4 rounded-lg border ${isEnrolled || isInstructor ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-75'}`}
                onClick={() => (isEnrolled || isInstructor) && navigate(`/learn/${id}?chapter=${chapter.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold">
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                      <p className="text-sm text-gray-500">
                        {chapter.duration ? `${Math.round(chapter.duration / 60)} min` : 'No duration'}
                      </p>
                    </div>
                  </div>
                  {isEnrolled || isInstructor ? (
                    <PlayCircle className="w-6 h-6 text-primary-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No chapters available yet.</p>
        )}
      </div>
    </div>
  )
}

export default CourseDetail
