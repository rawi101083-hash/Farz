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
    .ilike('full_name', '%محلل%')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: job } = await supabase.from('jobs').select('*').eq('id', applicant.job_id).single();

  const pythonPayload = {
    applicant_id: applicant.id,
    job_id: job.id,
    cv_file_url: applicant.cv_file_url,
    job_context: {
      title: job.title,
      department: job.department,
      description: job.description,
      requirements: job.requirements
    }
  };

  try {
    const response = await fetch('http://localhost:8000/api/v1/extract-cv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer change_me_in_production`
      },
      body: JSON.stringify(pythonPayload)
    });
    const result = await response.json();
    console.log("Webhook Response:", result);
  } catch (err) {
    console.error("Webhook fetch failed:", err);
  }
}
check();
check();
