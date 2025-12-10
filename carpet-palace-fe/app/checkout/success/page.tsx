'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { FiCheckCircle, FiArrowLeft, FiShoppingBag } from 'react-icons/fi'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(true)
  const [customOrderId, setCustomOrderId] = useState<string | null>(null)
  const cartClearedRef = useRef(false)

  useEffect(() => {
    // Clear cart once when payment is successful
    if (sessionId && !cartClearedRef.current) {
      clearCart()
      cartClearedRef.current = true
      
      // Fetch custom order ID from session metadata
      fetch(`/api/get-order-id?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.customOrderId) {
            setCustomOrderId(data.customOrderId)
          }
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
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
            {customOrderId && (
              <div className="mb-8">
                <p className="text-sm text-royal-600 mb-1">Order ID:</p>
                <p className="text-lg font-mono font-semibold text-royal-900 bg-royal-50 px-4 py-2 rounded-lg inline-block">
                  {customOrderId}
                </p>
              </div>
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-800 mx-auto"></div>
            <p className="mt-4 text-royal-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
