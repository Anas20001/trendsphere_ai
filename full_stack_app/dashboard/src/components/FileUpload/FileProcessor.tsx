import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { utils, write } from 'xlsx';
import { useTableManager } from '../../hooks/useTableManager';
import { FileUploadZone } from './FileUploadZone';
import { EnhancedDataPreview } from './EnhancedDataPreview';
import { ProcessingStatus } from './ProcessingStatus';
import { useFileStorage } from '../../hooks/useFileStorage';
import { Button } from '../ui/button';
import { useFileProcessor } from './hooks/useFileProcessor';
import { logger } from '../../lib/logger';
import type { ProcessedData } from './hooks/useFileProcessor';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Supported file types and their content types
const SUPPORTED_FILE_TYPES = {
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'xls': 'application/vnd.ms-excel',
  'csv': 'text/csv',
  'json': 'application/json',
} as const;

interface FileProcessorProps {
  onStatusChange?: (status: 'idle' | 'processing' | 'processed' | 'error' | 'completed') => void;
  onUploadComplete?: (fileUrl: string) => void;
}

interface FileUploadZoneProps {
  onFilesAccepted: (files: File[]) => Promise<void>;
  disabled: boolean;
  acceptedTypes: {
    [key: string]: string[];
  };
}

export function FileProcessor({ onStatusChange, onUploadComplete }: FileProcessorProps) {
  const { user } = useAuth();
  const { refreshFiles } = useFileStorage();
  const { createTable, isCreating } = useTableManager();
  const [previewData, setPreviewData] = useState<ProcessedData | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'processed' | 'error' | 'completed'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { processFile, isProcessing, progress } = useFileProcessor();

  const handleFilesAccepted = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !Object.keys(SUPPORTED_FILE_TYPES).includes(fileExtension)) {
      toast.error('Unsupported file format. Please upload XLSX, XLS, CSV, or JSON files.');
      return;
    }
    
    try {
      setStatus('processing');
      onStatusChange?.('processing');
      const result = await processFile(file);
      setPreviewData(result);
      setIsValid(result.validationErrors.length === 0);
      setStatus('processed');
      onStatusChange?.('processed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid file';
      toast.error(errorMessage);
      setStatus('error');
      onStatusChange?.('error');
      logger.error('File processing error', { error: new Error(errorMessage) });
    }
  }, [processFile, onStatusChange]);

  const handleHeaderChange = (oldHeader: string, newHeader: string) => {
    if (!previewData) return;

    const updatedData = {
      ...previewData,
      headers: previewData.headers.map((h: string) => 
        h === oldHeader ? newHeader : h
      ),
      rows: previewData.rows.map((row: any) => {
        const newRow = { ...row };
        if (oldHeader in newRow) {
          newRow[newHeader] = newRow[oldHeader];
          delete newRow[oldHeader];
        }
        return newRow;
      })
    };

    setPreviewData(updatedData);
  };

  const uploadToStorage = async (file: File, filePath: string): Promise<string> => {
    const { data: storageData, error: uploadError } = await supabase.storage
      .from('data')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      logger.error('Storage upload error', { error: uploadError });
      throw new Error('Failed to upload to storage: ' + uploadError.message);
    }

    if (!storageData?.path) {
      throw new Error('No storage path returned from upload');
    }

    const { data: urlData } = await supabase.storage
      .from('data')
      .createSignedUrl(storageData.path, 31536000); // 1 year expiry

    if (!urlData?.signedUrl) {
      throw new Error('Failed to generate signed URL');
    }

    return urlData.signedUrl;
  };

  const saveFileMetadata = async (params: {
    fileName: string;
    storagePath: string;
    size: number;
    type: string;
    ownerId: string;
    publicUrl: string;
  }) => {
    const { error: metadataError } = await supabase
      .from('file_metadata')
      .insert({
        file_name: params.fileName,
        storage_path: params.storagePath,
        size: params.size,
        type: params.type,
        owner_id: params.ownerId,
        public_url: params.publicUrl,
        uploaded_at: new Date().toISOString()
      });

    if (metadataError) {
      logger.error('Metadata save error', { error: metadataError });
      throw new Error('Failed to save file metadata: ' + metadataError.message);
    }
  };

  const processWithBackend = async (fileUrl: string, userId: string, tableName: string) => {
    if (!API_URL) {
      logger.warn('Backend API URL not configured, skipping backend processing');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/load-file/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_url: fileUrl, user_id: userId, table_name: tableName })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Failed to process file: ${response.status}`);
      }

      // Optional analytics assessment
      try {
        const analyticsResponse = await fetch(`${API_URL}/api/v1/sql-agent/assess-table`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            table_name: tableName
          })
        });

        if (!analyticsResponse.ok) {
          const responseText = await analyticsResponse.text();
          logger.warn('Analytics assessment failed', { error: new Error(responseText) });
        }
      } catch (error) {
        // Don't fail the upload if analytics fails
        logger.warn('Analytics assessment error', { error: error instanceof Error ? error : new Error(String(error)) });
      }
    } catch (error) {
      // Log but don't fail the upload if backend processing fails
      logger.error('Backend processing error', { error: error instanceof Error ? error : new Error(String(error)) });
      toast.warning('File uploaded but backend processing failed. Some features may be limited.');
    }
  };

  const handleSave = async () => {
    if (!previewData || !user) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Prepare file
      const timestamp = Date.now();
      const fileName = `${timestamp}-${previewData.fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `uploads/${user.id}/${fileName}`;
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'xlsx';

      // Convert data to XLSX
      const ws = utils.json_to_sheet(previewData.rows);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Sheet1');
      const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
      
      // Create file blob
      const blob = new Blob([excelBuffer], { 
        type: SUPPORTED_FILE_TYPES[fileExtension as keyof typeof SUPPORTED_FILE_TYPES] || SUPPORTED_FILE_TYPES.xlsx
      });
      const file = new File([blob], fileName, { type: blob.type });

      // Upload file and get URL
      const fileUrl = await uploadToStorage(file, filePath);

      // Save metadata
      await saveFileMetadata({
        fileName,
        storagePath: filePath,
        size: file.size,
        type: file.type,
        ownerId: user.id,
        publicUrl: fileUrl
      });

      // Notify parent component
      onUploadComplete?.(fileUrl);

      // Process with backend if available
      await processWithBackend(fileUrl, user.id, fileName.split('.')[0].toLowerCase());

      toast.success('File uploaded successfully');
      setPreviewData(null);
      setStatus('completed');
      onStatusChange?.('completed');
      refreshFiles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      setUploadError(errorMessage);
      toast.error(errorMessage);
      logger.error('Save error', { error: new Error(errorMessage) });
      setStatus('error');
      onStatusChange?.('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileUploadZone
        onFilesAccepted={handleFilesAccepted}
        disabled={isUploading || isProcessing}
        acceptedTypes={{
          'text/csv': ['.csv'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
          'application/vnd.ms-excel': ['.xls'],
          'application/json': ['.json']
        }}
      />

      {isProcessing && (
        <ProcessingStatus
          progress={progress}
          isUploading={isUploading}
          isProcessing={isProcessing}
        />
      )}

      {previewData && !isProcessing && (
        <div className="space-y-6">
          <EnhancedDataPreview
            data={previewData}
            onHeaderChange={handleHeaderChange}
            onValidate={() => setIsValid(true)}
            isValid={isValid}
          />
          
          {uploadError && (
            <div className="text-red-500 text-sm mt-2">
              {uploadError}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={async () => {
                if (!isValid) {
                  toast.error('Please validate the data before proceeding');
                  return;
                }
                await handleSave();
              }}
              disabled={isProcessing || isUploading || isCreating}
              variant="default"
            >
              {isUploading || isCreating ? 'Processing...' : 'Process & Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}