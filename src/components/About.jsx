import { motion } from 'framer-motion'
import { Heart, Sparkles, Leaf } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Heart,
      title: 'Made with Care',
      description: 'Every product is crafted with love and attention to detail',
    },
    {
      icon: Leaf,
      title: 'Health-Conscious',
      description: 'Using natural ingredients for your wellness journey',
    },
    {
      icon: Sparkles,
      title: 'Traditional Recipes',
      description: 'Preserving authentic flavors passed down through generations',
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
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-normal text-grace-dark-blue mb-6 tracking-tight">
            About Gift of Grace
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-4">
            Gift of Grace brings you comforting and health-conscious delicacies made with care.
            Each product reflects our passion for taste, wellness, and tradition.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe that food is not just nourishment—it's a gift that brings people together,
            comforts the soul, and celebrates the simple joys of life.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
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
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-grace-blue/10 rounded-full mb-4"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  aria-hidden="true"
                >
                  <Icon className="w-8 h-8 text-grace-blue" />
                </motion.div>
                <h3 className="text-xl font-normal text-grace-dark-blue mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Photo Grid Placeholder */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              className="aspect-square bg-gradient-to-br from-grace-blue/20 to-grace-gold/20 rounded-2xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-4xl opacity-30 text-grace-blue">
                  {item === 1 ? '🌿' : item === 2 ? '🥬' : item === 3 ? '☕' : '🥕'}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About

