import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const content = fs.readFileSync('src/config.ts', 'utf8');
const urlMatch = content.match(/SUPABASE_URL\s*=\s*['"`]?([^'"`\s;]+)/);
const keyMatch = content.match(/SUPABASE_ANON_KEY\s*=\s*['"`]?([^'"`\s;]+)/);

if(urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  async function run() {
    const { data, error } = await supabase.rpc('run_sql', {
      sql_query: "SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'check_locked_fields';"
    });
    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  }
  run();
}
