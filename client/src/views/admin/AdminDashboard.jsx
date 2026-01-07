import Card from '../../components/Card';
import React from 'react';
import AdminViewModel from '../../viewModels/AdminViewModel';

export default function AdminDashboard() {
  const vm = AdminViewModel();
  const { stats, getRecentActivity } = vm;
  const recentActivity = getRecentActivity();

  const StatCard = ({ label, value, icon }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-semibold uppercase">{label}</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Overview of your platform activity</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" />
        <StatCard label="Total Sellers" value={stats.totalSellers} icon="🏪" />
        <StatCard label="Total Products" value={stats.totalProducts} icon="📦" />
        <StatCard label="Total Orders" value={stats.totalOrders} icon="🛒" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-2xl">
                  {activity.type === 'new_user' && '👤'}
                  {activity.type === 'new_product' && '📦'}
                  {activity.type === 'new_order' && '🛒'}
                  {activity.type === 'seller_joined' && '🏪'}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    {activity.type === 'new_user' && `New user: ${activity.user}`}
                    {activity.type === 'new_product' && `New product: ${activity.product} by ${activity.seller}`}
                    {activity.type === 'new_order' && `New order: ${activity.items} items from ${activity.buyer}`}
                    {activity.type === 'seller_joined' && `New seller: ${activity.user}`}
                  </p>
                  <p className="text-gray-500 text-sm">{activity.timestamp}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg shadow-sm p-6 border border-indigo-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a href="/admin/users" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            <p className="font-semibold text-indigo-600">Manage Users</p>
            <p className="text-sm text-gray-600">View and manage user accounts</p>
          </a>
          <a href="/admin/products" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200">
            <p className="font-semibold text-indigo-600">Manage Products</p>
            <p className="text-sm text-gray-600">View and manage product listings</p>
          </a>
        </div>
      </div>
    </div>
  );
}
