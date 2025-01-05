import { useState } from 'react';
import { read, utils } from 'xlsx';
import { supabase } from '../lib/supabase';
import { FILE_UPLOAD_CONFIG } from '../api/config';
import { logger } from '../lib/logger';

interface UseFileProcessingOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export function useFileProcessing({ onSuccess, onError }: UseFileProcessingOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = (file: File): boolean => {
    if (file.size > FILE_UPLOAD_CONFIG.maxFileSize) {
      throw new Error(`File size exceeds ${FILE_UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB limit`);
    }

    const isValidType = Object.keys(FILE_UPLOAD_CONFIG.acceptedFormats).includes(file.type);
    if (!isValidType) {
      throw new Error('Invalid file type. Supported formats: CSV, XLSX, XLS');
    }

    return true;
  };

  const processFile = async (file: File) => {
    try {
      setIsUploading(true);
      setProgress(0);

      // Read file
      const data = await readFileData(file, (progress) => {
        setProgress(progress);
      });

      // Upload to Supabase storage
      setIsUploading(false);
      setIsProcessing(true);
      setProgress(50);

      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('data')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setProgress(100);
      onSuccess?.(data);
      return data;
    } catch (error) {
      logger.error('File processing failed', { error });
      onError?.(error instanceof Error ? error : new Error('Processing failed'));
      throw error;
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return {
    processFile,
    isUploading,
    isProcessing,
    progress,
    validateFile
  };
}

async function readFileData(
  file: File,
  onProgress: (progress: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(firstSheet, {
          header: 1,
          raw: false,
          dateNF: 'yyyy-mm-dd'
        });

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1).map(row => {
          const obj: Record<string, any> = {};
          headers.forEach((header, index) => {
            obj[header] = (row as any[])[index];
          });
          return obj;
        });

        resolve({
          headers,
          rows,
          totalRows: rows.length,
          totalColumns: headers.length,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          lastModified: new Date(file.lastModified).toLocaleString()
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsArrayBuffer(file);
  });
}