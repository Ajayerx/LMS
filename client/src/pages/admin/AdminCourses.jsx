import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { Search, Eye, Filter, BookOpen, Users, Clock } from 'lucide-react'

const AdminCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const statusOptions = [
    { value: 'ALL', label: 'All Status', color: 'bg-gray-100 text-gray-700' },
    { value: 'APPROVED', label: 'Approved', color: 'bg-green-100 text-green-700' },
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-700' }
  ]

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/admin/courses')
      setCourses(response.data.courses || [])
    } catch (err) {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesStatus = statusFilter === 'ALL' || course.status === statusFilter
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusBadge = (status) => {
    const styles = {
      APPROVED: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      REJECTED: 'bg-red-100 text-red-700'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    )
  }

  // Calculate stats
  const stats = {
    total: courses.length,
    approved: courses.filter(c => c.status === 'APPROVED').length,
    pending: courses.filter(c => c.status === 'PENDING').length,
    rejected: courses.filter(c => c.status === 'REJECTED').length
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
        <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
        <p className="text-gray-600 mt-2">Manage all courses on the platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-xl font-bold">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-xl font-bold">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses by title, description, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No courses found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Instructor</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Students</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Chapters</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCourses.map((course) => (
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
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                          {course.instructor?.name?.[0] || '?'}
                        </div>
                        <span className="ml-2 text-sm text-gray-700">
                          {course.instructor?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(course.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {course._count?.enrollments || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course._count?.chapters || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${course.price || 'Free'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={`/courses/${course.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          title="View Course"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredCourses.length} of {courses.length} courses
      </div>
    </div>
  )
}

export default AdminCourses
