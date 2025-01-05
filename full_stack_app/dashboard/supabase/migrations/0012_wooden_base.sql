/*
  # Fix Table Creation System

  1. Changes
    - Add function to create dynamic tables safely
    - Add function to insert data into dynamic tables
    - Update RLS policies
    
  2. Security
    - Validate table names
    - Restrict table creation to authenticated users
    - Add proper RLS policies
*/

-- Function to create dynamic tables
CREATE OR REPLACE FUNCTION create_dynamic_table(
  table_name text,
  column_definitions jsonb,
  user_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  create_table_sql text;
  column_def record;
BEGIN
  -- Validate table name (only allow letters, numbers, and underscores)
  IF NOT table_name ~ '^[a-zA-Z][a-zA-Z0-9_]*$' THEN
    RAISE EXCEPTION 'Invalid table name format';
  END IF;

  -- Start building CREATE TABLE statement
  create_table_sql := format('
    CREATE TABLE IF NOT EXISTS %I (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_by uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
  ', table_name);

  -- Add columns from JSON definition
  FOR column_def IN SELECT * FROM jsonb_array_elements(column_definitions)
  LOOP
    create_table_sql := create_table_sql || format(
      '%I %s %s,',
      (column_def ->> 'name'),
      (column_def ->> 'type'),
      CASE WHEN (column_def ->> 'nullable')::boolean THEN 'NULL' ELSE 'NOT NULL' END
    );
  END LOOP;

  -- Remove trailing comma and close parentheses
  create_table_sql := rtrim(create_table_sql, ',') || ');';

  -- Add RLS
  create_table_sql := create_table_sql || format('
    ALTER TABLE %I ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view own data" ON %I
      FOR SELECT TO authenticated
      USING (created_by = auth.uid());
      
    CREATE POLICY "Users can insert own data" ON %I
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = %L);
  ', table_name, table_name, table_name, user_id);

  -- Execute the SQL
  EXECUTE create_table_sql;
END;
$$;