import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { usePromos } from '../../context/PromoContext';
import { formatPrice } from '../../utils/storage';

const emptyPromo = {
  code: '', type: 'percentage', value: '', active: true, minPurchase: '', expiresAt: '',
};

export default function PromoManager() {
  const { promos, addPromo, updatePromo, deletePromo } = usePromos();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPromo);
  const [showForm, setShowForm] = useState(false);

  function openNew() {
    setEditing(null);
    setForm(emptyPromo);
    setShowForm(true);
  }

  function openEdit(promo) {
    setEditing(promo.id);
    setForm({
      code: promo.code,
      type: promo.type,
      value: String(promo.value),
      active: promo.active,
      minPurchase: promo.minPurchase ? String(promo.minPurchase) : '',
      expiresAt: promo.expiresAt || '',
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(emptyPromo);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      ...form,
      code: form.code.toUpperCase(),
      value: Number(form.value),
      minPurchase: form.minPurchase ? Number(form.minPurchase) : 0,
      expiresAt: form.expiresAt || null,
    };
    if (editing) {
      updatePromo(editing, data);
    } else {
      addPromo(data);
    }
    closeForm();
  }

  function handleDelete(id) {
    if (confirm('Delete this promo code?')) deletePromo(id);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Discounts & Promo Codes</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Promo
        </button>
      </div>

      {/* Promo Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button onClick={closeForm}
              className="absolute top-4 right-4 text-text-light hover:text-text bg-transparent border-none cursor-pointer">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-6">{editing ? 'Edit Promo Code' : 'New Promo Code'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code *</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. SAVE20" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm uppercase"
                  required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (RWF)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Value *</label>
                  <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                    placeholder={form.type === 'percentage' ? '10' : '5000'}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required min="0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Minimum Purchase (RWF)</label>
                <input type="number" value={form.minPurchase}
                  onChange={e => setForm({ ...form, minPurchase: e.target.value })}
                  placeholder="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" min="0" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expires At</label>
                <input type="date" value={form.expiresAt}
                  onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })} />
                Active
              </label>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex items-center gap-2 text-sm">
                  <Save size={16} /> {editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeForm} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promos Table */}
      {promos.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <p className="text-text-light">No promo codes yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-text-light">Code</th>
                  <th className="text-left p-3 font-medium text-text-light">Discount</th>
                  <th className="text-left p-3 font-medium text-text-light">Min Purchase</th>
                  <th className="text-left p-3 font-medium text-text-light">Expires</th>
                  <th className="text-left p-3 font-medium text-text-light">Status</th>
                  <th className="text-left p-3 font-medium text-text-light">Used</th>
                  <th className="text-right p-3 font-medium text-text-light">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promos.map(promo => (
                  <tr key={promo.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-mono font-bold">{promo.code}</td>
                    <td className="p-3">
                      {promo.type === 'percentage' ? `${promo.value}%` : formatPrice(promo.value)}
                    </td>
                    <td className="p-3">{promo.minPurchase ? formatPrice(promo.minPurchase) : '—'}</td>
                    <td className="p-3 text-text-light">{promo.expiresAt || 'Never'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {promo.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">{promo.usageCount}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => openEdit(promo)}
                        className="text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer mr-2">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(promo.id)}
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
      )}
    </div>
  );
}
