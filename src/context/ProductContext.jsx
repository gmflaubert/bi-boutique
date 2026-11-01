import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ProductContext = createContext()

function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price,
    images: row.images || [],
    category: row.category,
    sizes: row.sizes || [],
    colors: row.colors || [],
    inStock: row.in_stock,
    featured: row.featured,
    createdAt: row.created_at,
  }
}

function fromProduct(data) {
  return {
    name: data.name,
    description: data.description,
    price: Number(data.price),
    original_price: data.originalPrice ? Number(data.originalPrice) : null,
    images: data.images,
    category: data.category,
    sizes: data.sizes,
    colors: data.colors,
    in_stock: data.inStock,
    featured: data.featured,
  }
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setProducts(data.map(toProduct))
      setLoading(false)
    }
    load()
  }, [])

  async function addProduct(product) {
    const { data, error } = await supabase
      .from('products')
      .insert(fromProduct(product))
      .select()
      .single()
    if (!error) setProducts(prev => [toProduct(data), ...prev])
  }

  async function updateProduct(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(fromProduct(updates))
      .eq('id', id)
      .select()
      .single()
    if (!error) setProducts(prev => prev.map(p => p.id === id ? toProduct(data) : p))
  }

  async function deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) setProducts(prev => prev.filter(p => p.id !== id))
  }

  function getProduct(id) {
    return products.find(p => p.id === id)
  }

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, getProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductContext)
}
