import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/auth';
import ProductCard from '../components/ProductCard';

// Category data
const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '🎯' },
  { id: 'jewelry', name: 'Handmade Jewelry', icon: '💍' },
  { id: 'home', name: 'Home Decor', icon: '🏠' },
  { id: 'art', name: 'Art & Prints', icon: '🎨' },
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'pottery', name: 'Pottery', icon: '🏺' },
  { id: 'wellness', name: 'Wellness', icon: '🕯️' },
];

// Sample product data with categories
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Handcrafted Ceramic Mug',
    description: 'Beautiful blue ceramic mug with unique glaze pattern',
    price: 24.99,
    category: 'pottery',
    sellerName: 'Clay Creations',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Leather Journal',
    description: 'Premium leather-bound journal with 200 pages',
    price: 34.99,
    category: 'home',
    sellerName: 'Bookbinders Co',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Wooden Cutting Board',
    description: 'Sustainable wood serving and cutting board',
    price: 29.99,
    category: 'home',
    sellerName: 'Timber Studio',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbbc5a5fbb?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    name: 'Hand-Knit Scarf',
    description: 'Cozy wool scarf in warm autumn colors',
    price: 44.99,
    category: 'clothing',
    sellerName: 'Yarn & Needles',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1520989541440-35305b3c8b19?w=400&h=400&fit=crop',
  },
  {
    id: 5,
    name: 'Macramé Wall Hanging',
    description: 'Boho-style wall art with fringe detail',
    price: 39.99,
    category: 'art',
    sellerName: 'Fiber Arts Studio',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400&h=400&fit=crop',
  },
  {
    id: 6,
    name: 'Artisan Soap Set',
    description: 'Natural, handmade soaps with organic ingredients',
    price: 19.99,
    category: 'wellness',
    sellerName: 'Natural Soap House',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7214d?w=400&h=400&fit=crop',
  },
  {
    id: 7,
    name: 'Copper Jewelry Set',
    description: 'Set of 3 hammered copper bracelets',
    price: 54.99,
    category: 'jewelry',
    sellerName: 'Metal Artistry',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
  },
  {
    id: 8,
    name: 'Handpainted Ceramic Plates',
    description: 'Set of 4 unique handpainted dinnerware plates',
    price: 89.99,
    category: 'pottery',
    sellerName: 'Pottery Studio',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1596394592287-e457a27e6d75?w=400&h=400&fit=crop',
  },
  {
    id: 9,
    name: 'Wooden Jewelry Box',
    description: 'Carved wooden box with velvet interior lining',
    price: 59.99,
    category: 'home',
    sellerName: 'Woodcraft Designs',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
  },
  {
    id: 10,
    name: 'Linen Throw Pillow',
    description: 'Soft linen pillow with embroidered pattern',
    price: 32.99,
    category: 'home',
    sellerName: 'Home Textiles Co',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
  },
  {
    id: 11,
    name: 'Hand-Painted Art Print',
    description: 'Limited edition watercolor art print',
    price: 49.99,
    category: 'art',
    sellerName: 'Art & Canvas Studio',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop',
  },
  {
    id: 12,
    name: 'Eco-Friendly Candle',
    description: 'Soy wax candle with natural essential oils',
    price: 22.99,
    category: 'wellness',
    sellerName: 'Green Light Candles',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1610885113340-604e80b61b11?w=400&h=400&fit=crop',
  },
];

export default function BuyerHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const currentUser = getCurrentUser();

  const filteredProducts = SAMPLE_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('/buyer')}
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              id="navbar-logo"
            >
              Craftly
            </button>

            {/* Search Bar */}
            <div className="flex-1 mx-4 md:mx-8">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-bar"
                name="search"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Right side: Cart + Profile */}
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <button
                onClick={() => navigate('/cart')}
                id="cart-btn"
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                title="View Cart"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  id="profile-btn"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      showProfileMenu ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {currentUser?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-600">{currentUser?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/buyer/account');
                        setShowProfileMenu(false);
                      }}
                      id="profile-link"
                      name="profile-link"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => {
                        navigate('/buyer/orders');
                        setShowProfileMenu(false);
                      }}
                      id="orders-link"
                      name="orders-link"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Orders
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      id="logout-btn"
                      name="logout-btn"
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-lg text-indigo-100">Discover unique handmade crafts from talented artisans</p>
        </div>
      </section>

      {/* Category Section */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                id={`category-${category.id}`}
                name={`category-${category.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Products</h2>
          {filteredProducts.length === 0 && (
            <p className="text-gray-600">No products found matching your search.</p>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => handleViewProduct(product.id)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        )}
      </section>
    </div>
  );
}
