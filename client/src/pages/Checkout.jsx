import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function formatPHP(n) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);
}

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ fullName: '', address: '', phone: '' });

  useEffect(() => {
    let m = true;
    (async () => {
      try {
        const res = await api.getCart();
        if (!m) return;
        if (!Array.isArray(res)) {
          throw new Error('Invalid cart data received');
        }
        setCartItems(res.map(i => ({ craft: i.craft, qty: i.qty })));
        if (res.length === 0) {
          setError('Your cart is empty. Please add items before checking out.');
        }
      } catch (err) {
        console.error('[CHECKOUT] load cart error', err);
        setError(err.message || 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    })();
    return () => { m = false; };
  }, []);

  const subtotal = cartItems.reduce((s, it) => s + (it.craft?.price || 0) * it.qty, 0);
  const shipping = subtotal > 2500 ? 0 : 150;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Cart is empty');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        fullName: form.fullName,
        address: form.address,
        phone: form.phone
      };
      const order = await api.placeOrder(payload);
      if (!order || !order.id) {
        throw new Error('Invalid order response from server');
      }
      navigate('/order-success', { state: { order } });
    } catch (err) {
      console.error('[CHECKOUT] place order error', err);
      const errorMsg = err.message || 'Failed to place order';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-3">
                {cartItems.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <div className="font-medium">{it.craft?.title}</div>
                      <div className="text-sm text-gray-600">Qty: {it.qty}</div>
                    </div>
                    <div className="font-semibold">{formatPHP((it.craft?.price || 0) * it.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPHP(subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPHP(shipping)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>{formatPHP(tax)}</span></div>
                <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>{formatPHP(total)}</span></div>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Full name</label>
                <input className="w-full border rounded px-3 py-2" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium">Address</label>
                <textarea className="w-full border rounded px-3 py-2" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input className="w-full border rounded px-3 py-2" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
              </div>
              <div>
                <button type="submit" disabled={submitting} className="w-full bg-green-600 text-white px-4 py-2 rounded">
                  {submitting ? 'Placing order...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
