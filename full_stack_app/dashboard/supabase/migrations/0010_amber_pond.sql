/*
  # Fix file metadata schema

  1. Changes
    - Remove unused columns
    - Add proper constraints
    - Update RLS policies

  2. Security
    - Maintain RLS policies
    - Ensure proper owner_id handling
*/

-- Update file_metadata table schema
ALTER TABLE file_metadata
  DROP COLUMN IF EXISTS original_name,
  ALTER COLUMN file_name SET NOT NULL,
  ALTER COLUMN storage_path SET NOT NULL,
  ALTER COLUMN size SET NOT NULL,
  ALTER COLUMN type SET NOT NULL,
  ALTER COLUMN owner_id SET NOT NULL,
  ALTER COLUMN uploaded_at SET DEFAULT now();

-- Recreate RLS policies with proper checks
DROP POLICY IF EXISTS "Users can insert file metadata" ON file_metadata;
DROP POLICY IF EXISTS "Users can read file metadata" ON file_metadata;

CREATE POLICY "Users can insert file metadata"
ON file_metadata
FOR INSERT
TO authenticated
WITH CHECK (
  owner_id = auth.uid()
);

CREATE POLICY "Users can read file metadata"
ON file_metadata
FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid()
);