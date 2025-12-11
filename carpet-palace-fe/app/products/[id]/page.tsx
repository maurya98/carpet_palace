'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiShoppingCart, FiHeart, FiTruck, FiShield, FiCheck, FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi'
import { useCart } from '@/contexts/CartContext'
import { useCurrency } from '@/contexts/CurrencyContext'

interface ProductVariant {
  price: number
  originalPrice: number | null
  available: boolean
}

interface ProductDetail {
  id: number
  name: string
  price: number // Base/default price
  originalPrice: number | null // Base/default original price
  images: string[]
  rating: number
  reviews: number
  description: string
  features: string[]
  dimensions: string[] // Available dimensions
  material: string[] // Available materials
  variants: Record<string, ProductVariant> // Key format: "dimension|material"
  origin: string
  category: string
}

interface SimilarProduct {
  id: number
  name: string
  price: number
  originalPrice: number | null
  image: string
  rating: number
  reviews: number
  category: string
  material: string
}

const products: Record<number, ProductDetail> = {
  1: {
    id: 1,
    name: 'Royal Persian Masterpiece',
    price: 2499,
    originalPrice: 2999,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 24,
    description: 'This exquisite Persian carpet represents the pinnacle of traditional craftsmanship. Handwoven by master artisans using techniques passed down through generations, each piece is a unique work of art.',
    features: [
      '100% Handwoven Wool',
      'Traditional Persian Design',
      'Premium Quality Materials',
      'Lifetime Warranty',
      'Free Shipping',
    ],
    dimensions: ['5ft x 8ft', '6ft x 9ft', '8ft x 10ft', '9ft x 12ft', '10ft x 14ft'],
    material: ['Premium Wool', 'Silk', 'Wool'],
    variants: {
      '5ft x 8ft|Premium Wool': { price: 1899, originalPrice: 2299, available: true },
      '5ft x 8ft|Silk': { price: 2299, originalPrice: 2799, available: true },
      '5ft x 8ft|Wool': { price: 1599, originalPrice: 1999, available: true },
      '6ft x 9ft|Premium Wool': { price: 2199, originalPrice: 2699, available: true },
      '6ft x 9ft|Silk': { price: 2699, originalPrice: null, available: true },
      '6ft x 9ft|Wool': { price: 1899, originalPrice: 2299, available: false },
      '8ft x 10ft|Premium Wool': { price: 2499, originalPrice: 2999, available: true },
      '8ft x 10ft|Silk': { price: 2999, originalPrice: 3499, available: true },
      '8ft x 10ft|Wool': { price: 2199, originalPrice: 2699, available: true },
      '9ft x 12ft|Premium Wool': { price: 2899, originalPrice: 3399, available: true },
      '9ft x 12ft|Silk': { price: 3499, originalPrice: null, available: false },
      '9ft x 12ft|Wool': { price: 2599, originalPrice: 3099, available: true },
      '10ft x 14ft|Premium Wool': { price: 3299, originalPrice: 3799, available: true },
      '10ft x 14ft|Silk': { price: 3999, originalPrice: null, available: true },
      '10ft x 14ft|Wool': { price: 2999, originalPrice: 3499, available: false },
    },
    origin: 'Iran',
    category: 'Persian',
  },
  2: {
    id: 2,
    name: 'Elegant Oriental Classic',
    price: 1899,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 5,
    reviews: 18,
    description: 'A stunning Oriental carpet featuring intricate patterns and luxurious silk construction. This classic design brings timeless elegance to any space with its rich colors and fine craftsmanship.',
    features: [
      'Premium Silk Material',
      'Handcrafted Oriental Design',
      'Rich Color Palette',
      'Premium Quality',
      'Free Shipping',
    ],
    dimensions: ['5ft x 8ft', '6ft x 9ft', '8ft x 10ft'],
    material: ['Silk', 'Premium Wool'],
    variants: {
      '5ft x 8ft|Silk': { price: 1499, originalPrice: null, available: true },
      '5ft x 8ft|Premium Wool': { price: 1299, originalPrice: null, available: true },
      '6ft x 9ft|Silk': { price: 1899, originalPrice: null, available: true },
      '6ft x 9ft|Premium Wool': { price: 1599, originalPrice: null, available: false },
      '8ft x 10ft|Silk': { price: 2299, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 1999, originalPrice: null, available: true },
    },
    origin: 'Turkey',
    category: 'Oriental',
  },
  3: {
    id: 3,
    name: 'Modern Luxury Wool',
    price: 1599,
    originalPrice: 1999,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4,
    reviews: 32,
    description: 'Contemporary design meets traditional quality in this modern luxury wool carpet. Perfect for contemporary homes seeking both style and comfort.',
    features: [
      '100% Natural Wool',
      'Modern Design',
      'Durable Construction',
      'Easy Maintenance',
      'Free Shipping',
    ],
    dimensions: ['6ft x 9ft', '8ft x 10ft', '9ft x 12ft'],
    material: ['Wool', 'Synthetic'],
    variants: {
      '6ft x 9ft|Wool': { price: 1199, originalPrice: 1499, available: true },
      '6ft x 9ft|Synthetic': { price: 899, originalPrice: 1199, available: true },
      '8ft x 10ft|Wool': { price: 1499, originalPrice: 1899, available: true },
      '8ft x 10ft|Synthetic': { price: 1099, originalPrice: 1399, available: false },
      '9ft x 12ft|Wool': { price: 1599, originalPrice: 1999, available: true },
      '9ft x 12ft|Synthetic': { price: 1299, originalPrice: 1599, available: true },
    },
    origin: 'India',
    category: 'Modern',
  },
  4: {
    id: 4,
    name: 'Traditional Silk Elegance',
    price: 3299,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 15,
    description: 'An opulent traditional silk carpet that exudes luxury and sophistication. Handwoven with meticulous attention to detail, this piece is a true heirloom quality investment.',
    features: [
      'Premium Silk Construction',
      'Traditional Patterns',
      'Heirloom Quality',
      'Luxury Finish',
      'Lifetime Warranty',
    ],
    dimensions: ['8ft x 10ft', '9ft x 12ft', '10ft x 14ft'],
    material: ['Silk', 'Premium Wool'],
    variants: {
      '8ft x 10ft|Silk': { price: 2699, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 2299, originalPrice: null, available: true },
      '9ft x 12ft|Silk': { price: 2999, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 2599, originalPrice: null, available: false },
      '10ft x 14ft|Silk': { price: 3299, originalPrice: null, available: true },
      '10ft x 14ft|Premium Wool': { price: 2899, originalPrice: null, available: true },
    },
    origin: 'China',
    category: 'Traditional',
  },
  5: {
    id: 5,
    name: 'Vintage Persian Heritage',
    price: 2799,
    originalPrice: null,
    images: [
      'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 28,
    description: 'A vintage-inspired Persian carpet that captures the essence of traditional heritage. This premium wool masterpiece showcases authentic Persian artistry and timeless beauty.',
    features: [
      'Vintage Design',
      'Premium Wool',
      'Authentic Persian Patterns',
      'Heritage Quality',
      'Free Shipping',
    ],
    dimensions: ['6ft x 9ft', '8ft x 10ft', '9ft x 12ft'],
    material: ['Premium Wool', 'Wool'],
    variants: {
      '6ft x 9ft|Premium Wool': { price: 2199, originalPrice: null, available: true },
      '6ft x 9ft|Wool': { price: 1899, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 2799, originalPrice: null, available: true },
      '8ft x 10ft|Wool': { price: 2399, originalPrice: null, available: false },
      '9ft x 12ft|Premium Wool': { price: 3299, originalPrice: null, available: true },
      '9ft x 12ft|Wool': { price: 2899, originalPrice: null, available: true },
    },
    origin: 'Iran',
    category: 'Persian',
  },
  6: {
    id: 6,
    name: 'Contemporary Geometric',
    price: 1299,
    originalPrice: 1599,
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4,
    reviews: 21,
    description: 'Bold geometric patterns meet modern aesthetics in this contemporary carpet. The synthetic blend offers durability and easy maintenance while maintaining a stylish appearance.',
    features: [
      'Modern Geometric Design',
      'Synthetic Blend',
      'Easy Maintenance',
      'Stain Resistant',
      'Free Shipping',
    ],
    dimensions: ['5ft x 8ft', '6ft x 9ft', '8ft x 10ft'],
    material: ['Synthetic', 'Wool'],
    variants: {
      '5ft x 8ft|Synthetic': { price: 999, originalPrice: 1299, available: true },
      '5ft x 8ft|Wool': { price: 1299, originalPrice: 1599, available: true },
      '6ft x 9ft|Synthetic': { price: 1199, originalPrice: 1499, available: true },
      '6ft x 9ft|Wool': { price: 1499, originalPrice: 1799, available: false },
      '8ft x 10ft|Synthetic': { price: 1399, originalPrice: 1699, available: true },
      '8ft x 10ft|Wool': { price: 1699, originalPrice: 1999, available: true },
    },
    origin: 'USA',
    category: 'Modern',
  },
  7: {
    id: 7,
    name: 'Classic Oriental Pattern',
    price: 2199,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 19,
    description: 'A classic Oriental pattern carpet crafted from premium wool. This timeless design brings warmth and elegance to any room with its intricate traditional motifs.',
    features: [
      'Classic Oriental Design',
      'Premium Wool',
      'Traditional Patterns',
      'Durable Construction',
      'Free Shipping',
    ],
    dimensions: ['5ft x 8ft', '6ft x 9ft', '8ft x 10ft'],
    material: ['Wool', 'Premium Wool'],
    variants: {
      '5ft x 8ft|Wool': { price: 1799, originalPrice: null, available: true },
      '5ft x 8ft|Premium Wool': { price: 1999, originalPrice: null, available: true },
      '6ft x 9ft|Wool': { price: 2199, originalPrice: null, available: true },
      '6ft x 9ft|Premium Wool': { price: 2399, originalPrice: null, available: false },
      '8ft x 10ft|Wool': { price: 2599, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 2799, originalPrice: null, available: true },
    },
    origin: 'Turkey',
    category: 'Oriental',
  },
  8: {
    id: 8,
    name: 'Premium Wool Collection',
    price: 1699,
    originalPrice: 1999,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4,
    reviews: 26,
    description: 'A premium wool carpet from our exclusive collection. This versatile piece combines natural wool quality with contemporary design sensibilities.',
    features: [
      '100% Natural Wool',
      'Premium Collection',
      'Versatile Design',
      'Quality Construction',
      'Free Shipping',
    ],
    dimensions: ['6ft x 9ft', '8ft x 10ft', '9ft x 12ft'],
    material: ['Wool', 'Premium Wool'],
    variants: {
      '6ft x 9ft|Wool': { price: 1299, originalPrice: 1599, available: true },
      '6ft x 9ft|Premium Wool': { price: 1499, originalPrice: 1799, available: true },
      '8ft x 10ft|Wool': { price: 1499, originalPrice: 1799, available: true },
      '8ft x 10ft|Premium Wool': { price: 1699, originalPrice: 1999, available: false },
      '9ft x 12ft|Wool': { price: 1699, originalPrice: 1999, available: true },
      '9ft x 12ft|Premium Wool': { price: 1899, originalPrice: 2199, available: true },
    },
    origin: 'New Zealand',
    category: 'Wool',
  },
  9: {
    id: 9,
    name: 'Luxury Persian Silk',
    price: 3499,
    originalPrice: null,
    images: [
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 5,
    reviews: 12,
    description: 'The ultimate in luxury Persian carpets, crafted from the finest silk. This masterpiece represents the highest level of Persian carpet artistry and is a true collector\'s item.',
    features: [
      'Luxury Silk Material',
      'Persian Masterpiece',
      'Collector Quality',
      'Handcrafted Excellence',
      'Lifetime Warranty',
    ],
    dimensions: ['8ft x 10ft', '9ft x 12ft', '10ft x 14ft'],
    material: ['Silk', 'Premium Wool'],
    variants: {
      '8ft x 10ft|Silk': { price: 2899, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 2499, originalPrice: null, available: true },
      '9ft x 12ft|Silk': { price: 3199, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 2799, originalPrice: null, available: false },
      '10ft x 14ft|Silk': { price: 3499, originalPrice: null, available: true },
      '10ft x 14ft|Premium Wool': { price: 3099, originalPrice: null, available: true },
    },
    origin: 'Iran',
    category: 'Persian',
  },
  10: {
    id: 10,
    name: 'Modern Synthetic Blend',
    price: 899,
    originalPrice: 1199,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4,
    reviews: 35,
    description: 'An affordable modern carpet featuring a synthetic blend that offers excellent durability and easy maintenance. Perfect for high-traffic areas and modern homes.',
    features: [
      'Synthetic Blend',
      'Modern Design',
      'High Durability',
      'Easy Maintenance',
      'Budget Friendly',
    ],
    dimensions: ['5ft x 8ft', '6ft x 9ft', '8ft x 10ft'],
    material: ['Synthetic', 'Wool'],
    variants: {
      '5ft x 8ft|Synthetic': { price: 699, originalPrice: 999, available: true },
      '5ft x 8ft|Wool': { price: 899, originalPrice: 1199, available: true },
      '6ft x 9ft|Synthetic': { price: 799, originalPrice: 1099, available: true },
      '6ft x 9ft|Wool': { price: 999, originalPrice: 1299, available: false },
      '8ft x 10ft|Synthetic': { price: 899, originalPrice: 1199, available: true },
      '8ft x 10ft|Wool': { price: 1099, originalPrice: 1399, available: true },
    },
    origin: 'USA',
    category: 'Modern',
  },
  11: {
    id: 11,
    name: 'Traditional Wool Classic',
    price: 1999,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4,
    reviews: 22,
    description: 'A traditional wool classic that brings timeless elegance to your home. This handcrafted piece features classic patterns and premium natural wool construction.',
    features: [
      'Traditional Design',
      'Natural Wool',
      'Classic Patterns',
      'Handcrafted',
      'Free Shipping',
    ],
    dimensions: ['6ft x 9ft', '8ft x 10ft', '9ft x 12ft'],
    material: ['Wool', 'Premium Wool'],
    variants: {
      '6ft x 9ft|Wool': { price: 1699, originalPrice: null, available: true },
      '6ft x 9ft|Premium Wool': { price: 1899, originalPrice: null, available: true },
      '8ft x 10ft|Wool': { price: 1999, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 2199, originalPrice: null, available: false },
      '9ft x 12ft|Wool': { price: 2299, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 2499, originalPrice: null, available: true },
    },
    origin: 'India',
    category: 'Traditional',
  },
  12: {
    id: 12,
    name: 'Oriental Premium Collection',
    price: 2899,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 5,
    reviews: 16,
    description: 'An exceptional Oriental carpet from our premium collection. Crafted with premium wool and featuring intricate Oriental patterns, this piece is a statement of luxury and refinement.',
    features: [
      'Premium Collection',
      'Premium Wool',
      'Intricate Oriental Patterns',
      'Luxury Quality',
      'Lifetime Warranty',
    ],
    dimensions: ['8ft x 10ft', '9ft x 12ft', '10ft x 14ft'],
    material: ['Premium Wool', 'Silk'],
    variants: {
      '8ft x 10ft|Premium Wool': { price: 2499, originalPrice: null, available: true },
      '8ft x 10ft|Silk': { price: 2899, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 2899, originalPrice: null, available: true },
      '9ft x 12ft|Silk': { price: 3299, originalPrice: null, available: false },
      '10ft x 14ft|Premium Wool': { price: 3299, originalPrice: null, available: true },
      '10ft x 14ft|Silk': { price: 3699, originalPrice: null, available: true },
    },
    origin: 'Turkey',
    category: 'Oriental',
  },
  13: {
    id: 13,
    name: 'Contemporary Minimalist Design',
    price: 1199,
    originalPrice: 1499,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4,
    reviews: 28,
    description: 'A contemporary minimalist carpet that brings clean lines and modern aesthetics to any space. Perfect for those who appreciate simplicity and elegance in design.',
    features: [
      'Minimalist Design',
      'Synthetic Material',
      'Easy Maintenance',
      'Modern Aesthetic',
      'Free Shipping',
    ],
    dimensions: ['5ft x 8ft', '6ft x 9ft', '8ft x 10ft'],
    material: ['Synthetic', 'Cotton'],
    variants: {
      '5ft x 8ft|Synthetic': { price: 899, originalPrice: 1199, available: true },
      '5ft x 8ft|Cotton': { price: 1099, originalPrice: 1399, available: true },
      '6ft x 9ft|Synthetic': { price: 1199, originalPrice: 1499, available: true },
      '6ft x 9ft|Cotton': { price: 1399, originalPrice: 1699, available: true },
      '8ft x 10ft|Synthetic': { price: 1499, originalPrice: 1799, available: true },
      '8ft x 10ft|Cotton': { price: 1699, originalPrice: 1999, available: false },
    },
    origin: 'USA',
    category: 'Contemporary',
  },
  14: {
    id: 14,
    name: 'Vintage Antique Persian',
    price: 3999,
    originalPrice: null,
    images: [
      'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 31,
    description: 'An exquisite vintage antique Persian carpet that embodies centuries of traditional craftsmanship. This rare piece showcases authentic antique patterns and premium materials.',
    features: [
      'Antique Design',
      'Premium Wool',
      'Authentic Vintage Patterns',
      'Collector\'s Item',
      'Lifetime Warranty',
    ],
    dimensions: ['8ft x 10ft', '9ft x 12ft', '10ft x 14ft', '12ft x 15ft'],
    material: ['Premium Wool', 'Silk'],
    variants: {
      '8ft x 10ft|Premium Wool': { price: 3499, originalPrice: null, available: true },
      '8ft x 10ft|Silk': { price: 3999, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 3999, originalPrice: null, available: true },
      '9ft x 12ft|Silk': { price: 4499, originalPrice: null, available: false },
      '10ft x 14ft|Premium Wool': { price: 4499, originalPrice: null, available: true },
      '10ft x 14ft|Silk': { price: 4999, originalPrice: null, available: true },
      '12ft x 15ft|Premium Wool': { price: 5499, originalPrice: null, available: true },
      '12ft x 15ft|Silk': { price: 5999, originalPrice: null, available: true },
    },
    origin: 'Iran',
    category: 'Vintage',
  },
  15: {
    id: 15,
    name: 'Classic European Elegance',
    price: 2399,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 20,
    description: 'A classic European carpet that brings timeless elegance and sophistication to your home. Inspired by European design traditions, this piece features refined patterns and premium wool construction.',
    features: [
      'European Design',
      'Premium Wool',
      'Classic Patterns',
      'Elegant Finish',
      'Free Shipping',
    ],
    dimensions: ['6ft x 9ft', '8ft x 10ft', '9ft x 12ft'],
    material: ['Wool', 'Premium Wool'],
    variants: {
      '6ft x 9ft|Wool': { price: 1999, originalPrice: null, available: true },
      '6ft x 9ft|Premium Wool': { price: 2199, originalPrice: null, available: true },
      '8ft x 10ft|Wool': { price: 2399, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 2599, originalPrice: null, available: true },
      '9ft x 12ft|Wool': { price: 2799, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 2999, originalPrice: null, available: false },
    },
    origin: 'France',
    category: 'Classic',
  },
  16: {
    id: 16,
    name: 'Luxury Handwoven Masterpiece',
    price: 4599,
    originalPrice: null,
    images: [
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 5,
    reviews: 14,
    description: 'The ultimate luxury handwoven masterpiece, crafted from the finest silk by master artisans. This exceptional piece represents the pinnacle of carpet artistry and is a true investment in luxury.',
    features: [
      'Handwoven Excellence',
      'Luxury Silk Material',
      'Master Artisan Crafted',
      'Investment Quality',
      'Lifetime Warranty',
    ],
    dimensions: ['9ft x 12ft', '10ft x 14ft', '12ft x 15ft'],
    material: ['Silk', 'Premium Wool'],
    variants: {
      '9ft x 12ft|Silk': { price: 4099, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 3699, originalPrice: null, available: true },
      '10ft x 14ft|Silk': { price: 4599, originalPrice: null, available: true },
      '10ft x 14ft|Premium Wool': { price: 4199, originalPrice: null, available: false },
      '12ft x 15ft|Silk': { price: 5299, originalPrice: null, available: true },
      '12ft x 15ft|Premium Wool': { price: 4899, originalPrice: null, available: true },
    },
    origin: 'Iran',
    category: 'Luxury',
  },
  17: {
    id: 17,
    name: 'Handmade Artisan Collection',
    price: 3199,
    originalPrice: 3799,
    images: [
      'https://images.unsplash.com/photo-1581558714049-220f0d812879?q=80&w=3401&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 17,
    description: 'A stunning handmade artisan collection piece that showcases traditional craftsmanship. Each carpet is uniquely handcrafted by skilled artisans using time-honored techniques.',
    features: [
      'Handmade Craftsmanship',
      'Premium Wool',
      'Unique Artisan Design',
      'Traditional Techniques',
      'Free Shipping',
    ],
    dimensions: ['6ft x 9ft', '8ft x 10ft', '9ft x 12ft'],
    material: ['Premium Wool', 'Wool'],
    variants: {
      '6ft x 9ft|Premium Wool': { price: 2699, originalPrice: 3299, available: true },
      '6ft x 9ft|Wool': { price: 2399, originalPrice: 2999, available: true },
      '8ft x 10ft|Premium Wool': { price: 3199, originalPrice: 3799, available: true },
      '8ft x 10ft|Wool': { price: 2899, originalPrice: 3499, available: false },
      '9ft x 12ft|Premium Wool': { price: 3699, originalPrice: 4299, available: true },
      '9ft x 12ft|Wool': { price: 3399, originalPrice: 3999, available: true },
    },
    origin: 'India',
    category: 'Handmade',
  },
  18: {
    id: 18,
    name: 'Modern Abstract Patterns',
    price: 1399,
    originalPrice: 1799,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4,
    reviews: 29,
    description: 'A modern carpet featuring bold abstract patterns that make a statement in any contemporary space. The cotton blend offers comfort and style with easy maintenance.',
    features: [
      'Abstract Design',
      'Cotton Blend',
      'Modern Patterns',
      'Easy Care',
      'Free Shipping',
    ],
    dimensions: ['5ft x 8ft', '6ft x 9ft', '8ft x 10ft'],
    material: ['Cotton', 'Synthetic'],
    variants: {
      '5ft x 8ft|Cotton': { price: 1099, originalPrice: 1499, available: true },
      '5ft x 8ft|Synthetic': { price: 999, originalPrice: 1399, available: true },
      '6ft x 9ft|Cotton': { price: 1299, originalPrice: 1699, available: true },
      '6ft x 9ft|Synthetic': { price: 1199, originalPrice: 1599, available: false },
      '8ft x 10ft|Cotton': { price: 1399, originalPrice: 1799, available: true },
      '8ft x 10ft|Synthetic': { price: 1299, originalPrice: 1699, available: true },
    },
    origin: 'USA',
    category: 'Modern',
  },
  19: {
    id: 19,
    name: 'Traditional Indian Heritage',
    price: 2699,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 23,
    description: 'A beautiful traditional Indian heritage carpet that celebrates rich cultural traditions. Handwoven with intricate patterns and premium silk, this piece brings authentic Indian artistry to your home.',
    features: [
      'Indian Heritage Design',
      'Premium Silk',
      'Traditional Patterns',
      'Cultural Authenticity',
      'Free Shipping',
    ],
    dimensions: ['6ft x 9ft', '8ft x 10ft', '9ft x 12ft'],
    material: ['Silk', 'Premium Wool'],
    variants: {
      '6ft x 9ft|Silk': { price: 2299, originalPrice: null, available: true },
      '6ft x 9ft|Premium Wool': { price: 1999, originalPrice: null, available: true },
      '8ft x 10ft|Silk': { price: 2699, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 2399, originalPrice: null, available: false },
      '9ft x 12ft|Silk': { price: 3099, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 2799, originalPrice: null, available: true },
    },
    origin: 'India',
    category: 'Traditional',
  },
  20: {
    id: 20,
    name: 'Persian Garden Paradise',
    price: 2999,
    originalPrice: null,
    images: [
      'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 19,
    description: 'A stunning Persian carpet inspired by garden paradise motifs. This beautiful piece features floral patterns and garden scenes that bring nature\'s beauty into your home.',
    features: [
      'Garden Paradise Design',
      'Premium Wool',
      'Floral Patterns',
      'Nature-Inspired',
      'Free Shipping',
    ],
    dimensions: ['8ft x 10ft', '9ft x 12ft', '10ft x 14ft'],
    material: ['Premium Wool', 'Silk'],
    variants: {
      '8ft x 10ft|Premium Wool': { price: 2599, originalPrice: null, available: true },
      '8ft x 10ft|Silk': { price: 2999, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 2999, originalPrice: null, available: true },
      '9ft x 12ft|Silk': { price: 3399, originalPrice: null, available: false },
      '10ft x 14ft|Premium Wool': { price: 3399, originalPrice: null, available: true },
      '10ft x 14ft|Silk': { price: 3799, originalPrice: null, available: true },
    },
    origin: 'Iran',
    category: 'Persian',
  },
  21: {
    id: 21,
    name: 'Oriental Dragon Design',
    price: 3499,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 5,
    reviews: 25,
    description: 'An extraordinary Oriental carpet featuring majestic dragon designs. This luxurious silk piece showcases traditional Oriental artistry with powerful symbolic motifs.',
    features: [
      'Dragon Design',
      'Luxury Silk',
      'Traditional Oriental Art',
      'Symbolic Motifs',
      'Lifetime Warranty',
    ],
    dimensions: ['8ft x 10ft', '9ft x 12ft', '10ft x 14ft', '12ft x 15ft'],
    material: ['Silk', 'Premium Wool'],
    variants: {
      '8ft x 10ft|Silk': { price: 2999, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 2599, originalPrice: null, available: true },
      '9ft x 12ft|Silk': { price: 3399, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 2999, originalPrice: null, available: false },
      '10ft x 14ft|Silk': { price: 3799, originalPrice: null, available: true },
      '10ft x 14ft|Premium Wool': { price: 3399, originalPrice: null, available: true },
      '12ft x 15ft|Silk': { price: 4499, originalPrice: null, available: true },
      '12ft x 15ft|Premium Wool': { price: 4099, originalPrice: null, available: true },
    },
    origin: 'China',
    category: 'Oriental',
  },
  22: {
    id: 22,
    name: 'Eco-Friendly Jute Natural',
    price: 799,
    originalPrice: 999,
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4,
    reviews: 42,
    description: 'An eco-friendly natural jute carpet that combines sustainability with style. Perfect for environmentally conscious homes seeking natural materials and contemporary design.',
    features: [
      'Eco-Friendly Material',
      'Natural Jute',
      'Sustainable Design',
      'Contemporary Style',
      'Free Shipping',
    ],
    dimensions: ['5ft x 8ft', '6ft x 9ft', '8ft x 10ft'],
    material: ['Jute', 'Cotton'],
    variants: {
      '5ft x 8ft|Jute': { price: 599, originalPrice: 799, available: true },
      '5ft x 8ft|Cotton': { price: 699, originalPrice: 899, available: true },
      '6ft x 9ft|Jute': { price: 799, originalPrice: 999, available: true },
      '6ft x 9ft|Cotton': { price: 899, originalPrice: 1099, available: false },
      '8ft x 10ft|Jute': { price: 999, originalPrice: 1199, available: true },
      '8ft x 10ft|Cotton': { price: 1099, originalPrice: 1299, available: true },
    },
    origin: 'India',
    category: 'Contemporary',
  },
  23: {
    id: 23,
    name: 'Bamboo Fiber Modern',
    price: 1099,
    originalPrice: 1399,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4,
    reviews: 33,
    description: 'A modern carpet made from sustainable bamboo fiber. This eco-friendly option offers durability, natural beauty, and contemporary design for modern living spaces.',
    features: [
      'Bamboo Fiber',
      'Eco-Friendly',
      'Modern Design',
      'Sustainable Material',
      'Free Shipping',
    ],
    dimensions: ['5ft x 8ft', '6ft x 9ft', '8ft x 10ft'],
    material: ['Bamboo', 'Synthetic'],
    variants: {
      '5ft x 8ft|Bamboo': { price: 799, originalPrice: 1099, available: true },
      '5ft x 8ft|Synthetic': { price: 699, originalPrice: 999, available: true },
      '6ft x 9ft|Bamboo': { price: 1099, originalPrice: 1399, available: true },
      '6ft x 9ft|Synthetic': { price: 999, originalPrice: 1299, available: false },
      '8ft x 10ft|Bamboo': { price: 1399, originalPrice: 1699, available: true },
      '8ft x 10ft|Synthetic': { price: 1299, originalPrice: 1599, available: true },
    },
    origin: 'China',
    category: 'Modern',
  },
  24: {
    id: 24,
    name: 'Viscose Soft Touch',
    price: 999,
    originalPrice: 1299,
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4,
    reviews: 27,
    description: 'A soft and luxurious viscose carpet that offers exceptional comfort underfoot. The smooth texture and contemporary design make it perfect for modern homes.',
    features: [
      'Soft Viscose Material',
      'Luxurious Feel',
      'Contemporary Design',
      'Comfortable Underfoot',
      'Free Shipping',
    ],
    dimensions: ['5ft x 8ft', '6ft x 9ft', '8ft x 10ft'],
    material: ['Viscose', 'Cotton'],
    variants: {
      '5ft x 8ft|Viscose': { price: 749, originalPrice: 1049, available: true },
      '5ft x 8ft|Cotton': { price: 699, originalPrice: 999, available: true },
      '6ft x 9ft|Viscose': { price: 999, originalPrice: 1299, available: true },
      '6ft x 9ft|Cotton': { price: 949, originalPrice: 1249, available: false },
      '8ft x 10ft|Viscose': { price: 1249, originalPrice: 1549, available: true },
      '8ft x 10ft|Cotton': { price: 1199, originalPrice: 1499, available: true },
    },
    origin: 'USA',
    category: 'Contemporary',
  },
  25: {
    id: 25,
    name: 'Classic Victorian Style',
    price: 2799,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 21,
    description: 'A classic Victorian-style carpet that captures the elegance of the Victorian era. This luxurious piece features ornate patterns and premium wool construction.',
    features: [
      'Victorian Design',
      'Premium Wool',
      'Ornate Patterns',
      'Era-Inspired Elegance',
      'Free Shipping',
    ],
    dimensions: ['6ft x 9ft', '8ft x 10ft', '9ft x 12ft'],
    material: ['Wool', 'Premium Wool'],
    variants: {
      '6ft x 9ft|Wool': { price: 2399, originalPrice: null, available: true },
      '6ft x 9ft|Premium Wool': { price: 2599, originalPrice: null, available: true },
      '8ft x 10ft|Wool': { price: 2799, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 2999, originalPrice: null, available: false },
      '9ft x 12ft|Wool': { price: 3199, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 3399, originalPrice: null, available: true },
    },
    origin: 'United Kingdom',
    category: 'Classic',
  },
  26: {
    id: 26,
    name: 'Luxury Cashmere Blend',
    price: 5299,
    originalPrice: null,
    images: [
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 5,
    reviews: 11,
    description: 'The ultimate luxury carpet featuring a premium cashmere blend. This exclusive piece offers unparalleled softness and opulence, making it the perfect centerpiece for luxury interiors.',
    features: [
      'Cashmere Blend',
      'Ultimate Luxury',
      'Unparalleled Softness',
      'Exclusive Collection',
      'Lifetime Warranty',
    ],
    dimensions: ['9ft x 12ft', '10ft x 14ft', '12ft x 15ft'],
    material: ['Premium Wool', 'Silk'],
    variants: {
      '9ft x 12ft|Premium Wool': { price: 4799, originalPrice: null, available: true },
      '9ft x 12ft|Silk': { price: 5299, originalPrice: null, available: true },
      '10ft x 14ft|Premium Wool': { price: 5299, originalPrice: null, available: true },
      '10ft x 14ft|Silk': { price: 5799, originalPrice: null, available: false },
      '12ft x 15ft|Premium Wool': { price: 5999, originalPrice: null, available: true },
      '12ft x 15ft|Silk': { price: 6499, originalPrice: null, available: true },
    },
    origin: 'Mongolia',
    category: 'Luxury',
  },
  27: {
    id: 27,
    name: 'Handmade Tribal Patterns',
    price: 2299,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1581558714049-220f0d812879?q=80&w=3401&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4,
    reviews: 18,
    description: 'A unique handmade carpet featuring authentic tribal patterns. This piece celebrates traditional tribal artistry with bold geometric designs and natural wool construction.',
    features: [
      'Tribal Patterns',
      'Handmade Craftsmanship',
      'Authentic Designs',
      'Natural Wool',
      'Free Shipping',
    ],
    dimensions: ['5ft x 8ft', '6ft x 9ft', '8ft x 10ft'],
    material: ['Wool', 'Premium Wool'],
    variants: {
      '5ft x 8ft|Wool': { price: 1899, originalPrice: null, available: true },
      '5ft x 8ft|Premium Wool': { price: 2099, originalPrice: null, available: true },
      '6ft x 9ft|Wool': { price: 2099, originalPrice: null, available: true },
      '6ft x 9ft|Premium Wool': { price: 2299, originalPrice: null, available: false },
      '8ft x 10ft|Wool': { price: 2499, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 2699, originalPrice: null, available: true },
    },
    origin: 'Morocco',
    category: 'Handmade',
  },
  28: {
    id: 28,
    name: 'Vintage Floral Elegance',
    price: 2599,
    originalPrice: null,
    images: [
      'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 26,
    description: 'A beautiful vintage carpet featuring elegant floral patterns. This silk masterpiece combines vintage charm with timeless elegance, perfect for classic interiors.',
    features: [
      'Floral Patterns',
      'Vintage Design',
      'Luxury Silk',
      'Timeless Elegance',
      'Free Shipping',
    ],
    dimensions: ['8ft x 10ft', '9ft x 12ft', '10ft x 14ft'],
    material: ['Silk', 'Premium Wool'],
    variants: {
      '8ft x 10ft|Silk': { price: 2299, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 1999, originalPrice: null, available: true },
      '9ft x 12ft|Silk': { price: 2599, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 2299, originalPrice: null, available: false },
      '10ft x 14ft|Silk': { price: 2899, originalPrice: null, available: true },
      '10ft x 14ft|Premium Wool': { price: 2599, originalPrice: null, available: true },
    },
    origin: 'France',
    category: 'Vintage',
  },
  29: {
    id: 29,
    name: 'Persian Medallion Classic',
    price: 3199,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1581558714049-220f0d812879?q=80&w=3401&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 30,
    description: 'A classic Persian carpet featuring traditional medallion patterns. This premium piece showcases authentic Persian design with intricate medallion motifs and premium wool construction.',
    features: [
      'Medallion Design',
      'Premium Wool',
      'Classic Persian Patterns',
      'Authentic Craftsmanship',
      'Lifetime Warranty',
    ],
    dimensions: ['6ft x 9ft', '8ft x 10ft', '9ft x 12ft'],
    material: ['Premium Wool', 'Silk'],
    variants: {
      '6ft x 9ft|Premium Wool': { price: 2699, originalPrice: null, available: true },
      '6ft x 9ft|Silk': { price: 2999, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 3099, originalPrice: null, available: true },
      '8ft x 10ft|Silk': { price: 3399, originalPrice: null, available: false },
      '9ft x 12ft|Premium Wool': { price: 3499, originalPrice: null, available: true },
      '9ft x 12ft|Silk': { price: 3799, originalPrice: null, available: true },
    },
    origin: 'Iran',
    category: 'Persian',
  },
  30: {
    id: 30,
    name: 'Oriental Cherry Blossom',
    price: 2899,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5,
    reviews: 22,
    description: 'A stunning Oriental carpet featuring delicate cherry blossom patterns. This elegant silk piece captures the beauty of spring with intricate floral designs and luxurious materials.',
    features: [
      'Cherry Blossom Design',
      'Luxury Silk',
      'Floral Patterns',
      'Spring-Inspired',
      'Free Shipping',
    ],
    dimensions: ['6ft x 9ft', '8ft x 10ft', '9ft x 12ft'],
    material: ['Silk', 'Premium Wool'],
    variants: {
      '6ft x 9ft|Silk': { price: 2499, originalPrice: null, available: true },
      '6ft x 9ft|Premium Wool': { price: 2199, originalPrice: null, available: true },
      '8ft x 10ft|Silk': { price: 2899, originalPrice: null, available: true },
      '8ft x 10ft|Premium Wool': { price: 2599, originalPrice: null, available: false },
      '9ft x 12ft|Silk': { price: 3299, originalPrice: null, available: true },
      '9ft x 12ft|Premium Wool': { price: 2999, originalPrice: null, available: true },
    },
    origin: 'Japan',
    category: 'Oriental',
  },
}

// Similar products data (matching products from ProductGrid)
const allProducts: SimilarProduct[] = [
  {
    id: 2,
    name: 'Elegant Oriental Classic',
    price: 1899,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 18,
    category: 'Oriental',
    material: 'Silk',
  },
  {
    id: 3,
    name: 'Modern Luxury Wool',
    price: 1599,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 32,
    category: 'Modern',
    material: 'Wool',
  },
  {
    id: 4,
    name: 'Traditional Silk Elegance',
    price: 3299,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 15,
    category: 'Traditional',
    material: 'Silk',
  },
  {
    id: 5,
    name: 'Vintage Persian Heritage',
    price: 2799,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 28,
    category: 'Persian',
    material: 'Premium Wool',
  },
  {
    id: 6,
    name: 'Contemporary Geometric',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 21,
    category: 'Modern',
    material: 'Synthetic',
  },
  {
    id: 7,
    name: 'Classic Oriental Pattern',
    price: 2199,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 19,
    category: 'Oriental',
    material: 'Wool',
  },
  {
    id: 8,
    name: 'Premium Wool Collection',
    price: 1699,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 26,
    category: 'Wool',
    material: 'Wool',
  },
  {
    id: 9,
    name: 'Luxury Persian Silk',
    price: 3499,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 12,
    category: 'Persian',
    material: 'Silk',
  },
  {
    id: 10,
    name: 'Modern Synthetic Blend',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 35,
    category: 'Modern',
    material: 'Synthetic',
  },
  {
    id: 11,
    name: 'Traditional Wool Classic',
    price: 1999,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 22,
    category: 'Traditional',
    material: 'Wool',
  },
  {
    id: 12,
    name: 'Oriental Premium Collection',
    price: 2899,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 16,
    category: 'Oriental',
    material: 'Premium Wool',
  },
  {
    id: 13,
    name: 'Contemporary Minimalist Design',
    price: 1199,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 28,
    category: 'Contemporary',
    material: 'Synthetic',
  },
  {
    id: 14,
    name: 'Vintage Antique Persian',
    price: 3999,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 31,
    category: 'Vintage',
    material: 'Premium Wool',
  },
  {
    id: 15,
    name: 'Classic European Elegance',
    price: 2399,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 20,
    category: 'Classic',
    material: 'Wool',
  },
  {
    id: 16,
    name: 'Luxury Handwoven Masterpiece',
    price: 4599,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 14,
    category: 'Luxury',
    material: 'Silk',
  },
  {
    id: 17,
    name: 'Handmade Artisan Collection',
    price: 3199,
    originalPrice: 3799,
    image: 'https://images.unsplash.com/photo-1581558714049-220f0d812879?q=80&w=3401&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 17,
    category: 'Handmade',
    material: 'Premium Wool',
  },
  {
    id: 18,
    name: 'Modern Abstract Patterns',
    price: 1399,
    originalPrice: 1799,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 29,
    category: 'Modern',
    material: 'Cotton',
  },
  {
    id: 19,
    name: 'Traditional Indian Heritage',
    price: 2699,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 23,
    category: 'Traditional',
    material: 'Silk',
  },
  {
    id: 20,
    name: 'Persian Garden Paradise',
    price: 2999,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 19,
    category: 'Persian',
    material: 'Premium Wool',
  },
  {
    id: 21,
    name: 'Oriental Dragon Design',
    price: 3499,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 25,
    category: 'Oriental',
    material: 'Silk',
  },
  {
    id: 22,
    name: 'Eco-Friendly Jute Natural',
    price: 799,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 42,
    category: 'Contemporary',
    material: 'Jute',
  },
  {
    id: 23,
    name: 'Bamboo Fiber Modern',
    price: 1099,
    originalPrice: 1399,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 33,
    category: 'Modern',
    material: 'Bamboo',
  },
  {
    id: 24,
    name: 'Viscose Soft Touch',
    price: 999,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4,
    reviews: 27,
    category: 'Contemporary',
    material: 'Viscose',
  },
  {
    id: 25,
    name: 'Classic Victorian Style',
    price: 2799,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 21,
    category: 'Classic',
    material: 'Wool',
  },
  {
    id: 26,
    name: 'Luxury Cashmere Blend',
    price: 5299,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725456680425-2a1793ada19b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 11,
    category: 'Luxury',
    material: 'Premium Wool',
  },
  {
    id: 27,
    name: 'Handmade Tribal Patterns',
    price: 2299,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1581558714049-220f0d812879?q=80&w=3401&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4,
    reviews: 18,
    category: 'Handmade',
    material: 'Wool',
  },
  {
    id: 28,
    name: 'Vintage Floral Elegance',
    price: 2599,
    originalPrice: null,
    image: 'https://plus.unsplash.com/premium_photo-1725570022160-85be45dc63f7?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 26,
    category: 'Vintage',
    material: 'Silk',
  },
  {
    id: 29,
    name: 'Persian Medallion Classic',
    price: 3199,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1581558714049-220f0d812879?q=80&w=3401&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 5,
    reviews: 30,
    category: 'Persian',
    material: 'Premium Wool',
  },
  {
    id: 30,
    name: 'Oriental Cherry Blossom',
    price: 2899,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5,
    reviews: 22,
    category: 'Oriental',
    material: 'Silk',
  },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products[parseInt(params.id)]
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const thumbnailScrollRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  
  // State for dimension and material selection
  const [selectedDimension, setSelectedDimension] = useState<string>('')
  const [selectedMaterial, setSelectedMaterial] = useState<string>('')
  const [addedToCart, setAddedToCart] = useState(false)

  // Touch/swipe gesture state for carousel
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [hasDragged, setHasDragged] = useState(false)

  if (!product) {
    notFound()
  }

  // Initialize selected dimension and material with first available options
  useEffect(() => {
    if (product.dimensions.length > 0 && !selectedDimension) {
      setSelectedDimension(product.dimensions[0])
    }
    if (product.material.length > 0 && !selectedMaterial) {
      setSelectedMaterial(product.material[0])
    }
  }, [product.dimensions, product.material, selectedDimension, selectedMaterial])

  // Get current variant based on selected dimension and material
  const currentVariant = useMemo(() => {
    if (!selectedDimension || !selectedMaterial) return null
    const variantKey = `${selectedDimension}|${selectedMaterial}`
    return product.variants[variantKey] || null
  }, [selectedDimension, selectedMaterial, product.variants])

  // Get current price and original price
  const currentPrice = currentVariant?.price ?? product.price
  const currentOriginalPrice = currentVariant?.originalPrice ?? product.originalPrice
  const isAvailable = currentVariant?.available ?? true

  // Check if a combination is available
  const isCombinationAvailable = useCallback((dimension: string, material: string) => {
    const variantKey = `${dimension}|${material}`
    const variant = product.variants[variantKey]
    return variant?.available ?? false
  }, [product.variants])

  // Find similar products based on category or material
  const similarProducts = useMemo(() => {
    return allProducts
      .filter(p => p.id !== product.id && (
        p.category === product.category || 
        product.material.includes(p.material)
      ))
  }, [product.id, product.category, product.material])

  // Carousel configuration - responsive products per view
  const getProductsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 4 // xl: 4 products
      if (window.innerWidth >= 1024) return 3 // lg: 3 products
      if (window.innerWidth >= 640) return 2 // sm: 2 products
      return 1 // mobile: 1 product
    }
    return 4 // default
  }

  const [productsPerView, setProductsPerView] = useState(4)

  // Update products per view on window resize
  useEffect(() => {
    const updateProductsPerView = () => {
      const newProductsPerView = getProductsPerView()
      setProductsPerView(newProductsPerView)
      // For circular carousel, wrap index if needed after resize
      const newMaxIndex = Math.max(0, similarProducts.length - newProductsPerView)
      setCarouselIndex(prev => {
        // Wrap to valid range if out of bounds
        if (prev > newMaxIndex) {
          return newMaxIndex
        }
        return prev
      })
    }
    updateProductsPerView()
    window.addEventListener('resize', updateProductsPerView)
    return () => window.removeEventListener('resize', updateProductsPerView)
  }, [similarProducts.length])

  const maxIndex = similarProducts.length <= productsPerView 
    ? 0 
    : Math.max(0, similarProducts.length - productsPerView)
  
  useEffect(() => {
    if (carouselIndex < 0) {
      setCarouselIndex(0)
    } else if (carouselIndex > maxIndex && maxIndex >= 0) {
      setCarouselIndex(maxIndex)
    }
  }, [maxIndex, carouselIndex])

  const handlePrev = () => {
    setCarouselIndex(prev => {
      if (maxIndex === 0 || similarProducts.length <= productsPerView) {
        return 0
      }
      if (prev <= 0) {
        return maxIndex
      }
      return prev - 1
    })
  }

  const handleNext = () => {
    setCarouselIndex(prev => {
      if (maxIndex === 0 || similarProducts.length <= productsPerView) {
        return 0
      }
      if (prev >= maxIndex) {
        return 0
      }
      return prev + 1
    })
  }

  // Touch/swipe handlers for carousel
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(true)
    setDragOffset(0)
    setHasDragged(false)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return
    
    const currentTouch = e.targetTouches[0].clientX
    const distance = touchStart - currentTouch
    setTouchEnd(currentTouch)
    setDragOffset(distance)
    
    // Mark as dragged if movement is significant
    if (Math.abs(distance) > 10) {
      setHasDragged(true)
      e.preventDefault()
    }
  }

  const onTouchEnd = () => {
    const wasDragging = hasDragged
    
    if (!touchStart || !touchEnd) {
      setIsDragging(false)
      setDragOffset(0)
      // Reset hasDragged after a short delay to allow click handlers to check it
      setTimeout(() => setHasDragged(false), 100)
      return
    }

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }

    setTouchStart(null)
    setTouchEnd(null)
    setIsDragging(false)
    setDragOffset(0)
    // Reset hasDragged after a short delay to allow click handlers to check it
    setTimeout(() => setHasDragged(false), 100)
  }

  // Mouse drag handlers for desktop
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [isMouseDown, setIsMouseDown] = useState(false)

  const onMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true)
    setMouseStart(e.clientX)
    setDragOffset(0)
    setHasDragged(false)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !mouseStart) return
    
    const distance = mouseStart - e.clientX
    setDragOffset(distance)
    
    // Mark as dragged if movement is significant
    if (Math.abs(distance) > 10) {
      setHasDragged(true)
    }
  }

  const onMouseUp = () => {
    if (!mouseStart) {
      setIsMouseDown(false)
      setDragOffset(0)
      setTimeout(() => setHasDragged(false), 100)
      return
    }

    const distance = dragOffset
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }

    setMouseStart(null)
    setIsMouseDown(false)
    setDragOffset(0)
    setTimeout(() => setHasDragged(false), 100)
  }

  const onMouseLeave = () => {
    if (isMouseDown) {
      setMouseStart(null)
      setIsMouseDown(false)
      setDragOffset(0)
      setTimeout(() => setHasDragged(false), 100)
    }
  }

  // Check scroll position for thumbnail navigation
  const checkScrollPosition = useCallback(() => {
    if (thumbnailScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailScrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  // Scroll thumbnail container
  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailScrollRef.current) {
      const scrollAmount = 144
      const newScrollLeft = thumbnailScrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      thumbnailScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  // Update scroll position when selected image changes
  useEffect(() => {
    if (thumbnailScrollRef.current && product.images.length > 3) {
      const thumbnailWidth = 144 // 128px + 16px gap
      const containerWidth = thumbnailScrollRef.current.clientWidth
      const selectedThumbnailLeft = selectedImageIndex * thumbnailWidth
      const selectedThumbnailRight = selectedThumbnailLeft + thumbnailWidth
      const currentScrollLeft = thumbnailScrollRef.current.scrollLeft
      const currentScrollRight = currentScrollLeft + containerWidth

      if (selectedThumbnailLeft < currentScrollLeft) {
        // Selected image is to the left, scroll to show it
        thumbnailScrollRef.current.scrollTo({
          left: selectedThumbnailLeft - 16, // Add some padding
          behavior: 'smooth'
        })
      } else if (selectedThumbnailRight > currentScrollRight) {
        // Selected image is to the right, scroll to show it
        thumbnailScrollRef.current.scrollTo({
          left: selectedThumbnailRight - containerWidth + 16, // Add some padding
          behavior: 'smooth'
        })
      }
    }
  }, [selectedImageIndex, product.images.length])

  // Check scroll position on mount and when images change
  useEffect(() => {
    if (product.images.length > 3) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        checkScrollPosition()
      }, 100)
      
      if (thumbnailScrollRef.current) {
        thumbnailScrollRef.current.addEventListener('scroll', checkScrollPosition)
        window.addEventListener('resize', checkScrollPosition)
        return () => {
          if (thumbnailScrollRef.current) {
            thumbnailScrollRef.current.removeEventListener('scroll', checkScrollPosition)
          }
          window.removeEventListener('resize', checkScrollPosition)
        }
      }
    }
  }, [product.images.length, checkScrollPosition])

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-96 lg:h-[600px] rounded-xl overflow-hidden">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 3 ? (
              <div className="relative">
                <div 
                  ref={thumbnailScrollRef}
                  className="overflow-x-auto scrollbar-hide"
                  onScroll={checkScrollPosition}
                >
                  <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-32 w-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          selectedImageIndex === index
                            ? 'border-gold-500 ring-2 ring-gold-200'
                            : 'border-transparent hover:border-royal-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                {/* Navigation Buttons */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollThumbnails('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-royal-50 transition-all duration-300 hover:scale-110"
                    aria-label="Scroll left"
                  >
                    <FiChevronLeft className="w-5 h-5 text-royal-900" />
                  </button>
                )}
                {canScrollRight && (
                  <button
                    onClick={() => scrollThumbnails('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-royal-50 transition-all duration-300 hover:scale-110"
                    aria-label="Scroll right"
                  >
                    <FiChevronRight className="w-5 h-5 text-royal-900" />
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-32 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? 'border-gold-500 ring-2 ring-gold-200'
                        : 'border-transparent hover:border-royal-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-royal-900 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < product.rating
                        ? 'text-gold-500'
                        : 'text-royal-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-royal-600">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-royal-900">
                  {formatPrice(currentPrice)}
                </span>
                {currentOriginalPrice && (
                  <>
                    <span className="text-2xl text-royal-500 line-through">
                      {formatPrice(currentOriginalPrice)}
                    </span>
                    <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Save {formatPrice(currentOriginalPrice - currentPrice)}
                    </span>
                  </>
                )}
              </div>
              {!isAvailable && (
                <div className="flex items-center gap-2 text-red-600 mt-2">
                  <FiAlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">This combination is not available</span>
                </div>
              )}
            </div>

            {/* Dimension and Material Selection */}
            <div className="mb-8 space-y-4">
              {/* Dimension Selection */}
              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-2">
                  Select Dimension
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.dimensions.map((dimension) => {
                    const isSelected = selectedDimension === dimension
                    const isDisabled = !product.material.some(material => 
                      isCombinationAvailable(dimension, material)
                    )
                    return (
                      <button
                        key={dimension}
                        onClick={() => {
                          setSelectedDimension(dimension)
                          // Auto-select first available material for this dimension
                          const availableMaterial = product.material.find(material => 
                            isCombinationAvailable(dimension, material)
                          )
                          if (availableMaterial) {
                            setSelectedMaterial(availableMaterial)
                          }
                        }}
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isSelected
                            ? 'bg-gold-500 text-white ring-2 ring-gold-200'
                            : isDisabled
                            ? 'bg-royal-100 text-royal-400 cursor-not-allowed'
                            : 'bg-royal-100 text-royal-700 hover:bg-royal-200'
                        }`}
                      >
                        {dimension}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Material Selection */}
              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-2">
                  Select Material
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.material.map((material) => {
                    const isSelected = selectedMaterial === material
                    const isDisabled = !isCombinationAvailable(selectedDimension, material)
                    return (
                      <button
                        key={material}
                        onClick={() => setSelectedMaterial(material)}
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isSelected
                            ? 'bg-gold-500 text-white ring-2 ring-gold-200'
                            : isDisabled
                            ? 'bg-royal-100 text-royal-400 cursor-not-allowed'
                            : 'bg-royal-100 text-royal-700 hover:bg-royal-200'
                        }`}
                      >
                        {material}
                        {isDisabled && (
                          <span className="ml-2 text-xs">(Not Available)</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-royal-900 mb-4">Description</h3>
              <p className="text-royal-700 leading-relaxed mb-4">
                {product.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-royal-600">Selected Dimension:</span>
                  <span className="ml-2 font-medium text-royal-900">{selectedDimension || 'Not selected'}</span>
                </div>
                <div>
                  <span className="text-royal-600">Selected Material:</span>
                  <span className="ml-2 font-medium text-royal-900">{selectedMaterial || 'Not selected'}</span>
                </div>
                <div>
                  <span className="text-royal-600">Origin:</span>
                  <span className="ml-2 font-medium text-royal-900">{product.origin}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-royal-900 mb-4">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-royal-700">
                    <FiCheck className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => {
                  if (isAvailable && selectedDimension && selectedMaterial) {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: currentPrice,
                      originalPrice: currentOriginalPrice,
                      image: product.images[0],
                      dimension: selectedDimension,
                      material: selectedMaterial,
                    })
                    setAddedToCart(true)
                    setTimeout(() => setAddedToCart(false), 2000)
                  }
                }}
                disabled={!isAvailable || !selectedDimension || !selectedMaterial}
                className={`btn-secondary flex-1 flex items-center justify-center gap-2 ${
                  !isAvailable || !selectedDimension || !selectedMaterial
                    ? 'opacity-50 cursor-not-allowed'
                    : addedToCart
                    ? 'bg-gold-600'
                    : ''
                }`}
              >
                <FiShoppingCart className="w-5 h-5" />
                {addedToCart ? 'Added to Cart!' : !isAvailable ? 'Combination Not Available' : 'Add to Cart'}
              </button>
              <button className="px-6 py-3 border-2 border-royal-800 text-royal-800 rounded-lg font-semibold hover:bg-royal-50 transition-colors duration-300 flex items-center justify-center gap-2">
                <FiHeart className="w-5 h-5" />
                Wishlist
              </button>
            </div>

            <div className="bg-royal-50 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <FiTruck className="w-6 h-6 text-gold-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-royal-900 mb-1">Free Shipping</h4>
                  <p className="text-sm text-royal-600">On orders over $500</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiShield className="w-6 h-6 text-gold-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-royal-900 mb-1">Lifetime Warranty</h4>
                  <p className="text-sm text-royal-600">Quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-royal-200">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-royal-900 mb-8 text-center">
              Similar Products
            </h2>
            <div className="relative max-w-7xl mx-auto">
              {/* Carousel Container */}
              <div className="overflow-hidden px-4">
                <div
                  ref={carouselRef}
                  className="flex transition-transform duration-500 ease-in-out select-none"
                  style={{
                    transform: `translateX(calc(-${carouselIndex} * (100% + 1rem) / ${productsPerView} + ${dragOffset}px))`,
                    transitionDuration: isDragging || isMouseDown ? '0ms' : '500ms',
                    cursor: isMouseDown ? 'grabbing' : (similarProducts.length > productsPerView ? 'grab' : 'default'),
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                  }}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseLeave}
                >
                  {similarProducts.map((similarProduct, index) => {
                    const gapCount = productsPerView - 1
                    const itemWidth = `calc((100% - ${gapCount}rem) / ${productsPerView})`
                    return (
                      <div
                        key={similarProduct.id}
                        className="flex-shrink-0"
                        style={{ 
                          width: itemWidth,
                          marginRight: index < similarProducts.length - 1 ? '1rem' : '0',
                          minWidth: '200px',
                          maxWidth: '280px',
                        }}
                      >
                      <Link
                        href={`/products/${similarProduct.id}`}
                        className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block h-full"
                        onClick={(e) => {
                          // Prevent navigation if user was dragging/swiping
                          if (hasDragged || isDragging || isMouseDown) {
                            e.preventDefault()
                            e.stopPropagation()
                          }
                        }}
                      >
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={similarProduct.image}
                            alt={similarProduct.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {similarProduct.originalPrice && (
                            <span className="absolute top-2 right-2 bg-gold-500 text-white px-2 py-1 rounded text-xs font-semibold">
                              Save {formatPrice(similarProduct.originalPrice - similarProduct.price)}
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-royal-900 mb-2 group-hover:text-gold-600 transition-colors">
                            {similarProduct.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < similarProduct.rating
                                      ? 'text-gold-500'
                                      : 'text-royal-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-royal-600">
                              ({similarProduct.reviews})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-royal-900">
                              {formatPrice(similarProduct.price)}
                            </span>
                            {similarProduct.originalPrice && (
                              <span className="text-sm text-royal-500 line-through">
                                {formatPrice(similarProduct.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                    )
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              {similarProducts.length > productsPerView && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-royal-50 transition-all duration-300 opacity-100 hover:scale-110"
                    aria-label="Previous products"
                  >
                    <FiChevronLeft className="w-6 h-6 text-royal-900" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-royal-50 transition-all duration-300 opacity-100 hover:scale-110"
                    aria-label="Next products"
                  >
                    <FiChevronRight className="w-6 h-6 text-royal-900" />
                  </button>
                </>
              )}

              {/* Carousel Indicators */}
              {similarProducts.length > productsPerView && maxIndex > 0 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: maxIndex + 1 }).map((_, index) => {
                    // For circular carousel, show current position relative to total slides
                    const isActive = carouselIndex === index
                    return (
                      <button
                        key={index}
                        onClick={() => setCarouselIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isActive
                            ? 'w-8 bg-gold-500'
                            : 'w-2 bg-royal-300 hover:bg-royal-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
