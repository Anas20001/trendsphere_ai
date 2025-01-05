import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { FilePreview } from './FilePreview';
import { FileWithPreview, PreviewData } from './types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/x-parquet': ['.parquet']
};

export function FileUpload() {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
      return;
    }

    setFile(Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));

    try {
      // Generate preview data
      const preview = await generatePreview(file);
      setPreviewData(preview);
      setError(null);
    } catch (err) {
      setError('Error reading file: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          }
        });

      if (error) throw error;

      // Store metadata in Supabase
      const { error: metadataError } = await supabase
        .from('file_metadata')
        .insert({
          file_name: file.name,
          storage_path: data.path,
          size: file.size,
          type: file.type,
          uploaded_at: new Date().toISOString()
        });

      if (metadataError) throw metadataError;

      setError(null);
    } catch (err) {
      setError('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6
          transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-400'}
        `}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload 
            className={`w-12 h-12 mb-4 ${isDragActive ? 'text-indigo-500' : 'text-gray-400'}`}
          />
          <p className="text-base font-medium text-gray-700">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            or click to select files
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Supported formats: CSV, XLSX, XLS, PARQUET (max {MAX_FILE_SIZE / 1024 / 1024}MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{error}</span>
        </div>
      )}

      {isUploading && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Uploading...</span>
            <span className="text-gray-500">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {file && previewData && !isUploading && (
        <div className="mt-6">
          <FilePreview 
            data={previewData}
            onUpload={handleUpload}
          />
        </div>
      )}
    </div>
  );
}