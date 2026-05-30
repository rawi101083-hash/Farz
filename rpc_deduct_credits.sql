-- دالة الخصم الآمن للسير الذاتية (استهلاك الرصيد)
CREATE OR REPLACE FUNCTION deduct_cv_credit(p_company_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company record;
BEGIN
    -- 1. قفل الصف الخاص بالشركة لمنع أي تضارب (Atomic Transaction / Race Condition Protection)
    SELECT * INTO v_company
    FROM companies
    WHERE id = p_company_id
    FOR UPDATE;

    -- إذا لم يتم العثور على الشركة
    IF NOT FOUND THEN
        RETURN false;
    END IF;

    -- 2. التحقق من الرصيد الشهري الأساسي أولاً (استهلاك السير الذاتية)
    IF v_company.used_cvs < v_company.cv_limit THEN
        UPDATE companies
        SET used_cvs = used_cvs + 1
        WHERE id = p_company_id;
        RETURN true;
    
    -- 3. إذا نفد الرصيد الشهري، الانتقال تلقائياً للخصم من الرصيد الإضافي المتراكم
    ELSIF v_company.extra_cv_credits > 0 THEN
        UPDATE companies
        SET extra_cv_credits = extra_cv_credits - 1
        WHERE id = p_company_id;
        RETURN true;
    
    -- 4. لا يوجد رصيد نهائياً (شهري أو إضافي)
    ELSE
        RETURN false;
    END IF;
END;
$$;

-- دالة الخصم الآمن للمقابلات الصوتية (استهلاك الرصيد)
CREATE OR REPLACE FUNCTION deduct_interview_credit(p_company_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company record;
BEGIN
    -- 1. قفل الصف لمنع الخصم المزدوج للمقابلات في نفس اللحظة
    SELECT * INTO v_company
    FROM companies
    WHERE id = p_company_id
    FOR UPDATE;

    -- إذا لم يتم العثور على الشركة
    IF NOT FOUND THEN
        RETURN false;
    END IF;

    -- 2. التحقق من رصيد المقابلات الشهري أولاً
    IF v_company.used_interviews < v_company.interviews_limit THEN
        UPDATE companies
        SET used_interviews = used_interviews + 1
        WHERE id = p_company_id;
        RETURN true;
        
    -- 3. الانتقال تلقائياً للرصيد الإضافي إذا انتهى الشهري
    ELSIF v_company.extra_interview_credits > 0 THEN
        UPDATE companies
        SET extra_interview_credits = extra_interview_credits - 1
        WHERE id = p_company_id;
        RETURN true;
        
    -- 4. لا يوجد رصيد مقابلات متاح
    ELSE
        RETURN false;
    END IF;
END;
$$;
