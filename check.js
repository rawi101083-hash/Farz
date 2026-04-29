
const { createClient } = require('@supabase/supabase-js');
const url = process.env.VITE_SUPABASE_URL || 'https://vqqwqunmmkxywzcdvdfn.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || '...'; // I will just read it from .env

const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const u = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const k = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(u, k);
supabase.from('applicants').select('*').then(({data, error}) => {
  console.log('Applicants count:', data?.length);
});

