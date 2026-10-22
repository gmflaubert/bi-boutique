import { createContext, useContext, useState } from 'react'
import { readStorage, writeStorage } from '../utils'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage('bi_cart', []))

  function addToCart(product, selectedSize, selectedColor, quantity = 1) {
    setCart(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      )
      let updated
      if (existing) {
        updated = prev.map(item =>
          item.product.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        updated = [...prev, { product, selectedSize, selectedColor, quantity }]
      }
      writeStorage('bi_cart', updated)
      return updated
    })
  }

  function removeFromCart(productId, selectedSize, selectedColor) {
    setCart(prev => {
      const updated = prev.filter(
        item => !(item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
      )
      writeStorage('bi_cart', updated)
      return updated
    })
  }

  function updateQuantity(productId, selectedSize, selectedColor, quantity) {
    if (quantity < 1) return
    setCart(prev => {
      const updated = prev.map(item =>
        item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
      writeStorage('bi_cart', updated)
      return updated
    })
  }

  function clearCart() {
    setCart([])
    writeStorage('bi_cart', [])
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
