import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: applicant } = await supabase
    .from('applicants')
    .select('id, full_name')
    .like('full_name', '%زكي%')
    .limit(1)
    .single();

  if (!applicant) return console.log('no applicant');

  const { data, error } = await supabase
    .from('applicants')
    .update({ does_this_column_exist_no: true })
    .eq('id', applicant.id);

  console.log('Error:', error);
}
run();
