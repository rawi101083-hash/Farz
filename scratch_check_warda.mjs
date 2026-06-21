import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkApplicant() {
  const { data, error } = await supabase
    .from('applicants')
    .select('full_name, decision, created_at, job_id, email')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

checkApplicant();
