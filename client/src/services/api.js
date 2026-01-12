// API helper — central place for HTTP requests to backend.
// - Exported functions are used by viewModels and components.
// - To change backend target, set Vite env `VITE_API_URL` or update `API_BASE_URL`.
// Add endpoints here so ViewModels can import from `client/src/services/api.js`.
import authService from './auth';

// Resolve API base from Vite env or fallback to exact backend URL
const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:4002/api';
// Log resolved API base once on module load
try { console.log('[API] Resolved API_BASE_URL ->', API_BASE_URL); } catch (e) {}

async function request(path, options = {}) {
  const url = API_BASE_URL + path;
  const headers = options.headers || {};
  if (!headers['Content-Type'] && options.body) headers['Content-Type'] = 'application/json';
  const token = authService.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch (netErr) {
    const e = new Error('Network error: unable to reach API');
    e.status = 0;
    e.body = null;
    throw e;
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message = isJson && body && body.message ? body.message : String(body) || res.statusText;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

async function get(path) {
  return request(path, { method: 'GET' });
}

async function post(path, body) {
  return request(path, { method: 'POST', body });
}

async function put(path, body) {
  return request(path, { method: 'PUT', body });
}

async function delete_(path, body) {
  return request(path, { method: 'DELETE', body });
}

async function getCrafts() {
  return get('/crafts');
}

async function getCart() {
  return get('/cart');
}

async function setCart(items) {
  const res = await post('/cart', { items });
  try { window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'setCart' } })); } catch (e) {}
  return res;
}

async function addToCart(craftId, qty = 1) {
  // primary: /cart/items POST, fallback to /cart/add
  try {
    const r = await post('/cart/items', { craftId, qty });
    try { window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'addToCart' } })); } catch (e) {}
    return r;
  } catch (e) {
    const r = await post('/cart/add', { craftId, qty });
    try { window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'addToCart-fallback' } })); } catch (e) {}
    return r;
  }
}

async function updateCartItem(craftId, qty) {
  // primary: /cart/items/:id PUT, fallback to /cart/update
  try {
    const r = await put(`/cart/items/${craftId}`, { qty });
    try { window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'updateCartItem' } })); } catch (e) {}
    return r;
  } catch (e) {
    const r = await put('/cart/update', { craftId, qty });
    try { window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'updateCartItem-fallback' } })); } catch (e) {}
    return r;
  }
}

async function removeCartItem(craftId) {
  // primary: /cart/items/:id DELETE, fallback to /cart/remove
  try {
    const r = await delete_(`/cart/items/${craftId}`);
    try { window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'removeCartItem' } })); } catch (e) {}
    return r;
  } catch (e) {
    const r = await delete_('/cart/remove', { craftId });
    try { window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'removeCartItem-fallback' } })); } catch (e) {}
    return r;
  }
}

async function getMyOrders() {
  return get('/orders/my');
}

async function getMyAccount() {
  return get('/users/me');
}

async function placeOrder(data) {
  return post('/orders', data);
}

async function login(email, password) {
  return post('/auth/login', { email, password });
}

async function createCraft(data) {
  return post('/crafts', data);
}

async function updateCraft(id, data) {
  return put(`/crafts/${id}`, data);
}

async function deleteCraft(id) {
  return delete_(`/crafts/${id}`);
}

export default {
  API_BASE_URL,
  get,
  post,
  put,
  delete: delete_,
  getCrafts,
  login,
  createCraft,
  updateCraft,
  deleteCraft,
  getCart,
  setCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  // aliases requested by UI
  updateCart: updateCartItem,
  removeFromCart: removeCartItem,
  getMyOrders,
  getMyAccount,
  placeOrder
};
