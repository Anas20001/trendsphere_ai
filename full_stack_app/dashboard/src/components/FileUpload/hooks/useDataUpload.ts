import { useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { logger } from '../../../lib/logger';

const STORAGE_BUCKET = 'data';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls']
};

interface UploadProgress {
  loaded: number;
  total: number;
}

export function useDataUpload() {
  const uploadToDatabase = useCallback(async (
    file: File,
    onProgress: (progress: number) => void
  ): Promise<void> => {
    logger.info('Starting file upload', { context: { fileName: file.name, fileSize: file.size } });

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    // Validate file type
    if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      throw new Error('Invalid file type. Supported formats: CSV, XLSX, XLS');
    }

    try {
      // Generate unique file path
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const extension = file.name.split('.').pop();
      const filePath = `uploads/${timestamp}-${sanitizedFileName}.${extension}`;

      logger.debug('Uploading file', { context: { filePath } });

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: ({ loaded, total }: UploadProgress) => {
            logger.debug('Upload progress', { context: { progress: (loaded / total) * 100 } });
            onProgress((loaded / total) * 100);
          }
        });

      if (error) {
        logger.error('Storage upload failed', { error });
        throw error;
      }

      // Check if metadata already exists for this file
      const { data: existingMetadata } = await supabase
        .from('file_metadata')
        .select('id')
        .eq('file_name', file.name)
        .single();

      if (existingMetadata) {
        // Update existing metadata
        const { error: updateError } = await supabase
          .from('file_metadata')
          .update({
            storage_path: data.path,
            size: file.size,
            type: file.type,
            uploaded_at: new Date().toISOString()
          })
          .eq('id', existingMetadata.id);

        if (updateError) throw updateError;
      } else {
        // Insert new metadata
        const { error: insertError } = await supabase
          .from('file_metadata')
          .insert({
            owner_id: (await supabase.auth.getUser()).data.user?.id,
            file_name: file.name,
            storage_path: data.path,
            size: file.size,
            type: file.type,
            uploaded_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      logger.info('File upload completed', { 
        context: { 
          filePath: data.path
        }
      });
    } catch (error) {
      logger.error('Upload failed', { error });
      throw error;
    }
  }, []);

  return { uploadToDatabase };
}