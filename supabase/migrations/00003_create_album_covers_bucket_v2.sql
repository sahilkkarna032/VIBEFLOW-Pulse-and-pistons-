-- Create storage bucket for album covers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'album-covers',
  'album-covers',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for album covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload album covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update album covers" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public read access for album covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'album-covers');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload album covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'album-covers');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update album covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'album-covers');