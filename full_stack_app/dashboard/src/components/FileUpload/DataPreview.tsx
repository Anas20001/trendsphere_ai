import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Edit2, Check, X } from 'lucide-react';

interface DataPreviewProps {
  data: {
    headers: string[];
    rows: any[];
    totalRows: number;
  };
  onHeaderChange: (oldHeader: string, newHeader: string) => void;
}

export function DataPreview({ data, onHeaderChange }: DataPreviewProps) {
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [previewRows] = useState(10);

  const handleHeaderEdit = (header: string) => {
    setEditingHeader(header);
    setEditValue(header);
  };

  const handleHeaderSave = (oldHeader: string) => {
    if (editValue && editValue !== oldHeader) {
      onHeaderChange(oldHeader, editValue);
    }
    setEditingHeader(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Data Preview</h3>
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(previewRows, data.rows.length)} of {data.totalRows} rows
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {data.headers.map((header, index) => (
                <TableHead key={index}>
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
                        onClick={() => handleHeaderSave(header)}
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
                    <div className="flex items-center justify-between">
                      <span>{header}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleHeaderEdit(header)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.slice(0, previewRows).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {data.headers.map((header, colIndex) => (
                  <TableCell key={colIndex}>{row[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}