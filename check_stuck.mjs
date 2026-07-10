import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('applicants')
    .select('id, full_name, decision, created_at')
    .eq('decision', 'processing')
    .order('created_at', { ascending: false });
  
  if (error) console.error(error);
  else console.log("Applicants stuck in processing:", data.length);
  if (data) console.log(data.slice(0, 5));
}
check();
