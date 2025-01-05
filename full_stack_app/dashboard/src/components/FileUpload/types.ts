export interface FileWithPreview extends File {
  preview: string;
}

export interface FileMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  totalRows: number;
  totalColumns: number;
  columnMappings: Record<string, string>;
  validationErrors?: ValidationError[];
  modifiedAt: Date;
}

export interface ValidationError {
  row: number;
  column: string;
  value: any;
  message: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface PreviewData {
  headers: string[];
  rows: Record<string, any>[];
  metadata: FileMetadata;
}

export interface EditHistory {
  id: string;
  timestamp: Date;
  type: 'cell' | 'row' | 'column';
  changes: {
    before: any;
    after: any;
    row?: number;
    column?: string;
  };
}

export interface TableData {
  headers: string[];
  rows: Record<string, any>[];
  metadata: FileMetadata;
  editHistory: EditHistory[];
}

export type ProcessingStatus = 
  | 'idle'
  | 'processing'
  | 'processed'
  | 'uploading'
  | 'completed'
  | 'error';