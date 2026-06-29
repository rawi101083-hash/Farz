import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixApp() {
  const { data, error } = await supabase.from('applicants').update({ decision: 'pending' }).eq('decision', 'locked_fomo');
  console.log('Fixed:', data, error);
}

fixApp();
