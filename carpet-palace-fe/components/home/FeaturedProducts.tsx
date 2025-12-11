'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiShoppingCart, FiHeart, FiMaximize2, FiMapPin, FiTag, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getFeaturedProducts } from '@/app/api/products/products'
import type { Product } from '@/app/api/mockData/products'

export default function FeaturedProducts() {
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch featured products from API
  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true)
      try {
        const products = await getFeaturedProducts(8)
        setFeaturedProducts(products)
      } catch (error) {
        console.error('Error fetching featured products:', error)
        setFeaturedProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  // Show 5 items at a time: 1 focused in center, 4 blurred around it
  // On mobile, show 1 item (focused)
  const getVisibleItems = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 5 // lg: 5 items (1 focused, 4 blurred)
      if (window.innerWidth >= 640) return 3 // sm: 3 items
      return 1 // mobile: 1 item
    }
    return 5 // default
  }

  const [visibleItems, setVisibleItems] = useState(5)

  // Update visible items on window resize
  useEffect(() => {
    const updateVisibleItems = () => {
      setVisibleItems(getVisibleItems())
    }
    updateVisibleItems()
    window.addEventListener('resize', updateVisibleItems)
    return () => window.removeEventListener('resize', updateVisibleItems)
  }, [])

  const handlePrev = () => {
    setCarouselIndex(prev => {
      if (prev === 0) {
        // Wrap to the end for circular navigation
        return featuredProducts.length - 1
      }
      return prev - 1
    })
  }

  const handleNext = () => {
    setCarouselIndex(prev => {
      if (prev >= featuredProducts.length - 1) {
        // Wrap to the beginning for circular navigation
        return 0
      }
      return prev + 1
    })
  }

  // Auto-play carousel in circular manner
  useEffect(() => {
    if (featuredProducts.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      setCarouselIndex(prev => {
        if (prev >= featuredProducts.length - 1) {
          return 0
        }
        return prev + 1
      })
    }, 4000) // Move every 4 seconds

    return () => clearInterval(interval)
  }, [isPaused])

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Trigger animation when carousel index changes (for both button clicks and auto-navigation)
  useEffect(() => {
    // Clear any pending animation
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    
    // Reset animation state to start from 0
    setIsAnimating(false)
    
    // Use a timeout to ensure React has rendered the reset state before animating
    // This ensures the browser sees the translateX(0) state before transitioning to target
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(true)
    }, 300) // Delay to ensure state reset is rendered and painted
    
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [carouselIndex])

  // Initial animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Get items to display based on current index and visible items
  const getDisplayItems = () => {
    const items = []
    const totalItems = featuredProducts.length
    
    if (visibleItems === 1) {
      // Mobile: show only the focused item
      return [featuredProducts[carouselIndex]]
    } else if (visibleItems === 3) {
      // Tablet: show previous, current (focused), and next
      const prevIndex = carouselIndex === 0 ? totalItems - 1 : carouselIndex - 1
      const nextIndex = (carouselIndex + 1) % totalItems
      return [
        featuredProducts[prevIndex],
        featuredProducts[carouselIndex],
        featuredProducts[nextIndex]
      ]
    } else {
      // Desktop: show 5 items - 2 before, current (focused), 2 after
      const indices = []
      for (let i = -2; i <= 2; i++) {
        let idx = carouselIndex + i
        if (idx < 0) idx = totalItems + idx
        if (idx >= totalItems) idx = idx - totalItems
        indices.push(idx)
      }
      return indices.map(idx => featuredProducts[idx])
    }
  }

  const displayItems = getDisplayItems()

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-royal-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-800"></div>
          </div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-royal-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12"> 
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">
            Handpicked selections from our premium collection
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel Container */}
          <div className="overflow-visible px-4">
            <div className="relative flex items-center justify-center" style={{ height: '650px', minHeight: '650px' }}>
              {displayItems.map((product, idx) => {
                // Determine if this is the focused (center) item
                const isFocused = visibleItems === 1 
                  ? true 
                  : visibleItems === 3
                    ? idx === 1
                    : idx === 2 // Center item when showing 5 items
                
                // On mobile, only show the focused item
                if (visibleItems === 1 && !isFocused) return null
                
                // Calculate position for deck-of-cards effect
                let translateX = 0
                let translateY = 0
                let rotate = 0
                let zIndex = 0
                let scale = 1
                
                if (visibleItems === 5) {
                  // Position: -2, -1, 0 (center), 1, 2
                  const position = idx - 2
                  if (position === 0) {
                    // Center card - focused
                    translateX = 0
                    translateY = 0
                    rotate = 0
                    zIndex = 10
                    scale = 1
                  } else if (position === -2) {
                    // Leftmost card
                    translateX = isAnimating ? -450 : 0
                    translateY = isAnimating ? 20 : 0
                    rotate = isAnimating ? -8 : 0
                    zIndex = 1
                    scale = isAnimating ? 0.75 : 1
                  } else if (position === -1) {
                    // Left card
                    translateX = isAnimating ? -300 : 0
                    translateY = isAnimating ? 10 : 0
                    rotate = isAnimating ? -4 : 0
                    zIndex = 2
                    scale = isAnimating ? 0.85 : 1
                  } else if (position === 1) {
                    // Right card
                    translateX = isAnimating ? 300 : 0
                    translateY = isAnimating ? 10 : 0
                    rotate = isAnimating ? 4 : 0
                    zIndex = 2
                    scale = isAnimating ? 0.85 : 1
                  } else if (position === 2) {
                    // Rightmost card
                    translateX = isAnimating ? 450 : 0
                    translateY = isAnimating ? 20 : 0
                    rotate = isAnimating ? 8 : 0
                    zIndex = 1
                    scale = isAnimating ? 0.75 : 1
                  }
                } else if (visibleItems === 3) {
                  // Tablet view: simpler layout
                  if (idx === 1) {
                    // Center
                    translateX = 0
                    zIndex = 10
                    scale = 1
                  } else if (idx === 0) {
                    // Left
                    translateX = isAnimating ? -120 : 0
                    zIndex = 1
                    scale = isAnimating ? 0.8 : 1
                  } else {
                    // Right
                    translateX = isAnimating ? 120 : 0
                    zIndex = 1
                    scale = isAnimating ? 0.8 : 1
                  }
                }
                
                return (
                  <div
                    key={`${product.id}-${idx}`}
                    className={`absolute flex-shrink-0 transition-[transform,opacity] duration-700 ease-out ${
                      isFocused 
                        ? 'w-full md:w-[45%] lg:w-[380px] opacity-100' 
                        : visibleItems === 5
                          ? 'w-[280px] opacity-100'
                          : 'hidden md:block md:w-[30%] opacity-100'
                    }`}
                    style={{
                      transform: visibleItems === 1 && isFocused
                        ? `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`
                        : `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                      zIndex: zIndex,
                      left: visibleItems === 1 && isFocused ? '50%' : '50%',
                      marginLeft: visibleItems === 1 && isFocused ? '0' : (isFocused ? '-190px' : '-140px'), // Center the card
                      transformOrigin: 'center center',
                      willChange: 'transform',
                    }}
                  >
                    <div className="card group">
                      <div 
                        className="relative h-64 overflow-hidden cursor-pointer"
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.originalPrice && (
                          <span className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                            Sale
                          </span>
                        )}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                            className="bg-white p-2 rounded-full shadow-lg hover:bg-royal-50 transition-colors"
                            aria-label="Add to wishlist"
                          >
                            <FiHeart className="w-5 h-5 text-royal-700" />
                          </button>
                          <Link
                            href={`/products/${product.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white p-2 rounded-full shadow-lg hover:bg-royal-50 transition-colors"
                            aria-label="View product details to add to cart"
                          >
                            <FiShoppingCart className="w-5 h-5 text-royal-700" />
                          </Link>
                        </div>
                      </div>
                        <div className="p-6">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-serif text-xl font-semibold text-royal-900 mb-2 hover:text-royal-700 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <FiTag className="w-4 h-4 text-royal-500" />
                          <span className="text-xs font-medium text-royal-700 bg-royal-100 px-2 py-1 rounded">
                            {product.category}
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < product.rating
                                  ? 'text-gold-500'
                                  : 'text-royal-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="text-sm text-royal-600 ml-2">
                            ({product.reviews})
                          </span>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-2 mb-4 pb-4 border-b border-royal-200">
                          <div className="flex items-center gap-2 text-sm text-royal-700">
                            <FiMaximize2 className="w-4 h-4 text-royal-500 flex-shrink-0" />
                            <span className="text-royal-600">{product.size}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-royal-700">
                            <span className="text-royal-600 font-medium">Material:</span>
                            <span className="text-royal-700">{product.material}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-royal-900">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-lg text-royal-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {product.originalPrice && (
                            <span className="text-xs font-semibold text-gold-700 bg-gold-100 px-2 py-1 rounded">
                              Save {formatPrice(product.originalPrice - product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          {featuredProducts.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-royal-50 transition-all duration-300 opacity-100 hover:scale-110"
                aria-label="Previous products"
              >
                <FiChevronLeft className="w-6 h-6 text-royal-900" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-royal-50 transition-all duration-300 opacity-100 hover:scale-110"
                aria-label="Next products"
              >
                <FiChevronRight className="w-6 h-6 text-royal-900" />
              </button>
            </>
          )}

          {/* Carousel Indicators */}
          {featuredProducts.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    carouselIndex === index
                      ? 'w-8 bg-gold-500'
                      : 'w-2 bg-royal-300 hover:bg-royal-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/products" className="btn-primary">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
