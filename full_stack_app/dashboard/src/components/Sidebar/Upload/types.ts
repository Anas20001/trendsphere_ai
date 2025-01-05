export interface FileWithPreview extends File {
  preview: string;
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
  totalRows: number;
  totalColumns: number;
}