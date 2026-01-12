import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const emailUsername = formData.email.replace(/@gmail\.com$/, '');
  const passwordValid = formData.password.length >= 8;
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.password.length > 0;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!emailUsername.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleEmailChange = (e) => {
    let value = e.target.value.trim();
    value = value.replace(/@gmail\.com$/, '');
    setFormData((prev) => ({
      ...prev,
      email: value,
    }));
    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: '',
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      console.warn('[SignUp] Attempted submit with validation errors:', newErrors);
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Register with backend (name, email, password)
      await register(
        formData.name,
        `${emailUsername}@gmail.com`,
        formData.password
      );

      // Success - redirect to buyer page and show welcome message
      navigate('/buyer', { state: { newUser: true } });
    } catch (err) {
      setServerError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.name.trim() &&
    emailUsername.trim() &&
    passwordValid &&
    passwordsMatch;

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 text-sm mt-2">
            Join the Craftly community
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
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="signup-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="signup-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:border-transparent outline-none transition ${
                errors.name
                  ? 'border-red-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field with Gmail Auto-Append */}
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="signup-email"
                name="email"
                type="text"
                required
                autoComplete="email"
                value={emailUsername}
                onChange={handleEmailChange}
                placeholder="username"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:border-transparent outline-none transition pr-28 ${
                  errors.email
                    ? 'border-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-sm">
                @gmail.com
              </span>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            {!errors.email && !emailUsername && (
              <p className="text-gray-500 text-sm mt-1">All accounts use @gmail.com</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
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
            {formData.password && !errors.password && passwordValid && (
              <p className="text-green-600 text-sm mt-1">✓ Password strength good</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="signup-confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="signup-confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:border-transparent outline-none transition ${
                errors.confirmPassword
                  ? 'border-red-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
            {formData.confirmPassword &&
              !errors.confirmPassword &&
              passwordsMatch && (
                <p className="text-green-600 text-sm mt-1">✓ Passwords match</p>
              )}
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-2.5 rounded-lg font-medium transition ${
              isFormValid && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            Sign In
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
