// AdminProductsViewModel.js - Product management
export default function AdminProductsViewModel() {
  // Mock product data
  const products = [
    { id: 1, title: 'Ceramic Vase', seller: 'Jane Smith', price: 45.99, status: 'Active', createdAt: '2025-12-10' },
    { id: 2, title: 'Wooden Sculpture', seller: 'Bob Smith', price: 89.50, status: 'Active', createdAt: '2025-12-12' },
    { id: 3, title: 'Hand-Painted Plate', seller: 'Emma Wilson', price: 32.00, status: 'Active', createdAt: '2025-12-14' },
    { id: 4, title: 'Leather Bracelet', seller: 'Grace Chen', price: 24.99, status: 'Active', createdAt: '2025-12-15' },
    { id: 5, title: 'Knitted Scarf', seller: 'Jane Smith', price: 38.00, status: 'Active', createdAt: '2025-12-16' },
    { id: 6, title: 'Glass Ornament', seller: 'Bob Smith', price: 15.50, status: 'Active', createdAt: '2025-12-17' },
    { id: 7, title: 'Wooden Box', seller: 'Emma Wilson', price: 52.00, status: 'Active', createdAt: '2025-12-18' },
    { id: 8, title: 'Beaded Necklace', seller: 'Grace Chen', price: 42.00, status: 'Active', createdAt: '2025-12-19' }
  ];

  const loading = false;
  const error = null;

  return {
    products,
    loading,
    error,
    getProducts: () => products,
    removeProduct: (productId) => {
      const index = products.findIndex(p => p.id === productId);
      if (index > -1) {
        products.splice(index, 1);
        console.log(`Removed product ${productId}`);
      }
    },
    disableProduct: (productId) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        product.status = 'Disabled';
        console.log(`Disabled product ${productId}`);
      }
    },
    viewProduct: (productId) => {
      return products.find(p => p.id === productId);
    }
  };
}
