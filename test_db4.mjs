import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY29vZWN0ZHdva212Ymd0dHNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcxODI2OSwiZXhwIjoyMDkyMjk0MjY5fQ.Z_MzKzusjzEFLMW4K3E6z3WZSz6mR-qUn_xamEbwk2k');

async function run() {
  const jobId = '3699140a-d796-4668-b92a-0a7c27cac157';
  const { data: jobRes } = await supabase.from('jobs').select('company_id').eq('id', jobId).single();
  const companyId = jobRes.company_id;
  
  console.log("Job:", jobId, "Company:", companyId);

  const { data: comp } = await supabase.from('companies').select('id, cv_balance').eq('id', companyId).single();
  console.log("Company before:", comp);

  const rpcRes = await supabase.rpc("deduct_cv_credit", { p_company_id: companyId });
  console.log("RPC Result:", rpcRes);

  const { data: compAfter } = await supabase.from('companies').select('id, cv_balance').eq('id', companyId).single();
  console.log("Company after:", compAfter);
}
run();
