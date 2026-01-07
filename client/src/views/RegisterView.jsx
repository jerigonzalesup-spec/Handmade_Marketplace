import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import RegisterViewModel from '../viewModels/RegisterViewModel';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

export default function RegisterView() {
  const vm = RegisterViewModel();
  const { form, setForm, loading, error, submit } = vm;
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordValid = useMemo(() => {
    return form.password && form.password.length >= 8;
  }, [form.password]);

  const passwordsMatch = useMemo(() => {
    return form.password === confirmPassword;
  }, [form.password, confirmPassword]);

  const canSubmit = form.name && form.email && form.email.includes('@') && passwordValid && passwordsMatch;
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submit();
      if (res && res.token) navigate('/');
    } catch (err) {
      // error handled in vm
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          {/* Sign Up Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Create your account
            </h1>
            <p className="text-center text-gray-600 text-sm mb-8">
              Join Craftly to buy and sell handmade goods
            </p>

            {/* Error Alert */}
            {error && (
              <div className="mb-6">
                <Alert type="error" onClose={() => {}}>{error}</Alert>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <Input
                  id="register-name"
                  name="name"
                  label="Full name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <Input
                  id="register-email"
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
                  id="register-password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                  required
                />
                {form.password && !passwordValid && (
                  <p className="mt-1 text-xs text-red-600">Must be at least 8 characters</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <Input
                  id="register-confirmPassword"
                  name="confirmPassword"
                  label="Confirm password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-600">Passwords must match</p>
                )}
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={loading}
                disabled={!canSubmit}
                className="mt-6"
              >
                {loading ? 'Creating account…' : 'Create account'}
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

            {/* Sign In Link */}
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Sign in here
              </a>
            </p>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-8">
            Your account will be secure and private.
          </p>
        </div>
      </main>
    </div>
  );
}
