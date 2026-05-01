import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../api/axios'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import {
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  XCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react'
import { Button, Card, Badge, Avatar, Spinner, ResponsiveTable } from '../../components/ui'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalInstructors: 0,
    totalStudents: 0,
    pendingCourses: 0,
    totalRevenue: 0
  })
  const [enrollmentData, setEnrollmentData] = useState([])
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState({
    recentEnrollments: [],
    recentCourses: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/api/admin/stats')
      const data = statsRes.data.stats
      setStats(data)
      setRecentActivity(statsRes.data.recentActivity || { recentEnrollments: [], recentCourses: [] })

      // Generate mock monthly enrollment data for the chart
      // In production, this would come from the backend
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      const mockData = months.map(month => ({
        month,
        enrollments: Math.floor(Math.random() * 100) + 20
      }))
      setEnrollmentData(mockData)
    } catch (err) {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  // KPI Card with trend arrow
  const KPICard = ({ icon: Icon, label, value, color, trend, trendValue, borderColor }) => {
    const isPositive = trend >= 0
    const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight

    return (
      <Card className={`p-5 border-l-4 ${borderColor}`} hover={false}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-text-muted text-sm">{label}</p>
            <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-success' : 'text-danger'}`}>
              <TrendIcon className="w-4 h-4" />
              <span>{Math.abs(trendValue)}%</span>
              <span className="text-text-muted ml-1">from last month</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" text="Loading admin dashboard..." />
      </div>
    )
  }

  // Mock pending courses
  const pendingCourses = [
    { id: 'p1', title: 'Advanced Machine Learning', instructor: { name: 'Dr. Sarah Chen' }, submittedAt: '2024-01-15', status: 'PENDING' },
    { id: 'p2', title: 'Mobile App Development with React Native', instructor: { name: 'Mike Johnson' }, submittedAt: '2024-01-14', status: 'PENDING' },
    { id: 'p3', title: 'Cloud Computing Fundamentals', instructor: { name: 'Emma Davis' }, submittedAt: '2024-01-13', status: 'PENDING' },
  ]

  // Mock recent users
  const recentUsers = [
    { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'STUDENT', joinedAt: '2024-01-15', isActive: true },
    { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', role: 'INSTRUCTOR', joinedAt: '2024-01-14', isActive: true },
    { id: 'u3', name: 'Carol White', email: 'carol@example.com', role: 'STUDENT', joinedAt: '2024-01-13', isActive: true },
    { id: 'u4', name: 'David Brown', email: 'david@example.com', role: 'STUDENT', joinedAt: '2024-01-12', isActive: false },
  ]

  const handleApprove = (courseId) => {
    // API call to approve course
  }

  const handleReject = (courseId) => {
    // API call to reject course
  }

  return (
    <div className="space-y-8">
      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-muted mt-1">Platform overview and management</p>
      </motion.div>

      {/* ===== KPI CARDS ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <KPICard
          icon={BookOpen}
          label="Total Courses"
          value={stats.totalCourses}
          color="bg-gradient-to-br from-primary to-primary-400"
          trend={8}
          trendValue={12}
          borderColor="border-l-primary"
        />
        <KPICard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          color="bg-gradient-to-br from-info to-info/80"
          trend={12}
          trendValue={15}
          borderColor="border-l-info"
        />
        <KPICard
          icon={GraduationCap}
          label="Enrollments"
          value={stats.totalEnrollments}
          color="bg-gradient-to-br from-success to-success/80"
          trend={24}
          trendValue={28}
          borderColor="border-l-success"
        />
        <KPICard
          icon={Clock}
          label="Pending Approval"
          value={stats.pendingCourses}
          color="bg-gradient-to-br from-secondary to-warning"
          trend={-2}
          trendValue={2}
          borderColor="border-l-secondary"
        />
      </motion.div>

      {/* ===== ENROLLMENT TREND CHART ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Enrollment Trends</h2>
              <p className="text-text-muted text-sm">Last 6 months</p>
            </div>
            <Badge variant="success">+24% growth</Badge>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#6C63FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEnrollments)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ===== PENDING COURSE APPROVALS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border-l-4 border-l-secondary">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Pending Approvals</h2>
                <p className="text-text-muted text-sm">{pendingCourses.length} courses awaiting review</p>
              </div>
              <Button variant="ghost" size="sm" icon={ChevronRight} iconPosition="right">
                View All
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-3">
              {pendingCourses.map((course) => (
                <motion.div 
                  key={course.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-light-tertiary dark:bg-dark-tertiary"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-warning flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-text-primary truncate">{course.title}</p>
                        <div className="flex items-center gap-2 text-sm text-text-muted flex-wrap">
                          <Avatar name={course.instructor.name} size="xs" />
                          <span className="truncate">{course.instructor.name}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{new Date(course.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="warning" size="sm" className="flex-shrink-0">Pending</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="success" 
                      icon={CheckCircle}
                      onClick={() => handleApprove(course.id)}
                      className="flex-1 sm:flex-none min-h-[44px]"
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger" 
                      icon={XCircle}
                      onClick={() => handleReject(course.id)}
                      className="flex-1 sm:flex-none min-h-[44px]"
                    >
                      Reject
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ===== RECENT USERS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 border-l-4 border-l-info">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Recent Users</h2>
                <p className="text-text-muted text-sm">Latest platform registrations</p>
              </div>
              <Button variant="ghost" size="sm" icon={ChevronRight} iconPosition="right">
                Manage Users
              </Button>
            </div>

            <div className="space-y-2">
              {recentUsers.map((user) => (
                <motion.div 
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-light-tertiary/50 dark:hover:bg-dark-tertiary/50 transition-colors min-h-[56px]"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar name={user.name} size="sm" online={user.isActive} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text-primary text-sm truncate">{user.name}</p>
                      <p className="text-xs text-text-muted truncate hidden sm:block">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge 
                      variant={user.role === 'INSTRUCTOR' ? 'primary' : user.role === 'ADMIN' ? 'danger' : 'secondary'}
                      size="sm"
                    >
                      {user.role}
                    </Badge>
                    <span className="text-xs text-text-muted hidden sm:inline">
                      {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
