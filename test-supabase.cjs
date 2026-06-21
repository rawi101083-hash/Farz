const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const content = fs.readFileSync('src/config.ts', 'utf8');
const urlMatch = content.match(/SUPABASE_URL\s*=\s*['"`]?([^'"`\s;]+)/);
const keyMatch = content.match(/SUPABASE_ANON_KEY\s*=\s*['"`]?([^'"`\s;]+)/);
if(urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  supabase.from('applicants').update({ nominated_to: 'test' }).eq('id', '11111111-1111-1111-1111-111111111111').then(res => {
    console.log('Update Result:', res);
  }).catch(console.error);
} else {
  console.log('Could not parse config');
}
