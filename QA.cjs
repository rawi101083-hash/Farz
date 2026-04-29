const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const optSpan = '<span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>';
const infoIconStyle = 'size={14} className="text-slate-400 hover:text-primary transition-colors cursor-help inline-block mr-2"';

// Helper to rebuild labels cleanly without duplicates
function applyLabel(baseTitle, infoTitle, existingSuffixes = []) {
    // We want to ensure the label reads: baseTitle + optSpan + (optional info icon)
    // First, strip existing "(اختياري)" plain text or spans
    let regexBase = new RegExp(`>\\s*${baseTitle}\\s*(?:\\(اختياري\\)|<span[^>]*>\\s*\\(اختياري\\)\\s*<\\/span>|\\(Benefits\\))*\\s*(?:<Info[^>]*>)*\\s*<\\/label>`, 'g');
    
    let replacement = `>${baseTitle} ${optSpan}`;
    if (infoTitle) {
        replacement += ` <Info ${infoIconStyle} title="${infoTitle}" />`;
    }
    replacement += `</label>`;
    
    code = code.replace(regexBase, replacement);
}

// 1. نبذة عن الدور
applyLabel('نبذة عن الدور', '');
code = code.replace(/<label([^>]*)>نبذة عن الدور/, '<label$1>نبذة عن الدور'); // Normalize if any prefix

// 2. المهام والمسؤوليات
applyLabel('المهام والمسؤوليات', '');

// 3. المؤهلات والمتطلبات
applyLabel('المؤهلات والمتطلبات', '');

// 4. المميزات
applyLabel('المميزات', '');

// 5. المهارات المستهدفة
applyLabel('المهارات المستهدفة', '');

// 6. توجيهات إضافية لمحرك الفرز
applyLabel('توجيهات إضافية لمحرك الفرز', 'نظام الفرز يقوم بتحليل السير الذاتية... استخدم هذا الحقل للتركيز على مهارة نادرة...');


// --- Update Placeholders ---

// نبذة عن الدور
code = code.replace(/placeholder="\(اكتب نبذة مختصرة عن الوظيفة\.\.\.\)"/g, 'placeholder="مثال: نبحث عن موظف طموح لإدارة علاقات العملاء في فرعنا الرئيسي..."');
code = code.replace(/placeholder="\(ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي\)"/g, 'placeholder="مثال: نبحث عن موظف طموح لإدارة علاقات العملاء في فرعنا الرئيسي..."');

// المهام والمسؤوليات
code = code.replace(/placeholder="\(اكتب المهام في شكل نقاط\.\.\.\)"/g, 'placeholder="مثال: - تحقيق أهداف المبيعات الشهرية. - إعداد تقارير الأداء..."');
code = code.replace(/placeholder="\(يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة محرك الفرز\)"/g, 'placeholder="مثال: - تحقيق أهداف المبيعات الشهرية. - إعداد تقارير الأداء..."');

// المؤهلات والمتطلبات
code = code.replace(/placeholder="اكتب المؤهلات المطلوبة\s*\(كل سطر يعتبر شرطاً مستقلاً\)\.\.\."/g, 'placeholder="مثال: - إجادة استخدام الحاسب الآلي. - القدرة على تحمل ضغط العمل..."');

// المميزات
code = code.replace(/placeholder="\(مثال: تأمين طبي، عمولات، مكافآت\.\.\.\)"/g, 'placeholder="مثال: تأمين طبي فئة A، عمولات مبيعات تصل إلى 10%، سيارة..."');
code = code.replace(/placeholder="\(أدخل المميزات الإضافية للوظيفة كالتأمين أو العمولات\.\.\.\)"/g, 'placeholder="مثال: تأمين طبي فئة A، عمولات مبيعات تصل إلى 10%، سيارة..."');

// توجيهات إضافية لمحرك الفرز
code = code.replace(/placeholder="\(اكتب توجيهاتك لمحرك الفرز هنا\.\.\.\)"/g, 'placeholder="(اكتب توجيهاتك الدقيقة لمحرك الفرز هنا...)"');
code = code.replace(
  /<textarea([^>]*)value=\{aiInstructions\}([^>]*)placeholder="([^"]*)"([^>]*)>/g,
  '<textarea$1value={aiInstructions}$2placeholder="(اكتب توجيهاتك الدقيقة لمحرك الفرز هنا...)"$4>'
);

// Clear any text content that might be inside the textarea itself for aiInstructions
code = code.replace(
  />\s*\(نظام الفرز يقوم بتحليل السير الذاتية[^<]+<\/textarea>/g,
  '></textarea>'
);


fs.writeFileSync('src/App.tsx', code, 'utf8');
