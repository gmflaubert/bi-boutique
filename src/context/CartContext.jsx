import { createContext, useContext, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadFromStorage('bi_cart', []));

  function persist(updated) {
    setItems(updated);
    saveToStorage('bi_cart', updated);
  }

  function addToCart(product, selectedSize, selectedColor, quantity = 1) {
    const existing = items.find(
      i => i.product.id === product.id && i.selectedSize === selectedSize && i.selectedColor === selectedColor
    );
    if (existing) {
      persist(items.map(i =>
        i === existing ? { ...i, quantity: i.quantity + quantity } : i
      ));
    } else {
      persist([...items, { product, selectedSize, selectedColor, quantity }]);
    }
  }

  function removeFromCart(productId, selectedSize, selectedColor) {
    persist(items.filter(
      i => !(i.product.id === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor)
    ));
  }

  function updateQuantity(productId, selectedSize, selectedColor, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }
    persist(items.map(i =>
      i.product.id === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor
        ? { ...i, quantity }
        : i
    ));
  }

  function clearCart() {
    persist([]);
  }

  function getTotal() {
    return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  function getItemCount() {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
