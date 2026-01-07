// AdminViewModel.js - Dashboard statistics
export default function AdminViewModel() {
  // Mock data for dashboard summary
  const stats = {
    totalUsers: 47,
    totalSellers: 12,
    totalProducts: 84,
    totalOrders: 156,
    recentActivity: [
      { type: 'new_user', user: 'Sarah Johnson', timestamp: '2 hours ago' },
      { type: 'new_product', product: 'Ceramic Vase', seller: 'Jane Smith', timestamp: '4 hours ago' },
      { type: 'new_order', items: 3, buyer: 'Mike Wilson', timestamp: '6 hours ago' },
      { type: 'seller_joined', user: 'Alex Chen', timestamp: '1 day ago' }
    ]
  };

  return {
    stats,
    getStatistics: () => stats,
    getRecentActivity: () => stats.recentActivity
  };
}
