import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync('.env.local', 'utf8');
let url = '', key = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim().replace(/"/g, '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim().replace(/"/g, '');
}

const supabase = createClient(url, key);

async function apply() {
  console.log("1. Fetching a job...");
  const { data: applicants, error: jobError } = await supabase.from('applicants').select('job_id').order('created_at', { ascending: false }).limit(1);
  if (jobError || applicants.length === 0) {
    console.error("No jobs found!", jobError);
    return;
  }
  const job = { id: applicants[0].job_id, title: "Software Engineer", department: "IT", description: "Test", requirements: "Test" };
  console.log(`Found job: ${job.title} (${job.id})`);

  console.log("2. Uploading CV to storage...");
  const filePath = path.join(process.cwd(), 'backend', 'cv_processor_service', 'test_cv_software_engineer.docx');
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = `test_cv_${Date.now()}.docx`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage.from('cv_uploads').upload(fileName, fileBuffer, {
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
  
  if (uploadError) {
    console.error("Upload error:", uploadError);
    return;
  }
  
  const { data: publicUrlData } = supabase.storage.from('cv_uploads').getPublicUrl(uploadData.path);
  const cvUrl = publicUrlData.publicUrl;
  console.log(`Uploaded CV: ${cvUrl}`);

  console.log("3. Inserting applicant into DB...");
  const { data: applicantData, error: dbError } = await supabase.from('applicants').insert([{
    job_id: job.id,
    full_name: "طارق الذكاء الاصطناعي",
    email: `tareq.ai+${Date.now()}@example.com`,
    phone: "0500000000",
    decision: "pending"
  }]).select().single();

  if (dbError) {
    console.error("DB Error:", dbError);
    return;
  }
  console.log(`Inserted applicant: ${applicantData.id}`);

  console.log("4. Triggering Python Webhook...");
  const pythonPayload = {
    applicant_id: applicantData.id,
    job_id: job.id,
    cv_file_url: cvUrl,
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
apply();
