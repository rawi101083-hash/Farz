const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkApplicantNames() {
  const { data: applicants, error } = await supabase.from('applicants').select('full_name').eq('job_id', 'a1ffa109-6d74-4732-a56a-879c4747413f');
  if (error) { console.error(error); return; }
  
  console.log("Applicants for job a1ffa109-6d74-4732-a56a-879c4747413f:");
  applicants.forEach(a => console.log(a.full_name));
}
checkApplicantNames();
