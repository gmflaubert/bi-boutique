import { Package, ShoppingCart, DollarSign, Tag } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { useOrders } from '../../context/OrderContext'
import { usePromos } from '../../context/PromoContext'
import { formatPrice } from '../../utils'

export default function Dashboard() {
  const { products } = useProducts()
  const { orders } = useOrders()
  const { promos } = usePromos()

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const activePromos = promos.filter(p => p.active).length

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Total Orders', value: orders.length, sub: `${pendingOrders} pending`, icon: ShoppingCart, color: '#22c55e', bg: '#f0fdf4' },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'var(--color-primary)', bg: 'var(--color-bg)' },
    { label: 'Active Promos', value: activePromos, icon: Tag, color: '#8b5cf6', bg: '#f5f3ff' },
  ]

  const statusColors = {
    pending: { bg: '#fef3c7', color: '#92400e' },
    confirmed: { bg: '#dbeafe', color: '#1e40af' },
    shipped: { bg: '#e0e7ff', color: '#3730a3' },
    delivered: { bg: '#dcfce7', color: '#166534' },
  }

  const recentOrders = orders.slice(0, 5)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>{s.label}</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.bg, color: s.color }}>
                <s.icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{s.value}</p>
            {s.sub && <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-5 text-sm text-center" style={{ color: 'var(--color-text-light)' }}>No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Order ID</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Items</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Total</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Status</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--color-text-light)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="p-3 font-mono text-xs">{order.id}</td>
                    <td className="p-3">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td className="p-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                        style={statusColors[order.status] || {}}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3" style={{ color: 'var(--color-text-light)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
