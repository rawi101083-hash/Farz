import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://zpcooectdwokmvbgttsf.supabase.co', 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH');
async function run() {
  const { data, error } = await supabase.rpc('run_sql', {
    sql_query: "SELECT tgname, proname, prosrc FROM pg_trigger JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid WHERE tgrelid = 'companies'::regclass;"
  });
  console.log("Error:", error);
  console.log("Data:", data);
}
run();
