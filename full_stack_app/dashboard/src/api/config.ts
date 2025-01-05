export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedFormats: {
    'text/csv': ['.csv'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls']
  }
};