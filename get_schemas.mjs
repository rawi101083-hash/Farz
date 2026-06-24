import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSchemas() {
  const tables = ['plans', 'wallets', 'wallet_transactions'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    console.log(`\n=== Table: ${table} ===`);
    if (error) {
      console.log('Error:', error.message);
    } else {
      console.log('Columns in first row (or empty array if no data):');
      console.log(data);
    }
  }
}

getSchemas();
