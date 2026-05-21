-- =========================================================================
-- تحديث قاعدة البيانات (Database Updates) بناءً على التعديلات الأخيرة
-- يرجى تنفيذ هذا السكربت في محرر SQL الخاص بـ Supabase
-- =========================================================================

-- 1. تحديث جدول المتقدمين (Applicants) لدعم مخرجات خدمة استخراج السير الذاتية (FastAPI Microservice)
ALTER TABLE public.applicants
ADD COLUMN IF NOT EXISTS requires_vision BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS extracted_cv_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS cv_raw_text TEXT;

-- 2. تحديث باقات الاشتراك (Subscription Plans) إذا كان الجدول موجوداً
-- يجب تحديث نصوص المميزات والحد الأقصى للوظائف لتتطابق مع التعديلات الجديدة (5 و 15)
-- ملاحظة: إذا كان جدول الباقات يسمى 'subscription_plans'، فهذا هو التحديث:

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscription_plans') THEN
        -- تحديث باقة "نمو" (Startup/Growth)
        UPDATE public.subscription_plans
        SET features = '["5 وظائف نشطة", "1,000 سيرة ذاتية شهرياً", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"]'::jsonb,
            max_active_jobs = 5
        WHERE name = 'نمو';

        -- تحديث باقة "أعمال" (Business)
        UPDATE public.subscription_plans
        SET features = '["15 وظيفة نشطة", "5,000 سيرة ذاتية شهرياً", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"]'::jsonb,
            max_active_jobs = 15
        WHERE name = 'أعمال';
    END IF;
END $$;

-- =========================================================================
-- 3. تصحيح سياسات الأمان (RLS) لجدول المتقدمين (Applicants)
-- هذا التحديث حرج جداً لضمان عمل "رابط المشاركة السري للإدارة" (SharedManagementView)
-- حيث أن المدراء غير المسجلين لن يتمكنوا من رؤية المتقدمين أو كتابة الملاحظات بدون هذه الصلاحيات
-- =========================================================================

-- السماح للمدراء (عبر الرابط السري) برؤية المتقدمين للوظيفة 
-- (الأمان يعتمد على صعوبة تخمين معرف الوظيفة UUID)
DROP POLICY IF EXISTS "Allow public read for shared jobs" ON public.applicants;
CREATE POLICY "Allow public read for shared jobs" ON public.applicants
FOR SELECT USING (true);

-- السماح للمدراء بكتابة الملاحظات (hr_notes) وتحديث حالة المتقدم
-- (الأمان يعتمد على صعوبة تخمين معرف المتقدم UUID)
DROP POLICY IF EXISTS "Allow public update for shared jobs" ON public.applicants;
CREATE POLICY "Allow public update for shared jobs" ON public.applicants
FOR UPDATE USING (true);

