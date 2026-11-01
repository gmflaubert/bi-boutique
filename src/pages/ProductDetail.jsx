import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag, MessageCircle, Check, X, MapPin } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { formatPrice, buildWhatsAppUrl, buildProductOrderMessage } from '../utils'
import { STORE_CONFIG } from '../config'

export default function ProductDetail() {
  const { id } = useParams()
  const { getProduct } = useProducts()
  const { addToCart } = useCart()
  const product = getProduct(id)

  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || '')
  const [quantity, setQuantity] = useState(1)
  const [location, setLocation] = useState('')
  const [added, setAdded] = useState(false)
  const [showQR, setShowQR] = useState(false)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p style={{ color: 'var(--color-text-light)' }}>Product not found.</p>
        <Link to="/shop" className="no-underline" style={{ color: 'var(--color-primary)' }}>Back to Shop</Link>
      </div>
    )
  }

  const onSale = product.originalPrice && product.originalPrice > product.price

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const waMessage = buildProductOrderMessage(product, selectedSize, selectedColor, quantity, location)
  const waUrl = buildWhatsAppUrl(STORE_CONFIG.whatsappNumber, waMessage)
  const waQrUrl = waUrl

  const isLightColor = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 180
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm mb-6 no-underline" style={{ color: 'var(--color-text-light)' }}>
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: '3/4' }}>
            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className="w-16 h-20 rounded-lg overflow-hidden cursor-pointer"
                  style={{ border: i === activeImage ? '2px solid var(--color-primary)' : '2px solid transparent' }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--color-primary)' }}>{product.category}</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-lg line-through" style={{ color: 'var(--color-text-light)' }}>{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <p className="mb-6" style={{ color: 'var(--color-text-light)' }}>{product.description}</p>

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                    style={{
                      border: selectedSize === s ? '2px solid var(--color-primary)' : '2px solid #e5e7eb',
                      backgroundColor: selectedSize === s ? 'var(--color-bg)' : 'white',
                      color: selectedSize === s ? 'var(--color-primary)' : 'var(--color-text-light)',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Color: <span style={{ color: 'var(--color-text-light)' }}>{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center"
                    style={{
                      backgroundColor: c.hex,
                      border: selectedColor === c.name ? '3px solid var(--color-primary)' : '2px solid #e5e7eb',
                    }}
                    title={c.name}
                  >
                    {selectedColor === c.name && isLightColor(c.hex) && (
                      <Check size={16} style={{ color: '#333' }} />
                    )}
                    {selectedColor === c.name && !isLightColor(c.hex) && (
                      <Check size={16} style={{ color: '#fff' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Quantity</p>
            <div className="inline-flex items-center border border-gray-200 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 cursor-pointer" style={{ color: 'var(--color-text-light)', background: 'none', border: 'none' }}>
                <Minus size={16} />
              </button>
              <span className="px-4 text-sm font-medium" style={{ color: 'var(--color-text)' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 cursor-pointer" style={{ color: 'var(--color-text-light)', background: 'none', border: 'none' }}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2 flex items-center gap-1" style={{ color: 'var(--color-text)' }}>
              <MapPin size={14} /> Delivery Location
            </p>
            <input
              type="text"
              placeholder="Enter your delivery address"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn-secondary flex-1 gap-2"
              style={added ? { backgroundColor: '#22c55e', color: 'white', borderColor: '#22c55e' } : {}}
            >
              {added ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Cart</>}
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="btn-primary flex-1 gap-2"
              disabled={!product.inStock || !location.trim()}
              style={!product.inStock || !location.trim() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              <MessageCircle size={18} /> Order via WhatsApp
            </button>
          </div>
          {!location.trim() && (
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-light)' }}>
              Enter your delivery location to order via WhatsApp
            </p>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative">
            <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 cursor-pointer" style={{ color: 'var(--color-text-light)', background: 'none', border: 'none' }}>
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              Order via WhatsApp
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
              Scan the QR code or click the link below
            </p>
            <div className="flex justify-center mb-6">
              <QRCodeSVG
                value={waQrUrl}
                size={180}
                level="M"
                imageSettings={{
                  src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E2527A'%3E%3Cpath d='M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 14.26l.04-.12L8.1 12h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 3H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 14.37 5.48 16 7 16h12v-2H7.42a.25.25 0 0 1-.26-.24z'/%3E%3C/svg%3E",
                  width: 36,
                  height: 36,
                  excavate: true,
                }}
              />
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full gap-2">
              <MessageCircle size={18} /> Send Order on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
