const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkApplicantJobIds() {
  const { data: applicants, error } = await supabase.from('applicants').select('job_id');
  if (error) { console.error(error); return; }
  
  const counts = {};
  applicants.forEach(a => {
    counts[a.job_id] = (counts[a.job_id] || 0) + 1;
  });
  
  console.log("Applicant counts by job_id:", counts);
}
checkApplicantJobIds();
