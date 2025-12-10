import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { generateOrderId } from '@/utils/orderId'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51ScVkCI47Bx3YedNvVyKpndudfrZY3t4ekv27kw6MvUx6r86fcpxfTqdF9bLCMhr64I7upylkMfr2SfvjhB3MCak00wNObU73c', {
  // apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Country to currency mapping
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'usd',
  CA: 'cad',
  GB: 'gbp',
  AU: 'aud',
  DE: 'eur',
  FR: 'eur',
  IT: 'eur',
  ES: 'eur',
  NL: 'eur',
  BE: 'eur',
  CH: 'chf',
  AT: 'eur',
  SE: 'sek',
  NO: 'nok',
  DK: 'dkk',
  FI: 'eur',
  JP: 'jpy',
  CN: 'cny',
  IN: 'inr',
  AE: 'aed',
  SA: 'sar',
  SG: 'sgd',
  HK: 'hkd',
  NZ: 'nzd',
  MX: 'mxn',
  BR: 'brl',
  AR: 'ars',
  ZA: 'zar',
}

// Exchange rates relative to INR (1 INR = X units of other currency)
// Approximate rates - in production, fetch from API
const EXCHANGE_RATES: Record<string, number> = {
  inr: 1.0,        // Base currency
  usd: 0.012048,  // 1 INR = 0.012048 USD (1 USD = 83 INR)
  cad: 0.016260,  // 1 INR = 0.016260 CAD (1 CAD = 61.48 INR)
  gbp: 0.009524,  // 1 INR = 0.009524 GBP (1 GBP = 105.06 INR)
  aud: 0.018315,  // 1 INR = 0.018315 AUD (1 AUD = 54.61 INR)
  eur: 0.011084,  // 1 INR = 0.011084 EUR (1 EUR = 90.22 INR)
  chf: 0.010601,  // 1 INR = 0.010601 CHF (1 CHF = 94.32 INR)
  sek: 0.126582,  // 1 INR = 0.126582 SEK (1 SEK = 7.90 INR)
  nok: 0.128972,  // 1 INR = 0.128972 NOK (1 NOK = 7.76 INR)
  dkk: 0.082771,  // 1 INR = 0.082771 DKK (1 DKK = 12.08 INR)
  jpy: 1.807229,  // 1 INR = 1.807229 JPY (1 JPY = 0.553 INR)
  cny: 0.086747,  // 1 INR = 0.086747 CNY (1 CNY = 11.53 INR)
  aed: 0.044217,  // 1 INR = 0.044217 AED (1 AED = 22.62 INR)
  sar: 0.045181,  // 1 INR = 0.045181 SAR (1 SAR = 22.13 INR)
  sgd: 0.016145,  // 1 INR = 0.016145 SGD (1 SGD = 61.94 INR)
  hkd: 0.094146,  // 1 INR = 0.094146 HKD (1 HKD = 10.62 INR)
  nzd: 0.020024,  // 1 INR = 0.020024 NZD (1 NZD = 49.94 INR)
  mxn: 0.204819,  // 1 INR = 0.204819 MXN (1 MXN = 4.88 INR)
  brl: 0.059639,  // 1 INR = 0.059639 BRL (1 BRL = 16.77 INR)
  ars: 10.240964, // 1 INR = 10.240964 ARS (1 ARS = 0.098 INR)
  zar: 0.222892,  // 1 INR = 0.222892 ZAR (1 ZAR = 4.49 INR)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingAddress, shippingFee, totalPrice } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Determine currency from shipping address country
    const country = shippingAddress?.country || 'IN'
    const currency = (COUNTRY_TO_CURRENCY[country] || 'inr').toLowerCase()
    const exchangeRate = EXCHANGE_RATES[currency] || 1.0

    // Create line items for Stripe (convert from INR to target currency)
    const lineItems = items.map((item: any) => {
      // item.price is in INR, convert to target currency
      const convertedPrice = item.price * exchangeRate
      // For JPY and other zero-decimal currencies, don't multiply by 100
      const isZeroDecimal = ['jpy', 'krw', 'vnd'].includes(currency)
      const unitAmount = isZeroDecimal 
        ? Math.round(convertedPrice)
        : Math.round(convertedPrice * 100)

      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
            description: `${item.dimension} • ${item.material}`,
            images: [item.image],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      }
    })

    // Add shipping as a line item if applicable
    if (shippingFee > 0) {
      // shippingFee is in INR, convert to target currency
      const convertedShippingFee = shippingFee * exchangeRate
      const isZeroDecimal = ['jpy', 'krw', 'vnd'].includes(currency)
      const shippingAmount = isZeroDecimal
        ? Math.round(convertedShippingFee)
        : Math.round(convertedShippingFee * 100)

      lineItems.push({
        price_data: {
          currency: currency,
          product_data: {
            name: 'Shipping Fee',
            description: `Shipping to ${shippingAddress.city}, ${shippingAddress.country}`,
          },
          unit_amount: shippingAmount,
        },
        quantity: 1,
      })
    }

    // Generate readable order ID
    const customOrderId = generateOrderId()

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
      shipping_address_collection: {
        allowed_countries: [
          'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE',
          'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'JP', 'CN', 'IN', 'AE',
          'SA', 'SG', 'HK', 'NZ', 'MX', 'BR', 'AR', 'ZA',
        ],
      },
      customer_email: shippingAddress.email,
      metadata: {
        custom_order_id: customOrderId,
        shipping_address: JSON.stringify(shippingAddress),
        total_price: totalPrice.toString(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
