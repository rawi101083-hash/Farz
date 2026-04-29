const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Placeholder replacements:
code = code.replace(
  /placeholder="مثال: نبحث عن موظف طموح لإدارة علاقات العملاء في فرعنا الرئيسي\.\.\."/g,
  'TO_REPLACE_NABDHA'
);
code = code.replace(
  /placeholder="\(اكتب نبذة مختصرة عن الوظيفة\.\.\.\)"/g,
  'placeholder="مثال: نبحث عن موظف طموح لإدارة علاقات العملاء في فرعنا الرئيسي..."'
);
// just in case they were reverted or untouched:
code = code.replace(
  /placeholder="\(\s*ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي\s*\)"/g,
  'placeholder="مثال: نبحث عن موظف طموح لإدارة علاقات العملاء في فرعنا الرئيسي..."'
);

code = code.replace(
  /placeholder="\(اكتب المهام في شكل نقاط\.\.\.\)"/g,
  'placeholder="مثال: - تحقيق أهداف المبيعات الشهرية. - إعداد تقارير الأداء..."'
);
code = code.replace(
  /placeholder="مثال: - تحقيق أهداف المبيعات الشهرية\. - إعداد تقارير الأداء\.\.\."/g,
  'placeholder="مثال: - تحقيق أهداف المبيعات الشهرية. - إعداد تقارير الأداء..."'
);

code = code.replace(
  /placeholder="اكتب المؤهلات المطلوبة\s*\(كل سطر يعتبر شرطاً مستقلاً\)\.\.\."/g,
  'placeholder="مثال: - إجادة استخدام الحاسب الآلي. - القدرة على تحمل ضغط العمل..."'
);
code = code.replace(
  /placeholder="مثال: - إجادة استخدام الحاسب الآلي\. - القدرة على تحمل ضغط العمل\.\.\."/g,
  'placeholder="مثال: - إجادة استخدام الحاسب الآلي. - القدرة على تحمل ضغط العمل..."'
);


// المميزات placeholder
code = code.replace(
  /placeholder="\(مثال: تأمين طبي، عمولات، مكافآت\.\.\.\)"/g,
  'placeholder="مثال: تأمين طبي فئة A، عمولات مبيعات تصل إلى 10%، سيارة..."'
);
code = code.replace(
  /placeholder="\(أدخل المميزات الإضافية للوظيفة كالتأمين أو العمولات\.\.\.\)"/g,
  'placeholder="مثال: تأمين طبي فئة A، عمولات مبيعات تصل إلى 10%، سيارة..."'
);

// aiInstructions placeholder
code = code.replace(
  /placeholder="\(نظام الفرز يقوم بتحليل ومطابقة السير الذاتية تلقائياً وبدقة عالية دون الحاجة لأي تدخل([^"]*)"/g,
  'placeholder="(اكتب توجيهاتك الدقيقة لمحرك الفرز هنا...)"'
);
code = code.replace(
  /placeholder="\(اكتب توجيهاتك لمحرك الفرز هنا\.\.\.\)"/g,
  'placeholder="(اكتب توجيهاتك الدقيقة لمحرك الفرز هنا...)"'
);

// 2. Headings and labels fixes

// For aiInstructions <h3>
const infoIconStyle = 'size={14} className="text-slate-400 hover:text-primary transition-colors cursor-help inline-block mr-2"';
const optSpan = '<span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>';

code = code.replace(
  /<h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">\s*توجيهات إضافية لمحرك الفرز\s*\(اختياري\)\s*<\/h3>/g,
  `<h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">\n                    توجيهات إضافية لمحرك الفرز ${optSpan} <Info ${infoIconStyle} title="نظام الفرز يقوم بتحليل السير الذاتية... استخدم هذا الحقل للتركيز على مهارة نادرة..." />\n                  </h3>`
);

// Remove Benefits plain text (just in case)
code = code.replace(
  /المميزات \(Benefits\)/g,
  'المميزات'
);

// Make sure "المميزات" gets the proper optional span rather than plain text
// Let's replace any instance of plain (اختياري) with the span inside labels
code = code.replace(
  /<label([^>]*)>المميزات \(اختياري\)<\/label>/g,
  `<label$1>المميزات ${optSpan}</label>`
);

code = code.replace(
  /<label([^>]*)>نبذة عن الدور \(اختياري\) <Info([^>]*)><\/label>/g,
  `<label$1>نبذة عن الدور ${optSpan} <Info$2></label>`
);

code = code.replace(
  /<label([^>]*)>المهام والمسؤوليات \(اختياري\) <Info([^>]*)><\/label>/g,
  `<label$1>المهام والمسؤوليات ${optSpan} <Info$2></label>`
);

// Note: my previous scripts might have produced `<label>المميزات <span...>(اختياري)</span></label>`. Just to be safe:
// If it's already there, great. I'll just rely on the above.

fs.writeFileSync('src/App.tsx', code, 'utf8');
