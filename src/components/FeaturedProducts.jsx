import { useState, useRef, useEffect, memo, useCallback } from 'react'
import { ShoppingBag, ChevronLeft, ChevronRight, ExternalLink, Star, ArrowRight } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Kimchi Gift Set',
    price: '₱220',
    image: '/images/KimchiGift.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Authentic Korean kimchi with a perfect blend of spices',
    category: 'Best Seller',
  },
  {
    id: 2,
    name: 'Rice Coffee',
    price: '₱180',
    image: '/images/RiceCoffee.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Traditional rice coffee with a smooth, comforting flavor',
    category: 'Beverages',
  },
  {
    id: 3,
    name: 'Pickled Radish',
    price: '₱200',
    image: '/images/PickledRadish.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Crisp and refreshing pickled radish, perfectly seasoned',
    category: 'Sides',
  },
  {
    id: 4,
    name: "Rene's Bangus",
    price: '₱280',
    image: '/images/RenesBangus.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Premium marinated bangus, a Filipino delicacy',
    category: 'Main Dish',
  },
  {
    id: 5,
    name: "Rene's Gourmet Chicken",
    price: '₱320',
    image: '/images/RenesGourmetChicken.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Gourmet chicken prepared with traditional Filipino flavors',
    category: 'Main Dish',
  },
]

const ProductCard = memo(({ product, index }) => (
  <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
    {/* Category Badge */}
    <div className="absolute top-4 left-4 z-10">
      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm">
        {product.category}
      </span>
    </div>

    {/* Product Image */}
    <div className="relative h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100">
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="w-full h-full object-contain object-center p-6 transition-transform duration-500 group-hover:scale-110"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Quick shop button */}
      <a
        href={product.shopeeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-gray-50"
      >
        <ShoppingBag className="w-4 h-4" />
        Quick Shop
      </a>
    </div>

    {/* Product Info */}
    <div className="p-5">
      {/* Rating */}
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
        <span className="text-xs text-gray-400 ml-1">(4.9)</span>
      </div>

      {/* Name */}
      <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-grace-accent transition-colors">
        {product.name}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
        {product.description}
      </p>

      {/* Price and CTA */}
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">
          {product.price}
        </span>
        <a
          href={product.shopeeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-grace-accent hover:text-grace-dark-blue transition-colors"
        >
          <span>View</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
))

ProductCard.displayName = 'ProductCard'

const FeaturedProducts = memo(() => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

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

  return (
    <section
      ref={sectionRef}
      id="catalog"
      className="py-20 lg:py-28 bg-gradient-to-b from-grace-light-blue/30 via-white to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div>
            <span className="inline-block px-4 py-1.5 bg-grace-accent/10 text-grace-accent rounded-full text-sm font-medium mb-4">
              Our Products
            </span>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-medium text-gray-900 tracking-tight">
              Crafted with Care,
              <span className="block text-grace-accent">Made with Love</span>
            </h2>
          </div>
          <p className="text-gray-500 text-lg max-w-md lg:text-right">
            Each product is carefully crafted using traditional recipes passed down through generations.
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {products.map((product, index) => (
            <div
              key={product.id}
              style={{ transitionDelay: `${index * 100}ms` }}
              className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className={`text-center mt-14 lg:mt-16 transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <a
            href="https://ph.shp.ee/k5ZzgF6"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold text-base shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:scale-105 active:scale-100 transition-all duration-300"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>View All Products on Shopee</span>
            <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </section>
  )
})

FeaturedProducts.displayName = 'FeaturedProducts'

export default FeaturedProducts
