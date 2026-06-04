-- تحديث قاعدة البيانات لجدول الوظائف (jobs) لإضافة عمود ai_override_fields
-- هذا العمود سيحفظ حزمة JSON بداخلها مسارات الذكاء الاصطناعي المخصصة

ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS ai_override_fields JSONB DEFAULT '{}'::jsonb;
