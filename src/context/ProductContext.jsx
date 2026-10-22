import { createContext, useContext, useState } from 'react';
import { initialProducts } from '../data/initialProducts';
import { loadFromStorage, saveToStorage, generateId } from '../utils/storage';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(
    () => loadFromStorage('bi_products', initialProducts)
  );

  function persist(updated) {
    setProducts(updated);
    saveToStorage('bi_products', updated);
  }

  function addProduct(product) {
    const newProduct = { ...product, id: generateId(), createdAt: new Date().toISOString().split('T')[0] };
    persist([...products, newProduct]);
    return newProduct;
  }

  function updateProduct(id, updates) {
    persist(products.map(p => p.id === id ? { ...p, ...updates } : p));
  }

  function deleteProduct(id) {
    persist(products.filter(p => p.id !== id));
  }

  function getProduct(id) {
    return products.find(p => p.id === id);
  }

  function getFeaturedProducts() {
    return products.filter(p => p.featured && p.inStock);
  }

  function getProductsByCategory(category) {
    if (category === 'All') return products.filter(p => p.inStock);
    return products.filter(p => p.category === category && p.inStock);
  }

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      getFeaturedProducts,
      getProductsByCategory,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
