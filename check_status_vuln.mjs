import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const email = 'vuln_' + Date.now() + '@example.com';
  const { data } = await supabase.auth.signUp({ email, password: 'password123', options: { data: { name: 'Vuln Co' } } });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await supabase.from('companies').upsert({ id: data.user.id, company_name: 'Vuln Co', status: 'pending' });
  
  const { data: compBefore } = await supabase.from('companies').select('*').eq('id', data.user.id).single();
  console.log('Before update:', compBefore.status, compBefore.subscription_end_date);
  
  await supabase.from('companies').update({ status: 'active' }).eq('id', data.user.id);
  
  const { data: compAfter } = await supabase.from('companies').select('*').eq('id', data.user.id).single();
  console.log('After update:', compAfter.status, compAfter.subscription_end_date);
}
test();
