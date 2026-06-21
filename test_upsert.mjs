import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH');
async function run() {
  const payload = {
    id: 'e4588e14-6590-449e-b2ee-1c390500d0c3',
    company_name: 'فرز للموارد البشرية',
    entity_type: 'company',
    city: 'جدة',
    subscription_plan: 'startup_monthly',
    company_logo: null,
    commercial_registration: '7052842361',
    freelance_document: null,
    fields_locked: true,
    tax_number: '123123123123123'
  };

  const { data, error } = await supabase.from('companies').upsert(payload, { onConflict: 'id' });
  if (error) {
    console.error("UPSERT ERROR:", JSON.stringify(error, null, 2));
  } else {
    console.log("SUCCESS");
  }
}
run();
