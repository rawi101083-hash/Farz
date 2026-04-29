const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// --- 1. Mq mandatory adjustments ---
// Minimum qualification to required *
code = code.replace(/الحد الأدنى للمؤهل <span className="text-slate-400 font-normal ml-1">\(اختياري\)<\/span>/g, 'الحد الأدنى للمؤهل <span className="text-red-500">*</span>');
code = code.replace(/الحد الأدنى للمؤهل <span className="text-slate-400 font-normal text-xs ml-1">\(اختياري\)<\/span>/g, 'الحد الأدنى للمؤهل <span className="text-red-500">*</span>');
// Make sure select has required (CreateJob usually does not have required on select if we rely on defaults, but we can add Native HTML required)
code = code.replace(/<select\s+value=\{qualification\}/g, '<select required value={qualification}');

// Also manually add required to CreateJob experience and qualification if not there:
code = code.replace(/<select\s+value=\{experience\}/g, '<select required value={experience}');
code = code.replace(/<select\s+value=\{type\}/g, '<select required value={type}');

// --- 2 & 4. Optional Adjustments & Text Hints ---

// A) نبذة عن الدور
// Change label to '(اختياري)' 
code = code.replace(/نبذة عن الدور <span className="text-red-500">\*<\/span>/g, 'نبذة عن الدور <span className="text-slate-400 font-normal ml-1">(اختياري)</span>');
code = code.replace(/<label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">نبذة عن الدور<\/label>/g, '<label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">نبذة عن الدور <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>');
code = code.replace(/<label className="text-sm font-bold text-navy dark:text-white mb-2 block">\s*نبذة عن الدور\s*<\/label>/g, '<label className="text-sm font-bold text-navy dark:text-white mb-2 block">نبذة عن الدور <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>');
// Remove 'required'
code = code.replace(/value=\{jobDescription\} onChange=\{\(e\) => setJobDescription\(e.target.value\)\}\s*required\s*placeholder=/g, 'value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder=');
code = code.replace(/value=\{description\} onChange=\{\(e\) => setDescription\(e.target.value\)\}\s*required\s*placeholder=/g, 'value={description} onChange={(e) => setDescription(e.target.value)} placeholder=');
// Add correct hint:
const oldHintDesc = /<p className="text-xs text-slate-500 mt-1.5 opacity-80">💡 ترك هذا الحقل فارغاً سيجعل الذكاء الاصطناعي يعتمد على المعايير القياسية للمسمى الوظيفي\. لتقييم أدق، أضف نبذة مختصرة\.<\/p>/g;
const newHintDesc = '<p className="text-xs text-slate-500 mt-1 opacity-80">(ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي)</p>';
if (code.match(oldHintDesc)) {
    code = code.replace(oldHintDesc, newHintDesc);
} else {
    // Inject hint for CreateJob jobDescription if missing
    code = code.replace(/(<textarea([^>]*)value=\{jobDescription\}([^>]*)><\/textarea>)(?!\s*<p className="text-xs)/, `$1\n                      ${newHintDesc}`);
    // Inject hint for ManageJob description if missing
    code = code.replace(/(<textarea([^>]*)value=\{description\}([^>]*)><\/textarea>)(?!\s*<p className="text-xs)/, `$1\n                    ${newHintDesc}`);
}

// B) المهام والمسؤوليات
code = code.replace(/المهام والمسؤوليات <span className="text-red-500">\*<\/span>/g, 'المهام والمسؤوليات <span className="text-slate-400 font-normal ml-1">(اختياري)</span>');
code = code.replace(/<label className="text-sm font-bold text-navy dark:text-white mb-2 block">\s*المهام والمسؤوليات\s*<\/label>/g, '<label className="text-sm font-bold text-navy dark:text-white mb-2 block">المهام والمسؤوليات <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>');
code = code.replace(/<label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">المهام والمسؤوليات<\/label>/g, '<label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">المهام والمسؤوليات <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>');
// Remove required
code = code.replace(/value=\{responsibilities\} onChange=\{\(e\) => setResponsibilities\(e.target.value\)\}\s*required\s*placeholder=/g, 'value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} placeholder=');
// Remove old hint
code = code.replace(/<p className="text-xs text-slate-500 mt-1\.5 opacity-80">💡 يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة الذكاء الاصطناعي\.<\/p>\s*/g, '');

// C) المؤهلات والمتطلبات
// Currently: `المؤهلات والمتطلبات <span className="text-red-500">*</span>`
code = code.replace(/المؤهلات والمتطلبات <span className="text-red-500">\*<\/span>/g, 'المؤهلات والمتطلبات <span className="text-slate-400 font-normal ml-1">(اختياري)</span>');
// Remove required if any text area uses requirements
code = code.replace(/value=\{requirements\} onChange=\{\(e\) => setRequirements\(e.target.value\)\}\s*required\s*placeholder=/g, 'value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder=');


// D) المهارات المستهدفة 
// Could be `المهارات واللغات` or `المهارات والتفضيلات` or `المهارات المستهدفة <span className="text-red-500">*</span>`
code = code.replace(/المهارات المستهدفة <span className="text-red-500">\*<\/span>/g, 'المهارات المستهدفة <span className="text-slate-400 font-normal ml-1">(اختياري)</span>');
code = code.replace(/<label className="text-sm font-bold text-navy dark:text-white block">المهارات والتفضيلات<\/label>/g, '<label className="text-sm font-bold text-navy dark:text-white block">المهارات المستهدفة <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>');
code = code.replace(/<label className="text-sm font-bold text-navy dark:text-white block">المهارات واللغات<\/label>/g, '<label className="text-sm font-bold text-navy dark:text-white block">المهارات المستهدفة <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>');
// Remove old hint
code = code.replace(/<p className="text-xs text-slate-500 mt-1\.5 opacity-80">💡 تحديد المهارات التقنية الدقيقة يجعل الفرز الآلي أكثر صرامة ودقة\.<\/p>\s*/g, '');


// --- 3. Terminology Fix & Hint ---
// Change from (مربع الـ AI) to (توجيهات إضافية لمحرك الفرز (اختياري))
code = code.replace(/توجيهات إضافية لنظام الفرز \(داخلي\)/g, 'توجيهات إضافية لمحرك الفرز (اختياري)');
code = code.replace(/توجيهات إضافية لنظام الفرز \(مربع الـ AI\)/g, 'توجيهات إضافية لمحرك الفرز (اختياري)');

// Old Hint: 💡 هنا يمكنك توجيه الذكاء الاصطناعي للتركيز على خبرات معينة (مثال: ركز على من لديه خبرة في قطاع التجزئة).
// New Hint: (هنا يمكنك توجيه محرك الفرز للتركيز على خبرات أو شروط معينة خارج الوصف المعتاد)
const oldHintAI = /<p className="text-xs text-slate-500 mt-1.5 opacity-80">💡 هنا يمكنك توجيه الذكاء الاصطناعي للتركيز على خبرات معينة \(مثال: ركز على من لديه خبرة في قطاع التجزئة\)\.<\/p>/g;
const newHintAI = '<p className="text-xs text-slate-500 mt-1 opacity-80">(هنا يمكنك توجيه محرك الفرز للتركيز على خبرات أو شروط معينة خارج الوصف المعتاد)</p>';

if (code.match(oldHintAI)) {
    code = code.replace(oldHintAI, newHintAI);
} else {
    // Inject if absent
    code = code.replace(/(<textarea([^>]*)value=\{aiInstructions\}([^>]*)><\/textarea>)(?!\s*<p className="text-xs)/, `$1\n                    ${newHintAI}`);
}

// Remove other unused old hints that user didn't mention:
code = code.replace(/<p className="text-xs text-slate-500 mt-1\.5 opacity-80">💡 اترك الحقل فارغاً إذا كانت الوظيفة تقبل جميع التخصصات\.<\/p>\s*/g, '');


fs.writeFileSync('src/App.tsx', code, 'utf8');
