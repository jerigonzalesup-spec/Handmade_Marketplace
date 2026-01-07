import { useCallback, useEffect, useState } from 'react';
import orderService from '../services/order.service';

export default function useSellerOrderViewModel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await orderService.getSellerOrders();
      setOrders(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      setOrders([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { orders, loading, error, load };
}
