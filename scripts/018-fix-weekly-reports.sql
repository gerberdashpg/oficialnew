-- Drop existing table if it exists
DROP TABLE IF EXISTS weekly_reports;

-- Create weekly reports table without foreign key constraint initially
CREATE TABLE weekly_reports (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_weekly_reports_client_id ON weekly_reports(client_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_report_date ON weekly_reports(report_date);
