import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { usePromos } from '../../context/PromoContext'
import { formatPrice } from '../../utils'

const emptyPromo = { code: '', type: 'percentage', value: '', minPurchase: '', expiresAt: '', active: true }

export default function AdminPromos() {
  const { promos, addPromo, updatePromo, deletePromo } = usePromos()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyPromo)

  const openNew = () => {
    setForm(emptyPromo)
    setEditing('new')
  }

  const openEdit = (p) => {
    setForm({
      code: p.code,
      type: p.type,
      value: p.value.toString(),
      minPurchase: p.minPurchase.toString(),
      expiresAt: p.expiresAt || '',
      active: p.active,
    })
    setEditing(p.id)
  }

  const handleSave = () => {
    const data = {
      ...form,
      value: Number(form.value),
      minPurchase: Number(form.minPurchase),
      expiresAt: form.expiresAt || null,
    }
    if (editing === 'new') addPromo(data)
    else updatePromo(editing, data)
    setEditing(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>Discounts & Promos</h1>
        <button onClick={openNew} className="btn-primary text-sm gap-2"><Plus size={16} /> Add New Promo</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Code</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Type</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Discount</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Min Purchase</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Expires</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Status</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3 font-mono font-medium" style={{ color: 'var(--color-text)' }}>{p.code}</td>
                  <td className="p-3 capitalize" style={{ color: 'var(--color-text-light)' }}>{p.type}</td>
                  <td className="p-3 font-medium" style={{ color: 'var(--color-primary)' }}>
                    {p.type === 'percentage' ? `${p.value}%` : formatPrice(p.value)}
                  </td>
                  <td className="p-3" style={{ color: 'var(--color-text-light)' }}>{formatPrice(p.minPurchase)}</td>
                  <td className="p-3" style={{ color: 'var(--color-text-light)' }}>
                    {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 cursor-pointer" style={{ color: '#3b82f6', background: 'none', border: 'none' }}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => deletePromo(p.id)} className="p-1.5 cursor-pointer" style={{ color: '#ef4444', background: 'none', border: 'none' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 cursor-pointer" style={{ color: 'var(--color-text-light)', background: 'none', border: 'none' }}>
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              {editing === 'new' ? 'Add Promo' : 'Edit Promo'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Code</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none text-sm bg-white">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                  {form.type === 'percentage' ? 'Discount (%)' : 'Discount (RWF)'}
                </label>
                <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Min Purchase (RWF)</label>
                <input type="number" value={form.minPurchase} onChange={e => setForm({ ...form, minPurchase: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Expires At</label>
                <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>Active</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1 text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
