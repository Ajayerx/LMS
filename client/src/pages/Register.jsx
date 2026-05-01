import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Button, AnimatedPage } from '../components/ui'
import { GraduationCap, User, Mail, Lock, ArrowRight, BookOpen, Users } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await register(formData)
      if (user.role === 'ADMIN') {
        navigate('/admin')
      } else if (user.role === 'INSTRUCTOR') {
        navigate('/instructor')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile Logo */}
            <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LearnHub</span>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
                <p className="text-gray-500">Join our community of learners</p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    I want to join as
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        formData.role === 'STUDENT'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <BookOpen className="w-6 h-6" />
                      <span className="font-medium text-sm">Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'INSTRUCTOR' })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        formData.role === 'INSTRUCTOR'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Users className="w-6 h-6" />
                      <span className="font-medium text-sm">Instructor</span>
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                By signing up, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
              </p>

              <div className="mt-6 text-center">
                <p className="text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold">LearnHub</span>
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
                Unlock your potential with expert-led courses
              </h1>
              
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-md">
                Whether you want to learn new skills or share your knowledge, we have the perfect platform for you.
              </p>
              
              <div className="space-y-4">
                {[
                  'Access 500+ courses from expert instructors',
                  'Learn at your own pace with lifetime access',
                  'Earn certificates upon completion'
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}

export default Register
