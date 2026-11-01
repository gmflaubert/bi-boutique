import { Link } from 'react-router-dom'
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div
        className="text-8xl md:text-9xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', opacity: 0.15 }}
      >
        404
      </div>
      <h1
        className="text-2xl md:text-3xl font-bold mb-3 -mt-10"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
      >
        Page Not Found
      </h1>
      <p className="mb-8 text-base" style={{ color: 'var(--color-text-light)' }}>
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="btn-primary gap-2">
          <Home size={18} /> Go Home
        </Link>
        <Link to="/shop" className="btn-secondary gap-2">
          <ShoppingBag size={18} /> Browse Shop
        </Link>
      </div>
      <button
        onClick={() => window.history.back()}
        className="mt-6 inline-flex items-center gap-1 text-sm cursor-pointer"
        style={{ color: 'var(--color-text-light)', background: 'none', border: 'none' }}
      >
        <ArrowLeft size={14} /> Go back to previous page
      </button>
    </div>
  )
}
