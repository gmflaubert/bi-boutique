import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, Sparkles, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'
import { usePromos } from '../context/PromoContext'
import { CATEGORIES } from '../config'
import { formatPrice } from '../utils'

export default function Home() {
  const { products } = useProducts()
  const { promos } = usePromos()

  const featured = products.filter(p => p.featured)
  const onSale = products.filter(p => p.originalPrice && p.originalPrice > p.price)
  const activePromos = promos.filter(p => p.active && (!p.expiresAt || new Date(p.expiresAt) >= new Date()))

  const perPage = 4
  const [featuredPage, setFeaturedPage] = useState(0)
  const [dealsPage, setDealsPage] = useState(0)
  const featuredTotal = Math.ceil(featured.length / perPage)
  const dealsTotal = Math.ceil(onSale.length / perPage)
  const featuredSlice = featured.slice(featuredPage * perPage, (featuredPage + 1) * perPage)
  const dealsSlice = onSale.slice(dealsPage * perPage, (dealsPage + 1) * perPage)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center text-white">
          <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--color-primary-light)' }}>
            New Collection 2024
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Elegance, Always Classy
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8 opacity-90">
            Discover our curated collection of fashion pieces that blend timeless elegance with modern sophistication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}>
              Shop Now <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/about" className="btn-secondary" style={{ borderColor: 'white', color: 'white', backgroundColor: 'transparent' }}>
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      {activePromos.length > 0 && (
        <section className="py-4" style={{ backgroundColor: 'var(--color-accent)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-white text-sm">
              <div className="flex items-center gap-2 font-medium">
                <Tag size={16} />
                <span>Promo Codes Available!</span>
              </div>
              {activePromos.map(p => (
                <div key={p.id} className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <span className="font-mono font-bold">{p.code}</span>
                  <span className="opacity-80">—</span>
                  <span>
                    {p.type === 'percentage' ? `${p.value}% off` : `${formatPrice(p.value)} off`}
                    {p.minPurchase > 0 && ` (min ${formatPrice(p.minPurchase)})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Quick and reliable delivery across Rwanda' },
              { icon: Shield, title: 'Quality Guarantee', desc: 'Every piece meets our high standards' },
              { icon: Sparkles, title: 'Curated Selection', desc: 'Handpicked fashion for the modern woman' },
            ].map(f => (
              <div key={f.title} className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)' }}>
                  <f.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* On Sale */}
      {onSale.length > 0 && (
        <section className="py-16" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                  Current Deals
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-light)' }}>Don't miss out on these special prices</p>
              </div>
              <div className="flex items-center gap-3">
                {dealsTotal > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDealsPage(p => Math.max(0, p - 1))}
                      disabled={dealsPage === 0}
                      className="p-1.5 rounded-full border-none cursor-pointer"
                      style={{ background: dealsPage === 0 ? 'transparent' : 'white', color: dealsPage === 0 ? '#d1d5db' : 'var(--color-text)', cursor: dealsPage === 0 ? 'not-allowed' : 'pointer' }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text-light)' }}>{dealsPage + 1}/{dealsTotal}</span>
                    <button
                      onClick={() => setDealsPage(p => Math.min(dealsTotal - 1, p + 1))}
                      disabled={dealsPage >= dealsTotal - 1}
                      className="p-1.5 rounded-full border-none cursor-pointer"
                      style={{ background: dealsPage >= dealsTotal - 1 ? 'transparent' : 'white', color: dealsPage >= dealsTotal - 1 ? '#d1d5db' : 'var(--color-text)', cursor: dealsPage >= dealsTotal - 1 ? 'not-allowed' : 'pointer' }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
                <Link to="/shop" className="text-sm font-medium flex items-center gap-1 no-underline" style={{ color: 'var(--color-primary)' }}>
                  View All <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dealsSlice.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              Shop by Category
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.filter(c => c !== 'All').map(cat => (
              <Link
                key={cat}
                to={`/shop?category=${cat}`}
                className="px-6 py-3 rounded-full text-sm font-medium transition-all no-underline"
                style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              Featured Products
            </h2>
            <div className="flex items-center gap-3">
              {featuredTotal > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFeaturedPage(p => Math.max(0, p - 1))}
                    disabled={featuredPage === 0}
                    className="p-1.5 rounded-full border-none cursor-pointer"
                    style={{ background: featuredPage === 0 ? 'transparent' : 'white', color: featuredPage === 0 ? '#d1d5db' : 'var(--color-text)', cursor: featuredPage === 0 ? 'not-allowed' : 'pointer' }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-light)' }}>{featuredPage + 1}/{featuredTotal}</span>
                  <button
                    onClick={() => setFeaturedPage(p => Math.min(featuredTotal - 1, p + 1))}
                    disabled={featuredPage >= featuredTotal - 1}
                    className="p-1.5 rounded-full border-none cursor-pointer"
                    style={{ background: featuredPage >= featuredTotal - 1 ? 'transparent' : 'white', color: featuredPage >= featuredTotal - 1 ? '#d1d5db' : 'var(--color-text)', cursor: featuredPage >= featuredTotal - 1 ? 'not-allowed' : 'pointer' }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
              <Link to="/shop" className="text-sm font-medium flex items-center gap-1 no-underline" style={{ color: 'var(--color-primary)' }}>
                View All <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredSlice.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-white text-center" style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))' }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Ready to Elevate Your Style?
          </h2>
          <p className="mb-8 opacity-90">Explore our collection and find pieces that speak to your unique elegance.</p>
          <Link to="/shop" className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--color-accent-dark)' }}>
            Start Shopping
          </Link>
        </div>
      </section>
    </>
  )
}
