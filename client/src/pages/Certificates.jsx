import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Award, Download, Calendar, BookOpen, ExternalLink } from 'lucide-react'

const Certificates = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await api.get('/api/certificates/my-certificates')
      setCertificates(response.data.certificates || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch certificates')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-600 mt-2">Your achievements and accomplishments</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
          <p className="text-gray-600 mb-6">
            Complete a course with 100% progress to earn your first certificate
          </p>
          <button
            onClick={() => navigate('/dashboard/my-courses')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            Continue Learning
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => {
            const course = certificate.course

            return (
              <div
                key={certificate.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Certificate Preview */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 h-48 flex flex-col items-center justify-center text-white p-6">
                  <Award className="w-16 h-16 mb-4" />
                  <h3 className="text-lg font-bold text-center">Certificate of Completion</h3>
                  <p className="text-primary-200 text-sm mt-1">{course?.title}</p>
                </div>

                <div className="p-6">
                  {/* Course Info */}
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {course?.title || 'Course'}
                  </h4>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>Instructor: {course?.instructor?.name || 'Unknown'}</span>
                  </div>

                  {/* Issue Date */}
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Issued on {formatDate(certificate.issuedAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    {certificate.certificateUrl && (
                      <a
                        href={certificate.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download
                      </a>
                    )}
                    <a
                      href={`/api/certificates/verify/${certificate.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-600" />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stats Section */}
      {certificates.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Keep up the great work!
              </h3>
              <p className="text-gray-600">
                You've earned {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} so far.
                Continue learning to earn more.
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{certificates.length}</div>
                <div className="text-sm text-gray-500">Certificates</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Certificates
