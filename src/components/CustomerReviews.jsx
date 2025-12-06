import { motion } from 'framer-motion'
import { Star, Quote, Users, Heart } from 'lucide-react'

const CustomerReviews = () => {
  return (
    <section
      id="reviews"
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-grace-light-blue/30 via-white to-white relative overflow-hidden"
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
          className="text-center mb-10 sm:mb-12 md:mb-16 px-4"
        >
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4 flex-wrap gap-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-grace-gold" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-grace-dark-blue tracking-tight">
              What Our Customers Say
            </h2>
          </div>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
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
              className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 z-10 hidden md:block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-grace-gold/20 to-grace-blue/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-grace-gold/30">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-grace-gold" />
              </div>
            </motion.div>

            {/* Main Review Image Container */}
            <motion.div
              className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mx-2 sm:mx-0"
              whileHover={{ 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                scale: 1.01
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Elegant Frame with Multiple Layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-grace-blue/5 via-transparent to-grace-gold/5 pointer-events-none" />
              
              {/* Gold Accent Border */}
              <div className="absolute inset-0 border-2 sm:border-4 border-grace-gold/20 rounded-2xl sm:rounded-3xl pointer-events-none" />
              
              {/* Image Container */}
              <div className="relative">
                {/* Decorative corners - smaller on mobile */}
                <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 md:w-24 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-grace-gold/30 rounded-tl-xl sm:rounded-tl-2xl md:rounded-tl-3xl z-10" />
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 md:w-24 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-grace-gold/30 rounded-tr-xl sm:rounded-tr-2xl md:rounded-tr-3xl z-10" />
                <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 md:w-24 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-grace-gold/30 rounded-bl-xl sm:rounded-bl-2xl md:rounded-bl-3xl z-10" />
                <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 md:w-24 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-grace-gold/30 rounded-br-xl sm:rounded-br-2xl md:rounded-br-3xl z-10" />
                
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
              className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 z-10 hidden md:block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-grace-blue/20 to-grace-gold/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-grace-blue/30 rotate-180">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-grace-blue" />
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
          className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4"
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
                  className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-grace-blue/10 to-grace-gold/10 rounded-xl sm:rounded-2xl mb-3 sm:mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-grace-blue" />
                </motion.div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-normal text-grace-dark-blue mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">
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
          className="text-center mt-8 sm:mt-12 px-4"
        >
          <p className="text-gray-700 text-base sm:text-lg mb-3 sm:mb-4">
            Join hundreds of satisfied customers
          </p>
          <motion.a
            href="https://ph.shp.ee/k5ZzgF6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-grace-blue to-grace-dark-blue text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-normal tracking-wide uppercase hover:from-grace-dark-blue hover:to-grace-blue transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-grace-blue focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Shop now on Shopee"
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            <span>Experience the Quality</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default CustomerReviews

