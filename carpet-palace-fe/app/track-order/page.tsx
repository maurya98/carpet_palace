'use client'

import { useState } from 'react'
import { FiPackage, FiSearch, FiLoader, FiCheckCircle, FiXCircle, FiTruck, FiMapPin, FiCalendar } from 'react-icons/fi'
import Link from 'next/link'

interface OrderDetails {
  id: string
  status: string
  amount: number
  currency: string
  created: number
  shipping: {
    name: string
    address: {
      line1: string
      line2?: string
      city: string
      state: string
      postal_code: string
      country: string
    }
  }
  items: Array<{
    description: string
    quantity: number
    amount: number
  }>
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setOrderDetails(null)

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId.trim(),
          email: email.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setOrderDetails(data.order)
      } else {
        setError(data.error || 'Failed to track order. Please check your order ID and email.')
      }
    } catch (err) {
      setError('An error occurred while tracking your order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
      case 'paid':
        return 'text-green-600 bg-green-100'
      case 'processing':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'canceled':
      case 'refunded':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-royal-600 bg-royal-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
      case 'paid':
        return <FiCheckCircle className="w-5 h-5" />
      case 'processing':
      case 'pending':
        return <FiLoader className="w-5 h-5 animate-spin" />
      case 'canceled':
      case 'refunded':
        return <FiXCircle className="w-5 h-5" />
      default:
        return <FiPackage className="w-5 h-5" />
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    // Amount is in smallest currency unit (cents, paise, etc.)
    const isZeroDecimal = ['JPY', 'KRW', 'VND'].includes(currency.toUpperCase())
    const actualAmount = isZeroDecimal ? amount : amount / 100

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2,
    }).format(actualAmount)
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-royal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-10 h-10 text-royal-800" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-royal-900 mb-2">
              Track Your Order
            </h1>
            <p className="text-royal-600">
              Enter your order ID and email address to track your order status
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-royal-900 mb-2">
                  Order ID / Session ID *
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                  placeholder="10122025113023ABC123"
                  className="w-full px-4 py-3 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-800 focus:border-transparent outline-none transition-all font-mono"
                />
                <p className="mt-1 text-xs text-royal-500">
                  You can find your Order ID in the confirmation email or on the checkout success page (format: DDMMYYYYHHMMSS + random characters)
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-royal-900 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-800 focus:border-transparent outline-none transition-all"
                />
                <p className="mt-1 text-xs text-royal-500">
                  Enter the email address used when placing the order
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Tracking Order...
                  </>
                ) : (
                  <>
                    <FiSearch className="w-5 h-5" />
                    Track Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-3">
                <FiXCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6">
              {/* Order Status */}
              <div className="border-b border-royal-200 pb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-royal-900 mb-2">
                      Order #{orderDetails.id}
                    </h2>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(orderDetails.status)}`}>
                        {getStatusIcon(orderDetails.status)}
                        <span className="capitalize">{orderDetails.status}</span>
                      </div>
                      <div className="flex items-center gap-2 text-royal-600">
                        <FiCalendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(orderDetails.created)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-royal-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-royal-900">
                      {formatCurrency(orderDetails.amount, orderDetails.currency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-serif text-xl font-bold text-royal-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-royal-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-royal-900">{item.description}</p>
                        <p className="text-sm text-royal-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-royal-900">
                        {formatCurrency(item.amount, orderDetails.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {orderDetails.shipping && (
                <div>
                  <h3 className="font-serif text-xl font-bold text-royal-900 mb-4 flex items-center gap-2">
                    <FiMapPin className="w-5 h-5" />
                    Shipping Address
                  </h3>
                  <div className="p-4 bg-royal-50 rounded-lg">
                    <p className="font-medium text-royal-900 mb-2">{orderDetails.shipping.name}</p>
                    <p className="text-royal-700">
                      {orderDetails.shipping.address.line1}
                      {orderDetails.shipping.address.line2 && (
                        <>, {orderDetails.shipping.address.line2}</>
                      )}
                    </p>
                    <p className="text-royal-700">
                      {orderDetails.shipping.address.city}, {orderDetails.shipping.address.state}{' '}
                      {orderDetails.shipping.address.postal_code}
                    </p>
                    <p className="text-royal-700">{orderDetails.shipping.address.country}</p>
                  </div>
                </div>
              )}

              {/* Tracking Info */}
              <div className="border-t border-royal-200 pt-6">
                <h3 className="font-serif text-xl font-bold text-royal-900 mb-4 flex items-center gap-2">
                  <FiTruck className="w-5 h-5" />
                  Tracking Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-gold-50 rounded-lg">
                    <FiCheckCircle className="w-5 h-5 text-gold-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-royal-900">Order Confirmed</p>
                      <p className="text-sm text-royal-600">
                        Your order has been confirmed and is being processed.
                      </p>
                    </div>
                  </div>
                  {orderDetails.status.toLowerCase() === 'complete' || orderDetails.status.toLowerCase() === 'paid' ? (
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-royal-900">Payment Received</p>
                        <p className="text-sm text-royal-600">
                          Your payment has been successfully processed.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                      <FiLoader className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0 animate-spin" />
                      <div>
                        <p className="font-medium text-royal-900">Processing</p>
                        <p className="text-sm text-royal-600">
                          Your order is being processed. You will receive updates via email.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Back Button */}
              <div className="pt-6 border-t border-royal-200">
                <Link
                  href="/products"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}

          {/* Help Section */}
          {!orderDetails && !error && (
            <div className="bg-royal-50 rounded-xl p-6">
              <h3 className="font-serif text-xl font-bold text-royal-900 mb-3">
                Need Help?
              </h3>
              <p className="text-royal-700 mb-4">
                If you're having trouble tracking your order, please check:
              </p>
              <ul className="list-disc list-inside space-y-2 text-royal-700">
                <li>Your order confirmation email for the Order ID</li>
                <li>That you're using the same email address used during checkout</li>
                <li>That your order was placed within the last 30 days</li>
              </ul>
              <p className="text-royal-700 mt-4">
                For further assistance, please{' '}
                <Link href="/contact" className="text-royal-800 font-semibold hover:underline">
                  contact us
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
