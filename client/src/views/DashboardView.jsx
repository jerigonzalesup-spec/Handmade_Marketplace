import Card from '../components/Card';
import React from 'react';
import useAuthViewModel from '../viewModels/AuthViewModel';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function DashboardView() {
  const { logout, currentUser } = useAuthViewModel();
  const user = currentUser ? currentUser() : null;
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-8 px-3 sm:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padding="lg" shadow="md" className="mb-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">{user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-900">Welcome back{user && user.name ? `, ${user.name.split(' ')[0]}` : ''}!</h1>
                <p className="text-sm text-gray-600">Manage your account, products, and orders from one place.</p>
              </div>
              <div className="ml-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user && (user.role === 'seller' || user.isSeller) ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>{user && (user.role === 'seller' || user.isSeller) ? 'Seller' : (user && user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Buyer')}</span>
              </div>
            </div>
          </Card>

          <Card padding="lg" shadow="sm" className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button aria-label="Go to My Account" onClick={() => navigate('/account')} className="p-4 bg-white rounded-lg hover:shadow-md border border-gray-200 text-left">
                <div className="text-sm font-semibold text-gray-900">My Account</div>
                <div className="text-xs text-gray-500 mt-1">View profile & settings</div>
              </button>
              <button aria-label="Create a new product" onClick={() => navigate('/crafts/create')} className="p-4 bg-white rounded-lg hover:shadow-md border border-gray-200 text-left">
                <div className="text-sm font-semibold text-gray-900">Create Product</div>
                <div className="text-xs text-gray-500 mt-1">List a new craft for sale</div>
              </button>
              <button aria-label="View my orders" onClick={() => navigate('/my-orders')} className="p-4 bg-white rounded-lg hover:shadow-md border border-gray-200 text-left">
                <div className="text-sm font-semibold text-gray-900">My Orders</div>
                <div className="text-xs text-gray-500 mt-1">View purchases & status</div>
              </button>
            </div>
          </Card>

        </div>

        <aside>
          <Card padding="lg" shadow="sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Account</h3>
            <div className="text-sm text-gray-600 mb-4">
              <div><strong className="text-gray-800">Email:</strong> <span className="text-gray-600">{user && user.email}</span></div>
            </div>
            <Button onClick={logout} variant="danger" size="md" fullWidth>Logout</Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
