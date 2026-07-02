-- هذا السكريبت يقوم بإنشاء دالة بصلاحيات مدير (SECURITY DEFINER)
-- لسحب جميع المستخدمين من جدول auth.users (سواء أكملوا بياناتهم أم لا)
-- مع ربطهم بجدول الشركات لمعرفة الوظائف والسير الذاتية.

CREATE OR REPLACE FUNCTION public.get_admin_companies_stats()
RETURNS TABLE (
  id UUID,
  company_name TEXT,
  email TEXT,
  entity_type TEXT,
  subscription_plan TEXT,
  cvs_processed_count INT,
  active_jobs BIGINT,
  has_profile BOOLEAN
) 
SECURITY DEFINER
AS $$
BEGIN
  -- حماية أمنية قوية مخصصة لشركتك فقط:
  -- هذا الكود يمنع أي شخص من سحب البيانات ما لم يكن حسابه مسجلاً باسم "فرز للموارد البشرية"
  IF NOT EXISTS (
    SELECT 1 FROM public.companies comp
    WHERE comp.id = auth.uid() AND comp.company_name = 'فرز للموارد البشرية'
  ) THEN
    RAISE EXCEPTION 'غير مصرح لك باستعراض هذه البيانات. محاولة اختراق مسجلة.';
  END IF;
  RETURN QUERY
  SELECT 
    au.id,
    COALESCE(c.company_name, (au.raw_user_meta_data->>'name')::text, 'بدون اسم') as company_name,
    au.email::text as email,
    COALESCE((au.raw_user_meta_data->>'entity_type')::text, 'غير محدد') as entity_type,
    'free' as subscription_plan,
    COALESCE(c.used_cvs, 0)::int as cvs_processed_count,
    (SELECT COUNT(*) FROM public.jobs j WHERE j.company_id = au.id AND j.status = 'نشط') as active_jobs,
    CASE WHEN c.id IS NOT NULL THEN TRUE ELSE FALSE END as has_profile
  FROM auth.users au
  LEFT JOIN public.companies c ON c.id = au.id
  ORDER BY au.created_at DESC;
END;
$$ LANGUAGE plpgsql;
