import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function checkSchema() {
  const { data: { session }, error: authErr } = await supabase.auth.signInWithPassword({ email: 'm.rawi@gmail.com', password: 'password123' });
  // Try to upsert a dummy to see the error, or use rpc to get columns if possible
  const { error } = await supabase.from('companies').update({ status: 'pending' }).eq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Update Error:', error);
}
checkSchema();
