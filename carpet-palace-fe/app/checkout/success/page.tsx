'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { FiCheckCircle, FiArrowLeft, FiShoppingBag } from 'react-icons/fi'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(true)
  const cartClearedRef = useRef(false)

  useEffect(() => {
    // Clear cart once when payment is successful
    if (sessionId && !cartClearedRef.current) {
      clearCart()
      cartClearedRef.current = true
      setLoading(false)
    } else if (!sessionId) {
      setLoading(false)
    }
  }, [sessionId, clearCart])

  if (loading) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-800 mx-auto"></div>
            <p className="mt-4 text-royal-600">Verifying your payment...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-16 h-16 text-gold-600" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-royal-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-royal-600 text-lg mb-2">
              Thank you for your purchase.
            </p>
            <p className="text-royal-600 mb-8">
              Your order has been confirmed and you will receive an email confirmation shortly.
            </p>
            {sessionId && (
              <p className="text-sm text-royal-500 mb-8">
                Order ID: {sessionId}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <FiShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
