import React, { useState } from 'react';

export default function ProductCard({ product, onViewDetails, onAddToCart }) {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      if (onAddToCart) {
        await onAddToCart();
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {product.rating && (
          <div className="absolute top-3 right-3 bg-white rounded-lg px-2 py-1 shadow-sm flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-xs font-semibold text-gray-900">{product.rating}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* Seller Info */}
        {product.sellerName && (
          <p className="text-xs text-gray-600 mb-2">by {product.sellerName}</p>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
        )}

        {/* Price */}
        <div className="mb-4">
          <p className="text-lg font-bold text-indigo-600">
            ${product.price?.toFixed(2) || '0.00'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onViewDetails}
            id={`view-details-${product.id}`}
            name={`view-details-${product.id}`}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            id={`add-to-cart-${product.id}`}
            name={`add-to-cart-${product.id}`}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
