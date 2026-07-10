import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const { data, error } = await supabase
    .from('applicants')
    .select('id, full_name, decision, created_at')
    .gte('created_at', yesterday.toISOString())
    .order('created_at', { ascending: false });
  
  if (error) console.error(error);
  else {
    console.log("Recent applicants:", data.length);
    data.forEach(a => console.log(`${a.full_name} - ${a.decision} - ${a.created_at}`));
  }
}
check();
