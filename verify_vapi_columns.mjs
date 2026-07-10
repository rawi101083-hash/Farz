import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if(!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyColumns() {
  console.log("🔍 جاري الاتصال بقاعدة البيانات باستخدام مفتاح Service Role...");
  const { data, error } = await supabase.from('applicants').select('*').limit(1);
  
  if (error) {
    console.error("❌ خطأ في الاتصال بقاعدة البيانات:", error.message);
    return;
  }
  
  const columns = Object.keys(data[0] || {});
  console.log("✅ تم الاتصال بنجاح. يتم الآن التحقق من الأعمدة الحساسة لـ Vapi...");
  
  const requiredColumns = [
    'interview_score',
    'interview_summary',
    'interview_transcript',
    'voice_eval'
  ];
  
  console.log("----------------------------------------");
  let allGood = true;
  for (const col of requiredColumns) {
    if (columns.includes(col)) {
      console.log(`✅ العمود موجود واسمه صحيح 100%: ${col}`);
    } else {
      console.log(`❌ العمود مفقود أو اسمه مختلف: ${col}`);
      allGood = false;
    }
  }
  console.log("----------------------------------------");
  
  if (allGood) {
    console.log("🎉 النتيجة النهائية: جميع الأعمدة الأربعة المطلوبة موجودة وتتطابق أسماؤها بالحرف الواحد مع الكود.");
  } else {
    console.log("⚠️ تحذير: يوجد خلل في أسماء الأعمدة.");
  }
}

verifyColumns();
