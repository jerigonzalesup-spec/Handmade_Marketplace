import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthViewModel from '../viewModels/AuthViewModel';
import Button from './Button';

export default function AdminRoute() {
  const vm = useAuthViewModel();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from JWT
    const currentUser = vm.currentUser?.();
    setUser(currentUser);
  }, [vm]);

  // Mock admin detection: users with email containing 'admin' are admins
  // In a real app, this would come from the backend
  const isAdmin = user?.email?.includes('admin') || user?.role === 'admin' || user?.isAdmin === true;

  useEffect(() => {
    if (!vm.isAuthenticated() || !isAdmin) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            navigate('/login', { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [vm.isAuthenticated(), isAdmin, navigate]);

  if (!vm.isAuthenticated() || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🛑</div>
          <h2 className="text-2xl font-semibold mb-2">Admin Access Only</h2>
          <p className="text-gray-600 mb-6">This area is restricted to administrators.</p>
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">Redirecting in <span className="font-bold">{countdown}</span> seconds...</p>
          </div>
          <Button onClick={() => navigate('/')} variant="primary" size="md">Back to Home</Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
