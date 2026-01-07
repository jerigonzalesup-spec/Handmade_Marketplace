import Card from '../../components/Card';
import React, { useState } from 'react';
import AdminProductsViewModel from '../../viewModels/AdminProductsViewModel';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Input from '../../components/Input';
import DataTable from '../../components/DataTable';
import ButtonGroup from '../../components/ButtonGroup';

export default function AdminProducts() {
  const vm = AdminProductsViewModel();
  const { products } = vm;
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFeedback, setActionFeedback] = useState(null);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemove = (productId) => {
    vm.removeProduct(productId);
    setActionFeedback({ type: 'success', message: 'Product removed!' });
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleDisable = (productId) => {
    vm.disableProduct(productId);
    setActionFeedback({ type: 'success', message: 'Product disabled!' });
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 border border-green-300';
      case 'Disabled': return 'bg-red-100 text-red-800 border border-red-300';
      default: return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Manage Products</h1>
        <p className="text-sm sm:text-base text-gray-600">View and manage product listings ({filteredProducts.length} total)</p>
      </div>

      {actionFeedback && (
        <Alert type={actionFeedback.type} onClose={() => setActionFeedback(null)}>
          {actionFeedback.message}
        </Alert>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <Input
          label="Search Products"
          placeholder="Search by product name or seller..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <DataTable
          data={filteredProducts}
          emptyMessage="No products found. Try adjusting your search criteria."
          columns={[
            { key: 'title', header: 'Product Name', render: (p) => (<span className="text-sm font-medium text-gray-900">{p.title}</span>) },
            { key: 'seller', header: 'Seller', render: (p) => (<span className="text-sm text-gray-600">{p.seller}</span>) },
            { key: 'price', header: 'Price', render: (p) => (<span className="text-sm font-semibold text-gray-900">${p.price.toFixed(2)}</span>) },
            { key: 'status', header: 'Status', render: (p) => (<span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(p.status)}`}>{p.status}</span>) },
            { key: 'created', header: 'Created', render: (p) => (new Date(p.createdAt).toLocaleDateString()) },
            { key: 'actions', header: 'Actions', render: (p) => (
              <ButtonGroup align="right" ariaLabel={`Actions for product ${p.title}`}>
                <Button aria-label={`View product ${p.title}`} variant="outline" size="sm" onClick={() => console.log(`View product ${p.id}`)}>View</Button>
                <Button aria-label={`${p.status === 'Active' ? 'Disable' : 'Enable'} product ${p.title}`} variant="warning" size="sm" onClick={() => handleDisable(p.id)}>{p.status === 'Active' ? 'Disable' : 'Enable'}</Button>
                <Button aria-label={`Remove product ${p.title}`} variant="danger" size="sm" onClick={() => handleRemove(p.id)}>Remove</Button>
              </ButtonGroup>
            ) }
          ]}
        />
      </div>
    </div>
  );
}
