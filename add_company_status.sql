
-- 1. Add status column to companies table
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 2. Create RPC to insert pending company (bypassing RLS)
CREATE OR REPLACE FUNCTION public.create_pending_company(
    p_id UUID,
    p_name TEXT,
    p_email TEXT,
    p_phone TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$$
BEGIN
    INSERT INTO public.companies (id, company_name, contact_email, contact_phone, status)
    VALUES (p_id, p_name, p_email, p_phone, 'pending')
    ON CONFLICT (id) DO UPDATE
    SET 
        company_name = EXCLUDED.company_name,
        contact_email = EXCLUDED.contact_email,
        contact_phone = EXCLUDED.contact_phone,
        status = 'pending';
END;
$$$;

