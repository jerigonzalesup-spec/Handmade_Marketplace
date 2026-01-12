// Order ViewModel
// - Manages order-related UI state and actions (fetching user orders, creating orders).
// - Keep network logic in `src/services/order.service.js` and auth helpers in `src/services/auth.js`.
import { useCallback, useEffect, useState } from 'react';
import orderService from '../services/order.service';
import auth from '../services/auth';

export default function useOrderViewModel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMyOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = auth.getToken();
    if (!token) {
      // Not authenticated — do not call protected endpoint.
      setOrders([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      const res = await orderService.getMyOrders();
      setOrders(Array.isArray(res) ? res : []);
    } catch (err) {
      // Graceful handling: distinguish auth vs not-found
      if (err && err.status === 401) {
        setError('Unauthorized — please sign in');
        // keep orders empty
        setOrders([]);
      } else if (err && err.status === 404) {
        // No orders endpoint/data found — treat as empty
        setError(null);
        setOrders([]);
      } else {
        setError(err.message || 'Failed to load orders');
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = auth.getToken();
    if (token) {
      loadMyOrders();
    } else {
      // Ensure we show empty state when unauthenticated
      setOrders([]);
      setError(null);
    }
  }, [loadMyOrders]);

  const createOrder = useCallback(async (total) => {
    setLoading(true);
    setError(null);

    const token = auth.getToken();
    if (!token) {
      setLoading(false);
      const e = new Error('You must be signed in to place an order');
      e.status = 401;
      setError(e.message);
      throw e;
    }

    try {
      const res = await orderService.createOrder({ total });
      await loadMyOrders();
      return res;
    } catch (err) {
      if (err && err.status === 401) {
        setError('Unauthorized — please sign in');
      } else {
        setError(err.message || 'Failed to create order');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadMyOrders]);

  return { orders, loading, error, loadMyOrders, createOrder };
}
