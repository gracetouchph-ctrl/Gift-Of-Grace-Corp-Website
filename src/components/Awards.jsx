import { useState, useEffect, useRef, memo } from 'react'
import { ExternalLink, Award, PlayCircle, Image as ImageIcon, X } from 'lucide-react'
import { awards } from '../data/awards'

const iconFor = (type) => {
  if (type === 'Video') return PlayCircle
  if (type === 'Gallery') return ImageIcon
  return Award
}

const Awards = memo(() => {
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

  const [openItem, setOpenItem] = useState(null)

  return (
    <section
      ref={sectionRef}
      id="awards"
      className="py-20 lg:py-28 bg-gradient-to-b from-slate-50/50 via-white to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className="inline-block px-4 py-1.5 bg-grace-accent/10 text-grace-accent rounded-full text-sm font-medium mb-6">
            Recognition
          </span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-medium text-gray-900 tracking-tight mb-4">
            Awards & Milestones
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Recognitions, features, and community impact stories from Gift of Grace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {awards.map((item, idx) => {
          const Icon = iconFor(item.type)
          const hasLinks = !!item.links
            return (
              <div
                key={`${item.title}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-500 scale-105"
                    style={{
                      backgroundImage: item.preview
                        ? `linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url(${item.preview})`
                        : 'linear-gradient(180deg, rgba(24,78,167,0.35), rgba(240,86,68,0.65))',
                      opacity: 0.8,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2 text-white">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm text-white">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/80">{item.type}</p>
                      <p className="text-sm font-semibold">{item.year}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2 drop-shadow">{item.title}</h3>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 flex-1">{item.highlight}</p>

                  {hasLinks ? (
                    <div className="mt-4">
                      <button
                        onClick={() => setOpenItem(item)}
                        className="inline-flex items-center gap-2 text-sm text-grace-accent hover:text-grace-accent-alt font-semibold"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View links
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-grace-accent hover:text-grace-accent-alt font-semibold"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Overlay for link list */}
        {openItem && openItem.links && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/50 backdrop-blur-sm">
            <div
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="relative h-32 sm:h-40 bg-center bg-cover" style={{
                backgroundImage: openItem.preview
                  ? `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${openItem.preview})`
                  : 'linear-gradient(180deg, rgba(24,78,167,0.35), rgba(240,86,68,0.65))'
              }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => setOpenItem(null)}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-xs uppercase tracking-wide text-white/80">{openItem.type}</p>
                  <h3 className="text-xl font-semibold leading-tight">{openItem.title}</h3>
                  <p className="text-sm text-white/80 mt-1">{openItem.year}</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-gray-600">{openItem.highlight}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {openItem.links.map((link, linkIdx) => (
                    <a
                      key={`${link.url}-${linkIdx}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between gap-2 text-xs sm:text-sm text-grace-dark-blue bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-grace-accent/60 hover:shadow-md transition"
                    >
                      <span className="truncate">{link.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-grace-accent" />
                    </a>
                  ))}
                </div>
                <div className="text-right">
                  <button
                    onClick={() => setOpenItem(null)}
                    className="text-sm font-semibold text-grace-accent hover:text-grace-accent-alt"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
})

Awards.displayName = 'Awards'

export default Awards

