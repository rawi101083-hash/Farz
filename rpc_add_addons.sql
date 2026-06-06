-- دالة إضافة الإضافات (Add-ons) بأمان
CREATE OR REPLACE FUNCTION add_company_addons(p_company_id UUID, p_addon_type TEXT, p_amount INTEGER)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company record;
BEGIN
    SELECT * INTO v_company
    FROM companies
    WHERE id = p_company_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN false;
    END IF;

    IF p_addon_type = 'cv' THEN
        UPDATE companies
        SET extra_cv_credits = COALESCE(extra_cv_credits, 0) + p_amount,
            addons_bought_this_month = COALESCE(addons_bought_this_month, 0) + 1
        WHERE id = p_company_id;
        RETURN true;
        
    ELSIF p_addon_type = 'interview' THEN
        UPDATE companies
        SET extra_interview_credits = COALESCE(extra_interview_credits, 0) + p_amount,
            addons_bought_this_month = COALESCE(addons_bought_this_month, 0) + 1
        WHERE id = p_company_id;
        RETURN true;
        
    ELSE
        RETURN false;
    END IF;
END;
$$;
