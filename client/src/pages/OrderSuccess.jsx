import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function formatPHP(n) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);
}

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order || null;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h2 className="text-xl font-semibold">Order completed</h2>
          <p>We couldn't find order details.</p>
          <div className="mt-4">
            <button onClick={() => navigate('/buyer')} className="px-4 py-2 bg-indigo-600 text-white rounded">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow text-center max-w-md">
        <h2 className="text-2xl font-semibold mb-2">Order placed successfully!</h2>
        <p className="mb-4">Order ID: <strong>{order.id}</strong></p>
        <p className="mb-6">Total: <strong>{formatPHP(order.total)}</strong></p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/buyer/orders')} className="px-4 py-2 bg-green-600 text-white rounded">Go to My Orders</button>
          <button onClick={() => navigate('/buyer')} className="px-4 py-2 bg-gray-100 rounded">Back to Home</button>
        </div>
      </div>
    </div>
  );
}
