const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());
const WEBHOOK_URL = "http://localhost:5678/webhook/99f8e113-a203-45a0-82fb-46861f964ce1";
const JOB_ID = "a1ffa109-6d74-4732-a56a-879c4747413f";

const applicantsData = [
  {
    name: "أحمد عبدالله",
    email: "ahmed1@example.com",
    phone: "0501111111",
    cv: "سيرة ذاتية - أحمد عبدالله\n\nالتعليم: بكالوريوس تسويق\nالخبرة: 5 سنوات في إدارة الحملات الإعلانية على السوشيال ميديا\nالمهارات: إعلانات جوجل، فيسبوك، انستجرام، كتابة محتوى، تحليل بيانات.\nالإنجازات: زيادة مبيعات بنسبة 30% لشركة تجارة إلكترونية."
  },
  {
    name: "فاطمة عبدالرحمن",
    email: "fatima2@example.com",
    phone: "0502222222",
    cv: "الاسم: فاطمة عبدالرحمن\n\nالتعليم: بكالوريوس في الموارد البشرية\nالخبرة: 3 سنوات كمسؤولة توظيف.\nالمهارات: استقطاب المواهب، إجراء المقابلات، نظام ATS، تقييم الأداء.\nشغوفة بتطوير بيئة العمل وتدريب الموظفين."
  },
  {
    name: "خالد سعيد",
    email: "khaled3@example.com",
    phone: "0503333333",
    cv: "خالد سعيد - مطور ويب\n\nالتعليم: علوم حاسب\nالخبرات: سنتين كمطور واجهات أمامية.\nالمهارات: React, TypeScript, Tailwind CSS, HTML, CSS, JavaScript.\nقمت ببناء عدة تطبيقات ويب وتطوير واجهات مستخدم تفاعلية."
  },
  {
    name: "نورة القحطاني",
    email: "noura4@example.com",
    phone: "0504444444",
    cv: "الاسم: نورة القحطاني\nمحللة بيانات\n\nالتعليم: ماجستير في تحليل البيانات\nالخبرة: 4 سنوات\nالمهارات: Python, SQL, Tableau, Power BI.\nقادرة على تحويل البيانات المعقدة إلى تقارير ورؤى استراتيجية تدعم اتخاذ القرار."
  },
  {
    name: "سعد الدوسري",
    email: "saad5@example.com",
    phone: "0505555555",
    cv: "سعد الدوسري - محاسب مالي\n\nالخبرة: 7 سنوات في مجال المحاسبة والمراجعة.\nالمهارات: إعداد القوائم المالية، الضرائب، إجادة استخدام أنظمة ERP، التدقيق المالي.\nعملت في قطاعات متعددة مثل المقاولات والتجزئة."
  },
  {
    name: "سارة الزهراني",
    email: "sara6@example.com",
    phone: "0506666666",
    cv: "سارة الزهراني\nمصممة جرافيك\n\nالخبرة: 4 سنوات\nالمهارات: Adobe Photoshop, Illustrator, InDesign, Figma.\nأمتلك حس إبداعي عالي في تصميم الهويات البصرية والمطبوعات والواجهات الرقمية."
  },
  {
    name: "عبدالمجيد السالم",
    email: "abdulmajeed7@example.com",
    phone: "0507777777",
    cv: "عبدالمجيد السالم - مهندس برمجيات\nالخبرة: 10 سنوات\nالمهارات: Node.js, Python, AWS, Docker, Kubernetes, Microservices.\nقمت بقيادة فرق تقنية وتصميم هياكل أنظمة ضخمة ومعقدة عالية الأداء."
  },
  {
    name: "مريم العتيبي",
    email: "maryam8@example.com",
    phone: "0508888888",
    cv: "الاسم: مريم العتيبي\nتخصص: خدمة عملاء\n\nالتعليم: دبلوم إدارة أعمال\nالخبرة: سنتين في الكول سنتر\nالمهارات: تواصل ممتاز، حل المشكلات، تحمل ضغط العمل، إجادة استخدام الحاسب الآلي."
  },
  {
    name: "عمر الحربي",
    email: "omar9@example.com",
    phone: "0509999999",
    cv: "عمر الحربي - مهندس شبكات\nالخبرة: 6 سنوات\nالشهادات: CCNA, CCNP, CompTIA Network+\nالمهارات: تصميم وصيانة الشبكات، أمن الشبكات، إدارة السيرفرات والتوجيه."
  },
  {
    name: "ليلى الشهراني",
    email: "laila10@example.com",
    phone: "0500000000",
    cv: "ليلى الشهراني\nمديرة مشاريع PMP\n\nالخبرة: 8 سنوات في إدارة مشاريع تقنية المعلومات.\nالمهارات: Agile, Scrum, PMP, إدارة المخاطر، التخطيط الاستراتيجي، متابعة الميزانيات.\nحققت نسبة إنجاز للمشاريع تفوق 95% في الوقت المحدد."
  }
];

async function run() {
  console.log("Fetching job info...");
  const { data: job, error: jobError } = await supabase.from('jobs').select('*').eq('id', JOB_ID).single();
  if (jobError) {
    console.error("Could not find job:", jobError.message);
  } else {
    console.log("Job found:", job.title);
  }

  for (let i = 0; i < applicantsData.length; i++) {
    const app = applicantsData[i];
    console.log(`Processing ${app.name}...`);
    
    const uniqueEmail = app.email.replace('@', '+' + Math.random().toString(36).substring(7) + '@');
    // 1. Insert into Supabase
    const { data: dbData, error: dbError } = await supabase
      .from("applicants")
      .insert([{
        job_id: JOB_ID,
        full_name: app.name,
        email: uniqueEmail,
        phone: app.phone
      }])
      .select("id")
      .single();
      
    if (dbError) {
      console.error(`Failed to insert ${app.name} into DB:`, dbError.message);
      continue;
    }
    
    // 2. Send to webhook
    const n8nPayload = {
      availability: "متاح فوراً",
      expectedSalary: "غير محدد",
      applicant_db_id: dbData.id,
      applicant_name: app.name,
      applicant_email: uniqueEmail,
      applicant_phone: app.phone,
      job_id: JOB_ID,
      role_id: "",
      cv_text: app.cv,
      jobTitle: job?.title || "اختبار",
      minEducation: job?.qualification || "لا يشترط",
      minExperience: job?.experience || "لا يشترط",
      responsibilities: job?.responsibilities || "",
      roleDescription: job?.description || "",
      textQualifications: job?.qualifications || "",
      targetMajors: job?.targetMajors || [],
      targetSkills: job?.targetSkills || [],
      requiredLanguages: job?.requiredLanguages || [],
      applicantTextAnswers: "",
      aiCustomPrompts: "قاعدة صارمة: قيّم بدقة وتجرد."
    };
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(n8nPayload)
      });
      if (response.ok) {
        console.log(`Successfully sent ${app.name} to webhook.`);
      } else {
        console.error(`Webhook returned status ${response.status} for ${app.name}`);
      }
    } catch (e) {
      console.error(`Error sending webhook for ${app.name}:`, e.message);
    }
    
    // Wait a little before the next one
    await new Promise(res => setTimeout(res, 1000));
  }
  
  console.log("Done sending 10 resumes!");
}

run();
