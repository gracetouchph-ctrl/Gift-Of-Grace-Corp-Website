import { motion } from 'framer-motion'
import { Star, Quote, Users, Heart } from 'lucide-react'

const CustomerReviews = () => {
  return (
    <section
      id="reviews"
      className="py-20 bg-gradient-to-b from-grace-light-blue/30 via-white to-white relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-grace-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-grace-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ 
            type: 'tween',
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-grace-gold mr-3" />
            <h2 className="text-4xl sm:text-5xl font-normal text-grace-dark-blue tracking-tight">
              What Our Customers Say
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real feedback from people who love our products
          </p>
        </motion.div>

        {/* Main Review Display */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ 
            type: 'tween',
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2
          }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative">
            {/* Decorative Quote Icon */}
            <motion.div
              className="absolute -top-6 -left-6 z-10 hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-grace-gold/20 to-grace-blue/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-grace-gold/30">
                <Quote className="w-10 h-10 text-grace-gold" />
              </div>
            </motion.div>

            {/* Main Review Image Container */}
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
              whileHover={{ 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                scale: 1.01
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Elegant Frame with Multiple Layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-grace-blue/5 via-transparent to-grace-gold/5 pointer-events-none" />
              
              {/* Gold Accent Border */}
              <div className="absolute inset-0 border-4 border-grace-gold/20 rounded-3xl pointer-events-none" />
              
              {/* Image Container */}
              <div className="relative">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-grace-gold/30 rounded-tl-3xl z-10" />
                <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-grace-gold/30 rounded-tr-3xl z-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-grace-gold/30 rounded-bl-3xl z-10" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-grace-gold/30 rounded-br-3xl z-10" />
                
                {/* Customer Review Image */}
                <img
                  src="/images/Customer Review.png"
                  alt="Customer Reviews - Gift of Grace"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
                
                {/* Gradient Overlay at edges for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Bottom Decorative Quote Icon */}
            <motion.div
              className="absolute -bottom-6 -right-6 z-10 hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-grace-blue/20 to-grace-gold/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-grace-blue/30 rotate-180">
                <Quote className="w-10 h-10 text-grace-blue" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ 
            type: 'tween',
            duration: 0.6,
            delay: 0.4,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { label: 'Happy Customers', value: '500+', icon: Users },
            { label: '5-Star Ratings', value: '98%', icon: Star },
            { label: 'Customer Satisfaction', value: '99%', icon: Heart },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  type: 'tween',
                  duration: 0.5,
                  delay: 0.5 + (index * 0.1),
                  ease: 'easeOut'
                }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-grace-blue/10 to-grace-gold/10 rounded-2xl mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-8 h-8 text-grace-blue" />
                </motion.div>
                <div className="text-3xl sm:text-4xl font-normal text-grace-dark-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ 
            type: 'tween',
            duration: 0.6,
            delay: 0.6,
            ease: 'easeOut'
          }}
          className="text-center mt-12"
        >
          <p className="text-gray-700 text-lg mb-4">
            Join hundreds of satisfied customers
          </p>
          <motion.a
            href="https://ph.shp.ee/k5ZzgF6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-grace-blue to-grace-dark-blue text-white px-8 py-4 rounded-full text-lg font-normal tracking-wide uppercase hover:from-grace-dark-blue hover:to-grace-blue transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-grace-blue focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Shop now on Shopee"
          >
            <Star className="w-5 h-5" aria-hidden="true" />
            <span>Experience the Quality</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default CustomerReviews

