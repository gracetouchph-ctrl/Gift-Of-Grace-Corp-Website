import { useRef, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { Store, MapPin, ShoppingCart } from 'lucide-react'

const partners = [
  { name: 'SM', icon: ShoppingCart },
  { name: 'Savemore', icon: ShoppingCart },
  { name: 'Puregold', icon: Store },
  { name: 'Robinsons', icon: Store },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
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

const WhereToFindUs = memo(() => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      ref={sectionRef}
      id="where-to-find-us"
      className="py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50/30 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-grace-accent/10 text-grace-accent rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <MapPin className="w-4 h-4" />
            Where to Find Us
          </motion.span>
          <motion.h2
            className="text-3xl lg:text-4xl xl:text-5xl font-serif font-medium text-gray-900 tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Available in Leading{' '}
            <motion.span
              className="text-grace-accent"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              Retail Chains
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-gray-500 text-lg"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            From a humble home-based kitchen to shelves across Northern Luzon, Gift of Grace
            products are now available in major supermarkets and retail partners.
          </motion.p>
        </motion.div>

        {/* Partners Grid with staggered animation */}
        <motion.div
          className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {partners.map((partner, index) => {
            const Icon = partner.icon
            return (
              <motion.div
                key={partner.name}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm cursor-pointer"
                whileHover={{
                  y: -8,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Hover gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-grace-accent/5 via-transparent to-rose-50/50"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Animated background circle */}
                <motion.div
                  className="absolute -top-10 -right-10 w-24 h-24 bg-grace-accent/5 rounded-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 2 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                <div className="relative px-6 py-8 flex flex-col items-center justify-center gap-3">
                  {/* Icon */}
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-grace-accent/10 to-rose-100/50 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className="w-6 h-6 text-grace-accent" />
                  </motion.div>

                  {/* Partner Name */}
                  <motion.span
                    className="text-lg lg:text-xl font-semibold tracking-wide text-gray-800"
                    whileHover={{ color: '#E91E63' }}
                    transition={{ duration: 0.2 }}
                  >
                    {partner.name}
                  </motion.span>

                  {/* Underline on hover */}
                  <motion.div
                    className="absolute bottom-4 left-1/2 h-0.5 bg-grace-accent rounded-full"
                    initial={{ width: 0, x: '-50%' }}
                    whileHover={{ width: 40 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional info */}
        <motion.div
          className="text-center mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.p
            className="text-gray-500 text-sm max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            Can't find us nearby? Order directly from our{' '}
            <motion.a
              href="https://ph.shp.ee/k5ZzgF6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-grace-accent font-medium"
              whileHover={{ color: '#c41e52' }}
            >
              Shopee store
            </motion.a>{' '}
            for nationwide delivery.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
})

WhereToFindUs.displayName = 'WhereToFindUs'

export default WhereToFindUs
