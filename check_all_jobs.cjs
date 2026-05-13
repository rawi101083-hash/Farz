const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllJobs() {
  const { data: jobs, error } = await supabase.from('jobs').select('id, title, company_id');
  if (error) console.error(error);
  else {
    console.log("All jobs currently in DB:");
    jobs.forEach(j => console.log(`${j.id} | ${j.title} | ${j.company_id}`));
  }
}
checkAllJobs();
