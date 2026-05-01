import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import ReactPlayer from 'react-player'
import api from '../api/axios'
import { 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Lock,
  Menu,
  X,
  User,
  FileText,
  MessageSquare,
  HelpCircle,
  Award,
  BookOpen,
  MoreHorizontal
} from 'lucide-react'
import { Button, Badge, Card, ProgressBar, EmptyState, Avatar } from '../components/ui'

const Learning = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const [course, setCourse] = useState(null)
  const [chapters, setChapters] = useState([])
  const [progress, setProgress] = useState(null)
  const [currentChapterId, setCurrentChapterId] = useState(searchParams.get('chapter'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [markingWatched, setMarkingWatched] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [courseId])

  const fetchData = async () => {
    try {
      // Fetch course chapters
      const chaptersRes = await api.get(`/course/${courseId}/chapters`)
      setChapters(chaptersRes.data.chapters || [])

      // Fetch course details
      const courseRes = await api.get(`/courses/${courseId}`)
      setCourse(courseRes.data.course || courseRes.data)

      // Fetch progress
      const progressRes = await api.get(`/progress/course/${courseId}`)
      setProgress(progressRes.data)

      // Set first unwatched chapter as default if no chapter specified
      if (!currentChapterId && chaptersRes.data.chapters?.length > 0) {
        const unwatched = chaptersRes.data.chapters.find(
          (ch, idx) => !progressRes.data?.chapters?.[idx]?.progress?.watched
        )
        setCurrentChapterId(unwatched?.id || chaptersRes.data.chapters[0].id)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course content')
    } finally {
      setLoading(false)
    }
  }

  const currentChapter = chapters.find(ch => ch.id === currentChapterId)
  const currentChapterIndex = chapters.findIndex(ch => ch.id === currentChapterId)
  const isWatched = currentChapterId ? isChapterWatched(currentChapterId) : false

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterId(chapters[currentChapterIndex - 1].id)
    }
  }

  const handleNextChapter = async () => {
    if (currentChapterId && !isWatched) {
      // Mark current as watched
      await handleVideoEnd()
    }
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterId(chapters[currentChapterIndex + 1].id)
    }
  }

  const handleVideoEnd = async () => {
    if (!currentChapterId || markingWatched) return

    setMarkingWatched(true)
    try {
      await api.post(`/progress/${currentChapterId}`)
      // Refresh progress
      const progressRes = await api.get(`/progress/course/${courseId}`)
      setProgress(progressRes.data)
    } catch (err) {
      // Error handling
    } finally {
      setMarkingWatched(false)
    }
  }

  const isChapterWatched = (chapterId) => {
    const chapterProgress = progress?.chapters?.find(
      p => p.id === chapterId || p.chapterId === chapterId
    )
    return chapterProgress?.progress?.watched || false
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '--'
    const mins = Math.round(seconds / 60)
    return `${mins} min`
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col">
        <div className="h-1 bg-light-tertiary dark:bg-dark-tertiary">
          <div className="h-full w-1/3 bg-primary animate-pulse" />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-text-secondary">Loading course content...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-4">
        <Card className="max-w-md text-center p-8">
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-danger" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Failed to Load Course
          </h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={() => navigate('/dashboard/my-courses')}>
            Go to My Courses
          </Button>
        </Card>
      </div>
    )
  }

  // Chapter completion percentage
  const completionPercentage = progress?.stats?.percentage || 0
  const watchedChapters = progress?.chapters?.filter(ch => ch.progress?.watched).length || 0

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex flex-col">
      {/* ===== TOP PROGRESS BAR ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-light-tertiary dark:bg-dark-tertiary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary to-primary-300"
        />
      </div>

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-40 bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-lg border-b border-border-color">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Back + Course Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/my-courses')}
              className="flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="font-semibold text-text-primary truncate max-w-[200px] sm:max-w-md">
                {course?.title}
              </h1>
              <p className="text-xs text-text-muted hidden sm:block">
                {watchedChapters} of {chapters.length} chapters completed
              </p>
            </div>
          </div>

          {/* Right: Progress + Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-text-secondary">
                {completionPercentage}% complete
              </span>
              <div className="w-32">
                <ProgressBar progress={completionPercentage} size="sm" showLabel={false} />
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="hidden lg:block w-80 bg-light-surface dark:bg-dark-surface border-r border-border-color overflow-y-auto">
          {/* Course Title Section */}
          <div className="p-4 border-b border-border-color">
            <Badge variant="primary" size="sm" className="mb-2">
              {course?.category || 'Course'}
            </Badge>
            <h2 className="font-semibold text-text-primary line-clamp-2">
              {course?.title}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
              <BookOpen className="w-4 h-4" />
              {chapters.length} chapters
            </div>
          </div>

          {/* Chapter List */}
          <div className="p-3">
            <div className="space-y-1">
              {chapters.map((chapter, index) => {
                const isWatched = isChapterWatched(chapter.id)
                const isActive = chapter.id === currentChapterId
                const isLocked = !user && index > 0 // Example lock logic

                return (
                  <motion.button
                    key={chapter.id}
                    onClick={() => !isLocked && setCurrentChapterId(chapter.id)}
                    whileHover={{ x: isLocked ? 0 : 2 }}
                    whileTap={{ scale: isLocked ? 1 : 0.98 }}
                    disabled={isLocked}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                      ${isActive 
                        ? 'bg-primary text-white shadow-glow' 
                        : isWatched
                        ? 'bg-light-tertiary dark:bg-dark-tertiary text-text-primary'
                        : isLocked
                        ? 'opacity-50 cursor-not-allowed text-text-muted'
                        : 'hover:bg-light-tertiary dark:hover:bg-dark-tertiary text-text-primary'
                      }
                    `}
                  >
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : isWatched ? (
                        <CheckCircle className={`w-5 h-5 ${isActive ? 'text-white' : 'text-success'}`} />
                      ) : (
                        <PlayCircle className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                      )}
                    </div>

                    {/* Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${isActive ? 'text-white' : ''}`}>
                        {index + 1}. {chapter.title}
                      </p>
                      <div className={`flex items-center gap-2 text-xs mt-1 ${isActive ? 'text-white/80' : 'text-text-muted'}`}>
                        <Clock className="w-3 h-3" />
                        {formatDuration(chapter.duration)}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* ===== MAIN CONTENT AREA ===== */}
        <main className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <div className="bg-black aspect-video relative">
            {currentChapter?.videoUrl ? (
              <ReactPlayer
                url={currentChapter.videoUrl}
                width="100%"
                height="100%"
                controls
                playing
                onEnded={handleVideoEnd}
                config={{
                  youtube: {
                    playerVars: { 
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0
                    }
                  }
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <EmptyState
                  icon={PlayCircle}
                  title="Video Not Available"
                  description="This chapter doesn't have a video yet. Please check back later."
                />
              </div>
            )}
          </div>

          {/* Content Below Video */}
          <div className="max-w-4xl mx-auto p-4 lg:p-6">
            {/* Chapter Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
                <span>Chapter {currentChapterIndex + 1} of {chapters.length}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(currentChapter?.duration)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {currentChapter?.title}
              </h2>
              {currentChapter?.description && (
                <p className="text-text-secondary">
                  {currentChapter.description}
                </p>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
                icon={ChevronLeft}
              >
                Previous
              </Button>
              <Button
                variant={isWatched ? 'ghost' : 'primary'}
                onClick={handleNextChapter}
                disabled={currentChapterIndex === chapters.length - 1}
                icon={ChevronRight}
                iconPosition="right"
              >
                {isWatched ? 'Next Chapter' : 'Mark Complete & Next'}
              </Button>
            </div>

            {/* Tabs */}
            <div className="border-b border-border-color mb-6">
              <div className="flex gap-1">
                {['overview', 'quiz', 'discussion'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      px-4 py-3 text-sm font-medium capitalize transition-colors relative
                      ${activeTab === tab 
                        ? 'text-primary' 
                        : 'text-text-muted hover:text-text-primary'
                      }
                    `}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Course Description */}
                  <Card>
                    <h3 className="font-semibold text-text-primary mb-3">About This Course</h3>
                    <p className="text-text-secondary leading-relaxed">
                      {course?.description || 'No description available.'}
                    </p>
                  </Card>

                  {/* Instructor Card */}
                  <Card>
                    <h3 className="font-semibold text-text-primary mb-4">Instructor</h3>
                    <div className="flex items-start gap-4">
                      <Avatar 
                        name={course?.instructor?.name} 
                        size="lg" 
                      />
                      <div>
                        <h4 className="font-semibold text-text-primary">
                          {course?.instructor?.name || 'Unknown Instructor'}
                        </h4>
                        <p className="text-text-muted text-sm mt-1">
                          Expert instructor with years of experience in this field.
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <EmptyState
                    icon={HelpCircle}
                    title="No Quiz Yet"
                    description="This chapter doesn't have a quiz. Continue to the next chapter to test your knowledge."
                    action={BookOpen}
                    actionLabel="Browse All Quizzes"
                    onAction={() => navigate('/dashboard/my-courses')}
                  />
                </motion.div>
              )}

              {activeTab === 'discussion' && (
                <motion.div
                  key="discussion"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <EmptyState
                    icon={MessageSquare}
                    title="Discussion Forum"
                    description="Join the conversation with other students. Ask questions, share insights, and learn together."
                    action={MessageSquare}
                    actionLabel="Start a Discussion"
                    onAction={() => {}}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ===== MOBILE BOTTOM DRAWER ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-light-surface dark:bg-dark-surface rounded-t-2xl z-50 lg:hidden max-h-[80vh] flex flex-col"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-light-tertiary dark:bg-dark-tertiary rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-color">
                <h3 className="font-semibold text-text-primary">Course Content</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-light-tertiary dark:hover:bg-dark-tertiary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              {/* Chapter List */}
              <div className="overflow-y-auto p-3 space-y-1">
                {chapters.map((chapter, index) => {
                  const isWatched = isChapterWatched(chapter.id)
                  const isActive = chapter.id === currentChapterId

                  return (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        setCurrentChapterId(chapter.id)
                        setMobileMenuOpen(false)
                      }}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                        ${isActive 
                          ? 'bg-primary text-white' 
                          : isWatched
                          ? 'bg-light-tertiary dark:bg-dark-tertiary text-text-primary'
                          : 'hover:bg-light-tertiary dark:hover:bg-dark-tertiary text-text-primary'
                        }
                      `}
                    >
                      <div className="flex-shrink-0">
                        {isWatched ? (
                          <CheckCircle className={`w-5 h-5 ${isActive ? 'text-white' : 'text-success'}`} />
                        ) : (
                          <PlayCircle className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${isActive ? 'text-white' : ''}`}>
                          {index + 1}. {chapter.title}
                        </p>
                        <span className={`text-xs ${isActive ? 'text-white/80' : 'text-text-muted'}`}>
                          {formatDuration(chapter.duration)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Progress Footer */}
              <div className="p-4 border-t border-border-color">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-text-secondary">Course Progress</span>
                  <span className="font-semibold text-primary">{completionPercentage}%</span>
                </div>
                <ProgressBar progress={completionPercentage} size="sm" showLabel={false} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Learning
