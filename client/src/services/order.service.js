import api from './api';

async function createOrder(data) {
  return api.post('/api/orders', data);
}

async function getMyOrders() {
  return api.get('/api/orders');
}

async function getSellerOrders() {
  return api.get('/api/orders/seller');
}

export default { createOrder, getMyOrders, getSellerOrders };
