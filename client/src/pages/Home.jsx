import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Award, 
  ArrowRight,
  Star,
  Play,
  CheckCircle,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react'
import { Button, Card, Badge, AnimatedPage } from '../components/UI'
import api from '../api/axios'

// Stats data
const stats = [
  { label: 'Active Students', value: '10,000+', icon: Users },
  { label: 'Expert Instructors', value: '100+', icon: GraduationCap },
  { label: 'Quality Courses', value: '500+', icon: BookOpen },
  { label: 'Certificates Issued', value: '1,000+', icon: Award },
]

// Features data
const features = [
  {
    title: 'Learn from experts',
    description: 'Get access to courses created by industry professionals with real-world experience.',
    icon: GraduationCap,
  },
  {
    title: 'Interactive learning',
    description: 'Engage with quizzes, projects, and hands-on exercises to reinforce your knowledge.',
    icon: BookOpen,
  },
  {
    title: 'Earn certificates',
    description: 'Receive verified certificates upon completion to showcase your achievements.',
    icon: Award,
  },
]

// Course Card Component
const CourseCard = ({ course }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="overflow-hidden h-full" hover={false}>
      {/* Course Image */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="primary-solid" size="sm">{course.category || 'Development'}</Badge>
        </div>
      </div>

      {/* Course Info */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center text-warning-500 text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 font-medium">{course.rating || '4.8'}</span>
          </div>
          <span className="text-gray-400 text-sm">
            ({course.reviewCount || '1.2k'} reviews)
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-medium">
            {course.instructor?.name?.[0] || 'I'}
          </div>
          <span className="text-sm text-gray-600">
            {course.instructor?.name || 'Instructor Name'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Users className="w-4 h-4" />
            {course.enrollments || '2.5k'} students
          </div>
          <span className="text-xl font-bold text-primary-600">
            ${course.price || '49.99'}
          </span>
        </div>
      </div>
    </Card>
  </motion.div>
)

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">LearnHub</span>
          </Link>
          <p className="text-gray-400 mb-6">
            Empowering learners worldwide with quality education and recognized certifications.
          </p>
          <div className="flex gap-4">
            {[Twitter, Linkedin, Github].map((Icon, i) => (
              <a 
                key={i} 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3">
            {['Browse Courses', 'Get Started', 'Sign In', 'Become Instructor'].map((link) => (
              <li key={link}>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold mb-4">Categories</h4>
          <ul className="space-y-3">
            {['Development', 'Business', 'Design', 'Marketing'].map((cat) => (
              <li key={cat}>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">{cat}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <div className="flex items-center gap-2 text-gray-400">
            <Mail className="w-4 h-4" />
            support@learnhub.com
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm">
          {new Date().getFullYear()} LearnHub. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
)

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses?limit=6')
        setFeaturedCourses(response.data.courses || [])
      } catch (err) {
        // Use mock data if API fails
        setFeaturedCourses([
          { id: 1, title: 'Complete Web Development Bootcamp', instructor: { name: 'John Doe' }, price: 49.99, rating: 4.8, enrollments: '12.5k', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', category: 'Development' },
          { id: 2, title: 'Data Science Fundamentals with Python', instructor: { name: 'Jane Smith' }, price: 59.99, rating: 4.9, enrollments: '8.2k', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', category: 'Data Science' },
          { id: 3, title: 'UI/UX Design Masterclass', instructor: { name: 'Mike Johnson' }, price: 44.99, rating: 4.7, enrollments: '6.1k', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', category: 'Design' },
          { id: 4, title: 'Digital Marketing Strategy', instructor: { name: 'Sarah Williams' }, price: 39.99, rating: 4.6, enrollments: '4.8k', thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800', category: 'Marketing' },
          { id: 5, title: 'Mobile App Development', instructor: { name: 'Alex Chen' }, price: 54.99, rating: 4.8, enrollments: '7.3k', thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', category: 'Development' },
          { id: 6, title: 'Machine Learning Basics', instructor: { name: 'Dr. Patel' }, price: 69.99, rating: 4.9, enrollments: '9.1k', thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800', category: 'AI/ML' },
        ])
      }
    }
    fetchCourses()
  }, [])

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                The Future of Learning is Here
              </motion.div>
              
              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Learn Without{' '}
                <span className="text-primary-600">Limits</span>
              </motion.h1>
              
              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8"
              >
                Join thousands of students mastering new skills with expert-led courses, 
                interactive quizzes, and verified certificates.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link to="/courses">
                  <Button size="lg" icon={ArrowRight} iconPosition="right">
                    Browse Courses
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Become Instructor
                  </Button>
                </Link>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
              >
                <span className="text-gray-500">Trusted by 10,000+ learners</span>
                <div className="flex -space-x-2">
                  {['J', 'S', 'M', 'K', 'A'].map((letter, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium border-2 border-white"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Courses</h2>
                <p className="text-gray-600">Handpicked by our experts</p>
              </div>
              <Link to="/courses" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                View All <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Course Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.slice(0, 6).map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/courses/${course.id}`}>
                    <CourseCard course={course} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose LearnHub?
              </h2>
              <p className="text-gray-600">
                We provide everything you need to succeed in your learning journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center p-8" hover={false}>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary-600 rounded-3xl p-8 md:p-16 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start Learning?
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                  Join thousands of students who are already learning and growing with LearnHub.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button 
                      size="lg" 
                      className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/courses">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-white text-white hover:bg-white/10"
                    >
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </AnimatedPage>
  )
}

export default Home
