import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('applicants')
    .select('*')
    .order('created_at', { ascending: false }).limit(3);

  if (error) {
    console.error('Error fetching applicants:', error);
  } else {
    if (data && data.length > 0) {
      console.log('Columns in applicants table:');
      console.log(data.map(a => ${a.full_name} |  | ).join('\\n'));
    } else {
      console.log('No applicants found to infer schema.');
    }
  }
}

checkSchema();
