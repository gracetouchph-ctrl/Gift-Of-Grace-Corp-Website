import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, ChevronLeft, ChevronRight, ExternalLink, Star } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Kimchi Gift Set',
    price: '₱220',
    image: '/images/KimchiGift.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Authentic Korean kimchi with a perfect blend of spices',
  },
  {
    id: 2,
    name: 'Rice Coffee',
    price: '₱180',
    image: '/images/RiceCoffee.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Traditional rice coffee with a smooth, comforting flavor',
  },
  {
    id: 3,
    name: 'Pickled Radish',
    price: '₱200',
    image: '/images/PickledRadish.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Crisp and refreshing pickled radish, perfectly seasoned',
  },
  {
    id: 4,
    name: "Rene's Bangus",
    price: '₱280',
    image: '/images/RenesBangus.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Premium marinated bangus, a Filipino delicacy',
  },
  {
    id: 5,
    name: "Rene's Gourmet Chicken",
    price: '₱320',
    image: '/images/RenesGourmetChicken.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Gourmet chicken prepared with traditional Filipino flavors',
  },
]

const FeaturedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const carouselRef = useRef(null)

  // Track window width for responsive carousel
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const goToSlide = (index) => {
    if (index >= 0 && index < products.length) {
      setCurrentIndex(index)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const handleDragEnd = (event, info) => {
    const threshold = 50
    if (info.offset.x > threshold) {
      prevSlide()
    } else if (info.offset.x < -threshold) {
      nextSlide()
    }
    setIsDragging(false)
  }

  // Auto-scroll effect (optional - can be disabled)
  useEffect(() => {
    if (hasAnimated && !isDragging) {
      const interval = setInterval(() => {
        nextSlide()
      }, 5000) // Change slide every 5 seconds

      return () => clearInterval(interval)
    }
  }, [hasAnimated, isDragging, currentIndex])

  // Get visible products with circular wrapping
  const getVisibleProducts = () => {
    const visibleProducts = []
    const range = 2 // Show 2 products on each side
    
    for (let i = -range; i <= range; i++) {
      let idx = currentIndex + i
      // Wrap around for circular effect
      if (idx < 0) {
        idx = products.length + idx
      } else if (idx >= products.length) {
        idx = idx - products.length
      }
      
      // Calculate the actual display position (relative to center)
      const actualPosition = i
      
      visibleProducts.push({
        productIndex: idx,
        displayPosition: actualPosition,
      })
    }
    
    return visibleProducts
  }

  return (
    <section
      id="catalog"
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-grace-light-blue/30 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16 px-2"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-grace-dark-blue mb-3 sm:mb-4 tracking-tight">
            Our Featured Products
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Discover our handcrafted delicacies made with care and tradition
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          onViewportEnter={() => setHasAnimated(true)}
          className="relative"
        >
          {/* Navigation Arrows */}
          <motion.button
            onClick={prevSlide}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-grace-blue focus:ring-offset-2"
            aria-label="Previous product"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-grace-blue" aria-hidden="true" />
          </motion.button>
          <motion.button
            onClick={nextSlide}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-grace-blue focus:ring-offset-2"
            aria-label="Next product"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-grace-blue" aria-hidden="true" />
          </motion.button>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-visible"
          >
            <div className="relative h-full flex items-center justify-center">
              {getVisibleProducts().map(({ productIndex, displayPosition }) => {
                const product = products[productIndex]
                const position = displayPosition
                const isCenter = position === 0
                const distance = Math.abs(position)

                // Calculate responsive spacing and effects
                const spacing = windowWidth < 640 ? 260 : windowWidth < 1024 ? 320 : 420
                const sideScale = windowWidth < 640 ? 0.65 : 0.75
                const sideOpacity = windowWidth < 640 ? 0.2 : 0.35
                const sideBlur = windowWidth < 640 ? 'blur(6px)' : 'blur(4px)'

                return (
                  <motion.div
                    key={`${product.id}-${productIndex}`}
                    initial={false}
                    animate={{
                      x: position * spacing,
                      scale: isCenter ? 1 : sideScale,
                      opacity: isCenter ? 1 : sideOpacity,
                      zIndex: isCenter ? 10 : 5 - distance,
                      filter: isCenter ? 'blur(0px)' : sideBlur,
                    }}
                    transition={{
                      x: {
                        type: 'tween',
                        duration: 0.6,
                        ease: [0.25, 0.1, 0.25, 1],
                      },
                      scale: {
                        type: 'tween',
                        duration: 0.5,
                        ease: [0.4, 0.0, 0.2, 1],
                      },
                      opacity: {
                        type: 'tween',
                        duration: 0.4,
                        ease: 'easeOut',
                      },
                      filter: {
                        type: 'tween',
                        duration: 0.4,
                        ease: 'easeOut',
                      },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    dragMomentum={false}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    className="absolute cursor-grab active:cursor-grabbing"
                    onClick={() => !isDragging && goToSlide(productIndex)}
                  >
                    <div className="relative w-[240px] sm:w-[280px] md:w-[320px] lg:w-[380px]">
                      {/* Product Card */}
                      <motion.div
                        className={`relative bg-white rounded-3xl overflow-hidden transition-all duration-300 ${
                          isCenter 
                            ? 'shadow-2xl' 
                            : 'shadow-lg'
                        }`}
                        whileHover={isCenter ? { 
                          y: -8, 
                          scale: 1.03,
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        } : {}}
                        style={{
                          background: isCenter 
                            ? 'linear-gradient(135deg, #ffffff 0%, #f8faff 50%, #ffffff 100%)'
                            : 'white'
                        }}
                      >
                        {/* Unique Decorative Border Frame - Only on center */}
                        {isCenter && (
                          <>
                            {/* Ornate Corner Brackets */}
                            <div className="absolute top-0 left-0 w-16 h-16 z-10">
                              <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                                <path d="M0 8 L0 0 L8 0" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M0 16 L0 8" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                                <path d="M8 0 L0 0 L0 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                              </svg>
                            </div>
                            <div className="absolute top-0 right-0 w-16 h-16 z-10">
                              <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                                <path d="M64 8 L64 0 L56 0" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M64 16 L64 8" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                                <path d="M56 0 L64 0 L64 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                              </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 z-10">
                              <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                                <path d="M0 56 L0 64 L8 64" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M0 48 L0 56" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                                <path d="M8 64 L0 64 L0 56" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                              </svg>
                            </div>
                            <div className="absolute bottom-0 right-0 w-16 h-16 z-10">
                              <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                                <path d="M64 56 L64 64 L56 64" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M64 48 L64 56" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                                <path d="M56 64 L64 64 L64 56" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                              </svg>
                            </div>
                            
                            {/* Organic Side Accents */}
                            <div className="absolute top-1/2 -left-2 w-1 h-20 bg-grace-gold/30 rounded-full transform -translate-y-1/2" />
                            <div className="absolute top-1/2 -right-2 w-1 h-20 bg-grace-blue/30 rounded-full transform -translate-y-1/2" />
                          </>
                        )}
                        
                        {/* Subtle border for non-center cards */}
                        {!isCenter && (
                          <div className="absolute inset-0 rounded-3xl border border-gray-200/50 pointer-events-none" />
                        )}
                        
                        {/* Floating Badge - Top Right */}
                        {isCenter && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                            className="absolute top-4 right-4 z-20 bg-gradient-to-br from-grace-gold to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg flex items-center gap-1"
                          >
                            <Star className="w-3 h-3 fill-current" />
                            <span>Featured</span>
                          </motion.div>
                        )}

                        {/* Product Image Container with Enhanced Styling */}
                        <div className={`relative h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden ${
                          isCenter 
                            ? 'bg-gradient-to-br from-grace-light-blue via-blue-50 via-grace-gold/10 to-grace-light-blue' 
                            : 'bg-gradient-to-br from-gray-50 to-blue-50'
                        }`}>
                          {/* Animated Background Pattern */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-full" style={{
                              backgroundImage: `radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                                                radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)`,
                            }} />
                          </div>

                          {/* Organic Brush Stroke Accents - Only on center */}
                          {isCenter && (
                            <>
                              <div className="absolute top-2 left-2 w-24 h-24 opacity-10">
                                <svg viewBox="0 0 100 100" fill="none">
                                  <path d="M10 20 Q30 10, 50 25 T90 30" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" fill="none" />
                                  <path d="M15 35 Q35 25, 55 40 T95 45" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
                                </svg>
                              </div>
                              <div className="absolute bottom-2 right-2 w-24 h-24 opacity-10 rotate-180">
                                <svg viewBox="0 0 100 100" fill="none">
                                  <path d="M10 20 Q30 10, 50 25 T90 30" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" fill="none" />
                                  <path d="M15 35 Q35 25, 55 40 T95 45" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
                                </svg>
                              </div>
                            </>
                          )}

                          {/* Product Image */}
                          <motion.img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="relative z-10 w-full h-full object-contain object-center p-6"
                            initial={{ scale: 1 }}
                            animate={isCenter ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ 
                              duration: 4,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              if (e.target.parentElement) {
                                e.target.parentElement.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center">
                                    <div class="text-6xl opacity-20 text-grace-blue font-normal">${product.name.charAt(0)}</div>
                                  </div>
                                `
                              }
                            }}
                          />
                          
                          {/* Multi-layer Gradient Overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none z-10" />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 pointer-events-none z-10" />
                          
                          {/* Shine Effect on Center Card */}
                          {isCenter && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10"
                              animate={{
                                x: ['-100%', '200%'],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: 'easeInOut'
                              }}
                            />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className={`relative p-4 sm:p-6 space-y-3 sm:space-y-4 ${isCenter ? 'bg-gradient-to-b from-white to-grace-light-blue/10' : 'bg-white'}`}>
                          {/* Creative Divider - Only on center */}
                          {isCenter && (
                            <div className="absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-px flex items-center justify-center">
                              <div className="flex-1 h-px bg-grace-gold/20" />
                              <div className="w-6 sm:w-8 h-0.5 bg-grace-blue/40 mx-2 rounded-full" />
                              <div className="flex-1 h-px bg-grace-gold/20" />
                            </div>
                          )}

                          {/* Product Name with Enhanced Styling */}
                          <div>
                            <h3
                              className={`font-normal text-grace-dark-blue tracking-tight transition-all duration-300 ${
                                isCenter ? 'text-lg sm:text-xl md:text-2xl font-medium' : 'text-sm sm:text-base md:text-lg'
                              }`}
                            >
                              {product.name}
                            </h3>
                            
                            {/* Star Rating - Only on center */}
                            {isCenter && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="flex items-center gap-1 mt-1 sm:mt-2"
                              >
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="w-3 h-3 sm:w-4 sm:h-4 fill-grace-gold text-grace-gold"
                                  />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">(4.9)</span>
                              </motion.div>
                            )}
                          </div>

                          {/* Description - only show on center */}
                          {isCenter && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2"
                            >
                              {product.description}
                            </motion.p>
                          )}

                          {/* Price with Enhanced Styling */}
                          <div className={`flex items-baseline gap-2 flex-wrap ${isCenter ? 'pt-1 sm:pt-2' : ''}`}>
                            {isCenter && (
                              <span className="text-xs text-gray-400 uppercase tracking-wide hidden sm:inline">Price</span>
                            )}
                            <span
                              className={`font-semibold tracking-tight transition-all duration-300 ${
                                isCenter 
                                  ? 'text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-grace-blue to-grace-dark-blue bg-clip-text text-transparent' 
                                  : 'text-base sm:text-lg md:text-xl text-grace-blue'
                              }`}
                            >
                              {product.price}
                            </span>
                            {isCenter && (
                              <span className="text-xs text-gray-400 ml-auto hidden sm:inline">Best Value</span>
                            )}
                          </div>

                          {/* Shop on Shopee Button - only show on center */}
                          {isCenter && (
                            <motion.a
                              href={product.shopeeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              onClick={(e) => e.stopPropagation()}
                              className="relative flex items-center justify-center space-x-2 bg-gradient-to-r from-grace-blue via-grace-dark-blue to-grace-blue text-white px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase hover:from-grace-dark-blue hover:via-grace-blue hover:to-grace-dark-blue transition-all duration-500 shadow-xl hover:shadow-2xl w-full focus:outline-none focus:ring-2 focus:ring-grace-blue focus:ring-offset-2 overflow-hidden group"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              aria-label={`Shop ${product.name} on Shopee`}
                            >
                              {/* Animated Background Shimmer */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                              
                              {/* Button Content */}
                              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                                <span className="whitespace-nowrap">Shop on Shopee</span>
                                <motion.div
                                  animate={{ x: [0, 3, 0] }}
                                  transition={{ 
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                  }}
                                  className="hidden sm:inline"
                                >
                                  →
                                </motion.div>
                              </span>
                            </motion.a>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Enhanced Dots Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center items-center gap-2 sm:gap-3 mt-8 sm:mt-12"
          >
            {products.map((product, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative transition-all duration-300 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-grace-blue focus:ring-offset-2 ${
                  index === currentIndex
                    ? 'w-10 h-3 bg-grace-blue'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to ${product.name}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {index === currentIndex && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-grace-blue rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                {/* Product name tooltip on hover */}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {product.name}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Current Product Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-6"
          >
            <p className="text-sm text-gray-500">
              {currentIndex + 1} of {products.length}
            </p>
          </motion.div>
        </motion.div>

        {/* View All Products Button */}
        <motion.div
          className="text-center mt-10 sm:mt-12 md:mt-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.a
            href="https://ph.shp.ee/k5ZzgF6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-grace-gold text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-normal tracking-wide uppercase hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-grace-gold focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View all products on Shopee"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            <span className="whitespace-nowrap">View All Products on Shopee</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProducts
