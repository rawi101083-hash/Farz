const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findApplicant() {
  console.log("Searching for applicant 'زكي برناوي'...");
  const { data: applicants, error: appError } = await supabase
    .from('applicants')
    .select('*')
    .ilike('full_name', '%زكي برناوي%');
    
  if (appError) {
    console.error("Error finding applicant:", appError);
    return;
  }

  if (!applicants || applicants.length === 0) {
    console.log("Applicant 'زكي برناوي' not found.");
    return;
  }

  console.log(`Found ${applicants.length} applicant(s).`);
  
  for (const applicant of applicants) {
    console.log("-------------------------------------------------");
    console.log(`Applicant Name: ${applicant.full_name}`);
    console.log(`Job ID: ${applicant.job_id}`);
    
    // Fetch the job
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', applicant.job_id)
      .single();
      
    if (jobError || !jobData) {
      console.log(`Could not find job with ID ${applicant.job_id}. It might have been deleted.`);
      continue;
    }
    
    console.log(`Job Title: ${jobData.title}`);
    console.log(`Company ID: ${jobData.company_id}`);
    
    // Fetch the company
    const { data: companyData, error: compError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', jobData.company_id)
      .single();
      
    if (compError || !companyData) {
      console.log(`Could not find company with ID ${jobData.company_id}. It might have been deleted.`);
      continue;
    }
    
    console.log(`Company Name: ${companyData.company_name}`);
    // Check user_id to see who owns this company
    console.log(`Company Owner (user_id): ${companyData.id}`); // in this schema, company id is often the auth user id
    console.log("-------------------------------------------------");
  }
}

findApplicant();
