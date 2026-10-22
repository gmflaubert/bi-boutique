import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { formatPrice } from '../../utils'
import { CATEGORIES } from '../../config'

const emptyProduct = {
  name: '', description: '', price: '', originalPrice: '', category: 'Dresses',
  images: [''], sizes: ['S', 'M', 'L'], colors: [{ name: '', hex: '#000000' }],
  inStock: true, featured: false,
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProduct)

  const openNew = () => {
    setForm(emptyProduct)
    setEditing('new')
  }

  const openEdit = (p) => {
    setForm({
      ...p,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
      images: p.images.length > 0 ? p.images : [''],
      colors: p.colors && p.colors.length > 0 ? p.colors : [{ name: '', hex: '#000000' }],
    })
    setEditing(p.id)
  }

  const handleSave = () => {
    const data = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      images: form.images.filter(Boolean),
      sizes: form.sizes.filter(Boolean),
      colors: form.colors.filter(c => c.name),
    }
    if (editing === 'new') {
      addProduct(data)
    } else {
      updateProduct(editing, data)
    }
    setEditing(null)
  }

  const categories = CATEGORIES.filter(c => c !== 'All')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>Products</h1>
        <button onClick={openNew} className="btn-primary text-sm gap-2"><Plus size={16} /> Add New Product</button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Image</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Name</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Category</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Price</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Stock</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Featured</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td className="p-3 font-medium" style={{ color: 'var(--color-text)' }}>{p.name}</td>
                  <td className="p-3" style={{ color: 'var(--color-text-light)' }}>{p.category}</td>
                  <td className="p-3 font-medium" style={{ color: 'var(--color-primary)' }}>{formatPrice(p.price)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.featured ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg cursor-pointer" style={{ color: '#3b82f6', background: 'none', border: 'none' }}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg cursor-pointer" style={{ color: '#ef4444', background: 'none', border: 'none' }}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg my-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 cursor-pointer" style={{ color: 'var(--color-text-light)', background: 'none', border: 'none' }}>
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              {editing === 'new' ? 'Add Product' : 'Edit Product'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Price (RWF)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Original Price</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} placeholder="Leave empty if no sale" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm bg-white">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Image URLs</label>
                {form.images.map((img, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={img} onChange={e => { const imgs = [...form.images]; imgs[i] = e.target.value; setForm({ ...form, images: imgs }) }} placeholder="Image URL" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm" />
                    {form.images.length > 1 && (
                      <button onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })} className="p-2 cursor-pointer" style={{ color: '#ef4444', background: 'none', border: 'none' }}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, images: [...form.images, ''] })} className="text-xs cursor-pointer" style={{ color: 'var(--color-primary)', background: 'none', border: 'none' }}>
                  + Add Image
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Sizes (comma-separated)</label>
                <input value={form.sizes.join(', ')} onChange={e => setForm({ ...form, sizes: e.target.value.split(',').map(s => s.trim()) })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Colors</label>
                {form.colors.map((c, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <input value={c.name} onChange={e => { const cols = [...form.colors]; cols[i] = { ...cols[i], name: e.target.value }; setForm({ ...form, colors: cols }) }} placeholder="Color name" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:outline-none text-sm" />
                    <input type="color" value={c.hex} onChange={e => { const cols = [...form.colors]; cols[i] = { ...cols[i], hex: e.target.value }; setForm({ ...form, colors: cols }) }} className="w-10 h-10 rounded cursor-pointer border-none" />
                    {form.colors.length > 1 && (
                      <button onClick={() => setForm({ ...form, colors: form.colors.filter((_, j) => j !== i) })} className="p-1 cursor-pointer" style={{ color: '#ef4444', background: 'none', border: 'none' }}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, colors: [...form.colors, { name: '', hex: '#000000' }] })} className="text-xs cursor-pointer" style={{ color: 'var(--color-primary)', background: 'none', border: 'none' }}>
                  + Add Color
                </button>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} />
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  <span className="text-sm" style={{ color: 'var(--color-text)' }}>Featured</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1 text-sm">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
