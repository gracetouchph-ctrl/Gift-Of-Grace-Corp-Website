import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, Bot, Loader2, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Lottie from 'lottie-react'

// Interactive Digital Assistant animation from LottieFiles
// A cute robot assistant perfect for the chatbot
const GRACE_ANIMATION_URL = 'https://assets-v2.lottiefiles.com/a/4beb1208-1167-11ee-8a85-bf74c92392f1/WaEfyS2NQM.json'

// Helper function to customize Lottie animation colors
// Converts color arrays in Lottie format to new colors
const customizeLottieColors = (animationData, colorMap) => {
  if (!animationData) return animationData

  const data = JSON.parse(JSON.stringify(animationData)) // Deep clone

  // Recursive function to find and replace colors
  const replaceColors = (obj) => {
    if (!obj || typeof obj !== 'object') return

    // Check if this is a color property (k array with RGB values 0-1)
    if (obj.k && Array.isArray(obj.k) && obj.k.length >= 3) {
      const [r, g, b] = obj.k
      // Check if it's a color value (0-1 range)
      if (r <= 1 && g <= 1 && b <= 1 && r >= 0 && g >= 0 && b >= 0) {
        // Apply color mapping based on brightness
        const brightness = (r + g + b) / 3

        // Customize main colors to brand theme
        if (brightness > 0.7) {
          // Light colors -> Grace accent light
          obj.k = [0.988, 0.898, 0.918, 1] // #FCE5EA - soft pink
        } else if (brightness > 0.4) {
          // Mid colors -> Grace accent
          obj.k = [0.914, 0.118, 0.388, 1] // #E91E63 - grace accent pink
        } else if (brightness > 0.2) {
          // Dark colors -> Purple accent
          obj.k = [0.612, 0.153, 0.69, 1] // #9C27B0 - purple
        }
      }
    }

    // Recurse into nested objects and arrays
    if (Array.isArray(obj)) {
      obj.forEach(replaceColors)
    } else {
      Object.values(obj).forEach(replaceColors)
    }
  }

  // Process layers
  if (data.layers) {
    replaceColors(data.layers)
  }

  return data
}

// Particle colors for blast effect
const PARTICLE_COLORS = ['#E91E63', '#9C27B0', '#2196F3', '#00BCD4', '#4CAF50', '#FF9800']

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

  // Grace mascot animation states
  const [animationData, setAnimationData] = useState(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [showBubble, setShowBubble] = useState(true)
  const [particles, setParticles] = useState([])
  const [isHovering, setIsHovering] = useState(false)
  const scrollTimeoutRef = useRef(null)
  const particleIntervalRef = useRef(null)

  // Generate floating particles around the robot
  const generateParticle = () => {
    const id = Date.now() + Math.random()
    const angle = Math.random() * Math.PI * 2
    const distance = 40 + Math.random() * 30
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
    const size = 4 + Math.random() * 6
    const duration = 1.5 + Math.random() * 1

    return {
      id,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      color,
      size,
      duration,
    }
  }

  // Continuous particle generation
  useEffect(() => {
    if (hasAppeared && !isOpen && !isScrolling) {
      // Generate particles continuously
      particleIntervalRef.current = setInterval(() => {
        setParticles(prev => {
          const newParticles = [...prev, generateParticle()]
          // Keep only last 8 particles
          return newParticles.slice(-8)
        })
      }, 400)
    } else {
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current)
      }
      setParticles([])
    }

    return () => {
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current)
      }
    }
  }, [hasAppeared, isOpen, isScrolling])

  // Load Lottie animation data and customize colors
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch(GRACE_ANIMATION_URL)
        if (response.ok) {
          const data = await response.json()
          if (data && (data.v || data.layers)) {
            // Apply brand color customization
            const customizedData = customizeLottieColors(data)
            setAnimationData(customizedData)
            console.log('Loaded and customized robot animation')
            return
          }
        }
      } catch (err) {
        console.log('Failed to load animation:', err)
      }
      console.log('Animation load failed, using fallback icon')
    }

    loadAnimation()
  }, [])

  // Hide bubble on scroll, show again when stopped
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true)
      setShowBubble(false)

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Show bubble again after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
        setShowBubble(true)
      }, 1500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

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

  // Removed auto-open behavior - chat only opens when user clicks the button

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
      {/* Floating Grace Mascot Chat Button */}
      <AnimatePresence>
        {hasAppeared && !isOpen && activeMode !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{
              scale: isScrolling ? 0.8 : 1,
              opacity: 1,
              y: 0
            }}
            exit={{ scale: 0, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30"
          >
            {/* Compact Speech bubble - hides on scroll */}
            <AnimatePresence>
              {showInitialMessage && showBubble && !isScrolling && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-lg px-3 py-2 border border-grace-accent/20 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-gray-700">Need help?</span>
                    <motion.span
                      animate={{ rotate: [0, 14, -8, 14, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                      className="text-sm"
                    >
                      👋
                    </motion.span>
                  </div>
                  {/* Bubble tail */}
                  <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-grace-accent/20 transform rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grace Robot Mascot - No container, animation IS the button */}
            <motion.button
              onClick={() => setIsOpen(true)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="relative w-20 h-20 sm:w-24 sm:h-24 cursor-pointer"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                y: isScrolling ? 0 : [0, -8, 0],
              }}
              transition={{
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                },
                scale: { type: 'spring', stiffness: 400, damping: 15 }
              }}
            >
              {/* Orbiting energy rings */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 border border-grace-accent/30 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 border border-purple-400/20 rounded-full" />
              </motion.div>

              {/* Floating particles - blast effect */}
              <AnimatePresence>
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
                    style={{
                      width: particle.size,
                      height: particle.size,
                      backgroundColor: particle.color,
                      boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                    }}
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 1
                    }}
                    animate={{
                      x: particle.x,
                      y: particle.y,
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0]
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: particle.duration,
                      ease: 'easeOut'
                    }}
                  />
                ))}
              </AnimatePresence>

              {/* Pulsing glow effect behind robot */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(233,30,99,0.4) 0%, rgba(156,39,176,0.2) 50%, transparent 70%)',
                }}
                animate={{
                  scale: isHovering ? [1, 1.4, 1.2] : [1, 1.2, 1],
                  opacity: isHovering ? [0.8, 1, 0.8] : [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: isHovering ? 0.8 : 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />

              {/* Sparkle decorations */}
              <motion.div
                className="absolute -top-1 -right-1 text-yellow-400 pointer-events-none"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 15, -15, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-1 text-cyan-400 pointer-events-none"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.div>

              {/* Robot Lottie Animation - The main attraction */}
              <div className="relative w-full h-full flex items-center justify-center z-10">
                {animationData ? (
                  <motion.div
                    animate={{
                      filter: isHovering
                        ? ['drop-shadow(0 0 8px rgba(233,30,99,0.6))', 'drop-shadow(0 0 15px rgba(156,39,176,0.8))', 'drop-shadow(0 0 8px rgba(233,30,99,0.6))']
                        : 'drop-shadow(0 0 5px rgba(233,30,99,0.3))'
                    }}
                    transition={{ duration: 1, repeat: isHovering ? Infinity : 0 }}
                  >
                    <Lottie
                      animationData={animationData}
                      loop={true}
                      autoplay={true}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </motion.div>
                ) : (
                  // Fallback robot icon while loading
                  <motion.div
                    className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-grace-accent drop-shadow-lg" />
                  </motion.div>
                )}
              </div>

              {/* Notification badge */}
              {showInitialMessage && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.5 }}
                  className="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-20"
                >
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 0.6, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                </motion.div>
              )}
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

