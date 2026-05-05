const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const { data, error } = await supabase
    .from('applicants')
    .insert([{
      job_id: 'a1ffa109-6d74-4732-a56a-879c4747413f',
      full_name: 'Test Tester',
      email: 'test_n8n_debug_999_final@example.com',
      phone: '0500000000',
      cv_file_url: 'http://example.com/cv.pdf',
      decision: 'قيد الإجراء',
      custom_answers: []
    }])
    .select('id');
    
  if (error) {
    console.error("FAILED:", error.message);
  } else {
    console.log("SUCCESS!", data);
  }
}
testInsert();
