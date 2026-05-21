import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: applicant, error: fetchErr } = await supabase
    .from('applicants')
    .select('*')
    .like('full_name', '%زكي%')
    .limit(1)
    .single();

  if (fetchErr || !applicant) {
    console.error("Could not find Zaki Barnawi.");
    return;
  }

  console.log("Restoring applicant:", applicant.id, applicant.full_name);

  // Reverting the dummy data back to null/empty
  const updates = {
    top_percentile: null,
    ai_justification: null,
    red_flags: [],
    top_strengths: [],
    interview_questions: [],
    attachments: [],
    custom_answers: null,
    match_percentage: 0,
    decision: 'pending',
    skills_match: 0,
    experience_match: 0,
    education_match: 0
  };

  const { data, error } = await supabase
    .from('applicants')
    .update(updates)
    .eq('id', applicant.id);

  if (error) {
    console.error("Restore failed:", error);
  } else {
    console.log("Successfully restored Zaki Barnawi to original state!");
  }
}

run();
