const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllZakiColumns() {
  const { data: applicant, error } = await supabase.from('applicants').select('*').ilike('full_name', '%زكي برناوي%').single();
  if (error) { console.error(error); return; }
  
  console.log("Zaki's columns:", Object.keys(applicant));
  console.log("AI Justification:", applicant.ai_justification);
  console.log("Strengths:", applicant.top_strengths);
  console.log("Weaknesses:", applicant.top_weaknesses);
  console.log("Suggested Questions:", applicant.suggested_questions);
  console.log("Custom Answers:", applicant.custom_answers);
}
checkAllZakiColumns();
