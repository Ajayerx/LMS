import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Timer, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '../components/UI'

const Quiz = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(null)

  // Timer: 1 minute per question (optional)
  const TIMER_MINUTES = 1

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    if (questions.length > 0 && timeLeft === null) {
      setTimeLeft(questions.length * TIMER_MINUTES * 60)
    }
  }, [questions])

  useEffect(() => {
    if (timeLeft > 0 && !result) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, result])

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quiz/${quizId}`)
      setQuiz(response.data.quiz)
      setQuestions(response.data.questions || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (result) return
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))
  }

  const handleSubmit = async () => {
    if (submitting) return

    setSubmitting(true)
    try {
      // Build answers array in order of questions
      const answersArray = questions.map(q => answers[q.id])

      const response = await api.post(`/quiz/${quizId}/attempt`, {
        answers: answersArray
      })
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg">{error}</p>
          <Button
            onClick={() => navigate('/dashboard/my-courses')}
            className="mt-4"
            variant="primary"
          >
            Go to Courses
          </Button>
        </div>
      </div>
    )
  }

  // Results View
  if (result) {
    const percentage = result.attempt.score
    const isPassed = percentage >= 70

    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-md p-8">
          {/* Score Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
              isPassed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isPassed ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <XCircle className="w-12 h-12 text-red-600" />
              )}
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {isPassed ? 'Congratulations!' : 'Keep Trying!'}
            </h2>
            <p className="text-gray-600">
              You scored <span className="font-bold text-xl">{percentage}%</span>
            </p>
            <p className="text-gray-500 mt-1">
              {result.attempt.correctCount} out of {result.attempt.totalQuestions} correct
            </p>
          </div>

          {/* Question Review */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold mb-4">Question Review</h3>
            {result.results.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {item.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium">Question {idx + 1}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Your answer: Option {item.submittedAnswer !== undefined ? item.submittedAnswer + 1 : 'Not answered'}
                    </p>
                    {!item.isCorrect && (
                      <p className="text-sm text-green-600 mt-1">
                        Correct answer: Option {item.correctAnswer + 1}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => navigate('/dashboard/my-courses')}
              variant="primary"
            >
              Back to Courses
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
            >
              Retry Quiz
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz View
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              className="mr-4"
              icon={ArrowLeft}
            />
            <div>
              <h1 className="text-2xl font-bold">{quiz?.title}</h1>
              <p className="text-gray-500 mt-1">{questions.length} questions</p>
            </div>
          </div>
          {timeLeft !== null && (
            <div className={`flex items-center px-4 py-2 rounded-lg ${
              timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Timer className="w-5 h-5 mr-2" />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div key={question.id} className="bg-white dark:bg-dark-card rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">
              <span className="text-primary-600 font-bold mr-2">{qIndex + 1}.</span>
              {question.questionText}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  onClick={() => handleAnswerSelect(question.id, oIndex)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    answers[question.id] === oIndex
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 ${
                      answers[question.id] === oIndex
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {String.fromCharCode(65 + oIndex)}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-gray-500">
          {Object.keys(answers).length} of {questions.length} answered
        </p>
        <Button
          onClick={handleSubmit}
          disabled={submitting || Object.keys(answers).length === 0}
          variant="primary"
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </Button>
      </div>
    </div>
  )
}

export default Quiz
