// API service layer for products
// Currently returns mock data, but structured to easily switch to real API calls
// When backend is ready, replace the mock data calls with actual fetch calls

import { 
  Product, 
  ProductDetail, 
  SimilarProduct,
  products,
  productDetails,
  AVAILABLE_CATEGORIES,
  AVAILABLE_MATERIALS,
  AVAILABLE_SIZES
} from '@/app/api/mockData/products'

// Simulate API delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

/**
 * Get all products
 * @param filters - Optional filters for products
 * @returns Promise<Product[]>
 */
export async function getAllProducts(filters?: {
  category?: string[]
  material?: string[]
  size?: string[]
  priceRange?: [number, number]
  search?: string
}): Promise<Product[]> {
  // Simulate API delay
  await delay(100)
  
  // TODO: Replace with actual API call when backend is ready
  // const response = await fetch(`${API_BASE_URL}/products`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(filters)
  // })
  // return response.json()
  
  // Mock implementation
  let filteredProducts = [...products]
  
  if (filters) {
    if (filters.category && filters.category.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        filters.category!.includes(p.category)
      )
    }
    
    // Filter by material - check both base product and variants
    if (filters.material && filters.material.length > 0) {
      filteredProducts = filteredProducts.filter(p => {
        // Check base product material
        if (filters.material!.includes(p.material)) {
          return true
        }
        // Check variants in productDetails
        const productDetail = productDetails[p.id]
        if (productDetail && productDetail.material) {
          // Check if any material in productDetail matches filter
          return productDetail.material.some(material => 
            filters.material!.includes(material)
          )
        }
        return false
      })
    }
    
    // Filter by size - check both base product and variants
    if (filters.size && filters.size.length > 0) {
      filteredProducts = filteredProducts.filter(p => {
        // Check base product size
        if (filters.size!.includes(p.size)) {
          return true
        }
        // Check variants in productDetails
        const productDetail = productDetails[p.id]
        if (productDetail && productDetail.dimensions) {
          // Check if any dimension in productDetail matches filter
          return productDetail.dimensions.some(dimension => 
            filters.size!.includes(dimension)
          )
        }
        return false
      })
    }
    
    // Filter by price range - check both base product and variants
    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(p => {
        // Check base product price
        if (p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]) {
          return true
        }
        // Check variants in productDetails
        const productDetail = productDetails[p.id]
        if (productDetail && productDetail.variants) {
          // Check if any variant price falls within range
          const variantPrices = Object.values(productDetail.variants).map(v => v.price)
          return variantPrices.some(price => 
            price >= filters.priceRange![0] && price <= filters.priceRange![1]
          )
        }
        return false
      })
    }
    
    if (filters.search) {
      const query = filters.search.toLowerCase().trim()
      filteredProducts = filteredProducts.filter(p => {
        // Check base product fields
        if (
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.material.toLowerCase().includes(query)
        ) {
          return true
        }
        // Also check productDetail for more searchable fields
        const productDetail = productDetails[p.id]
        if (productDetail) {
          if (
            productDetail.description.toLowerCase().includes(query) ||
            productDetail.origin.toLowerCase().includes(query) ||
            (productDetail.material && productDetail.material.some(m => m.toLowerCase().includes(query))) ||
            (productDetail.dimensions && productDetail.dimensions.some(d => d.toLowerCase().includes(query)))
          ) {
            return true
          }
        }
        return false
      })
    }
  }
  
  return filteredProducts
}

/**
 * Get product by ID
 * @param id - Product ID
 * @returns Promise<ProductDetail | null>
 */
export async function getProductById(id: number): Promise<ProductDetail | null> {
  // Simulate API delay
  await delay(150)
  
  // TODO: Replace with actual API call when backend is ready
  // const response = await fetch(`${API_BASE_URL}/products/${id}`)
  // if (!response.ok) return null
  // return response.json()
  
  // Mock implementation
  return productDetails[id] || null
}

/**
 * Get similar products
 * @param productId - Current product ID
 * @param category - Product category
 * @param materials - Product materials
 * @param limit - Maximum number of products to return
 * @returns Promise<SimilarProduct[]>
 */
export async function getSimilarProducts(
  productId: number,
  category: string,
  materials: string[],
  limit: number = 10
): Promise<SimilarProduct[]> {
  // Simulate API delay
  await delay(100)
  
  // TODO: Replace with actual API call when backend is ready
  // const response = await fetch(`${API_BASE_URL}/products/${productId}/similar?limit=${limit}`)
  // return response.json()
  
  // Mock implementation
  const similarProducts: SimilarProduct[] = products
    .filter(p => 
      p.id !== productId && (
        p.category === category || 
        materials.includes(p.material)
      )
    )
    .slice(0, limit)
    .map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      rating: p.rating,
      reviews: p.reviews,
      category: p.category,
      material: p.material,
    }))
  
  return similarProducts
}

/**
 * Get featured products
 * @param limit - Maximum number of products to return
 * @returns Promise<Product[]>
 */
export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  // Simulate API delay
  await delay(100)
  
  // TODO: Replace with actual API call when backend is ready
  // const response = await fetch(`${API_BASE_URL}/products/featured?limit=${limit}`)
  // return response.json()
  
  // Mock implementation - return first N products as featured
  return products.slice(0, limit)
}

/**
 * Search products
 * @param query - Search query
 * @returns Promise<Product[]>
 */
export async function searchProducts(query: string): Promise<Product[]> {
  // Simulate API delay
  await delay(100)
  
  // TODO: Replace with actual API call when backend is ready
  // const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`)
  // return response.json()
  
  // Mock implementation
  const lowerQuery = query.toLowerCase().trim()
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.material.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get filter options
 * @returns Object with available filter options
 */
export function getFilterOptions() {
  return {
    categories: AVAILABLE_CATEGORIES,
    materials: AVAILABLE_MATERIALS,
    sizes: AVAILABLE_SIZES,
  }
}
