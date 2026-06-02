ALTER TABLE applicants ADD COLUMN IF NOT EXISTS has_started_interview BOOLEAN DEFAULT false;
