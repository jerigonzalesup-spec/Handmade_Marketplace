// API base is locked to canonical development URL (no fallback ports allowed)
const API = 'http://localhost:4002/api';

// If you are using Vite env override, set VITE_API_URL but production behavior is locked to 4002 for dev.

export async function apiFetch(url, options = {}) {
  if (!API) return Promise.reject(new Error('VITE_API_URL not configured'));
  const path = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = API + path;

  // Get token from localStorage
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Add Bearer token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Body handling: accept pre-serialized strings or raw objects
  let body = options.body;
  if (body !== undefined && body !== null && typeof body !== 'string') {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    body = JSON.stringify(body);
  }

  console.log('[API]', (options.method || 'GET').toUpperCase(), fullUrl);

  try {
    const resp = await fetch(fullUrl, {
      method: options.method || 'GET',
      headers,
      body,
      credentials: options.credentials || 'include'
    });
    return resp; // return Response so callers can inspect status and call .json()
  } catch (netErr) {
    const e = new Error('Network error: unable to reach API');
    e.status = 0;
    e.body = null;
    throw e;
  }
}

// Convenience HTTP helpers (default export preserves previous usage patterns)
async function get(path) {
  const res = await apiFetch(path, { method: 'GET' });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
  if (!res.ok) {
    const err = new Error((body && body.error) || (body && body.message) || res.statusText);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

async function post(path, body) {
  const res = await apiFetch(path, { method: 'POST', body });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const parsed = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
  if (!res.ok) {
    const err = new Error((parsed && parsed.error) || (parsed && parsed.message) || res.statusText);
    err.status = res.status;
    err.body = parsed;
    throw err;
  }
  return parsed;
}

async function put(path, body) {
  const res = await apiFetch(path, { method: 'PUT', body });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const parsed = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
  if (!res.ok) {
    const err = new Error((parsed && parsed.error) || (parsed && parsed.message) || res.statusText);
    err.status = res.status;
    err.body = parsed;
    throw err;
  }
  return parsed;
}

async function del(path) {
  const res = await apiFetch(path, { method: 'DELETE' });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const parsed = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
  if (!res.ok) {
    const err = new Error((parsed && parsed.error) || (parsed && parsed.message) || res.statusText);
    err.status = res.status;
    err.body = parsed;
    throw err;
  }
  return parsed;
}

// High-level helpers required by frontend
export function getCart() { return get('/cart'); }
export function setCart(items) { return post('/cart', { items }); }
export function addToCart(craftId, qty = 1) { return post('/cart/items', { craftId, qty }); }
export function updateCartItem(craftId, qty) { return put(`/cart/items/${craftId}`, { qty }); }
export function removeCartItem(craftId) { return del(`/cart/items/${craftId}`); }

export function getMyOrders() { return get('/orders/my'); }
export function getMyAccount() { return get('/users/me'); }
export function placeOrder(payload) { return post('/orders', payload); }

// Default export for modules that import the older `api` object
const api = {
  API_BASE: API,
  get, post, put, delete: del,
  // legacy helper names
  getCart,
  setCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  getMyOrders,
  getMyAccount,
  placeOrder
};

try { if (API) console.log('[client/api] base', API); } catch (e) {}

export default api;
