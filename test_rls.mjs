import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY29vZWN0ZHdva212Ymd0dHNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcxODI2OSwiZXhwIjoyMDkyMjk0MjY5fQ.Z_MzKzusjzEFLMW4K3E6z3WZSz6mR-qUn_xamEbwk2k');

async function checkRLS() {
  const { data, error } = await supabase.rpc('get_policies', { table_name: 'companies' });
  console.log("Policies for companies table:");
  if (error) console.error("Could not fetch via RPC. I will try query pg_policies.");
  
  const { data: policies, error: pErr } = await supabase
    .from('pg_policies') // Might not be accessible
    .select('*')
    .eq('tablename', 'companies');
    
  if (policies) console.log(policies);
  else console.error("Error fetching policies:", pErr);
}
checkRLS();
