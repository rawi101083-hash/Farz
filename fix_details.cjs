const fs = require('fs');

let content = fs.readFileSync('src/components/ApplicantDetails.tsx', 'utf-8');

const mockDataInjection = `  // n8n AI webhook mocked response
  const n8nResponse = {
    match_percentage: 85,
    top_strengths: [
      "يمتلك خبرة 5 سنوات مطابقة للحد الأدنى المطلوب.",
      "يتقن استخدام أدوات التحليل المالي المذكورة في المتطلبات."
    ],
    top_weaknesses: [
      "لم يذكر إجادته للغة الإنجليزية.",
      "يفتقر لشهادة PMP التي فضلها مدير التوظيف."
    ],
    ai_justification: "حصل المتقدم على 85% لتطابقه التام مع المسمى الوظيفي والخبرة المطلوبة، مع وجود فجوة في اللغة والشهادات الإضافية."
  };
`;

// Insert after candidate object
const insertIdx = content.indexOf('return (');
if (insertIdx !== -1) {
  content = content.substring(0, insertIdx) + mockDataInjection + '\n  ' + content.substring(insertIdx);
}

// 1. replace 85%
content = content.replace('<span className="text-3xl font-black text-primary">85%</span>', '<span className="text-3xl font-black text-primary">{n8nResponse.match_percentage}%</span>');

// 2. replace ai_justification
const justificationRegex = /<p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">[\s\S]*?<\/p>/;
content = content.replace(justificationRegex, '<p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{n8nResponse.ai_justification}</p>');

// 3. replace top_strengths
const strengthsRegex = /<ul className="space-y-2">[\s\S]*?<li className="flex gap-2 text-sm text-green-800 dark:text-green-300\/90 leading-relaxed font-bold">[\s\S]*?<\/ul>/;
// Wait, the regex might be tricky if there's multiple <ul className="space-y-2">.
// I'll be more specific!
