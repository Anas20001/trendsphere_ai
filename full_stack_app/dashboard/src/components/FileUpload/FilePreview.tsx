import React from 'react';
import { FileIcon, UploadCloud } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

interface FilePreviewProps {
  file: File;
  previewData: any;
  onProcess: () => void;
}

export function FilePreview({ file, previewData, onProcess }: FilePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FileIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {file.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)} • {file.type}
              </p>
              {previewData?.lastModified && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Last modified: {previewData.lastModified}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onProcess}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
          >
            <UploadCloud className="w-4 h-4 mr-1.5" />
            Process File
          </button>
        </div>
      </div>

      {previewData && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Preview
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  {previewData.headers.map((header: string, index: number) => (
                    <th
                      key={index}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {previewData.rows.slice(0, 5).map((row: any, rowIndex: number) => (
                  <tr key={rowIndex}>
                    {previewData.headers.map((header: string, colIndex: number) => (
                      <td
                        key={colIndex}
                        className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Showing first 5 rows of {previewData.totalRows} rows
          </p>
        </div>
      )}
    </div>
  );
}