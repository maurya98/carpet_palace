'use client'

import { useCart } from '@/contexts/CartContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft } from 'react-icons/fi'

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()
  const { formatPrice } = useCurrency()

  if (cartItems.length === 0) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <FiShoppingCart className="w-24 h-24 text-royal-300 mx-auto mb-4" />
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-royal-900 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-royal-600 text-lg mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                href="/products"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <FiArrowLeft className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = getTotalPrice()

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-royal-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-royal-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemKey = `${item.id}-${item.dimension}-${item.material}`
              return (
                <div
                  key={itemKey}
                  className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex flex-col sm:flex-row gap-4"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.id}`}
                    className="relative w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.id}`}
                        className="font-serif text-xl font-semibold text-royal-900 hover:text-gold-600 transition-colors mb-2"
                      >
                        {item.name}
                      </Link>
                      <div className="text-sm text-royal-600 space-y-1 mb-3">
                        <p>
                          <span className="font-medium">Dimension:</span> {item.dimension}
                        </p>
                        <p>
                          <span className="font-medium">Material:</span> {item.material}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-royal-900">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-lg text-royal-500 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-royal-700">Quantity:</span>
                        <div className="flex items-center gap-2 border border-royal-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.dimension, item.material, item.quantity - 1)
                            }
                            className="p-2 hover:bg-royal-50 transition-colors rounded-l-lg"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus className="w-4 h-4 text-royal-700" />
                          </button>
                          <span className="px-4 py-2 text-royal-900 font-semibold min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.dimension, item.material, item.quantity + 1)
                            }
                            className="p-2 hover:bg-royal-50 transition-colors rounded-r-lg"
                            aria-label="Increase quantity"
                          >
                            <FiPlus className="w-4 h-4 text-royal-700" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-royal-600">Subtotal</p>
                          <p className="text-xl font-bold text-royal-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.dimension, item.material)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-serif text-2xl font-bold text-royal-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-royal-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-royal-700">
                  <span>Shipping</span>
                  <span className="font-semibold text-royal-500">
                    Calculated at checkout
                  </span>
                </div>
                <div className="border-t border-royal-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-royal-900">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout" className="btn-secondary w-full mb-4 block text-center">
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="block text-center text-royal-700 hover:text-royal-900 font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
