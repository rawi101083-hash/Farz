import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY29vZWN0ZHdva212Ymd0dHNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcxODI2OSwiZXhwIjoyMDkyMjk0MjY5fQ.Z_MzKzusjzEFLMW4K3E6z3WZSz6mR-qUn_xamEbwk2k');

async function run() {
  const { data: jobs, error: err1 } = await supabase.from('jobs').select('id, title, company_id, company_id_manual, created_at').order('created_at', { ascending: false }).limit(5);
  console.log("Recent Jobs:", jobs, err1);

  const { data: apps, error: err2 } = await supabase.from('applicants').select('id, name, decision, ai_justification, job_id, created_at').order('created_at', { ascending: false }).limit(5);
  console.log("Recent Apps:", apps, err2);
}
run();
