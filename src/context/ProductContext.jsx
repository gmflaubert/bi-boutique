import { createContext, useContext, useState } from 'react'
import { readStorage, writeStorage, generateId } from '../utils'
import { DEFAULT_PRODUCTS } from '../data/products'

const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => readStorage('bi_products', DEFAULT_PRODUCTS))

  function addProduct(product) {
    const newProduct = {
      ...product,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    const updated = [...products, newProduct]
    setProducts(updated)
    writeStorage('bi_products', updated)
  }

  function updateProduct(id, data) {
    const updated = products.map(p => p.id === id ? { ...p, ...data } : p)
    setProducts(updated)
    writeStorage('bi_products', updated)
  }

  function deleteProduct(id) {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    writeStorage('bi_products', updated)
  }

  function getProduct(id) {
    return products.find(p => p.id === id)
  }

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductContext)
}
