// Home ViewModel
// - Loads public/home data (crafts) and provides actions used by Home views.
// - Keep network calls in `src/services/api.js` and auth in `src/services/auth.js`.
import { useEffect, useState } from 'react';
import api from '../services/api';
import authService from '../services/auth';

// If a 401 occurs, logout and redirect to login
function handleAuthError(err) {
  if (err && err.status === 401) {
    authService.logout();
    window.location = '/login';
    return true;
  }
  return false;
}

export default function HomeViewModel() {
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authState, setAuthState] = useState({ isAuthenticated: false, userName: null, userId: null });

  useEffect(() => {
    // check auth status and fetch crafts if authenticated
    const user = authService.getCurrentUser();
    setAuthState({
      isAuthenticated: !!user,
      userName: user ? user.email.split('@')[0] : null,
      userId: user ? Number(user.id) : null
    });

    if (user) {
      loadCrafts();
    }
  }, []);

  const loadCrafts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCrafts();
      setCrafts(Array.isArray(res) ? res : []);
    } catch (err) {
      if (handleAuthError(err)) return;
      setError(err.message || 'Failed to load crafts');
      setCrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const res = await api.get('/health');
      return !!res;
    } catch (err) {
      return false;
    }
  };

  const createCraft = async (title, description, price) => {
    const res = await api.post('/api/crafts', { title, description, price });
    return res;
  };

  const updateCraft = async (id, data) => {
    const res = await api.updateCraft(id, data);
    return res;
  };

  const deleteCraft = async (id) => {
    const res = await api.deleteCraft(id);
    return res;
  };

  const fetchOrders = async () => {
    const res = await api.get('/api/orders');
    return res;
  };

  const login = async (email, password) => {
    // reuse existing auth service for login (stores token)
    const res = await authService.login(email, password);
    if (res && res.token) {
      const user = authService.getCurrentUser();
      const userName = user ? user.email.split('@')[0] : email.split('@')[0];
      setAuthState({ isAuthenticated: true, userName, userId: user ? Number(user.id) : null });
      await loadCrafts();
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setAuthState({ isAuthenticated: false, userName: null, userId: null });
    setCrafts([]);
  };

  const isAuthenticated = () => authState.isAuthenticated;

  return {
    crafts,
    loading,
    error,
    loadCrafts,
    checkHealth,
    createCraft,
    updateCraft,
    deleteCraft,
    fetchOrders,
    login,
    logout,
    isAuthenticated,
    auth: authState
  };
}

