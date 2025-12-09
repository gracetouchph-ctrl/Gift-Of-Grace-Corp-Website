import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, Bot, Loader2, Sparkles } from 'lucide-react'

// RASA API Configuration
// Change this URL when deploying to production
const RASA_API_URL = import.meta.env.VITE_RASA_API_URL || 'http://localhost:5005/webhooks/rest/webhook'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasAppeared, setHasAppeared] = useState(false)
  const [showInitialMessage, setShowInitialMessage] = useState(false)
  const [hasAutoOpened, setHasAutoOpened] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Show chatbot button after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAppeared(true)
      // Show initial message 1 second after appearing
      setTimeout(() => {
        setShowInitialMessage(true)
      }, 1000)
    }, 7000)

    return () => clearTimeout(timer)
  }, [])

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
  // RASA RAG INTEGRATION
  // ============================================
  // This function communicates with the RASA server
  // which uses RAG (Retrieval Augmented Generation)
  // to provide intelligent responses about Gift of Grace
  // ============================================
  const getModelResponse = async (userMessage, conversationHistory) => {
    try {
      // Generate a unique sender ID for the session
      const senderId = sessionStorage.getItem('chatbot_sender_id') || `user_${Date.now()}`
      if (!sessionStorage.getItem('chatbot_sender_id')) {
        sessionStorage.setItem('chatbot_sender_id', senderId)
      }

      // RASA REST API format
      const response = await fetch(RASA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      // Each response has a "text" field and optionally "buttons", "image", etc.
      if (Array.isArray(data) && data.length > 0) {
        // Combine all text responses into one message
        const combinedResponse = data
          .filter(msg => msg.text)
          .map(msg => msg.text)
          .join('\n\n')

        return combinedResponse || 'I apologize, but I could not process that request.'
      }

      return 'I apologize, but I could not process that request.'

    } catch (error) {
      console.error('Error getting RASA response:', error)
      // Fallback response if RASA server fails
      return "I'm sorry, I'm having trouble connecting to the knowledge base right now. Please make sure the RASA server is running (rasa run --cors \"*\") and try again."
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

  return (
    <>
      {/* Chatbot Button */}
      <AnimatePresence>
        {hasAppeared && !isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40"
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
            />

            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-40 w-full sm:w-96 h-[calc(100vh-4rem)] sm:h-[600px] sm:max-h-[600px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-t border-l border-r sm:border border-gray-200/50 backdrop-blur-xl"
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
                            <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                              message.sender === 'user' ? 'text-white' : 'text-gray-800'
                            }`}>
                              {message.text}
                            </p>
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
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      disabled={isLoading}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-grace-accent/50 focus:border-grace-accent transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm hover:shadow-md"
                    />
                    {inputValue.trim() && (
                      <motion.button
                        type="button"
                        onClick={() => setInputValue('')}
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
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
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-grace-accent text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg hover:bg-grace-accent/90 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group flex-shrink-0"
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

