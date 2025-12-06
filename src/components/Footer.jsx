import { motion } from 'framer-motion'
import { Facebook, ShoppingBag, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      icon: Facebook,
      href: 'https://www.facebook.com/kimchigiftofficial/',
      label: 'Facebook',
    },
    {
      icon: ShoppingBag,
      href: 'https://ph.shp.ee/k5ZzgF6',
      label: 'Shopee',
    },
    {
      icon: ShoppingBag,
      href: 'http://gogcorp.com/',
      label: 'Shopify',
    },
  ]

  return (
    <footer
      id="contact"
      className="bg-grace-dark-blue text-white relative overflow-hidden"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-grace-dark-blue via-blue-900/50 to-grace-dark-blue opacity-50" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-grace-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-grace-accent-alt/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-6 sm:mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 text-center md:text-left"
          >
            <h3 className="text-base sm:text-lg md:text-xl font-serif font-normal mb-2 sm:mb-3 tracking-wide">
              Gift of Grace Food Manufacturing Corporation
            </h3>
            <p className="text-blue-200/90 mb-2 sm:mb-3 italic text-xs sm:text-sm">A Touch of Grace, Infused with Comfort</p>
            <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              Proudly Filipino-made kimchi, tofu, rice coffee, pickled radish, and chicken pastil—
              crafted to nourish, comfort, and bless communities across Northern Luzon and beyond.
            </p>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center md:text-left"
          >
            <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 tracking-wide uppercase text-grace-accent">Contact Us</h4>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-start space-x-2 sm:space-x-3 justify-center md:justify-start">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0 text-grace-accent" aria-hidden="true" />
                <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed text-left">
                  #5 Purok 6, Pinsao Pilot Project,
                  <br />
                  Baguio City, 2600, Philippines
                </p>
              </div>
              <a
                href="mailto:kimchigift@gmail.com"
                className="flex items-center space-x-2 sm:space-x-3 text-blue-100/80 hover:text-white transition-colors group justify-center md:justify-start"
                aria-label="Send email to Gift of Grace"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-grace-accent group-hover:text-grace-accent-alt transition-colors" aria-hidden="true" />
                <span className="text-xs sm:text-sm break-all">kimchigift@gmail.com</span>
              </a>
              <div className="space-y-1.5 sm:space-y-2 text-blue-100/80 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 sm:space-x-3 justify-center md:justify-start">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-grace-accent" aria-hidden="true" />
                  <span>+63 074 661 3554</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 justify-center md:justify-start">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-grace-accent" aria-hidden="true" />
                  <span>+63 917 5958 907</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 justify-center md:justify-start">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-grace-accent" aria-hidden="true" />
                  <span>+63 999 991 6052</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 justify-center md:justify-start">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-grace-accent" aria-hidden="true" />
                  <span>+63 908 7804 565</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 tracking-wide uppercase text-grace-accent">Follow Us</h4>
            <div className="flex flex-col space-y-2.5 sm:space-y-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 sm:space-x-3 text-blue-100/80 hover:text-white transition-colors group justify-center md:justify-start"
                    whileHover={{ x: 5 }}
                    aria-label={social.label}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 group-hover:bg-grace-accent/20 flex items-center justify-center transition-colors">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-grace-accent group-hover:text-grace-accent-alt transition-colors" aria-hidden="true" />
                    </div>
                    <span className="text-xs sm:text-sm">{social.label}</span>
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-4 sm:pt-6 mt-6 sm:mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 sm:space-y-3 md:space-y-0">
            <p className="text-blue-200/70 text-xs sm:text-sm text-center md:text-left">
              © {currentYear} Gift of Grace. All rights reserved.
            </p>
            <div className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm text-blue-200/70">
              <a
                href="#home"
                className="hover:text-grace-accent transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#home"
                className="hover:text-grace-accent transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

