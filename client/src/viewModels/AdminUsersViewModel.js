// AdminUsersViewModel.js - User management
export default function AdminUsersViewModel() {
  // Mock user data
  const users = [
    { id: 1, name: 'Alice Brown', email: 'alice@example.com', role: 'admin', status: 'Active', joinDate: '2025-10-15' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'seller', status: 'Active', joinDate: '2025-11-20' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'buyer', status: 'Active', joinDate: '2025-12-01' },
    { id: 4, name: 'David Lee', email: 'david@example.com', role: 'buyer', status: 'Active', joinDate: '2025-12-05' },
    { id: 5, name: 'Emma Wilson', email: 'emma@example.com', role: 'seller', status: 'Active', joinDate: '2025-12-10' },
    { id: 6, name: 'Frank Johnson', email: 'frank@example.com', role: 'buyer', status: 'Active', joinDate: '2025-12-15' },
    { id: 7, name: 'Grace Chen', email: 'grace@example.com', role: 'seller', status: 'Active', joinDate: '2025-12-18' },
    { id: 8, name: 'Henry Davis', email: 'henry@example.com', role: 'buyer', status: 'Active', joinDate: '2025-12-20' }
  ];

  const loading = false;
  const error = null;

  return {
    users,
    loading,
    error,
    getUsers: () => users,
    disableUser: (userId) => {
      console.log(`Disabled user ${userId}`);
    },
    promoteToSeller: (userId) => {
      const user = users.find(u => u.id === userId);
      if (user && user.role === 'buyer') {
        user.role = 'seller';
        console.log(`Promoted user ${userId} to seller`);
      }
    },
    viewUser: (userId) => {
      return users.find(u => u.id === userId);
    }
  };
}
