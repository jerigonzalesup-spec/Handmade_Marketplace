// Auth service
// - Handles token storage and simple auth-related helpers used by ViewModels and components.
// - Keep UI-agnostic logic here; network calls should use `src/services/api.js` or `src/api/api.js`.
// - To extend: add `refreshToken()` or role checks here and expose them to ViewModels.
import { apiFetch } from '../api/api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function parseJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch (e) {
    return null;
  }
}

export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  
  // Try to get stored user data first
  const storedUser = localStorage.getItem(USER_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      // If stored user is invalid, parse from token
    }
  }
  
  const payload = parseJwt(token);
  if (!payload) return null;
  return { id: payload.id, email: payload.email };
}

export async function register(name, email, password, role = 'buyer') {
  try {
    const body = { name, email, password, role };
    console.log('[AUTH] Registering user:', email);
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body // apiFetch will stringify
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `Server error: ${response.status}`);
    }

    // Save token and user
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    console.log('[AUTH] Registration successful');

    return data;
  } catch (err) {
    console.error('[AUTH] Registration error:', err);
    throw new Error(err.message || 'Failed to connect to server.');
  }
}

export async function login(email, password) {
  try {
    const body = { email, password };
    console.log('[AUTH] Logging in user:', email);
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body // apiFetch will stringify
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `Server error: ${response.status}`);
    }

    // Save token and user
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    console.log('[AUTH] Login successful');

    return data;
  } catch (err) {
    console.error('[AUTH] Login error:', err);
    throw new Error(err.message || 'Failed to connect to server.');
  }
}

const auth = { 
  getToken, 
  isAuthenticated, 
  logout, 
  getCurrentUser,
  login,
  register
};

export default auth;
