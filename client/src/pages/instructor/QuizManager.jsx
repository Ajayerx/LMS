import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui'

const QuizManager = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Quiz creation/editing
  const [showQuizForm, setShowQuizForm] = useState(false)
  const [quizForm, setQuizForm] = useState({ title: '' })

  // Question form
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      // Get course details
      const courseRes = await api.get(`/api/courses/${id}`)
      setCourse(courseRes.data.course || courseRes.data)

      // Get quizzes for this course
      const quizzesRes = await api.get(`/api/course/${id}/quizzes`)
      const quizzes = quizzesRes.data.quizzes || []

      if (quizzes.length > 0) {
        const existingQuiz = quizzes[0]
        setQuiz(existingQuiz)

        // Get quiz details with questions
        const quizRes = await api.get(`/api/quiz/${existingQuiz.id}`)
        setQuestions(quizRes.data.questions || [])
      }
    } catch (err) {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuiz = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await api.post(`/api/courses/${id}/quiz`, quizForm)
      setQuiz(response.data.quiz)
      setShowQuizForm(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz')
    } finally {
      setSaving(false)
    }
  }

  const handleAddQuestion = async (e) => {
    e.preventDefault()
    if (!quiz) return

    setSaving(true)
    try {
      await api.post(`/api/quiz/${quiz.id}/questions`, {
        questions: [{
          questionText: questionForm.questionText,
          options: questionForm.options,
          correctAnswer: questionForm.correctAnswer
        }]
      })

      // Reset form and refresh
      setQuestionForm({ questionText: '', options: ['', '', '', ''], correctAnswer: 0 })
      setShowQuestionForm(false)

      // Refresh questions
      const quizRes = await api.get(`/api/quiz/${quiz.id}`)
      setQuestions(quizRes.data.questions || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteQuestion = async (questionIndex) => {
    // Note: Backend would need a delete question endpoint
    // For now, we'll just update the UI
    setQuestions(questions.filter((_, i) => i !== questionIndex))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        onClick={() => navigate(`/instructor/courses/${id}`)}
        variant="ghost"
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Course
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quiz Manager</h1>
        <p className="text-gray-600 mt-1">{course?.title}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Create Quiz Section */}
      {!quiz && (
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          {!showQuizForm ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">No Quiz Yet</h2>
              <p className="text-gray-600 mb-4">Create a quiz for your students to test their knowledge</p>
              <Button
                onClick={() => setShowQuizForm(true)}
                variant="primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Quiz
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCreateQuiz}>
              <h3 className="text-lg font-semibold mb-4">Create New Quiz</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Final Assessment"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={saving}
                  variant="primary"
                >
                  {saving ? 'Creating...' : 'Create Quiz'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowQuizForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Quiz Content */}
      {quiz && (
        <>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{quiz.title}</h2>
                <p className="text-gray-500">{questions.length} questions</p>
              </div>
              <Button
                onClick={() => setShowQuestionForm(!showQuestionForm)}
                variant="primary"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>

          {/* Add Question Form */}
          {showQuestionForm && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">New Question</h3>
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text *
                  </label>
                  <textarea
                    value={questionForm.questionText}
                    onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={2}
                    placeholder="Enter your question..."
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Options (select the correct answer)
                  </label>
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={questionForm.correctAnswer === index}
                        onChange={() => setQuestionForm({ ...questionForm, correctAnswer: index })}
                        className="w-4 h-4 text-primary-600 mr-3"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options]
                          newOptions[index] = e.target.value
                          setQuestionForm({ ...questionForm, options: newOptions })
                        }}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        required
                      />
                      {questionForm.correctAnswer === index && (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    variant="primary"
                  >
                    {saving ? 'Adding...' : 'Add Question'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowQuestionForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500">No questions yet. Add your first question!</p>
              </div>
            ) : (
              questions.map((question, index) => (
                <div key={question.id || index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-3">
                          {index + 1}
                        </span>
                        <h4 className="font-medium">{question.questionText}</h4>
                      </div>
                      <div className="ml-11 space-y-2">
                        {question.options?.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`flex items-center p-2 rounded-lg ${
                              parseInt(question.correctAnswer) === optIndex
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-gray-50'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 ${
                              parseInt(question.correctAnswer) === optIndex
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className={parseInt(question.correctAnswer) === optIndex ? 'font-medium text-green-900' : 'text-gray-700'}>
                              {option}
                            </span>
                            {parseInt(question.correctAnswer) === optIndex && (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(index)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition ml-4"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default QuizManager
