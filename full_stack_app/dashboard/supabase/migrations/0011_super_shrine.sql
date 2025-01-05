/*
  # Dynamic Tables Management System

  1. New Tables
    - `uploaded_tables`
      - Tracks all dynamically created tables from file uploads
      - Stores metadata about the tables including schema and creation info
    
  2. Security
    - Enable RLS on uploaded_tables
    - Add policies for authenticated users
*/

-- Create table to track uploaded files and their corresponding tables
CREATE TABLE IF NOT EXISTS uploaded_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL UNIQUE,
  original_filename text NOT NULL,
  column_schema jsonb NOT NULL,
  row_count integer NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE uploaded_tables ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own uploaded tables"
ON uploaded_tables
FOR SELECT
TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "Users can insert their own tables"
ON uploaded_tables
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Create function to generate dynamic table name
CREATE OR REPLACE FUNCTION generate_safe_table_name(base_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  safe_name text;
  counter integer := 0;
  final_name text;
BEGIN
  -- Remove special characters and spaces, convert to lowercase
  safe_name := lower(regexp_replace(base_name, '[^a-zA-Z0-9]+', '_', 'g'));
  
  -- Add timestamp to make it unique
  final_name := safe_name || '_' || to_char(now(), 'YYYYMMDD_HH24MISS');
  
  -- Ensure it starts with a letter
  IF final_name !~ '^[a-z]' THEN
    final_name := 'tbl_' || final_name;
  END IF;
  
  RETURN final_name;
END;
$$;