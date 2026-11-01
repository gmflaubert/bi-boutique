import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const OrderContext = createContext()

function toOrder(row) {
  return {
    id: row.id,
    items: row.items || [],
    total: row.total,
    customerName: row.customer_name || '',
    customerPhone: row.customer_phone || '',
    deliveryLocation: row.delivery_location || '',
    promoCode: row.promo_code,
    status: row.status,
    createdAt: row.created_at,
  }
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      setOrders([])
      setLoading(false)
      return
    }
    async function load() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setOrders(data.map(toOrder))
      setLoading(false)
    }
    load()
  }, [isAuthenticated, authLoading])

  async function addOrder(items, total, customerName, customerPhone, promoCode = null, deliveryLocation = '') {
    await supabase.from('orders').insert({
      items,
      total,
      customer_name: customerName,
      customer_phone: customerPhone,
      promo_code: promoCode,
      delivery_location: deliveryLocation,
    })
  }

  async function updateOrderStatus(id, status) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
    if (!error) setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  async function deleteOrder(id) {
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (!error) setOrders(prev => prev.filter(o => o.id !== id))
  }

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder, updateOrderStatus, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  return useContext(OrderContext)
}
