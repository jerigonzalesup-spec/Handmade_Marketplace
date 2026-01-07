import Card from '../components/Card';
import React from 'react';
import useOrderViewModel from '../viewModels/OrderViewModel';
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

  if (loading) return <div className="max-w-3xl mx-auto py-6"><div className="text-center text-gray-600">⏳ Loading your orders...</div></div>;
  if (error) return <div className="max-w-3xl mx-auto py-6"><Alert type="error">{error}</Alert></div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-3 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">My Orders</h1>
      {orders.length === 0 && (
        <div className="text-gray-500 p-6 bg-gray-50 rounded text-center">
          <p className="text-lg mb-3">📭 You have no orders yet.</p>
          <p className="text-sm"><a href="/" className="text-indigo-600 hover:underline">Browse crafts</a> to get started!</p>
        </div>
      )}
      {orders.length > 0 && (
        <div className="grid gap-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white p-4 rounded shadow-sm border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: getStatusColor(o.status) }}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="m-0 mb-1 font-semibold">Order #{o.id}</h3>
                  <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-white px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ background: getStatusColor(o.status) }}>{o.status}</div>
              </div>
              <div className="mt-3 border-t pt-3">
                <div className="text-lg font-bold text-gray-800">Total: ${(o.total || 0).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
