import { useState } from 'react';
import { createTableFromData } from '../lib/tableManager';
import { useAuth } from './useAuth';
import { logger } from '../lib/logger';

export function useTableManager() {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const createTable = async (data: any[], fileName: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsCreating(true);
    try {
      const metadata = await createTableFromData(data, fileName, user.id);
      return metadata;
    } catch (error) {
      logger.error('Failed to create table', { error });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createTable,
    isCreating
  };
}