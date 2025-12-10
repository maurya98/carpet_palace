'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiShoppingCart, FiHeart, FiFilter, FiX, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi'

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number | null
  image: string
  rating: number
  reviews: number
  category: string  
  material: string
  size: string
}

const allProducts: Product[] = [
  {
    id: 1,
    name: 'Royal Persian Masterpiece',
    price: 2499,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1581558714049-220f0d812879?q=80&w=3401&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 24,
    category: 'Persian',
    material: 'Premium Wool',
    size: '8ft x 10ft',
  },
  {
    id: 2,
    name: 'Elegant Oriental Classic',
    price: 1899,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 18,
    category: 'Oriental',
    material: 'Silk',
    size: '6ft x 9ft',
  },
  {
    id: 3,
    name: 'Modern Luxury Wool',
    price: 1599,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 32,
    category: 'Modern',
    material: 'Wool',
    size: '9ft x 12ft',
  },
  {
    id: 4,
    name: 'Traditional Silk Elegance',
    price: 3299,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 15,
    category: 'Traditional',
    material: 'Silk',
    size: '10ft x 14ft',
  },
  {
    id: 5,
    name: 'Vintage Persian Heritage',
    price: 2799,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 28,
    category: 'Persian',
    material: 'Premium Wool',
    size: '8ft x 10ft',
  },
  {
    id: 6,
    name: 'Contemporary Geometric',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 21,
    category: 'Modern',
    material: 'Synthetic',
    size: '5ft x 8ft',
  },
  {
    id: 7,
    name: 'Classic Oriental Pattern',
    price: 2199,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 19,
    category: 'Oriental',
    material: 'Wool',
    size: '6ft x 9ft',
  },
  {
    id: 8,
    name: 'Premium Wool Collection',
    price: 1699,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 26,
    category: 'Wool',
    material: 'Wool',
    size: '9ft x 12ft',
  },
  {
    id: 9,
    name: 'Luxury Persian Silk',
    price: 3499,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 12,
    category: 'Persian',
    material: 'Silk',
    size: '10ft x 14ft',
  },
  {
    id: 10,
    name: 'Modern Synthetic Blend',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 35,
    category: 'Modern',
    material: 'Synthetic',
    size: '5ft x 8ft',
  },
  {
    id: 11,
    name: 'Traditional Wool Classic',
    price: 1999,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 22,
    category: 'Traditional',
    material: 'Wool',
    size: '8ft x 10ft',
  },
  {
    id: 12,
    name: 'Oriental Premium Collection',
    price: 2899,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 16,
    category: 'Oriental',
    material: 'Premium Wool',
    size: '9ft x 12ft',
  },
  {
    id: 13,
    name: 'Contemporary Minimalist Design',
    price: 1199,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 28,
    category: 'Contemporary',
    material: 'Synthetic',
    size: '6ft x 9ft',
  },
  {
    id: 14,
    name: 'Vintage Antique Persian',
    price: 3999,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 31,
    category: 'Vintage',
    material: 'Premium Wool',
    size: '10ft x 14ft',
  },
  {
    id: 15,
    name: 'Classic European Elegance',
    price: 2399,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 20,
    category: 'Classic',
    material: 'Wool',
    size: '8ft x 10ft',
  },
  {
    id: 16,
    name: 'Luxury Handwoven Masterpiece',
    price: 4599,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 14,
    category: 'Luxury',
    material: 'Silk',
    size: '12ft x 15ft',
  },
  {
    id: 17,
    name: 'Handmade Artisan Collection',
    price: 3199,
    originalPrice: 3799,
    image: 'https://images.unsplash.com/photo-1581558714049-220f0d812879?q=80&w=3401&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 17,
    category: 'Handmade',
    material: 'Premium Wool',
    size: '9ft x 12ft',
  },
  {
    id: 18,
    name: 'Modern Abstract Patterns',
    price: 1399,
    originalPrice: 1799,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 29,
    category: 'Modern',
    material: 'Cotton',
    size: '8ft x 10ft',
  },
  {
    id: 19,
    name: 'Traditional Indian Heritage',
    price: 2699,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 23,
    category: 'Traditional',
    material: 'Silk',
    size: '9ft x 12ft',
  },
  {
    id: 20,
    name: 'Persian Garden Paradise',
    price: 2999,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 19,
    category: 'Persian',
    material: 'Premium Wool',
    size: '10ft x 14ft',
  },
  {
    id: 21,
    name: 'Oriental Dragon Design',
    price: 3499,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 25,
    category: 'Oriental',
    material: 'Silk',
    size: '12ft x 15ft',
  },
  {
    id: 22,
    name: 'Eco-Friendly Jute Natural',
    price: 799,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 42,
    category: 'Contemporary',
    material: 'Jute',
    size: '5ft x 8ft',
  },
  {
    id: 23,
    name: 'Bamboo Fiber Modern',
    price: 1099,
    originalPrice: 1399,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 33,
    category: 'Modern',
    material: 'Bamboo',
    size: '6ft x 9ft',
  },
  {
    id: 24,
    name: 'Viscose Soft Touch',
    price: 999,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 27,
    category: 'Contemporary',
    material: 'Viscose',
    size: '8ft x 10ft',
  },
  {
    id: 25,
    name: 'Classic Victorian Style',
    price: 2799,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 21,
    category: 'Classic',
    material: 'Wool',
    size: '9ft x 12ft',
  },
  {
    id: 26,
    name: 'Luxury Cashmere Blend',
    price: 5299,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 11,
    category: 'Luxury',
    material: 'Premium Wool',
    size: '12ft x 15ft',
  },
  {
    id: 27,
    name: 'Handmade Tribal Patterns',
    price: 2299,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1581558714049-220f0d812879?q=80&w=3401&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4,
    reviews: 18,
    category: 'Handmade',
    material: 'Wool',
    size: '8ft x 10ft',
  },
  {
    id: 28,
    name: 'Vintage Floral Elegance',
    price: 2599,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 26,
    category: 'Vintage',
    material: 'Silk',
    size: '10ft x 14ft',
  },
  {
    id: 29,
    name: 'Persian Medallion Classic',
    price: 3199,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1581558714049-220f0d812879?q=80&w=3401&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 30,
    category: 'Persian',
    material: 'Premium Wool',
    size: '9ft x 12ft',
  },
  {
    id: 30,
    name: 'Oriental Cherry Blossom',
    price: 2899,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 22,
    category: 'Oriental',
    material: 'Silk',
    size: '8ft x 10ft',
  },
]

// Independent filter options - separate from product list
const AVAILABLE_CATEGORIES = [
  'Persian',
  'Oriental',
  'Modern',
  'Traditional',
  'Wool',
  'Contemporary',
  'Vintage',
  'Classic',
  'Luxury',
  'Handmade',
]

const AVAILABLE_MATERIALS = [
  'Premium Wool',
  'Wool',
  'Silk',
  'Synthetic',
  'Cotton',
  'Jute',
  'Bamboo',
  'Viscose',
]

const AVAILABLE_SIZES = [
  '5ft x 8ft',
  '6ft x 9ft',
  '8ft x 10ft',
  '9ft x 12ft',
  '10ft x 14ft',
  '12ft x 15ft',
  'Custom Size',
]

interface FilterState {
  categories: string[]
  materials: string[]
  sizes: string[]
  priceRange: [number, number]
}

// Calculate initial price range outside component
const getInitialPriceRange = () => {
  const prices = allProducts.map(p => p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

export default function ProductGrid() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Initialize price range
  const initialPriceRange = getInitialPriceRange()
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    materials: [],
    sizes: [],
    priceRange: [initialPriceRange.min, initialPriceRange.max],
  })
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    material: true,
    size: true,
    price: true,
  })
  const [searchQueries, setSearchQueries] = useState({
    category: '',
    material: '',
    size: '',
  })
  const [showAllItems, setShowAllItems] = useState({
    category: false,
    material: false,
    size: false,
  })

  const PRODUCTS_PER_PAGE = 20

  // Price range based on all products
  const priceRange = useMemo(() => {
    const prices = allProducts.map(p => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }, [])

  // Get product count for each filter option (for display purposes)
  const getCategoryCount = (category: string) => {
    return allProducts.filter(p => p.category === category).length
  }

  const getMaterialCount = (material: string) => {
    return allProducts.filter(p => p.material === material).length
  }

  const getSizeCount = (size: string) => {
    return allProducts.filter(p => p.size === size).length
  }

  // Filter options based on search queries
  const filteredCategories = useMemo(() => {
    if (!searchQueries.category) return AVAILABLE_CATEGORIES
    const query = searchQueries.category.toLowerCase()
    return AVAILABLE_CATEGORIES.filter(category =>
      category.toLowerCase().includes(query)
    )
  }, [searchQueries.category])

  const filteredMaterials = useMemo(() => {
    if (!searchQueries.material) return AVAILABLE_MATERIALS
    const query = searchQueries.material.toLowerCase()
    return AVAILABLE_MATERIALS.filter(material =>
      material.toLowerCase().includes(query)
    )
  }, [searchQueries.material])

  const filteredSizes = useMemo(() => {
    if (!searchQueries.size) return AVAILABLE_SIZES
    const query = searchQueries.size.toLowerCase()
    return AVAILABLE_SIZES.filter(size =>
      size.toLowerCase().includes(query)
    )
  }, [searchQueries.size])

  const handleSearchChange = useCallback((filterType: 'category' | 'material' | 'size', value: string) => {
    setSearchQueries(prev => ({
      ...prev,
      [filterType]: value,
    }))
  }, [])

  const toggleShowAll = useCallback((filterType: 'category' | 'material' | 'size') => {
    setShowAllItems(prev => ({
      ...prev,
      [filterType]: !prev[filterType],
    }))
  }, [])

  const ITEMS_TO_SHOW_INITIALLY = 5

  // Filter products based on selected filters and search query
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Search query filter - search in name, category, and material
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesName = product.name.toLowerCase().includes(query)
        const matchesCategory = product.category.toLowerCase().includes(query)
        const matchesMaterial = product.material.toLowerCase().includes(query)
        
        if (!matchesName && !matchesCategory && !matchesMaterial) {
          return false
        }
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      // Material filter
      if (filters.materials.length > 0 && !filters.materials.includes(product.material)) {
        return false
      }

      // Size filter
      if (filters.sizes.length > 0 && !filters.sizes.includes(product.size)) {
        return false
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      return true
    })
  }, [filters, searchQuery])

  // Reset to page 1 when filters or search query change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }))
  }

  const toggleMaterial = (material: string) => {
    setFilters(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material],
    }))
  }

  const toggleSize = (size: string) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const handlePriceRangeChange = (index: number, value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [
        index === 0 ? value : prev.priceRange[0],
        index === 1 ? value : prev.priceRange[1],
      ],
    }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      materials: [],
      sizes: [],
      priceRange: [priceRange.min, priceRange.max],
    })
  }

  const clearSearch = () => {
    router.push('/products')
  }

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.materials.length > 0 || 
    filters.sizes.length > 0 || 
    filters.priceRange[0] !== priceRange.min || 
    filters.priceRange[1] !== priceRange.max

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const FilterSidebar = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif font-bold text-royal-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-royal-600 hover:text-royal-800 underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="border-b border-royal-200 pb-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-royal-900">Category</h3>
          {expandedSections.category ? (
            <FiChevronUp className="w-5 h-5 text-royal-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-royal-600" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-royal-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQueries.category}
                onChange={(e) => handleSearchChange('category', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500 outline-none"
                autoComplete="off"
              />
            </div>
            {/* Scrollable Options List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {filteredCategories.length > 0 ? (
                <>
                  {(showAllItems.category || filteredCategories.length <= ITEMS_TO_SHOW_INITIALLY
                    ? filteredCategories
                    : filteredCategories.slice(0, ITEMS_TO_SHOW_INITIALLY)
                  ).map(category => {
                    const count = getCategoryCount(category)
                    return (
                      <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-royal-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 text-royal-800 border-royal-300 rounded focus:ring-royal-500"
                        />
                        <span className="text-royal-700 text-sm">{category}</span>
                        <span className={`text-xs ml-auto ${count > 0 ? 'text-royal-500' : 'text-royal-300'}`}>
                          ({count})
                        </span>
                      </label>
                    )
                  })}
                  {filteredCategories.length > ITEMS_TO_SHOW_INITIALLY && (
                    <button
                      onClick={() => toggleShowAll('category')}
                      className="w-full text-sm text-royal-600 hover:text-royal-800 font-medium py-2 hover:bg-royal-50 rounded transition-colors"
                    >
                      {showAllItems.category ? 'Show Less' : `Show All (${filteredCategories.length})`}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-royal-500 text-center py-2">No categories found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Material Filter */}
      <div className="border-b border-royal-200 pb-4">
        <button
          onClick={() => toggleSection('material')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-royal-900">Material</h3>
          {expandedSections.material ? (
            <FiChevronUp className="w-5 h-5 text-royal-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-royal-600" />
          )}
        </button>
        {expandedSections.material && (
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-royal-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchQueries.material}
                onChange={(e) => handleSearchChange('material', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500 outline-none"
                autoComplete="off"
              />
            </div>
            {/* Scrollable Options List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {filteredMaterials.length > 0 ? (
                <>
                  {(showAllItems.material || filteredMaterials.length <= ITEMS_TO_SHOW_INITIALLY
                    ? filteredMaterials
                    : filteredMaterials.slice(0, ITEMS_TO_SHOW_INITIALLY)
                  ).map(material => {
                    const count = getMaterialCount(material)
                    return (
                      <label key={material} className="flex items-center gap-2 cursor-pointer hover:bg-royal-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={filters.materials.includes(material)}
                          onChange={() => toggleMaterial(material)}
                          className="w-4 h-4 text-royal-800 border-royal-300 rounded focus:ring-royal-500"
                        />
                        <span className="text-royal-700 text-sm">{material}</span>
                        <span className={`text-xs ml-auto ${count > 0 ? 'text-royal-500' : 'text-royal-300'}`}>
                          ({count})
                        </span>
                      </label>
                    )
                  })}
                  {filteredMaterials.length > ITEMS_TO_SHOW_INITIALLY && (
                    <button
                      onClick={() => toggleShowAll('material')}
                      className="w-full text-sm text-royal-600 hover:text-royal-800 font-medium py-2 hover:bg-royal-50 rounded transition-colors"
                    >
                      {showAllItems.material ? 'Show Less' : `Show All (${filteredMaterials.length})`}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-royal-500 text-center py-2">No materials found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="border-b border-royal-200 pb-4">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-royal-900">Size</h3>
          {expandedSections.size ? (
            <FiChevronUp className="w-5 h-5 text-royal-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-royal-600" />
          )}
        </button>
        {expandedSections.size && (
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-royal-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sizes..."
                value={searchQueries.size}
                onChange={(e) => handleSearchChange('size', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500 outline-none"
                autoComplete="off"
              />
            </div>
            {/* Scrollable Options List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {filteredSizes.length > 0 ? (
                <>
                  {(showAllItems.size || filteredSizes.length <= ITEMS_TO_SHOW_INITIALLY
                    ? filteredSizes
                    : filteredSizes.slice(0, ITEMS_TO_SHOW_INITIALLY)
                  ).map(size => {
                    const count = getSizeCount(size)
                    return (
                      <label key={size} className="flex items-center gap-2 cursor-pointer hover:bg-royal-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={filters.sizes.includes(size)}
                          onChange={() => toggleSize(size)}
                          className="w-4 h-4 text-royal-800 border-royal-300 rounded focus:ring-royal-500"
                        />
                        <span className="text-royal-700 text-sm">{size}</span>
                        <span className={`text-xs ml-auto ${count > 0 ? 'text-royal-500' : 'text-royal-300'}`}>
                          ({count})
                        </span>
                      </label>
                    )
                  })}
                  {filteredSizes.length > ITEMS_TO_SHOW_INITIALLY && (
                    <button
                      onClick={() => toggleShowAll('size')}
                      className="w-full text-sm text-royal-600 hover:text-royal-800 font-medium py-2 hover:bg-royal-50 rounded transition-colors"
                    >
                      {showAllItems.size ? 'Show Less' : `Show All (${filteredSizes.length})`}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-royal-500 text-center py-2">No sizes found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-royal-900">Price Range</h3>
          {expandedSections.price ? (
            <FiChevronUp className="w-5 h-5 text-royal-600" />
          ) : (
            <FiChevronDown className="w-5 h-5 text-royal-600" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-royal-600 mb-1">Min Price</label>
                <input
                  type="number"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-royal-600 mb-1">Max Price</label>
                <input
                  type="number"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-royal-600">
              <span>${filters.priceRange[0].toLocaleString()}</span>
              <span>-</span>
              <span>${filters.priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
              className="w-full h-2 bg-royal-200 rounded-lg appearance-none cursor-pointer accent-royal-800"
            />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-lg text-royal-700 hover:bg-royal-50 transition-colors shadow-sm"
      >
        <FiFilter className="w-5 h-5" />
        Filters {hasActiveFilters && `(${filteredProducts.length})`}
      </button>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 overflow-y-auto lg:hidden shadow-2xl">
            <div className="p-4 border-b border-royal-200 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-royal-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-royal-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-royal-700" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar />
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto filter-scrollbar pr-2">
          <FilterSidebar />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-royal-900">
              Products
            </h2>
            {searchQuery && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-royal-600">
                  Search results for: <span className="font-semibold text-royal-900">"{searchQuery}"</span>
                </span>
                <button
                  onClick={clearSearch}
                  className="text-sm text-royal-600 hover:text-royal-800 underline"
                >
                  Clear search
                </button>
              </div>
            )}
            <p className="text-royal-600 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              {filteredProducts.length !== allProducts.length && ` (${allProducts.length} total)`}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => (
              <div key={product.id} className="card group">
                <div 
                  className="relative h-40 sm:h-48 lg:h-64 overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.originalPrice && (
                    <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gold-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold z-10">
                      Sale
                    </span>
                  )}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      className="bg-white p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-royal-50 transition-colors"
                      aria-label="Add to wishlist"
                    >
                      <FiHeart className="w-4 h-4 sm:w-5 sm:h-5 text-royal-700" />
                    </button>
                    <Link
                      href={`/products/${product.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-royal-50 transition-colors"
                      aria-label="View product details to add to cart"
                    >
                      <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-royal-700" />
                    </Link>
                  </div>
                </div>
                <div className="p-3 sm:p-4 lg:p-6">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-serif text-sm sm:text-base lg:text-xl font-semibold text-royal-900 mb-1 sm:mb-2 hover:text-royal-700 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm sm:text-base lg:text-lg ${
                          i < product.rating
                            ? 'text-gold-500'
                            : 'text-royal-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs sm:text-sm text-royal-600 ml-1 sm:ml-2">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-wrap">
                      <span className="text-base sm:text-xl lg:text-2xl font-bold text-royal-900">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm lg:text-lg text-royal-500 line-through">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === 1
                        ? 'bg-royal-100 text-royal-400 cursor-not-allowed'
                        : 'bg-white text-royal-700 hover:bg-royal-50 border border-royal-300'
                    }`}
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)

                      if (!showPage) {
                        // Show ellipsis
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 text-royal-500">
                              ...
                            </span>
                          )
                        }
                        return null
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-royal-800 text-white'
                              : 'bg-white text-royal-700 hover:bg-royal-100 border border-royal-300'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? 'bg-royal-100 text-royal-400 cursor-not-allowed'
                        : 'bg-white text-royal-700 hover:bg-royal-50 border border-royal-300'
                    }`}
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-royal-600">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-royal-600 mb-4">No products found</p>
            <p className="text-royal-500 mb-6">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-royal-800 text-white rounded-lg hover:bg-royal-900 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
