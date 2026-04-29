-- Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    entity_type TEXT DEFAULT 'company',
    commercial_registration TEXT,
    tax_number TEXT,
    freelance_document TEXT,
    city TEXT,
    company_logo TEXT,
    subscription_plan TEXT DEFAULT 'free', -- 'free', 'one-time', 'growth', 'business', 'enterprise'
    subscription_status TEXT DEFAULT 'active', -- 'active', 'expired'
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    cvs_processed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We previously dropped the foreign key jobs_company_id_fkey. 
-- We can optionally add it back later if all companies exist, but for now we leave it out or add it with ON DELETE CASCADE.

-- Create an RLS policy if needed
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all companies (for public job pages)"
    ON public.companies FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own company profile"
    ON public.companies FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own company profile"
    ON public.companies FOR INSERT
    WITH CHECK (auth.uid() = id);


-- Create function to increment CV count
CREATE OR REPLACE FUNCTION public.increment_cv_count(comp_id UUID)
RETURNS void AS 
BEGIN
  UPDATE public.companies
  SET cvs_processed_count = COALESCE(cvs_processed_count, 0) + 1
  WHERE id = comp_id;
END;
 LANGUAGE plpgsql SECURITY DEFINER;
