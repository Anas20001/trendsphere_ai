/*
  # Add storage bucket for file uploads

  1. New Storage Bucket
    - Creates a new storage bucket named 'data' for file uploads
    - Configures public access and file size limits
  
  2. Security
    - Enables RLS policies for secure access
    - Adds policies for authenticated users to upload and read files
*/

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('data', 'data', false);

-- Set bucket size limit to 10MB per file
UPDATE storage.buckets
SET file_size_limit = 10485760,
    allowed_mime_types = ARRAY[
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
WHERE id = 'data';

-- Enable row level security
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create upload policy for authenticated users
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'data' AND
  owner = auth.uid()
);

-- Create read policy for authenticated users
CREATE POLICY "Allow authenticated reads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'data' AND
  owner = auth.uid()
);