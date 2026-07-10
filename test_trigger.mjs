import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const email = 'test_trigger_' + Date.now() + '@example.com';
  const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password: 'password123' });
  if (authErr) { console.log('Signup err:', authErr); return; }
  const uid = authData.user.id;
  
  // Insert company as pending
  await supabase.from('companies').insert([{ id: uid, company_name: 'Trigger Test', status: 'pending' }]);
  
  // Update to active
  const { error: updErr } = await supabase.from('companies').update({ status: 'active' }).eq('id', uid);
  if (updErr) { console.log('Update err:', updErr); return; }
  
  // Fetch
  const { data, error: fetchErr } = await supabase.from('companies').select('status, subscription_end_date').eq('id', uid).single();
  console.log('Result after trigger:', data);
}
run();
