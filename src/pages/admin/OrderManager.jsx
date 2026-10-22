import { useState } from 'react';
import { Eye, Trash2, X } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { formatPrice } from '../../utils/storage';

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered'];

export default function OrderManager() {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [viewOrder, setViewOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  function handleDelete(id) {
    if (confirm('Delete this order?')) deleteOrder(id);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="all">All Status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setViewOrder(null)}
              className="absolute top-4 right-4 text-text-light hover:text-text bg-transparent border-none cursor-pointer">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-3 text-sm">
              <p><strong>Order ID:</strong> {viewOrder.id}</p>
              <p><strong>Date:</strong> {new Date(viewOrder.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong>
                <select
                  value={viewOrder.status}
                  onChange={e => {
                    updateOrderStatus(viewOrder.id, e.target.value);
                    setViewOrder({ ...viewOrder, status: e.target.value });
                  }}
                  className="ml-2 px-2 py-1 border border-gray-200 rounded text-sm"
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </p>
              {viewOrder.promoCode && <p><strong>Promo Code:</strong> {viewOrder.promoCode}</p>}

              <div className="border-t pt-3 mt-3">
                <h3 className="font-semibold mb-2">Items</h3>
                {viewOrder.items.map((item, i) => (
                  <div key={i} className="flex gap-3 mb-3 p-2 bg-gray-50 rounded-lg">
                    <img src={item.product.images[0]} alt="" className="w-14 h-14 rounded object-cover" />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-text-light text-xs">
                        Size: {item.selectedSize} &middot; Color: {item.selectedColor} &middot; Qty: {item.quantity}
                      </p>
                      <p className="text-primary font-medium text-xs">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(viewOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <p className="text-text-light">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-text-light">Order ID</th>
                  <th className="text-left p-3 font-medium text-text-light">Items</th>
                  <th className="text-left p-3 font-medium text-text-light">Total</th>
                  <th className="text-left p-3 font-medium text-text-light">Status</th>
                  <th className="text-left p-3 font-medium text-text-light">Date</th>
                  <th className="text-right p-3 font-medium text-text-light">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
                    <td className="p-3">{order.items.length} item(s)</td>
                    <td className="p-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-none cursor-pointer ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td className="p-3 text-text-light">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => setViewOrder(order)}
                        className="text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer mr-2">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleDelete(order.id)}
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
