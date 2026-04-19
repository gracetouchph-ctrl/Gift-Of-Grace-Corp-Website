import { useRef, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Package } from 'lucide-react'

const partners = [
  { name: 'SM Supermarket', color: '#003DA5', initial: 'SM' },
  { name: 'Savemore', color: '#E31937', initial: 'S' },
  { name: 'Puregold', color: '#FFB800', initial: 'P' },
  { name: 'Robinsons', color: '#00529B', initial: 'R' },
  { name: 'Super8', color: '#E85D00', initial: 'S8' },
]

const WhereToFindUs = memo(() => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <section
      ref={sectionRef}
      id="where-to-find-us"
      className="py-16 lg:py-20 bg-stone-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-8 lg:mb-12"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <MapPin className="w-6 h-6 text-grace-accent" />
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Where to Find Us
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Retail Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available at trusted retail partners
            </h3>
            <div className="flex flex-wrap gap-4 mb-4">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: partner.color }}
                  >
                    {partner.initial}
                  </div>
                  <span className="font-medium text-gray-800">{partner.name}</span>
                </motion.div>
              ))}
            </div>
            <motion.p
              className="text-gray-600 text-sm"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              Available across Northern Luzon supermarkets
            </motion.p>
          </motion.div>

          {/* Location & Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Our Location
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-grace-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Gift of Grace</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      #5 Purok 6, Pinsao Pilot Project<br />
                      Baguio City 2600
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-grace-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Online Orders</p>
                    <p className="text-gray-600 text-sm mb-2">
                      Can't find us nearby? Order directly for nationwide delivery.
                    </p>
                    <motion.a
                      href="https://ph.shp.ee/k5ZzgF6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-grace-accent text-white text-sm font-medium rounded-md"
                      whileHover={{ backgroundColor: '#d14538' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Visit our Shopee store
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
})

WhereToFindUs.displayName = 'WhereToFindUs'

export default WhereToFindUs
