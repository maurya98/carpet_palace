import Link from 'next/link'
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-royal-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold">CP</span>
              </div>
              <span className="font-serif text-xl font-bold">Carpet Palace</span>
            </div>
            <p className="text-royal-300 mb-4">
              Your destination for luxury carpets and rugs. Handcrafted excellence since 1985.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-royal-300 hover:text-gold-400 transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-royal-300 hover:text-gold-400 transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-royal-300 hover:text-gold-400 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-royal-300 hover:text-gold-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-royal-300 hover:text-gold-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-royal-300 hover:text-gold-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-royal-300 hover:text-gold-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-royal-300 hover:text-gold-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-royal-300 hover:text-gold-400 transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-royal-300 hover:text-gold-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-royal-300 hover:text-gold-400 transition-colors">
                  Care Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-gold-400 mt-1 flex-shrink-0" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Carpet+Palace+Bhadohi+U.P.+221409+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-royal-300 hover:text-gold-400 transition-colors cursor-pointer"
                >
                  Carpet Palace,Bhadohi, (U.P.) 221409, India
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span className="text-royal-300">+91 94152 26326</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span className="text-royal-300">carpetpalace1@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-royal-800 mt-8 pt-8 text-center text-royal-400">
          <p>&copy; {new Date().getFullYear()} Carpet Palace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
