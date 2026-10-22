import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'
import { CATEGORIES } from '../config'

export default function Shop() {
  const { products } = useProducts()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  const activeCategory = params.get('category') || 'All'

  const filtered = useMemo(() => {
    let result = products
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    switch (sort) {
      case 'price-asc': return [...result].sort((a, b) => a.price - b.price)
      case 'price-desc': return [...result].sort((a, b) => b.price - a.price)
      case 'name': return [...result].sort((a, b) => a.name.localeCompare(b.name))
      default: return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }, [products, activeCategory, search, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          Our Collection
        </h1>
        <p className="mt-2" style={{ color: 'var(--color-text-light)' }}>Browse our curated selection of fashion pieces</p>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-light)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-pink-400 focus:outline-none transition"
            style={{ fontFamily: 'var(--font-body)' }}
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-full border border-gray-200 focus:border-pink-400 focus:outline-none bg-white cursor-pointer"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => {
              if (cat === 'All') setParams({})
              else setParams({ category: cat })
            }}
            className="px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border-none"
            style={{
              backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'white',
              color: activeCategory === cat ? 'white' : 'var(--color-text-light)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Count */}
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
        {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-20" style={{ color: 'var(--color-text-light)' }}>
          No products found. Try a different search or category.
        </p>
      )}
    </div>
  )
}
