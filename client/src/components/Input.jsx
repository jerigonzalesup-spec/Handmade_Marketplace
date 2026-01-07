import React, { useState } from 'react';

export default function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled = false,
  required = false,
  autoComplete,
  name,
  id,
  fullWidth = true,
  className = '',
  multiline = false,
  rows = 4,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const displayType = isPasswordType && showPassword ? 'text' : type;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {multiline ? (
          <textarea
            id={id || name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            rows={rows}
            autoComplete={autoComplete}
            className={`
              w-full px-4 py-3 text-base
              border rounded-md resize-vertical
              transition-all duration-200
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}
              ${className}
            `}
            {...props}
          />
        ) : (
          <>
            <input
              id={id || name}
              type={displayType}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              autoComplete={autoComplete}
              className={`
                w-full px-4 py-2 text-base
                border rounded-md
                transition-all duration-200
                placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}
                ${className}
              `}
              {...props}
            />

            {/* Password visibility toggle */}
            {isPasswordType && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-1.473-1.473a10.014 10.014 0 001.565-2.663A9.958 9.958 0 0010 3c-1.547 0-3.033.32-4.512 1.074l-1.782-1.781a1 1 0 00-1.414 1.414l.844.844.66.66z" />
                  </svg>
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Error message */}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}

      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
}
