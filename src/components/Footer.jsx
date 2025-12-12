import { useState, useEffect, useRef, memo } from 'react'
import { Facebook, ShoppingBag, Mail, Phone, MapPin } from 'lucide-react'

const Footer = memo(() => {
  const currentYear = new Date().getFullYear()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/kimchigiftofficial/', label: 'Facebook' },
    { icon: ShoppingBag, href: 'https://ph.shp.ee/k5ZzgF6', label: 'Shopee' },
    { icon: ShoppingBag, href: 'http://gogcorp.com/', label: 'Shopify' },
  ]

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="bg-gray-900 text-white relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-grace-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-20">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-xl lg:text-2xl font-serif font-medium mb-4 tracking-tight">
              Gift of Grace Food Manufacturing
            </h3>
            <p className="text-gray-400 italic mb-4">A Touch of Grace, Infused with Comfort</p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Proudly Filipino-made kimchi, tofu, rice coffee, pickled radish, and chicken pastil
              crafted to nourish, comfort, and bless communities across Northern Luzon and beyond.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-sm font-semibold mb-6 tracking-wide uppercase text-grace-accent">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-grace-accent" />
                <p className="text-gray-400 text-sm leading-relaxed">
                  #5 Purok 6, Pinsao Pilot Project,<br />
                  Baguio City, 2600, Philippines
                </p>
              </div>
              <a
                href="mailto:kimchigift@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <Mail className="w-5 h-5 flex-shrink-0 text-grace-accent group-hover:text-rose-400 transition-colors" />
                <span className="text-sm">kimchigift@gmail.com</span>
              </a>
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0 text-grace-accent" />
                  <span>+63 074 661 3554</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0 text-grace-accent" />
                  <span>+63 917 5958 907</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="text-sm font-semibold mb-6 tracking-wide uppercase text-grace-accent">Follow Us</h4>
            <div className="flex flex-col gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-grace-accent/20 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-grace-accent group-hover:text-rose-400 transition-colors" />
                    </div>
                    <span className="text-sm">{social.label}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              (c) {currentYear} Gift of Grace. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#home" className="hover:text-grace-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#home" className="hover:text-grace-accent transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
