import { useState, useEffect, useRef, memo } from 'react'
import { Star, Quote, Users, Heart } from 'lucide-react'

const CustomerReviews = memo(() => {
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
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    { label: 'Happy Customers', value: '500+', icon: Users },
    { label: '5-Star Ratings', value: '98%', icon: Star },
    { label: 'Customer Satisfaction', value: '99%', icon: Heart },
  ]

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-grace-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-grace-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className="inline-block px-4 py-1.5 bg-grace-accent/10 text-grace-accent rounded-full text-sm font-medium mb-6">
            Testimonials
          </span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-medium text-gray-900 tracking-tight mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Real feedback from people who love our products
          </p>
        </div>

        {/* Main Review Display */}
        <div className={`max-w-5xl mx-auto transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative">
            {/* Decorative Quote Icon */}
            <div className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 z-10 hidden md:block">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-grace-accent/20 to-rose-100 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-grace-accent/20">
                <Quote className="w-8 h-8 lg:w-10 lg:h-10 text-grace-accent" />
              </div>
            </div>

            {/* Main Review Image Container */}
            <div className="relative bg-white rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-500">
              {/* Gold Accent Border */}
              <div className="absolute inset-0 border-2 lg:border-4 border-grace-accent/10 rounded-2xl lg:rounded-3xl pointer-events-none" />
              
              {/* Image Container */}
              <div className="relative">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-12 h-12 lg:w-24 lg:h-24 border-t-2 lg:border-t-4 border-l-2 lg:border-l-4 border-grace-accent/20 rounded-tl-2xl lg:rounded-tl-3xl z-10" />
                <div className="absolute top-0 right-0 w-12 h-12 lg:w-24 lg:h-24 border-t-2 lg:border-t-4 border-r-2 lg:border-r-4 border-grace-accent/20 rounded-tr-2xl lg:rounded-tr-3xl z-10" />
                <div className="absolute bottom-0 left-0 w-12 h-12 lg:w-24 lg:h-24 border-b-2 lg:border-b-4 border-l-2 lg:border-l-4 border-grace-accent/20 rounded-bl-2xl lg:rounded-bl-3xl z-10" />
                <div className="absolute bottom-0 right-0 w-12 h-12 lg:w-24 lg:h-24 border-b-2 lg:border-b-4 border-r-2 lg:border-r-4 border-grace-accent/20 rounded-br-2xl lg:rounded-br-3xl z-10" />
                
                {/* Customer Review Image */}
                <img
                  src="/images/Customer Review.png"
                  alt="Customer Reviews - Gift of Grace"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Bottom Decorative Quote Icon */}
            <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 z-10 hidden md:block">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-sky-100 to-grace-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-sky-200/30 rotate-180">
                <Quote className="w-8 h-8 lg:w-10 lg:h-10 text-sky-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={`mt-16 lg:mt-20 grid grid-cols-3 gap-6 lg:gap-8 max-w-3xl mx-auto transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
                className={`text-center transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-grace-accent/10 to-rose-100/50 rounded-2xl mb-4 hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-grace-accent" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-12 lg:mt-16 transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-gray-600 text-lg mb-6">
            Join hundreds of satisfied customers
          </p>
          <a
            href="https://ph.shp.ee/k5ZzgF6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold text-base shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:scale-105 active:scale-100 transition-all duration-300"
          >
            <Star className="w-5 h-5" />
            <span>Experience the Quality</span>
          </a>
        </div>
      </div>
    </section>
  )
})

CustomerReviews.displayName = 'CustomerReviews'

export default CustomerReviews
