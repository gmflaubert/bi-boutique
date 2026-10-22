import { createContext, useContext, useState } from 'react';
import { loadFromStorage, saveToStorage, generateId } from '../utils/storage';

const PromoContext = createContext();

const initialPromos = [
  {
    id: '1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    active: true,
    minPurchase: 20000,
    expiresAt: '2025-12-31',
    usageCount: 0,
  },
  {
    id: '2',
    code: 'SAVE5000',
    type: 'fixed',
    value: 5000,
    active: true,
    minPurchase: 30000,
    expiresAt: null,
    usageCount: 0,
  },
];

export function PromoProvider({ children }) {
  const [promos, setPromos] = useState(() => loadFromStorage('bi_promos', initialPromos));

  function persist(updated) {
    setPromos(updated);
    saveToStorage('bi_promos', updated);
  }

  function addPromo(promo) {
    const newPromo = { ...promo, id: generateId(), usageCount: 0 };
    persist([...promos, newPromo]);
    return newPromo;
  }

  function updatePromo(id, updates) {
    persist(promos.map(p => p.id === id ? { ...p, ...updates } : p));
  }

  function deletePromo(id) {
    persist(promos.filter(p => p.id !== id));
  }

  function validatePromo(code, total) {
    const promo = promos.find(p => p.code.toUpperCase() === code.toUpperCase() && p.active);
    if (!promo) return { valid: false, message: 'Invalid promo code' };
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return { valid: false, message: 'This promo code has expired' };
    }
    if (total < promo.minPurchase) {
      return { valid: false, message: `Minimum purchase of RWF ${promo.minPurchase.toLocaleString()} required` };
    }
    const discount = promo.type === 'percentage'
      ? Math.round(total * promo.value / 100)
      : promo.value;
    return { valid: true, discount, promo };
  }

  function usePromo(id) {
    persist(promos.map(p => p.id === id ? { ...p, usageCount: p.usageCount + 1 } : p));
  }

  return (
    <PromoContext.Provider value={{ promos, addPromo, updatePromo, deletePromo, validatePromo, usePromo }}>
      {children}
    </PromoContext.Provider>
  );
}

export function usePromos() {
  return useContext(PromoContext);
}
