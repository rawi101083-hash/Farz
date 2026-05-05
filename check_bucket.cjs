const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStorage() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error fetching buckets:", error.message);
  } else {
    console.log("Buckets found:");
    data.forEach(b => console.log("- " + b.name));
    
    if (data.some(b => b.name === 'cv_uploads')) {
      console.log("\n✅ Bucket 'cv_uploads' DOES exist.");
    } else {
      console.log("\n❌ Bucket 'cv_uploads' DOES NOT exist.");
    }
  }
}

checkStorage();
