import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignIn = location.pathname === '/signin';
  const isSignUp = location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Craftly
            </button>

            {/* Auth Link */}
            <div>
              {isSignIn && (
                <button
                  onClick={() => navigate('/signup')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Sign Up
                </button>
              )}
              {isSignUp && (
                <button
                  onClick={() => navigate('/signin')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
        {children}
      </main>
    </div>
  );
}
