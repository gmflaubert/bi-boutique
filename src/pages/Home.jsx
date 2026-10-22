import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, Sparkles } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'
import { CATEGORIES } from '../config'

export default function Home() {
  const { products } = useProducts()
  const featured = products.filter(p => p.featured).slice(0, 4)

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

      {/* Shop by Category */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-bg)' }}>
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
                style={{ backgroundColor: 'white', color: 'var(--color-text)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              Featured Products
            </h2>
            <Link to="/shop" className="text-sm font-medium flex items-center gap-1 no-underline" style={{ color: 'var(--color-primary)' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
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
