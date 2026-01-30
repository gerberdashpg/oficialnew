-- Drop and recreate client_step_progress table with correct schema
DROP TABLE IF EXISTS client_step_progress;

CREATE TABLE client_step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  step_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, step_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_step_progress_client_id ON client_step_progress(client_id);
CREATE INDEX IF NOT EXISTS idx_client_step_progress_step_id ON client_step_progress(step_id);
