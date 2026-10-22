import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { usePromos } from '../../context/PromoContext';
import { formatPrice } from '../../utils/storage';

export default function Dashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { promos } = usePromos();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const activePromos = promos.filter(p => p.active).length;

  const stats = [
    { icon: Package, label: 'Total Products', value: products.length, color: 'text-blue-600 bg-blue-100' },
    { icon: ShoppingCart, label: 'Total Orders', value: orders.length, color: 'text-green-600 bg-green-100', sub: `${pendingOrders} pending` },
    { icon: DollarSign, label: 'Total Revenue', value: formatPrice(totalRevenue), color: 'text-primary bg-primary/10' },
    { icon: TrendingUp, label: 'Active Promos', value: activePromos, color: 'text-purple-600 bg-purple-100' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color, sub }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
              <span className="text-sm text-text-light">{label}</span>
            </div>
            <p className="text-2xl font-bold m-0">{value}</p>
            {sub && <p className="text-xs text-text-light mt-1 m-0">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold m-0">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-5 text-text-light text-sm">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-text-light">Order ID</th>
                  <th className="text-left p-3 font-medium text-text-light">Items</th>
                  <th className="text-left p-3 font-medium text-text-light">Total</th>
                  <th className="text-left p-3 font-medium text-text-light">Status</th>
                  <th className="text-left p-3 font-medium text-text-light">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-t border-gray-100">
                    <td className="p-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
                    <td className="p-3">{order.items.length} item(s)</td>
                    <td className="p-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-text-light">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
