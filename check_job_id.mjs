import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('applicants')
    .select('id, full_name, decision, job_id, created_at')
    .order('created_at', { ascending: false })
    .limit(3);
  
  if (error) console.error(error);
  else {
    console.log("Last 3 applicants:");
    console.log(data);
  }
}
check();
