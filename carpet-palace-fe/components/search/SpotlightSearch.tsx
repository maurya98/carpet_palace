'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FiSearch, FiX, FiPackage, FiTag, FiLayers } from 'react-icons/fi'

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number | null
  image: string
  category: string
  material: string
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'material'
  id?: number
  name: string
  subtitle?: string
  image?: string
  price?: number
  href: string
}

// Import product data - in a real app, this would come from an API or shared data file
const allProducts: Product[] = [
  {
    id: 1,
    name: 'Royal Persian Masterpiece',
    price: 2499,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1581558714049-220f0d812879?q=80&w=3401&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Persian',
    material: 'Premium Wool',
  },
  {
    id: 2,
    name: 'Elegant Oriental Classic',
    price: 1899,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Oriental',
    material: 'Silk',
  },
  {
    id: 3,
    name: 'Modern Luxury Wool',
    price: 1599,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Modern',
    material: 'Wool',
  },
  {
    id: 4,
    name: 'Traditional Silk Elegance',
    price: 3299,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Traditional',
    material: 'Silk',
  },
  {
    id: 5,
    name: 'Vintage Persian Heritage',
    price: 2799,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Persian',
    material: 'Premium Wool',
  },
  {
    id: 6,
    name: 'Contemporary Geometric',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Modern',
    material: 'Synthetic',
  },
  {
    id: 7,
    name: 'Classic Oriental Pattern',
    price: 2199,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Oriental',
    material: 'Wool',
  },
  {
    id: 8,
    name: 'Premium Wool Collection',
    price: 1699,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Wool',
    material: 'Wool',
  },
  {
    id: 9,
    name: 'Luxury Persian Silk',
    price: 3499,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Persian',
    material: 'Silk',
  },
  {
    id: 10,
    name: 'Modern Synthetic Blend',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Modern',
    material: 'Synthetic',
  },
  {
    id: 11,
    name: 'Traditional Wool Classic',
    price: 1999,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Traditional',
    material: 'Wool',
  },
  {
    id: 12,
    name: 'Oriental Premium Collection',
    price: 2899,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Oriental',
    material: 'Premium Wool',
  },
]

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

interface SpotlightSearchProps {
  isOpen: boolean
  onClose: () => void
}

export default function SpotlightSearch({ isOpen, onClose }: SpotlightSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Get unique products (remove duplicates by id)
  const uniqueProducts = useMemo(() => {
    const seen = new Set<number>()
    return allProducts.filter(p => {
      if (seen.has(p.id)) return false
      seen.add(p.id)
      return true
    })
  }, [])

  // Generate suggestions based on query
  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!query.trim()) {
      // Show recent/popular items when no query
      return uniqueProducts.slice(0, 8).map(product => ({
        type: 'product' as const,
        id: product.id,
        name: product.name,
        subtitle: `${product.category} • ${product.material}`,
        image: product.image,
        price: product.price,
        href: `/products/${product.id}`,
      }))
    }

    const lowerQuery = query.toLowerCase().trim()
    const results: SearchSuggestion[] = []

    // Search products
    uniqueProducts
      .filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        product.material.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 6)
      .forEach(product => {
        results.push({
          type: 'product',
          id: product.id,
          name: product.name,
          subtitle: `${product.category} • ${product.material}`,
          image: product.image,
          price: product.price,
          href: `/products/${product.id}`,
        })
      })

    // Search categories
    AVAILABLE_CATEGORIES
      .filter(cat => cat.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(category => {
        if (!results.some(r => r.type === 'category' && r.name === category)) {
          results.push({
            type: 'category',
            name: category,
            subtitle: 'Category',
            href: `/products?search=${encodeURIComponent(category)}`,
          })
        }
      })

    // Search materials
    AVAILABLE_MATERIALS
      .filter(mat => mat.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(material => {
        if (!results.some(r => r.type === 'material' && r.name === material)) {
          results.push({
            type: 'material',
            name: material,
            subtitle: 'Material',
            href: `/products?search=${encodeURIComponent(material)}`,
          })
        }
      })

    return results.slice(0, 10)
  }, [query, uniqueProducts])

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0)
  }, [suggestions.length])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex])
        } else if (query.trim()) {
          handleSearch()
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, suggestions, selectedIndex, query, onClose])

  const handleSelect = (suggestion: SearchSuggestion) => {
    router.push(suggestion.href)
    onClose()
    setQuery('')
  }

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`)
      onClose()
      setQuery('')
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md" 
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />
      
      {/* Search Modal */}
      <div 
        className="relative w-full max-w-2xl bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-700/60 overflow-hidden"
        style={{ animation: 'slideUp 0.2s ease-out' }}
      >
        {/* Search Input */}
        <div className="flex items-center px-6 py-5 border-b border-gray-700/80">
          <FiSearch className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, materials..."
            className="flex-1 bg-transparent outline-none text-lg placeholder-gray-400"
            style={{ color: '#ffffff' }}
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="ml-2 p-1.5 hover:bg-gray-700/50 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <FiX className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto">
          {suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id || suggestion.name}-${index}`}
                  onClick={() => handleSelect(suggestion)}
                  className={`w-full flex items-center px-6 py-3 hover:bg-gray-800/80 transition-colors ${
                    index === selectedIndex ? 'bg-gray-800/80' : ''
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-4">
                    {suggestion.type === 'product' && suggestion.image ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image
                          src={suggestion.image}
                          alt={suggestion.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : suggestion.type === 'category' ? (
                      <FiTag className="w-5 h-5 text-royal-400" />
                    ) : (
                      <FiLayers className="w-5 h-5 text-royal-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-white truncate">
                      {suggestion.name}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-sm text-white/80 truncate">
                        {suggestion.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Price or Type Badge */}
                  {suggestion.price ? (
                    <div className="flex-shrink-0 ml-4">
                      <span className="text-sm font-semibold text-white">
                        ${suggestion.price.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 ml-4">
                      <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-full capitalize">
                        {suggestion.type}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="py-12 text-center">
              <p className="text-white mb-2">No results found</p>
              <p className="text-sm text-white/80">Try a different search term</p>
            </div>
          ) : null}

          {/* Search All Results */}
          {query.trim() && suggestions.length > 0 && (
            <div className="border-t border-gray-700/80 px-6 py-3 bg-gray-800/30">
              <button
                onClick={handleSearch}
                className="w-full flex items-center justify-center text-white hover:text-white/90 font-medium text-sm py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <FiSearch className="w-4 h-4 mr-2" />
                Search all results for "{query}"
              </button>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-6 py-3 border-t border-gray-700/80 bg-gray-800/40 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-600 rounded text-xs text-white">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-600 rounded text-xs text-white">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-600 rounded text-xs text-white">↵</kbd>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-600 rounded text-xs text-white">Esc</kbd>
              <span>Close</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-600 rounded text-xs text-white">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-600 rounded text-xs text-white">K</kbd>
            <span>to open</span>
          </div>
        </div>
      </div>
    </div>
  )
}
