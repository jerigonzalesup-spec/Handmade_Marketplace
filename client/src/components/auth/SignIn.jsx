import React from 'react';

export default function SignIn({ form, setForm, loading, error, onSubmit }) {
  const canSubmit = form.email && form.password && form.email.includes('@') && form.password.length >= 8;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-extrabold text-gray-900">Craftly</a>
          <a href="/register" className="text-indigo-600 font-medium hover:text-indigo-700">Register</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          {/* Sign In Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Sign in to your account</h1>
            <p className="text-center text-gray-600 text-sm mb-8">Welcome back to Craftly</p>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
                {form.email && !form.email.includes('@') && (
                  <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  id="signin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
                {form.password && form.password.length < 8 && (
                  <p className="mt-1 text-xs text-red-600">Password must be at least 8 characters</p>
                )}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className={`w-full py-2 rounded-lg font-semibold transition ${
                  canSubmit && !loading
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
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
              <a href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                Register
              </a>
            </p>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-8">Secure login. Your data is safe with us.</p>
        </div>
      </main>
    </div>
  );
}
