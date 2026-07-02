CREATE TABLE public.question_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.question_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can manage their own templates"
ON public.question_templates
FOR ALL
USING (company_id = auth.uid())
WITH CHECK (company_id = auth.uid());
