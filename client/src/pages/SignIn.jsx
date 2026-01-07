import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Login with backend
      await login(formData.email, formData.password);

      // Success - redirect to buyer page
      navigate('/buyer');
    } catch (err) {
      setServerError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.password &&
    formData.password.length >= 8;

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
          <p className="text-gray-600 text-sm mt-2">
            Welcome back to Craftly
          </p>
        </div>

        {/* Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">{serverError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="signin-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="signin-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:border-transparent outline-none transition ${
                errors.email
                  ? 'border-red-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="signin-password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="signin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:border-transparent outline-none transition ${
                errors.password
                  ? 'border-red-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-2.5 rounded-lg font-medium transition ${
              isFormValid && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            Sign Up
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
