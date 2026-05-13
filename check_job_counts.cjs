const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkApplicantsJobs() {
  const { data: applicants, error: appError } = await supabase.from('applicants').select('id, full_name, job_id');
  if (appError) { console.error(appError); return; }
  
  const { data: jobs, error: jobError } = await supabase.from('jobs').select('id, title');
  if (jobError) { console.error(jobError); return; }
  
  console.log(`Total applicants: ${applicants.length}`);
  
  const jobMap = {};
  jobs.forEach(j => jobMap[j.id] = j.title);
  
  const counts = {};
  applicants.forEach(a => {
    const title = jobMap[a.job_id] || 'Unknown';
    counts[title] = (counts[title] || 0) + 1;
  });
  
  console.log("Applicant counts by Job Title:", counts);
}
checkApplicantsJobs();
