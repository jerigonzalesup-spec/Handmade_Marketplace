import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import LoginViewModel from '../viewModels/LoginViewModel';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

export default function LoginView() {
  const vm = LoginViewModel();
  const { form, setForm, loading, error, submit } = vm;
  const canSubmit = form.email && form.password && form.email.includes('@') && form.password.length >= 8;
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submit();
      if (res && res.token) {
        navigate('/');
      }
    } catch (err) {
      // error handled in vm
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          {/* Sign In Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Sign in to your account
            </h1>
            <p className="text-center text-gray-600 text-sm mb-8">
              Welcome back to Craftly
            </p>

            {/* Error Alert */}
            {error && (
              <div className="mb-6">
                <Alert type="error" onClose={() => {}}>{error}</Alert>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <Input
                  id="login-email"
                  name="email"
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                  required
                />
                {form.email && !form.email.includes('@') && (
                  <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Input
                  id="login-password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  required
                />
                {form.password && form.password.length < 8 && (
                  <p className="mt-1 text-xs text-red-600">Password must be at least 8 characters</p>
                )}
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={loading}
                disabled={!canSubmit}
                className="mt-6"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Sign up here
              </a>
            </p>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-8">
            Secure login. Your data is safe with us.
          </p>
        </div>
      </main>
    </div>
  );
}
