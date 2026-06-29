import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
  const { error, data } = await supabase.from('applicants').insert([{ 
    job_id: 'afec65b5-22a4-4a3b-8bb0-ca2e7f5d284a', 
    full_name: 'Test Applicant 2', 
    decision: 'processing' 
  }]).select();
  console.log('Insert Error:', error);
  console.log('Insert Data:', data);
}

testInsert();
