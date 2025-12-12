import { useState, useRef, useEffect, memo, useCallback } from 'react'
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

const ProductCard = memo(({ product, isCenter, onClick }) => (
  <div
    onClick={onClick}
    className={`relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
      isCenter
        ? 'shadow-2xl scale-100 opacity-100 z-10'
        : 'shadow-lg scale-90 opacity-50 blur-[2px]'
    }`}
  >
    {/* Featured Badge */}
    {isCenter && (
      <div className="absolute top-3 right-3 z-20 bg-gradient-to-br from-grace-gold to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg flex items-center gap-1">
        <Star className="w-3 h-3 fill-current" />
        <span>Featured</span>
      </div>
    )}

    {/* Product Image */}
    <div className={`relative h-48 sm:h-56 md:h-64 overflow-hidden ${
      isCenter
        ? 'bg-gradient-to-br from-grace-light-blue via-blue-50 to-grace-light-blue'
        : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`}>
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="w-full h-full object-contain object-center p-4 transition-transform duration-300 hover:scale-105"
        onError={(e) => {
          e.target.style.display = 'none'
          if (e.target.parentElement) {
            e.target.parentElement.innerHTML = `
              <div class="w-full h-full flex items-center justify-center">
                <div class="text-5xl opacity-20 text-grace-blue font-serif">${product.name.charAt(0)}</div>
              </div>
            `
          }
        }}
      />
    </div>

    {/* Product Info */}
    <div className={`p-4 sm:p-5 ${isCenter ? 'bg-gradient-to-b from-white to-grace-light-blue/10' : 'bg-white'}`}>
      <h3 className={`font-serif text-grace-dark-blue tracking-tight transition-all duration-300 ${
        isCenter ? 'text-lg sm:text-xl font-medium' : 'text-base'
      }`}>
        {product.name}
      </h3>

      {/* Star Rating - Only on center */}
      {isCenter && (
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3.5 h-3.5 fill-grace-gold text-grace-gold" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.9)</span>
        </div>
      )}

      {/* Description */}
      {isCenter && (
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mt-2">
          {product.description}
        </p>
      )}

      {/* Price */}
      <div className={`flex items-baseline gap-2 ${isCenter ? 'mt-3' : 'mt-2'}`}>
        <span className={`font-semibold tracking-tight ${
          isCenter
            ? 'text-xl sm:text-2xl bg-gradient-to-r from-grace-blue to-grace-dark-blue bg-clip-text text-transparent'
            : 'text-lg text-grace-blue'
        }`}>
          {product.price}
        </span>
      </div>

      {/* Shop Button - Only on center */}
      {isCenter && (
        <a
          href={product.shopeeLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-grace-blue to-grace-dark-blue text-white px-5 py-3 rounded-full text-sm font-semibold tracking-wide uppercase hover:from-grace-dark-blue hover:to-grace-blue transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] w-full"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Shop on Shopee</span>
        </a>
      )}
    </div>
  </div>
))

ProductCard.displayName = 'ProductCard'

const FeaturedProducts = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  // Intersection Observer for lazy loading animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isVisible])

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < products.length) {
      setCurrentIndex(index)
    }
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }, [])

  // Get visible products
  const getVisibleProducts = () => {
    const visible = []
    for (let i = -1; i <= 1; i++) {
      let idx = currentIndex + i
      if (idx < 0) idx = products.length + idx
      else if (idx >= products.length) idx = idx - products.length
      visible.push({ productIndex: idx, position: i })
    }
    return visible
  }

  return (
    <section
      ref={sectionRef}
      id="catalog"
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-grace-light-blue/30 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-10 sm:mb-12 md:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-grace-dark-blue mb-3 sm:mb-4 tracking-tight">
            Our Featured Products
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Discover our handcrafted delicacies made with care and tradition
          </p>
        </div>

        {/* Carousel Container */}
        <div className={`relative transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-grace-blue" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200"
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-grace-blue" />
          </button>

          {/* Products Display */}
          <div className="relative h-[420px] sm:h-[480px] md:h-[520px] flex items-center justify-center">
            <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
              {getVisibleProducts().map(({ productIndex, position }) => {
                const product = products[productIndex]
                const isCenter = position === 0
                return (
                  <div
                    key={`${product.id}-${position}`}
                    className={`w-[260px] sm:w-[300px] md:w-[340px] transition-all duration-500 ${
                      position === -1 ? '-translate-x-4 hidden sm:block' :
                      position === 1 ? 'translate-x-4 hidden sm:block' : ''
                    }`}
                  >
                    <ProductCard
                      product={product}
                      isCenter={isCenter}
                      onClick={() => goToSlide(productIndex)}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 sm:gap-3 mt-6 sm:mt-8">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2.5 bg-grace-blue'
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              {currentIndex + 1} of {products.length}
            </p>
          </div>
        </div>

        {/* View All Button */}
        <div className={`text-center mt-10 sm:mt-12 transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <a
            href="https://ph.shp.ee/k5ZzgF6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-grace-gold text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium tracking-wide uppercase hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>View All Products on Shopee</span>
          </a>
        </div>
      </div>
    </section>
  )
})

FeaturedProducts.displayName = 'FeaturedProducts'

export default FeaturedProducts
