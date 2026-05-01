import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { CheckCircle, XCircle, Eye, BookOpen, User } from 'lucide-react'

const PendingCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})

  useEffect(() => {
    fetchPendingCourses()
  }, [])

  const fetchPendingCourses = async () => {
    try {
      const response = await axios.get('/api/admin/pending-courses')
      setCourses(response.data.courses || [])
    } catch (err) {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (courseId) => {
    setProcessing(prev => ({ ...prev, [courseId]: 'approving' }))
    try {
      await axios.patch(`/api/courses/${courseId}/approve`, { status: 'APPROVED' })
      setCourses(courses.filter(c => c.id !== courseId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve course')
    } finally {
      setProcessing(prev => ({ ...prev, [courseId]: null }))
    }
  }

  const handleReject = async (courseId) => {
    if (!confirm('Are you sure you want to reject this course?')) return

    setProcessing(prev => ({ ...prev, [courseId]: 'rejecting' }))
    try {
      await axios.patch(`/api/courses/${courseId}/approve`, { status: 'REJECTED' })
      setCourses(courses.filter(c => c.id !== courseId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject course')
    } finally {
      setProcessing(prev => ({ ...prev, [courseId]: null }))
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pending Courses</h1>
        <p className="text-gray-600 mt-2">
          Review and approve courses submitted by instructors
        </p>
      </div>

      {/* Stats */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-yellow-100 rounded-full">
            <BookOpen className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            <p className="text-sm text-gray-600">Courses awaiting approval</p>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-500">No pending courses to review</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Instructor</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Chapters</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Submitted</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {course.title[0]}
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {course.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="ml-2 text-sm text-gray-700">
                          {course.instructor?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course._count?.chapters || 0} chapters
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${course.price || 'Free'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={`/courses/${course.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          title="Preview"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => handleApprove(course.id)}
                          disabled={processing[course.id]}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                        >
                          {processing[course.id] === 'approving' ? (
                            <span className="animate-spin mr-2">⏳</span>
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(course.id)}
                          disabled={processing[course.id]}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                        >
                          {processing[course.id] === 'rejecting' ? (
                            <span className="animate-spin mr-2">⏳</span>
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PendingCourses
