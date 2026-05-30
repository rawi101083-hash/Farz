import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('backend/cv_processor_service/.env', 'utf8');
let url = '', key = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('SUPABASE_SERVICE_KEY=')) key = line.split('=')[1].trim();
}

const supabase = createClient(url, key);

async function check() {
  const { data: applicant, error } = await supabase
    .from('applicants')
    .select('*')
    .ilike('full_name', '%المصري%')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  console.log({
    name: applicant.full_name,
    decision: applicant.decision,
    match: applicant.match_percentage,
    just: applicant.ai_justification,
    flags: applicant.red_flags
  });
}
check();
check();
