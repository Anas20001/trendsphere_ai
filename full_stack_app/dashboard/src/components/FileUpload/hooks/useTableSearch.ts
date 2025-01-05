import { useMemo } from 'react';

export function useTableSearch<T extends Record<string, any>>(
  data: T[],
  headers: string[],
  searchTerm: string
) {
  const searchableColumns = useMemo(() => {
    return headers.filter(header => {
      const firstValue = data[0]?.[header];
      return typeof firstValue === 'string' || typeof firstValue === 'number';
    });
  }, [headers, data]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowercaseSearch = searchTerm.toLowerCase();
    return data.filter(row => {
      return searchableColumns.some(column => {
        const value = row[column];
        if (value == null) return false;
        return String(value).toLowerCase().includes(lowercaseSearch);
      });
    });
  }, [data, searchTerm, searchableColumns]);

  return { filteredData, searchableColumns };
}