import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('title', 'حرس')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('حدث خطأ:', error);
  } else {
    fs.writeFileSync('job_debug_new.json', JSON.stringify(data, null, 2));
    console.log('✅ تم جلب الوظيفة بنجاح! تم حفظ البيانات في ملف: job_debug_new.json');
    console.log('افتح الملف الآن وتأكد من وجود aiOverrideFields في الجذر (Root).');
  }
}

run();
