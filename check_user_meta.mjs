import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkMeta() {
  console.log("🔍 Fetching latest users from auth.users...");
  
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 3
  });

  if (error) {
    console.error("❌ Error fetching users:", error.message);
    return;
  }

  const users = data.users;
  if (!users || users.length === 0) {
    console.log("No users found.");
    return;
  }

  for (const user of users) {
    console.log(`\n👤 User: ${user.email} (ID: ${user.id})`);
    console.log(`📅 Created At: ${new Date(user.created_at).toLocaleString()}`);
    console.log(`📦 raw_user_meta_data:`, user.user_metadata);
    
    if (user.user_metadata && user.user_metadata.has_seen_welcome === true) {
      console.log(`✅ SUCCESS! This user HAS the 'has_seen_welcome' flag set to true!`);
    } else {
      console.log(`❌ This user does NOT have the 'has_seen_welcome' flag set (they haven't seen the modal yet or are an old user).`);
    }
  }
}

checkMeta();
