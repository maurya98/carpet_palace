import { FiAward, FiTruck, FiShield, FiHeart } from 'react-icons/fi'

const features = [
  {
    icon: FiAward,
    title: 'Premium Quality',
    description: 'Handcrafted by master artisans with decades of experience',
  },
  {
    icon: FiTruck,
    title: 'Free Shipping',
    description: 'Complimentary shipping on orders over $500',
  },
  {
    icon: FiShield,
    title: 'Lifetime Warranty',
    description: 'Quality guarantee with our comprehensive warranty program',
  },
  {
    icon: FiHeart,
    title: 'Expert Care',
    description: 'Dedicated customer service and care guidance',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Why Choose Carpet Palace</h2>
          <p className="section-subtitle">
            Excellence in every thread, luxury in every design
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-royal-50 hover:bg-royal-100 transition-colors duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-royal-800 to-gold-600 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-royal-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-royal-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
