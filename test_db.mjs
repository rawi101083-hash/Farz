import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY29vZWN0ZHdva212Ymd0dHNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcxODI2OSwiZXhwIjoyMDkyMjk0MjY5fQ.Z_MzKzusjzEFLMW4K3E6z3WZSz6mR-qUn_xamEbwk2k');

async function run() {
  const { data: jobs } = await supabase.from('jobs').select('id, title, company_id, company, company_id_manual').order('created_at', { ascending: false }).limit(5);
  console.log("Recent Jobs:");
  console.dir(jobs);

  const { data: apps } = await supabase.from('applicants').select('id, name, decision, ai_justification, job_id, created_at').order('created_at', { ascending: false }).limit(5);
  console.log("Recent Apps:");
  console.dir(apps);
}
run();
