import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountViewModel from '../viewModels/AccountViewModel';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Card from '../components/Card';

export default function AccountView() {
  const vm = AccountViewModel();
  const navigate = useNavigate();
  const { user, loading, error, becomeSeller } = vm;
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerError, setSellerError] = useState(null);
  const [sellerSuccess, setSellerSuccess] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmNewPwd, setConfirmNewPwd] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState(null);

  const handleBecomeSeller = async () => {
    setSellerLoading(true);
    setSellerError(null);
    setSellerSuccess(false);
    try {
      await becomeSeller();
      setSellerSuccess(true);
      setSellerLoading(false);
      // Navbar will update automatically via Navbar's useEffect watching auth state
    } catch (err) {
      setSellerError(err.message || 'Failed to become seller');
      setSellerLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading account...</div>;
  if (error) return <Alert type="error">{error}</Alert>;
  if (!user) return <div className="p-4 text-gray-500">No user data found</div>;

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
      <Card padding="lg" shadow="md" className="mb-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">My Account</h2>
      
      <div className="space-y-3 mb-6 text-sm sm:text-base">
        <div><strong className="text-gray-700">Name:</strong> <span className="text-gray-600">{user.name || '—'}</span></div>
        <div><strong className="text-gray-700">Email:</strong> <span className="text-gray-600">{user.email}</span></div>
        <div><strong className="text-gray-700">Role:</strong> <span className={`font-bold ${user.isSeller ? 'text-green-600' : 'text-gray-500'}`}>{user.isSeller ? '⭐ Seller' : 'Buyer'}</span></div>
      </div>
      </Card>

      {!user.isSeller && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-3">Become a Seller</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Start selling your products and reach more customers.</p>
          {sellerError && <Alert type="error" onClose={() => setSellerError(null)}>{sellerError}</Alert>}
          {sellerSuccess && <Alert type="success" dismissible={false}>🎉 Welcome to our seller community! Check out your seller tools below.</Alert>}
          <Button onClick={handleBecomeSeller} variant="primary" size="md" loading={sellerLoading}>Become a Seller</Button>
        </div>
      )}

      {user.isSeller && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Seller Dashboard</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <Button onClick={() => navigate('/dashboard')} variant="success" size="md">My Products</Button>
            <Button onClick={() => navigate('/crafts/create')} variant="primary" size="md">Create Product</Button>
            <Button onClick={() => navigate('/seller/orders')} variant="danger" size="md">Orders</Button>
          </div>
        </div>
      )}

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium mb-3">Change Password</h3>
        {pwdError && <Alert type="error" onClose={() => setPwdError(null)}>{pwdError}</Alert>}
        {pwdSuccess && <Alert type="success" dismissible={false}>Password updated (UI-only).</Alert>}
        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
            <input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
            <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
            <p className="text-sm text-gray-600 mt-1">Minimum 8 characters.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
            <input type="password" value={confirmNewPwd} onChange={e => setConfirmNewPwd(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              onClick={() => {
                setPwdError(null);
                setPwdSuccess(false);
                if (!newPwd || newPwd.length < 8) { setPwdError('New password must be at least 8 characters'); return; }
                if (newPwd !== confirmNewPwd) { setPwdError('Passwords do not match'); return; }
                setPwdSuccess(true);
                setCurrentPwd(''); setNewPwd(''); setConfirmNewPwd('');
              }}
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button variant="danger" onClick={() => { vm.logout ? vm.logout() : null; }} fullWidth>Logout</Button>
      </div>
    </div>
  );
}
