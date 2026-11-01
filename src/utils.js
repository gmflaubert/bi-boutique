export function readStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function formatPrice(amount, currency = "RWF") {
  return `${currency} ${Number(amount).toLocaleString()}`
}

export function buildWhatsAppUrl(number, text) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function buildCartOrderMessage(items, total, promoCode = null, discount = 0, location = '') {
  let msg = `🛍️ *New Order from B&I Boutique Website*\n\n`
  msg += `📋 *Order Details:*\n`
  msg += `─────────────────\n`
  items.forEach((item, i) => {
    msg += `\n${i + 1}. *${item.product.name}*\n`
    msg += `   Size: ${item.selectedSize}\n`
    msg += `   Color: ${item.selectedColor}\n`
    msg += `   Qty: ${item.quantity}\n`
    msg += `   Price: ${formatPrice(item.product.price * item.quantity)}\n`
  })
  msg += `\n─────────────────\n`
  if (promoCode && discount > 0) {
    msg += `🏷️ Promo Code: ${promoCode}\n`
    msg += `💰 Discount: -${formatPrice(discount)}\n`
  }
  msg += `💵 *Total: ${formatPrice(total)}*\n\n`
  if (location) {
    msg += `📍 *Delivery Location:* ${location}\n\n`
  }
  msg += `📦 Please confirm my order and share payment details.\n`
  msg += `Thank you! 🙏`
  return msg
}

export function buildProductOrderMessage(product, size, color, quantity, location = '') {
  let msg = `🛍️ *New Order from B&I Boutique Website*\n\n`
  msg += `📋 *Order Details:*\n`
  msg += `─────────────────\n`
  msg += `\n*${product.name}*\n`
  msg += `Size: ${size}\n`
  msg += `Color: ${color}\n`
  msg += `Qty: ${quantity}\n`
  msg += `Price: ${formatPrice(product.price * quantity)}\n`
  msg += `\n─────────────────\n`
  msg += `💵 *Total: ${formatPrice(product.price * quantity)}*\n\n`
  if (location) {
    msg += `📍 *Delivery Location:* ${location}\n\n`
  }
  msg += `📦 Please confirm my order and share payment details.\n`
  msg += `Thank you! 🙏`
  return msg
}

export function getUsedPromos() {
  return readStorage('bi_used_promos', [])
}

export function markPromoUsed(code) {
  const used = getUsedPromos()
  if (!used.includes(code.toUpperCase())) {
    writeStorage('bi_used_promos', [...used, code.toUpperCase()])
  }
}

export function isPromoUsed(code) {
  return getUsedPromos().includes(code.toUpperCase())
}
