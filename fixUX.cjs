const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// ---- 1. Remove all old <p> hints under the inputs ----
code = code.replace(/<p className="text-xs text-slate-500 mt-1 opacity-80">\([^<]+\)<\/p>/g, '');
code = code.replace(/<p className="text-xs text-slate-500 mt-1\.5 opacity-80">\([^<]+\)<\/p>/g, '');

// ---- 2. Update Labels internally to include (اختياري) and ensure NO red star ----

// نبذة عن الدور
code = code.replace(/<label([^>]*)>نبذة عن الدور <span className="text-slate-400 font-normal ml-1">\(اختياري\)<\/span><\/label>/g, '<label$1>نبذة عن الدور (اختياري)</label>');
code = code.replace(/<label([^>]*)>نبذة عن الدور<\/label>/g, '<label$1>نبذة عن الدور (اختياري)</label>');
code = code.replace(/<label([^>]*)>نبذة عن الدور <span className="text-red-500">\*<\/span><\/label>/g, '<label$1>نبذة عن الدور (اختياري)</label>');

// المهام والمسؤوليات
code = code.replace(/<label([^>]*)>المهام والمسؤوليات <span className="text-slate-400 font-normal ml-1">\(اختياري\)<\/span><\/label>/g, '<label$1>المهام والمسؤوليات (اختياري)</label>');
code = code.replace(/<label([^>]*)>المهام والمسؤوليات<\/label>/g, '<label$1>المهام والمسؤوليات (اختياري)</label>');
code = code.replace(/<label([^>]*)>المهام والمسؤوليات <span className="text-red-500">\*<\/span><\/label>/g, '<label$1>المهام والمسؤوليات (اختياري)</label>');

// המهارات المستهدفة
code = code.replace(/<label([^>]*)>المهارات المستهدفة <span className="text-slate-400 font-normal ml-1">\(اختياري\)<\/span><\/label>/g, '<label$1>المهارات المستهدفة (اختياري)</label>');
code = code.replace(/<label([^>]*)>المهارات المستهدفة<\/label>/g, '<label$1>المهارات المستهدفة (اختياري)</label>');
code = code.replace(/<label([^>]*)>المهارات المستهدفة <span className="text-red-500">\*<\/span><\/label>/g, '<label$1>المهارات المستهدفة (اختياري)</label>');

// المؤهلات والمتطلبات
code = code.replace(/<label([^>]*)>المؤهلات والمتطلبات <span className="text-slate-400 font-normal ml-1">\(اختياري\)<\/span><\/label>/g, '<label$1>المؤهلات والمتطلبات (اختياري)</label>');
code = code.replace(/<label([^>]*)>المؤهلات والمتطلبات<\/label>/g, '<label$1>المؤهلات والمتطلبات (اختياري)</label>');
code = code.replace(/<label([^>]*)>المؤهلات والمتطلبات <span className="text-red-500">\*<\/span><\/label>/g, '<label$1>المؤهلات والمتطلبات (اختياري)</label>');

// المميزات (Benefits) -> المميزات (اختياري)
code = code.replace(/<label([^>]*)>المميزات \(Benefits\)<\/label>/g, '<label$1>المميزات (اختياري)</label>');

// توجيهات إضافية لمحرك الفرز (اختياري) - ensure no duplicates or UI mess
code = code.replace(/<label([^>]*)>توجيهات إضافية لمحرك الفرز \(اختياري\)<\/label>/g, '<label$1>توجيهات إضافية لمحرك الفرز (اختياري)</label>');

// ---- 3. Update Placeholders with the Hints ----

// نبذة عن الدور -> CreateJob jobDescription & ManageJob description
code = code.replace(
  /placeholder="مثال: نبذة مختصرة للترحيب..."/g, 
  'placeholder="(ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي)"'
);
code = code.replace(
  /placeholder="نبذة عامة مختصرة عن دور الموظف في الشركة..."/g, 
  'placeholder="(ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي)"'
);
code = code.replace(
  /placeholder="اكتب وصفاً مفصلاً للوظيفة والمهارات المطلوبة..."/g, 
  'placeholder="(ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي)"'
);

// المهام والمسؤوليات
code = code.replace(
  /placeholder="اكتب المهام في شكل نقاط \(كل سطر يعتبر نقطة مستقلة في العرض للمتقدم\)..."/g, 
  'placeholder="(يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة محرك الفرز)"'
);
code = code.replace(
  /placeholder="اكتب المهام في شكل نقاط..."/g, 
  'placeholder="(يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة محرك الفرز)"'
);

// توجيهات إضافية (aiInstructions)
code = code.replace(
  /<textarea([^>]*)value=\{aiInstructions\}([^>]*)placeholder="([^"]*)"([^>]*)>/g,
  '<textarea$1value={aiInstructions}$2placeholder="(هنا يمكنك توجيه محرك الفرز للتركيز على خبرات أو شروط معينة خارج الوصف المعتاد)"$4>'
);

// المميزات (benefits)
code = code.replace(
  /<textarea([^>]*)value=\{benefits\}([^>]*)placeholder="([^"]*)"([^>]*)>/g,
  '<textarea$1value={benefits}$2placeholder="(أدخل المميزات الإضافية للوظيفة كالتأمين أو العمولات...)"$4>'
);
// In case benefits does not have a placeholder yet:
code = code.replace(
  /<textarea([^>]*)value=\{benefits\}(?!.*?placeholder)([^>]*)>/g,
  '<textarea$1value={benefits} placeholder="(أدخل المميزات الإضافية للوظيفة كالتأمين أو العمولات...)"$2>'
);

// المهارات المستهدفة (customSkill input)
code = code.replace(
  /placeholder="أضف مهارة..."/g, 
  'placeholder="أضف مهارة (تحديد المهارات الدقيقة يجعل الفرز الآلي أكثر دقة)..."'
);

// التخصصات المستهدفة (targetMajors)
code = code.replace(
  /placeholder="أضف تخصصاً..."/g, 
  'placeholder="أضف تخصصاً (اترك الحقل فارغاً للقبول العام)..."'
);


fs.writeFileSync('src/App.tsx', code, 'utf8');
