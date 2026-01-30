-- Add whatsapp_link and drive_link columns to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS whatsapp_link TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS drive_link TEXT;

-- Create client_step_progress table to track step completion
CREATE TABLE IF NOT EXISTS client_step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  step_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, step_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_step_progress_client_id ON client_step_progress(client_id);

-- Update existing clients with default values
UPDATE clients SET whatsapp_link = 'https://wa.me/5511999999999' WHERE whatsapp_link IS NULL;
UPDATE clients SET drive_link = 'https://drive.google.com' WHERE drive_link IS NULL;
