-- ==============================================================================
-- اضافة 14 يوم فترة تجريبية (محدث ليعمل عند الإنشاء والتعديل)
-- انسخ هذا الكود بالكامل وشغله في Supabase SQL Editor
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.auto_add_14_days_on_activation()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'active' THEN
      NEW.subscription_end_date = now() + interval '14 days';
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'active' AND OLD.status IS DISTINCT FROM 'active' THEN
      NEW.subscription_end_date = now() + interval '14 days';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auto_add_14_days ON public.companies;
DROP TRIGGER IF EXISTS trigger_auto_add_14_days_on_activation ON public.companies;

CREATE TRIGGER trigger_auto_add_14_days
  BEFORE INSERT OR UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.auto_add_14_days_on_activation();
