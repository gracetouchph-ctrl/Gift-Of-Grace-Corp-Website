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
      className="py-16 bg-gradient-to-r from-grace-accent/5 via-white to-grace-accent-alt/5"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-grace-accent/10 mb-4">
            <Store className="w-5 h-5 text-grace-accent" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-grace-accent">
              Where to Find Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal text-grace-dark-blue tracking-tight mb-3">
            Available in Leading Retail Chains
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            From a humble home-based kitchen to shelves across Northern Luzon, Gift of Grace
            products are now available in major supermarkets and retail partners.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
        >
          {partners.map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="group relative overflow-hidden rounded-2xl bg-white/90 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-grace-accent/10 via-transparent to-grace-accent-alt/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative px-4 py-6 flex items-center justify-center">
                <span className="text-base sm:text-lg font-semibold tracking-wide text-gray-800">
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


