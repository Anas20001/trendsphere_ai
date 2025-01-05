import React, { useState } from 'react';
import { PreviewData } from './types';

interface FilePreviewProps {
  data: PreviewData;
  onUpload: () => void;
}

export function FilePreview({ data, onUpload }: FilePreviewProps) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const startIndex = page * rowsPerPage;
  const displayedRows = data.rows.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(data.rows.length / rowsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {data.totalRows} rows • {data.totalColumns} columns
        </div>
        <button
          onClick={onUpload}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
            transition-colors text-sm font-medium"
        >
          Upload File
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {data.headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {data.headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}