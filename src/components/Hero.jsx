import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react'

const Hero = () => {
  const scrollToProducts = () => {
    const element = document.getElementById('catalog')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-br from-grace-light-blue via-white to-grace-accent-alt/20"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle circles */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-grace-accent-alt/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-grace-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)] py-8 sm:py-12 lg:py-20">
          {/* Left Column - Text Content & Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: 'tween',
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                type: 'tween',
                duration: 0.5,
                ease: 'easeOut'
              }}
              className="mb-4 sm:mb-6"
            >
              <img
                src="/images/giftofgracelogo.png"
                alt="Gift of Grace Logo"
                className="h-20 sm:h-28 md:h-32 lg:h-40 xl:h-48 w-auto object-contain mx-auto lg:mx-0"
                loading="eager"
                fetchPriority="high"
              />
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: 'tween',
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.1
              }}
              className="space-y-2 sm:space-y-3 lg:space-y-4"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-grace-accent font-normal italic leading-tight sm:leading-relaxed tracking-tight">
                A Touch of Grace,
              </h2>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-grace-dark-blue font-medium italic leading-tight sm:leading-relaxed tracking-tight">
                Infused with Comfort
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal tracking-normal px-2 sm:px-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                type: 'tween',
                duration: 0.5,
                ease: 'easeOut',
                delay: 0.2
              }}
            >
              Discover our handcrafted delicacies made with care and tradition. Each product reflects
              our passion for taste, wellness, and comfort—rooted in Filipino flavors and infused
              with grace.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                type: 'tween',
                duration: 0.5,
                ease: 'easeOut',
                delay: 0.3
              }}
              className="pt-2 sm:pt-4"
            >
              <motion.a
                href="https://ph.shp.ee/k5ZzgF6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-grace-accent to-grace-accent-alt text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-normal tracking-wide uppercase hover:from-grace-accent-alt hover:to-grace-accent transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-grace-accent focus:ring-offset-2"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Shop now on Shopee"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: 'tween',
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.15
            }}
            className="relative flex items-center justify-center lg:justify-end mt-6 lg:mt-0"
          >
            <div className="relative w-full max-w-xl px-2 sm:px-0">
              {/* Multiple layered decorative backgrounds - hidden on mobile */}
              <div className="absolute inset-0 bg-gradient-to-br from-grace-accent-alt/30 via-grace-accent/15 to-grace-accent-alt/20 rounded-full blur-3xl transform scale-125 -z-10 hidden sm:block" />
              <div className="absolute inset-0 bg-gradient-to-tr from-grace-accent/10 to-grace-accent-alt/25 rounded-full blur-2xl transform scale-110 -z-10 hidden sm:block" />
              
              {/* Main image container with elegant multi-layer frame */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: 'tween',
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.2
                }}
                whileHover={{ scale: 1.03 }}
              >
                {/* Outer shadow frame - reduced on mobile */}
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-grace-accent/50 via-grace-accent-alt/40 to-grace-accent/50 rounded-[1.5rem] sm:rounded-[2.5rem] blur-xl opacity-40 sm:opacity-60" />
                
                {/* Middle decorative ring - simplified on mobile */}
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-grace-accent-alt/40 via-white to-grace-accent/30 rounded-[1.25rem] sm:rounded-[2rem] p-0.5 sm:p-1">
                  <div className="w-full h-full bg-gradient-to-br from-grace-accent-alt/15 to-grace-accent/15 rounded-[1rem] sm:rounded-[1.75rem]" />
                </div>

                {/* Inner image frame */}
                <div className="relative bg-gradient-to-br from-white via-grace-light-blue/30 to-white p-3 sm:p-5 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-grace-accent-alt/60">
                  {/* Corner decorations - smaller on mobile */}
                  <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 md:w-16 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-grace-accent/70 rounded-tl-2xl sm:rounded-tl-3xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 md:w-16 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-grace-accent/70 rounded-tr-2xl sm:rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 md:w-16 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-grace-accent/70 rounded-bl-2xl sm:rounded-bl-3xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 md:w-16 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-grace-accent/70 rounded-br-2xl sm:rounded-br-3xl" />
                  
                  {/* Image with background and overlay effects */}
                  <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-grace-light-blue via-white to-grace-accent-alt/15">
                    {/* Decorative background pattern - reduced opacity on mobile */}
                    <div className="absolute inset-0 opacity-20 sm:opacity-30" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, #3B82F6 1px, transparent 0)',
                      backgroundSize: '20px 20px'
                    }} />
                    
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-grace-accent/20 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-grace-accent-alt/25 rounded-full blur-2xl" />
                    
                    {/* Image */}
                    <motion.img
                      src="/images/girl.png"
                      alt="Gift of Grace"
                      className="relative w-full h-auto rounded-lg sm:rounded-xl object-contain z-10"
                      loading="lazy"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none z-20" />
                  </div>

                  {/* Decorative elements inside frame - hidden on mobile */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-12 sm:h-12 bg-grace-accent/20 rounded-full blur-md hidden sm:block" />
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 sm:w-10 sm:h-10 bg-grace-accent-alt/25 rounded-full blur-md hidden sm:block" />
                </div>

                {/* Sparkles - hidden on mobile */}
                <motion.div
                  className="absolute -top-6 -right-6 w-6 h-6 sm:w-8 sm:h-8 hidden sm:block"
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ willChange: 'transform' }}
                >
                  <Sparkles className="w-full h-full text-grace-accent/40" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -left-6 w-4 h-4 sm:w-6 sm:h-6 hidden sm:block"
                  animate={{ 
                    rotate: [360, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ willChange: 'transform' }}
                >
                  <Sparkles className="w-full h-full text-grace-accent-alt/40" />
                </motion.div>
              </motion.div>

              {/* Animated background elements - hidden on mobile */}
              <motion.div
                className="absolute -top-8 right-8 w-16 h-16 sm:w-24 sm:h-24 bg-grace-accent/15 rounded-full blur-2xl hidden sm:block"
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ willChange: 'transform' }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-12 h-12 sm:w-20 sm:h-20 bg-grace-accent-alt/20 rounded-full blur-2xl hidden sm:block"
                animate={{ 
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 3,
                }}
                style={{ willChange: 'transform' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            type: 'tween',
            duration: 0.5,
            delay: 0.4,
            ease: 'easeOut'
          }}
        >
          <motion.button
            onClick={scrollToProducts}
            className="flex flex-col items-center text-grace-blue hover:text-grace-dark-blue transition-colors focus:outline-none focus:ring-2 focus:ring-grace-blue focus:ring-offset-2 rounded-lg p-2"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ willChange: 'transform' }}
            aria-label="Scroll to products section"
          >
            <span className="text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Explore Products</span>
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

