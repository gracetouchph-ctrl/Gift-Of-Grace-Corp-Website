import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, Bot, Loader2, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// API Configuration
// RASA for local development, HF Spaces (Gemini) for cloud deployment
const RASA_API_URL = import.meta.env.VITE_RASA_API_URL || 'http://localhost:5005/webhooks/rest/webhook'
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL || 'https://lingquerywho-giftofgrace-rag-api.hf.space/chat'

// Deployment mode: 'auto' (try RASA first, fallback to Gemini), 'rasa', or 'gemini'
const CHAT_MODE = import.meta.env.VITE_CHAT_MODE || 'auto'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasAppeared, setHasAppeared] = useState(false)
  const [showInitialMessage, setShowInitialMessage] = useState(false)
  const [hasAutoOpened, setHasAutoOpened] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isRasaAvailable, setIsRasaAvailable] = useState(null) // null = checking, true = available, false = unavailable
  const [isGeminiAvailable, setIsGeminiAvailable] = useState(null) // null = checking, true = available, false = unavailable
  const [activeMode, setActiveMode] = useState(null) // 'rasa' or 'gemini'
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Check API availability on mount
  useEffect(() => {
    const checkRasaAvailability = async () => {
      try {
        // Try to ping the RASA server
        const response = await fetch(RASA_API_URL.replace('/webhooks/rest/webhook', '/'), {
          method: 'GET',
          mode: 'cors',
        })
        setIsRasaAvailable(true)
        return true
      } catch (error) {
        // Try sending a test message to the webhook endpoint
        try {
          const testResponse = await fetch(RASA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: 'test', message: 'hi' }),
          })
          if (testResponse.ok) {
            setIsRasaAvailable(true)
            return true
          }
        } catch {
          // RASA not available
        }
      }
      console.log('RASA server not available')
      setIsRasaAvailable(false)
      return false
    }

    const checkGeminiAvailability = async () => {
      try {
        // Try to ping the HF Spaces health endpoint
        const response = await fetch(GEMINI_API_URL.replace('/chat', '/health'), {
          method: 'GET',
          mode: 'cors',
        })
        if (response.ok) {
          setIsGeminiAvailable(true)
          return true
        }
      } catch (error) {
        console.log('Gemini API not available:', error.message)
      }
      setIsGeminiAvailable(false)
      return false
    }

    const checkAvailability = async () => {
      if (CHAT_MODE === 'gemini') {
        // Only use Gemini
        const geminiOk = await checkGeminiAvailability()
        if (geminiOk) setActiveMode('gemini')
      } else if (CHAT_MODE === 'rasa') {
        // Only use RASA
        const rasaOk = await checkRasaAvailability()
        if (rasaOk) setActiveMode('rasa')
      } else {
        // Auto mode: try RASA first, fallback to Gemini
        const rasaOk = await checkRasaAvailability()
        if (rasaOk) {
          setActiveMode('rasa')
        } else {
          const geminiOk = await checkGeminiAvailability()
          if (geminiOk) setActiveMode('gemini')
        }
      }
    }

    checkAvailability()

    // Re-check every 30 seconds in case server comes online
    const interval = setInterval(checkAvailability, 30000)
    return () => clearInterval(interval)
  }, [])

  // Show chatbot button after 7 seconds (only if an API is available)
  useEffect(() => {
    if (!activeMode) return // Don't show if no API is available

    const timer = setTimeout(() => {
      setHasAppeared(true)
      // Show initial message 1 second after appearing
      setTimeout(() => {
        setShowInitialMessage(true)
      }, 1000)
    }, 7000)

    return () => clearTimeout(timer)
  }, [activeMode])

  // Auto-open when initial message appears (only once)
  useEffect(() => {
    if (showInitialMessage && !isOpen && !hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasAutoOpened(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [showInitialMessage, isOpen, hasAutoOpened])

  // Initialize with welcome message
  useEffect(() => {
    if (showInitialMessage && messages.length === 0) {
      setMessages([{
        id: 0,
        text: initialMessage,
        sender: 'bot',
        timestamp: new Date(),
      }])
    }
  }, [showInitialMessage, messages.length])

  const initialMessage = "Hello! 👋 Welcome to Gift of Grace. I'm here to help you discover our premium wellness products. How can I assist you today?"

  // ============================================
  // DUAL API INTEGRATION (RASA + GEMINI)
  // ============================================
  // Supports both RASA (local) and Gemini via HF Spaces (cloud)
  // Auto mode: tries RASA first, falls back to Gemini
  // ============================================
  const getModelResponse = async (userMessage, conversationHistory) => {
    // Get session ID
    const senderId = sessionStorage.getItem('chatbot_sender_id') || `user_${Date.now()}`
    if (!sessionStorage.getItem('chatbot_sender_id')) {
      sessionStorage.setItem('chatbot_sender_id', senderId)
    }

    // Use the active mode to determine which API to call
    if (activeMode === 'rasa') {
      return await getRasaResponse(userMessage, senderId)
    } else if (activeMode === 'gemini') {
      return await getGeminiResponse(userMessage, senderId)
    }

    // Fallback if no mode is set
    return "I apologize, but I'm temporarily unavailable. Please try again later."
  }

  // RASA API call
  const getRasaResponse = async (userMessage, senderId) => {
    try {
      const response = await fetch(RASA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: senderId,
          message: userMessage,
        }),
      })

      if (!response.ok) {
        throw new Error(`RASA server error: ${response.status}`)
      }

      const data = await response.json()

      // RASA returns an array of responses
      if (Array.isArray(data) && data.length > 0) {
        const combinedResponse = data
          .filter(msg => msg.text)
          .map(msg => msg.text)
          .join('\n\n')
        return combinedResponse || 'I apologize, but I could not process that request.'
      }

      return 'I apologize, but I could not process that request.'

    } catch (error) {
      console.error('Error getting RASA response:', error)
      // Try fallback to Gemini if in auto mode
      if (CHAT_MODE === 'auto' && isGeminiAvailable) {
        console.log('Falling back to Gemini API...')
        setActiveMode('gemini')
        return await getGeminiResponse(userMessage, senderId)
      }
      setIsRasaAvailable(false)
      return "I apologize, but I'm temporarily unavailable. Please try again later."
    }
  }

  // Gemini (HF Spaces) API call
  const getGeminiResponse = async (userMessage, senderId) => {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          session_id: senderId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      return data.response || 'I apologize, but I could not process that request.'

    } catch (error) {
      console.error('Error getting Gemini response:', error)
      setIsGeminiAvailable(false)
      return "I apologize, but I'm temporarily unavailable. Please try again later."
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e?.preventDefault()
    
    const message = inputValue.trim()
    if (!message || isLoading) return

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
    setIsLoading(true)
    setIsTyping(false)

    // Get conversation history for context
    const conversationHistory = [
      ...messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
      { role: 'user', content: message },
    ]

    // Show typing indicator after 0.5 seconds
    const typingTimer = setTimeout(() => {
      setIsTyping(true)
    }, 500)

    // Track when typing indicator actually appears
    let typingShownAt = null
    const typingShowTimer = setTimeout(() => {
      typingShownAt = Date.now()
    }, 500)

    // Minimum time to show typing indicator after it appears (0.5 seconds)
    const minTypingDisplayDuration = 500

    try {
      // Get response from model
      const botResponse = await getModelResponse(message, conversationHistory)

      // Clear timers
      clearTimeout(typingTimer)
      clearTimeout(typingShowTimer)

      // Ensure typing indicator shows for minimum duration after appearing
      if (typingShownAt) {
        const elapsed = Date.now() - typingShownAt
        const remainingTime = Math.max(0, minTypingDisplayDuration - elapsed)
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime))
        }
      } else {
        // If typing indicator hasn't shown yet, wait for it to show + min duration
        await new Promise(resolve => setTimeout(resolve, 500 + minTypingDisplayDuration))
      }
      
      setIsTyping(false)

      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Clear timers
      clearTimeout(typingTimer)
      clearTimeout(typingShowTimer)

      // Ensure typing indicator shows for minimum duration even on error
      if (typingShownAt) {
        const elapsed = Date.now() - typingShownAt
        const remainingTime = Math.max(0, minTypingDisplayDuration - elapsed)
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime))
        }
      } else {
        // If typing indicator hasn't shown yet, wait for it to show + min duration
        await new Promise(resolve => setTimeout(resolve, 500 + minTypingDisplayDuration))
      }
      
      setIsTyping(false)

      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact our support team.",
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  // Format timestamp
  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  // Don't render anything if no API is available (both RASA and Gemini unavailable)
  const isAnyApiAvailable = activeMode !== null || isRasaAvailable === null || isGeminiAvailable === null
  if (!isAnyApiAvailable && isRasaAvailable === false && isGeminiAvailable === false) {
    return null
  }

  return (
    <>
      {/* Chatbot Button */}
      <AnimatePresence>
        {hasAppeared && !isOpen && activeMode !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30"
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-grace-accent to-grace-accent-alt rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all duration-300 group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={showInitialMessage ? {
                boxShadow: [
                  '0 20px 25px -5px rgba(240, 86, 68, 0.5)',
                  '0 25px 30px -5px rgba(240, 86, 68, 0.8)',
                  '0 20px 25px -5px rgba(240, 86, 68, 0.5)',
                ],
              } : {}}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              {/* Animated background shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              {/* Notification badge */}
              {showInitialMessage && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-grace-accent-alt rounded-full border-2 border-white shadow-lg z-10"
                >
                  <motion.div
                    className="absolute inset-0 bg-grace-accent-alt rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
              )}
              {/* Logo Icon */}
              <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center p-1.5 sm:p-2">
                <img
                  src="/images/giftofgracelogo.png"
                  alt="Chat with Gift of Grace"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    if (e.target.parentElement) {
                      e.target.parentElement.innerHTML = `
                        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-grace-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      `
                    }
                  }}
                />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 sm:right-6 z-40 w-full sm:w-96 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-t border-l border-r sm:border border-gray-200/50 backdrop-blur-xl"
              style={{
                bottom: '0',
                top: 'auto',
                height: 'min(550px, calc(100vh - 120px))',
                maxHeight: 'calc(100vh - 120px)',
              }}
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-grace-accent to-grace-accent-alt text-white p-3 sm:p-4 flex items-center justify-between shadow-lg relative overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }} />
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                  {/* Bot Avatar */}
                  <div className="relative">
                    <motion.div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-grace-accent to-grace-accent-alt shadow-xl flex items-center justify-center overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-1.5 sm:p-2">
                      <img
                        src="/images/giftofgracelogo.png"
                        alt="Gift of Grace"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-grace-blue/10 rounded-full">
                                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-grace-blue" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                              </svg>
                            </div>
                          `
                        }}
                      />
                      </div>
                    </motion.div>
                    {/* Online indicator with pulse animation */}
                    <motion.div 
                      className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-400 rounded-full border-2 border-white shadow-lg z-10"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-base sm:text-lg flex items-center gap-1.5 sm:gap-2">
                      Gift of Grace
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-grace-accent-alt" />
                    </h3>
                    <p className="text-[10px] sm:text-xs text-blue-100/90 font-medium">We're here to help</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => {
                    setIsOpen(false)
                    setHasAutoOpened(true) // Prevent auto-reopening after manual close
                  }}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors relative z-10"
                  aria-label="Close chat"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 space-y-3 sm:space-y-4" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent'
              }}>
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center h-full"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                        >
                          <Bot className="w-12 h-12 sm:w-16 sm:h-16 text-grace-accent-alt/40 mx-auto mb-3 sm:mb-4" />
                        </motion.div>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">Starting conversation...</p>
                        <p className="text-gray-300 text-[10px] sm:text-xs mt-1">Ask me anything about our products!</p>
                      </div>
                    </motion.div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start space-x-2 sm:space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                      >
                        {/* Avatar */}
                        {message.sender === 'bot' && (
                          <motion.div 
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white p-1 sm:p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-gray-100 shadow-sm"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <img
                              src="/images/giftofgracelogo.png"
                              alt="Bot"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.parentElement.innerHTML = `
                                  <svg class="w-5 h-5 text-grace-blue" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                  </svg>
                                `
                              }}
                            />
                          </motion.div>
                        )}
                        {message.sender === 'user' && (
                          <motion.div 
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-grace-accent flex-shrink-0 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-md ring-2 ring-grace-accent-alt/40"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <span className="text-[9px] sm:text-[10px]">You</span>
                          </motion.div>
                        )}
                        
                        {/* Message Content */}
                        <div className={`flex-1 min-w-0 ${message.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className={`rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-md ${
                              message.sender === 'user'
                                ? 'bg-grace-accent text-white rounded-tr-sm max-w-[90%] sm:max-w-[85%] hover:bg-grace-accent/90 transition-colors'
                                : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100 max-w-[90%] sm:max-w-[85%]'
                            }`}
                          >
                            {message.sender === 'user' ? (
                              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words text-white">
                                {message.text}
                              </p>
                            ) : (
                              <div className="text-xs sm:text-sm leading-relaxed break-words text-gray-800 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-strong:text-gray-900 prose-strong:font-semibold">
                                <ReactMarkdown
                                  components={{
                                    p: ({children}) => <p className="my-1">{children}</p>,
                                    ul: ({children}) => <ul className="list-disc pl-4 my-1 space-y-0.5">{children}</ul>,
                                    ol: ({children}) => <ol className="list-decimal pl-4 my-1 space-y-0.5">{children}</ol>,
                                    li: ({children}) => <li className="my-0.5">{children}</li>,
                                    strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                    em: ({children}) => <em className="italic">{children}</em>,
                                    a: ({href, children}) => <a href={href} className="text-grace-accent underline hover:text-grace-accent-alt" target="_blank" rel="noopener noreferrer">{children}</a>,
                                    code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                                    h1: ({children}) => <h1 className="font-bold text-base mt-2 mb-1">{children}</h1>,
                                    h2: ({children}) => <h2 className="font-bold text-sm mt-2 mb-1">{children}</h2>,
                                    h3: ({children}) => <h3 className="font-semibold text-sm mt-1 mb-1">{children}</h3>,
                                  }}
                                >
                                  {message.text}
                                </ReactMarkdown>
                              </div>
                            )}
                          </motion.div>
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-1.5 px-1 ${message.sender === 'user' ? 'mr-1' : 'ml-1'}`}
                          >
                            {formatTime(message.timestamp)}
                          </motion.p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>

                {/* Loading indicator with typing animation */}
                {(isLoading && isTyping) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="flex items-start space-x-3"
                  >
                    <motion.div 
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white p-1 sm:p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-gray-100 shadow-sm"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <img
                        src="/images/giftofgracelogo.png"
                        alt="Bot"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = `
                            <svg class="w-5 h-5 text-grace-accent" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            </svg>
                          `
                        }}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <div className="bg-white rounded-xl sm:rounded-2xl rounded-tl-sm px-3 sm:px-4 py-3 sm:py-4 shadow-md border border-gray-100">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="flex space-x-1 sm:space-x-1.5">
                            <motion.div
                              className="w-2.5 h-2.5 bg-grace-accent rounded-full"
                              animate={{ 
                                y: [0, -10, 0],
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ 
                                duration: 0.8, 
                                repeat: Infinity, 
                                delay: 0,
                                ease: 'easeInOut'
                              }}
                            />
                            <motion.div
                              className="w-2.5 h-2.5 bg-grace-accent rounded-full"
                              animate={{ 
                                y: [0, -10, 0],
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ 
                                duration: 0.8, 
                                repeat: Infinity, 
                                delay: 0.25,
                                ease: 'easeInOut'
                              }}
                            />
                            <motion.div
                              className="w-2.5 h-2.5 bg-grace-accent rounded-full"
                              animate={{ 
                                y: [0, -10, 0],
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ 
                                duration: 0.8, 
                                repeat: Infinity, 
                                delay: 0.5,
                                ease: 'easeInOut'
                              }}
                            />
                          </div>
                          <motion.span
                            className="text-xs text-gray-500"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                          >
                            typing...
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200/50 bg-white p-3 sm:p-4 safe-area-inset-bottom">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value)
                        // Auto-resize textarea
                        e.target.style.height = 'auto'
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(e)
                        }
                      }}
                      placeholder="Type your message..."
                      disabled={isLoading}
                      rows={1}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-grace-accent/50 focus:border-grace-accent transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm hover:shadow-md resize-none overflow-hidden min-h-[44px] max-h-[120px]"
                      style={{ height: 'auto' }}
                    />
                    {inputValue.trim() && (
                      <motion.button
                        type="button"
                        onClick={() => {
                          setInputValue('')
                          if (inputRef.current) {
                            inputRef.current.style.height = 'auto'
                          }
                        }}
                        className="absolute right-2 sm:right-3 top-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                      </motion.button>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-grace-accent text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg hover:bg-grace-accent/90 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group flex-shrink-0 self-end"
                    whileHover={!isLoading && inputValue.trim() ? { scale: 1.05 } : {}}
                    whileTap={!isLoading && inputValue.trim() ? { scale: 0.95 } : {}}
                    aria-label="Send message"
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin relative z-10" />
                    ) : (
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                    )}
                  </motion.button>
                </form>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 text-center flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-grace-accent-alt" />
                  Powered by Gift of Grace
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot

