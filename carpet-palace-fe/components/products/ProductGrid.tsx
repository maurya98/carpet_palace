'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiShoppingCart, FiHeart, FiFilter, FiX, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getAllProducts, getFilterOptions } from '@/app/api/products/products'
import type { Product } from '@/app/api/mockData/products'
import { productDetails } from '@/app/api/mockData/products'

// Import filter options from API
const { categories: AVAILABLE_CATEGORIES, materials: AVAILABLE_MATERIALS, sizes: AVAILABLE_SIZES } = getFilterOptions()

interface FilterState {
  categories: string[]
  materials: string[]
  sizes: string[]
  priceRange: [number, number]
}

// Calculate initial price range - will be updated when products are loaded
// This considers both base product prices and variant prices
const getInitialPriceRange = (products: Product[] = []) => {
  if (products.length === 0) {
    return { min: 0, max: 10000 }
  }
  
  const prices: number[] = []
  
  products.forEach(p => {
    // Add base product price
    prices.push(p.price)
    
    // Add variant prices if they exist
    const productDetail = productDetails[p.id]
    if (productDetail && productDetail.variants) {
      const variantPrices = Object.values(productDetail.variants).map(v => v.price)
      prices.push(...variantPrices)
    }
  })
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

export default function ProductGrid() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const { formatPrice } = useCurrency()
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const products = await getAllProducts({
          search: searchQuery || undefined,
        })
        setAllProducts(products)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to empty array on error
        setAllProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [searchQuery])
  
  // Initialize price range - will be updated when products load
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    materials: [],
    sizes: [],
    priceRange: [0, 10000],
  })
  
  // Update price range when products are loaded
  useEffect(() => {
    if (allProducts.length > 0) {
      const priceRange = getInitialPriceRange(allProducts)
      setFilters(prev => ({
        ...prev,
        priceRange: [priceRange.min, priceRange.max],
      }))
    }
  }, [allProducts.length])
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
    return getInitialPriceRange(allProducts)
  }, [allProducts])

  // Get product count for each filter option (for display purposes)
  // These counts consider both base product fields and variants
  const getCategoryCount = (category: string) => {
    return allProducts.filter(p => p.category === category).length
  }

  const getMaterialCount = (material: string) => {
    return allProducts.filter(p => {
      // Check base product material
      if (p.material === material) {
        return true
      }
      // Check variants in productDetails
      const productDetail = productDetails[p.id]
      if (productDetail && productDetail.material) {
        return productDetail.material.includes(material)
      }
      return false
    }).length
  }

  const getSizeCount = (size: string) => {
    return allProducts.filter(p => {
      // Check base product size
      if (p.size === size) {
        return true
      }
      // Check variants in productDetails
      const productDetail = productDetails[p.id]
      if (productDetail && productDetail.dimensions) {
        return productDetail.dimensions.includes(size)
      }
      return false
    }).length
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

  // Filter products based on selected filters
  // Note: Search query is handled by the API call, but we still filter locally for other filters
  // This filtering also checks product variants
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      // Material filter - check both base product and variants
      if (filters.materials.length > 0) {
        // Check base product material
        const baseMaterialMatches = filters.materials.includes(product.material)
        
        // Check variants in productDetails
        const productDetail = productDetails?.[product.id]
        let variantMaterialMatches = false
        if (productDetail && Array.isArray(productDetail.material)) {
          variantMaterialMatches = productDetail.material.some((material: string) => 
            filters.materials.includes(material)
          )
        }
        
        // Product must match at least one material (base or variant)
        if (!baseMaterialMatches && !variantMaterialMatches) {
          return false
        }
      }

      // Size filter - check both base product and variants
      if (filters.sizes.length > 0) {
        // Check base product size
        const baseSizeMatches = filters.sizes.includes(product.size)
        
        // Check variants in productDetails
        const productDetail = productDetails?.[product.id]
        let variantSizeMatches = false
        if (productDetail && Array.isArray(productDetail.dimensions)) {
          variantSizeMatches = productDetail.dimensions.some((dimension: string) => 
            filters.sizes.includes(dimension)
          )
        }
        
        // Product must match at least one size (base or variant)
        if (!baseSizeMatches && !variantSizeMatches) {
          return false
        }
      }

      // Price filter - check both base product and variants
      const basePriceInRange = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      
      // Check variants in productDetails
      const productDetail = productDetails?.[product.id]
      let variantPriceInRange = false
      if (productDetail && productDetail.variants && typeof productDetail.variants === 'object') {
        const variantPrices = Object.values(productDetail.variants).map((v: any) => v.price).filter((price: number) => typeof price === 'number')
        variantPriceInRange = variantPrices.some((price: number) => 
          price >= filters.priceRange[0] && price <= filters.priceRange[1]
        )
      }
      
      // Product must have at least one price in range (base or variant)
      if (!basePriceInRange && !variantPriceInRange) {
        return false
      }

      return true
    })
  }, [filters, allProducts])

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
    const currentPriceRange = getInitialPriceRange(allProducts)
    setFilters({
      categories: [],
      materials: [],
      sizes: [],
      priceRange: [currentPriceRange.min, currentPriceRange.max],
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
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>-</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
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
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-800 mx-auto"></div>
            <p className="text-royal-600 mt-4">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
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
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm lg:text-lg text-royal-500 line-through">
                          {formatPrice(product.originalPrice)}
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
