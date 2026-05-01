import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api/axios'
import { Button, Card, ProgressBar, Badge, Avatar, PageWrapper } from '../components/ui'
import { 
  BookOpen, 
  Award, 
  PlayCircle, 
  TrendingUp,
  GraduationCap,
  HelpCircle,
  Clock,
  ChevronRight,
  Sparkles,
  Target
} from 'lucide-react'
import { CourseCard, CourseCardSkeleton } from '../components/courses'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [enrollmentsRes, certificatesRes] = await Promise.all([
        axios.get('/api/enrollments/my-courses'),
        axios.get('/api/certificates/my-certificates')
      ])
      setEnrollments(enrollmentsRes.data.enrollments || [])
      setCertificates(certificatesRes.data.certificates || [])
    } catch (err) {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const completedCourses = enrollments.filter(e => e.stats?.progress === 100).length
  const inProgressCourses = enrollments.filter(e => e.stats?.progress > 0 && e.stats?.progress < 100).length
  const quizzesTaken = 12 // Mock data - would come from API

  return (
    <div className="w-full py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient mb-3 tracking-tight">
          Student Dashboard
        </h1>
        <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-4xl">
          Welcome back! Track your learning progress and continue your journey.
        </p>
      </motion.div>
      {/* ===== WELCOME BANNER ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-600 rounded-2xl p-6 lg:p-8 text-white"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            <span className="text-white/80 text-sm font-medium">Welcome Back</span>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-white/80 max-w-xl">
            {enrollments.length > 0 
              ? "You're making great progress! Keep learning and growing your skills."
              : "Ready to start your learning journey? Explore our courses and begin today!"
            }
          </p>
        </div>
      </motion.div>

      {/* ===== STATS ROW ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { 
            icon: BookOpen, 
            label: 'Enrolled', 
            value: enrollments.length,
            gradient: 'from-primary to-primary-400',
            bgColor: 'bg-primary/10'
          },
          { 
            icon: Award, 
            label: 'Completed', 
            value: completedCourses,
            gradient: 'from-success to-success/80',
            bgColor: 'bg-success/10'
          },
          { 
            icon: GraduationCap, 
            label: 'Certificates', 
            value: certificates.length,
            gradient: 'from-secondary to-warning',
            bgColor: 'bg-secondary/10'
          },
          { 
            icon: HelpCircle, 
            label: 'Quizzes Taken', 
            value: quizzesTaken,
            gradient: 'from-info to-info/80',
            bgColor: 'bg-info/10'
          },
        ].map((stat, index) => (
          <Card key={index} className="p-4 lg:p-5" hover={false}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* ===== CONTINUE LEARNING ===== */}
      {enrollments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Continue Learning</h2>
              <p className="text-text-muted text-sm">Pick up where you left off</p>
            </div>
            <Link to="/dashboard/my-courses">
              <Button variant="ghost" size="sm" icon={ChevronRight} iconPosition="right">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.slice(0, 3).map((enrollment, index) => {
              const course = enrollment.course
              const stats = enrollment.stats || {}
              const progress = stats.progress || 0

              return (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-300 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text-primary truncate">
                          {course?.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                          <Avatar name={course?.instructor?.name} size="xs" />
                          <span className="truncate">{course?.instructor?.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-text-muted">{progress}% complete</span>
                        <span className="text-text-muted">
                          {stats.watchedChapters || 0}/{stats.totalChapters || 0} chapters
                        </span>
                      </div>
                      <ProgressBar progress={progress} size="sm" showLabel={false} />
                    </div>

                    <Button
                      variant={progress === 100 ? 'ghost' : 'primary'}
                      size="sm"
                      fullWidth
                      icon={progress === 100 ? Award : PlayCircle}
                      onClick={() => navigate(`/learn/${course?.id}`)}
                    >
                      {progress === 100 ? 'View Certificate' : 'Continue'}
                    </Button>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* ===== RECOMMENDED COURSES ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Recommended For You</h2>
            <p className="text-text-muted text-sm">Based on your interests</p>
          </div>
          <Link to="/courses">
            <Button variant="ghost" size="sm" icon={ChevronRight} iconPosition="right">
              Browse All
            </Button>
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Start Your Journey</h3>
            <p className="text-text-muted mb-4 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Explore our catalog and find something that interests you!
            </p>
            <Link to="/courses">
              <Button icon={BookOpen}>Browse Courses</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mock recommended courses - would come from API */}
            {[
              { id: 'rec1', title: 'Advanced JavaScript Patterns', instructor: { name: 'Sarah Johnson' }, price: 59.99, rating: 4.9 },
              { id: 'rec2', title: 'UI Design Principles', instructor: { name: 'Mike Chen' }, price: 49.99, rating: 4.8 },
              { id: 'rec3', title: 'Data Analytics Basics', instructor: { name: 'Emma Davis' }, price: 44.99, rating: 4.7 },
            ].map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-soft-lg transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-warning flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="secondary" size="sm" className="mb-1">Recommended</Badge>
                      <h3 className="font-semibold text-text-primary text-sm truncate">
                        {course.title}
                      </h3>
                      <p className="text-xs text-text-muted">{course.instructor.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-secondary text-sm">
                      <span>★</span>
                      <span>{course.rating}</span>
                    </div>
                    <span className="font-bold text-text-primary">${course.price}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Dashboard
