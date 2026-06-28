import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkApplicants() {
  const { data: namesData, error: err2 } = await supabase
    .from('applicants')
    .select('*')
    .ilike('full_name', '%عبدالله%');
  
  if (err2) {
    console.error('Error fetching names:', err2);
    return;
  }
  console.log(`\nFound ${namesData?.length} applicants with name Abdullah:`);
  console.log(JSON.stringify(namesData, null, 2));

  const { data: namesData2, error: err3 } = await supabase
    .from('applicants')
    .select('*')
    .ilike('full_name', '%محمد عبدو%');
  
  if (err3) {
    console.error('Error fetching names:', err3);
    return;
  }
  console.log(`\\nFound ${namesData2?.length} applicants with name Mohammed Abdo:`);
  
  const fs = await import('fs');
  fs.writeFileSync('abdullah_results.json', JSON.stringify({ abdullah: namesData, mohammed: namesData2 }, null, 2), 'utf8');
  console.log('Results written to abdullah_results.json');
}

checkApplicants();
