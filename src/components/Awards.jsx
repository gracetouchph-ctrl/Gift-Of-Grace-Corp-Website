import { useState, useRef, memo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ExternalLink, Award, PlayCircle, Image as ImageIcon, X, ArrowUpRight, Link2, Sparkles } from 'lucide-react'
import { awards } from '../data/awards'

const typeConfig = {
  Article: { icon: Award, color: '#f05644', bg: 'rgba(240,86,68,0.08)', label: 'Article' },
  Gallery: { icon: ImageIcon, color: '#D4AF37', bg: 'rgba(212,175,55,0.08)', label: 'Gallery' },
  Post: { icon: Sparkles, color: '#60b2d4', bg: 'rgba(96,178,212,0.08)', label: 'Post' },
  Video: { icon: PlayCircle, color: '#f05644', bg: 'rgba(240,86,68,0.08)', label: 'Video' },
  Links: { icon: Link2, color: '#9b7dd4', bg: 'rgba(155,125,212,0.08)', label: 'Collection' },
}

const getType = (type) => typeConfig[type] || typeConfig.Article

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.25 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 30,
    transition: { duration: 0.2 },
  },
}

function AwardCard({ item, idx, onOpenLinks }) {
  const config = getType(item.type)
  const Icon = config.icon
  const hasLinks = !!item.links
  const isFeatured = idx === 0

  return (
    <motion.div
      variants={itemVariants}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100/80 bg-white ${
        isFeatured ? 'sm:col-span-2 sm:row-span-2' : ''
      }`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)' }}
      whileHover={{
        y: -6,
        boxShadow: `0 20px 50px rgba(0,0,0,0.08), 0 0 0 1px ${config.color}15`,
      }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Image */}
      <div className={`relative w-full overflow-hidden ${isFeatured ? 'h-52 sm:h-72 lg:h-80' : 'h-44 sm:h-52'}`}>
        <motion.div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: item.preview
              ? `url(${item.preview})`
              : `linear-gradient(135deg, ${config.color}30, ${config.color}08)`,
          }}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Year pill */}
        <div className="absolute top-4 right-4">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {item.year}
          </span>
        </div>

        {/* Type badge */}
        <div className="absolute top-4 left-4">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3
            className={`font-serif font-semibold leading-tight text-white drop-shadow-lg ${
              isFeatured ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-lg'
            }`}
          >
            {item.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-sm text-gray-500 leading-relaxed flex-1">
          {item.highlight}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-50">
          {hasLinks ? (
            <motion.button
              onClick={() => onOpenLinks(item)}
              className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-4 py-2"
              style={{ color: config.color, background: config.bg }}
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link2 className="w-4 h-4" />
              View collection
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </motion.button>
          ) : (
            <motion.a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-4 py-2"
              style={{ color: config.color, background: config.bg }}
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ExternalLink className="w-4 h-4" />
              Read more
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </motion.a>
          )}
        </div>
      </div>

      {/* Accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}40)` }}
      />
    </motion.div>
  )
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
        {/* Header */}
        <motion.div
          className="text-center mb-14 lg:mb-20"
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

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 auto-rows-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {awards.map((item, idx) => (
            <AwardCard
              key={`${item.title}-${idx}`}
              item={item}
              idx={idx}
              onOpenLinks={setOpenItem}
            />
          ))}
        </motion.div>
      </div>

      {/* Links Modal */}
      <AnimatePresence>
        {openItem && openItem.links && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpenItem(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Modal header */}
              <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
                <motion.button
                  onClick={() => setOpenItem(null)}
                  className="absolute top-4 right-4 w-8 h-8 inline-flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </motion.button>

                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      color: getType(openItem.type).color,
                      background: getType(openItem.type).bg,
                    }}
                  >
                    {(() => { const TypeIcon = getType(openItem.type).icon; return <TypeIcon className="w-3.5 h-3.5" /> })()}
                    {getType(openItem.type).label}
                  </span>
                  <span className="text-xs text-gray-400">{openItem.year}</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-gray-900 pr-8">
                  {openItem.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{openItem.highlight}</p>
              </div>

              {/* Links grid */}
              <div className="p-6 max-h-80 overflow-y-auto scrollbar-thin">
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.03 } },
                  }}
                >
                  {openItem.links.map((link, linkIdx) => (
                    <motion.a
                      key={`${link.url}-${linkIdx}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center justify-between gap-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl px-3.5 py-2.5 transition-colors"
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="truncate">{link.label}</span>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 transition-all group-hover/link:text-grace-accent group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      />
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
})

Awards.displayName = 'Awards'

export default Awards
