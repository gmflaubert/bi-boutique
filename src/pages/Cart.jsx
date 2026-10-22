import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, Tag } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { usePromos } from '../context/PromoContext';
import { formatPrice } from '../utils/storage';
import { buildWhatsAppMessage, getWhatsAppUrl } from '../utils/whatsapp';
import { storeSettings } from '../data/initialProducts';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { getProduct } = useProducts();
  const { addOrder } = useOrders();
  const { validatePromo, usePromo } = usePromos();
  const navigate = useNavigate();

  const liveItems = items.map(item => ({
    ...item,
    product: getProduct(item.product.id) || item.product,
  }));

  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const subtotal = liveItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discount = promoResult?.valid ? promoResult.discount : 0;
  const total = subtotal - discount;

  function handleApplyPromo() {
    if (!promoCode.trim()) return;
    const result = validatePromo(promoCode, subtotal);
    setPromoResult(result);
  }

  function handleOrder() {
    if (promoResult?.valid) {
      usePromo(promoResult.promo.id);
    }
    addOrder(liveItems, total, '', promoResult?.valid ? promoCode : null);
    setShowQR(true);
  }

  const whatsappMessage = buildWhatsAppMessage(liveItems, total, promoResult?.valid ? promoCode : null, discount);
  const whatsappUrl = getWhatsAppUrl(storeSettings.whatsappNumber, whatsappMessage);

  if (liveItems.length === 0 && !showQR) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-text-light mb-6">Looks like you haven't added anything yet</p>
        <Link to="/shop" className="btn-primary inline-block no-underline">Continue Shopping</Link>
      </div>
    );
  }

  if (showQR) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-2">Order Ready!</h2>
          <p className="text-text-light mb-6">Scan the QR code to complete your order on WhatsApp</p>
          <div className="inline-block p-4 bg-white rounded-lg shadow-md mb-6">
            <QRCodeSVG value={whatsappUrl} size={220} />
          </div>
          <div className="mb-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 no-underline"
            >
              Open WhatsApp Directly
            </a>
          </div>
          <p className="text-sm text-text-light mb-4">
            Total: <strong className="text-primary">{formatPrice(total)}</strong>
          </p>
          <button
            onClick={() => { clearCart(); setShowQR(false); navigate('/shop'); }}
            className="text-sm text-text-light hover:text-primary bg-transparent border-none cursor-pointer underline"
          >
            Clear cart & continue shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {liveItems.map((item) => (
            <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`} className="font-semibold text-text hover:text-primary no-underline">
                  {item.product.name}
                </Link>
                <p className="text-sm text-text-light mt-1">
                  Size: {item.selectedSize} &middot; Color: {item.selectedColor}
                </p>
                <p className="text-primary font-bold mt-1">{formatPrice(item.product.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                  className="text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                    className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center bg-white cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                    className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center bg-white cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-24">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-text-light">Subtotal ({liveItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({promoCode})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Promo Code</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value); setPromoResult(null); }}
                  placeholder="Enter code"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <button onClick={handleApplyPromo} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 border-none cursor-pointer">
                Apply
              </button>
            </div>
            {promoResult && (
              <p className={`text-xs mt-1 ${promoResult.valid ? 'text-green-600' : 'text-red-500'}`}>
                {promoResult.valid ? `Discount applied: -${formatPrice(promoResult.discount)}` : promoResult.message}
              </p>
            )}
          </div>

          <button onClick={handleOrder} className="btn-primary w-full text-center">
            Order via WhatsApp
          </button>

          <Link to="/shop" className="block text-center text-sm text-text-light hover:text-primary mt-4 no-underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
