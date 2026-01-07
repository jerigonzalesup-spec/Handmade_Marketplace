import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:px-3 focus:py-2 focus:rounded-md focus:shadow">Skip to content</a>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div id="main"><Outlet /></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
