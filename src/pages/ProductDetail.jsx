import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageCircle, ChevronLeft, Minus, Plus, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/storage';
import { buildSingleProductMessage, getWhatsAppUrl } from '../utils/whatsapp';
import { storeSettings } from '../data/initialProducts';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct } = useProducts();
  const { addToCart } = useCart();
  const product = getProduct(id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showQR, setShowQR] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="btn-primary">Back to Shop</button>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const whatsappMessage = buildSingleProductMessage(product, selectedSize || product.sizes[0], selectedColor || product.colors[0]?.name, quantity);
  const whatsappUrl = getWhatsAppUrl(storeSettings.whatsappNumber, whatsappMessage);

  function handleAddToCart() {
    const size = selectedSize || product.sizes[0];
    const color = selectedColor || product.colors[0]?.name;
    addToCart(product, size, color, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleOrderNow() {
    if (!selectedSize && product.sizes.length > 0 && product.sizesEditable) {
      setSelectedSize(product.sizes[0]);
    }
    if (!selectedColor && product.colors.length > 0 && product.colorsEditable) {
      setSelectedColor(product.colors[0]?.name);
    }
    setShowQR(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-text-light hover:text-primary mb-6 bg-transparent border-none cursor-pointer text-sm"
      >
        <ChevronLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer p-0 ${
                    selectedImage === i ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-text-light uppercase tracking-wide mb-1">{product.category}</p>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-text-light line-through">{formatPrice(product.originalPrice)}</span>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-text-light leading-relaxed mb-6">{product.description}</p>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2">
                Size {!product.sizesEditable && <span className="text-text-light font-normal">(fixed)</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => {
                  const isSelected = (selectedSize || product.sizes[0]) === size;
                  return (
                    <button
                      key={size}
                      onClick={() => product.sizesEditable && setSelectedSize(size)}
                      disabled={!product.sizesEditable}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-primary text-white border-primary'
                          : product.sizesEditable
                            ? 'bg-white text-text border-gray-200 hover:border-primary cursor-pointer'
                            : 'bg-gray-100 text-text-light border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2">
                Color: {(selectedColor || product.colors[0]?.name)}
                {!product.colorsEditable && <span className="text-text-light font-normal"> (fixed)</span>}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => {
                  const isSelected = (selectedColor || product.colors[0]?.name) === color.name;
                  return (
                    <button
                      key={color.hex}
                      onClick={() => product.colorsEditable && setSelectedColor(color.name)}
                      disabled={!product.colorsEditable}
                      title={color.name}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-primary scale-110' : 'border-gray-300'
                      } ${product.colorsEditable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && <Check size={16} className={color.hex === '#FFFFFF' || color.hex === '#FFFDD0' || color.hex === '#F5F5DC' ? 'text-black' : 'text-white'} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center bg-white cursor-pointer hover:border-primary"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center bg-white cursor-pointer hover:border-primary"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button onClick={handleAddToCart} className="btn-secondary flex-1 flex items-center justify-center gap-2">
              {added ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </button>
            <button onClick={handleOrderNow} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <MessageCircle size={18} /> Order via WhatsApp
            </button>
          </div>

          {/* QR Code */}
          {showQR && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Scan to Order on WhatsApp</h3>
              <p className="text-sm text-text-light mb-4">Scan this QR code with your phone camera</p>
              <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                <QRCodeSVG value={whatsappUrl} size={200} />
              </div>
              <div className="mt-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium text-sm hover:underline"
                >
                  Or click here to open WhatsApp directly
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
