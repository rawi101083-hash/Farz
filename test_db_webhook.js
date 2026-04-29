import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcooectdwokmvbgttsf.supabase.co';
const supabaseAnonKey = 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const webhookUrl = 'http://localhost:5678/webhook/99f8e113-a203-45a0-82fb-46861f964ce1';

const jobContext = {
    jobTitle: "مهندس أتمتة وتطوير خلفي",
    job_id: "test-job-uuid-1234",
    role_id: "test-role-uuid-5678",
    minEducation: "بكالوريوس",
    minExperience: "3 سنوات",
    responsibilities: "تطوير وصيانة الواجهات الخلفية باستخدام Node.js وبناء أنظمة الأتمتة.",
    roleDescription: "نبحث عن مهندس مبدع لتطوير الجانب الخلفي للتطبيق.",
    textQualifications: "فهم عميق لقواعد البيانات وقدرة على كتابة أكواد نظيفة ونسب إنجاز عالية.",
    targetMajors: ["علوم حاسب", "هندسة برمجيات"],
    targetSkills: ["Node.js", "Express", "MongoDB", "n8n", "Automation"],
    requiredLanguages: ["العربية", "الإنجليزية"],
    aiCustomPrompts: "دقق على قدرات المتقدم في الأتمتة واستخدام n8n."
};

const candidates = [
    {
        applicant_name: "أحمد بن خالد (مرشح قوي)",
        applicant_email: "ahmad@example.com",
        applicant_phone: "0501111111",
        cv_text: "التعليم: بكالوريوس هندسة برمجيات من جامعة الملك سعود. الخبرة: 5 سنوات كمطور واجهات خلفية. المهارات: Node.js, Express, MongoDB, n8n, Python, AWS. الإنجازات: قمت بتطوير نظام أتمتة للشركة السابقةوفر 50% من الوقت. اللغات: عربي (أم)، إنجليزي (ممتاز).",
        applicantTextAnswers: "لماذا تقدمت؟ لأنني أعشق الأتمتة وتطوير النظم المعقدة."
    },
    {
        applicant_name: "سارة عبدالله (مرشح متوسط)",
        applicant_email: "sara@example.com",
        applicant_phone: "0502222222",
        cv_text: "التعليم: دبلوم تقنية معلومات. الخبرة: سنتين في الدعم الفني وتجربة بسيطة في تطوير المواقع. المهارات: HTML, CSS, JavaScript, PHP, MySQL. أطمح لتطوير نفسي في الأتمتة.",
        applicantTextAnswers: "لماذا تقدمت؟ أرغب في التعلم وتطوير مهاراتي في بيئة عمل محفزة."
    },
    {
        applicant_name: "محمد سعد (حديث تخرج)",
        applicant_email: "mohammed@example.com",
        applicant_phone: "0503333333",
        cv_text: "التعليم: بكالوريوس علوم حاسب 2026. لا توجد خبرة عملية سابقة. مشاريع التخرج: نظام مكتبة باستخدام متطلبات الجامعة و C++. مهتم بتعلم مجالات جديدة.",
        applicantTextAnswers: "لماذا تقدمت؟ أبحث عن الفرصة الأولى للانطلاق في مسيرتي."
    },
    {
        applicant_name: "نورا علي (مصممة UI/UX)",
        applicant_email: "noura@example.com",
        applicant_phone: "0504444444",
        cv_text: "الخبرة: 4 سنوات كمصممة واجهات. المهارات: Figma, Adobe XD, Illustrator. دراسة سلوك المستخدم وتصميم واجهات تفاعلية جذابة.",
        applicantTextAnswers: "لا أجيد البرمجة ولكنني أصمم الواجهات بشكل جميل."
    },
    {
        applicant_name: "فهد عبدالرحمن (مهندس مدني)",
        applicant_email: "fahad@example.com",
        applicant_phone: "0505555555",
        cv_text: "التعليم: هندسة مدنية. الخبرة: 10 سنوات في البناء والمقاولات وتخطيط المشاريع العمرانية. المهارات: AutoCAD, تخطيط، إدارة مواقع.",
        applicantTextAnswers: "ابحث عن تغيير مسار حياتي المهنية."
    }
];

async function sendData() {
    console.log("Starting to insert candidates into Supabase...");
    
    for (let i = 0; i < candidates.length; i++) {
        const payloadFields = { ...jobContext, ...candidates[i] };
        
        // Step 1: Insert into Supabase
        const { data: dbData, error: dbError } = await supabase
            .from("applicants")
            .insert([{
                job_id: "test-job-uuid-1234",
                full_name: candidates[i].applicant_name,
                email: candidates[i].applicant_email,
                phone: candidates[i].applicant_phone,
                
            }])
            .select("id")
            .single();
            
        let finalPayload = { ...payloadFields };

        if (!dbError && dbData) {
            console.log(`Inserted ${candidates[i].applicant_name} to DB successfully! ID: ${dbData.id}`);
            finalPayload.applicant_db_id = dbData.id;
        } else {
            console.error(`Failed to insert ${candidates[i].applicant_name} to DB!`, dbError);
            // We will still send it just to see if n8n catches the undefined error
            finalPayload.applicant_db_id = "error_uuid"; 
        }

        // Step 2: Send to n8n Webhook
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload)
            });
            console.log(`Webhook triggered for ${candidates[i].applicant_name}: HTTP ${response.status}`);
        } catch (err) {
            console.error(`Error sending payload for ${candidates[i].applicant_name} to Webhook:`, err.message);
        }
    }
    console.log("All 5 Candidates Processed!");
}

sendData();
