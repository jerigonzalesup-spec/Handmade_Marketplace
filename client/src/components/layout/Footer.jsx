import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="text-2xl font-extrabold text-white">Craftly</div>
            <p className="mt-2 text-sm text-gray-400 max-w-sm">A marketplace for handcrafted goods — support independent creators worldwide.</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/marketplace" className="hover:text-white transition">Browse Products</a></li>
              <li><a href="/" className="hover:text-white transition">Become a Seller</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/login" className="hover:text-white transition">Sign In</a></li>
              <li><a href="/register" className="hover:text-white transition">Create Account</a></li>
              <li><a href="/account" className="hover:text-white transition">My Orders</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition">Help Center</a></li>
              <li><a href="/" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="/" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          © {year} Craftly Marketplace. All rights reserved. Built for independent creators.
        </div>
      </div>
    </footer>
  );
}
