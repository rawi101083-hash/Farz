-- Run this in the Supabase SQL Editor to add the required column for the Background Sweeper

ALTER TABLE public.applicants ADD COLUMN IF NOT EXISTS job_context JSONB;

-- Optional: If you want to see if it was added successfully, you can run:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'applicants';
