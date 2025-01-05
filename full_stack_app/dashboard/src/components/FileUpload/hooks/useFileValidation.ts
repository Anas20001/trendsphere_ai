import { useState, useCallback } from 'react';
import { logger } from '../../../lib/logger';

interface ValidationOptions {
  maxSize?: number;
  acceptedTypes?: Record<string, string[]>;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ACCEPTED_TYPES = {
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls']
};

export function useFileValidation({ 
  maxSize = DEFAULT_MAX_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES
}: ValidationOptions = {}) {
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    logger.debug('Validating file', { 
      context: { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type 
      }
    });

    // Check file size
    if (file.size > maxSize) {
      const errorMessage = `File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`;
      logger.warn('File size validation failed', { 
        context: { 
          fileSize: file.size, 
          maxSize 
        }
      });
      setError(errorMessage);
      return false;
    }

    // Check file type
    if (!Object.keys(acceptedTypes).includes(file.type)) {
      logger.warn('File type validation failed', { 
        context: { 
          fileType: file.type, 
          acceptedTypes 
        }
      });
      setError(`File "${file.name}" has an invalid format. Please upload CSV or Excel files only.`);
      return false;
    }

    logger.debug('File validation passed');
    return true;
  }, [maxSize, acceptedTypes]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { validateFile, error, clearError };
}