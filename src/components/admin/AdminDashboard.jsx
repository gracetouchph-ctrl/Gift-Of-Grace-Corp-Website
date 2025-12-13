import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  Store
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import PDFManager from './PDFManager'
import SiteInfoManager from './SiteInfoManager'

const AdminDashboard = () => {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    pdfs_count: 0,
    products_count: 0,
    awards_count: 0,
    documents_processed: false
  })
  const [loading, setLoading] = useState(true)

  const API_BASE = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:8001'

  useEffect(() => {
    fetchStats()
  }, [])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200 shadow-xl z-50 flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
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
                  onClick={() => setActiveTab(tab.id)}
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

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-medium text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-500 text-lg">
              Manage your website content and chatbot training documents
            </p>
          </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                { 
                  icon: BookOpen, 
                  label: 'Training Documents', 
                  value: stats.pdfs_count, 
                  color: 'from-blue-500 to-blue-600',
                  description: 'PDFs used for chatbot training'
                },
                { 
                  icon: Package, 
                  label: 'Products', 
                  value: stats.products_count, 
                  color: 'from-green-500 to-green-600',
                  description: 'Active products on website'
                },
                { 
                  icon: Award, 
                  label: 'Awards & Recognition', 
                  value: stats.awards_count, 
                  color: 'from-amber-500 to-amber-600',
                  description: 'Company achievements'
                },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      {stat.value > 0 && (
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {loading ? (
                        <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className="text-base font-semibold text-gray-700 mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.description}</div>
                  </motion.div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                <TrendingUp className="w-5 h-5 text-grace-accent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  onClick={() => setActiveTab('pdfs')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-grace-accent hover:bg-gradient-to-br hover:from-grace-accent/5 hover:to-rose-50/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-grace-accent">Upload Documents</span>
                  <span className="text-xs text-gray-500 text-center">Add PDFs for chatbot training</span>
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('site-info')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-grace-accent hover:bg-gradient-to-br hover:from-grace-accent/5 hover:to-rose-50/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-grace-accent">Manage Content</span>
                  <span className="text-xs text-gray-500 text-center">Update products, awards & info</span>
                </motion.button>
                <motion.button
                  onClick={fetchStats}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-grace-accent hover:bg-gradient-to-br hover:from-grace-accent/5 hover:to-rose-50/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-grace-accent">Refresh Data</span>
                  <span className="text-xs text-gray-500 text-center">Update dashboard statistics</span>
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

