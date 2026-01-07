import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function formatPHP(n) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.getCart();
        if (!mounted) return;
        // res items include craft details
        const normalized = res.map(i => ({
          craftId: i.craftId,
          qty: i.qty,
          craft: i.craft
        }));
        setCartItems(normalized);
      } catch (err) {
        console.error('[CART] load error', err);
        setError(err.message || 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.craft?.price || 0) * item.qty, 0);
  const shipping = subtotal > 2500 ? 0 : 150; // PHP cents assumed, keep simple
  const tax = subtotal * 0.12; // VAT example
  const total = subtotal + shipping + tax;

  async function persistCart(updatedItems) {
    try {
      const payload = updatedItems.map(i => ({ craftId: i.craftId, qty: i.qty }));
      await api.setCart(payload);
    } catch (err) {
      console.error('[CART] persist error', err);
      setError(err.message || 'Failed to update cart');
    }
  }

  function handleContinueShopping() {
    navigate('/buyer');
  }

  function handleCheckout() {
    if (cartItems.length > 0) {
      navigate('/checkout');
    } else {
      setError('Cart is empty');
    }
  }

  function updateQty(craftId, newQty) {
    const found = cartItems.find(i => i.craftId === craftId);
    if (!found) return;
    const max = found.craft?.stock || Infinity;
    const qty = Math.max(1, Math.min(newQty, max));
    const updated = cartItems.map(i => i.craftId === craftId ? { ...i, qty } : i);
    setCartItems(updated);
    persistCart(updated);
  }

  function removeItem(craftId) {
    const updated = cartItems.filter(i => i.craftId !== craftId);
    setCartItems(updated);
    persistCart(updated);
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <button
            onClick={() => navigate('/buyer')}
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700"
            id="cart-logo"
            name="cart-logo"
          >
            Craftly
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900">Shopping Cart</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Explore our marketplace and find amazing handcrafted items.
            </p>
            <button
              onClick={handleContinueShopping}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {cartItems.length} Item{cartItems.length !== 1 ? 's' : ''} in Cart
                </h2>

                <div className="space-y-6">
                  {loading ? (
                    <div>Loading cart...</div>
                  ) : error ? (
                    <div className="text-red-600">{error}</div>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item.craftId}
                        id={`cart-item-${item.craftId}`}
                        className="flex gap-4 border-b border-gray-200 pb-6 last:border-0"
                      >
                        {/* Product Image */}
                        <img
                          src={item.craft?.image || 'https://via.placeholder.com/80'}
                          alt={item.craft?.title}
                          className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                        />

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-base">{item.craft?.title}</h3>
                          <p className="text-sm text-gray-600">Seller</p>
                          <p className="text-lg font-bold text-indigo-600 mt-2">
                            {formatPHP(item.craft?.price || 0)}
                          </p>
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQty(item.craftId, item.qty - 1)}
                              id={`qty-decrease-${item.craftId}`}
                              name={`qty-decrease-${item.craftId}`}
                              className="px-2 py-1 text-gray-600 hover:text-gray-900"
                            >
                              −
                            </button>
                            <span className="px-3 py-1 font-semibold text-gray-900">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.craftId, item.qty + 1)}
                              id={`qty-increase-${item.craftId}`}
                              name={`qty-increase-${item.craftId}`}
                              className={`px-2 py-1 text-gray-600 hover:text-gray-900 ${item.qty >= (item.craft?.stock || 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={item.qty >= (item.craft?.stock || 0)}
                            >
                              +
                            </button>
                          </div>
                          {item.qty >= (item.craft?.stock || 0) && (
                            <div className="text-sm text-red-600 ml-2">Stock limit reached</div>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.craftId)}
                          id={`remove-item-${item.craftId}`}
                          name={`remove-item-${item.craftId}`}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Continue Shopping Button */}
              <button
                onClick={handleContinueShopping}
                className="w-full px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                id="continue-shopping-btn"
                name="continue-shopping-btn"
              >
                Continue Shopping
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Note */}
                {shipping > 0 && (
                  <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                    Free shipping on orders over $50! Add ${(50 - subtotal).toFixed(2)} more.
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  id="checkout-btn"
                  name="checkout-btn"
                  className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </button>

                {/* Security Badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9l3.293 3.293a1 1 0 01-1.414 1.414l-4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
