import React from 'react';

export default function ButtonGroup({ children, className = '', vertical = false, align = 'left', ariaLabel }) {
  const direction = vertical ? 'flex-col items-stretch' : 'inline-flex flex-wrap items-center';
  const alignment = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';
  const base = `flex ${direction} gap-2 ${alignment}`;
  return (
    <div role="group" aria-label={ariaLabel} className={`${base} ${className}`}>
      {children}
    </div>
  );
}
