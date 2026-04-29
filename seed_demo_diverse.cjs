const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

const targetGetList = `      return JSON.parse(dataStr);
    }
  } catch(e) {}
  return [
    {
      id: "c1",`;

const fullGetListRegex = /return \[\s*{\s*id: "c1".*?}\s*\];\s*};/s;

const replacementGetList = `return [
    {
      id: "c1",
      name: "عمر الخالد",
      job: "مهندس برمجيات أول",
      rating: 98,
      photoUrl: "https://i.pravatar.cc/150?u=omar",
      status: "فوري",
      color: "emerald",
      phone: "966500000001",
      email: "omar@example.com",
      skills: ["Node.js", "React", "PostgreSQL", "AWS"],
      aiSummary: "مرشح متميز جداً. يمتلك خبرة 7 سنوات كمهندس برمجيات في شركة تقنية كبرى. لقد قام بتصميم وبناء أنظمة مالية معقدة قادرة على معالجة ملايين العمليات يومياً باستخدام AWS ومعمارية Microservices. مطابق تماماً للمتطلبات التقنية كمهندس أول.",
      voiceEval: "",
      customAnswers: [],
      expectedSalary: "12000 - 15000",
      top_strengths: ["خبرة معمقة في بناء معمارية Microservices", "قدرة عالية على إدارة قواعد البيانات الضخمة (PostgreSQL)", "خبرة واسعة في خدمات أمازون السحابية (AWS)"],
      top_weaknesses: ["لا يوجد لديه خبرة سابقة في إدارة فرق كبيرة (أكثر من 3 أفراد)"],
      cv_text: \`عمر الخالد
مهندس برمجيات أول
الرياض، السعودية | omar@example.com | 0500000001

الخبرات:
- مهندس برمجيات أول في شركة تقنية (2018 - الآن)
  تصميم وتطوير نظام مالي متكامل يعتمد على AWS و Node.js.
  إدارة قواعد بيانات PostgreSQL مع تحسين الأداء بنسبة 40%.
- مطور برمجيات في STC (2015 - 2018)
  بناء واجهات باستخدام React.js.

التعليم:
بكالوريوس هندسة حاسب آلي - جامعة الملك سعود (2014)\`
    },
    {
      id: "c2",
      name: "خالد سعيد",
      job: "مهندس برمجيات أول",
      rating: 85,
      photoUrl: "https://i.pravatar.cc/150?u=khaled",
      status: "أسبوعين",
      color: "teal",
      phone: "966500000002",
      email: "khaled@example.com",
      skills: ["TypeScript", "Node.js", "MongoDB", "GCP"],
      aiSummary: "مهندس برمجيات أول ذو خبرة 5 سنوات. قام بقيادة فرق تقنية مكونة من 5 مطورين وتدريبهم. يفتقر قليلاً للخبرة المعمقة في AWS لكن أساسياته ممتازة ومؤهل جداً للقيادة.",
      voiceEval: "",
      customAnswers: [],
      expectedSalary: "10000 - 12000",
      top_strengths: ["مهارات تواصل وقيادة فِرق ممتازة", "إجادة تامة للـ TypeScript والـ Node.js"],
      top_weaknesses: ["يفتقر لخبرة واسعة في AWS (متخصص أكثر في GCP)"],
      cv_text: \`خالد سعيد
مهندس تقني، قائد فريق
جدة | khaled@example.com | 0500000002

الخبرات:
- قائد فريق تطوير (2020 - الآن)
  إدارة فريق من 5 مطورين، التركيز على بيئات GCP واستخدام TypeScript.
- مطور Backend (2018 - 2020)
  تطوير خدمات API RESTful متقدمة.

المهارات:
TypeScript, Node.js, Express, MongoDB, Google Cloud\`
    },
    {
      id: "c3",
      name: "طارق الدوسري",
      job: "مهندس برمجيات أول",
      rating: 92,
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      status: "شهر",
      color: "indigo",
      phone: "966500000003",
      email: "tariq@example.com",
      skills: ["React", "Angular", "Python", "Docker"],
      aiSummary: "مطور خبير جداً بخبرة 10 سنوات في قطاع البنوك. متخصص في صياغة هياكل قواعد البيانات الضخمة وأتمتة النشر. إضافة استراتيجية ومستشار تقني.",
      voiceEval: "",
      customAnswers: [],
      expectedSalary: "15000 - 18000",
      top_strengths: ["خبرة طويلة جداً تفوق 10 سنوات في البناء الهيكلي", "خبرة في القطاع البنكي والأمان السيبراني للأنظمة"],
      top_weaknesses: ["يبحث عن راتب قد يتجاوز ميزانية الوظيفة", "يستخدم Python كطبيب أساسي وليس Node.js"],
      cv_text: \`طارق الدوسري
مستشار ومهندس برمجيات
الدمام | tariq@example.com | 0500000003

10 سنوات من الخبرة التقنية. عملت كمهندس رئيسي في بنك الراجحي لإعادة هيكلة النظم.
أتمتة دورة حياة البرنامج CI/CD باستخدام Docker و Kubernetes.

التقنيات:
React, Python, Django, Oracle DB\`
    },
    {
      id: "c4",
      name: "فاطمة محمد",
      job: "مهندس برمجيات أول",
      rating: 65,
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      status: "فوري",
      color: "orange",
      phone: "966500000004",
      email: "fatima@example.com",
      skills: ["React", "Python", "Django", "MySQL"],
      aiSummary: "مطور برمجيات بخبرة 4 سنوات. ممتازة في التوثيق واختبار الأنظمة. لم تستخدم TypeScript بالمطلق، مما يطرح بعض الفجوات بناءً على متطلبات الوظيفة.",
      voiceEval: "",
      customAnswers: [],
      expectedSalary: "8000 - 10000",
      top_strengths: ["كتابة أكواد نظيفة وقدرة عالية على عمل Q/A", "إجادة React كواجهة أمامية"],
      top_weaknesses: ["خبرة قصيرة نسبياً على مسمى 'مطور أول'", "لا تملك مهارات في تقنيات الواجهة الخلفية المطلوبة (Node)"],
      cv_text: \`فاطمة محمد
مطور Full-Stack 
الرياض | fatima@example.com | 0500000004

مبرمجة منجزة تبحث عن تحديات جديدة.

خبرة مهنية:
- مطور برمجيات (2020 - اليوم)
- تدريب كـ Q/A Tester (2019-2020)\`
    },
    {
      id: "c5",
      name: "سارة عبدلله",
      job: "مهندس برمجيات أول",
      rating: 40,
      photoUrl: "https://i.pravatar.cc/150?u=sara",
      status: "فوري",
      color: "rose",
      phone: "966500000005",
      email: "sara@example.com",
      skills: ["HTML", "CSS", "Vue.js", "JavaScript"],
      aiSummary: "مطور واجهات أمامية بخبرة 3 سنوات تفتقر تماماً للمهارات المطلوبة في الواجهات الخلفية وقواعد البيانات.",
      voiceEval: "",
      customAnswers: [],
      expectedSalary: "6000 - 8000",
      top_strengths: ["القدرة على تصميم واجهات معقدة باستخدام Vue.js"],
      top_weaknesses: ["مستوى المطابقة منخفض جداً بسبب عدم وجود تخصص Backend"],
      cv_text: \`سارة عبدلله
مطور Front-end
جدة | sara@example.com | 0500000005

المهارات:
HTML5, CSS3, JavaScript, Vue.js, Tailwind CSS

مطور واجهات مع شغف بتجربة المستخدم (UI/UX).\`
    }
  ];
};`;

c = c.replace(fullGetListRegex, replacementGetList);

// Since we replaced the hardcoded applicants above locally, we ALSO need to clear localStorage 
// so the app picks up the new diverse list, since the user already loaded the page and populated localStorage!
const resetLogic = `window.localStorage.removeItem('applicantsList');\n`;

fs.writeFileSync('src/App.tsx', c);
console.log("Varied DB generated.");
