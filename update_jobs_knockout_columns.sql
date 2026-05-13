-- تحديث قاعدة البيانات لجدول الوظائف (jobs) لإضافة أعمدة الفلترة التلقائية وخيارات نوع العمل المتعددة
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS types JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS auto_reject_city BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_reject_qualification BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_reject_experience BOOLEAN DEFAULT false;
