import React from 'react';
import useSellerOrderViewModel from '../viewModels/SellerOrderViewModel';
import Alert from '../components/Alert';
import Card from '../components/Card';

const getStatusColor = (status) => {
  const colors = {
    'pending': '#f39c12',
    'processing': '#3498db',
    'shipped': '#2ecc71',
    'delivered': '#27ae60',
    'cancelled': '#e74c3c'
  };
  return colors[status?.toLowerCase()] || '#95a5a6';
};

export default function SellerOrdersView() {
  const vm = useSellerOrderViewModel();
  const { orders, loading, error, load } = vm;

  const [updating, setUpdating] = React.useState(null);

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const handleChangeStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await import('../services/order.service').then(m => m.default.updateOrderStatus(orderId, status));
      await load();
    } catch (err) {
      console.error('[SELLER] update status error', err);
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto py-6"><div className="text-center text-gray-600">⏳ Loading your orders...</div></div>;
  if (error) return <div className="max-w-4xl mx-auto py-6"><Alert type="error">{error}</Alert></div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-3 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Orders for My Crafts</h1>
      {orders.length === 0 && (
        <Card padding="lg" shadow="sm">
          <div className="text-gray-500 text-center py-8">
            <p className="text-lg font-medium">📭 No orders for your crafts yet.</p>
            <p className="text-sm text-gray-600 mt-2">When someone purchases your products, orders will appear here.</p>
          </div>
        </Card>
      )}
      {orders.length > 0 && (
        <div className="grid gap-4 overflow-x-auto">
          {orders.map(o => (
            <div key={o.id} className="bg-white p-4 rounded shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: getStatusColor(o.status) }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Order #</div>
                  <h3 className="m-0 font-semibold">#{o.id}</h3>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Craft</div>
                  <p className="m-0 font-medium">{o.Craft ? o.Craft.title : '—'}</p>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Buyer</div>
                  <p className="m-0 font-medium">{o.User ? (o.User.name || o.User.email) : '—'}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block text-xs font-bold text-white px-3 py-1 rounded-full" style={{ background: getStatusColor(o.status) }}>{o.status}</div>
                </div>
              </div>
              <div className="mt-3 border-t pt-3 flex justify-between items-center">
                <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                <div className="text-lg font-bold text-gray-800">Total: {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(o.total || 0)}</div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <label className="text-sm text-gray-600">Update status:</label>
                <select value={o.status} onChange={(e) => handleChangeStatus(o.id, e.target.value)} disabled={updating === o.id} className="px-3 py-1 border rounded">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
