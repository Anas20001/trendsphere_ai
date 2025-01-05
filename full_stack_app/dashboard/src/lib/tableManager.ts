import { supabase } from './supabase';
import { logger } from './logger';

interface ColumnSchema {
  name: string;
  type: string;
  nullable: boolean;
}

interface TableMetadata {
  tableName: string;
  originalFilename: string;
  columnSchema: ColumnSchema[];
  rowCount: number;
}

function inferColumnType(value: any): string {
  if (value === null || value === undefined) return 'text';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'bigint' : 'numeric(20,4)';
  }
  if (typeof value === 'boolean') return 'boolean';
  if (value instanceof Date) return 'timestamptz';
  if (!isNaN(Date.parse(value))) return 'timestamptz';
  return 'text';
}

function sanitizeColumnName(name: string): string {
  // Remove special characters and spaces
  let safeName = name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  // Ensure it starts with a letter
  if (!/^[a-z]/.test(safeName)) {
    safeName = 'col_' + safeName;
  }
  
  // Remove consecutive underscores
  safeName = safeName.replace(/_+/g, '_');
  
  // Remove trailing underscore
  safeName = safeName.replace(/_+$/, '');
  
  return safeName;
}

export async function createTableFromData(
  data: any[],
  fileName: string,
  userId: string
): Promise<TableMetadata> {
  try {
    // Generate table name from file name
    const { data: tableNameResult } = await supabase
      .rpc('generate_safe_table_name', { base_name: fileName.split('.')[0] });
    
    const tableName = tableNameResult as string;
    
    // Infer schema from data
    const columnSchema = inferSchema(data).map(col => ({
      ...col,
      name: sanitizeColumnName(col.name)
    }));
    
    // Create dynamic table using our new function
    const { error: createError } = await supabase.rpc('create_dynamic_table', { 
      table_name: tableName,
      column_definitions: columnSchema,
      user_id: userId
    });

    if (createError) throw createError;
    
    // Transform data to match sanitized column names
    const transformedData = data.map(row => {
      const newRow: Record<string, any> = {};
      Object.entries(row).forEach(([key, value]) => {
        newRow[sanitizeColumnName(key)] = value;
      });
      return newRow;
    });

    // Insert data in chunks to avoid timeouts
    const chunkSize = 1000;
    for (let i = 0; i < transformedData.length; i += chunkSize) {
      const chunk = transformedData.slice(i, i + chunkSize);
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(chunk);
      
      if (insertError) throw insertError;
    }

    // Record table metadata
    const metadata: TableMetadata = {
      tableName,
      originalFilename: fileName,
      columnSchema,
      rowCount: data.length
    };

    const { error: metadataError } = await supabase
      .from('uploaded_tables')
      .insert({
        table_name: tableName,
        original_filename: fileName,
        column_schema: columnSchema,
        row_count: data.length,
        created_by: userId
      });

    if (metadataError) throw metadataError;

    return metadata;
  } catch (error) {
    logger.error('Failed to create table from data', { error });
    throw error;
  }
}

function inferSchema(data: any[]): ColumnSchema[] {
  if (!data.length) return [];

  const firstRow = data[0];
  return Object.entries(firstRow).map(([key, value]) => {
    const type = inferColumnType(value);
    return {
      name: key,
      type,
      nullable: true
    };
  });
}