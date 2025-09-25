# Database Update Required for Likes Feature

## Instructions for Adding Likes Column

You need to run the following SQL commands in your Supabase dashboard:

1. Go to https://supabase.com
2. Open your project
3. Go to **SQL Editor**
4. Run this query:

```sql
-- Add likes column to comics and videos tables
ALTER TABLE comics ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- Update existing records to have 0 likes
UPDATE comics SET likes = 0 WHERE likes IS NULL;
UPDATE videos SET likes = 0 WHERE likes IS NULL;
```

This will add the likes functionality to your existing database without affecting any existing data.

## Alternative: Run Migration File

Or you can copy the contents of `add_likes_migration.sql` and paste it into the SQL Editor.

After running this, the likes feature will be fully functional!