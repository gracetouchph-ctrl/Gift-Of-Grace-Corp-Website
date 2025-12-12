import { useRef, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { Facebook, ShoppingBag, Mail, Phone, MapPin, Heart } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const Footer = memo(() => {
  const currentYear = new Date().getFullYear()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

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
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-grace-accent/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <motion.h3
              className="text-xl lg:text-2xl font-serif font-medium mb-4 tracking-tight"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              Gift of Grace Food Manufacturing
            </motion.h3>
            <p className="text-gray-400 italic mb-4">A Touch of Grace, Infused with Comfort</p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Proudly Filipino-made kimchi, tofu, rice coffee, pickled radish, and chicken pastil
              crafted to nourish, comfort, and bless communities across Northern Luzon and beyond.
            </p>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-semibold mb-6 tracking-wide uppercase text-grace-accent">Contact Us</h4>
            <div className="space-y-4">
              <motion.div
                className="flex items-start gap-3 group"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-grace-accent" />
                <p className="text-gray-400 text-sm leading-relaxed">
                  #5 Purok 6, Pinsao Pilot Project,<br />
                  Baguio City, 2600, Philippines
                </p>
              </motion.div>
              <motion.a
                href="mailto:kimchigift@gmail.com"
                className="flex items-center gap-3 text-gray-400 group"
                whileHover={{ x: 4, color: '#ffffff' }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="w-5 h-5 flex-shrink-0 text-grace-accent group-hover:text-rose-400 transition-colors" />
                <span className="text-sm">kimchigift@gmail.com</span>
              </motion.a>
              <div className="space-y-2 text-gray-400 text-sm">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Phone className="w-5 h-5 flex-shrink-0 text-grace-accent" />
                  <span>+63 074 661 3554</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Phone className="w-5 h-5 flex-shrink-0 text-grace-accent" />
                  <span>+63 917 5958 907</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Social Media Section */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-semibold mb-6 tracking-wide uppercase text-grace-accent">Follow Us</h4>
            <div className="flex flex-col gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 group"
                    whileHover={{ x: 8, color: '#ffffff' }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
                      whileHover={{
                        backgroundColor: 'rgba(240, 86, 68, 0.2)',
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="w-5 h-5 text-grace-accent group-hover:text-rose-400 transition-colors" />
                    </motion.div>
                    <span className="text-sm">{social.label}</span>
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Divider with animation */}
        <motion.div
          className="border-t border-white/10 pt-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p
              className="text-gray-500 text-sm flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              <span>&copy; {currentYear} Gift of Grace. Made with</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="w-4 h-4 text-grace-accent fill-grace-accent" />
              </motion.span>
              <span>in the Philippines.</span>
            </motion.p>
            <motion.div
              className="flex gap-6 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              <motion.a
                href="#home"
                className="hover:text-grace-accent transition-colors"
                whileHover={{ y: -2 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#home"
                className="hover:text-grace-accent transition-colors"
                whileHover={{ y: -2 }}
              >
                Terms of Service
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
