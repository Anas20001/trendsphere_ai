import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface SidebarUploadProps {
  isCollapsed?: boolean;
}

export function SidebarUpload({ isCollapsed = false }: SidebarUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleUploadClick = () => {
    setUploadStatus('uploading');
    // Simulate upload process
    setTimeout(() => {
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2000);
    }, 1500);
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
        return (
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <button
      onClick={handleUploadClick}
      title={isCollapsed ? "Upload Files" : undefined}
      className={`
        group relative w-full flex items-center gap-3 px-3 py-2.5
        text-gray-600 hover:text-indigo-600
        hover:bg-indigo-50 rounded-lg transition-all duration-200
        ${uploadStatus === 'uploading' ? 'pointer-events-none opacity-70' : ''}
      `}
    >
      <div className="relative">
        <Upload className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
        <div className="absolute -right-1 -bottom-1">
          {getStatusIcon()}
        </div>
      </div>
      
      {!isCollapsed && (
        <>
          <span className="text-sm font-medium flex-1 text-left">Upload Files</span>
          <span className="text-xs text-gray-400 group-hover:text-indigo-400">
            CSV, XLSX
          </span>
        </>
      )}
    </button>
  );
}