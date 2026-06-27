-- ================================================================
-- Webhook Setup for Invoicing
-- Run this in Supabase SQL Editor
-- ================================================================

-- 1. التأكد من تفعيل إضافة pg_net المسؤولة عن إرسال الطلبات للسيرفر
create extension if not exists pg_net with schema extensions;

-- 2. إنشاء الدالة التي تقوم باستدعاء Edge Function
create or replace function public.trigger_send_invoice()
returns trigger as $$
declare
  -- الرجاء استبدال هذا الرابط برابط الـ Edge Function الخاص بك في Supabase
  edge_function_url text := 'https://zpcooectdwokmvbgttsf.supabase.co/functions/v1/send-invoice';
  
  -- الحصول على مفتاح الخدمة من الإعدادات (أو يمكنك وضع المفتاح مباشرة هنا كـ text)
  -- تحذير: من الأفضل عدم تخزين المفتاح كنص صريح في الكود إذا أمكن، لكن للتبسيط:
  service_role_key text := current_setting('app.settings.service_role_key', true);
begin
  -- إذا كان المفتاح غير محفوظ في إعدادات القاعدة، ضع مفتاحك هنا مباشرة بين علامتي التنصيص
  if service_role_key is null then
    service_role_key := 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; 
  end if;

  -- يتم التشغيل فقط إذا كانت حالة العملية "مكتملة"
  if (TG_OP = 'INSERT' and NEW.status = 'completed') or (TG_OP = 'UPDATE' and NEW.status = 'completed' and OLD.status != 'completed') then
    
    perform net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW)
      )
    );

  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- 3. إنشاء الـ Trigger على جدول wallet_transactions
drop trigger if exists send_invoice_on_payment_complete on public.wallet_transactions;

create trigger send_invoice_on_payment_complete
  after insert or update on public.wallet_transactions
  for each row
  execute function public.trigger_send_invoice();
