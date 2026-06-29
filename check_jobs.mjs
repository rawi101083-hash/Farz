import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  // Try to insert a job without a title to see if it fails
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching jobs:', error);
  } else {
    console.log('Sample job:', JSON.stringify(data, null, 2));
    
    // Log the keys to understand the columns
    if (data && data.length > 0) {
      console.log('Columns in jobs table:', Object.keys(data[0]));
    }
  }
}

checkSchema();
