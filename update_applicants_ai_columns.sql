-- تحديث قاعدة البيانات لدعم مخرجات الذكاء الاصطناعي وإجابات الأسئلة المخصصة
ALTER TABLE public.applicants
ADD COLUMN IF NOT EXISTS match_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_justification TEXT,
ADD COLUMN IF NOT EXISTS top_strengths JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS top_weaknesses JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS custom_answers JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;
