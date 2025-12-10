'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { FiMapPin, FiUser, FiPhone, FiMail, FiArrowLeft, FiLoader } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

interface AddressFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function CheckoutPage() {
  const { cartItems, getTotalPrice } = useCart()
  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingFee, setShippingFee] = useState<number | null>(null)
  const [formData, setFormData] = useState<AddressFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  })

  const totalPrice = getTotalPrice()

  if (cartItems.length === 0) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-royal-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-royal-600 text-lg mb-8">
              Please add items to your cart before checkout.
            </p>
            <Link href="/products" className="btn-secondary inline-flex items-center gap-2">
              <FiArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const calculateShipping = (country: string, total: number): number => {
    // Free shipping for orders over $5000
    if (total >= 5000) {
      return 0
    }

    // Shipping rates based on country
    const shippingRates: Record<string, number> = {
      US: 50,      // United States
      CA: 75,      // Canada
      GB: 100,     // United Kingdom
      AU: 120,     // Australia
      DE: 90,      // Germany
      FR: 90,      // France
      IT: 90,      // Italy
      ES: 90,      // Spain
      NL: 90,      // Netherlands
      BE: 90,      // Belgium
      CH: 100,     // Switzerland
      AT: 90,      // Austria
      SE: 100,     // Sweden
      NO: 100,     // Norway
      DK: 100,     // Denmark
      FI: 100,     // Finland
      JP: 150,     // Japan
      CN: 130,     // China
      IN: 80,      // India
      AE: 110,     // UAE
      SA: 110,     // Saudi Arabia
      SG: 120,     // Singapore
      HK: 120,     // Hong Kong
      NZ: 120,     // New Zealand
      MX: 70,      // Mexico
      BR: 90,      // Brazil
      AR: 90,      // Argentina
      ZA: 100,     // South Africa
    }

    // Default shipping for other countries
    return shippingRates[country] || 150
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Calculate shipping based on address
    const shipping = calculateShipping(formData.country, totalPrice)
    setShippingFee(shipping)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    setIsProcessing(false)
    setStep('payment')
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: formData,
          shippingFee: shippingFee || 0,
          totalPrice: totalPrice + (shippingFee || 0),
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('There was an error processing your payment. Please try again.')
      setIsProcessing(false)
    }
  }

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'AT', name: 'Austria' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SG', name: 'Singapore' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'MX', name: 'Mexico' },
    { code: 'BR', name: 'Brazil' },
    { code: 'AR', name: 'Argentina' },
    { code: 'ZA', name: 'South Africa' },
  ]

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-royal-700 hover:text-royal-900 transition-colors mb-4"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-royal-900 mb-2">
            Checkout
          </h1>
          <div className="flex items-center gap-2 text-royal-600">
            <div className={`flex items-center gap-2 ${step === 'address' ? 'text-royal-900 font-semibold' : 'text-gold-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-royal-800 text-white' : 'bg-gold-500 text-white'}`}>
                1
              </div>
              <span>Shipping Address</span>
            </div>
            <div className="w-12 h-0.5 bg-royal-300"></div>
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-royal-900 font-semibold' : 'text-royal-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-royal-800 text-white' : 'bg-royal-300 text-royal-600'}`}>
                2
              </div>
              <span>Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'address' ? (
              <form onSubmit={handleAddressSubmit} className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6">
                <h2 className="font-serif text-2xl font-bold text-royal-900 mb-6">
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-royal-900 mb-2">
                      <FiUser className="inline w-4 h-4 mr-1" />
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-800 focus:border-transparent outline-none transition-all"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-royal-900 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-800 focus:border-transparent outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-royal-900 mb-2">
                    <FiMail className="inline w-4 h-4 mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-800 focus:border-transparent outline-none transition-all"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-royal-900 mb-2">
                    <FiPhone className="inline w-4 h-4 mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-800 focus:border-transparent outline-none transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-royal-900 mb-2">
                    <FiMapPin className="inline w-4 h-4 mr-1" />
                    Street Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-800 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-royal-900 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-800 focus:border-transparent outline-none transition-all"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-royal-900 mb-2">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-800 focus:border-transparent outline-none transition-all"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-royal-900 mb-2">
                      ZIP / Postal Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-800 focus:border-transparent outline-none transition-all"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-royal-900 mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-royal-300 rounded-lg focus:ring-2 focus:ring-royal-800 focus:border-transparent outline-none transition-all bg-white"
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="font-serif text-2xl font-bold text-royal-900 mb-6">
                  Review & Payment
                </h2>

                <div className="mb-6 p-4 bg-royal-50 rounded-lg">
                  <h3 className="font-semibold text-royal-900 mb-2">Shipping Address</h3>
                  <p className="text-royal-700 text-sm">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.state} {formData.zipCode}<br />
                    {countries.find(c => c.code === formData.country)?.name}
                  </p>
                  <button
                    onClick={() => setStep('address')}
                    className="text-royal-800 hover:text-royal-900 text-sm font-medium mt-2 underline"
                  >
                    Change Address
                  </button>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-serif text-2xl font-bold text-royal-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const itemKey = `${item.id}-${item.dimension}-${item.material}`
                  return (
                    <div key={itemKey} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-royal-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-royal-600">
                          {item.dimension} • {item.material}
                        </p>
                        <p className="text-sm text-royal-700 mt-1">
                          Qty: {item.quantity} × ${item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-royal-200 pt-4 space-y-3">
                <div className="flex justify-between text-royal-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${totalPrice.toLocaleString()}</span>
                </div>
                {shippingFee !== null && (
                  <div className="flex justify-between text-royal-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shippingFee === 0 ? (
                        <span className="text-gold-600">Free</span>
                      ) : (
                        `$${shippingFee.toLocaleString()}`
                      )}
                    </span>
                  </div>
                )}
                <div className="border-t border-royal-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-royal-900">
                    <span>Total</span>
                    <span>
                      ${(totalPrice + (shippingFee || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
