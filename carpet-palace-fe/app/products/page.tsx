import { Suspense } from 'react'
import ProductGrid from '@/components/products/ProductGrid'

export default function ProductsPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-royal-900 mb-4 text-center">
            All Products
          </h1>
          <p className="text-lg text-royal-600 text-center max-w-2xl mx-auto">
            Browse our complete collection of luxury carpets and rugs
          </p>
        </div>
        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-800"></div>
          </div>
        }>
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  )
}
