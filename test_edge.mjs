import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Invoking edge function...");
  const res = await fetch(`${supabaseUrl}/functions/v1/notify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`
    },
    body: JSON.stringify({
      customerName: 'Test Name',
      customerEmail: 'test@example.com',
      planName: 'باقة اختبار',
      price: 150,
      type: 'subscription'
    })
  });
  const data = await res.text();
  console.log('Status:', res.status);
  console.log('Data:', data);
}

test();
