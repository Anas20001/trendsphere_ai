/*
  # Fix RLS Policies for File Upload

  1. Changes
    - Update storage bucket RLS policies to properly handle authenticated users
    - Fix file metadata table RLS policies
    - Add proper owner tracking for uploaded files

  2. Security
    - Ensure authenticated users can upload files
    - Maintain proper access control
    - Track file ownership
*/

-- Update storage bucket RLS policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;

CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'data' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated reads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'data' AND
  auth.role() = 'authenticated'
);

-- Add owner_id column to file_metadata
ALTER TABLE file_metadata
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id);

-- Update file metadata RLS policies
DROP POLICY IF EXISTS "Users can insert file metadata" ON file_metadata;
DROP POLICY IF EXISTS "Users can read file metadata" ON file_metadata;

CREATE POLICY "Users can insert file metadata"
ON file_metadata
FOR INSERT
TO authenticated
WITH CHECK (
  auth.role() = 'authenticated' AND
  owner_id = auth.uid()
);

CREATE POLICY "Users can read file metadata"
ON file_metadata
FOR SELECT
TO authenticated
USING (
  auth.role() = 'authenticated' AND
  owner_id = auth.uid()
);

-- Update existing records to set owner_id
UPDATE file_metadata
SET owner_id = auth.uid()
WHERE owner_id IS NULL;