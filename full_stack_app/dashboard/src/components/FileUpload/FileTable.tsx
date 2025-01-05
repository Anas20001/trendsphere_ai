import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ArrowUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTableSort } from './hooks/useTableSort';
import { useTableSearch } from './hooks/useTableSearch';
import { useTablePagination } from './hooks/useTablePagination';
import { TableData, EditHistory } from './types';

interface FileTableProps {
  data: TableData;
  onDataChange: (newData: TableData) => void;
  isLoading?: boolean;
}

export function FileTable({ data, onDataChange, isLoading = false }: FileTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [undoStack, setUndoStack] = useState<EditHistory[]>([]);
  const [redoStack, setRedoStack] = useState<EditHistory[]>([]);
  const { headers, rows } = data;

  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('tableData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      onDataChange(parsed);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('tableData', JSON.stringify(data));
  }, [data]);

  const handleCellEdit = useCallback((rowIndex: number, column: string, value: any) => {
    const oldValue = rows[rowIndex][column];
    const change: EditHistory = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: 'cell',
      changes: {
        before: oldValue,
        after: value,
        row: rowIndex,
        column
      }
    };

    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [column]: value };

    onDataChange({
      ...data,
      rows: newRows,
      editHistory: [...data.editHistory, change]
    });

    setUndoStack(prev => [...prev, change]);
    setRedoStack([]);
  }, [rows, onDataChange]);

  const handleUndo = useCallback(() => {
    const change = undoStack[undoStack.length - 1];
    if (!change) return;

    const newRows = [...rows];
    if (change.type === 'cell') {
      const { row, column } = change.changes;
      newRows[row] = { ...newRows[row], [column]: change.changes.before };
    }

    onDataChange({
      ...data,
      rows: newRows,
      editHistory: [...data.editHistory, { ...change, type: 'undo' }]
    });

    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, change]);
  }, [undoStack, rows, onDataChange]);

  const handleRedo = useCallback(() => {
    const change = redoStack[redoStack.length - 1];
    if (!change) return;

    const newRows = [...rows];
    if (change.type === 'cell') {
      const { row, column } = change.changes;
      newRows[row] = { ...newRows[row], [column]: change.changes.after };
    }

    onDataChange({
      ...data,
      rows: newRows,
      editHistory: [...data.editHistory, { ...change, type: 'redo' }]
    });

    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, change]);
  }, [redoStack, rows, onDataChange]);

  const { 
    sortedData,
    sortConfig,
    requestSort 
  } = useTableSort(rows);

  const { 
    filteredData,
    searchableColumns 
  } = useTableSearch(sortedData, headers, searchTerm);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    setCurrentPage,
    setPageSize
  } = useTablePagination(filteredData);

  const pageSizeOptions = useMemo(() => [10, 25, 50, 100], []);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      {/* Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            Redo
          </button>
        </div>
      </div>

      {/* File Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-gray-900 dark:text-white">{data.metadata.fileName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {(data.metadata.fileSize / 1024).toFixed(2)} KB • {data.metadata.totalRows} rows • {data.metadata.totalColumns} columns
            </p>
          </div>
        </div>
      </div>

      {/* Search and Page Size Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 
              text-gray-900 dark:text-gray-100 rounded-lg w-full sm:w-64
              placeholder-gray-400 dark:placeholder-gray-500
              focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
              focus:border-transparent transition-colors duration-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
              transition-colors duration-200"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  onClick={() => requestSort(header)}
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
                    ${searchableColumns.includes(header) ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                  `}
                >
                  <div className="flex items-center gap-1">
                    {header}
                    {searchableColumns.includes(header) && (
                      <ArrowUpDown className={`w-4 h-4 ${sortConfig?.key === header ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    onClick={() => {
                      setEditingCell({ row: rowIndex, col: header });
                      setEditValue(String(row[header] ?? ''));
                    }}
                  >
                    {editingCell?.row === rowIndex && editingCell?.col === header ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => {
                          handleCellEdit(rowIndex, header, editValue);
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCellEdit(rowIndex, header, editValue);
                            setEditingCell(null);
                          }
                        }}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        autoFocus
                      />
                    ) : (
                      formatCellValue(row[header])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
              text-gray-600 dark:text-gray-300 disabled:opacity-50 
              disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
              text-gray-600 dark:text-gray-300 disabled:opacity-50 
              disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatCellValue(value: any): string {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}