import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/storage';

export default function ProductCard({ product }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <Link to={`/product/${product.id}`} className="card group block no-underline text-inherit">
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-text-light uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="text-base font-semibold mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-text-light line-through text-sm">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className="flex gap-1 mt-2">
          {product.colors.slice(0, 4).map(c => (
            <span
              key={c.hex}
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-xs text-text-light">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
