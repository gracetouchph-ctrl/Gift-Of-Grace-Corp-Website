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
      className="bg-grace-dark-blue text-white py-12"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-serif font-normal mb-4 tracking-wide">
              Gift of Grace Food Manufacturing Corporation
            </h3>
            <p className="text-blue-200 mb-4 italic">A Touch of Grace, Infused with Comfort</p>
            <p className="text-blue-100 text-sm">
              Proudly Filipino-made kimchi, tofu, rice coffee, pickled radish, and chicken pastil—
              crafted to nourish, comfort, and bless communities across Northern Luzon and beyond.
            </p>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-normal mb-4 tracking-wide uppercase text-sm">Get In Touch</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2 text-blue-200">
                <MapPin className="w-5 h-5 mt-0.5" aria-hidden="true" />
                <p className="text-sm leading-relaxed">
                  #5 Purok 6, Pinsao Pilot Project,
                  <br />
                  Baguio City, 2600, Philippines
                </p>
              </div>
              <a
                href="mailto:kimchigift@gmail.com"
                className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-grace-dark-blue rounded px-2 py-1"
                aria-label="Send email to Gift of Grace"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
                <span>kimchigift@gmail.com</span>
              </a>
              <div className="space-y-1 text-blue-200 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  <span>Landline: +63 074 661 3554</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  <span>Globe: +63 917 5958 907</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  <span>Smart: +63 999 991 6052</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  <span>Smart: +63 908 7804 565</span>
                </div>
              </div>
              <motion.a
                href="https://ph.shp.ee/k5ZzgF6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-grace-blue hover:bg-blue-500 px-4 py-2 rounded-full transition-colors mt-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-grace-dark-blue"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visit our Shopee store"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>Visit Our Shopee Store</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-normal mb-4 tracking-wide uppercase text-sm">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-grace-dark-blue"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-blue-700 pt-8 mt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-200 text-sm">
              © {currentYear} Gift of Grace. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-blue-200">
              <a
                href="#home"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#home"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer

