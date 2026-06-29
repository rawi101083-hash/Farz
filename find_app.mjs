import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('applicants')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching applicants:', error);
  } else {
    if (data && data.length > 0) {
      console.log('Columns in applicants table:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('No applicants found to infer schema.');
    }
  }
}

checkSchema();
