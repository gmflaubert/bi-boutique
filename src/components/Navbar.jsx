import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { STORE_CONFIG } from '../config'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { cartCount } = useCart()
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/contact', label: 'Contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm" style={{ height: '5rem' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.jpg" alt={STORE_CONFIG.storeName} className="h-12 w-12 rounded-full object-cover" />
          <div>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              {STORE_CONFIG.storeName}
            </span>
            <p className="text-xs m-0" style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>
              {STORE_CONFIG.tagline}
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium transition-colors no-underline"
              style={{ color: isActive(link.to) ? 'var(--color-primary)' : 'var(--color-text-light)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative no-underline" style={{ color: 'var(--color-text)' }}>
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--color-primary)' }}>
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to={isAuthenticated ? "/admin" : "/admin/login"}
            className="no-underline"
            style={{ color: 'var(--color-text-light)' }}
          >
            <User size={22} />
          </Link>

          <button
            className="md:hidden p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: 'var(--color-text)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium no-underline"
                style={{ color: isActive(link.to) ? 'var(--color-primary)' : 'var(--color-text-light)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
