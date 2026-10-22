import { createContext, useContext, useState } from 'react'
import { readStorage, writeStorage, generateId } from '../utils'
import { DEFAULT_PROMOS } from '../data/products'

const PromoContext = createContext()

export function PromoProvider({ children }) {
  const [promos, setPromos] = useState(() => readStorage('bi_promos', DEFAULT_PROMOS))

  function addPromo(promo) {
    const newPromo = { ...promo, id: generateId() }
    const updated = [...promos, newPromo]
    setPromos(updated)
    writeStorage('bi_promos', updated)
  }

  function updatePromo(id, data) {
    const updated = promos.map(p => p.id === id ? { ...p, ...data } : p)
    setPromos(updated)
    writeStorage('bi_promos', updated)
  }

  function deletePromo(id) {
    const updated = promos.filter(p => p.id !== id)
    setPromos(updated)
    writeStorage('bi_promos', updated)
  }

  function validatePromo(code, subtotal) {
    const promo = promos.find(p => p.code.toUpperCase() === code.toUpperCase() && p.active)
    if (!promo) return { valid: false, message: "Invalid promo code" }
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return { valid: false, message: "Promo code has expired" }
    if (subtotal < promo.minPurchase) return { valid: false, message: `Minimum purchase of RWF ${promo.minPurchase.toLocaleString()} required` }
    const discount = promo.type === "percentage" ? Math.round(subtotal * promo.value / 100) : promo.value
    return { valid: true, discount, promo, message: `Promo applied! You save RWF ${discount.toLocaleString()}` }
  }

  return (
    <PromoContext.Provider value={{ promos, addPromo, updatePromo, deletePromo, validatePromo }}>
      {children}
    </PromoContext.Provider>
  )
}

export function usePromos() {
  return useContext(PromoContext)
}
