import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { ProcessedData } from './hooks/useFileProcessor';

interface EnhancedDataPreviewProps {
  data: ProcessedData;
  onHeaderChange: (oldHeader: string, newHeader: string) => void;
  onValidate: () => void;
  isValid: boolean;
}

export function EnhancedDataPreview({
  data,
  onHeaderChange,
  onValidate,
  isValid
}: EnhancedDataPreviewProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const columns: ColumnDef<any>[] = data.headers.map(header => ({
    accessorKey: header,
    header: () => (
      <div className="flex items-center justify-between">
        {editingHeader === header ? (
          <div className="flex items-center space-x-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 w-[150px]"
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (editValue && editValue !== header) {
                  onHeaderChange(header, editValue);
                }
                setEditingHeader(null);
              }}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingHeader(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>{header}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditingHeader(header);
                setEditValue(header);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    )
  }));

  const table = useReactTable({
    data: data.rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Preview</h3>
          <p className="text-sm text-muted-foreground">
            {data.fileName} • {data.totalRows} rows
          </p>
        </div>
        
        {data.validationErrors.length > 0 && (
          <div className="flex items-center text-amber-500 text-sm">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span>{data.validationErrors.length} validation issues found</span>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.totalRows} rows
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}