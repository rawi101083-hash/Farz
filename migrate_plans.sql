-- 1. Add columns to plans table if they don't exist
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS cv_limit integer DEFAULT 50;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS interviews_limit integer DEFAULT 1;

-- 2. Update existing packages with explicit limits
-- Business Package
UPDATE public.plans 
SET jobs_limit = 15, cv_limit = 5000, interviews_limit = 15, duration_type = 'months', duration_value = 1
WHERE id = 'business_monthly';

UPDATE public.plans 
SET jobs_limit = 15, cv_limit = 60000, interviews_limit =180, duration_type = 'years', duration_value = 1
WHERE id = 'business_yearly';

-- Growth Package (ID in DB is startup_monthly)
UPDATE public.plans 
SET jobs_limit = 5, cv_limit = 1000, interviews_limit = 5, duration_type = 'months', duration_value = 1
WHERE id = 'startup_monthly';

UPDATE public.plans 
SET jobs_limit = 5, cv_limit = 12000, interviews_limit = 60, duration_type = 'years', duration_value = 1
WHERE id = 'startup_yearly';

-- Enterprise Package
UPDATE public.plans 
SET jobs_limit = NULL, cv_limit = NULL, interviews_limit = NULL
WHERE id = 'enterprise_monthly';

UPDATE public.plans 
SET jobs_limit = NULL, cv_limit = NULL, interviews_limit = NULL
WHERE id = 'enterprise_yearly';

-- One-Time Package
UPDATE public.plans 
SET jobs_limit = 1, cv_limit = 500, interviews_limit = 1, duration_type = 'days', duration_value = 45
WHERE id = 'single_job';
