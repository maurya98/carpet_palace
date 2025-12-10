import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  // apiVersion: '2024-11-20.acacia',
  typescript: true,
})

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

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `${item.dimension} • ${item.material}`,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Add shipping as a line item if applicable
    if (shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping Fee',
            description: `Shipping to ${shippingAddress.city}, ${shippingAddress.country}`,
          },
          unit_amount: Math.round(shippingFee * 100), // Convert to cents
        },
        quantity: 1,
      })
    }

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
