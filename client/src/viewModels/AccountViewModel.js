// Account ViewModel
// - Responsible for loading current user info and actions like `becomeSeller` and `logout`.
// - Keep network calls in `src/services/user.service.js` and auth helpers in `src/services/auth.js`.
import { useCallback, useEffect, useState } from 'react';
import userService from '../services/user.service';
import auth from '../services/auth';

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

  const logout = useCallback(() => {
    try {
      auth.logout();
    } catch (e) {
      // noop
    }
    // best-effort navigate to home/signin
    try { window.location.href = '/signin'; } catch (e) {}
  }, []);

  return { user, loading, error, load, becomeSeller, logout };
}
