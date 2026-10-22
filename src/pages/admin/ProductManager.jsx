import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Image } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/storage';
import { categories } from '../../data/initialProducts';

const emptyProduct = {
  name: '', description: '', price: '', originalPrice: '',
  images: [''], category: 'Dresses',
  sizes: ['S', 'M', 'L'], colors: [{ name: '', hex: '#000000' }],
  sizesEditable: true, colorsEditable: true,
  inStock: true, featured: false,
};

export default function ProductManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [showForm, setShowForm] = useState(false);

  function openNew() {
    setEditing(null);
    setForm(emptyProduct);
    setShowForm(true);
  }

  function openEdit(product) {
    setEditing(product.id);
    setForm({
      ...product,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(emptyProduct);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      images: form.images.filter(Boolean),
      sizes: form.sizes.filter(Boolean),
      colors: form.colors.filter(c => c.name),
    };
    if (editing) {
      updateProduct(editing, data);
    } else {
      addProduct(data);
    }
    closeForm();
  }

  function handleDelete(id) {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  }

  function updateSize(index, value) {
    const sizes = [...form.sizes];
    sizes[index] = value;
    setForm({ ...form, sizes });
  }

  function updateColor(index, field, value) {
    const colors = [...form.colors];
    colors[index] = { ...colors[index], [field]: value };
    setForm({ ...form, colors });
  }

  function updateImage(index, value) {
    const images = [...form.images];
    images[index] = value;
    setForm({ ...form, images });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 mb-10 relative">
            <button onClick={closeForm} className="absolute top-4 right-4 text-text-light hover:text-text bg-transparent border-none cursor-pointer">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-6">{editing ? 'Edit Product' : 'Add New Product'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows="3" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (RWF) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Original Price (for discount)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" min="0" />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium mb-1">Image URLs</label>
                {form.images.map((img, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                      <input value={img} onChange={e => updateImage(i, e.target.value)}
                        placeholder="https://..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    {form.images.length > 1 && (
                      <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}
                        className="text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer"><X size={16} /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setForm({ ...form, images: [...form.images, ''] })}
                  className="text-primary text-xs font-medium bg-transparent border-none cursor-pointer">+ Add Image</button>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Sizes</label>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={form.sizesEditable}
                      onChange={e => setForm({ ...form, sizesEditable: e.target.checked })} />
                    Customer can choose size
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.sizes.map((s, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <input value={s} onChange={e => updateSize(i, e.target.value)}
                        className="w-16 px-2 py-1.5 border border-gray-200 rounded text-sm text-center" />
                      {form.sizes.length > 1 && (
                        <button type="button" onClick={() => setForm({ ...form, sizes: form.sizes.filter((_, j) => j !== i) })}
                          className="text-red-400 bg-transparent border-none cursor-pointer"><X size={14} /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setForm({ ...form, sizes: [...form.sizes, ''] })}
                    className="px-3 py-1.5 border border-dashed border-gray-300 rounded text-sm text-text-light cursor-pointer bg-transparent">+</button>
                </div>
              </div>

              {/* Colors */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Colors</label>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={form.colorsEditable}
                      onChange={e => setForm({ ...form, colorsEditable: e.target.checked })} />
                    Customer can choose color
                  </label>
                </div>
                {form.colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input type="color" value={c.hex} onChange={e => updateColor(i, 'hex', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-none" />
                    <input value={c.name} onChange={e => updateColor(i, 'name', e.target.value)}
                      placeholder="Color name" className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    {form.colors.length > 1 && (
                      <button type="button" onClick={() => setForm({ ...form, colors: form.colors.filter((_, j) => j !== i) })}
                        className="text-red-400 bg-transparent border-none cursor-pointer"><X size={14} /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setForm({ ...form, colors: [...form.colors, { name: '', hex: '#000000' }] })}
                  className="text-primary text-xs font-medium bg-transparent border-none cursor-pointer">+ Add Color</button>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.inStock}
                    onChange={e => setForm({ ...form, inStock: e.target.checked })} />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  Featured
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex items-center gap-2 text-sm">
                  <Save size={16} /> {editing ? 'Update' : 'Add'} Product
                </button>
                <button type="button" onClick={closeForm} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-medium text-text-light">Product</th>
                <th className="text-left p-3 font-medium text-text-light">Category</th>
                <th className="text-left p-3 font-medium text-text-light">Price</th>
                <th className="text-left p-3 font-medium text-text-light">Stock</th>
                <th className="text-left p-3 font-medium text-text-light">Featured</th>
                <th className="text-right p-3 font-medium text-text-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{formatPrice(product.price)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td className="p-3">{product.featured ? '⭐' : '—'}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => openEdit(product)}
                      className="text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer mr-2">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
