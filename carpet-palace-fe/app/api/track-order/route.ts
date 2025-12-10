import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51ScVkCI47Bx3YedNvVyKpndudfrZY3t4ekv27kw6MvUx6r86fcpxfTqdF9bLCMhr64I7upylkMfr2SfvjhB3MCak00wNObU73c', {
  typescript: true,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, email } = body

    if (!orderId || !email) {
      return NextResponse.json(
        { error: 'Order ID and email are required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session
    let session
    const isStripeSessionId = orderId.startsWith('cs_')
    
    if (isStripeSessionId) {
      // Try to retrieve as Stripe session ID
      try {
        session = await stripe.checkout.sessions.retrieve(orderId, {
          expand: ['line_items', 'customer'],
        })
      } catch (error: any) {
        if (error.type === 'StripeInvalidRequestError') {
          return NextResponse.json(
            { error: 'Invalid order ID. Please check and try again.' },
            { status: 404 }
          )
        }
        throw error
      }
    } else {
      // Search for session by custom order ID in metadata
      // List recent sessions and find the one with matching custom_order_id
      try {
        const sessions = await stripe.checkout.sessions.list({
          limit: 100,
        })
        
        const matchingSession = sessions.data.find(
          s => s.metadata?.custom_order_id === orderId
        )
        
        if (!matchingSession) {
          return NextResponse.json(
            { error: 'Order not found. Please check your order ID and try again.' },
            { status: 404 }
          )
        }
        
        session = await stripe.checkout.sessions.retrieve(matchingSession.id, {
          expand: ['line_items', 'customer'],
        })
      } catch (error: any) {
        return NextResponse.json(
          { error: 'Invalid order ID. Please check and try again.' },
          { status: 404 }
        )
      }
    }

    // Verify email matches
    if (session.customer_email?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email address does not match this order. Please use the email address used during checkout.' },
        { status: 403 }
      )
    }

    // Get line items if not expanded
    let lineItems = session.line_items
    if (!lineItems || lineItems.data.length === 0) {
      lineItems = await stripe.checkout.sessions.listLineItems(orderId, {
        limit: 100,
      })
    }

    // Get custom order ID from metadata
    const customOrderId = session.metadata?.custom_order_id || session.id

    // Format order details
    const orderDetails = {
      id: customOrderId,
      stripeSessionId: session.id,
      status: session.payment_status === 'paid' ? 'Complete' : session.payment_status,
      amount: session.amount_total || 0,
      currency: session.currency?.toUpperCase() || 'INR',
      created: session.created,
      shipping: session.shipping_details
        ? {
            name: session.shipping_details.name || '',
            address: {
              line1: session.shipping_details.address?.line1 || '',
              line2: session.shipping_details.address?.line2 || null,
              city: session.shipping_details.address?.city || '',
              state: session.shipping_details.address?.state || '',
              postal_code: session.shipping_details.address?.postal_code || '',
              country: session.shipping_details.address?.country || '',
            },
          }
        : null,
      items: lineItems.data.map((item: any) => ({
        description: item.description || item.price?.product?.name || 'Product',
        quantity: item.quantity || 1,
        amount: item.amount_total || 0,
      })),
    }

    return NextResponse.json({ order: orderDetails })
  } catch (error: any) {
    console.error('Error tracking order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to track order. Please try again.' },
      { status: 500 }
    )
  }
}
