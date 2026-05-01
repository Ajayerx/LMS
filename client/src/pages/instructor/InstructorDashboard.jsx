import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { 
  BookOpen, 
  Users, 
  Clock, 
  Plus, 
  TrendingUp, 
  Star,
  ChevronRight,
  DollarSign,
  BarChart3,
  GraduationCap,
  MoreHorizontal
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { Button, Card, Badge, Avatar, Spinner, ResponsiveTable } from '../../components/ui'

const InstructorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalEnrollments: 0,
    pendingApprovals: 0,
    recentEnrollments: []
  })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstructorData()
  }, [])

  const fetchInstructorData = async () => {
    try {
      // Get instructor courses
      const coursesRes = await axios.get('/api/courses/instructor/my-courses')
      const instructorCourses = coursesRes.data.courses || []
      setCourses(instructorCourses)

      // Calculate stats
      const pendingCount = instructorCourses.filter(c => c.status === 'PENDING').length
      const totalEnrollments = instructorCourses.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0)

      setStats({
        totalCourses: instructorCourses.length,
        totalEnrollments,
        pendingApprovals: pendingCount,
        recentEnrollments: [] // Could be fetched from a separate endpoint
      })
    } catch (err) {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  // Mock revenue data - would come from API
  const revenueData = [
    { month: 'Jan', enrollments: 45, revenue: 2250 },
    { month: 'Feb', enrollments: 52, revenue: 2600 },
    { month: 'Mar', enrollments: 38, revenue: 1900 },
    { month: 'Apr', enrollments: 65, revenue: 3250 },
    { month: 'May', enrollments: 78, revenue: 3900 },
    { month: 'Jun', enrollments: 92, revenue: 4600 },
  ]

  // Mock recent enrollments
  const recentEnrollments = [
    { id: 1, student: { name: 'Alice Johnson' }, course: { title: 'Web Development Bootcamp' }, date: '2024-01-15' },
    { id: 2, student: { name: 'Bob Smith' }, course: { title: 'UI Design Masterclass' }, date: '2024-01-14' },
    { id: 3, student: { name: 'Carol White' }, course: { title: 'Web Development Bootcamp' }, date: '2024-01-14' },
    { id: 4, student: { name: 'David Brown' }, course: { title: 'Data Science Basics' }, date: '2024-01-13' },
    { id: 5, student: { name: 'Emma Davis' }, course: { title: 'UI Design Masterclass' }, date: '2024-01-12' },
  ]

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)

  return (
    <div className="space-y-8">
      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">Instructor Dashboard</h1>
        <p className="text-text-muted mt-1">Welcome back, {user?.name}</p>
      </motion.div>

      {/* ===== STATS CARDS ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { 
            icon: BookOpen, 
            label: 'Total Courses', 
            value: stats.totalCourses,
            gradient: 'from-primary to-primary-400',
            trend: '+12%'
          },
          { 
            icon: Users, 
            label: 'Total Students', 
            value: stats.totalEnrollments,
            gradient: 'from-success to-success/80',
            trend: '+24%'
          },
          { 
            icon: Clock, 
            label: 'Pending Approval', 
            value: stats.pendingApprovals,
            gradient: 'from-secondary to-warning',
            trend: stats.pendingApprovals > 0 ? 'Action needed' : 'All clear'
          },
          { 
            icon: Star, 
            label: 'Avg. Rating', 
            value: '4.8',
            gradient: 'from-info to-info/80',
            trend: '98 reviews'
          },
        ].map((stat, index) => (
          <Card key={index} className="p-4 lg:p-5" hover={false}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.trend?.includes('+') ? 'text-success' : 'text-text-muted'}`}>
                  {stat.trend}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* ===== CHARTS & RECENT ACTIVITY ===== */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Monthly Enrollments</h2>
                <p className="text-text-muted text-sm">Revenue: ${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">+28% this month</Badge>
              </div>
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.1)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                  <Bar dataKey="enrollments" radius={[4, 4, 0, 0]}>
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Recent Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Recent Enrollments</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>

            <div className="space-y-3">
              {recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center gap-3 p-3 rounded-lg bg-light-tertiary dark:bg-dark-tertiary">
                  <Avatar name={enrollment.student.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary text-sm truncate">
                      {enrollment.student.name}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {enrollment.course.title}
                    </p>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(enrollment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-r from-primary to-primary-600 text-white border-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Create a New Course</h2>
              <p className="text-white/80">Share your knowledge with students worldwide</p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              icon={Plus}
              onClick={() => navigate('/instructor/courses/create')}
              className="bg-white text-primary hover:bg-white/90"
            >
              Create Course
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* ===== COURSES TABLE ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">My Courses</h2>
            <Link to="/instructor/courses">
              <Button variant="ghost" size="sm" icon={ChevronRight} iconPosition="right">
                View All
              </Button>
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">No courses yet</h3>
              <p className="text-text-muted mb-4">Create your first course and start teaching!</p>
              <Button icon={Plus} onClick={() => navigate('/instructor/courses/create')}>
                Create Course
              </Button>
            </div>
          ) : (
            <ResponsiveTable
              data={courses.slice(0, 5)}
              onRowClick={(course) => navigate(`/instructor/courses/${course.id}`)}
              emptyMessage="No courses found"
              columns={[
                { 
                  key: 'title', 
                  label: 'Course',
                  render: (value, course) => (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-300 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {value[0]}
                      </div>
                      <div className="min-w-0">
                      <p className="font-medium text-text-primary truncate">{value}</p>
                        <p className="text-sm text-text-muted">{course._count?.chapters || 0} chapters</p>
                      </div>
                    </div>
                  )
                },
                { 
                  key: 'status', 
                  label: 'Status',
                  hideOnMobile: true,
                  render: (value) => (
                    <Badge 
                      variant={value === 'APPROVED' ? 'success' : value === 'PENDING' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {value}
                    </Badge>
                  )
                },
                { 
                  key: 'enrollments', 
                  label: 'Students',
                  hideOnMobile: true,
                  render: (_, course) => course._count?.enrollments || 0
                },
                { 
                  key: 'revenue', 
                  label: 'Revenue',
                  render: (_, course) => `$${((course._count?.enrollments || 0) * (course.price || 0)).toLocaleString()}`
                },
              ]}
            />
          )}
        </Card>
      </motion.div>
    </div>
  )
}

export default InstructorDashboard
