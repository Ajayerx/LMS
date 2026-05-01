import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { ArrowLeft, Plus, GripVertical, Trash2, Edit2, Save, X, Upload, PlayCircle, ChevronUp, ChevronDown } from 'lucide-react'

const InstructorCourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingChapter, setEditingChapter] = useState(null)
  const [showAddChapter, setShowAddChapter] = useState(false)

  // Chapter form
  const [chapterForm, setChapterForm] = useState({
    title: '',
    video: null,
    order: 0
  })

  // Course edit form
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: 0
  })
  const [editingCourse, setEditingCourse] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [courseRes, chaptersRes] = await Promise.all([
        api.get(`/api/courses/${id}`),
        api.get(`/api/course/${id}/chapters`)
      ])
      setCourse(courseRes.data.course || courseRes.data)
      setChapters(chaptersRes.data.chapters || [])
      setCourseForm({
        title: courseRes.data.course?.title || '',
        description: courseRes.data.course?.description || '',
        price: courseRes.data.course?.price || 0
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch course data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put(`/api/courses/${id}`, courseForm)
      setCourse({ ...course, ...courseForm })
      setEditingCourse(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  const handleAddChapter = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('title', chapterForm.title)
      formData.append('order', chapters.length)
      if (chapterForm.video) {
        formData.append('video', chapterForm.video)
      }

      await api.post(`/api/course/${id}/chapters`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setChapterForm({ title: '', video: null, order: 0 })
      setShowAddChapter(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add chapter')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteChapter = async (chapterId) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return

    try {
      await api.delete(`/api/chapters/${chapterId}`)
      setChapters(chapters.filter(c => c.id !== chapterId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete chapter')
    }
  }

  const handleUpdateChapter = async (chapterId) => {
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('title', editingChapter.title)
      if (editingChapter.video) {
        formData.append('video', editingChapter.video)
      }

      await api.put(`/api/chapters/${chapterId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setEditingChapter(null)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update chapter')
    } finally {
      setSaving(false)
    }
  }

  const moveChapter = async (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= chapters.length) return

    const newChapters = [...chapters]
    const temp = newChapters[index]
    newChapters[index] = newChapters[newIndex]
    newChapters[newIndex] = temp

    // Update order
    setChapters(newChapters)

    // API call to update order would go here
    // await axios.patch(`/api/chapters/${temp.id}/reorder`, { order: newIndex })
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
      <button
        onClick={() => navigate('/instructor/courses')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Courses
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Course Info Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Course Information</h2>
          <button
            onClick={() => setEditingCourse(!editingCourse)}
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            {editingCourse ? <X className="w-5 h-5 mr-1" /> : <Edit2 className="w-5 h-5 mr-1" />}
            {editingCourse ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingCourse ? (
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={courseForm.price}
                onChange={(e) => setCourseForm({ ...courseForm, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <p><span className="font-medium">Title:</span> {course?.title}</p>
            <p><span className="font-medium">Description:</span> {course?.description || 'No description'}</p>
            <p><span className="font-medium">Price:</span> ${course?.price || 'Free'}</p>
            <p><span className="font-medium">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                course?.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                course?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {course?.status}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => navigate(`/instructor/courses/${id}/quiz`)}
          className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition text-left"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-3">
              <h3 className="font-semibold">Manage Quiz</h3>
              <p className="text-sm text-gray-500">Add or edit quiz questions</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate(`/instructor/courses/${id}/students`)}
          className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition text-left"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-3">
              <h3 className="font-semibold">Student Progress</h3>
              <p className="text-sm text-gray-500">View enrolled students</p>
            </div>
          </div>
        </button>
      </div>

      {/* Chapters Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Course Chapters</h2>
          <button
            onClick={() => setShowAddChapter(!showAddChapter)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Chapter
          </button>
        </div>

        {/* Add Chapter Form */}
        {showAddChapter && (
          <form onSubmit={handleAddChapter} className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-4">New Chapter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Title</label>
                <input
                  type="text"
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Introduction to the Course"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setChapterForm({ ...chapterForm, video: e.target.files[0] })}
                    className="w-full"
                  />
                </div>
                {chapterForm.video && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {chapterForm.video.name}
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Chapter'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddChapter(false)}
                  className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Chapters List */}
        <div className="space-y-3">
          {chapters.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No chapters yet. Add your first chapter!</p>
          ) : (
            chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition"
              >
                {editingChapter?.id === chapter.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingChapter.title}
                      onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setEditingChapter({ ...editingChapter, video: e.target.files[0] })}
                      />
                      {chapter.videoUrl && !editingChapter.video && (
                        <p className="text-sm text-gray-500 mt-1">
                          Current: Video uploaded
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateChapter(chapter.id)}
                        disabled={saving}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingChapter(null)}
                        className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-gray-400 mr-3">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{chapter.title}</h4>
                          <p className="text-sm text-gray-500">
                            {chapter.videoUrl ? (
                              <span className="flex items-center text-green-600">
                                <PlayCircle className="w-4 h-4 mr-1" />
                                Video uploaded
                              </span>
                            ) : (
                              'No video'
                            )}
                            {chapter.duration && ` • ${Math.round(chapter.duration / 60)} min`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => moveChapter(index, -1)}
                        disabled={index === 0}
                        className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveChapter(index, 1)}
                        disabled={index === chapters.length - 1}
                        className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingChapter(chapter)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteChapter(chapter.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default InstructorCourseDetail
