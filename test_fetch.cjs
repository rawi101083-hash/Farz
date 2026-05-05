const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zmdkksvykcdvlyszosps.supabase.co'; // need to get this from env or config
const supabaseAnonKey = '...'; // I can't guess this. I need to read .env

require('dotenv').config();
console.log(process.env.VITE_SUPABASE_URL);
