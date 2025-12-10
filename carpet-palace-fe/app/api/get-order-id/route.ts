import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51ScVkCI47Bx3YedNvVyKpndudfrZY3t4ekv27kw6MvUx6r86fcpxfTqdF9bLCMhr64I7upylkMfr2SfvjhB3MCak00wNObU73c', {
  typescript: true,
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Get custom order ID from metadata
    const customOrderId = session.metadata?.custom_order_id || null

    return NextResponse.json({ customOrderId })
  } catch (error: any) {
    console.error('Error fetching order ID:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order ID' },
      { status: 500 }
    )
  }
}
