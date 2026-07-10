import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const email = 'vuln_1720621618335@example.com'; // I can just sign in or create a new one
  const email2 = 'test_' + Date.now() + '@example.com';
  const { data: authData } = await supabase.auth.signUp({ email: email2, password: 'password123' });
  const { data, error } = await supabase.rpc('get_debug_statuses');
  console.log('Error:', error);
  console.log('Statuses:', data);
}
test();
