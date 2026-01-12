import api from './api';

async function createOrder(data) {
  return api.placeOrder(data);
}

async function getMyOrders() {
  if (typeof api.getMyOrders === 'function') return api.getMyOrders();
  return api.get('/orders/my');
}

async function getSellerOrders() {
  return api.get('/orders/seller');
}

async function updateOrderStatus(orderId, status) {
  return api.put(`/orders/${orderId}/status`, { status });
}

export default { createOrder, getMyOrders, getSellerOrders, updateOrderStatus };
