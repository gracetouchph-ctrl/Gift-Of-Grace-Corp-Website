import { memo } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'

const Hero = memo(() => {
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
        <div className="absolute top-20 right-10 w-72 h-72 bg-grace-accent-alt/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-grace-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)] py-8 sm:py-12 lg:py-20">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left animate-fade-in">
            {/* Tagline */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-grace-accent font-serif font-normal italic leading-tight tracking-tight">
                A Touch of Grace,
              </h1>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-grace-dark-blue font-serif font-medium italic leading-tight tracking-tight">
                Infused with Comfort
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal tracking-normal px-2 sm:px-0 animate-fade-in-delay">
              Discover our handcrafted delicacies made with care and tradition. Each product reflects
              our passion for taste, wellness, and comfort—rooted in Filipino flavors and infused
              with grace.
            </p>

            {/* CTA Button */}
            <div className="pt-2 sm:pt-4 animate-fade-in-delay-2">
              <a
                href="https://ph.shp.ee/k5ZzgF6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-grace-accent to-grace-accent-alt text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-medium tracking-wide uppercase hover:from-grace-accent-alt hover:to-grace-accent transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-grace-accent focus:ring-offset-2"
                aria-label="Shop now on Shopee"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative flex items-center justify-center lg:justify-end mt-6 lg:mt-0 animate-fade-in-delay">
            <div className="relative w-full max-w-xl px-2 sm:px-0">
              {/* Main image container */}
              <div className="relative bg-gradient-to-br from-white via-grace-light-blue/30 to-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-grace-accent-alt/30 hover:scale-[1.02] transition-transform duration-300">
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-t-3 border-l-3 border-grace-accent/50 rounded-tl-2xl sm:rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-t-3 border-r-3 border-grace-accent/50 rounded-tr-2xl sm:rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-b-3 border-l-3 border-grace-accent/50 rounded-bl-2xl sm:rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-b-3 border-r-3 border-grace-accent/50 rounded-br-2xl sm:rounded-br-3xl" />

                {/* Image */}
                <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-grace-light-blue via-white to-grace-accent-alt/15">
                  <img
                    src="/images/girl.png"
                    alt="Gift of Grace Products"
                    className="relative w-full h-auto rounded-lg sm:rounded-xl object-contain z-10 hover:scale-105 transition-transform duration-500"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={scrollToProducts}
          className="flex flex-col items-center text-grace-blue hover:text-grace-dark-blue transition-colors focus:outline-none focus:ring-2 focus:ring-grace-blue focus:ring-offset-2 rounded-lg p-2 animate-bounce-slow"
          aria-label="Scroll to products section"
        >
          <span className="text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Explore Products</span>
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
})

Hero.displayName = 'Hero'

export default Hero
