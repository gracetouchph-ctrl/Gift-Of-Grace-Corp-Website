import { useState, useRef, useEffect, memo, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import { ShoppingBag, ChevronLeft, ChevronRight, ExternalLink, Star, ArrowRight, Sparkles } from 'lucide-react'

// Fallback products (used when API is unavailable)
const fallbackProducts = [
  {
    id: 1,
    name: 'Kimchi Gift Set',
    price: 'P220',
    image: '/images/KimchiGift.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Authentic Korean kimchi with a perfect blend of spices',
    category: 'Best Seller',
    color: '#F05644',
  },
  {
    id: 2,
    name: 'Rice Coffee',
    price: 'P180',
    image: '/images/RiceCoffee.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Traditional rice coffee with a smooth, comforting flavor',
    category: 'Beverages',
    color: '#8B4513',
  },
  {
    id: 3,
    name: 'Pickled Radish',
    price: 'P200',
    image: '/images/PickledRadish.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Crisp and refreshing pickled radish, perfectly seasoned',
    category: 'Sides',
    color: '#E8C547',
  },
  {
    id: 4,
    name: "Rene's Bangus",
    price: 'P280',
    image: '/images/RenesBangus.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Premium marinated bangus, a Filipino delicacy',
    category: 'Main Dish',
    color: '#4A90A4',
  },
  {
    id: 5,
    name: "Rene's Gourmet Chicken",
    price: 'P320',
    image: '/images/RenesGourmetChicken.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Gourmet chicken prepared with traditional Filipino flavors',
    category: 'Main Dish',
    color: '#D4A574',
  },
]

// Default colors for products fetched from API
const defaultColors = ['#F05644', '#8B4513', '#E8C547', '#4A90A4', '#D4A574', '#9B59B6', '#27AE60']

// Animation variants for staggered reveals
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

// Product card with hover micro-interactions
const ProductCard = memo(({ product, index }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer"
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${product.color}15 0%, transparent 70%)`,
        }}
      />

      {/* Category Badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 + index * 0.1 }}
        className="absolute top-4 left-4 z-10"
      >
        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm border border-gray-100">
          {product.category}
        </span>
      </motion.div>

      {/* Product Image */}
      <div className="relative h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50">
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain object-center p-6"
          whileHover={{ scale: 1.1, rotate: 2 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        />

        {/* Quick shop button - slides up on hover */}
        <motion.a
          href={product.shopeeLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-gray-50"
          onClick={(e) => e.stopPropagation()}
        >
          <ShoppingBag className="w-4 h-4" />
          Quick Shop
        </motion.a>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Rating with stagger animation */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </motion.div>
          ))}
          <span className="text-xs text-gray-400 ml-1">(4.9)</span>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-grace-accent transition-colors duration-300">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <motion.span
            className="text-xl font-bold text-gray-900"
            whileHover={{ scale: 1.05 }}
          >
            {product.price}
          </motion.span>
          <motion.a
            href={product.shopeeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-grace-accent"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span>View</span>
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
})

ProductCard.displayName = 'ProductCard'

// Hero Showcase with shared-element style transitions
const HeroShowcase = memo(({ activeIndex, setActiveIndex, products }) => {
  const activeProduct = products[activeIndex]

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-grace-light-blue/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-12 border border-gray-100 shadow-xl overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl"
        animate={{
          background: `radial-gradient(circle, ${activeProduct.color}10 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 bg-grace-gold/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">
        {/* Image Side with AnimatePresence for smooth transitions */}
        <div className="relative order-2 lg:order-1">
          <div className="relative h-56 sm:h-80 lg:h-[450px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                  duration: 0.6,
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="max-h-full max-w-full object-contain"
                  style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))' }}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Floating particles/garnish effect */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: activeProduct.color,
                  opacity: 0.3,
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 25}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          {/* Navigation arrows with spring animation */}
          <motion.button
            onClick={() => setActiveIndex((prev) => (prev - 1 + products.length) % products.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 lg:-translate-x-6 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
          <motion.button
            onClick={() => setActiveIndex((prev) => (prev + 1) % products.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 lg:translate-x-6 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600"
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        </div>

        {/* Content Side with text animations */}
        <div className="order-1 lg:order-2 text-center lg:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Category badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6"
                style={{ backgroundColor: `${activeProduct.color}15`, color: activeProduct.color }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.span
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                  style={{ backgroundColor: activeProduct.color }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                {activeProduct.category}
              </motion.div>

              {/* Product name with character stagger (simplified) */}
              <motion.h3
                className="text-2xl sm:text-3xl lg:text-5xl font-serif font-medium text-gray-900 mb-3 sm:mb-4 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {activeProduct.name}
              </motion.h3>

              {/* Description */}
              <motion.p
                className="text-gray-500 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-md mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {activeProduct.description}
              </motion.p>

              {/* Rating */}
              <motion.div
                className="flex items-center gap-1 justify-center lg:justify-start mb-6 sm:mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                  >
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
                <span className="text-gray-400 ml-2 text-xs sm:text-sm">(4.9 rating)</span>
              </motion.div>

              {/* Price and CTA */}
              <motion.div
                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start mb-8 sm:mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  {activeProduct.price}
                </span>
                <motion.a
                  href={activeProduct.shopeeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-sm sm:text-base shadow-xl"
                  style={{ backgroundColor: activeProduct.color }}
                  whileHover={{ scale: 1.05, boxShadow: `0 20px 40px ${activeProduct.color}40` }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicators */}
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            {products.map((product, index) => (
              <motion.button
                key={product.id}
                onClick={() => setActiveIndex(index)}
                className="relative h-1.5 rounded-full overflow-hidden bg-gray-200"
                style={{ width: index === activeIndex ? 40 : 12 }}
                animate={{ width: index === activeIndex ? 40 : 12 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                aria-label={`View ${product.name}`}
              >
                {index === activeIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: activeProduct.color }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 4, ease: 'linear' }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

HeroShowcase.displayName = 'HeroShowcase'

const FeaturedProducts = memo(() => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [products, setProducts] = useState(fallbackProducts)
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const API_BASE = import.meta.env.VITE_ADMIN_API_URL || 'https://gracetouchph-ctrl-giftofgrace-rag-api.hf.space'

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/site-info`)
        if (response.ok) {
          const data = await response.json()
          if (data.products && data.products.length > 0) {
            // Map API data to component format
            const mappedProducts = data.products.map((product, index) => ({
              id: product.id || index + 1,
              name: product.name || 'Product',
              price: product.price || '',
              image: product.image || '/images/placeholder.png',
              shopeeLink: product.shopeeLink || 'https://ph.shp.ee/k5ZzgF6',
              description: product.description || '',
              category: product.category || 'Product',
              color: product.color || defaultColors[index % defaultColors.length],
            }))
            setProducts(mappedProducts)
          }
        }
      } catch (error) {
        console.log('Using fallback products - API unavailable')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [API_BASE])

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [products.length])

  // Parallax scroll effect for header
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const headerY = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section
      ref={sectionRef}
      id="catalog"
      className="py-24 lg:py-32 bg-gradient-to-b from-white via-slate-50/30 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with parallax */}
        <motion.div
          style={{ y: headerY }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-grace-accent/10 text-grace-accent rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              Our Products
            </motion.span>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-serif font-medium text-gray-900 tracking-tight">
              Crafted with Care,
              <motion.span
                className="block text-grace-accent"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                Made with Love
              </motion.span>
            </h2>
          </motion.div>
          <motion.p
            className="text-gray-500 text-lg max-w-md lg:text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Each product is carefully crafted using traditional recipes passed down through generations.
          </motion.p>
        </motion.div>

        {/* Hero Product Showcase */}
        <motion.div
          className="mb-20 lg:mb-24"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <HeroShowcase
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            products={products}
          />
        </motion.div>

        {/* Products Grid with staggered animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          className="text-center mt-12 sm:mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="https://ph.shp.ee/k5ZzgF6"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 sm:gap-3 bg-gray-900 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-full font-semibold text-sm sm:text-base lg:text-lg shadow-xl"
            whileHover={{
              scale: 1.03,
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">View All Products on Shopee</span>
            <span className="sm:hidden">Shop on Shopee</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
})

FeaturedProducts.displayName = 'FeaturedProducts'

export default FeaturedProducts
