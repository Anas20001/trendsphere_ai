import { read, utils } from 'xlsx';
import { PreviewData } from './types';

export async function generatePreview(file: File): Promise<PreviewData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(firstSheet, { 
          header: 1,
          raw: false,
          dateNF: 'yyyy-mm-dd'
        });

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1).map(row => {
          const obj: Record<string, any> = {};
          headers.forEach((header, index) => {
            obj[header] = (row as any[])[index];
          });
          return obj;
        });

        resolve({
          headers,
          rows,
          totalRows: rows.length,
          totalColumns: headers.length
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsArrayBuffer(file);
  });
}