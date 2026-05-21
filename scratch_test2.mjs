import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: applicant } = await supabase
    .from('applicants')
    .select('id, job_id')
    .like('full_name', '%زكي%')
    .limit(1)
    .single();

  if (!applicant) return console.log('not found');

  // Update applicant's expected salary
  await supabase
    .from('applicants')
    .update({ expected_salary: "12,000 ريال سعودي" })
    .eq('id', applicant.id);

  // Update job to enable asking for expected salary
  await supabase
    .from('jobs')
    .update({ askExpectedSalary: "open" })
    .eq('id', applicant.job_id);

  console.log("Updated expected salary and job settings successfully!");
}

run();
