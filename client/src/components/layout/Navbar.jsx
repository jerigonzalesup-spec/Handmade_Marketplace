import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuthViewModel from '../../viewModels/AuthViewModel';
import userService from '../../services/user.service';

function linkClass({ isActive }) {
  return isActive 
    ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1' 
    : 'text-gray-700 hover:text-gray-900 pb-1';
}

export default function Navbar() {
  const vm = useAuthViewModel();
  const isAuth = vm.isAuthenticated();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (isAuth) {
      userService.getMe().then(u => { if (mounted) setUser(u); }).catch(() => {});
    } else {
      setUser(null);
    }
    return () => { mounted = false; };
  }, [isAuth]);

  useEffect(() => {
    setMenuOpen(false);
  }, [isAuth]);

  const roleIsSeller = user && user.isSeller;
  const roleIsAdmin = user && (user.email?.includes('admin') || user.role === 'admin' || user.isAdmin);

  return (
    <header className="sticky top-0 z-30 bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <NavLink to="/" className="text-2xl font-extrabold text-gray-900">Craftly</NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center gap-6">
          <NavLink to="/" className={linkClass}>Marketplace</NavLink>
          {isAuth && <NavLink to="/my-orders" className={linkClass}>My Orders</NavLink>}
          {isAuth && <NavLink to="/account" className={linkClass}>Account</NavLink>}
          {roleIsSeller && <NavLink to="/dashboard" className={linkClass}>My Products</NavLink>}
          {roleIsSeller && <NavLink to="/seller/orders" className={linkClass}>Orders</NavLink>}
          {roleIsAdmin && (
            <>
              <NavLink to="/admin" className={linkClass}>🔧 Dashboard</NavLink>
              <NavLink to="/admin/users" className={linkClass}>👥 Users</NavLink>
              <NavLink to="/admin/products" className={linkClass}>📦 Products</NavLink>
            </>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuth && (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className={linkClass}>Register</NavLink>
            </>
          )}

          {isAuth && (
            <>
              <div className="text-sm text-gray-600">{user ? (user.name || user.email) : 'User'}</div>
              <button onClick={vm.logout} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <NavLink 
            to="/" 
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Marketplace
          </NavLink>
          {isAuth && (
            <>
              <NavLink 
                to="/my-orders" 
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                My Orders
              </NavLink>
              <NavLink 
                to="/account" 
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Account
              </NavLink>
            </>
          )}
          {roleIsSeller && (
            <>
              <NavLink 
                to="/dashboard" 
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                My Products
              </NavLink>
              <NavLink 
                to="/seller/orders" 
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Orders
              </NavLink>
            </>
          )}
          {roleIsAdmin && (
            <>
              <NavLink 
                to="/admin" 
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                🔧 Admin Dashboard
              </NavLink>
              <NavLink 
                to="/admin/users" 
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                👥 Manage Users
              </NavLink>
              <NavLink 
                to="/admin/products" 
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                📦 Manage Products
              </NavLink>
            </>
          )}
          <div className="border-t border-gray-200 pt-3">
            {!isAuth && (
              <>
                <NavLink 
                  to="/login" 
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Register
                </NavLink>
              </>
            )}
            {isAuth && (
              <>
                <div className="px-3 py-2 text-sm text-gray-600">{user ? (user.name || user.email) : 'User'}</div>
                <button 
                  onClick={() => { vm.logout(); setMenuOpen(false); }} 
                  className="w-full text-left px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
