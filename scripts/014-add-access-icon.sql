-- Add icon_url column to accesses table
ALTER TABLE accesses ADD COLUMN IF NOT EXISTS icon_url TEXT;
