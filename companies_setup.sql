-- ================================================================
-- ZATCA Compliance & Security Setup
-- Run this in Supabase SQL Editor
-- ================================================================

-- 1. Add fields_locked column
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS fields_locked BOOLEAN DEFAULT FALSE;

-- ================================================================
-- 2. Database Trigger: Block UPDATE on locked fields (Enhanced)
-- ================================================================
CREATE OR REPLACE FUNCTION public.prevent_locked_fields_update()
RETURNS TRIGGER AS $$
BEGIN
  -- تطبيق القفل التلقائي إذا تم تعبئة السجل التجاري ولم يتم قفله بعد (يعتمد على السجل التجاري فقط)
  IF OLD.fields_locked = FALSE AND NEW.commercial_registration IS NOT NULL THEN
     NEW.fields_locked = TRUE;
  END IF;

  -- التحقق من القفل، وتطبيقه فقط على المستخدمين العاديين (يسمح للدعم الفني/admin بالتعديل)
  IF OLD.fields_locked = TRUE AND auth.role() = 'authenticated' THEN
    IF NEW.commercial_registration IS DISTINCT FROM OLD.commercial_registration THEN
      RAISE EXCEPTION 'ZATCA_LOCKED: رقم السجل التجاري مقفل ولا يمكن تعديله بعد التأسيس.';
    END IF;
    
    IF NEW.tax_number IS DISTINCT FROM OLD.tax_number THEN
      RAISE EXCEPTION 'ZATCA_LOCKED: الرقم الضريبي مقفل ولا يمكن تعديله بعد التأسيس.';
    END IF;
    
    IF NEW.fields_locked = FALSE THEN
      RAISE EXCEPTION 'ZATCA_LOCKED: لا يمكن فك القفل من واجهة المستخدم.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if exists, then recreate
DROP TRIGGER IF EXISTS zatca_lock_trigger ON public.companies;

CREATE TRIGGER zatca_lock_trigger
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_locked_fields_update();

-- ================================================================
-- 3. تصحيح الثغرة الأمنية في عداد السير الذاتية (حماية الفوترة)
-- ================================================================
CREATE OR REPLACE FUNCTION public.increment_cv_count(comp_id UUID)
RETURNS void AS $$
BEGIN
  -- يتم الزيادة فقط إذا كان المستخدم الذي يستدعي الدالة هو صاحب الشركة نفسه
  -- في نظامنا: companies.id هو نفسه auth.uid()
  UPDATE public.companies
  SET cvs_processed_count = COALESCE(cvs_processed_count, 0) + 1
  WHERE id = comp_id AND id = auth.uid();

  -- التحقق مما إذا تم التحديث فعلاً (لمنع التلاعب الصامت)
  IF NOT FOUND THEN
      RAISE EXCEPTION 'Unauthorized: لا تملك صلاحية لزيادة العداد لهذه الشركة أو أن الشركة غير موجودة.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
