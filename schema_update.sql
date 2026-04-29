-- 1. إنشاء جدول الوظائف بالحد الأدنى الحرج
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department TEXT,
    location TEXT,
    type TEXT,
    experience_level TEXT,
    qualification TEXT,
    description TEXT,
    responsibilities TEXT,
    qualifications_details TEXT,
    target_majors JSONB DEFAULT '[]'::jsonb,
    target_skills JSONB DEFAULT '[]'::jsonb,
    required_languages JSONB DEFAULT '[]'::jsonb,
    salary_min INTEGER,
    salary_max INTEGER,
    hide_salary BOOLEAN DEFAULT false,
    knockout_questions JSONB DEFAULT '[]'::jsonb,
    custom_questions JSONB DEFAULT '[]'::jsonb,
    custom_attachments JSONB DEFAULT '[]'::jsonb,
    ai_instructions TEXT,
    status TEXT DEFAULT 'مسودة',
    created_at TIMESTAMPTZ DEFAULT now(),
    closed_at TIMESTAMPTZ
);

-- 2. إضافة الأعمدة الثلاثة الحرجة فقط لجدول المتقدمين
ALTER TABLE public.applicants
ADD COLUMN IF NOT EXISTS decision TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS source TEXT;
