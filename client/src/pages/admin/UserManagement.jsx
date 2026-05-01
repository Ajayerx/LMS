import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { Search, UserX, UserCheck, Shield, GraduationCap, BookOpen } from 'lucide-react'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('ALL')
  const [processing, setProcessing] = useState({})

  const tabs = [
    { id: 'ALL', label: 'All Users', icon: null },
    { id: 'STUDENT', label: 'Students', icon: GraduationCap },
    { id: 'INSTRUCTOR', label: 'Instructors', icon: BookOpen },
    { id: 'ADMIN', label: 'Admins', icon: Shield }
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users')
      setUsers(response.data.users || [])
    } catch (err) {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    setProcessing(prev => ({ ...prev, [userId]: true }))
    try {
      await api.patch(`/api/admin/users/${userId}/toggle-status`)
      setUsers(users.map(u =>
        u.id === userId ? { ...u, isActive: !currentStatus } : u
      ))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status')
    } finally {
      setProcessing(prev => ({ ...prev, [userId]: false }))
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'ALL' || user.role === activeTab
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  const getRoleBadge = (role) => {
    const styles = {
      ADMIN: 'bg-purple-100 text-purple-700',
      INSTRUCTOR: 'bg-blue-100 text-blue-700',
      STUDENT: 'bg-green-100 text-green-700'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
        {role}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage platform users and their permissions</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Enrollments</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name?.[0] || '?'}
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isActive !== false
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user._count?.enrollments || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleStatus(user.id, user.isActive !== false)}
                            disabled={processing[user.id]}
                            className={`flex items-center px-4 py-2 rounded-lg transition ${
                              user.isActive !== false
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            } disabled:opacity-50`}
                          >
                            {processing[user.id] ? (
                              <span className="animate-spin mr-2">⏳</span>
                            ) : user.isActive !== false ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  )
}

export default UserManagement
