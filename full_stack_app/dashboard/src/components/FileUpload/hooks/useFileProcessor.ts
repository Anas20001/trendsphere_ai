import { useState } from 'react';
import { read, utils } from 'xlsx';
import { logger } from '../../../lib/logger';

export interface ProcessedData {
  headers: string[];
  rows: Record<string, any>[];
  totalRows: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  validationErrors: string[];
}

export function useFileProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processFile = async (file: File): Promise<ProcessedData> => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const data = await readFileData(file, (progress) => {
        setProgress(progress);
      });

      // Basic validation
      const validationErrors = validateData(data);

      return {
        headers: data.headers,
        rows: data.rows,
        totalRows: data.rows.length,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        validationErrors
      };
    } catch (error) {
      logger.error('File processing failed', { error });
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return {
    processFile,
    isProcessing,
    progress
  };
}

async function readFileData(
  file: File,
  onProgress: (progress: number) => void
): Promise<{ headers: string[]; rows: Record<string, any>[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array', cellDates: true });
        
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[][] = utils.sheet_to_json(firstSheet, {
          header: 1,
          raw: false,
          dateNF: 'yyyy-mm-dd'
        });

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1).map((row: any[]) => {
          const obj: Record<string, any> = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });

        resolve({ headers, rows });
      } catch (error) {
        reject(error);
      }
    };

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress((e.loaded / e.total) * 100);
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

function validateData(data: { headers: string[]; rows: any[] }): string[] {
  const errors: string[] = [];

  // Check for empty headers
  if (!data.headers.length) {
    errors.push('No headers found in file');
  }

  // Check for duplicate headers
  const uniqueHeaders = new Set(data.headers);
  if (uniqueHeaders.size !== data.headers.length) {
    errors.push('Duplicate column headers found');
  }

  // Check for empty rows
  if (!data.rows.length) {
    errors.push('No data rows found in file');
  }

  // Check for consistent column count
  const headerCount = data.headers.length;
  data.rows.forEach((row, index) => {
    if (Object.keys(row).length !== headerCount) {
      errors.push(`Row ${index + 1} has inconsistent column count`);
    }
  });

  return errors;
}