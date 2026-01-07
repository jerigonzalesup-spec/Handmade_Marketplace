import api from './api';

async function getMe() {
  return api.get('/me');
}

async function becomeSeller() {
  return api.put('/me/become-seller');
}

export default { getMe, becomeSeller };
