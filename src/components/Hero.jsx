import { memo } from 'react'
import { ArrowRight, ChevronDown, Sparkles, Star, ShoppingBag } from 'lucide-react'

const Hero = memo(() => {
  const scrollToProducts = () => {
    const element = document.getElementById('catalog')
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-grace-light-blue/30"
    >
      {/* Modern geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-grace-accent/20 to-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-grace-accent-alt/20 to-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-grace-gold/15 to-amber-100/20 rounded-full blur-3xl" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">

          {/* Left Column - Content */}
          <div className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md shadow-gray-200/50 border border-gray-100 mb-6 lg:mb-8 mx-auto lg:mx-0 w-fit animate-fade-in">
              <Sparkles className="w-4 h-4 text-grace-gold" />
              <span className="text-sm font-medium text-gray-700">Proudly Filipino-Made</span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-grace-gold text-grace-gold" />
                ))}
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2 lg:space-y-3 mb-6 lg:mb-8 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-medium text-gray-900 leading-[1.1] tracking-tight">
                A Touch of
                <span className="block text-grace-accent italic">Grace</span>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-500 font-light tracking-tight">
                Infused with Comfort
              </p>
            </div>

            {/* Description */}
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 lg:mb-10 animate-fade-in-delay">
              Discover our handcrafted delicacies—from authentic kimchi to artisan rice coffee—each
              crafted with tradition, wellness, and Filipino heart.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-in-delay-2">
              <a
                href="https://ph.shp.ee/k5ZzgF6"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold text-base shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30 hover:scale-105 active:scale-100 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={scrollToProducts}
                className="flex items-center gap-2 text-gray-600 hover:text-grace-accent px-6 py-4 rounded-full font-medium transition-colors"
              >
                <span>Explore Products</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 lg:gap-8 justify-center lg:justify-start mt-10 lg:mt-12 pt-8 border-t border-gray-100 animate-fade-in-delay-2">
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">150+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Outlets</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">Since</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">2017</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">5+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Products</div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative order-1 lg:order-2 animate-fade-in-delay">
            <div className="relative max-w-md lg:max-w-lg mx-auto">
              {/* Background card */}
              <div className="absolute inset-4 lg:inset-6 bg-gradient-to-br from-grace-accent/10 to-grace-accent-alt/10 rounded-3xl transform rotate-3" />
              <div className="absolute inset-4 lg:inset-6 bg-gradient-to-br from-grace-gold/10 to-amber-50 rounded-3xl transform -rotate-3" />

              {/* Main image container */}
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-3 lg:p-4 border border-gray-100">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-grace-light-blue/50 via-white to-rose-50/50">
                  <img
                    src="/images/girl.png"
                    alt="Gift of Grace Products"
                    className="w-full h-auto object-contain"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-white rounded-2xl shadow-xl p-4 lg:p-5 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-grace-accent to-rose-500 flex items-center justify-center">
                      <img
                        src="/images/giftofgracelogo_transparent.png"
                        alt="Gift of Grace"
                        className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm lg:text-base">Gift of Grace</div>
                      <div className="text-xs text-gray-500">Premium Quality</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-grace-gold/20 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-grace-accent/15 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
        <button
          onClick={scrollToProducts}
          className="flex flex-col items-center gap-2 text-gray-400 hover:text-grace-accent transition-colors"
          aria-label="Scroll to products"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  )
})

Hero.displayName = 'Hero'

export default Hero
