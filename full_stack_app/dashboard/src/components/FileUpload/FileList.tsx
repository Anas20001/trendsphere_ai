import React from 'react';
import { FileIcon, Trash2, Download } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';
import { StoredFile } from '../../hooks/useFileStorage';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface FileListProps {
  files: StoredFile[];
  onDelete: (fileId: string, path: string) => Promise<void>;
  isCompact?: boolean;
}

export function FileList({ files, onDelete, isCompact = false }: FileListProps) {
  const { t, isRTL } = useLanguage();
  const handleDownload = async (file: StoredFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('data')
        .download(file.path);

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (file: StoredFile) => {
    try {
      setIsDeleting(file.id);
      await onDelete(file.id, file.path);
      toast.success(t('common.fileUpload.actions.delete'));
    } catch (error) {
      toast.error(t('errors.general'));
    } finally {
      setIsDeleting(null);
    }
  };

  if (isCompact) {
    return (
      <div className="space-y-2">
        {files.slice(0, 5).map((file) => (
          <div key={file.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <FileIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm truncate text-gray-900 dark:text-gray-100">{file.fileName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownload(file)}
                className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {files.map((file) => (
          <li key={file.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.fileName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(file)}
                  className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(file.id, file.path)}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}