-- 1. تحديث جدول الشركات (Companies) لدعم باقات الـ SaaS والأرصدة
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free', -- 'immediate', 'growth', 'business', 'corporate'
ADD COLUMN IF NOT EXISTS cv_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS jobs_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS interviews_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS used_cvs INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS used_jobs INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS used_interviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS extra_cv_credits INTEGER DEFAULT 0, -- رصيد السير الإضافية (لا تنتهي)
ADD COLUMN IF NOT EXISTS extra_interview_credits INTEGER DEFAULT 0, -- رصيد المقابلات الإضافية (لا تنتهي)
ADD COLUMN IF NOT EXISTS addons_bought_this_month INTEGER DEFAULT 0, -- لغرض الترقية الناعمة

-- 2. أعمدة خاصة بعمليات الدفع وحفظ البطاقة (Tokenization)
ADD COLUMN IF NOT EXISTS payment_card_token TEXT, -- رمز البطاقة المحفوظة لعمليات الـ One-Click
ADD COLUMN IF NOT EXISTS is_auto_renew BOOLEAN DEFAULT false; -- هل العميل موافق على التجديد التلقائي؟
