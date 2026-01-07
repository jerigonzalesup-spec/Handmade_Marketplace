import Card from '../../components/Card';
import React, { useState } from 'react';
import AdminUsersViewModel from '../../viewModels/AdminUsersViewModel';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Input from '../../components/Input';
import DataTable from '../../components/DataTable';
import ButtonGroup from '../../components/ButtonGroup';

export default function AdminUsers() {
  const vm = AdminUsersViewModel();
  const { users } = vm;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [actionFeedback, setActionFeedback] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handlePromote = (userId) => {
    vm.promoteToSeller(userId);
    setActionFeedback({ type: 'success', message: `User promoted to seller!` });
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleDisable = (userId) => {
    vm.disableUser(userId);
    setActionFeedback({ type: 'success', message: `User action logged!` });
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-800 border border-red-300';
      case 'seller': return 'bg-green-100 text-green-800 border border-green-300';
      default: return 'bg-blue-100 text-blue-800 border border-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Manage Users</h1>
        <p className="text-sm sm:text-base text-gray-600">View and manage user accounts ({filteredUsers.length} total)</p>
      </div>

      {actionFeedback && (
        <Alert type={actionFeedback.type} onClose={() => setActionFeedback(null)}>
          {actionFeedback.message}
        </Alert>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Input
              label="Search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <DataTable
          data={filteredUsers}
          emptyMessage="No users found. Try adjusting your search or filters."
          columns={[
            { key: 'name', header: 'Name', render: (u) => (<span className="text-sm font-medium text-gray-900">{u.name}</span>) },
            { key: 'email', header: 'Email', render: (u) => (<span className="text-sm text-gray-600">{u.email}</span>) },
            { key: 'role', header: 'Role', render: (u) => (<span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(u.role)}`}>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span>) },
            { key: 'status', header: 'Status', render: (u) => (<span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold border border-green-300">{u.status}</span>) },
            { key: 'joined', header: 'Joined', render: (u) => (new Date(u.joinDate).toLocaleDateString()) },
            { key: 'actions', header: 'Actions', render: (u) => (
              <ButtonGroup align="right" ariaLabel={`Actions for user ${u.name}`}>
                <Button aria-label={`View user ${u.name}`} variant="outline" size="sm" onClick={() => console.log(`View user ${u.id}`)}>View</Button>
                {u.role === 'buyer' && <Button aria-label={`Promote ${u.name} to seller`} variant="success" size="sm" onClick={() => handlePromote(u.id)}>→ Seller</Button>}
                <Button aria-label={`Disable user ${u.name}`} variant="danger" size="sm" onClick={() => handleDisable(u.id)}>Disable</Button>
              </ButtonGroup>
            ) }
          ]}
        />
      </div>
    </div>
  );
}
