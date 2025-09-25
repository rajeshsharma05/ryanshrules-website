-- Add likes column to comics and videos tables
ALTER TABLE comics ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- Update existing records to have 0 likes
UPDATE comics SET likes = 0 WHERE likes IS NULL;
UPDATE videos SET likes = 0 WHERE likes IS NULL;