import Image from 'next/image'
import { FiStar } from 'react-icons/fi'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Interior Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'The quality and craftsmanship of these carpets is exceptional. My clients are always impressed with the elegance and durability.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'I purchased a Persian carpet for my living room and it has transformed the entire space. Absolutely stunning!',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Luxury Hotel Owner',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'We\'ve furnished multiple properties with Carpet Palace rugs. Their collection is unmatched in quality and style.',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-royal-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">
            Trusted by thousands of satisfied customers worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card p-8 bg-white"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="w-5 h-5 text-gold-500 fill-gold-500"
                  />
                ))}
              </div>
              <p className="text-royal-700 mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-royal-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-royal-600">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
