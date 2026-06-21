const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const content = fs.readFileSync('src/config.ts', 'utf8');
const urlMatch = content.match(/SUPABASE_URL\s*=\s*['"`]?([^'"`\s;]+)/);
const keyMatch = content.match(/SUPABASE_ANON_KEY\s*=\s*['"`]?([^'"`\s;]+)/);
if(urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  supabase.from('applicants').select('*').limit(1).then(res => {
    if (res.data && res.data.length > 0) {
      console.log(Object.keys(res.data[0]).join('\n'));
    } else {
      console.log('No data');
    }
  });
}
