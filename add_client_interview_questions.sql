ALTER TABLE applicants ADD COLUMN IF NOT EXISTS client_interview_questions JSONB DEFAULT '[]'::jsonb;
