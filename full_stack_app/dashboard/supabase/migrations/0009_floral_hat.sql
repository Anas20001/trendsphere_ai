/*
  # Fix file upload authorization

  1. Changes
    - Update storage bucket RLS policies to properly handle authenticated users
    - Add missing RLS policies for file_metadata table
    - Fix owner_id handling in file_metadata table
    - Add proper bucket configuration

  2. Security
    - Ensure only authenticated users can upload files
    - Restrict users to accessing only their own files
    - Add proper file size and type restrictions
*/

-- Ensure storage bucket exists and is configured correctly
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'data'
  ) THEN
    INSERT INTO storage.buckets (id, name)
    VALUES ('data', 'data');
  END IF;
END $$;

-- Update bucket configuration
UPDATE storage.buckets
SET public = false,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY[
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
WHERE id = 'data';

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;

-- Create proper storage policies
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'data' AND
  auth.uid() = owner
);

CREATE POLICY "Allow authenticated reads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'data' AND
  auth.uid() = owner
);

-- Update file_metadata table
ALTER TABLE file_metadata
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();

-- Drop existing file_metadata policies
DROP POLICY IF EXISTS "Users can insert file metadata" ON file_metadata;
DROP POLICY IF EXISTS "Users can read file metadata" ON file_metadata;

-- Create proper file_metadata policies
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