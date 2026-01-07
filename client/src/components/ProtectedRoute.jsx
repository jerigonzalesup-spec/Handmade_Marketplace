import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!user) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            navigate('/signin', { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [navigate, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">Redirecting to login in <span className="font-bold">{countdown}</span> seconds...</p>
          </div>
          <button 
            onClick={() => navigate('/signin')}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
