import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

let url = 'https://zpcooectdwokmvbgttsf.supabase.co';
let key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY29vZWN0ZHdva212Ymd0dHNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcxODI2OSwiZXhwIjoyMDkyMjk0MjY5fQ.Z_MzKzusjzEFLMW4K3E6z3WZSz6mR-qUn_xamEbwk2k';

const supabase = createClient(url, key);

async function run() {
  const { data: jobs, error: e1 } = await supabase.from('jobs').select('*').limit(1);
  const job = jobs[0];
  console.log("Found Job:", job.id);

  console.log("Creating applicant...");
  const { data: applicant, error: insertError } = await supabase.from('applicants').insert({
    full_name: 'اختبار الذكاء الاصطناعي (Cursor 4)',
    email: 'cursor4@test.com',
    phone: '0500000000',
    job_id: job.id,
    cv_file_url: 'https://example.com/fake.pdf',
    decision: 'pending',
    source: 'Platform'
  }).select().single();

  console.log("Insert result:", {applicant, insertError});
  if (!applicant) return;
  
  console.log("Applicant Created:", applicant.id);

  const payload = {
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

  console.log("Triggering Render Webhook...");
  const RENDER_URL = 'https://farz-cv-processo-1.onrender.com/api/v1/extract-cv';
  try {
    const res = await fetch(RENDER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer change_me_in_production`
      },
      body: JSON.stringify(payload)
    });
    console.log("Render response status:", res.status);
    const json = await res.json();
    console.log("Render response json:", json);
  } catch (err) {
    console.error("Render API call failed:", err);
  }
}
run();
