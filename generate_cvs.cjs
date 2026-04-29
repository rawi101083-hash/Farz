const fs = require('fs');
const profiles = [
  {
    name: "أحمد عبدالله",
    email: "ahmed.abdullah@example.com",
    phone: "0501112222",
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    skills: ["React", "TypeScript", "Node.js"],
    experience: 5,
    matchPercentage: 92,
    source: "LinkedIn",
    customAnswers: { "هل تقبل العمل عن بعد؟": "نعم" }
  },
  {
    name: "سارة محمد",
    email: "sara.m@example.com",
    phone: "0503334444",
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    skills: ["Python", "Django", "SQL"],
    experience: 3,
    matchPercentage: 85,
    source: "Direct",
    customAnswers: { "هل تقبل العمل عن بعد؟": "لا" }
  },
  {
    name: "خالد سعيد",
    email: "khalid.s@example.com",
    phone: "0505556666",
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    skills: ["UI/UX", "Figma", "Adobe XD"],
    experience: 7,
    matchPercentage: 95,
    source: "Twitter",
    customAnswers: { "هل تقبل العمل عن بعد؟": "نعم" }
  },
  {
    name: "نورة عبدالرحمن",
    email: "noura.a@example.com",
    phone: "0507778888",
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    skills: ["Project Management", "Agile", "Scrum"],
    experience: 8,
    matchPercentage: 88,
    source: "LinkedIn",
    customAnswers: { "هل تقبل العمل عن بعد؟": "نعم" }
  },
  {
    name: "عمر فهد",
    email: "omar.f@example.com",
    phone: "0509990000",
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    skills: ["Java", "Spring Boot", "Microservices"],
    experience: 4,
    matchPercentage: 78,
    source: "GitHub",
    customAnswers: { "هل تقبل العمل عن بعد؟": "نعم" }
  },
  {
    name: "مريم علي",
    email: "maryam.ali@example.com",
    phone: "0551112222",
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    skills: ["Data Science", "Machine Learning", "Python"],
    experience: 2,
    matchPercentage: 70,
    source: "Direct",
    customAnswers: { "هل تقبل العمل عن بعد؟": "لا" }
  },
  {
    name: "فيصل ناصر",
    email: "faisal.n@example.com",
    phone: "0553334444",
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    skills: ["DevOps", "Docker", "Kubernetes", "AWS"],
    experience: 6,
    matchPercentage: 91,
    source: "LinkedIn",
    customAnswers: { "هل تقبل العمل عن بعد؟": "نعم" }
  },
  {
    name: "هيفاء سعود",
    email: "haifa.s@example.com",
    phone: "0555556666",
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    skills: ["Marketing", "SEO", "Content Creation"],
    experience: 5,
    matchPercentage: 82,
    source: "Twitter",
    customAnswers: { "هل تقبل العمل عن بعد؟": "نعم" }
  },
  {
    name: "عبدالعزيز خالد",
    email: "aziz.k@example.com",
    phone: "0557778888",
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    skills: ["Cybersecurity", "Penetration Testing", "Network Security"],
    experience: 9,
    matchPercentage: 97,
    source: "LinkedIn",
    customAnswers: { "هل تقبل العمل عن بعد؟": "نعم" }
  },
  {
    name: "ريم طارق",
    email: "reem.t@example.com",
    phone: "0559990000",
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    skills: ["Customer Success", "Communication", "CRM"],
    experience: 3,
    matchPercentage: 80,
    source: "Direct",
    customAnswers: { "هل تقبل العمل عن بعد؟": "نعم" }
  }
];

fs.writeFileSync('test_profiles.json', JSON.stringify(profiles, null, 2));
