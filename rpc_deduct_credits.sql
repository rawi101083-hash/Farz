-- دالة الخصم الآمن للسير الذاتية (استهلاك الرصيد)
CREATE OR REPLACE FUNCTION deduct_cv_credit(p_company_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company record;
    v_actual_limit integer;
BEGIN
    SELECT * INTO v_company
    FROM companies
    WHERE id = p_company_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN false;
    END IF;

    v_actual_limit := COALESCE(v_company.cv_limit, 0);
    
    IF v_actual_limit = 0 THEN
        IF v_company.subscription_plan = 'free' THEN v_actual_limit := 100;
        ELSIF v_company.subscription_plan = 'startup' THEN v_actual_limit := 1000;
        ELSIF v_company.subscription_plan = 'growth' THEN v_actual_limit := 2500;
        ELSIF v_company.subscription_plan = 'business' THEN v_actual_limit := 5000;
        ELSIF v_company.subscription_plan = 'enterprise' THEN v_actual_limit := 15000;
        END IF;
    END IF;

    IF v_company.used_cvs < v_actual_limit THEN
        UPDATE companies
        SET used_cvs = used_cvs + 1, cv_limit = v_actual_limit
        WHERE id = p_company_id;
        RETURN true;
    
    ELSIF COALESCE(v_company.extra_cv_credits, 0) > 0 THEN
        UPDATE companies
        SET extra_cv_credits = extra_cv_credits - 1
        WHERE id = p_company_id;
        RETURN true;
    
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
    v_actual_limit integer;
BEGIN
    SELECT * INTO v_company
    FROM companies
    WHERE id = p_company_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN false;
    END IF;

    v_actual_limit := COALESCE(v_company.interviews_limit, 0);
    
    IF v_actual_limit = 0 THEN
        IF v_company.subscription_plan = 'startup' OR v_company.subscription_plan = 'growth' THEN v_actual_limit := 100;
        ELSIF v_company.subscription_plan = 'business' THEN v_actual_limit := 500;
        ELSIF v_company.subscription_plan = 'enterprise' THEN v_actual_limit := 1500;
        END IF;
    END IF;

    IF v_company.used_interviews < v_actual_limit THEN
        UPDATE companies
        SET used_interviews = used_interviews + 1, interviews_limit = v_actual_limit
        WHERE id = p_company_id;
        RETURN true;
        
    ELSIF COALESCE(v_company.extra_interview_credits, 0) > 0 THEN
        UPDATE companies
        SET extra_interview_credits = extra_interview_credits - 1
        WHERE id = p_company_id;
        RETURN true;
        
    ELSE
        RETURN false;
    END IF;
END;
$$;
