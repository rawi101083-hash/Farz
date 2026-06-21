import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH');
async function run() {
  const { data, error } = await supabase.from('companies').select('*');
  console.log(JSON.stringify(data, null, 2));
}
run();
