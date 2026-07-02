import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function run() {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching jobs:', error);
    return;
  }

  if (jobs && jobs.length > 0) {
    const names = jobs.map(j => j.title || j.jobTitle);
    console.log("Job titles:", names);
    const chris = jobs.find(j => {
        const title = (j.title || j.jobTitle || '').toLowerCase();
        return title.includes('chris') || title.includes('ريس') || title.includes('كرس');
    });
    if (chris) {
        fs.writeFileSync('chris_debug.json', JSON.stringify(chris, null, 2));
        console.log("Found Chris job! Saved to chris_debug.json");
    } else {
        console.log("No Chris job found.");
    }
  } else {
    console.log('Applicant not found.');
  }
}

run();
