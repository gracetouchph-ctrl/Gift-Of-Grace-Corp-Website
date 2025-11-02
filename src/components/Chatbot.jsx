import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, Bot } from 'lucide-react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasAppeared, setHasAppeared] = useState(false)
  const [showInitialMessage, setShowInitialMessage] = useState(false)
  const [hasAutoOpened, setHasAutoOpened] = useState(false)

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

  const initialMessage = "Hello! 👋 Welcome to Gift of Grace. I'm here to help you discover our premium wellness products. How can I assist you today?"

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
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative w-16 h-16 bg-gradient-to-br from-grace-blue to-grace-dark-blue rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={showInitialMessage ? {
                boxShadow: [
                  '0 20px 25px -5px rgba(59, 130, 246, 0.5)',
                  '0 20px 25px -5px rgba(59, 130, 246, 0.8)',
                  '0 20px 25px -5px rgba(59, 130, 246, 0.5)',
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
              {/* Notification badge */}
              {showInitialMessage && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-grace-gold rounded-full border-2 border-white"
                />
              )}
              <MessageCircle className="w-8 h-8" />
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
              className="fixed bottom-6 right-6 z-40 w-[90vw] sm:w-96 h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-grace-blue to-grace-dark-blue text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Bot Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center overflow-hidden">
                      <img
                        src="/images/giftofgracelogo.png"
                        alt="Gift of Grace"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-grace-blue/10 rounded-full">
                              <svg class="w-6 h-6 text-grace-blue" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                              </svg>
                            </div>
                          `
                        }}
                      />
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-normal text-base">Gift of Grace</h3>
                    <p className="text-xs text-blue-100">We're here to help</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setHasAutoOpened(true) // Prevent auto-reopening after manual close
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {/* Initial Bot Message */}
                <AnimatePresence>
                  {showInitialMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-white p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
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
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-200">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {initialMessage}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 ml-1">Just now</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Empty state when no messages yet */}
                {!showInitialMessage && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Bot className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Starting conversation...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-grace-blue focus:border-transparent text-sm"
                  />
                  <motion.button
                    className="w-10 h-10 bg-gradient-to-r from-grace-blue to-grace-dark-blue text-white rounded-full flex items-center justify-center hover:from-grace-dark-blue hover:to-grace-blue transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Powered by Gift of Grace
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot

