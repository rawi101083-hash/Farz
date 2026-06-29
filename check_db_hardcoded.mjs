import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching jobs:', error);
  } else {
    if (data && data.length > 0) {
      console.log('Columns in jobs table:');
      console.log(Object.keys(data[0]).join('\n'));
    } else {
      console.log('No jobs found to infer schema.');
    }
  }
}

checkSchema();
