# Carpet Palace - Luxury E-commerce Website

A responsive e-commerce website for luxury carpets and rugs built with Next.js and Tailwind CSS.

## Features

- 🎨 Elegant and royal UI/UX design
- 📱 Fully responsive (mobile, tablet, desktop)
- 🛍️ Product listing and detail pages
- 🏷️ Category filtering
- 🛒 Shopping cart functionality with checkout flow
- 💳 Stripe payment integration (worldwide support)
- 📦 Dynamic shipping fee calculation based on address
- ⭐ Product ratings and reviews
- 🎯 Modern Next.js 14 with App Router
- 💅 Tailwind CSS for styling
- 🔍 TypeScript for type safety

## Project Structure

```
carpet-palace-fe/
├── app/
│   ├── layout.tsx          # Root layout with Header & Footer
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles & Tailwind
│   └── products/
│       ├── page.tsx        # Products listing page
│       └── [id]/
│           └── page.tsx   # Product detail page
├── components/
│   ├── layout/
│   │   ├── Header.tsx     # Navigation header
│   │   └── Footer.tsx     # Footer component
│   ├── home/
│   │   ├── Hero.tsx       # Hero section
│   │   ├── Categories.tsx # Category showcase
│   │   ├── FeaturedProducts.tsx
│   │   ├── WhyChooseUs.tsx
│   │   └── Testimonials.tsx
│   └── products/
│       └── ProductGrid.tsx # Product grid with filters
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Stripe API keys:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
   - Get your Stripe API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Design System

### Colors
- **Royal**: Deep browns and beiges for elegance
- **Gold**: Accent color for luxury touches
- **White/Cream**: Clean backgrounds

### Typography
- **Serif**: Playfair Display for headings (royal feel)
- **Sans**: Inter for body text (modern readability)

## Technologies Used

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Icons
- Stripe (Payment Processing)

## Checkout & Payment

The checkout flow includes:
- Address collection form with validation
- Dynamic shipping fee calculation based on country
- Stripe Checkout integration for secure payments
- Support for worldwide shipping to 28+ countries
- Order confirmation page

### Shipping Rates

- Free shipping for orders over $5,000
- Country-specific rates (ranging from $50-$150)
- Calculated automatically based on shipping address

## Future Enhancements

- User authentication
- Order history and tracking
- Product search functionality
- Admin dashboard
- Product reviews system
- Wishlist functionality
- Email notifications
