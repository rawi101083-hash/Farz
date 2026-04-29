-- تعطيل سياسات الأمان (RLS) مؤقتاً لأغراض الاختبار
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicants DISABLE ROW LEVEL SECURITY;

-- تنويه: يجب إعادة تفعيلها باستخدام ENABLE ROW LEVEL SECURITY بعد الانتهاء من برمجة تسجيل الدخول.

-- إدراج شركة وهمية لتجنب خطأ Foreign Key عند إضافة الوظائف
INSERT INTO public.companies (id, company_name, contact_email)
VALUES ('00000000-0000-0000-0000-000000000000', 'Test Company', 'test@example.com')
ON CONFLICT (id) DO NOTHING;
