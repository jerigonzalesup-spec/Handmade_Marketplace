import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import useAuthViewModel from '../viewModels/AuthViewModel';

export default function AppLayout() {
  const vm = useAuthViewModel();

  const user = vm.currentUser ? vm.currentUser() : null;
  const isSeller = user && user.isSeller;

  return (
    <div className="bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4 items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900 font-medium">Home</Link>
          <Link to="/my-orders" className="hover:text-gray-900 font-medium">My Orders</Link>
          <Link to="/account" className="hover:text-gray-900 font-medium">Account</Link>
          {isSeller && (
            <>
              <Link to="/dashboard" className="hover:text-gray-900 font-medium">My Crafts</Link>
              <Link to="/seller/orders" className="hover:text-gray-900 font-medium">Seller Orders</Link>
            </>
          )}
        </div>
      </nav>
      <main>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
