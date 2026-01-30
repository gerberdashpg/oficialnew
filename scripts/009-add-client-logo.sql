-- Add logo_url column to clients table for profile image
ALTER TABLE clients ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT NULL;

-- Add whatsapp_link if not exists
ALTER TABLE clients ADD COLUMN IF NOT EXISTS whatsapp_link TEXT DEFAULT NULL;
