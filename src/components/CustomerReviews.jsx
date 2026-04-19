import { useRef, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Maria Santos',
    location: 'Baguio City',
    rating: 5,
    text: 'The kimchi is absolutely authentic! Reminds me of homemade Korean kimchi but with a Filipino twist. My family loves it with every meal.',
    product: 'Gift of Grace Kimchi',
  },
  {
    name: 'James Reyes',
    location: 'La Trinidad',
    rating: 5,
    text: 'I order the rice coffee every month. The flavor is so smooth and natural. You can tell it\'s made with care and quality ingredients.',
    product: 'Artisan Rice Coffee',
  },
  {
    name: 'Ana Dela Cruz',
    location: 'Manila',
    rating: 5,
    text: 'Discovered Gift of Grace at SM and now I\'m hooked. The pickled radish is the perfect side dish. Great quality for the price.',
    product: 'Pickled Radish',
  },
  {
    name: 'Roberto Cadsi',
    location: 'Pangasinan',
    rating: 5,
    text: 'We serve Gift of Grace products at our restaurant. Customers always ask where we source our kimchi. Consistently great quality.',
    product: 'Gift of Grace Kimchi',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 20,
    },
  },
}

const CustomerReviews = memo(() => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="py-20 lg:py-28 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <motion.div
            className="lg:max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <Quote className="w-12 h-12 text-grace-gold mb-6" />
            <h2 className="text-4xl lg:text-5xl font-serif font-medium text-gray-900 leading-tight mb-4">
              Voices from Our Community
            </h2>
            <p className="text-gray-600 text-lg">
              Honest stories from customers who've made our products part of their daily lives.
            </p>
          </motion.div>

          <motion.div
            className="hidden lg:block w-32 h-px bg-gradient-to-r from-grace-gold to-grace-accent mt-8 lg:mt-0"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>

        {/* Reviews Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white border-l-4 border-grace-accent p-6 lg:p-8"
              whileHover={{ x: 8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Quote mark */}
              <Quote className="w-8 h-8 text-grace-gold/30 mb-4" />

              {/* Review text */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "{review.text}"
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-grace-gold fill-current" />
                ))}
              </div>

              {/* Customer info */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-gray-500 text-sm">{review.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-grace-accent font-medium text-sm">{review.product}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Simple stats */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-500 text-lg mb-8">
            Hundreds of satisfied customers across the Philippines
          </p>

          {/* Call to Action */}
          <motion.a
            href="https://ph.shp.ee/k5ZzgF6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-grace-accent text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-grace-accent/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Star className="w-5 h-5" />
            <span>Shop on Shopee</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
})

CustomerReviews.displayName = 'CustomerReviews'

export default CustomerReviews