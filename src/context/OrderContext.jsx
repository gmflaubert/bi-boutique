import { createContext, useContext, useState } from 'react'
import { readStorage, writeStorage, generateId } from '../utils'

const OrderContext = createContext()

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => readStorage('bi_orders', []))

  function addOrder(items, total, customerPhone, promoCode = null) {
    const newOrder = {
      id: generateId(),
      items,
      total,
      customerPhone,
      promoCode,
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    const updated = [newOrder, ...orders]
    setOrders(updated)
    writeStorage('bi_orders', updated)
    return newOrder
  }

  function updateOrderStatus(id, status) {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o)
    setOrders(updated)
    writeStorage('bi_orders', updated)
  }

  function deleteOrder(id) {
    const updated = orders.filter(o => o.id !== id)
    setOrders(updated)
    writeStorage('bi_orders', updated)
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  return useContext(OrderContext)
}
