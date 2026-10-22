import { createContext, useContext, useState } from 'react';
import { loadFromStorage, saveToStorage, generateId } from '../utils/storage';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => loadFromStorage('bi_orders', []));

  function persist(updated) {
    setOrders(updated);
    saveToStorage('bi_orders', updated);
  }

  function addOrder(items, total, customerPhone = '', promoCode = null) {
    const order = {
      id: generateId(),
      items,
      total,
      customerPhone,
      promoCode,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    persist([order, ...orders]);
    return order;
  }

  function updateOrderStatus(id, status) {
    persist(orders.map(o => o.id === id ? { ...o, status } : o));
  }

  function deleteOrder(id) {
    persist(orders.filter(o => o.id !== id));
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}
