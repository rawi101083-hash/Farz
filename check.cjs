
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const u = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const k = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(u, k);
supabase.from('applicants').select('*').then(({data, error}) => {
  console.log('Real Applicants count in Supabase DB:', data?.length);
});

