import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../api/api';
import * as authService from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

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
        }
      } catch (err) {
        console.error('[AUTH] Failed to load current user', err);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const register = async (email, password, name, role) => {
    const data = await authService.register(email, password, name, role);
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
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
