const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAnyQuestions() {
  const { data: applicants, error } = await supabase.from('applicants').select('full_name, suggested_questions').not('suggested_questions', 'is', null).limit(1);
  if (error) { console.error(error); return; }
  
  if (applicants.length > 0) {
    console.log(`Questions for ${applicants[0].full_name}:`);
    console.log(JSON.stringify(applicants[0].suggested_questions, null, 2));
  } else {
    console.log("No applicants with suggested questions found.");
  }
}
checkAnyQuestions();
