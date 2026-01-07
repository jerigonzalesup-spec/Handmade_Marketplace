import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-extrabold text-gray-900 cursor-pointer hover:text-indigo-600 transition" onClick={() => navigate('/')}>
            Craftly
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/signin')}
              className="px-4 py-2 text-gray-700 font-medium hover:text-indigo-600 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-br from-white via-indigo-50 to-white py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Handmade goods from local creators
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover unique, handcrafted products made with care — support independent makers and find one-of-a-kind items you won't find anywhere else.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={() => navigate('/browse')}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
              >
                Browse Products
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                Start Selling
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-white py-16 sm:py-24 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
              Why Choose Craftly?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Curated Selection</h3>
                <p className="text-gray-600">Handpicked items from trusted creators. Every product is authentic and unique.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Simple</h3>
                <p className="text-gray-600">Safe checkout, reliable payments, and dedicated customer support.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Support Creators</h3>
                <p className="text-gray-600">Your purchases directly support independent makers and small businesses.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-indigo-600 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to start?
            </h2>
            <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands of buyers and sellers on Craftly today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="w-full sm:w-auto px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Browse Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="text-2xl font-extrabold text-white mb-2">Craftly</div>
              <p className="text-sm text-gray-400">A marketplace for handcrafted goods — support independent creators worldwide.</p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition">Home</a></li>
                <li><a href="/marketplace" className="hover:text-white transition">Browse Products</a></li>
                <li><a href="/" className="hover:text-white transition">Become a Seller</a></li>
                <li><a href="/" className="hover:text-white transition">How It Works</a></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/login" className="hover:text-white transition">Sign In</a></li>
                <li><a href="/register" className="hover:text-white transition">Create Account</a></li>
                <li><a href="/" className="hover:text-white transition">My Orders</a></li>
                <li><a href="/" className="hover:text-white transition">My Favorites</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition">Help Center</a></li>
                <li><a href="/" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="/" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Craftly Marketplace. All rights reserved. Built for independent creators.
          </div>
        </div>
      </footer>
    </div>
  );
}
