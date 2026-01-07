import React from 'react';

export default function DataTable({ columns = [], data = [], emptyMessage = 'No items found.' }) {
  if (!data || data.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-gray-500">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] table-auto">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {col.header || col.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-gray-50 transition-colors">
              {columns.map((col, cIdx) => (
                <td key={cIdx} className="px-6 py-4 text-sm align-top">
                  {typeof col.render === 'function' ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
