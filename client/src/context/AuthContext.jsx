import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../api/api';
import * as authService from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiFetch('/auth/me', { method: 'GET' });
        if (!res.ok) {
          // token invalid
          authService.logout();
          setUser(null);
          setToken(null);
        } else {
          const data = await res.json();
          setUser(data.user || null);
          setOffline(false);
        }
      } catch (err) {
        console.error('[AUTH] Failed to load current user', err);
        // Detect network / backend-down situations
        const msg = err && (err.message || '').toString();
        if (msg.includes('Failed to fetch') || msg.includes('Network error') || err.status === 0) {
          setOffline(true);
        }
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const register = async (name, email, password, role) => {
    const data = await authService.register(name, email, password, role);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, offline, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
