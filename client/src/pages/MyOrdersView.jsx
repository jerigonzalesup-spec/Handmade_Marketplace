import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function formatPHP(n) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);
}

export default function MyOrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/orders');
        setOrders(res || []);
      } catch (err) {
        console.error('[ORDERS] load error', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div>No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">Order #{o.id}</div>
                  <div className="text-sm text-gray-600">{new Date(o.date || Date.now()).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatPHP(o.total)}</div>
                  <div className="text-sm">{o.status || 'Pending'}</div>
                </div>
              </div>
              <div className="mt-2">
                <button onClick={() => navigate(`/buyer/orders/${o.id}`)} className="text-indigo-600">View details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
