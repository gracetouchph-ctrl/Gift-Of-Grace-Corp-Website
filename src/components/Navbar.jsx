import { useState, useEffect, memo } from 'react'
import { ShoppingBag, Menu, X, ExternalLink } from 'lucide-react'

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'catalog', label: 'Products' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">

          {/* Logo - Left aligned, prominent */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-3 group"
            aria-label="Gift of Grace Home"
          >
            <div className={`relative transition-all duration-300 ${isScrolled ? 'w-12 h-12' : 'w-14 h-14 lg:w-16 lg:h-16'}`}>
              <img
                src="/images/giftofgracelogo_transparent.png"
                alt="Gift of Grace"
                className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
                loading="eager"
                fetchpriority="high"
              />
            </div>
            <div className={`hidden sm:flex flex-col transition-all duration-300 ${isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <span className="text-lg lg:text-xl font-serif font-semibold text-grace-dark-blue tracking-tight leading-tight">
                Gift of Grace
              </span>
              <span className="text-[10px] lg:text-xs text-grace-accent font-medium tracking-widest uppercase">
                Food Manufacturing
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1 bg-gray-50/80 backdrop-blur-sm rounded-full px-2 py-1.5 border border-gray-100">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeSection === link.id
                      ? 'text-white bg-grace-accent shadow-md'
                      : 'text-gray-600 hover:text-grace-dark-blue hover:bg-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right side - CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://ph.shp.ee/k5ZzgF6"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-gradient-to-r from-grace-accent to-rose-500 text-white pl-5 pr-4 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-lg shadow-grace-accent/25 hover:shadow-xl hover:shadow-grace-accent/30 hover:scale-105 active:scale-100 transition-all duration-300"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Now</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative w-5 h-4">
              <span className={`absolute left-0 w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${isMobileMenuOpen ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1.5 w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${isMobileMenuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-xl transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  activeSection === link.id
                    ? 'bg-grace-accent text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-gray-100">
              <a
                href="https://ph.shp.ee/k5ZzgF6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-grace-accent to-rose-500 text-white px-6 py-4 rounded-xl font-semibold text-base shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Shop on Shopee</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar
