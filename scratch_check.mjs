import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_KEY';

// Re-read .env.local manually to avoid dotenv logs
import fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf8');
let url = '', key = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim().replace(/"/g, '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim().replace(/"/g, '');
}

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase
    .from('applicants')
    .select('id, full_name, decision, match_percentage, rejection_reason, created_at, cv_raw_text, ai_justification, hr_notes')
    .ilike('full_name', '%محمد%')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) console.error(error);
  else {
    for (const d of data) {
      console.log(`Name: ${d.full_name}`);
      console.log(`Decision: ${d.decision}`);
      console.log(`Match %: ${d.match_percentage}`);
      console.log(`Rejection Reason: ${d.rejection_reason}`);
      console.log(`AI Justification: ${d.ai_justification}`);
      console.log(`HR Notes: ${d.hr_notes}`);
      console.log(`Raw Text Length: ${d.cv_raw_text ? d.cv_raw_text.length : 0}`);
      console.log('---------------------------');
    }
  }
}
check();
