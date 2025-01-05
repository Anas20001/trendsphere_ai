import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { DataTable } from './DataTable';
import { validateData, validateDataTypes } from '../../utils/dataValidation';
import { FILE_UPLOAD_CONFIG } from '../../api/config';

interface FileUploaderProps {
  onDataReady: (data: any) => void;
}

export function FileUploader({ onDataReady }: FileUploaderProps) {
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewRows, setPreviewRows] = useState(10);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    
    try {
      // Read file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = await processFileData(e.target?.result);
          const errors = validateData(data);
          const typeErrors = validateDataTypes(data);
          
          setPreviewData(data);
          setValidationErrors([...errors, ...typeErrors]);
          
          if (errors.length === 0 && typeErrors.length === 0) {
            onDataReady(data);
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to process file');
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to read file');
    }
  }, [onDataReady]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: FILE_UPLOAD_CONFIG.acceptedFormats,
    maxSize: FILE_UPLOAD_CONFIG.maxFileSize,
    multiple: false
  });

  const handleHeaderChange = (oldHeader: string, newHeader: string) => {
    if (!previewData) return;

    const updatedData = {
      ...previewData,
      headers: previewData.headers.map((h: string) => h === oldHeader ? newHeader : h),
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
    onDataReady(updatedData);
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          transition-colors duration-200
          ${isDragActive 
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10' 
            : 'border-gray-300 dark:border-gray-600'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className={`
          w-12 h-12 mx-auto mb-4
          ${isDragActive ? 'text-indigo-500' : 'text-gray-400'}
        `} />
        <p className="text-base font-medium text-gray-900 dark:text-white">
          {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          or click to select a file
        </p>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Supported formats: CSV, XLSX, XLS (max {FILE_UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB)
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {previewData && (
        <div className="space-y-4">
          {validationErrors.length > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Validation Warnings
              </h4>
              <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <DataTable
            data={previewData.rows}
            columns={previewData.headers}
            onHeaderEdit={handleHeaderChange}
            pageSize={previewRows}
            onPageSizeChange={setPreviewRows}
          />
        </div>
      )}
    </div>
  );
}

async function processFileData(data: any): Promise<any> {
  // Process file data based on type
  // This is a placeholder - implement actual file processing logic
  return {
    headers: ['Column1', 'Column2'],
    rows: [
      { Column1: 'Value1', Column2: 'Value2' },
      { Column1: 'Value3', Column2: 'Value4' }
    ]
  };
}