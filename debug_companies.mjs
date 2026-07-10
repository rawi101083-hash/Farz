import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data } = await supabase.rpc('get_admin_companies_stats');
  console.log(data?.slice(0, 5).map(c => ({ id: c.id, name: c.company_name, status: c.status })));
}
run();
