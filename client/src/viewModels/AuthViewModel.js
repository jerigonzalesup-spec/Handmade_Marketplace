// Auth ViewModel
// - Responsible for auth-related view state (logout, current user checks).
// - Keep UI logic here; call `client/src/services/auth.js` for persistence.
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../services/auth';

export default function useAuthViewModel() {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    auth.logout();
    navigate('/login');
  }, [navigate]);

  const isAuthenticated = useCallback(() => auth.isAuthenticated(), []);

  const currentUser = useCallback(() => auth.getCurrentUser(), []);

  return { logout, isAuthenticated, currentUser };
}
