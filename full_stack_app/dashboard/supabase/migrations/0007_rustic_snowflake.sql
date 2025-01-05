/*
  # Fix Storage Upload Policies

  1. Security Changes
    - Add proper RLS policies for file uploads
    - Add policies for file metadata
    - Fix unauthorized access issues

  2. Changes
    - Update storage bucket configuration
    - Add proper file size limits
    - Configure MIME type restrictions
*/

-- Update storage bucket configuration
UPDATE storage.buckets
SET public = false,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY[
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
WHERE id = 'data';

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;

-- Create proper upload policy
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'data' AND
  auth.uid() IS NOT NULL
);

-- Create proper read policy
CREATE POLICY "Allow authenticated reads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'data' AND
  auth.uid() IS NOT NULL
);

-- Update file metadata policies
DROP POLICY IF EXISTS "Users can insert own file metadata" ON file_metadata;
DROP POLICY IF EXISTS "Users can read own file metadata" ON file_metadata;

CREATE POLICY "Users can insert file metadata"
ON file_metadata
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can read file metadata"
ON file_metadata
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);