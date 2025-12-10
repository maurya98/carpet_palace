'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice: number | null
  image: string
  dimension: string
  material: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: number, dimension: string, material: string) => void
  updateQuantity: (id: number, dimension: string, material: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCartItems(parsedCart)
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isLoaded])

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      // Check if item with same id, dimension, and material already exists
      const existingItemIndex = prev.findIndex(
        cartItem =>
          cartItem.id === item.id &&
          cartItem.dimension === item.dimension &&
          cartItem.material === item.material
      )

      if (existingItemIndex >= 0) {
        // If exists, increase quantity
        const updated = [...prev]
        updated[existingItemIndex].quantity += 1
        return updated
      } else {
        // If not exists, add new item with quantity 1
        return [...prev, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: number, dimension: string, material: string) => {
    setCartItems(prev =>
      prev.filter(
        item =>
          !(item.id === id && item.dimension === dimension && item.material === material)
      )
    )
  }

  const updateQuantity = (id: number, dimension: string, material: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, dimension, material)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.dimension === dimension && item.material === material
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
