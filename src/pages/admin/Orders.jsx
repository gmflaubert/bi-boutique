import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useOrders } from '../../context/OrderContext'
import { formatPrice } from '../../utils'

const STATUSES = ['all', 'pending', 'confirmed', 'shipped', 'delivered']

const statusColors = {
  pending: { bg: '#fef3c7', color: '#92400e' },
  confirmed: { bg: '#dbeafe', color: '#1e40af' },
  shipped: { bg: '#e0e7ff', color: '#3730a3' },
  delivered: { bg: '#dcfce7', color: '#166534' },
}

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useOrders()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>Orders</h1>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-2 rounded-full text-sm font-medium capitalize cursor-pointer border-none"
            style={{
              backgroundColor: filter === s ? 'var(--color-primary)' : 'white',
              color: filter === s ? 'white' : 'var(--color-text-light)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <p className="text-center py-10" style={{ color: 'var(--color-text-light)' }}>No orders found</p>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xs" style={{ color: 'var(--color-text-light)' }}>#{order.id}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none bg-white cursor-pointer capitalize"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {STATUSES.filter(s => s !== 'all').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button onClick={() => deleteOrder(order.id)} className="p-1.5 cursor-pointer" style={{ color: '#ef4444', background: 'none', border: 'none' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>{item.product.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                        {item.selectedSize} / {item.selectedColor} x{item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                    style={statusColors[order.status] || {}}
                  >
                    {order.status}
                  </span>
                  {order.promoCode && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {order.promoCode}
                    </span>
                  )}
                </div>
                <p className="font-bold" style={{ color: 'var(--color-primary)' }}>{formatPrice(order.total)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
