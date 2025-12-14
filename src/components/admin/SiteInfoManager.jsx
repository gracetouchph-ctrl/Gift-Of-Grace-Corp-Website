import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Plus, Edit, Trash2, X, CheckCircle, AlertCircle, Package, Award, Info, Phone, Download, Upload, Image, Link } from 'lucide-react'

const SiteInfoManager = ({ onUpdate }) => {
  const [siteInfo, setSiteInfo] = useState({
    products: [],
    about: {},
    awards: [],
    contact: {},
    company_info: {}
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [activeSection, setActiveSection] = useState('products')
  const [initializing, setInitializing] = useState(false)

  const API_BASE = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:8001'

  useEffect(() => {
    fetchSiteInfo()
  }, [])

  const fetchSiteInfo = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE}/admin/site-info`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setSiteInfo(data)
      }
    } catch (error) {
      console.error('Error fetching site info:', error)
      showMessage('error', 'Failed to fetch site information')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE}/admin/site-info`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(siteInfo)
      })

      if (response.ok) {
        showMessage('success', 'Site information saved successfully!')
        onUpdate()
      } else {
        showMessage('error', 'Failed to save site information')
      }
    } catch (error) {
      showMessage('error', 'Save failed: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleInitSiteInfo = async () => {
    if (!confirm('This will import current website data (products, awards, about, contact) into the admin panel. Continue?')) {
      return
    }

    setInitializing(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE}/admin/init-site-info`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        showMessage('success', 'Site information initialized! Refreshing data...')
        // Reload site info
        await fetchSiteInfo()
        onUpdate()
      } else {
        const error = await response.json()
        showMessage('error', error.detail || 'Failed to initialize site information')
      }
    } catch (error) {
      showMessage('error', 'Initialization failed: ' + error.message)
    } finally {
      setInitializing(false)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  // Image upload handler - converts to base64 or uses URL
  const handleImageUpload = async (productId, file) => {
    if (!file) return

    // Check file size (max 2MB for base64)
    if (file.size > 2 * 1024 * 1024) {
      showMessage('error', 'Image too large. Please use an image under 2MB or provide a URL.')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      updateProduct(productId, 'image', reader.result)
      showMessage('success', 'Image uploaded successfully!')
    }
    reader.onerror = () => {
      showMessage('error', 'Failed to upload image')
    }
    reader.readAsDataURL(file)
  }

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: '',
      price: '',
      image: '',
      shopeeLink: '',
      description: '',
      category: ''
    }
    setSiteInfo({
      ...siteInfo,
      products: [...(siteInfo.products || []), newProduct]
    })
    setEditing(newProduct.id)
  }

  const updateProduct = (id, field, value) => {
    setSiteInfo({
      ...siteInfo,
      products: siteInfo.products.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    })
  }

  const deleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setSiteInfo({
        ...siteInfo,
        products: siteInfo.products.filter(p => p.id !== id)
      })
    }
  }

  const addAward = () => {
    const newAward = {
      id: Date.now(),
      title: '',
      year: '',
      description: ''
    }
    setSiteInfo({
      ...siteInfo,
      awards: [...(siteInfo.awards || []), newAward]
    })
    setEditing(newAward.id)
  }

  const updateAward = (id, field, value) => {
    setSiteInfo({
      ...siteInfo,
      awards: siteInfo.awards.map(a => 
        a.id === id ? { ...a, [field]: value } : a
      )
    })
  }

  const deleteAward = (id) => {
    if (confirm('Are you sure you want to delete this award?')) {
      setSiteInfo({
        ...siteInfo,
        awards: siteInfo.awards.filter(a => a.id !== id)
      })
    }
  }

  const updateAbout = (field, value) => {
    setSiteInfo({
      ...siteInfo,
      about: { ...siteInfo.about, [field]: value }
    })
  }

  const updateContact = (field, value) => {
    setSiteInfo({
      ...siteInfo,
      contact: { ...siteInfo.contact, [field]: value }
    })
  }

  const updateCompanyInfo = (field, value) => {
    setSiteInfo({
      ...siteInfo,
      company_info: { ...siteInfo.company_info, [field]: value }
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-grace-accent"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6"
    >
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif font-medium text-gray-900 mb-1 sm:mb-2">
            Site Information Manager
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Manage website content including products, awards, and company information
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {(siteInfo.products?.length === 0 || siteInfo.awards?.length === 0) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInitSiteInfo}
              disabled={initializing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              {initializing ? 'Importing...' : 'Import Data'}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-grace-accent to-rose-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm sm:text-base"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs - Scrollable on Mobile */}
      <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto pb-px -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: 'products', label: 'Products', icon: Package },
          { id: 'awards', label: 'Awards', icon: Award },
          { id: 'about', label: 'About', icon: Info },
          { id: 'contact', label: 'Contact', icon: Phone },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 transition-all whitespace-nowrap text-sm sm:text-base ${
                activeSection === tab.id
                  ? 'border-grace-accent text-grace-accent font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Products Section */}
      {activeSection === 'products' && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Products</h2>
            <button
              onClick={addProduct}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-grace-accent text-white rounded-xl font-medium hover:bg-rose-500 transition-all text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Product
            </button>
          </div>
          <div className="space-y-4">
            {(siteInfo.products || []).map((product) => (
              <div key={product.id} className="p-3 sm:p-4 border border-gray-200 rounded-xl">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={product.name || ''}
                      onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="text"
                      value={product.price || ''}
                      onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                      {/* Image Preview */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name || 'Product'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Image className="w-6 h-6 sm:w-8 sm:h-8" />
                          </div>
                        )}
                        <div className="w-full h-full items-center justify-center text-gray-400 hidden">
                          <span className="text-xs">Invalid URL</span>
                        </div>
                      </div>

                      {/* URL Input & Upload */}
                      <div className="flex-1 w-full space-y-2">
                        <div className="relative">
                          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={product.image || ''}
                            onChange={(e) => updateProduct(product.id, 'image', e.target.value)}
                            placeholder="Enter image URL or upload"
                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-all text-xs sm:text-sm">
                            <Upload className="w-4 h-4" />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(product.id, e.target.files[0])}
                            />
                          </label>
                          <span className="text-xs text-gray-500">Max 2MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={product.category || ''}
                      onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shopee Link</label>
                    <input
                      type="text"
                      value={product.shopeeLink || ''}
                      onChange={(e) => updateProduct(product.id, 'shopeeLink', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={product.description || ''}
                      onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards Section */}
      {activeSection === 'awards' && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Awards</h2>
            <button
              onClick={addAward}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-grace-accent text-white rounded-xl font-medium hover:bg-rose-500 transition-all text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Award
            </button>
          </div>
          <div className="space-y-4">
            {(siteInfo.awards || []).map((award) => (
              <div key={award.id} className="p-3 sm:p-4 border border-gray-200 rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={award.title || ''}
                      onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={award.year || ''}
                      onChange={(e) => updateAward(award.id, 'year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={award.description || ''}
                      onChange={(e) => updateAward(award.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => deleteAward(award.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">About Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
              <textarea
                value={siteInfo.about?.mission || ''}
                onChange={(e) => updateAbout('mission', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
              <textarea
                value={siteInfo.about?.vision || ''}
                onChange={(e) => updateAbout('vision', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Story</label>
              <textarea
                value={siteInfo.about?.story || ''}
                onChange={(e) => updateAbout('story', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      {activeSection === 'contact' && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={siteInfo.contact?.address || ''}
                onChange={(e) => updateContact('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={siteInfo.contact?.phone || ''}
                onChange={(e) => updateContact('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={siteInfo.contact?.email || ''}
                onChange={(e) => updateContact('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input
                type="text"
                value={siteInfo.contact?.facebook || ''}
                onChange={(e) => updateContact('facebook', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grace-accent focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default SiteInfoManager

