import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Award, 
  Search, 
  CheckCircle, 
  Play,
  ArrowRight,
  Star,
  Clock,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Quote
} from 'lucide-react'
import { Button, Card, Badge, AnimatedPage } from '../components/ui'
import api from '../api/axios'

// Animated gradient background component
const AnimatedGradient = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-info/20 via-info/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
  </div>
)

// Stats counter card
const StatCard = ({ icon: Icon, value, suffix, label, delay }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-4xl lg:text-5xl font-bold text-text-primary mb-1">
        {isVisible ? (
          <CountUp end={value} duration={2.5} suffix={suffix} />
        ) : (
          `0${suffix}`
        )}
      </div>
      <p className="text-text-secondary">{label}</p>
    </motion.div>
  )
}

// Course card for featured section
const CourseCard = ({ course }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="flex-shrink-0 w-80"
  >
    <Card className="h-full overflow-hidden group">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="primary">{course.category || 'Development'}</Badge>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <Play className="w-4 h-4" />
          {course.duration || '12h 30m'}
        </div>
      </div>

      {/* Course Info */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center text-secondary text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 font-medium">{course.rating || '4.8'}</span>
          </div>
          <span className="text-text-muted text-sm">
            ({course.reviewCount || '1.2k'} reviews)
          </span>
        </div>

        <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-300 flex items-center justify-center text-white text-xs font-medium">
            {course.instructor?.name?.[0] || 'I'}
          </div>
          <span className="text-sm text-text-secondary">
            {course.instructor?.name || 'Instructor Name'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border-color">
          <div className="flex items-center gap-1 text-text-muted text-sm">
            <Users className="w-4 h-4" />
            {course.enrollments || '2.5k'} students
          </div>
          <span className="text-xl font-bold text-primary">
            ${course.price || '49.99'}
          </span>
        </div>
      </div>
    </Card>
  </motion.div>
)

// Step component for How It Works
const Step = ({ number, icon: Icon, title, description, isLast }) => (
  <div className="relative flex flex-col items-center text-center">
    {/* Connection line */}
    {!isLast && (
      <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-border-color" />
    )}

    {/* Step number and icon */}
    <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-300 flex items-center justify-center shadow-glow mb-6">
      <Icon className="w-8 h-8 text-white" />
      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-white text-sm font-bold flex items-center justify-center">
        {number}
      </div>
    </div>

    <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
    <p className="text-text-secondary max-w-xs">{description}</p>
  </div>
)

// Footer component
const Footer = () => (
  <footer className="bg-dark-surface border-t border-border-color">
    <div className="container-custom py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-300 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LMS</span>
          </Link>
          <p className="text-text-muted mb-6">
            Empowering learners worldwide with quality education and recognized certifications.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-xl bg-dark-surface-hover flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-dark-surface-hover flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-dark-surface-hover flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-3">
            <li><Link to="/courses" className="text-text-muted hover:text-primary transition-colors">Browse Courses</Link></li>
            <li><Link to="/register" className="text-text-muted hover:text-primary transition-colors">Get Started</Link></li>
            <li><Link to="/login" className="text-text-muted hover:text-primary transition-colors">Sign In</Link></li>
            <li><Link to="/instructor" className="text-text-muted hover:text-primary transition-colors">Become Instructor</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-white mb-4">Categories</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Development</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Business</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Design</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Marketing</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-text-muted">
              <Mail className="w-4 h-4" />
              support@lms.com
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-8 border-t border-border-color flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-text-muted text-sm">
          © {new Date().getFullYear()} LMS. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-text-muted">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
)

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [stats, setStats] = useState({
    courses: 500,
    students: 10000,
    instructors: 100,
    certificates: 1000
  })

  useEffect(() => {
    // Fetch featured courses
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses?limit=6')
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
      <div className="min-h-screen">
        {/* ===== SECTION 1: HERO ===== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F0F1A]">
          {/* Background Orbs */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#6C63FF] opacity-20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#F59E0B] opacity-15 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center mb-8"
            >
              <span className="border border-primary/30 bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium">
                🚀 The Future of Learning is Here
              </span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Learn Without<br />
              <span className="gradient-text">Limits</span>
            </motion.h1>
            
            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto mb-8"
            >
              Join thousands of students mastering new skills with expert-led courses, 
              interactive quizzes, and verified certificates.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <Link to="/courses">
                <button className="btn-primary flex items-center gap-2">
                  Browse Courses
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/register">
                <button className="border border-primary/50 text-primary hover:bg-primary/10 rounded-xl px-6 py-3 font-medium transition-colors">
                  Become Instructor
                </button>
              </Link>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <span className="text-gray-400">Trusted by 10,000+ learners</span>
              <div className="flex -space-x-3">
                {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-300 flex items-center justify-center text-white text-sm font-medium border-2 border-[#0F0F1A]"
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 2: STATS BAR ===== */}
        <section className="py-16 bg-[#1A1A2E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-400 text-sm">Courses</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-gray-400 text-sm">Students</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">100+</div>
                <div className="text-gray-400 text-sm">Instructors</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">1K+</div>
                <div className="text-gray-400 text-sm">Certificates</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: FEATURED COURSES ===== */}
        <section className="py-20 bg-[#0F0F1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 relative inline-block">
                  Featured Courses
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></span>
                </h2>
                <p className="text-gray-400 mt-2">Handpicked by our experts</p>
              </div>
              <Link to="/courses" className="flex items-center gap-2 text-primary hover:text-primary-400 font-medium transition-colors">
                View All <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.slice(0, 6).map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-[#16213E] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-base text-white line-clamp-2 mb-3">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-300 flex items-center justify-center text-white text-xs font-medium">
                        {course.instructor.name[0]}
                      </div>
                      <span className="text-gray-400 text-sm">{course.instructor.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">${course.price}</span>
                      <button className="text-primary hover:text-primary-400 font-medium text-sm transition-colors">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 4: HOW IT WORKS ===== */}
        <section className="py-20 bg-[#1A1A2E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                How It Works
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center">
                {!false && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-gray-600" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-lg bg-purple-600 flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">🔍 Browse Courses</h3>
                <p className="text-gray-400 max-w-xs">Explore our extensive catalog of courses across various categories</p>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center">
                {!false && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-gray-600" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-lg bg-amber-500 flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-white text-sm font-bold flex items-center justify-center">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">📚 Enroll & Learn</h3>
                <p className="text-gray-400 max-w-xs">Enroll in your chosen course and start learning at your own pace</p>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-16 h-16 rounded-lg bg-green-500 flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 text-white text-sm font-bold flex items-center justify-center">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">🏆 Earn Certificate</h3>
                <p className="text-gray-400 max-w-xs">Complete the course assessments and earn a recognized certificate</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 5: TESTIMONIALS ===== */}
        <section className="py-20 bg-[#0F0F1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
              What Our Students Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 relative"
              >
                <Quote className="w-8 h-8 text-gray-500 mb-4" />
                <p className="text-gray-300 italic mb-6">
                  "The courses are comprehensive and the instructors are amazing. I learned web development from scratch and landed my dream job!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-300 flex items-center justify-center text-white font-medium">
                    RP
                  </div>
                  <div>
                    <div className="font-semibold text-white">Rahul Patel</div>
                    <div className="text-primary text-sm">Web Development</div>
                  </div>
                </div>
              </motion.div>
              
              {/* Testimonial 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 relative shadow-glow"
              >
                <Quote className="w-8 h-8 text-gray-500 mb-4" />
                <p className="text-gray-300 italic mb-6">
                  "Best learning platform I've ever used. The practical projects and real-world examples helped me understand complex concepts easily."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-success-300 flex items-center justify-center text-white font-medium">
                    AS
                  </div>
                  <div>
                    <div className="font-semibold text-white">Anita Sharma</div>
                    <div className="text-primary text-sm">Data Science</div>
                  </div>
                </div>
              </motion.div>
              
              {/* Testimonial 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 relative"
              >
                <Quote className="w-8 h-8 text-gray-500 mb-4" />
                <p className="text-gray-300 italic mb-6">
                  "The certificate I earned helped me get promoted at work. The quality of education and support is exceptional throughout."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-300 flex items-center justify-center text-white font-medium">
                    VK
                  </div>
                  <div>
                    <div className="font-semibold text-white">Vikram Kumar</div>
                    <div className="text-primary text-sm">UI/UX Design</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* ===== SECTION 6: CTA BANNER ===== */}
        <section className="py-20 bg-gradient-to-r from-[#6C63FF] to-[#5A52D5] relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Start Learning Today
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of students already advancing their careers with our expert-led courses
            </p>
            <button className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Get Started for Free
            </button>
          </div>
        </section>
        
        {/* ===== SECTION 7: FOOTER ===== */}
        <footer className="bg-[#0F0F1A] border-t border-[#2A2A4A] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Logo & Tagline */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-300 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">LMS</span>
                </div>
                <p className="text-gray-400 mb-6">
                  Empowering learners worldwide with quality education and recognized certifications.
                </p>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li><Link to="/courses" className="text-gray-400 hover:text-primary transition-colors">Browse Courses</Link></li>
                  <li><Link to="/register" className="text-gray-400 hover:text-primary transition-colors">Get Started</Link></li>
                  <li><Link to="/login" className="text-gray-400 hover:text-primary transition-colors">Sign In</Link></li>
                  <li><Link to="/instructor" className="text-gray-400 hover:text-primary transition-colors">Become Instructor</Link></li>
                </ul>
              </div>
              
              {/* For Instructors */}
              <div>
                <h4 className="font-semibold text-white mb-4">For Instructors</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Start Teaching</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Instructor Dashboard</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Teaching Guidelines</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Resources</a></li>
                </ul>
              </div>
              
              {/* Contact */}
              <div>
                <h4 className="font-semibold text-white mb-4">Contact</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    support@lms.com
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <Twitter className="w-4 h-4" />
                    @lms_platform
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Bottom bar */}
            <div className="mt-12 pt-8 border-t border-[#2A2A4A] flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} LMS. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AnimatedPage>
  )
}

export default Home
