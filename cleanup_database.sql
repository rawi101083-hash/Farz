-- سكربت التنظيف الشامل والنهائي لجدول المتقدمين (applicants)
-- بناءً على كود الداتا بيس الخاص بك ومطابقته مع كود المنصة

ALTER TABLE applicants
-- الأعمدة التي تكلمنا عنها سابقاً (بسبب الصندوق المجمع)
DROP COLUMN IF EXISTS availability,
DROP COLUMN IF EXISTS source,
DROP COLUMN IF EXISTS city,
DROP COLUMN IF EXISTS nationality,
DROP COLUMN IF EXISTS education,
DROP COLUMN IF EXISTS experience,

-- الأعمدة الإضافية المهجورة التي لا يستخدمها الكود نهائياً:
DROP COLUMN IF EXISTS top_strengths,
DROP COLUMN IF EXISTS top_weaknesses,
DROP COLUMN IF EXISTS whatsapp, -- النظام يعتمد على عمود phone كبديل
DROP COLUMN IF EXISTS linkedin, -- النظام لا يحفظ رابط لينكد إن في الداتا بيس
DROP COLUMN IF EXISTS skills_match,
DROP COLUMN IF EXISTS experience_match,
DROP COLUMN IF EXISTS education_match,
DROP COLUMN IF EXISTS suggested_questions,
DROP COLUMN IF EXISTS top_percentile,
DROP COLUMN IF EXISTS attachments,
DROP COLUMN IF EXISTS requires_vision,
DROP COLUMN IF EXISTS extracted_cv_images,
DROP COLUMN IF EXISTS cv_raw_text,
DROP COLUMN IF EXISTS is_cooldown_bypassed;

-- تم التنظيف والترتيب بنجاح!
