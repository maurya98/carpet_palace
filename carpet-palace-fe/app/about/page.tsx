import Image from 'next/image'
import { FiAward, FiUsers, FiGlobe, FiHeart } from 'react-icons/fi'

export default function AboutPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="section-title">About Carpet Palace</h1>
          <p className="section-subtitle max-w-3xl mx-auto">
            A legacy of excellence in luxury carpets and rugs since 1985
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-royal-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-royal-700 leading-relaxed">
              <p>
                Carpet Palace was founded in 1985 with a vision to bring the world's finest 
                handcrafted carpets and rugs to discerning customers. What started as a small 
                family business has grown into a trusted name in luxury home furnishings.
              </p>
              <p>
                Our commitment to quality and authenticity has never wavered. We work directly 
                with master artisans from around the world, ensuring that every piece in our 
                collection meets our exacting standards of craftsmanship and design.
              </p>
              <p>
                Today, Carpet Palace stands as a symbol of timeless elegance, offering an 
                unparalleled selection of Persian, Oriental, and contemporary rugs that 
                transform spaces into luxurious sanctuaries.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1739185127141-bb4aa70ad22a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Carpet Palace"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-royal-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-royal-900 mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiAward, title: 'Excellence', desc: 'Uncompromising quality in every piece' },
              { icon: FiUsers, title: 'Heritage', desc: 'Preserving traditional craftsmanship' },
              { icon: FiGlobe, title: 'Global', desc: 'Sourcing from the world\'s finest artisans' },
              { icon: FiHeart, title: 'Passion', desc: 'Dedicated to bringing beauty to your home' },
            ].map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-royal-800 to-gold-600 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-royal-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-royal-600">
                    {value.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mission Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-royal-900 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-royal-700 leading-relaxed">
            To curate and deliver the world's most exquisite carpets and rugs, 
            connecting our customers with timeless artistry and luxury. We believe 
            that every home deserves a touch of elegance, and we're committed to 
            making that vision a reality through our carefully selected collections 
            and exceptional service.
          </p>
        </div>
      </div>
    </div>
  )
}
