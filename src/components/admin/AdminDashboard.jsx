import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Upload,
  Trash2,
  RefreshCw,
  Settings,
  LogOut,
  File,
  Package,
  Award,
  TrendingUp,
  BookOpen,
  Users,
  Store,
  Menu,
  X,
  MessageCircle,
  Power
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import PDFManager from './PDFManager'
import SiteInfoManager from './SiteInfoManager'

const AdminDashboard = () => {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    pdfs_count: 0,
    products_count: 0,
    awards_count: 0,
    documents_processed: false
  })
  const [loading, setLoading] = useState(true)
  const [chatbotEnabled, setChatbotEnabled] = useState(true)
  const [togglingChatbot, setTogglingChatbot] = useState(false)

  const API_BASE = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:8001'

  useEffect(() => {
    fetchStats()
    fetchChatbotStatus()
  }, [])

  const fetchChatbotStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE}/admin/site-info`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setChatbotEnabled(data.chatbot_enabled !== false)
      }
    } catch (error) {
      console.error('Error fetching chatbot status:', error)
    }
  }

  const toggleChatbot = async () => {
    setTogglingChatbot(true)
    try {
      const token = localStorage.getItem('admin_token')
      // First get current site info
      const getResponse = await fetch(`${API_BASE}/admin/site-info`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (getResponse.ok) {
        const siteInfo = await getResponse.json()
        // Toggle the chatbot_enabled status
        siteInfo.chatbot_enabled = !chatbotEnabled
        // Save back
        const saveResponse = await fetch(`${API_BASE}/admin/site-info`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(siteInfo)
        })
        if (saveResponse.ok) {
          setChatbotEnabled(!chatbotEnabled)
        }
      }
    } catch (error) {
      console.error('Error toggling chatbot:', error)
    } finally {
      setTogglingChatbot(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const statsResponse = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        
        // Also fetch site info to get accurate product count
        const siteInfoResponse = await fetch(`${API_BASE}/admin/site-info`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (siteInfoResponse.ok) {
          const siteInfo = await siteInfoResponse.json()
          setStats({
            pdfs_count: statsData.pdfs_count || 0,
            products_count: siteInfo.products?.length || 0,
            awards_count: siteInfo.awards?.length || 0,
            documents_processed: (statsData.pdfs_count || 0) > 0
          })
        } else {
          setStats({
            pdfs_count: statsData.pdfs_count || 0,
            products_count: statsData.products_count || 0,
            awards_count: statsData.awards_count || 0,
            documents_processed: (statsData.pdfs_count || 0) > 0
          })
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'pdfs', label: 'Training Documents', icon: FileText },
    { id: 'site-info', label: 'Website Content', icon: Settings },
  ]

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow p-1.5 flex items-center justify-center">
            <img
              src="/images/giftofgracelogo.png"
              alt="Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
          <span className="font-serif font-semibold text-gray-900">Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop fixed, Mobile slide-in */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200 shadow-xl z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 sm:p-6 flex-1 flex flex-col pt-16 lg:pt-6">
          {/* Logo - Hidden on mobile (shown in header) */}
          <div className="hidden lg:flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg p-2 mb-3 flex items-center justify-center relative">
              <img
                src="/images/giftofgracelogo.png"
                alt="Gift of Grace Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'
                  const fallback = e.target.parentElement.querySelector('.logo-fallback')
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-grace-accent to-rose-500 rounded-xl flex items-center justify-center hidden logo-fallback">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="font-serif font-semibold text-gray-900 text-lg">Admin Portal</h2>
            <p className="text-xs text-gray-500 mt-1">Gift of Grace</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-grace-accent to-rose-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive margin */}
      <div className="lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-serif font-medium text-gray-900 mb-1 sm:mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-500 text-sm sm:text-lg">
              Manage your website content and chatbot training documents
            </p>
          </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[
                {
                  icon: BookOpen,
                  label: 'Training Docs',
                  value: stats.pdfs_count,
                  color: 'from-blue-500 to-blue-600',
                  description: 'PDFs for chatbot'
                },
                {
                  icon: Package,
                  label: 'Products',
                  value: stats.products_count,
                  color: 'from-green-500 to-green-600',
                  description: 'Active products'
                },
                {
                  icon: Award,
                  label: 'Awards',
                  value: stats.awards_count,
                  color: 'from-amber-500 to-amber-600',
                  description: 'Achievements'
                },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                      {stat.value > 0 && (
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                      {loading ? (
                        <div className="h-8 sm:h-10 w-12 sm:w-16 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-gray-700 mb-0.5 sm:mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.description}</div>
                  </motion.div>
                )
              })}
            </div>

            {/* Chatbot Control */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-6 sm:mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-all ${chatbotEnabled ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Chatbot</h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {chatbotEnabled ? 'Active on landing page' : 'Hidden from visitors'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleChatbot}
                  disabled={togglingChatbot}
                  className={`relative inline-flex h-7 w-14 sm:h-8 sm:w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-grace-accent focus:ring-offset-2 ${chatbotEnabled ? 'bg-green-500' : 'bg-gray-300'} ${togglingChatbot ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-lg transition-transform ${chatbotEnabled ? 'translate-x-8 sm:translate-x-9' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Quick Actions</h2>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-grace-accent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <motion.button
                  onClick={() => handleTabChange('pdfs')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-row sm:flex-col items-center gap-3 sm:gap-3 p-4 sm:p-6 border-2 border-gray-200 rounded-xl hover:border-grace-accent hover:bg-gradient-to-br hover:from-grace-accent/5 hover:to-rose-50/50 transition-all group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-left sm:text-center">
                    <span className="font-semibold text-gray-700 group-hover:text-grace-accent text-sm sm:text-base block">Upload Documents</span>
                    <span className="text-xs text-gray-500">Add PDFs for chatbot</span>
                  </div>
                </motion.button>
                <motion.button
                  onClick={() => handleTabChange('site-info')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-row sm:flex-col items-center gap-3 sm:gap-3 p-4 sm:p-6 border-2 border-gray-200 rounded-xl hover:border-grace-accent hover:bg-gradient-to-br hover:from-grace-accent/5 hover:to-rose-50/50 transition-all group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-left sm:text-center">
                    <span className="font-semibold text-gray-700 group-hover:text-grace-accent text-sm sm:text-base block">Manage Content</span>
                    <span className="text-xs text-gray-500">Update products & info</span>
                  </div>
                </motion.button>
                <motion.button
                  onClick={fetchStats}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-row sm:flex-col items-center gap-3 sm:gap-3 p-4 sm:p-6 border-2 border-gray-200 rounded-xl hover:border-grace-accent hover:bg-gradient-to-br hover:from-grace-accent/5 hover:to-rose-50/50 transition-all group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-left sm:text-center">
                    <span className="font-semibold text-gray-700 group-hover:text-grace-accent text-sm sm:text-base block">Refresh Data</span>
                    <span className="text-xs text-gray-500">Update statistics</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pdfs' && <PDFManager onUpdate={fetchStats} />}
        {activeTab === 'site-info' && <SiteInfoManager onUpdate={fetchStats} />}
      </div>
    </div>
  )
}

export default AdminDashboard

