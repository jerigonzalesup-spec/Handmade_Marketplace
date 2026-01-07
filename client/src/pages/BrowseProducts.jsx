import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample product data
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Handcrafted Ceramic Mug',
    description: 'Beautiful blue ceramic mug with unique glaze pattern',
    price: 24.99,
    sellerName: 'Clay Creations',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Leather Journal',
    description: 'Premium leather-bound journal with 200 pages',
    price: 34.99,
    sellerName: 'Bookbinders Co',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Wooden Cutting Board',
    description: 'Sustainable wood serving and cutting board',
    price: 29.99,
    sellerName: 'Timber Studio',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbbc5a5fbb?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    name: 'Hand-Knit Scarf',
    description: 'Cozy wool scarf in warm autumn colors',
    price: 44.99,
    sellerName: 'Yarn & Needles',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1520989541440-35305b3c8b19?w=400&h=400&fit=crop',
  },
  {
    id: 5,
    name: 'Macramé Wall Hanging',
    description: 'Boho-style wall art with fringe detail',
    price: 39.99,
    sellerName: 'Fiber Arts Studio',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400&h=400&fit=crop',
  },
  {
    id: 6,
    name: 'Artisan Soap Set',
    description: 'Natural, handmade soaps with organic ingredients',
    price: 19.99,
    sellerName: 'Natural Soap House',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7214d?w=400&h=400&fit=crop',
  },
  {
    id: 7,
    name: 'Copper Jewelry Set',
    description: 'Set of 3 hammered copper bracelets',
    price: 54.99,
    sellerName: 'Metal Artistry',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
  },
  {
    id: 8,
    name: 'Handpainted Ceramic Plates',
    description: 'Set of 4 unique handpainted dinnerware plates',
    price: 89.99,
    sellerName: 'Pottery Studio',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1596394592287-e457a27e6d75?w=400&h=400&fit=crop',
  },
  {
    id: 9,
    name: 'Wooden Jewelry Box',
    description: 'Carved wooden box with velvet interior lining',
    price: 59.99,
    sellerName: 'Woodcraft Designs',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
  },
  {
    id: 10,
    name: 'Linen Throw Pillow',
    description: 'Soft linen pillow with embroidered pattern',
    price: 32.99,
    sellerName: 'Home Textiles Co',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
  },
  {
    id: 11,
    name: 'Hand-Painted Art Print',
    description: 'Limited edition watercolor art print',
    price: 49.99,
    sellerName: 'Art & Canvas Studio',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop',
  },
  {
    id: 12,
    name: 'Eco-Friendly Candle',
    description: 'Soy wax candle with natural essential oils',
    price: 22.99,
    sellerName: 'Green Light Candles',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1610885113340-604e80b61b11?w=400&h=400&fit=crop',
  },
];

const CATEGORIES = ['All', 'Jewelry', 'Art', 'Home Decor', 'Clothing'];
const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $25', value: 'under25' },
  { label: '$25 - $50', value: '25-50' },
  { label: '$50 - $100', value: '50-100' },
  { label: 'Over $100', value: 'over100' },
];

export default function BrowseProducts() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on selections
  const filteredProducts = SAMPLE_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Craftly
            </button>

            {/* Nav Links */}
            <nav className="hidden sm:flex items-center gap-8">
              <a href="#browse" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Browse
              </a>
              <a href="#dashboard" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Dashboard
              </a>
              <a href="#account" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Account
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/signin')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Browse Handmade Crafts
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover unique, handcrafted items from local artisans. Each product is made with care and passion.
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-gray-50 rounded-xl p-6 mb-12 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label
                  htmlFor="category-filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category-filter"
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label
                  htmlFor="price-filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price Range
                </label>
                <select
                  id="price-filter"
                  name="priceRange"
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label
                  htmlFor="search-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Search
                </label>
                <div className="relative">
                  <input
                    id="search-input"
                    name="search"
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedPrice('all');
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-4 sm:p-5">
                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Seller & Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs text-gray-600 font-medium">
                        {product.sellerName}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-medium text-gray-700">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
                      <p className="text-2xl font-bold text-indigo-600">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 mb-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No products found
              </h2>
              <p className="text-gray-600 text-center max-w-md">
                Try adjusting your filters or search query to find more handmade crafts.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedPrice('all');
                  setSearchQuery('');
                }}
                className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-gray-900 text-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">About Craftly</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Craftly is a marketplace dedicated to supporting handmade creators. We connect artisans with customers who value unique, quality craftsmanship.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#browse" className="text-gray-400 hover:text-white transition">
                    Browse Products
                  </a>
                </li>
                <li>
                  <a href="#sell" className="text-gray-400 hover:text-white transition">
                    Start Selling
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-400 hover:text-white transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <p className="text-gray-400 text-sm mb-4">
                Email: support@craftly.com<br />
                Phone: (555) 123-4567
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Instagram
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Twitter
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Craftly Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
