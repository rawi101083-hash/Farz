const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

const targetGetList = `const getApplicantsList = (): Applicant[] => {
  try {
    const dataStr = window.localStorage.getItem('applicantsList');
    if (dataStr) {
      return JSON.parse(dataStr);
    }
  } catch(e) {}
  return [];
};`;

const replacementGetList = `const getApplicantsList = (): Applicant[] => {
  try {
    const dataStr = window.localStorage.getItem('applicantsList');
    if (dataStr) {
      return JSON.parse(dataStr);
    }
  } catch(e) {}
  return [
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
      expectedSalary: "12000 - 15000"
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
      aiSummary: "مهندس برمجيات أول ذو خبرة 5 سنوات. حاصل على درجة الماجستير في هندسة البرمجيات. قام بقيادة فرق تقنية مكونة من 5 مطورين وتدريبهم. يفتقر قليلاً للخبرة المعمقة في AWS لكن أساسياته ممتازة ومؤهل جداً للقيادة.",
      voiceEval: "",
      customAnswers: [],
      expectedSalary: "10000 - 12000"
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
      aiSummary: "مطور خبير جداً بخبرة 10 سنوات في قطاع البنوك. متخصص في صياغة هياكل قواعد البيانات الضخمة (Database Architecture) وأتمتة النشر. يعتبر إضافة استراتيجية ومستشار تقني للفريق أكثر من كونه مطور مهام يومية.",
      voiceEval: "",
      customAnswers: [],
      expectedSalary: "15000 - 18000"
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
      aiSummary: "مطور برمجيات متكامل (Full-stack) بخبرة 4 سنوات. ممتازة في صياغة التوثيق واختبار الأنظمة. لم تستخدم TypeScript، وتفضل Python على Node.js، مما يجعلها غير متوافقة بنسبة كبيرة مع البيئة التقنية المطلوبة للمنصب.",
      voiceEval: "",
      customAnswers: [],
      expectedSalary: "8000 - 10000"
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
      aiSummary: "مطور واجهات أمامية بخبرة 3 سنوات. قدراتها تتركز على HTML و Vue.js. تفتقر تماماً للمهارات المطلوبة في الواجهات الخلفية وقواعد البيانات. قوية في مجالها لكنها لا تندرج تحت تصنيف منصب هندسة البرمجيات الشامل.",
      voiceEval: "",
      customAnswers: [],
      expectedSalary: "6000 - 8000"
    }
  ];
};`;

c = c.replace(targetGetList, replacementGetList);
fs.writeFileSync('src/App.tsx', c);
console.log("Seeded default highly detailed DB.");
