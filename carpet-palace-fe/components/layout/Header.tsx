'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiMenu, FiX, FiShoppingCart, FiPackage, FiSearch } from 'react-icons/fi'
import { useCart } from '@/contexts/CartContext'
import SpotlightSearch from '@/components/search/SpotlightSearch'
import CurrencySelector from '@/components/CurrencySelector'
import { getSearchShortcut } from '@/utils/platform'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchShortcut, setSearchShortcut] = useState('⌘K')
  const { getTotalItems } = useCart()
  const cartCount = getTotalItems()

  // Get OS-appropriate shortcut on mount
  useEffect(() => {
    setSearchShortcut(getSearchShortcut())
  }, [])

  // Keyboard shortcut handler (Cmd+K or Cmd+Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      // Cmd+K (Mac) / Ctrl+K (Windows/Linux) - preferred shortcut
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setIsSearchOpen(prev => !prev)
      }
      // Cmd+Space (Mac) / Ctrl+Space (Windows/Linux) - alternative
      // Note: On Mac, Cmd+Space is system shortcut, so we use Ctrl+Space as fallback
      if ((e.ctrlKey && !e.metaKey) && e.key === ' ') {
        e.preventDefault()
        setIsSearchOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearchIconClick = () => {
    setIsSearchOpen(true)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 relative rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Carpet Palace Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-elegant italic text-2xl font-bold text-royal-900">
              Carpet Palace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-royal-700 hover:text-royal-900 font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Currency Selector - Desktop only */}
            <div className="hidden md:block">
              <CurrencySelector />
            </div>
            {/* Search */}
            <button 
              onClick={handleSearchIconClick}
              className="p-2 text-royal-700 hover:text-royal-900 transition-colors relative group"
              aria-label="Search"
              title={`Search (${searchShortcut})`}
            >
              <FiSearch className="w-5 h-5" />
              {/* Keyboard shortcut hint */}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Press {searchShortcut}
              </span>
            </button>
            <Link
              href="/cart"
              className="p-2 text-royal-700 hover:text-royal-900 transition-colors relative"
            >
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Track Order - Desktop only */}
            <Link
              href="/track-order"
              className="hidden md:block p-2 text-royal-700 hover:text-royal-900 transition-colors"
              title="Track Order"
            >
              <FiPackage className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-royal-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-royal-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-royal-700 hover:text-royal-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile-only items */}
            <div className="pt-4 mt-4 border-t border-royal-200">
              {/* Currency Selector in Mobile Menu */}
              <div className="px-2 py-2">
                <div className="text-xs font-semibold text-royal-600 uppercase tracking-wide mb-2">
                  Country & Currency
                </div>
                <CurrencySelector />
              </div>
              
              {/* Track Order in Mobile Menu */}
              <Link
                href="/track-order"
                className="flex items-center gap-3 py-2 text-royal-700 hover:text-royal-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiPackage className="w-5 h-5" />
                <span>Track Order</span>
              </Link>
            </div>
          </nav>
        )}
      </div>

      {/* Spotlight Search Modal */}
      <SpotlightSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
