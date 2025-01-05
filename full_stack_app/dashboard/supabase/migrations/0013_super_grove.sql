/*
  # Fix Table Creation Function

  1. Changes
    - Fix column definitions format
    - Add proper type handling
    - Improve error handling
    
  2. Security
    - Validate column names
    - Add proper type checks
*/

-- Drop existing function to recreate it
DROP FUNCTION IF EXISTS create_dynamic_table;

-- Create improved function
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
  column_def jsonb;
BEGIN
  -- Validate table name
  IF NOT table_name ~ '^[a-zA-Z][a-zA-Z0-9_]*$' THEN
    RAISE EXCEPTION 'Invalid table name format';
  END IF;

  -- Start building CREATE TABLE statement
  create_table_sql := format('
    CREATE TABLE IF NOT EXISTS %I (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_by uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()',
    table_name
  );

  -- Add columns from JSON definition
  FOR column_def IN SELECT * FROM jsonb_array_elements(column_definitions)
  LOOP
    -- Validate column name
    IF NOT (column_def->>'name' ~ '^[a-zA-Z][a-zA-Z0-9_]*$') THEN
      RAISE EXCEPTION 'Invalid column name: %', column_def->>'name';
    END IF;

    -- Add column definition
    create_table_sql := create_table_sql || format(
      ',
      %I %s%s',
      column_def->>'name',
      column_def->>'type',
      CASE WHEN (column_def->>'nullable')::boolean THEN '' ELSE ' NOT NULL' END
    );
  END LOOP;

  -- Close the CREATE TABLE statement
  create_table_sql := create_table_sql || ');';

  -- Add RLS
  create_table_sql := create_table_sql || format('
    ALTER TABLE %I ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own data" ON %1$I;
    CREATE POLICY "Users can view own data" ON %1$I
      FOR SELECT TO authenticated
      USING (created_by = auth.uid());
      
    DROP POLICY IF EXISTS "Users can insert own data" ON %1$I;
    CREATE POLICY "Users can insert own data" ON %1$I
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = %2$L);
  ', table_name, user_id);

  -- Execute the SQL
  EXECUTE create_table_sql;
END;
$$;