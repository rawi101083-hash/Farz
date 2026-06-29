import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
  const { error } = await supabase.from('applicants').insert([{ 
    job_id: null, 
    full_name: 'Test Applicant', 
    decision: 'processing' 
  }]);
  console.log('Insert Error:', error);
}

testInsert();
