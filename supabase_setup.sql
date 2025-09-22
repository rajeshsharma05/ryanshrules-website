-- Create comics table
CREATE TABLE comics (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        date VARCHAR(50),
                        image_url TEXT,
                        created_at TIMESTAMP DEFAULT NOW(),
                        updated_at TIMESTAMP DEFAULT NOW()
);

-- Create videos table
CREATE TABLE videos (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        date VARCHAR(50),
                        youtube_id VARCHAR(50),
                        created_at TIMESTAMP DEFAULT NOW(),
                        updated_at TIMESTAMP DEFAULT NOW()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Set up RLS policies (allow public read, authenticated write)
ALTER TABLE comics ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Public read access" ON comics FOR SELECT USING (true);
CREATE POLICY "Public read access" ON videos FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can insert" ON comics FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON comics FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete" ON comics FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON videos FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete" ON videos FOR DELETE USING (true);

-- Storage policies
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Anyone can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Anyone can update" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Anyone can delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');="mb-4">