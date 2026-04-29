CREATE TABLE IF NOT EXISTS public.job_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id TEXT NOT NULL,
    offer_message TEXT,
    proposed_salary NUMERIC,
    start_date DATE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

-- Allow all for now (adjust as needed for security)
CREATE POLICY "Enable all for authenticated users" ON public.job_offers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
    
CREATE POLICY "Enable read for anon" ON public.job_offers
    FOR SELECT
    TO anon
    USING (true);
