import { useRef, memo } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Star, Quote, Users, Heart } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

const CustomerReviews = memo(() => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const decorY1 = useTransform(scrollYProgress, [0, 1], [0, -60])
  const decorY2 = useTransform(scrollYProgress, [0, 1], [0, 60])

  const stats = [
    { label: 'Happy Customers', value: '500+', icon: Users },
    { label: '5-Star Ratings', value: '98%', icon: Star },
    { label: 'Customer Satisfaction', value: '99%', icon: Heart },
  ]

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden"
    >
      {/* Decorative background elements with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-20 w-64 h-64 bg-grace-gold/5 rounded-full blur-3xl"
          style={{ y: decorY1 }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-grace-accent/5 rounded-full blur-3xl"
          style={{ y: decorY2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 bg-grace-accent/10 text-grace-accent rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Testimonials
          </motion.span>
          <motion.h2
            className="text-3xl lg:text-4xl xl:text-5xl font-serif font-medium text-gray-900 tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What Our Customers Say
          </motion.h2>
          <motion.p
            className="text-gray-500 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Real feedback from people who love our products
          </motion.p>
        </motion.div>

        {/* Main Review Display */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative">
            {/* Decorative Quote Icon - Top Left */}
            <motion.div
              className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 lg:-top-6 lg:-left-6 z-10 hidden sm:block"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-grace-accent/20 to-rose-100 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-grace-accent/20"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-grace-accent" />
              </motion.div>
            </motion.div>

            {/* Main Review Image Container */}
            <motion.div
              className="relative bg-white rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden border border-gray-100"
              whileHover={{
                boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                y: -4,
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {/* Gold Accent Border */}
              <div className="absolute inset-0 border-2 lg:border-4 border-grace-accent/10 rounded-2xl lg:rounded-3xl pointer-events-none" />

              {/* Image Container */}
              <div className="relative">
                {/* Decorative corners */}
                <motion.div
                  className="absolute top-0 left-0 w-12 h-12 lg:w-24 lg:h-24 border-t-2 lg:border-t-4 border-l-2 lg:border-l-4 border-grace-accent/20 rounded-tl-2xl lg:rounded-tl-3xl z-10"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5, duration: 0.4 }}
                />
                <motion.div
                  className="absolute top-0 right-0 w-12 h-12 lg:w-24 lg:h-24 border-t-2 lg:border-t-4 border-r-2 lg:border-r-4 border-grace-accent/20 rounded-tr-2xl lg:rounded-tr-3xl z-10"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.55, duration: 0.4 }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-12 h-12 lg:w-24 lg:h-24 border-b-2 lg:border-b-4 border-l-2 lg:border-l-4 border-grace-accent/20 rounded-bl-2xl lg:rounded-bl-3xl z-10"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6, duration: 0.4 }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-12 h-12 lg:w-24 lg:h-24 border-b-2 lg:border-b-4 border-r-2 lg:border-r-4 border-grace-accent/20 rounded-br-2xl lg:rounded-br-3xl z-10"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.65, duration: 0.4 }}
                />

                {/* Customer Review Image */}
                <motion.img
                  src="/images/Customer Review.png"
                  alt="Customer Reviews - Gift of Grace"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Bottom Decorative Quote Icon */}
            <motion.div
              className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 lg:-bottom-6 lg:-right-6 z-10 hidden sm:block"
              initial={{ opacity: 0, scale: 0, rotate: 180 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 180 } : {}}
              transition={{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-sky-100 to-grace-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-sky-200/30"
                whileHover={{ scale: 1.1, rotate: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-sky-500" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust Indicators with staggered animation */}
        <motion.div
          className="mt-10 sm:mt-16 lg:mt-20 grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-grace-accent/10 to-rose-100/50 rounded-xl sm:rounded-2xl mb-2 sm:mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-grace-accent" />
                </motion.div>
                <motion.div
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-gray-500 uppercase tracking-wide leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-8 sm:mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.p
            className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
          >
            Join hundreds of satisfied customers
          </motion.p>
          <motion.a
            href="https://ph.shp.ee/k5ZzgF6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 sm:gap-3 bg-gray-900 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-sm sm:text-base shadow-xl shadow-gray-900/20"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              y: -4,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Experience the Quality</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
})

CustomerReviews.displayName = 'CustomerReviews'

export default CustomerReviews
