import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('حدث خطأ:', error);
  } else {
    fs.writeFileSync('latest_job_full_debug.json', JSON.stringify(data[0], null, 2));
    console.log('Saved to latest_job_full_debug.json');
  }
}

run();
