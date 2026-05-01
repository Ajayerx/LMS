import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { ArrowLeft, Users, Search, Mail, Award } from 'lucide-react'
import { Button } from '../../components/ui'

const StudentProgress = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgProgress: 0,
    completedCount: 0
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      // Get course details
      const courseRes = await axios.get(`/api/courses/${id}`)
      setCourse(courseRes.data.course || courseRes.data)

      // Get students - using admin endpoint with course filter or creating a custom approach
      // Since we don't have a direct endpoint, we'll get enrollments and fetch student details
      // For now, we'll use a workaround by fetching admin stats
      const adminStatsRes = await axios.get(`/api/admin/courses/${id}/analytics`).catch(() => null)

      if (adminStatsRes?.data?.recentEnrollments) {
        const enrollments = adminStatsRes.data.recentEnrollments
        setStudents(enrollments.map(e => ({
          id: e.student.id,
          name: e.student.name,
          email: e.student.email || 'N/A',
          progress: e.progress || 0,
          enrolledAt: e.enrolledAt,
          completed: e.progress === 100
        })))

        setStats({
          totalStudents: adminStatsRes.data.analytics?.totalEnrollments || 0,
          avgProgress: adminStatsRes.data.analytics?.averageProgress || 0,
          completedCount: adminStatsRes.data.analytics?.completedCount || 0
        })
      }
    } catch (err) {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 20) return 'bg-yellow-500'
    return 'bg-red-500'
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
      <Button
        onClick={() => navigate(`/instructor/courses/${id}`)}
        variant="ghost"
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Course
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Progress</h1>
        <p className="text-gray-600 mt-1">{course?.title}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Avg. Progress</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(stats.avgProgress)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents - stats.completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No enrolled students yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Enrolled Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Progress</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                          {student.name?.[0] || '?'}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{student.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(student.enrolledAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(student.progress)}`}
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {student.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.progress === 100 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Completed
                        </span>
                      ) : student.progress > 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          In Progress
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          Not Started
                        </span>
                      )}
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

export default StudentProgress
