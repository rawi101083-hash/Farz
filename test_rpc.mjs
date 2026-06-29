import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY29vZWN0ZHdva212Ymd0dHNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcxODI2OSwiZXhwIjoyMDkyMjk0MjY5fQ.Z_MzKzusjzEFLMW4K3E6z3WZSz6mR-qUn_xamEbwk2k');

async function run() {
  const { data, error } = await supabase.rpc('deduct_cv_credit', { p_company_id: '17456fdb-c558-4530-9fb3-9074d0c00a23' });
  console.log('Error:', error);
  console.log('Data:', data);
}
run();
