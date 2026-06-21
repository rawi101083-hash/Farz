import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zpcooectdwokmvbgttsf.supabase.co";
const supabaseAnonKey = "sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

supabase.from('jobs').select('id, title, job_number').then(res => {
  if (res.error) {
    console.error("Database query error:", res.error);
    process.exit(1);
  }
  console.log("Database Jobs Data:", res.data);
  process.exit(0);
}).catch(err => {
  console.error("Connection error:", err);
  process.exit(1);
});
