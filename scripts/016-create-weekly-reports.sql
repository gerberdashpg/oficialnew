-- Create weekly reports table
CREATE TABLE IF NOT EXISTS weekly_reports (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'estavel',
  summary TEXT,
  actions_taken TEXT,
  data_analysis TEXT,
  decisions_made TEXT,
  next_week_guidance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, report_date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_weekly_reports_client_id ON weekly_reports(client_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_date ON weekly_reports(report_date DESC);
