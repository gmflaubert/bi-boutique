import { Link } from 'react-router-dom'
import { formatPrice } from '../utils'

export default function ProductCard({ product }) {
  const onSale = product.originalPrice && product.originalPrice > product.price
  const discountPct = onSale ? Math.round((1 - product.price / product.originalPrice) * 100) : 0
  const maxColors = 4

  return (
    <Link to={`/product/${product.id}`} className="card group block no-underline" style={{ color: 'inherit' }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {onSale && (
          <span className="absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}>
            -{discountPct}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs mb-1" style={{ color: 'var(--color-text-light)' }}>{product.category}</p>
        <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>
            {formatPrice(product.price)}
          </span>
          {onSale && (
            <span className="text-xs line-through" style={{ color: 'var(--color-text-light)' }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1">
            {product.colors.slice(0, maxColors).map(color => (
              <span
                key={color.name}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > maxColors && (
              <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                +{product.colors.length - maxColors}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
