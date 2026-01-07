import React from 'react';
import useOrderViewModel from '../viewModels/OrderViewModel';
import Card from '../components/Card';
import Alert from '../components/Alert';

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

export default function MyOrdersView() {
  const vm = useOrderViewModel();
  const { orders, loading, error } = vm;

  if (loading) return <div className="max-w-3xl mx-auto py-12"><div className="text-center text-gray-600">⏳ Loading your orders...</div></div>;
  if (error) return <div className="max-w-3xl mx-auto py-6 px-3 sm:px-4"><Alert type="error">{error}</Alert></div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-3 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">My Orders</h1>
      {orders.length === 0 && (
        <Card padding="lg" shadow="sm">
          <div className="text-gray-500 text-center py-8">
            <p className="text-lg font-medium mb-3">📭 You have no orders yet.</p>
            <p className="text-sm text-gray-600"><a href="/" className="text-indigo-600 font-medium hover:underline">Browse crafts</a> to get started!</p>
          </div>
        </Card>
      )}
      {orders.length > 0 && (
        <div className="space-y-3">
          {orders.map(o => (
            <Card key={o.id} padding="md" shadow="sm" interactive>
              <div style={{ borderLeftColor: getStatusColor(o.status), borderLeftWidth: '4px' }} className="pl-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <h3 className="m-0 mb-1 font-semibold text-gray-900">Order #{o.id}</h3>
                    <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-white px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ background: getStatusColor(o.status) }}>{o.status}</div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-lg font-bold text-indigo-600">Total: ${(o.total || 0).toFixed(2)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
