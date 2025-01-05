import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { useAuth } from './useAuth';

export interface StoredFile {
  id: string;
  fileName: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: Date;
  userId: string;
}

export function useFileStorage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserFiles();
    }
  }, [user]);

  async function fetchUserFiles() {
    try {
      const { data: metadata, error: metadataError } = await supabase
        .from('file_metadata')
        .select('*')
        .eq('owner_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (metadataError) throw metadataError;

      setFiles(
        metadata.map(file => ({
          id: file.id,
          fileName: file.file_name,
          size: file.size,
          type: file.type,
          path: file.storage_path,
          uploadedAt: new Date(file.uploaded_at),
          userId: file.owner_id
        }))
      );
    } catch (err) {
      logger.error('Failed to fetch files', { error: err });
      setError('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteFile(fileId: string, path: string) {
    try {
      // Verify ownership
      const { data: file } = await supabase
        .from('file_metadata')
        .select('owner_id')
        .eq('id', fileId)
        .single();

      if (file?.owner_id !== user?.id) {
        throw new Error('Unauthorized');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('data')
        .remove([path]);

      if (storageError) throw storageError;

      // Delete metadata
      const { error: metadataError } = await supabase
        .from('file_metadata')
        .delete()
        .match({ id: fileId });

      if (metadataError) throw metadataError;

      // Update local state
      setFiles(files => files.filter(f => f.id !== fileId));
      return true;
    } catch (err) {
      logger.error('Failed to delete file', { error: err });
      throw err;
    }
  }

  return {
    files,
    isLoading,
    error,
    deleteFile,
    refreshFiles: fetchUserFiles
  };
}