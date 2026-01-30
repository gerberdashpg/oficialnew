-- Add priority column to notices table
ALTER TABLE notices ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal';

-- Add updated_at column to notices table
ALTER TABLE notices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add is_read column to notices table
ALTER TABLE notices ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;
