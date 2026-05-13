const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing keys");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  // Query a single row to see all columns
  const { data, error } = await supabase.from('applicants').select('*').limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    if (data.length > 0) {
      console.log("Columns in applicants:", Object.keys(data[0]).join(', '));
    } else {
      console.log("No data, checking via RPC or system if possible. Alternatively, check insert.");
      // Just try to insert a dummy and rollback to see if it complains about columns
      const dummy = {
            job_id: "00000000-0000-0000-0000-000000000000",
            full_name: "test",
            email: "test@test.com",
            phone: "123",
            cv_file_url: null,
            decision: "pending",
            rejection_reason: null,
            custom_answers: []
      };
      const { error: insErr } = await supabase.from('applicants').insert([dummy]);
      console.log("Insert error (expected foreign key or format):", insErr);
    }
  }
}
checkSchema();
