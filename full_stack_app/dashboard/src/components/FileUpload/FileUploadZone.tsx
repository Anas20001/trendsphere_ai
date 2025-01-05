import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileUploadZoneProps {
  onFilesAccepted: (files: File[]) => void;
  disabled?: boolean;
  maxSize?: number;
  acceptedTypes?: Record<string, string[]>;
}

export function FileUploadZone({
  onFilesAccepted,
  disabled = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = {
    'text/csv': ['.csv'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls']
  }
}: FileUploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: onFilesAccepted,
    disabled,
    maxSize,
    accept: acceptedTypes,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={cn("relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
        isDragActive ? "border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-500/10" : "border-gray-300 dark:border-gray-600",
        isDragReject && "border-red-500 bg-red-50/50 dark:border-red-400 dark:bg-red-500/10",
        disabled && "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800",
        !disabled && "hover:border-indigo-400 dark:hover:border-indigo-300 cursor-pointer"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={cn(
          "p-4 rounded-full bg-gray-50 dark:bg-gray-800",
          isDragActive && "bg-indigo-50 dark:bg-indigo-900/20",
          isDragReject && "bg-red-50 dark:bg-red-900/20"
        )}>
          <UploadCloud className={cn(
            "w-10 h-10",
            isDragActive ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500",
            isDragReject && "text-red-500 dark:text-red-400"
          )} />
        </div>

        <div className="space-y-2 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isDragActive 
              ? "Drop your file here" 
              : "Drag & drop your file here"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            or click to select a file
          </p>
        </div>

        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>
            Supported formats: CSV, XLSX, XLS (max {maxSize / 1024 / 1024}MB)
          </span>
        </div>
      </div>
    </div>
  );
}