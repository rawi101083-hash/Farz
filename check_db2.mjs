import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Read .env.local file directly
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'] || '';
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'] || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Could not find Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching jobs:', error);
  } else {
    if (data && data.length > 0) {
      console.log('Columns in jobs table:');
      console.log(Object.keys(data[0]).join('\n'));
    } else {
      console.log('No jobs found to infer schema.');
    }
  }
}

checkSchema();
