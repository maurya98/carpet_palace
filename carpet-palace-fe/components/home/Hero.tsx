import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1594040226829-7f251ab46d80?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury carpets and rugs"
          fill
          priority
          className="object-cover blur-sm scale-110"
          quality={90}
        />
        {/* Additional blur overlay for depth */}
        <div className="absolute inset-0 bg-royal-900/40"></div>
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <h1 className="font-elegant text-6xl md:text-8xl lg:text-9xl font-light text-white mb-6 animate-fade-in tracking-wide leading-tight drop-shadow-2xl">
          {/* <span className="block mb-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">Carpet</span> */}
          <span className="block font-medium italic tracking-wider drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">Carpet Palace</span>
        </h1>
        <p className="font-elegant text-2xl md:text-3xl lg:text-4xl text-royal-100 mb-10 max-w-3xl mx-auto font-light tracking-wide italic drop-shadow-lg">
          Handcrafted Excellence, Timeless Elegance
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-secondary text-lg px-10 py-4 font-elegant text-xl tracking-wider uppercase font-medium shadow-2xl hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105">
            Shop Collection
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-royal-50 to-transparent z-10"></div>
    </section>
  )
}
