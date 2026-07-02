-- إنشاء جدول لإحصائيات الموقع
CREATE TABLE IF NOT EXISTS public.site_statistics (
    id INT PRIMARY KEY DEFAULT 1,
    total_visits BIGINT DEFAULT 0
);

-- إدراج الصف الأول إذا لم يكن موجوداً
INSERT INTO public.site_statistics (id, total_visits)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- السماح للجميع بقراءة الإحصائيات (لأنها إحصائيات عامة للموقع)
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read of site_statistics" ON public.site_statistics FOR SELECT USING (true);

-- دالة لزيادة عدد الزيارات (يمكن لأي زائر استدعاؤها عبر التطبيق)
CREATE OR REPLACE FUNCTION public.increment_site_visit()
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.site_statistics
    SET total_visits = total_visits + 1
    WHERE id = 1;
END;
$$ LANGUAGE plpgsql;

-- دالة للحصول على عدد الزيارات للإدارة
CREATE OR REPLACE FUNCTION public.get_site_visits()
RETURNS BIGINT
SECURITY DEFINER
AS $$
DECLARE
    visits BIGINT;
BEGIN
    SELECT total_visits INTO visits FROM public.site_statistics WHERE id = 1;
    RETURN COALESCE(visits, 0);
END;
$$ LANGUAGE plpgsql;
