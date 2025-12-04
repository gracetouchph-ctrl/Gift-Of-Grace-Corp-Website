import { motion } from 'framer-motion'
import { Heart, Sparkles, Leaf, Target, Eye } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Rooted in Care',
      description:
        'Born from a mother’s passion for Korean kimchi lovingly adapted to the Filipino palate, every recipe is crafted as if made for family.',
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

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-grace-light-blue via-white to-blue-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-normal text-grace-dark-blue mb-4 tracking-tight">
            About Gift of Grace Food Manufacturing Corporation
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-3">
            Gift of Grace Food Manufacturing Corporation began its journey in 2017, born from a
            mother’s passion for creating Korean kimchi infused with a flavor profile tailored to
            the Filipino taste.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-3">
            What started as a humble home-based business—sharing products with neighbors—soon grew
            beyond the household, reaching the local community, the online market, and eventually
            well-known retail chains such as SM, Savemore, Puregold, and Robinsons.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-3">
            From its flagship kimchi, the product line has expanded to include tofu, rice coffee,
            pickled radish, and chicken pastil—each crafted with care to ensure both great taste and
            nutritional value. The company is deeply committed to offering healthy, high-quality
            food products that support the well-being of its customers.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            With over 150 outlets now operating across Northern Luzon, Gift of Grace has grown from
            a sole proprietorship into a thriving corporation. Today, it continues to expand into
            new markets, actively engage in government and community initiatives, and set a clear
            path toward lasting success—while staying true to its mission and vision of delivering
            nutritious, flavorful, and proudly Filipino-made local products.
          </p>
        </motion.div>

        {/* Values / Highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {values.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-grace-blue/10 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-grace-blue" />
                </div>
                <h3 className="text-xl font-normal text-grace-dark-blue mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-grace-accent">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-grace-accent/10">
                <Target className="w-5 h-5 text-grace-accent" />
              </div>
              <h3 className="text-2xl font-normal text-grace-dark-blue tracking-tight">Mission</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To produce 10 different varieties of quality and healthy foods by year 2025.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-grace-accent-alt">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-grace-accent-alt/10">
                <Eye className="w-5 h-5 text-grace-accent-alt" />
              </div>
              <h3 className="text-2xl font-normal text-grace-dark-blue tracking-tight">Vision</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To provide not just a living but to extend blessing&mdash;sharing grace through
              nutritious, flavorful, and proudly Filipino-made local products.
            </p>
          </div>
        </motion.div>

        {/* Company Photos */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <motion.div
              key={item}
              className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-grace-blue/10 to-grace-gold/10 border border-white/60 shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={`/images/CompanyPicture${item}.PNG`}
                alt={`Gift of Grace company photo ${item}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About

