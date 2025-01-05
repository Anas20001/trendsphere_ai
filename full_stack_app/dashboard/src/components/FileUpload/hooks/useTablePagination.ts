import { useState, useMemo, useEffect } from 'react';

export function useTablePagination<T>(data: T[], initialPageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = useMemo(() => Math.ceil(data.length / pageSize), [data.length, pageSize]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    paginatedData
  };
}