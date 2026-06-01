ALTER TABLE jobs ADD COLUMN IF NOT EXISTS visits_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_job_visit(p_job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs 
  SET visits_count = COALESCE(visits_count, 0) + 1 
  WHERE id = p_job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
