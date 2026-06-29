import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRPC() {
  const { data: companyRes } = await supabase.from('companies').select('id, name, cv_balance').limit(1);
  if (!companyRes || companyRes.length === 0) {
     console.log("No companies found");
     return;
  }
  const companyId = companyRes[0].id;
  console.log("Testing with company:", companyRes[0]);
  
  const { data, error } = await supabase.rpc("deduct_cv_credit", { p_company_id: companyId });
  console.log("RPC Result:", data, error);
}

checkRPC();
