-- 1. Create a sequence for the job numbers starting from 10001
CREATE SEQUENCE IF NOT EXISTS jobs_job_number_seq START WITH 10001;

-- 2. Add the job_number column to the jobs table, setting its default to use the sequence
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_number INTEGER UNIQUE DEFAULT nextval('jobs_job_number_seq');
