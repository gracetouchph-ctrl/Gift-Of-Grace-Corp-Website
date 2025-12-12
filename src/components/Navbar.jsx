import { useState, useEffect, memo } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'

const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
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
      const offset = 80
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2 sm:py-3 border-grace-accent/10'
          : 'bg-white/90 backdrop-blur-sm py-3 sm:py-4 border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className="text-gray-700 hover:text-grace-accent transition-colors duration-200 font-medium tracking-wide uppercase text-sm"
            >
              Home
            </a>
            <a
              href="#catalog"
              onClick={(e) => handleNavClick(e, 'catalog')}
              className="text-gray-700 hover:text-grace-accent transition-colors duration-200 font-medium tracking-wide uppercase text-sm"
            >
              Catalog
            </a>
          </div>

          {/* Centered Logo */}
          <div className="flex-shrink-0">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className="flex items-center hover:opacity-80 transition-opacity"
              aria-label="Gift of Grace Home"
            >
              <img
                src="/images/giftofgracelogo.png"
                alt="Gift of Grace"
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? 'h-10 sm:h-12' : 'h-12 sm:h-14 md:h-16'
                }`}
                loading="eager"
                fetchpriority="high"
                onError={(e) => {
                  e.target.style.display = 'none'
                  if (e.target.parentElement) {
                    e.target.parentElement.innerHTML = `
                      <span class="text-xl sm:text-2xl font-serif font-semibold text-grace-accent tracking-wide">Gift Of Grace</span>
                    `
                  }
                }}
              />
            </a>
          </div>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="text-gray-700 hover:text-grace-accent transition-colors duration-200 font-medium tracking-wide uppercase text-sm"
            >
              About Us
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-gray-700 hover:text-grace-accent transition-colors duration-200 font-medium tracking-wide uppercase text-sm"
            >
              Contact
            </a>
            {/* Shopee Button */}
            <a
              href="https://ph.shp.ee/k5ZzgF6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 bg-grace-accent text-white px-4 py-2 rounded-full hover:bg-grace-accent/90 transition-all duration-200 font-medium tracking-wide uppercase text-xs hover:scale-105 active:scale-95"
              aria-label="Visit Shopee Store"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shopee</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-700 hover:text-grace-accent transition-colors rounded-lg"
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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <a
                href="#home"
                onClick={(e) => handleNavClick(e, 'home')}
                className="text-gray-700 hover:text-grace-accent transition-colors px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Home
              </a>
              <a
                href="#catalog"
                onClick={(e) => handleNavClick(e, 'catalog')}
                className="text-gray-700 hover:text-grace-accent transition-colors px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Catalog
              </a>
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, 'about')}
                className="text-gray-700 hover:text-grace-accent transition-colors px-4 py-2 rounded-md hover:bg-gray-50"
              >
                About Us
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="text-gray-700 hover:text-grace-accent transition-colors px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Contact
              </a>
              <a
                href="https://ph.shp.ee/k5ZzgF6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-grace-accent text-white px-4 py-3 rounded-full hover:bg-grace-accent/90 transition-colors font-medium"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop on Shopee</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar
