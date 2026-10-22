import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2, MessageCircle, X, Tag } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useCart } from '../context/CartContext'
import { usePromos } from '../context/PromoContext'
import { useOrders } from '../context/OrderContext'
import { formatPrice, buildWhatsAppUrl, buildCartOrderMessage } from '../utils'
import { STORE_CONFIG } from '../config'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const { validatePromo } = usePromos()
  const { addOrder } = useOrders()

  const [promoCode, setPromoCode] = useState('')
  const [promoResult, setPromoResult] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [appliedCode, setAppliedCode] = useState(null)
  const [showQR, setShowQR] = useState(false)

  const applyPromo = () => {
    const result = validatePromo(promoCode, cartTotal)
    setPromoResult(result)
    if (result.valid) {
      setDiscount(result.discount)
      setAppliedCode(promoCode)
    } else {
      setDiscount(0)
      setAppliedCode(null)
    }
  }

  const total = cartTotal - discount

  const handleOrder = () => {
    addOrder(cart, total, '', appliedCode)
    setShowQR(true)
  }

  const waMessage = buildCartOrderMessage(cart, total, appliedCode, discount)
  const waUrl = buildWhatsAppUrl(STORE_CONFIG.whatsappNumber, waMessage)

  if (cart.length === 0 && !showQR) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          Your cart is empty
        </h1>
        <p className="mb-6" style={{ color: 'var(--color-text-light)' }}>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        Shopping Cart
      </h1>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {cart.map((item, idx) => (
          <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
            <Link to={`/product/${item.product.id}`} className="shrink-0">
              <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-24 object-cover rounded-lg" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.product.id}`} className="text-sm font-medium no-underline" style={{ color: 'var(--color-text)' }}>
                {item.product.name}
              </Link>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-light)' }}>
                Size: {item.selectedSize} | Color: {item.selectedColor}
              </p>
              <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-primary)' }}>
                {formatPrice(item.product.price)}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="inline-flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                    className="p-1.5 cursor-pointer"
                    style={{ color: 'var(--color-text-light)', background: 'none', border: 'none' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                    className="p-1.5 cursor-pointer"
                    style={{ color: 'var(--color-text-light)', background: 'none', border: 'none' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                  className="p-1.5 cursor-pointer"
                  style={{ color: '#ef4444', background: 'none', border: 'none' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag size={18} style={{ color: 'var(--color-primary)' }} />
          <span className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Promo Code</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          />
          <button onClick={applyPromo} className="btn-primary text-sm px-4 py-2">Apply</button>
        </div>
        {promoResult && (
          <p className="text-sm mt-2" style={{ color: promoResult.valid ? '#22c55e' : '#ef4444' }}>
            {promoResult.message}
          </p>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between" style={{ color: 'var(--color-text-light)' }}>
            <span>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between" style={{ color: '#22c55e' }}>
              <span>Discount ({appliedCode})</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg" style={{ color: 'var(--color-text)' }}>
            <span>Total</span>
            <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
          </div>
        </div>

        <button onClick={handleOrder} className="btn-primary w-full mt-6 gap-2">
          <MessageCircle size={18} /> Order via WhatsApp
        </button>
        <Link to="/shop" className="block mt-3 text-center text-sm no-underline" style={{ color: 'var(--color-text-light)' }}>
          Continue Shopping
        </Link>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative">
            <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 cursor-pointer" style={{ color: 'var(--color-text-light)', background: 'none', border: 'none' }}>
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              Order Placed!
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
              Scan the QR code or click below to complete your order on WhatsApp
            </p>
            <div className="flex justify-center mb-6">
              <QRCodeSVG value={waUrl} size={200} />
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full gap-2 mb-4">
              <MessageCircle size={18} /> Open WhatsApp Directly
            </a>
            <button
              onClick={() => { clearCart(); setShowQR(false); setDiscount(0); setAppliedCode(null); setPromoCode(''); setPromoResult(null) }}
              className="text-sm cursor-pointer no-underline"
              style={{ color: 'var(--color-text-light)', background: 'none', border: 'none' }}
            >
              Clear cart & continue shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
