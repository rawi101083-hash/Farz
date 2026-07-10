import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testTrial() {
  const email = 'test_' + Date.now() + '@example.com';
  console.log('Signing up with', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: { name: 'Test Company', phone: '123456789', entity_type: 'company' }
    }
  });
  
  if (error) {
    console.error('Signup error:', error);
    return;
  }
  
  console.log('User created:', data.user.id);
  
  // Wait a bit for triggers to fire
  await new Promise(r => setTimeout(r, 2000));
  
  // Now query companies table
  const { data: company, error: compError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', data.user.id)
    .single();
    
  if (compError) {
    console.error('Company query error:', compError);
  } else {
    console.log('Company data:', company);
    if (company.trial_expires_at || company.trial_start_date || company.plan || company.subscription) {
      console.log('Trial info found!');
    }
  }
}

testTrial();
