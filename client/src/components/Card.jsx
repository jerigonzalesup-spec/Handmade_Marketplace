import React from 'react';

export default function Card({
  children,
  className = '',
  interactive = false,
  padding = 'lg',
  shadow = 'sm',
  ...props
}) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const paddingClass = paddingClasses[padding] || paddingClasses.lg;
  const shadowClass = shadowClasses[shadow] || shadowClasses.sm;

  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 transition-all duration-200
        ${paddingClass}
        ${shadowClass}
        ${interactive ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-gray-300' : 'hover:shadow-md'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
