import React from 'react';
import { Progress } from '../ui/progress';
import { Clock } from 'lucide-react';

interface ProcessingStatusProps {
  progress: number;
  isUploading: boolean;
  isProcessing: boolean;
}

export function ProcessingStatus({
  progress,
  isUploading,
  isProcessing
}: ProcessingStatusProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isUploading ? 'Uploading...' : isProcessing ? 'Processing...' : ''}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round(progress)}%
        </span>
      </div>

      <Progress value={progress} className="w-full" />

      {isProcessing && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>This may take a few minutes</span>
        </div>
      )}
    </div>
  );
}