import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Edit2, Check, X } from 'lucide-react';

interface DataTableProps {
  data: any[];
  columns: string[];
  onHeaderEdit: (oldHeader: string, newHeader: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export function DataTable({
  data,
  columns,
  onHeaderEdit,
  pageSize,
  onPageSizeChange,
}: DataTableProps) {
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const columnHelper = createColumnHelper<any>();
  const tableColumns: ColumnDef<any, any>[] = columns.map((col) => 
    columnHelper.accessor(col, {
      header: () => (
        <div className="flex items-center justify-between">
          {editingHeader === col ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="px-2 py-1 text-sm border rounded"
                autoFocus
              />
              <button
                onClick={() => {
                  if (editValue && editValue !== col) {
                    onHeaderEdit(col, editValue);
                  }
                  setEditingHeader(null);
                }}
                className="p-1 text-green-600 hover:text-green-700"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingHeader(null)}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>{col}</span>
              <button
                onClick={() => {
                  setEditingHeader(col);
                  setEditValue(col);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ),
    })
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2 py-1 border rounded text-sm"
        >
          {[5, 10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size} rows
            </option>
          ))}
        </select>
        <div className="text-sm text-gray-500">
          Total: {data.length} rows
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              {table.getFlatHeaders().map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {table.getRowModel().rows.slice(0, pageSize).map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}