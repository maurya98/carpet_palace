'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiShoppingCart, FiHeart, FiTruck, FiShield, FiCheck, FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi'
import { useCart } from '@/contexts/CartContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getProductById, getSimilarProducts } from '@/app/api/products/products'
import type { ProductDetail, SimilarProduct } from '@/app/api/mockData/products'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id)
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const thumbnailScrollRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const similarProductsRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [canScrollSimilarLeft, setCanScrollSimilarLeft] = useState(false)
  const [canScrollSimilarRight, setCanScrollSimilarRight] = useState(false)
  
  // State for dimension and material selection
  const [selectedDimension, setSelectedDimension] = useState<string>('')
  const [selectedMaterial, setSelectedMaterial] = useState<string>('')
  const [addedToCart, setAddedToCart] = useState(false)

  // Touch/swipe gesture state for carousel
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [hasDragged, setHasDragged] = useState(false)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const productData = await getProductById(productId)
        if (!productData) {
          notFound()
          return
        }
        setProduct(productData)
        
        // Fetch similar products
        const similar = await getSimilarProducts(
          productId,
          productData.category,
          productData.material
        )
        setSimilarProducts(similar)
      } catch (error) {
        console.error('Error fetching product:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  // Initialize selected dimension and material with first available options
  useEffect(() => {
    if (product && product.dimensions.length > 0 && !selectedDimension) {
      setSelectedDimension(product.dimensions[0])
    }
    if (product && product.material.length > 0 && !selectedMaterial) {
      setSelectedMaterial(product.material[0])
    }
  }, [product?.dimensions, product?.material, selectedDimension, selectedMaterial])

  // Get current variant based on selected dimension and material
  const currentVariant = useMemo(() => {
    if (!product || !selectedDimension || !selectedMaterial) return null
    const variantKey = `${selectedDimension}|${selectedMaterial}`
    return product.variants[variantKey] || null
  }, [selectedDimension, selectedMaterial, product?.variants])

  // Get current price
  const currentPrice = useMemo(() => {
    if (!product) return 0
    return currentVariant?.price ?? product.price
  }, [currentVariant, product?.price])

  const currentOriginalPrice = useMemo(() => {
    if (!product) return null
    return currentVariant?.originalPrice ?? product.originalPrice
  }, [currentVariant, product?.originalPrice])

  const isAvailable = useMemo(() => {
    return currentVariant?.available ?? true
  }, [currentVariant])

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    if (!product || !isAvailable) return
    
    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      image: product.images[0],
      dimension: selectedDimension,
      material: selectedMaterial,
    })
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }, [addToCart, product, currentPrice, currentOriginalPrice, selectedDimension, selectedMaterial, isAvailable])

  // Image carousel handlers
  const handlePreviousImage = useCallback(() => {
    if (!product) return
    setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }, [product?.images.length])

  const handleNextImage = useCallback(() => {
    if (!product) return
    setSelectedImageIndex((prev) => (prev === (product.images.length - 1) ? 0 : prev + 1))
  }, [product?.images.length])

  // Thumbnail scroll handlers
  const scrollThumbnails = useCallback((direction: 'left' | 'right') => {
    if (!thumbnailScrollRef.current) return
    
    const scrollAmount = 200
    const currentScroll = thumbnailScrollRef.current.scrollLeft
    
    thumbnailScrollRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth',
    })
  }, [])

  // Check scroll position for thumbnails
  useEffect(() => {
    if (!product) return
    const checkScroll = () => {
      if (!thumbnailScrollRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailScrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
    
    checkScroll()
    thumbnailScrollRef.current?.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    
    return () => {
      thumbnailScrollRef.current?.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [product?.images])

  // Carousel navigation
  const goToSlide = useCallback((index: number) => {
    setCarouselIndex(index)
    setSelectedImageIndex(index)
  }, [])

  const nextSlide = useCallback(() => {
    if (!product) return
    setCarouselIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
    setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }, [product?.images.length])

  const prevSlide = useCallback(() => {
    if (!product) return
    setCarouselIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
    setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }, [product?.images.length])

  // Auto-play carousel
  useEffect(() => {
    if (!product) return
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [nextSlide, product])

  // Similar products slider handlers
  const scrollSimilarProducts = useCallback((direction: 'left' | 'right') => {
    if (!similarProductsRef.current) return
    
    const scrollAmount = 300
    const currentScroll = similarProductsRef.current.scrollLeft
    
    similarProductsRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth',
    })
  }, [])

  // Check scroll position for similar products slider
  useEffect(() => {
    const checkSimilarScroll = () => {
      if (!similarProductsRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = similarProductsRef.current
      setCanScrollSimilarLeft(scrollLeft > 0)
      setCanScrollSimilarRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
    
    checkSimilarScroll()
    similarProductsRef.current?.addEventListener('scroll', checkSimilarScroll)
    window.addEventListener('resize', checkSimilarScroll)
    
    return () => {
      similarProductsRef.current?.removeEventListener('scroll', checkSimilarScroll)
      window.removeEventListener('resize', checkSimilarScroll)
    }
  }, [similarProducts])

  // Touch handlers for carousel
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      handleNextImage()
    }
    if (isRightSwipe) {
      handlePreviousImage()
    }
  }

  // Mouse drag handlers for carousel
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragOffset(e.clientX)
    setHasDragged(false)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const delta = e.clientX - dragOffset
    if (Math.abs(delta) > 10) {
      setHasDragged(true)
    }
  }

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    
    if (!hasDragged) return
    
    const delta = e.clientX - dragOffset
    if (Math.abs(delta) > minSwipeDistance) {
      if (delta > 0) {
        handlePreviousImage()
      } else {
        handleNextImage()
      }
    }
    
    setDragOffset(0)
    setHasDragged(false)
  }

  // Early returns must come after all hooks
  if (isLoading) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-800"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
    return null
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-royal-800">Home</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-royal-800">Products</Link></li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="relative aspect-[4/3.5] bg-gray-100 rounded-lg overflow-hidden group cursor-grab active:cursor-grabbing"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={() => setIsDragging(false)}
            >
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-opacity opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-opacity opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="relative">
                {canScrollLeft && (
                  <button
                    onClick={() => scrollThumbnails('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
                    aria-label="Scroll thumbnails left"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <div
                  ref={thumbnailScrollRef}
                  className="flex space-x-2 overflow-x-auto scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-royal-800 ring-2 ring-royal-200'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
                {canScrollRight && (
                  <button
                    onClick={() => scrollThumbnails('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
                    aria-label="Scroll thumbnails right"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({product.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(currentPrice)}</span>
              {currentOriginalPrice && (
                <span className="text-xl text-gray-500 line-through">{formatPrice(currentOriginalPrice)}</span>
              )}
              {currentOriginalPrice && (
                <span className="text-sm font-semibold text-red-600">
                  {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <FiCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dimension Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size: <span className="text-royal-800">{selectedDimension || 'Select a size'}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.dimensions.map((dimension) => (
                  <button
                    key={dimension}
                    onClick={() => setSelectedDimension(dimension)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedDimension === dimension
                        ? 'border-royal-800 bg-royal-50 text-royal-800 font-semibold'
                        : 'border-gray-300 hover:border-royal-300 text-gray-700'
                    }`}
                  >
                    {dimension}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material: <span className="text-royal-800">{selectedMaterial || 'Select a material'}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.material.map((material) => (
                  <button
                    key={material}
                    onClick={() => setSelectedMaterial(material)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedMaterial === material
                        ? 'border-royal-800 bg-royal-50 text-royal-800 font-semibold'
                        : 'border-gray-300 hover:border-royal-300 text-gray-700'
                    }`}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            {!isAvailable && (
              <div className="flex items-center space-x-2 text-red-600">
                <FiAlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">This variant is currently out of stock</span>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isAvailable
                    ? 'bg-royal-800 text-white hover:bg-royal-900'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>{addedToCart ? 'Added to Cart!' : isAvailable ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
              <button className="p-3 border-2 border-gray-300 rounded-lg hover:border-royal-800 hover:text-royal-800 transition-colors">
                <FiHeart className="w-5 h-5" />
              </button>
            </div>

            {/* Shipping & Warranty Info */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <FiTruck className="w-6 h-6 text-royal-800" />
                <div>
                  <p className="font-semibold text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiShield className="w-6 h-6 text-royal-800" />
                <div>
                  <p className="font-semibold text-gray-900">Lifetime Warranty</p>
                  <p className="text-sm text-gray-600">Quality guaranteed</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
              <dl className="space-y-2">
                <div className="flex">
                  <dt className="text-gray-600 w-32">Origin:</dt>
                  <dd className="text-gray-900">{product.origin}</dd>
                </div>
                <div className="flex">
                  <dt className="text-gray-600 w-32">Category:</dt>
                  <dd className="text-gray-900">{product.category}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Products</h2>
            <div className="relative">
              {canScrollSimilarLeft && (
                <button
                  onClick={() => scrollSimilarProducts('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-opacity"
                  aria-label="Scroll similar products left"
                >
                  <FiChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
              )}
              <div
                ref={similarProductsRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {similarProducts.map((similarProduct) => (
                  <Link
                    key={similarProduct.id}
                    href={`/products/${similarProduct.id}`}
                    className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex-shrink-0 w-48"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={similarProduct.image}
                        alt={similarProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1.5 line-clamp-2 group-hover:text-royal-800 transition-colors">
                        {similarProduct.name}
                      </h3>
                      <div className="space-y-1">
                        <div>
                          <p className="text-base font-bold text-gray-900">
                            {formatPrice(similarProduct.price)}
                          </p>
                          {similarProduct.originalPrice && (
                            <p className="text-xs text-gray-500 line-through">
                              {formatPrice(similarProduct.originalPrice)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${i < similarProduct.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-xs text-gray-600">({similarProduct.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {canScrollSimilarRight && (
                <button
                  onClick={() => scrollSimilarProducts('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-opacity"
                  aria-label="Scroll similar products right"
                >
                  <FiChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

