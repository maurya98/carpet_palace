import ProductGrid from '@/components/products/ProductGrid'

export default function ProductsPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* <div className="mb-8">
          <h1 className="section-title">All Products</h1>
          <p className="section-subtitle">
            Browse our complete collection of luxury carpets and rugs
          </p>
        </div> */}
        <ProductGrid />
      </div>
    </div>
  )
}
