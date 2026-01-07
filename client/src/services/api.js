import authService from './auth';

const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:4004/api';

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

async function delete_(path) {
  return request(path, { method: 'DELETE' });
}

async function getCrafts() {
  return get('/api/crafts');
}

async function getCart() {
  return get('/api/cart');
}

async function setCart(items) {
  return post('/api/cart', { items });
}

async function placeOrder(data) {
  return post('/api/orders', data);
}

async function login(email, password) {
  return post('/auth/login', { email, password });
}

async function createCraft(data) {
  return post('/api/crafts', data);
}

async function updateCraft(id, data) {
  return put(`/api/crafts/${id}`, data);
}

async function deleteCraft(id) {
  return delete_(`/api/crafts/${id}`);
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
  deleteCraft
};
