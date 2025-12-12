import { useState, useEffect, useRef, memo } from 'react'
import { Store } from 'lucide-react'

const partners = ['SM', 'Savemore', 'Puregold', 'Robinsons']

const WhereToFindUs = memo(() => {
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

  return (
    <section
      ref={sectionRef}
      id="where-to-find-us"
      className="py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50/30 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`max-w-3xl mx-auto text-center mb-12 lg:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className="inline-block px-4 py-1.5 bg-grace-accent/10 text-grace-accent rounded-full text-sm font-medium mb-6">
            <Store className="w-4 h-4 inline mr-2" />
            Where to Find Us
          </span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-medium text-gray-900 tracking-tight mb-4">
            Available in Leading Retail Chains
          </h2>
          <p className="text-gray-500 text-lg">
            From a humble home-based kitchen to shelves across Northern Luzon, Gift of Grace
            products are now available in major supermarkets and retail partners.
          </p>
        </div>

        {/* Partners Grid */}
        <div className={`max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {partners.map((name, index) => (
            <div
              key={name}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
              className={`group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-grace-accent/5 via-transparent to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative px-6 py-8 flex items-center justify-center">
                <span className="text-lg lg:text-xl font-semibold tracking-wide text-gray-800 group-hover:text-grace-accent transition-colors">
                  {name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

WhereToFindUs.displayName = 'WhereToFindUs'

export default WhereToFindUs
