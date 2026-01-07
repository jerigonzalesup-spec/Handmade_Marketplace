import authService from './auth';

function isAuthenticated() {
  return !!authService.getToken();
}

function ensureAuth(navigate) {
  if (!isAuthenticated()) {
    navigate('/login');
    return false;
  }
  return true;
}

export default { isAuthenticated, ensureAuth };
