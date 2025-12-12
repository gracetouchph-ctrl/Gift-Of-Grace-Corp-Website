import { memo, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, ChevronDown, Sparkles, Star, ShoppingBag } from 'lucide-react'

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

const AnimatedText = ({ text, className, delay = 0 }) => {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className='inline-block mr-[0.25em]'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delay + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

const Hero = memo(() => {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const isInView = useInView(contentRef, { once: true, amount: 0.3 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const orbY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  const scrollToProducts = () => {
    const element = document.getElementById('catalog')
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      ref={sectionRef}
      id='home'
      className='relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-grace-light-blue/30'
    >
      <motion.div className='absolute inset-0 overflow-hidden' style={{ y: backgroundY }}>
        <motion.div
          className='absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-grace-accent/20 to-rose-200/30 rounded-full blur-3xl'
          style={{ y: orbY }}
        />
        <motion.div
          className='absolute top-1/2 -left-20 sm:-left-40 w-[150px] h-[150px] sm:w-[280px] sm:h-[280px] lg:w-[400px] lg:h-[400px] bg-gradient-to-br from-grace-accent-alt/20 to-sky-200/30 rounded-full blur-3xl'
          style={{ y: orbY }}
        />
        <motion.div
          className='absolute -bottom-10 right-1/4 sm:-bottom-20 sm:right-1/3 w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] lg:w-[300px] lg:h-[300px] bg-gradient-to-br from-grace-gold/15 to-amber-100/20 rounded-full blur-3xl'
          style={{ y: orbY }}
        />
        <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px]' />
      </motion.div>

      <motion.div
        ref={contentRef}
        className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32'
        style={{ y: contentY }}
      >
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]'>
          <motion.div
            className='flex flex-col justify-center text-center lg:text-left order-2 lg:order-1'
            variants={containerVariants}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.div
              variants={itemVariants}
              className='inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md shadow-gray-200/50 border border-gray-100 mb-6 lg:mb-8 mx-auto lg:mx-0 w-fit'
            >
              <Sparkles className='w-4 h-4 text-grace-gold' />
              <span className='text-sm font-medium text-gray-700'>Proudly Filipino-Made</span>
              <div className='flex items-center gap-0.5'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className='w-3 h-3 fill-grace-gold text-grace-gold' />
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className='space-y-2 lg:space-y-3 mb-6 lg:mb-8'>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-medium text-gray-900 leading-[1.1] tracking-tight'>
                <AnimatedText text='A Touch of' delay={0.3} />
                <motion.span
                  className='block text-grace-accent italic'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  Grace
                </motion.span>
              </h1>
              <motion.p
                className='text-xl sm:text-2xl lg:text-3xl text-gray-500 font-light tracking-tight'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
              >
                Infused with Comfort
              </motion.p>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className='text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 lg:mb-10'
            >
              Discover our handcrafted delicacies-from authentic kimchi to artisan rice coffee-each
              crafted with tradition, wellness, and Filipino heart.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className='flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start'
            >
              <motion.a
                href='https://ph.shp.ee/k5ZzgF6'
                target='_blank'
                rel='noopener noreferrer'
                className='group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-base shadow-xl shadow-gray-900/20'
                whileHover={{ scale: 1.05, y: -4, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <ShoppingBag className='w-5 h-5' />
                <span>Shop Now</span>
                <motion.span
                  className='inline-block'
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className='w-4 h-4' />
                </motion.span>
              </motion.a>
              <motion.button
                onClick={scrollToProducts}
                className='flex items-center gap-2 text-gray-600 px-6 py-4 rounded-full font-medium'
                whileHover={{ color: '#E91E63', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <span>Explore Products</span>
                <ChevronDown className='w-5 h-5' />
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className='flex items-center gap-6 lg:gap-8 justify-center lg:justify-start mt-10 lg:mt-12 pt-8 border-t border-gray-100'
            >
              {[
                { value: '150+', label: 'Outlets' },
                { value: 'Since', label: '2017' },
                { value: '5+', label: 'Products' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className='text-center lg:text-left'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1, ease: 'easeOut' }}
                >
                  <div className='text-2xl lg:text-3xl font-bold text-gray-900'>{stat.value}</div>
                  <div className='text-xs text-gray-500 uppercase tracking-wider'>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className='relative order-1 lg:order-2'
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className='relative max-w-md lg:max-w-lg mx-auto'>
              <motion.div
                className='absolute inset-4 lg:inset-6 bg-gradient-to-br from-grace-accent/10 to-grace-accent-alt/10 rounded-3xl'
                initial={{ rotate: 0 }}
                animate={{ rotate: 3 }}
                transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
              <motion.div
                className='absolute inset-4 lg:inset-6 bg-gradient-to-br from-grace-gold/10 to-amber-50 rounded-3xl'
                initial={{ rotate: 0 }}
                animate={{ rotate: -3 }}
                transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />

              <motion.div
                className='relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-3 lg:p-4 border border-gray-100'
                whileHover={{ y: -8, boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-grace-light-blue/50 via-white to-rose-50/50'>
                  <img
                    src='/images/girl.png'
                    alt='Gift of Grace Products'
                    className='w-full h-auto object-contain'
                    loading='eager'
                    fetchpriority='high'
                  />
                </div>

                <motion.div
                  className='absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 lg:-bottom-6 lg:-right-6 bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-5 border border-gray-100'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                >
                  <div className='flex items-center gap-2 sm:gap-3'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-grace-accent to-rose-500 flex items-center justify-center'>
                      <img
                        src='/images/giftofgracelogo_transparent.png'
                        alt='Gift of Grace'
                        className='w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain'
                      />
                    </div>
                    <div>
                      <div className='font-semibold text-gray-900 text-xs sm:text-sm lg:text-base'>Gift of Grace</div>
                      <div className='text-[10px] sm:text-xs text-gray-500'>Premium Quality</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                className='absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-12 h-12 sm:w-20 sm:h-20 bg-grace-gold/20 rounded-full blur-xl'
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className='absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 w-16 h-16 sm:w-24 sm:h-24 bg-grace-accent/15 rounded-full blur-xl'
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <motion.button
          onClick={scrollToProducts}
          className='flex flex-col items-center gap-2 text-gray-400'
          whileHover={{ color: '#E91E63' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-label='Scroll to products'
        >
          <ChevronDown className='w-6 h-6' />
        </motion.button>
      </motion.div>
    </section>
  )
})

Hero.displayName = 'Hero'

export default Hero
