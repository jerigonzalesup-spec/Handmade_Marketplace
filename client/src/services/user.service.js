import api from './api';

async function getMe() {
  // Prefer explicit users/me endpoint
  if (typeof api.getMyAccount === 'function') return api.getMyAccount();
    return api.get('/users/me');
}

async function becomeSeller() {
  // Backend route exists on auth/user side
  if (typeof api.put === 'function') return api.put('/api/auth/me/become-seller');
    return api.post('/auth/me/become-seller');
}

export default { getMe, becomeSeller };
