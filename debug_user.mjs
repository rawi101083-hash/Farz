import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: { user }, error: authErr } = await supabase.auth.signInWithPassword({ email: 'm.rawi@gmail.com', password: 'password' });
  if (authErr) { console.log('Auth Error:', authErr.message); return; }
  const { data, error } = await supabase.from('companies').select('*').eq('id', user.id).single();
  console.log('Company:', data);
}
run();
