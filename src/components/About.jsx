import { memo, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Heart, Sparkles, Leaf, Target, Eye, Camera, Award, Users, TrendingUp } from 'lucide-react'

// Gallery image data with captions and metadata
const galleryImages = [
  {
    id: 1,
    src: '/images/CompanyPicture1.PNG',
    caption: 'Where It All Began',
    description: 'Our humble home kitchen in 2017',
    size: 'large', // large, medium, small
    accent: 'from-grace-accent/80 to-rose-600/80',
  },
  {
    id: 2,
    src: '/images/CompanyPicture2.PNG',
    caption: 'Growing Together',
    description: 'Team expansion & community',
    size: 'medium',
    accent: 'from-sky-500/80 to-blue-600/80',
  },
  {
    id: 3,
    src: '/images/CompanyPicture3.PNG',
    caption: 'Quality First',
    description: 'Production excellence',
    size: 'small',
    accent: 'from-emerald-500/80 to-teal-600/80',
  },
  {
    id: 4,
    src: '/images/CompanyPicture4.PNG',
    caption: 'Recognition',
    description: 'Awards & milestones',
    size: 'small',
    accent: 'from-amber-500/80 to-orange-600/80',
  },
  {
    id: 5,
    src: '/images/CompanyPicture5.PNG',
    caption: 'The Future',
    description: 'Expanding our reach',
    size: 'medium',
    accent: 'from-purple-500/80 to-violet-600/80',
  },
]

// Journey Gallery Component with Parallax and Advanced Animations
const JourneyGallery = memo(({ isInView, scrollYProgress }) => {
  // Parallax transforms for different layers
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -30])
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -60])
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -90])
  const decorRotate = useTransform(scrollYProgress, [0, 1], [0, 15])
  const decorScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Section Header with decorative elements */}
      <div className="text-center mb-10 lg:mb-14 relative">
        {/* Decorative line */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-8 bg-gradient-to-b from-transparent via-grace-accent/30 to-grace-accent/60"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        />

        <motion.div
          className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-grace-accent/10 via-rose-50 to-grace-accent/10 rounded-full border border-grace-accent/20 mt-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Camera className="w-4 h-4 text-grace-accent" />
          <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
            Our Journey
          </span>
          <Sparkles className="w-4 h-4 text-grace-accent" />
        </motion.div>

        <motion.h3
          className="text-2xl lg:text-3xl font-serif font-medium text-gray-900 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          From Kitchen to{' '}
          <span className="text-grace-accent">Community</span>
        </motion.h3>

        <motion.p
          className="text-gray-500 mt-2 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          A visual story of growth, passion, and Filipino pride
        </motion.p>
      </div>

      {/* Floating decorative elements with parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-grace-accent/10 to-rose-200/20 rounded-full blur-2xl"
          style={{ y: layer1Y, rotate: decorRotate, scale: decorScale }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-br from-sky-200/20 to-grace-accent/10 rounded-full blur-2xl"
          style={{ y: layer2Y }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-br from-amber-200/30 to-orange-200/20 rounded-full blur-xl"
          style={{ y: layer3Y }}
        />
      </div>

      {/* Bento Grid Gallery */}
      <div className="grid grid-cols-6 grid-rows-2 gap-3 lg:gap-4 h-[400px] sm:h-[450px] lg:h-[500px] relative z-10">
        {galleryImages.map((image, index) => {
          // Determine grid span based on size
          const gridClass = image.size === 'large'
            ? 'col-span-3 row-span-2'
            : image.size === 'medium'
            ? 'col-span-2 row-span-1'
            : 'col-span-1 row-span-1'

          // Stagger delays
          const delay = 0.9 + index * 0.1

          return (
            <motion.div
              key={image.id}
              className={`${gridClass} group relative overflow-hidden rounded-2xl lg:rounded-3xl cursor-pointer`}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay,
                type: 'spring',
                stiffness: 100,
                damping: 15
              }}
              whileHover={{
                scale: 1.02,
                zIndex: 20,
              }}
              style={{ y: index % 2 === 0 ? layer1Y : layer2Y }}
            >
              {/* Image with zoom effect */}
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>

              {/* Gradient overlay - always visible but intensifies on hover */}
              <div className={`absolute inset-0 bg-gradient-to-t ${image.accent} opacity-0 group-hover:opacity-90 transition-opacity duration-500`} />

              {/* Subtle base overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-500" />

              {/* Decorative corner accents */}
              <motion.div
                className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-white/40 rounded-tl-lg opacity-0 group-hover:opacity-100"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
              <motion.div
                className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-white/40 rounded-br-lg opacity-0 group-hover:opacity-100"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />

              {/* Caption - slides up on hover */}
              <motion.div
                className="absolute inset-x-0 bottom-0 p-4 lg:p-5"
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-white font-semibold text-sm lg:text-base drop-shadow-lg">
                    {image.caption}
                  </h4>
                  <p className="text-white/80 text-xs lg:text-sm mt-1 drop-shadow">
                    {image.description}
                  </p>
                </div>
              </motion.div>

              {/* Year badge for large image */}
              {image.size === 'large' && (
                <motion.div
                  className="absolute top-4 right-4 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: delay + 0.3 }}
                >
                  <span className="text-white text-xs font-medium">Est. 2017</span>
                </motion.div>
              )}

              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
              />
            </motion.div>
          )
        })}
      </div>

      {/* Stats row below gallery */}
      <motion.div
        className="mt-8 lg:mt-10 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        {[
          { icon: TrendingUp, value: '2017', label: 'Founded' },
          { icon: Users, value: '150+', label: 'Retail Partners' },
          { icon: Award, value: '10+', label: 'Awards Won' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="text-center group"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-grace-accent/10 to-rose-100/50 rounded-xl mb-2"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-grace-accent" />
            </motion.div>
            <div className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
})

JourneyGallery.displayName = 'JourneyGallery'

const values = [
  {
    icon: Heart,
    title: 'Rooted in Care',
    description:
      "Born from a mother's passion for Korean kimchi lovingly adapted to the Filipino palate, every recipe is crafted as if made for family.",
  },
  {
    icon: Leaf,
    title: 'Health & Quality First',
    description:
      'From kimchi and tofu to rice coffee, pickled radish, and chicken pastil, each product is created to be both delicious and nourishing.',
  },
  {
    icon: Sparkles,
    title: 'Growing with Community',
    description:
      'From a home-based kitchen to over 150 outlets and major retail partners, our journey is guided by service, integrity, and grace.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const About = memo(() => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const headerY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={sectionRef}
      id='about'
      className='py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden relative'
    >
      {/* Decorative background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-grace-accent/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-sky-400/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Header with scroll reveal and parallax */}
        <motion.div
          className='max-w-4xl mx-auto text-center mb-16 lg:mb-20'
          style={{ y: headerY }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.span
            className='inline-block px-4 py-1.5 bg-grace-accent/10 text-grace-accent rounded-full text-sm font-medium mb-6'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our Story
          </motion.span>
          <motion.h2
            className='text-3xl lg:text-4xl xl:text-5xl font-serif font-medium text-gray-900 tracking-tight mb-6'
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            About Gift of Grace
            <span className='block text-grace-accent'>Food Manufacturing</span>
          </motion.h2>
          <motion.p
            className='text-gray-600 text-lg leading-relaxed mb-4'
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Gift of Grace Food Manufacturing Corporation began its journey in 2017, born from a
            mother's passion for creating Korean kimchi infused with a flavor profile tailored to
            the Filipino taste.
          </motion.p>
          <motion.p
            className='text-gray-500 leading-relaxed'
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            What started as a humble home-based business sharing products with neighbors soon grew
            beyond the household, reaching the local community, the online market, and eventually
            well-known retail chains such as SM, Savemore, Puregold, and Robinsons.
          </motion.p>
        </motion.div>

        {/* Values Grid with staggered entrance */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20'
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
        >
          {values.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className='group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center relative overflow-hidden'
                whileHover={{
                  y: -8,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-grace-accent/5 via-transparent to-rose-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                />
                <motion.div
                  className='relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-grace-accent/10 to-rose-100/50 rounded-2xl mb-5'
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className='w-8 h-8 text-grace-accent' />
                </motion.div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3 tracking-tight'>
                  {item.title}
                </h3>
                <p className='text-gray-500 leading-relaxed'>{item.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Mission & Vision with hover effects */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-16 lg:mb-20'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <motion.div
            className='group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm'
            whileHover={{
              y: -6,
              boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className='flex items-center gap-4 mb-4'>
              <motion.div
                className='w-12 h-12 rounded-xl bg-gradient-to-br from-grace-accent to-rose-500 flex items-center justify-center'
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Target className='w-6 h-6 text-white' />
              </motion.div>
              <h3 className='text-2xl font-serif font-medium text-gray-900'>Mission</h3>
            </div>
            <p className='text-gray-600 leading-relaxed'>
              To produce 10 different varieties of quality and healthy foods by year 2025.
            </p>
          </motion.div>

          <motion.div
            className='group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm'
            whileHover={{
              y: -6,
              boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className='flex items-center gap-4 mb-4'>
              <motion.div
                className='w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-grace-accent-alt flex items-center justify-center'
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Eye className='w-6 h-6 text-white' />
              </motion.div>
              <h3 className='text-2xl font-serif font-medium text-gray-900'>Vision</h3>
            </div>
            <p className='text-gray-600 leading-relaxed'>
              To provide not just a living but to extend blessing, sharing grace through
              nutritious, flavorful, and proudly Filipino-made local products.
            </p>
          </motion.div>
        </motion.div>

        {/* Our Journey - Premium Gallery Section */}
        <JourneyGallery isInView={isInView} scrollYProgress={scrollYProgress} />
      </div>
    </section>
  )
})

About.displayName = 'About'

export default About
