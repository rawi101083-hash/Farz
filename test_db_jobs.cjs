const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const code = fs.readFileSync('src/lib/supabaseClient.ts', 'utf8');
const urlMatch = code.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = code.match(/supabaseAnonKey\s*=\s*['"]([^'"]+)['"]/);
const supabase = createClient(urlMatch[1], keyMatch[1]);
async function run() {
  const { data, error } = await supabase.from('jobs').select('id, title, direct_upload').eq('id', 'ae18b1c0-abca-4e6e-a4dc-d7b8e0ca17b0');
  console.log('Job query result:', data);
  console.log('Error:', error);
}
run();
