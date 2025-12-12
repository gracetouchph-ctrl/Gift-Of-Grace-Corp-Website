import { useState, useRef, memo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ExternalLink, Award, PlayCircle, Image as ImageIcon, X } from 'lucide-react'
import { awards } from '../data/awards'

const iconFor = (type) => {
  if (type === 'Video') return PlayCircle
  if (type === 'Gallery') return ImageIcon
  return Award
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
}

const Awards = memo(() => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
  const [openItem, setOpenItem] = useState(null)

  return (
    <section
      ref={sectionRef}
      id="awards"
      className="py-20 lg:py-28 bg-gradient-to-b from-slate-50/50 via-white to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with scroll reveal */}
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
            Recognition
          </motion.span>
          <motion.h2
            className="text-3xl lg:text-4xl xl:text-5xl font-serif font-medium text-gray-900 tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Awards & Milestones
          </motion.h2>
          <motion.p
            className="text-gray-500 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Recognitions, features, and community impact stories from Gift of Grace.
          </motion.p>
        </motion.div>

        {/* Awards Grid with staggered entrance */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {awards.map((item, idx) => {
            const Icon = iconFor(item.type)
            const hasLinks = !!item.links
            return (
              <motion.div
                key={`${item.title}-${idx}`}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{
                      backgroundImage: item.preview
                        ? `linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url(${item.preview})`
                        : 'linear-gradient(180deg, rgba(24,78,167,0.35), rgba(240,86,68,0.65))',
                    }}
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Icon Badge */}
                  <motion.div
                    className="absolute top-3 left-3 flex items-center gap-2 text-white"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm text-white">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/80">{item.type}</p>
                      <p className="text-sm font-semibold">{item.year}</p>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2 drop-shadow">{item.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 flex-1">{item.highlight}</p>

                  {hasLinks ? (
                    <div className="mt-4">
                      <motion.button
                        onClick={() => setOpenItem(item)}
                        className="inline-flex items-center gap-2 text-sm text-grace-accent font-semibold"
                        whileHover={{ x: 4, color: '#c41e52' }}
                        transition={{ duration: 0.2 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View links
                      </motion.button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <motion.a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-grace-accent font-semibold"
                        whileHover={{ x: 4, color: '#c41e52' }}
                        transition={{ duration: 0.2 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </motion.a>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Modal with AnimatePresence */}
        <AnimatePresence>
          {openItem && openItem.links && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setOpenItem(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Modal Content */}
              <motion.div
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Modal Header */}
                <div
                  className="relative h-32 sm:h-40 bg-center bg-cover"
                  style={{
                    backgroundImage: openItem.preview
                      ? `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${openItem.preview})`
                      : 'linear-gradient(180deg, rgba(24,78,167,0.35), rgba(240,86,68,0.65))'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <motion.button
                    onClick={() => setOpenItem(null)}
                    className="absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-wide text-white/80">{openItem.type}</p>
                    <h3 className="text-xl font-semibold leading-tight">{openItem.title}</h3>
                    <p className="text-sm text-white/80 mt-1">{openItem.year}</p>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4">
                  <p className="text-sm text-gray-600">{openItem.highlight}</p>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.05 } }
                    }}
                  >
                    {openItem.links.map((link, linkIdx) => (
                      <motion.a
                        key={`${link.url}-${linkIdx}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between gap-2 text-xs sm:text-sm text-grace-dark-blue bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        whileHover={{
                          borderColor: 'rgba(240, 86, 68, 0.6)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          y: -2,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="truncate">{link.label}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-grace-accent flex-shrink-0" />
                      </motion.a>
                    ))}
                  </motion.div>
                  <div className="text-right pt-2">
                    <motion.button
                      onClick={() => setOpenItem(null)}
                      className="text-sm font-semibold text-grace-accent"
                      whileHover={{ scale: 1.05, color: '#c41e52' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
})

Awards.displayName = 'Awards'

export default Awards
