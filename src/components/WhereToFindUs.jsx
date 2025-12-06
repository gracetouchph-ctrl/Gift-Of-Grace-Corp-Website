import { motion } from 'framer-motion'
import { Store } from 'lucide-react'

const partners = [
  'SM',
  'Savemore',
  'Puregold',
  'Robinsons',
]

const WhereToFindUs = () => {
  return (
    <section
      id="where-to-find-us"
      className="py-10 sm:py-12 md:py-16 bg-gradient-to-r from-grace-accent/5 via-white to-grace-accent-alt/5"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-8 sm:mb-10 px-4"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/80 shadow-sm border border-grace-accent/10 mb-3 sm:mb-4">
            <Store className="w-4 h-4 sm:w-5 sm:h-5 text-grace-accent" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-grace-accent">
              Where to Find Us
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-grace-dark-blue tracking-tight mb-2 sm:mb-3">
            Available in Leading Retail Chains
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            From a humble home-based kitchen to shelves across Northern Luzon, Gift of Grace
            products are now available in major supermarkets and retail partners.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-4"
        >
          {partners.map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/90 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-grace-accent/10 via-transparent to-grace-accent-alt/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative px-3 sm:px-4 py-4 sm:py-6 flex items-center justify-center">
                <span className="text-sm sm:text-base md:text-lg font-semibold tracking-wide text-gray-800">
                  {name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default WhereToFindUs


