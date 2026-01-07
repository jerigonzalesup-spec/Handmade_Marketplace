const API = 'http://localhost:4004/api';

export async function apiFetch(url, options = {}) {
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
  
  console.log('[API]', (options.method || 'GET').toUpperCase(), fullUrl);
  
  return fetch(fullUrl, {
    ...options,
    headers,
    credentials: 'include'
  });
}

export default API;
