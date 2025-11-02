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
      className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-br from-grace-light-blue via-white to-blue-50"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle circles */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-grace-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-grace-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)] py-12 lg:py-20">
          {/* Left Column - Text Content & Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: 'tween',
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="flex flex-col justify-center space-y-6 lg:space-y-8"
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
              className="mb-6"
            >
              <img
                src="/images/giftofgracelogo.png"
                alt="Gift of Grace Logo"
                className="h-24 sm:h-32 lg:h-40 xl:h-48 w-auto object-contain drop-shadow-lg"
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
              className="space-y-4"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-grace-dark-blue font-normal italic leading-relaxed tracking-tight">
                A Touch of Grace,
              </h2>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-grace-gold font-medium italic leading-relaxed tracking-tight">
                Infused with Comfort
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl font-normal tracking-normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                type: 'tween',
                duration: 0.5,
                ease: 'easeOut',
                delay: 0.2
              }}
            >
              Discover our handcrafted delicacies made with care and tradition. 
              Each product reflects our passion for taste, wellness, and comfort.
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
              className="pt-4"
            >
              <motion.a
                href="https://ph.shp.ee/k5ZzgF6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-grace-blue to-grace-dark-blue text-white px-8 py-4 rounded-full text-lg font-normal tracking-wide uppercase hover:from-grace-dark-blue hover:to-grace-blue transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-grace-blue focus:ring-offset-2"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Shop now on Shopee"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
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
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-xl">
              {/* Multiple layered decorative backgrounds */}
              <div className="absolute inset-0 bg-gradient-to-br from-grace-blue/25 via-grace-gold/20 to-grace-blue/15 rounded-full blur-3xl transform scale-125 -z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-grace-gold/15 to-grace-blue/25 rounded-full blur-2xl transform scale-110 -z-10" />
              
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
                {/* Outer shadow frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-grace-gold/40 via-grace-blue/30 to-grace-gold/40 rounded-[2.5rem] blur-xl opacity-60" />
                
                {/* Middle decorative ring */}
                <div className="absolute -inset-2 bg-gradient-to-r from-grace-blue/30 via-white to-grace-gold/30 rounded-[2rem] p-1">
                  <div className="w-full h-full bg-gradient-to-br from-grace-blue/10 to-grace-gold/10 rounded-[1.75rem]" />
                </div>

                {/* Inner image frame */}
                <div className="relative bg-gradient-to-br from-white via-grace-light-blue/30 to-white p-5 lg:p-8 rounded-3xl shadow-2xl border-4 border-grace-gold/40">
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-grace-gold/60 rounded-tl-3xl" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-grace-gold/60 rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-grace-gold/60 rounded-bl-3xl" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-grace-gold/60 rounded-br-3xl" />
                  
                  {/* Image with background and overlay effects */}
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-grace-light-blue via-white to-grace-blue/10">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, #3B82F6 1px, transparent 0)',
                      backgroundSize: '20px 20px'
                    }} />
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-grace-gold/20 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-grace-blue/20 rounded-full blur-2xl" />
                    
                    {/* Image */}
                    <motion.img
                      src="/images/girl.png"
                      alt="Gift of Grace"
                      className="relative w-full h-auto rounded-xl object-contain z-10"
                      loading="lazy"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none z-20" />
                  </div>

                  {/* Decorative elements inside frame */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-grace-gold/20 rounded-full blur-md" />
                  <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-grace-blue/20 rounded-full blur-md" />
                </div>

                <motion.div
                  className="absolute -top-6 -right-6 w-8 h-8"
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
                  <Sparkles className="w-full h-full text-grace-gold/40" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -left-6 w-6 h-6"
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
                  <Sparkles className="w-full h-full text-grace-blue/40" />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute -top-8 right-8 w-24 h-24 bg-grace-gold/15 rounded-full blur-2xl"
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
                className="absolute -bottom-8 -left-8 w-20 h-20 bg-grace-blue/15 rounded-full blur-2xl"
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
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
            <span className="text-sm mb-2 font-medium">Explore Products</span>
            <ChevronDown className="w-6 h-6" aria-hidden="true" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

