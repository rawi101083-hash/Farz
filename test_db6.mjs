import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY29vZWN0ZHdva212Ymd0dHNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcxODI2OSwiZXhwIjoyMDkyMjk0MjY5fQ.Z_MzKzusjzEFLMW4K3E6z3WZSz6mR-qUn_xamEbwk2k');

async function run() {
  const { data: users } = await supabase.auth.admin.listUsers();
  console.log("Users:", users.users.length);

  const { data: profs } = await supabase.from('profiles').select('id, name, entity_type').limit(5);
  console.log("Profs:", profs);

  const { data: jobs } = await supabase.from('jobs').select('id, company_id, user_id').order('created_at', { ascending: false }).limit(5);
  console.log("Jobs:", jobs);
}
run();
