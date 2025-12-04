  import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      const offset = 80 // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    closeMobileMenu()
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-grace-accent/10'
          : 'bg-white/90 backdrop-blur-sm py-4 border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between relative">
          {/* Left Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className="text-gray-700 hover:text-grace-accent transition-colors duration-200 font-normal tracking-wide uppercase text-sm focus:outline-none focus:ring-2 focus:ring-grace-accent focus:ring-offset-2 rounded px-2 py-1"
            >
              Home
            </a>
            <a
              href="#catalog"
              onClick={(e) => handleNavClick(e, 'catalog')}
              className="text-gray-700 hover:text-grace-accent transition-colors duration-200 font-normal tracking-wide uppercase text-sm focus:outline-none focus:ring-2 focus:ring-grace-accent focus:ring-offset-2 rounded px-2 py-1"
            >
              Catalog
            </a>
          </div>

          {/* Centered Logo */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, 'home')}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-grace-accent focus:ring-offset-2 rounded-lg p-1" 
              aria-label="Gift of Grace Home"
            >
              <img
                src="/images/giftofgracelogo.png"
                alt="Gift of Grace"
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  e.target.style.display = 'none'
                  if (e.target.parentElement) {
                    e.target.parentElement.innerHTML = `
                      <span class="text-2xl font-serif font-semibold text-grace-blue tracking-wide">Gift Of Grace</span>
                    `
                  }
                }}
              />
            </a>
          </motion.div>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="text-gray-700 hover:text-grace-accent transition-colors duration-200 font-normal tracking-wide uppercase text-sm focus:outline-none focus:ring-2 focus:ring-grace-accent focus:ring-offset-2 rounded px-2 py-1"
            >
              About Us
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-gray-700 hover:text-grace-accent transition-colors duration-200 font-normal tracking-wide uppercase text-sm focus:outline-none focus:ring-2 focus:ring-grace-accent focus:ring-offset-2 rounded px-2 py-1"
            >
              Contact
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Shopee Button */}
            <motion.a
              href="https://ph.shp.ee/k5ZzgF6"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 bg-grace-accent text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-grace-accent/90 transition-colors duration-200 font-normal tracking-wide uppercase text-xs focus:outline-none focus:ring-2 focus:ring-grace-accent focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Visit Shopee Store"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Shopee</span>
            </motion.a>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-700 hover:text-grace-accent transition-colors focus:outline-none focus:ring-2 focus:ring-grace-accent focus:ring-offset-2 rounded-lg"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="mt-4 pb-4 space-y-2 border-t border-gray-200 pt-4">
                <a
                  href="#home"
                  onClick={(e) => handleNavClick(e, 'home')}
                  className="block text-sm text-gray-700 hover:text-grace-accent hover:bg-gray-50 transition-colors px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-grace-accent"
                >
                  Home
                </a>
                <a
                  href="#catalog"
                  onClick={(e) => handleNavClick(e, 'catalog')}
                  className="block text-sm text-gray-700 hover:text-grace-accent hover:bg-gray-50 transition-colors px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-grace-accent"
                >
                  Catalog
                </a>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="block text-sm text-gray-700 hover:text-grace-accent hover:bg-gray-50 transition-colors px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-grace-accent"
                >
                  About Us
                </a>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="block text-sm text-gray-700 hover:text-grace-accent hover:bg-gray-50 transition-colors px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-grace-accent"
                >
                  Contact
                </a>
                <a
                  href="https://ph.shp.ee/k5ZzgF6"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="block text-sm bg-grace-accent text-white px-4 py-2 rounded-full hover:bg-grace-accent/90 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-grace-accent focus:ring-offset-2 mt-2"
                >
                  Visit Shopee Store
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar

