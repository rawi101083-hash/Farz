import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const content = fs.readFileSync('src/config.ts', 'utf8');
const urlMatch = content.match(/SUPABASE_URL\s*=\s*['"`]?([^'"`\s;]+)/);
const keyMatch = content.match(/SUPABASE_ANON_KEY\s*=\s*['"`]?([^'"`\s;]+)/);

if(urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  
  async function test() {
    console.log("Testing update...");
    const updateRes = await supabase.from('applicants').update({ nominated_to: 'test_job' }).eq('id', '11111111-1111-1111-1111-111111111111');
    console.log('Update Error:', updateRes.error);
    
    console.log("Testing insert cross-nominate...");
    const { data: originalRaw } = await supabase.from('applicants').select('*').limit(1).single();
    if(originalRaw) {
        delete originalRaw.id;
        delete originalRaw.created_at;
        originalRaw.job_id = "test-job-id";
        originalRaw.source = "ترشيح متقاطع";
        originalRaw.decision = "pending";
        originalRaw.rejection_reason = null;
        originalRaw.hr_notes = null;
        originalRaw.voice_eval = null;
        originalRaw.voice_eval_url = null;
        originalRaw.custom_answers = [];
        const insertRes = await supabase.from('applicants').insert([originalRaw]);
        console.log('Insert Error:', insertRes.error);
    }
  }
  
  test();
} else {
  console.log('Could not parse config');
}
