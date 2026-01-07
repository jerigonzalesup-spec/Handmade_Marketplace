import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Handmade Ceramic Mug',
    price: 24.99,
    seller: 'Clay Studio',
    badge: 'Handmade',
    image: '🏺',
    category: 'Home Decor'
  },
  {
    id: 2,
    name: 'Knitted Wool Scarf',
    price: 45.00,
    seller: 'Yarn & Thread',
    badge: 'New',
    image: '🧣',
    category: 'Fashion'
  },
  {
    id: 3,
    name: 'Wooden Cutting Board',
    price: 38.50,
    seller: 'Woodcraft Studio',
    badge: 'Handmade',
    image: '🪵',
    category: 'Kitchen'
  },
  {
    id: 4,
    name: 'Leather Journal',
    price: 32.00,
    seller: 'Bookbind Co',
    badge: 'Popular',
    image: '📕',
    category: 'Stationery'
  },
  {
    id: 5,
    name: 'Hand-Poured Candle',
    price: 18.99,
    seller: 'Wax & Wick',
    badge: 'New',
    image: '🕯️',
    category: 'Home Decor'
  },
  {
    id: 6,
    name: 'Macramé Wall Hanging',
    price: 52.00,
    seller: 'Fiber Arts Co',
    badge: 'Handmade',
    image: '🪡',
    category: 'Wall Art'
  },
  {
    id: 7,
    name: 'Handmade Soap Set',
    price: 28.50,
    seller: 'Natural Soaps',
    badge: 'Popular',
    image: '🧼',
    category: 'Beauty'
  },
  {
    id: 8,
    name: 'Embroidered Pillow',
    price: 42.00,
    seller: 'Thread Stories',
    badge: 'Handmade',
    image: '🪡',
    category: 'Home Decor'
  },
  {
    id: 9,
    name: 'Ceramic Plant Pot',
    price: 21.00,
    seller: 'Clay Studio',
    badge: 'New',
    image: '🪴',
    category: 'Home Decor'
  },
  {
    id: 10,
    name: 'Beaded Bracelet',
    price: 15.99,
    seller: 'Artisan Beads',
    badge: 'Handmade',
    image: '💎',
    category: 'Jewelry'
  },
  {
    id: 11,
    name: 'Watercolor Art Print',
    price: 35.00,
    seller: 'Painted Dreams',
    badge: 'Popular',
    image: '🎨',
    category: 'Art'
  },
  {
    id: 12,
    name: 'Knitted Baby Booties',
    price: 22.00,
    seller: 'Yarn & Thread',
    badge: 'New',
    image: '👶',
    category: 'Baby'
  }
];

const CATEGORIES = ['All', 'Home Decor', 'Fashion', 'Kitchen', 'Stationery', 'Wall Art', 'Beauty', 'Jewelry', 'Art', 'Baby'];
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: 'Over $50', min: 50, max: Infinity }
];
const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popular'];

export default function MarketplaceView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [sortBy, setSortBy] = useState('Newest');
  const [loading, setLoading] = useState(false);

  // Filter and sort products
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Popular') return b.id - a.id; // Mock popularity
    return 0; // Newest (default order)
  });

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getBadgeColor = (badge) => {
    if (badge === 'New') return 'bg-green-500';
    if (badge === 'Popular') return 'bg-orange-500';
    return 'bg-indigo-600';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
                Discover Unique Handmade Crafts
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Browse beautifully crafted products from talented artisans around the world. Support independent makers and find one-of-a-kind items.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-2xl">
                <input
                  type="text"
                  placeholder="Search by product name or seller..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-gray-900"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={selectedPriceRange.label}
                  onChange={e => {
                    const range = PRICE_RANGES.find(r => r.label === e.target.value);
                    setSelectedPriceRange(range);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-gray-900"
                >
                  {PRICE_RANGES.map(range => (
                    <option key={range.label} value={range.label}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-gray-900"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <p className="text-sm text-gray-600 font-medium">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="w-full">
          <div className="max-w-7xl mx-auto px-4 py-16">
            {loading ? (
              // Loading Skeleton
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="w-full h-64 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              // Empty State
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedPriceRange(PRICE_RANGES[0]);
                    setSortBy('Newest');
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              // Product Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all hover:scale-105 cursor-pointer overflow-hidden group"
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl overflow-hidden">
                      <span className="group-hover:scale-110 transition-transform">{product.image}</span>
                      {/* Badge */}
                      <div className={`absolute top-3 right-3 ${getBadgeColor(product.badge)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                        {product.badge}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{product.seller}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</p>
                        <button className="text-indigo-600 hover:text-indigo-700 text-2xl">♥</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
