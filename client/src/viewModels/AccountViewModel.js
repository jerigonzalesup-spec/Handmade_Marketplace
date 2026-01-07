import { useCallback, useEffect, useState } from 'react';
import userService from '../services/user.service';

export default function AccountViewModel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getMe();
      setUser(res);
    } catch (err) {
      setError(err.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const becomeSeller = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.becomeSeller();
      setUser(res);
      return res;
    } catch (err) {
      setError(err.message || 'Failed to update');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, load, becomeSeller };
}
