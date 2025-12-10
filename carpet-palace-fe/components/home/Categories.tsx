'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const categories = [
  {
    id: 1,
    name: 'Persian Carpets',
    description: 'Classic elegance from the Middle East',
    image: 'https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    href: '/categories/persian',
  },
  {
    id: 2,
    name: 'Modern Rugs',
    description: 'Contemporary designs for modern homes',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/categories/modern',
  },
  {
    id: 3,
    name: 'Oriental Rugs',
    description: 'Traditional patterns and rich colors',
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/categories/oriental',
  },
  {
    id: 4,
    name: 'Wool Carpets',
    description: 'Natural luxury and durability',
    image: 'https://plus.unsplash.com/premium_photo-1675802522435-5a878f1bedbd?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    href: '/categories/wool',
  },
  {
    id: 1,
    name: 'Persian Carpets',
    description: 'Classic elegance from the Middle East',
    image: 'https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    href: '/categories/persian',
  },
  {
    id: 2,
    name: 'Modern Rugs',
    description: 'Contemporary designs for modern homes',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/categories/modern',
  },
  {
    id: 3,
    name: 'Oriental Rugs',
    description: 'Traditional patterns and rich colors',
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/categories/oriental',
  },
  {
    id: 4,
    name: 'Wool Carpets',
    description: 'Natural luxury and durability',
    image: 'https://plus.unsplash.com/premium_photo-1675802522435-5a878f1bedbd?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    href: '/categories/wool',
  },
]

export default function Categories() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)

  // Calculate items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(4) // lg: 4 items
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2) // md: 2 items
      } else {
        setItemsPerView(1) // sm: 1 item
      }
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const maxIndex = Math.max(0, categories.length - itemsPerView)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [maxIndex])

  return (
    <section className="py-24 md:py-16 bg-white w-full">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Our Collections</h2>
          <p className="section-subtitle">
            Discover our curated selection of premium carpets and rugs
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <Link href={category.href} className="card group block">
                    <div className="relative h-64 overflow-hidden rounded-lg">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-royal-900/80 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-serif text-2xl font-bold text-white mb-2">
                          {category.name}
                        </h3>
                        <p className="text-royal-200 text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-royal-50 transition-colors duration-300 z-10 hidden lg:flex items-center justify-center"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-6 h-6 text-royal-900" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-royal-50 transition-colors duration-300 z-10 hidden lg:flex items-center justify-center"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-6 h-6 text-royal-900" />
          </button>

          {/* Mobile Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-6 lg:hidden">
            <button
              onClick={goToPrevious}
              className="bg-white shadow-md rounded-full p-2 hover:bg-royal-50 transition-colors duration-300"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="w-5 h-5 text-royal-900" />
            </button>
            <button
              onClick={goToNext}
              className="bg-white shadow-md rounded-full p-2 hover:bg-royal-50 transition-colors duration-300"
              aria-label="Next slide"
            >
              <FiChevronRight className="w-5 h-5 text-royal-900" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-royal-900'
                    : 'w-2 h-2 bg-royal-300 hover:bg-royal-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
