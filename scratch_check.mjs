import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
let url = '', key = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim().replace(/"/g, '').replace('/rest/v1/', '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim().replace(/"/g, '');
}

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('applicants').select('id, full_name, decision, match_percentage').order('created_at', {ascending: false}).limit(10);
  console.log(error ? error : data);
}
run();
