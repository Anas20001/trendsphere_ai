import React from 'react';
import { Clock } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  status: string;
  fileSize?: number;
  uploadedSize?: number;
  timeRemaining?: number;
  compact?: boolean;
}

export function ProgressBar({ 
  progress, 
  status,
  fileSize,
  uploadedSize,
  timeRemaining,
  compact = false
}: ProgressBarProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-700 dark:text-gray-300 font-medium">{status}</span>
        <span className="text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
      </div>

      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-200">
        <div
          className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {!compact && fileSize && uploadedSize && (
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{formatSize(uploadedSize)} / {formatSize(fileSize)}</span>
          {timeRemaining && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
              <span>{formatTime(timeRemaining)} remaining</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}