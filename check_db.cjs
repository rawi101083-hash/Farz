const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: jobs } = await supabase.from('jobs').select('id, title').ilike('title', '%مهندس برمجيات%');
  console.log('Jobs:', jobs);
  for (const job of (jobs||[])) {
    const { data: apps } = await supabase.from('applicants').select('id, is_cooldown_bypassed').eq('job_id', job.id);
    const falseCount = apps.filter(a => a.is_cooldown_bypassed === false).length;
    const trueCount = apps.filter(a => a.is_cooldown_bypassed === true).length;
    console.log(`Job: ${job.id}, false: ${falseCount}, true: ${trueCount}`);
  }
}
test();
