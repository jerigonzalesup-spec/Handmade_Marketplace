import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

// Sample products data
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Handcrafted Ceramic Mug',
    description: 'Beautiful blue ceramic mug with unique glaze pattern',
    fullDescription: 'This beautiful ceramic mug is handcrafted with a unique cobalt blue glaze pattern. Each mug is individually made, ensuring that your mug is completely unique. Perfect for coffee, tea, or hot chocolate. Dishwasher safe and food-grade glazed.',
    price: 24.99,
    sellerName: 'Clay Creations',
    sellerId: 101,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&h=600&fit=crop',
    inStock: true,
  },
  {
    id: 2,
    name: 'Leather Journal',
    description: 'Premium leather-bound journal with 200 pages',
    fullDescription: 'Premium quality leather-bound journal featuring 200 pages of acid-free paper. Perfect for daily journaling, sketching, or note-taking. Features a ribbon bookmark and elastic closure. Each journal is hand-stitched for durability.',
    price: 34.99,
    sellerName: 'Bookbinders Co',
    sellerId: 102,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=600&h=600&fit=crop',
    inStock: true,
  },
  {
    id: 3,
    name: 'Wooden Cutting Board',
    description: 'Sustainable wood serving and cutting board',
    fullDescription: 'Handmade from sustainably sourced wood, this cutting board is perfect for food preparation and serving. Features smooth edges and a natural wood finish. Complimentary food-safe oil is included for maintenance.',
    price: 29.99,
    sellerName: 'Timber Studio',
    sellerId: 103,
    rating: 4.7,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbbc5a5fbb?w=600&h=600&fit=crop',
    inStock: true,
  },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const product = SAMPLE_PRODUCTS.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
          <p className="text-gray-600 mb-4">Sorry, we couldn't find the product you're looking for.</p>
          <button
            onClick={() => navigate('/buyer')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (value) => {
    const newQuantity = parseInt(value) || 1;
    if (newQuantity >= 1 && newQuantity <= 100) {
      setQuantity(newQuantity);
    }
  };

  function formatPHP(n) {
    try {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(n || 0));
    } catch (e) {
      return `₱${(Number(n) || 0).toFixed(2)}`;
    }
  }

  const handleAddToCart = async () => {
    if (!product) return;
    
    // Check if user is authenticated
    if (!getCurrentUser()) {
      alert('Please sign in to add items to your cart');
      navigate('/signin');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await api.addToCart(product.id, quantity);
      setShowNotification(true);
      // Emit cart changed event
      window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'ProductDetails.addToCart' } }));
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error('[PRODUCTDETAILS] addToCart error', err);
      alert('Failed to add item to cart');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <button
            onClick={() => navigate('/buyer')}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
            id="back-btn"
            name="back-btn"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
            Added to cart! 🛒
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="font-semibold text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-600 text-sm">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-4">
              <p className="text-4xl font-bold text-indigo-600">
                  {formatPHP(product.price)}
                </p>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Sold by</h3>
              <p className="text-lg font-semibold text-gray-900">{product.sellerName}</p>
              <button
                className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                id="view-seller-btn"
                name="view-seller-btn"
              >
                View Store →
              </button>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.fullDescription}</p>
            </div>

            {/* Stock Status */}
            <div>
              {product.inStock ? (
                <p className="text-green-600 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  In Stock
                </p>
              ) : (
                <p className="text-red-600 font-semibold">Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="text-sm font-semibold text-gray-900">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  id="qty-decrease"
                  name="qty-decrease"
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  −
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  min="1"
                  max="100"
                  className="w-12 text-center font-semibold border-0 focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(100, quantity + 1))}
                  id="qty-increase"
                  name="qty-increase"
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock}
                id="add-to-cart-btn"
                name="add-to-cart-btn"
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => navigate('/checkout'), 500);
                }}
                disabled={isAddingToCart || !product.inStock}
                id="buy-now-btn"
                name="buy-now-btn"
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAddingToCart ? 'Processing...' : 'Buy Now'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                  <span className="font-semibold">Free Shipping:</span> Orders over {formatPHP(2500)} qualify for free shipping
                </p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_PRODUCTS.filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => navigate(`/product-details/${relatedProduct.id}`)}
                  className="cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden"
                >
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-indigo-600">
                      {formatPHP(relatedProduct.price)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
