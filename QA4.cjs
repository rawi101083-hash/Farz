const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix the corrupted syntax where `=>` got replaced by `= title="...">`
// It looks like: `onChange={(e) = title="..." > setDescription(e.target.value)}`
// Let's replace any `(e) = title="[^"]+">\s*set` back to `(e) => set`

code = code.replace(/\(e\) = title="[^"]+">\s*(set[A-Za-z]+)/g, '(e) => $1');
code = code.replace(/\(e\) = title="[^"]+">\s*\{\s*(set[A-Za-z]+)/g, '(e) => { $1');

// Now, correctly append `title` to the <textarea> tags!
// A better way is to string-replace on the exact placeholder since it's unique and safe.

function injectTitle(placeholderSubstr, titleText) {
    // Find textarea containing this placeholder, and insert title before the placeholder
    // e.g. placeholder="مثال: نبحث عن ..." -> title="..." placeholder="مثال: نبحث عن ..."
    let regex = new RegExp(`placeholder="(${placeholderSubstr}[^"]*)"`, 'g');
    code = code.replace(regex, (match, fullPlaceholder) => {
        // if title is already safely there around placeholder, don't duplicate
        if (code.includes(`title="${titleText}" placeholder="${fullPlaceholder}"`)) {
            return match;
        }
        return `title="${titleText}" ${match}`;
    });
}

// 1. Description (Nabdha)
injectTitle('مثال: نبحث عن موظف طموح لإدارة', 'ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي');

// ManageJob description used `placeholder="(ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي)"`? No I updated it in QA2.cjs.
// Let's check for manageJob's description placeholders just in case
injectTitle('ترك هذا الحقل فارغاً سيجعل محرك الفرز', 'ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي');
injectTitle('ألصق هنا الوصف الوظيفي والمسؤوليات', 'ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي'); // For the specific error matched above


// 2. Responsibilities
injectTitle('مثال: - تحقيق أهداف المبيعات', 'يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة محرك الفرز');

// 3. AI Instructions
injectTitle('\\(اكتب توجيهاتك الدقيقة لمحرك الفرز', 'نظام الفرز يقوم بتحليل السير الذاتية... استخدم هذا الحقل للتركيز على مهارة نادرة...');

fs.writeFileSync('src/App.tsx', code, 'utf8');
