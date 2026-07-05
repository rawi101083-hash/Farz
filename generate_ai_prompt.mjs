import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

function buildJobContext(jobData) {
    let jobContext = "";
    const getField = (obj, field) => obj ? obj[field] : undefined;

    jobContext += `- المسمى الوظيفي: ${getField(jobData, 'jobTitle') || 'غير محدد'}\n`;
    jobContext += `- الحد الأدنى للمؤهل العلمي: ${getField(jobData, 'minEducation') || 'غير محدد'}\n`;
    jobContext += `- الحد الأدنى للخبرة: ${getField(jobData, 'minExperience') || 'غير محدد'}\n\n`;

    let optionalSection = "";

    const responsibilities = getField(jobData, 'responsibilities');
    if (responsibilities && responsibilities.trim() !== "") {
        optionalSection += `- المهام والمسؤوليات:\n${responsibilities}\n\n`;
    }

    const roleDescription = getField(jobData, 'roleDescription');
    if (roleDescription && roleDescription.trim() !== "") {
        optionalSection += `- نبذة عن الدور:\n${roleDescription}\n\n`;
    }

    const textQualifications = getField(jobData, 'textQualifications');
    if (textQualifications && textQualifications.trim() !== "") {
        optionalSection += `- المؤهلات والمتطلبات الإضافية:\n${textQualifications}\n\n`;
    }

    const targetMajors = getField(jobData, 'targetMajors');
    if (Array.isArray(targetMajors) && targetMajors.length > 0) {
        optionalSection += `- التخصصات المستهدفة: ${targetMajors.join('، ')}\n`;
    }

    const targetSkills = getField(jobData, 'targetSkills');
    if (Array.isArray(targetSkills) && targetSkills.length > 0) {
        optionalSection += `- المهارات المستهدفة: ${targetSkills.join('، ')}\n`;
    }

    const requiredLanguages = getField(jobData, 'requiredLanguages');
    if (Array.isArray(requiredLanguages) && requiredLanguages.length > 0) {
        optionalSection += `- اللغات المطلوبة: ${requiredLanguages.join('، ')}\n`;
    }

    const aiInstructions = getField(jobData, 'aiCustomPrompts');
    if (aiInstructions && aiInstructions.trim() !== "") {
        optionalSection += `\n🚨 توجيهات إضافية من محرك الفرز (استخدمها لرفع أو خفض نسبة المطابقة وليس للاستبعاد):\n${aiInstructions}\n\n`;
    }

    if (optionalSection !== "") {
        jobContext += "=== معايير التفضيل والمهارات (لرفع أو خفض الدرجة) ===\n" + optionalSection;
    }

    return jobContext;
}

async function run() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log("الرجاء إدخال اسم الشاغر كمعامل. مثال:");
        console.log("node generate_ai_prompt.mjs \"محاسب\"");
        return;
    }
    const jobTitle = args[0];
    console.log(`\n🔍 جاري البحث عن أحدث متقدم للشاغر: "${jobTitle}"...\n`);

    const { data: applicants, error } = await supabase
        .from('applicants')
        .select('id, full_name, job_context, cv_raw_text, created_at')
        .eq('job_context->>jobTitle', jobTitle)
        .order('created_at', { ascending: false })
        .limit(1);

    if (error || !applicants || applicants.length === 0) {
        console.log(`❌ لم يتم العثور على أي متقدمين لشاغر باسم: "${jobTitle}"`);
        return;
    }

    const applicant = applicants[0];
    console.log(`✅ تم العثور على المتقدم: ${applicant.full_name} (معرف: ${applicant.id})`);
    console.log(`📅 تاريخ التقديم: ${applicant.created_at}\n`);

    const jobContextJson = applicant.job_context || {};
    const jobContextText = buildJobContext(jobContextJson);
    
    // Fallback if cv_raw_text is not there (e.g., if it's a test)
    let cvText = applicant.cv_raw_text || "[نص السيرة الذاتية يوضع هنا]";
    if (cvText.length > 500) {
        cvText = cvText.substring(0, 500) + "... [تم اقتصاص السيرة الذاتية لسهولة القراءة]";
    }

    const finalPrompt = `Job Context (from HR):\n${jobContextText}\n\nCandidate Resume (CV Text):\n${cvText}`;

    console.log("==================================================");
    console.log("🚀 النص الحرفي الذي تم إرساله للذكاء الاصطناعي للتقييم:");
    console.log("==================================================\n");
    console.log(finalPrompt);
    console.log("\n==================================================");
}

run();
