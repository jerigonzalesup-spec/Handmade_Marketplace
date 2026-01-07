import React, { useState } from 'react';
import CraftCard from '../components/CraftCard';
import HomeViewModel from '../viewModels/HomeViewModel';
import OrderViewModel from '../viewModels/OrderViewModel';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Alert from '../components/Alert';

export default function HomeView() {
  const vm = HomeViewModel();
  const { crafts, loading, error, loadCrafts, isAuthenticated, auth, login, logout, createCraft, updateCraft, deleteCraft } = vm;
  const orderVm = OrderViewModel();
  const { createOrder } = orderVm;
  const navigate = useNavigate();

  const [createState, setCreateState] = useState({ title: '', description: '', price: '' });
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [loginState, setLoginState] = useState({ email: '', password: '' });
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isCreatingLoading, setIsCreatingLoading] = useState(false);

  const onEditCraft = async (id, data) => {
    try {
      await updateCraft(id, data);
      await loadCrafts();
    } catch (err) {
      alert('Edit failed: ' + (err.message || 'unknown'));
    }
  };

  const onDeleteCraft = async (id) => {
    try {
      await deleteCraft(id);
      await loadCrafts();
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'unknown'));
    }
  };

  const onPlaceOrder = async (craftId, total) => {
    try {
      await createOrder(Number(total));
      navigate('/my-orders');
    } catch (err) {
      alert('Order failed: ' + (err.message || 'unknown'));
    }
  };

  const onSubmitCreate = async (e) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(false);
    setIsCreatingLoading(true);
    try {
      const res = await createCraft(createState.title, createState.description, createState.price);
      if (res && res.id) {
        setCreateSuccess(true);
        setCreateState({ title: '', description: '', price: '' });
        await loadCrafts();
        setTimeout(() => setCreateSuccess(false), 4000);
      }
    } catch (err) {
      setCreateError(err.message || 'Failed to create craft');
    } finally {
      setIsCreatingLoading(false);
    }
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await login(loginState.email, loginState.password);
      if (res && res.token) {
        setLoginState({ email: '', password: '' });
        setShowLoginForm(false);
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const onLogout = () => {
    logout();
  };

  return (
    <div>
      <main className="w-full">
        {/* Hero */}
        <section className="w-full bg-white">
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight">Handmade goods from local creators</h1>
            <p className="mt-5 text-lg text-gray-600 max-w-3xl mx-auto">Discover unique, handcrafted products made with care — support independent makers and find one-of-a-kind items.</p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button onClick={() => { const el = document.getElementById('marketplace'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} variant="primary" size="lg" className="shadow-md">Browse Products</Button>
              <Button onClick={() => navigate('/register')} variant="outline" size="lg" className="shadow-sm">Sign Up</Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full bg-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-semibold text-center text-gray-900">Why Choose Us</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <div className="text-indigo-600 text-2xl mb-3">🎨</div>
                <h3 className="font-semibold text-gray-900">Curated Selection</h3>
                <p className="mt-2 text-sm text-gray-600">Handpicked items from trusted creators.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <div className="text-indigo-600 text-2xl mb-3">🔒</div>
                <h3 className="font-semibold text-gray-900">Secure Checkout</h3>
                <p className="mt-2 text-sm text-gray-600">Simple and private checkout experience.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <div className="text-indigo-600 text-2xl mb-3">🤝</div>
                <h3 className="font-semibold text-gray-900">Support Creators</h3>
                <p className="mt-2 text-sm text-gray-600">Directly back independent makers and artisans.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="w-full bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Start supporting makers today</h3>
              <p className="text-sm text-gray-600 mt-1">Create an account to sell or buy unique handmade products.</p>
            </div>
            <div>
              <Button variant="primary" size="md" onClick={() => navigate('/register')}>Get Started</Button>
            </div>
          </div>
        </section>
        {/* Login Form (shown when not authenticated) */}
        {!isAuthenticated() && (
          <Card padding="lg" shadow="md" className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Welcome to Craftly</h2>
            {showLoginForm ? (
              <>
                <p className="text-gray-600 mb-6">Sign in to browse crafts and place orders.</p>
                {loginError && <Alert type="error" onClose={() => setLoginError(null)}>{loginError}</Alert>}
                <form onSubmit={onSubmitLogin} className="flex flex-col gap-5 w-full sm:max-w-sm">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginState.email}
                    onChange={e => setLoginState({ ...loginState, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={loginState.password}
                    onChange={e => setLoginState({ ...loginState, password: e.target.value })}
                    required
                  />
                  <Button type="submit" variant="primary" size="md" fullWidth>Login</Button>
                  <div className="text-center text-sm text-gray-600">
                    Don't have an account? <a href="/register" className="text-indigo-600 font-medium hover:underline">Register</a>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => setShowLoginForm(true)} variant="primary" size="md">Login</Button>
                <Button onClick={() => navigate('/register')} variant="outline" size="md">Register</Button>
              </div>
            )}
          </Card>
        )}

        {/* Crafts Section */}
        <Card padding="lg" shadow="md" className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Marketplace</h2>
            <Button onClick={loadCrafts} variant="secondary" size="sm" loading={loading}>Refresh</Button>
          </div>

          {error && <Alert type="error">{error}</Alert>}

          {loading && <div className="text-center text-gray-600 py-12">⏳ Loading crafts...</div>}

          {!loading && !error && crafts.length > 0 && (
            <div id="marketplace" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {crafts.map(c => (
                <CraftCard
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  description={c.description}
                  price={c.price}
                  userId={c.userId}
                  currentUserId={auth.userId}
                  onEdit={onEditCraft}
                  onDelete={onDeleteCraft}
                  onPlaceOrder={isAuthenticated() ? onPlaceOrder : null}
                />
              ))}
            </div>
          )}

          {!loading && !error && crafts.length === 0 && (
            <div id="marketplace" className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
              <p className="text-lg font-medium">📭 No crafts available yet.</p>
              <p className="text-sm text-gray-400 mt-2">Be the first to create one!</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                {isAuthenticated() ? (
                  <Button variant="primary" onClick={() => navigate('/crafts/create')}>Create Your First Product</Button>
                ) : (
                  <>
                    <Button variant="primary" onClick={() => navigate('/register')}>Sign Up</Button>
                    <Button variant="outline" onClick={() => navigate('/login')}>Sign In</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Create Craft Section */}
        {isAuthenticated() && (
          <Card padding="lg" shadow="md">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Create a New Product</h2>
            {createError && <Alert type="error" onClose={() => setCreateError(null)}>{createError}</Alert>}
            {createSuccess && <Alert type="success" dismissible={false}>✓ Product created successfully!</Alert>}
            <form onSubmit={onSubmitCreate} className="flex flex-col gap-5 w-full sm:max-w-md">
              <Input
                label="Product Title"
                type="text"
                placeholder="e.g., Handmade Ceramic Mug"
                value={createState.title}
                onChange={e => setCreateState({ ...createState, title: e.target.value })}
                required
              />
              <Input
                label="Description"
                placeholder="Describe your product in detail..."
                value={createState.description}
                onChange={e => setCreateState({ ...createState, description: e.target.value })}
                multiline
                rows={4}
              />
              <Input
                label="Price (USD)"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={createState.price}
                onChange={e => setCreateState({ ...createState, price: e.target.value })}
                required
              />
              <Button type="submit" variant="success" size="md" loading={isCreatingLoading} fullWidth>
                Create Product
              </Button>
            </form>
          </Card>
        )}

        {!isAuthenticated() && (
          <div className="mt-8 p-6 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
            <p className="text-indigo-900 font-medium">💡 Log in to create and manage your crafts</p>
          </div>
        )}
      </main>
    </div>
  );
}
