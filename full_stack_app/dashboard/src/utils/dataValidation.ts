interface ValidationRule {
  type: 'required' | 'format' | 'unique' | 'range';
  field?: string;
  message: string;
  validate: (value: any) => boolean;
}

export const defaultRules: ValidationRule[] = [
  {
    type: 'required',
    message: 'Headers are required',
    validate: (data) => Array.isArray(data.headers) && data.headers.length > 0
  },
  {
    type: 'required',
    message: 'Data rows are required',
    validate: (data) => Array.isArray(data.rows) && data.rows.length > 0
  },
  {
    type: 'unique',
    message: 'Headers must be unique',
    validate: (data) => {
      const headers = data.headers;
      return new Set(headers).size === headers.length;
    }
  },
  {
    type: 'format',
    message: 'All rows must have the same number of columns as headers',
    validate: (data) => {
      const headerCount = data.headers.length;
      return data.rows.every(row => Object.keys(row).length === headerCount);
    }
  }
];

export function validateData(data: any, rules: ValidationRule[] = defaultRules): string[] {
  const errors: string[] = [];

  for (const rule of rules) {
    if (!rule.validate(data)) {
      errors.push(rule.message);
    }
  }

  return errors;
}

export function validateDataTypes(data: any): string[] {
  const errors: string[] = [];
  const rows = data.rows;
  const headers = data.headers;

  // Infer data types from first row
  const columnTypes = new Map<string, string>();
  
  if (rows.length > 0) {
    const firstRow = rows[0];
    headers.forEach(header => {
      const value = firstRow[header];
      columnTypes.set(header, inferDataType(value));
    });

    // Validate all rows match inferred types
    rows.forEach((row, index) => {
      headers.forEach(header => {
        const expectedType = columnTypes.get(header);
        const value = row[header];
        const actualType = inferDataType(value);

        if (expectedType !== actualType && value !== null && value !== undefined) {
          errors.push(`Row ${index + 1}, column "${header}": Expected ${expectedType}, got ${actualType}`);
        }
      });
    });
  }

  return errors;
}

function inferDataType(value: any): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (value instanceof Date) return 'date';
  if (!isNaN(Date.parse(value))) return 'date';
  if (!isNaN(Number(value))) return 'number';
  return 'string';
}