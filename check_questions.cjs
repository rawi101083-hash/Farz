const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkQuestions() {
  const { data: applicant, error } = await supabase.from('applicants').select('suggested_questions').ilike('full_name', '%زكي برناوي%').single();
  if (error) { console.error(error); return; }
  
  console.log(JSON.stringify(applicant.suggested_questions, null, 2));
}
checkQuestions();
