-- ==========================================
-- المرحلة الأولى: تأسيس جداول الـ SaaS والعزل
-- ==========================================

-- 1. إنشاء جدول الشركات (SaaS)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- يمثل معرف الشركة (ويُفضل أن يكون هو نفسه auth.uid())
    company_name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT
);

-- تفعيل سياسات الأمان (RLS) لجدول الشركات
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies can view own data" ON public.companies FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Companies can update own data" ON public.companies FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- 2. إنشاء جدول الوظائف (مع ربطه بالشركات)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
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

-- تفعيل سياسات الأمان (RLS) لجدول الوظائف
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
-- الشركة تدير الوظائف الخاصة بها فقط
CREATE POLICY "Companies can manage their own jobs" ON public.jobs 
FOR ALL USING (company_id = auth.uid());

-- السماح للعامة (المتقدمين) برؤية الوظائف النشطة فقط للتقديم عليها
CREATE POLICY "Public can view active jobs" ON public.jobs 
FOR SELECT USING (status = 'active');


-- ==========================================
-- 3. تحديث جدول المتقدمين (إضافة 4 أعمدة فقط)
-- ==========================================
ALTER TABLE public.applicants
ADD COLUMN IF NOT EXISTS decision TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS hr_notes TEXT;

-- تفعيل سياسات الأمان (RLS) لجدول المتقدمين (العزل التام)
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;

-- الشركة ترى وتقوم بتعديل المتقدمين الذين تقدموا على وظائف تابعة لها فقط
CREATE POLICY "Companies can manage applicants for their jobs" ON public.applicants 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.jobs 
        WHERE public.jobs.id::text = public.applicants.job_id 
        AND public.jobs.company_id = auth.uid()
    )
);

-- السماح لأي متقدم بإرسال (إدخال) طلبه للوظيفة
CREATE POLICY "Anyone can insert an application" ON public.applicants 
FOR INSERT WITH CHECK (true);
