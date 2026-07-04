-- هذا السكريبت ينشئ دالة آمنة ومحصنة (RPC) لتعديل حالة الشركات وتمديد الفترة التجريبية
-- ولا يمكن تشغيلها إلا إذا كان الحساب الذي طلب التعديل هو "فرز للموارد البشرية"

CREATE OR REPLACE FUNCTION public.admin_update_company_status(
  p_company_id UUID,
  p_status TEXT DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS VOID
SECURITY DEFINER
AS $$
BEGIN
  -- حماية أمنية قوية مخصصة لشركتك فقط:
  -- هذا الكود يمنع أي شخص من التعديل ما لم يكن حسابه مسجلاً باسم "فرز للموارد البشرية"
  IF NOT EXISTS (
    SELECT 1 FROM public.companies comp
    WHERE comp.id = auth.uid() AND comp.company_name = 'فرز للموارد البشرية'
  ) THEN
    RAISE EXCEPTION 'غير مصرح لك بتعديل هذه البيانات. محاولة اختراق مسجلة.';
  END IF;

  -- إذا تم إرسال حالة جديدة وتاريخ جديد (مثل تفعيل الحساب وإضافة 14 يوم)
  IF p_status IS NOT NULL AND p_end_date IS NOT NULL THEN
    UPDATE public.companies
    SET status = p_status, subscription_end_date = p_end_date
    WHERE id = p_company_id;
    
  -- إذا تم إرسال حالة فقط (مثل الإيقاف pending)
  ELSIF p_status IS NOT NULL THEN
    UPDATE public.companies
    SET status = p_status
    WHERE id = p_company_id;
    
  -- إذا تم إرسال تاريخ فقط (مثل زيادة أيام الفترة التجريبية)
  ELSIF p_end_date IS NOT NULL THEN
    UPDATE public.companies
    SET subscription_end_date = p_end_date
    WHERE id = p_company_id;
  END IF;

END;
$$ LANGUAGE plpgsql;
