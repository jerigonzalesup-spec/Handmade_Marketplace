import React from 'react';

export default function Button({
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  ...props
}) {
  const baseClass = 'rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-300 shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm hover:shadow-md',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 focus:ring-yellow-500 shadow-sm',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus:ring-indigo-500',
    ghost: 'text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus:ring-indigo-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-base',
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      )}
      {children}
    </button>
  );
}
