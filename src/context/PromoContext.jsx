import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { isPromoUsed } from '../utils'

const PromoContext = createContext()

function toPromo(row) {
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: row.value,
    minPurchase: row.min_purchase,
    expiresAt: row.expires_at,
    active: row.active,
  }
}

function fromPromo(data) {
  return {
    code: data.code,
    type: data.type,
    value: Number(data.value),
    min_purchase: Number(data.minPurchase),
    expires_at: data.expiresAt || null,
    active: data.active,
  }
}

export function PromoProvider({ children }) {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('promos').select('*')
      if (!error) setPromos(data.map(toPromo))
      setLoading(false)
    }
    load()
  }, [])

  async function addPromo(promo) {
    const { data, error } = await supabase
      .from('promos')
      .insert(fromPromo(promo))
      .select()
      .single()
    if (!error) setPromos(prev => [...prev, toPromo(data)])
  }

  async function updatePromo(id, updates) {
    const { data, error } = await supabase
      .from('promos')
      .update(fromPromo(updates))
      .eq('id', id)
      .select()
      .single()
    if (!error) setPromos(prev => prev.map(p => p.id === id ? toPromo(data) : p))
  }

  async function deletePromo(id) {
    const { error } = await supabase.from('promos').delete().eq('id', id)
    if (!error) setPromos(prev => prev.filter(p => p.id !== id))
  }

  function validatePromo(code, subtotal) {
    if (isPromoUsed(code)) {
      return { valid: false, message: "You have already used this promo code" }
    }
    const promo = promos.find(p => p.code.toUpperCase() === code.toUpperCase() && p.active)
    if (!promo) return { valid: false, message: "Invalid promo code" }
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return { valid: false, message: "Promo code has expired" }
    if (subtotal < promo.minPurchase) return { valid: false, message: `Minimum purchase of RWF ${promo.minPurchase.toLocaleString()} required` }
    const discount = promo.type === "percentage" ? Math.round(subtotal * promo.value / 100) : promo.value
    return { valid: true, discount, promo, message: `Promo applied! You save RWF ${discount.toLocaleString()}` }
  }

  return (
    <PromoContext.Provider value={{ promos, loading, addPromo, updatePromo, deletePromo, validatePromo }}>
      {children}
    </PromoContext.Provider>
  )
}

export function usePromos() {
  return useContext(PromoContext)
}
