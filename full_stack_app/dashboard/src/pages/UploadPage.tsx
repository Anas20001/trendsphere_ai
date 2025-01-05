import React from 'react';
import { toast } from 'sonner';
import { logger } from '../lib/logger';
import { FileProcessor } from '../components/FileUpload';
import { FileList } from '../components/FileUpload/FileList';
import { useFileStorage } from '../hooks/useFileStorage';
import { AlertCircle } from 'lucide-react';

export function UploadPage() {
  const { files, isLoading, error, deleteFile, refreshFiles } = useFileStorage();

  const handleDelete = async (fileId: string, path: string) => {
    try {
      await deleteFile(fileId, path);
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Data</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Upload your data files for analysis. Supported formats: CSV, Excel (.xlsx, .xls)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200">
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload New File</h3>
          <div className="mb-4">
            <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">File Requirements:</p>
                <ul className="mt-1 list-disc list-inside">
                  <li>Maximum file size: 10MB</li>
                  <li>Supported formats: CSV, Excel (.xlsx, .xls)</li>
                  <li>First row must contain column headers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* File Upload Component */}
          <FileProcessor 
            onStatusChange={(status) => {
              if (status === 'completed') {
                logger.info('File upload completed');
                toast.success('File uploaded successfully');
                refreshFiles();
              } else if (status === 'error') {
                logger.error('File upload failed');
                toast.error('Failed to upload file. Please try again.');
              }
            }}
          />
        </div>

        {/* File List Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Uploaded Files</h3>
          {isLoading ? (
            <div className="text-center py-4 text-gray-600 dark:text-gray-400">Loading files...</div>
          ) : error ? (
            <div className="text-center text-red-600 dark:text-red-400 py-4">{error}</div>
          ) : files.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">No files uploaded yet</div>
          ) : (
            <FileList files={files} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
}