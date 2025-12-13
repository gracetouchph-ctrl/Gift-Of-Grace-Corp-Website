import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Trash2, FileText, RefreshCw, X, CheckCircle, AlertCircle } from 'lucide-react'

const PDFManager = ({ onUpdate }) => {
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  const API_BASE = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:8001'

  useEffect(() => {
    fetchPDFs()
  }, [])

  const fetchPDFs = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE}/admin/pdfs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setPdfs(data.pdfs || [])
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error)
      showMessage('error', 'Failed to fetch PDFs')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    } else {
      showMessage('error', 'Please select a PDF file')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      showMessage('error', 'Please select a file')
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('admin_token')
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`${API_BASE}/admin/pdfs/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        showMessage('success', `PDF uploaded successfully! Processed ${data.chunks} chunks.`)
        setShowUploadModal(false)
        setSelectedFile(null)
        fetchPDFs()
        onUpdate()
      } else {
        const error = await response.json()
        showMessage('error', error.detail || 'Upload failed')
      }
    } catch (error) {
      showMessage('error', 'Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filename) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE}/admin/pdfs/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        showMessage('success', 'PDF deleted successfully')
        fetchPDFs()
        onUpdate()
      } else {
        const error = await response.json()
        showMessage('error', error.detail || 'Delete failed')
      }
    } catch (error) {
      showMessage('error', 'Delete failed: ' + error.message)
    }
  }

  const handleRebuild = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_BASE}/admin/rebuild-vector-db`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        showMessage('success', `Chatbot training updated successfully! All documents have been processed.`)
        fetchPDFs()
        onUpdate()
      } else {
        showMessage('error', 'Rebuild failed')
      }
    } catch (error) {
      showMessage('error', 'Rebuild failed: ' + error.message)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-serif font-medium text-gray-900 mb-2">
            Training Documents
          </h1>
          <p className="text-gray-500">
            Upload and manage PDF documents that help train the chatbot
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRebuild}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Update Chatbot Training
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-grace-accent to-rose-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <Upload className="w-5 h-5" />
            Upload Document
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

      {/* PDF List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-grace-accent"></div>
        </div>
      ) : pdfs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Training Documents</h3>
          <p className="text-gray-500 mb-6">Upload PDF documents to help train the chatbot with company information</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-grace-accent to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Upload Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pdfs.map((pdf, index) => (
            <motion.div
              key={pdf.filename}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={() => handleDelete(pdf.filename)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete document"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 truncate" title={pdf.filename}>
                {pdf.filename}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">File Size:</span>
                  <span className="font-medium text-gray-700">{formatFileSize(pdf.size)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Uploaded:</span>
                  <span className="font-medium text-gray-700">{new Date(pdf.uploaded_at).toLocaleDateString()}</span>
                </div>
                {pdf.chunks_count && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Used for chatbot training</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !uploading && setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Upload Training Document</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select PDF Document
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Upload company information, product details, or FAQs to help train the chatbot</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-grace-accent file:text-white hover:file:bg-rose-500 transition-all"
                  />
                </div>

                {selectedFile && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{selectedFile.name}</div>
                        <div className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    disabled={uploading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-grace-accent to-rose-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PDFManager

