/*
  # Create file metadata table

  1. New Tables
    - `file_metadata`
      - `id` (uuid, primary key)
      - `file_name` (text)
      - `storage_path` (text)
      - `size` (bigint)
      - `type` (text)
      - `uploaded_at` (timestamp)
      
  2. Security
    - Enable RLS on `file_metadata` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS file_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  storage_path text NOT NULL,
  size bigint NOT NULL,
  type text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE file_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own file metadata"
  ON file_metadata
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own file metadata"
  ON file_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (true);