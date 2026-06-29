import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkBalance() {
  const { data, error } = await supabase.from('companies').select('id, company_name, cv_limit, used_cvs, subscription_plan').limit(3);
  console.log('Companies:', data);
  console.log('Error:', error);
}

checkBalance();
