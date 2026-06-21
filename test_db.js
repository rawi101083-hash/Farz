import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const content = fs.readFileSync('src/config.ts', 'utf8');
const urlMatch = content.match(/SUPABASE_URL\s*=\s*['"`]?([^'"`\s;]+)/);
const keyMatch = content.match(/SUPABASE_ANON_KEY\s*=\s*['"`]?([^'"`\s;]+)/);
if(urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  supabase.from('applicants').select('id, full_name, decision, interview_sent').then(res => {
    fs.writeFileSync('db_dump.json', JSON.stringify(res.data, null, 2));
    console.log("Dumped to db_dump.json");
  });
}
