import { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ExternalLink } from 'lucide-react'

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'catalog', label: 'Products' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

const menuVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = navLinks.map(link => document.getElementById(link.id))
      const scrollPos = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">

          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-3 group"
            aria-label="Gift of Grace Home"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className={`relative transition-all duration-300 ${isScrolled ? 'w-12 h-12' : 'w-14 h-14 lg:w-16 lg:h-16'}`}
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/images/giftofgracelogo_transparent.png"
                alt="Gift of Grace"
                className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
                loading="eager"
                fetchpriority="high"
              />
            </motion.div>
            <motion.div
              className="hidden sm:flex flex-col"
              initial={{ opacity: 1 }}
              animate={{ opacity: isScrolled ? 0 : 1, width: isScrolled ? 0 : 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-lg lg:text-xl font-serif font-semibold text-grace-dark-blue tracking-tight leading-tight">
                Gift of Grace
              </span>
              <span className="text-[10px] lg:text-xs text-grace-accent font-medium tracking-widest uppercase">
                Food Manufacturing
              </span>
            </motion.div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <motion.div
              className="flex items-center gap-1 bg-gray-50/80 backdrop-blur-sm rounded-full px-2 py-1.5 border border-gray-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    activeSection === link.id
                      ? 'text-white'
                      : 'text-gray-600 hover:text-grace-dark-blue'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: activeSection !== link.id ? 1.05 : 1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active background indicator */}
                  {activeSection === link.id && (
                    <motion.div
                      className="absolute inset-0 bg-grace-accent rounded-full shadow-md"
                      layoutId="activeNav"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            className="hidden lg:flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.a
              href="https://ph.shp.ee/k5ZzgF6"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-gradient-to-r from-grace-accent to-rose-500 text-white pl-5 pr-4 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-lg shadow-grace-accent/25"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(240, 86, 68, 0.35)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Now</span>
              <motion.span
                initial={{ x: 0, y: 0 }}
                whileHover={{ x: 2, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </motion.span>
            </motion.a>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-5 h-4">
              <motion.span
                className="absolute left-0 w-full h-0.5 bg-gray-700 rounded"
                animate={{
                  top: isMobileMenuOpen ? '6px' : '0px',
                  rotate: isMobileMenuOpen ? 45 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="absolute left-0 top-1.5 w-full h-0.5 bg-gray-700 rounded"
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 w-full h-0.5 bg-gray-700 rounded"
                animate={{
                  top: isMobileMenuOpen ? '6px' : '12px',
                  rotate: isMobileMenuOpen ? -45 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation with AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-xl overflow-hidden"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      activeSection === link.id
                        ? 'bg-grace-accent text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    variants={menuItemVariants}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.div
                  className="pt-4 mt-2 border-t border-gray-100"
                  variants={menuItemVariants}
                >
                  <motion.a
                    href="https://ph.shp.ee/k5ZzgF6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-grace-accent to-rose-500 text-white px-6 py-4 rounded-xl font-semibold text-base shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Shop on Shopee</span>
                    <ExternalLink className="w-4 h-4 opacity-70" />
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar
