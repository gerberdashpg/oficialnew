-- Drop and recreate weekly_reports table with UUID client_id
DROP TABLE IF EXISTS weekly_reports;

CREATE TABLE weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
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
CREATE INDEX idx_weekly_reports_client_id ON weekly_reports(client_id);
CREATE INDEX idx_weekly_reports_report_date ON weekly_reports(report_date DESC);
