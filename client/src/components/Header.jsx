import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ isAuthenticated, userName, onLoginClick, onLogoutClick }) {
  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl font-bold text-gray-900">Craftly</Link>
          <nav className="hidden md:flex gap-4 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <Link to="/my-orders" className="hover:text-gray-900">My Orders</Link>
            <Link to="/account" className="hover:text-gray-900">Account</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-500">Welcome, <strong className="text-gray-800">{userName || 'User'}</strong></span>
              <button onClick={onLogoutClick} className="px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm font-medium">Logout</button>
            </>
          ) : (
            <button onClick={onLoginClick} className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium">Login</button>
          )}
        </div>
      </div>
    </header>
  );
}
