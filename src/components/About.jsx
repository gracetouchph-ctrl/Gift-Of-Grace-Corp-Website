import { useState, useEffect, useRef, memo } from 'react'
import { Heart, Sparkles, Leaf, Target, Eye } from 'lucide-react'

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

const About = memo(() => {
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
      id="about"
      className="py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`max-w-4xl mx-auto text-center mb-16 lg:mb-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className="inline-block px-4 py-1.5 bg-grace-accent/10 text-grace-accent rounded-full text-sm font-medium mb-6">
            Our Story
          </span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-medium text-gray-900 tracking-tight mb-6">
            About Gift of Grace
            <span className="block text-grace-accent">Food Manufacturing</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Gift of Grace Food Manufacturing Corporation began its journey in 2017, born from a
            mother's passion for creating Korean kimchi infused with a flavor profile tailored to
            the Filipino taste.
          </p>
          <p className="text-gray-500 leading-relaxed">
            What started as a humble home-based business sharing products with neighbors soon grew
            beyond the household, reaching the local community, the online market, and eventually
            well-known retail chains such as SM, Savemore, Puregold, and Robinsons.
          </p>
        </div>

        {/* Values Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {values.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
                className={`group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 text-center ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-grace-accent/10 to-rose-100/50 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-grace-accent" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>

        {/* Mission & Vision */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-16 lg:mb-20 transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-grace-accent to-rose-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-gray-900">Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To produce 10 different varieties of quality and healthy foods by year 2025.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-grace-accent-alt flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-gray-900">Vision</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To provide not just a living but to extend blessing, sharing grace through
              nutritious, flavorful, and proudly Filipino-made local products.
            </p>
          </div>
        </div>

        {/* Company Photos */}
        <div className={`transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={item}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
                className={`group aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <img
                  src={`/images/CompanyPicture${item}.PNG`}
                  alt={`Gift of Grace company photo ${item}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

About.displayName = 'About'

export default About
