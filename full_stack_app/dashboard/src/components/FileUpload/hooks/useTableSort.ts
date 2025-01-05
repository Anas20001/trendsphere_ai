import { useState, useMemo } from 'react';

interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

export function useTableSort<T extends Record<string, any>>(data: T[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const requestSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'ascending' };
      }
      
      if (current.direction === 'ascending') {
        return { key, direction: 'descending' };
      }
      
      return null;
    });
  };

  return { sortedData, sortConfig, requestSort };
}