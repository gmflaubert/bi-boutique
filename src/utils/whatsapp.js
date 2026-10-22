import { formatPrice } from './storage';

export function buildWhatsAppMessage(items, total, promoCode = null, discount = 0) {
  let message = `🛍️ *New Order from B&I Boutique Website*\n\n`;
  message += `📋 *Order Details:*\n`;
  message += `─────────────────\n`;

  items.forEach((item, index) => {
    message += `\n${index + 1}. *${item.product.name}*\n`;
    message += `   Size: ${item.selectedSize}\n`;
    message += `   Color: ${item.selectedColor}\n`;
    message += `   Qty: ${item.quantity}\n`;
    message += `   Price: ${formatPrice(item.product.price * item.quantity)}\n`;
  });

  message += `\n─────────────────\n`;
  if (promoCode && discount > 0) {
    message += `🏷️ Promo Code: ${promoCode}\n`;
    message += `💰 Discount: -${formatPrice(discount)}\n`;
  }
  message += `💵 *Total: ${formatPrice(total)}*\n\n`;
  message += `📦 Please confirm my order and share payment details.\n`;
  message += `Thank you! 🙏`;

  return message;
}

export function buildSingleProductMessage(product, selectedSize, selectedColor, quantity = 1) {
  let message = `🛍️ *Order from B&I Boutique Website*\n\n`;
  message += `📋 *Product:* ${product.name}\n`;
  message += `   Size: ${selectedSize}\n`;
  message += `   Color: ${selectedColor}\n`;
  message += `   Qty: ${quantity}\n`;
  message += `   Price: ${formatPrice(product.price * quantity)}\n\n`;
  message += `📦 Please confirm availability and share payment details.\n`;
  message += `Thank you! 🙏`;

  return message;
}

export function getWhatsAppUrl(phoneNumber, message) {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
