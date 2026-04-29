const fs = require('fs');

const url = "http://localhost:5678/webhook/99f8e113-a203-45a0-82fb-46861f964ce1";

const jobInfo = {
  jobTitle: "مهندس برمجيات أول",
  minEducation: "بكالوريوس علوم حاسب أو هندسة برمجيات",
  minExperience: "5 سنوات",
  responsibilities: "تطوير واجهات خلفية، إدارة قواعد البيانات بصورة احترافية، تحسين الأداء، التوجيه التقني للفريق.",
  roleDescription: "نبحث عن مهندس برمجيات متمرس لبناء وتطوير منصات رقمية قابلة للتطوير ومستقرة، مع التركيز العالي على جودة الكود المعماري.",
  textQualifications: "يفضل الحصول على شهادات في الحوسبة السحابية (AWS أو Azure).",
  targetMajors: ["هندسة برمجيات", "علوم حاسب", "هندسة حاسب"],
  targetSkills: ["Node.js", "React", "PostgreSQL", "AWS", "System Architecture", "Docker", "TypeScript"],
  requiredLanguages: ["الإنجليزية", "العربية"],
  aiCustomPrompts: "ركز بقوة على قدرة المتقدم على تصميم وبناء قواعد بيانات كبيرة (System Architecture)، ولا تتسامح كثيراً في حال غياب لغة TypeScript."
};

const applicants = [
  {
    applicant_name: "عمر الخالد",
    cv_text: "الاسم: عمر الخالد\nالخبرة: 7 سنوات كمهندس برمجيات في شركة تقنية كبرى.\nالمهارات: Node.js, React, PostgreSQL, Docker, Kubernetes, AWS, TypeScript.\nلقد قمت بتصميم وبناء أنظمة مالية معقدة قادرة على معالجة ملايين العمليات يومياً باستخدام AWS ومعمارية Microservices.\nالتعليم: بكالوريوس في علوم الحاسب الآلي من جامعة الملك فهد للبترول والمعادن بتقدير ممتاز.\nاللغات: العربية (لغة أم)، الإنجليزية (ممتاز).",
    applicantTextAnswers: "سؤال: لماذا نحن؟ جواب: لأنني أبحث عن تحديات تقنية جديدة تناسب خبرتي في بناء الـ Architecture.",
    ...jobInfo
  },
  {
    applicant_name: "سارة عبدلله",
    cv_text: "السيرة الذاتية لـ سارة.\nمطور واجهات أمامية بخبرة 3 سنوات. عملت بشكل أساسي باستخدام HTML, CSS, JavaScript, Vue.js.\nتخرجت من كلية تقنية المعلومات بجامعة الملك سعود. أملك خبرة بسيطة في Node.js لكن لم أعمل عليها بشكل احترافي.\nاللغات: العربية فقط.",
    applicantTextAnswers: "",
    ...jobInfo
  },
  {
    applicant_name: "خالد سعيد",
    cv_text: "خالد سعيد مهندس برمجيات أول ذو خبرة 5 سنوات.\nالمهارات التقنية: TypeScript, Node.js, Express, MongoDB, Google Cloud Platform.\nحاصل على درجة الماجستير في هندسة البرمجيات. قمت بقيادة فرق تقنية مكونة من 5 مطورين وتدريبهم على أفضل الممارسات في كتابة كود TypeScript المتين ومراجعة الكود.\nاللغات: الإنجليزية (طلاقة).",
    applicantTextAnswers: "أنا مستعد للعمل تحت الضغط وتولّي المهام القيادية.",
    ...jobInfo
  },
  {
    applicant_name: "فاطمة محمد",
    cv_text: "فاطمة محمد - مطور برمجيات متكامل (Full-stack).\nعملت لمدة 4 سنوات باستخدام React للواجهات الأمامية و Python/Django للواجهات الخلفية. استخدمت قواعد بيانات MySQL.\nلم استخدم TypeScript كثيراً وافضل استخدام JavaScript العادي. التعليم: بكالوريوس نظم معلومات.\nممتازة في التوثيق واختبار الأنظمة.",
    applicantTextAnswers: "",
    ...jobInfo
  },
  {
    applicant_name: "طارق الدوسري",
    cv_text: "طارق، مهندس حلول برمجية بخبرة 10 سنوات.\nمطور خبير جداً في كل تقنيات الويب (React, Angular, Node.js, Python, Java, AWS, Azure, PostgreSQL). متخصص في صياغة هياكل قواعد البيانات الضخمة (Database Architecture) وأتمتة النشر باستخدام Docker & CI/CD. عملت في قطاع البنوك لسنوات وتصديت لتحديات أمنية وهندسية كثيرة. مؤهل: هندسة برمجيات.\nمتقن للغتين العربية والإنجليزية.",
    applicantTextAnswers: "مهتم جداً بتطوير بيئة العمل وتحمل مسؤوليات المهندس الأساسي للمنصة.",
    ...jobInfo
  }
];

async function run() {
  console.log("Starting Stress Test with 5 Candidates Concurrently...");
  
  const promises = applicants.map(async (app, idx) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app)
      });
      const resData = await response.text();
      console.log(`✅ Sent Applicant ${idx + 1} (${app.applicant_name}) - Status: ${response.status}`);
      console.log(`   Response Body: ${resData.substring(0, 100)}...\n`);
    } catch (e) {
      console.error(`❌ Failed Applicant ${idx + 1} (${app.applicant_name}):`, e.message);
    }
  });

  await Promise.all(promises);
  console.log("All concurrent requests dispatched.");
}

run();
