import React from 'react';

export default function Alert({ type = 'info', children, onClose, dismissible = true }) {
  const bgColor = {
    success: 'bg-green-50 border-l-4 border-green-500 text-green-800',
    error: 'bg-red-50 border-l-4 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
  };

  return (
    <div className={`p-4 rounded-lg mb-4 flex items-center justify-between border-l-4 ${bgColor[type] || bgColor.info}`}>
      <div className="text-sm font-medium">{children}</div>
      {dismissible && onClose && (
        <button onClick={onClose} className="text-lg ml-4 opacity-70 hover:opacity-100 transition-opacity" aria-label="Close alert">×</button>
      )}
    </div>
  );
}
