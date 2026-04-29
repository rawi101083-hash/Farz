const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// ----------------------------------------------------
// CREATE JOB UPDATES
// ----------------------------------------------------

// 1. نبذة عن الدور -> Optional + Hint
// Replace: نبذة عن الدور <span className="text-red-500">*</span>
// With: نبذة عن الدور
// And insert hint under the text area

code = code.replace(
  /نبذة عن الدور <span className=\"text-red-500\">\*<\/span>/,
  'نبذة عن الدور'
);
// Remove required from it in CreateJob
code = code.replace(
  /value=\{jobDescription\} onChange=\{\(e\) => setJobDescription\(e\.target\.value\)\} required placeholder=/g,
  'value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder='
);
// Add Hint
code = code.replace(
  /<textarea(\s*)value=\{jobDescription\}([\s\S]*?)<\/textarea>/,
  `<textarea$1value={jobDescription}$2</textarea>\n                      <p className="text-xs text-slate-500 mt-1.5 opacity-80">💡 ترك هذا الحقل فارغاً سيجعل الذكاء الاصطناعي يعتمد على المعايير القياسية للمسمى الوظيفي. لتقييم أدق، أضف نبذة مختصرة.</p>`
);

// 2. المهام والمسؤوليات -> Optional + Hint
code = code.replace(
  /المهام والمسؤوليات <span className=\"text-red-500\">\*<\/span>/,
  'المهام والمسؤوليات'
);
// Remove required
code = code.replace(
  /value=\{responsibilities\} onChange=\{\(e\) => setResponsibilities\(e\.target\.value\)\} required placeholder=/g,
  'value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} placeholder='
);
// Add Hint
code = code.replace(
  /<textarea(\s*)value=\{responsibilities\}([\s\S]*?)<\/textarea>/,
  `<textarea$1value={responsibilities}$2</textarea>\n                      <p className="text-xs text-slate-500 mt-1.5 opacity-80">💡 يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة الذكاء الاصطناعي.</p>`
);

// 3. توجيهات إضافية لنظام الفرز
// Rename label
code = code.replace(
  /توجيهات إضافية لنظام الفرز \(داخلي\)/,
  'توجيهات إضافية لنظام الفرز (مربع الـ AI)'
);
// Add Hint
code = code.replace(
  /<textarea(\s*)value=\{aiInstructions\}([\s\S]*?)<\/textarea>/,
  `<textarea$1value={aiInstructions}$2</textarea>\n                    <p className="text-xs text-slate-500 mt-1.5 opacity-80">💡 هنا يمكنك توجيه الذكاء الاصطناعي للتركيز على خبرات معينة (مثال: ركز على من لديه خبرة في قطاع التجزئة).</p>`
);

// 4. التخصصات المستهدفة
// Change from (اختياري) to no text, then add hint
code = code.replace(
  /التخصصات المستهدفة <span className=\"text-slate-400 font-normal text-xs ml-1\">\(اختياري\)<\/span>/,
  'التخصصات المستهدفة'
);
// it occurs in ManageJob too: `التخصصات المستهدفة <span className="text-slate-400 font-normal ml-1">(اختياري)</span>`
code = code.replace(
  /التخصصات المستهدفة <span className=\"text-slate-400 font-normal ml-1\">\(اختياري\)<\/span>/g,
  'التخصصات المستهدفة'
);
// Add hint under the tag/input array of Target Majors in CreateJob
code = code.replace(
  /<input type="text"([^]*?)(setTargetMajors|setNewMajorInput)([^]*?)placeholder="أضف تخصصاً([^>]*?)>/g,
  `$&\n<p className="text-xs text-slate-500 mt-1.5 opacity-80">💡 اترك الحقل فارغاً إذا كانت الوظيفة تقبل جميع التخصصات.</p>`
);

// 5. المهارات واللغات
code = code.replace(
  /المهارات والتفضيلات <span className=\"text-slate-400 font-normal text-xs ml-1\">\(اختياري\)<\/span>/,
  'المهارات والتفضيلات'
);
code = code.replace(
  /المهارات والتفضيلات <span className=\"text-slate-400 font-normal ml-1\">\(اختياري\)<\/span>/g,
  'المهارات والتفضيلات'
);
// add hint under the input of custom skill
code = code.replace(
  /<input type="text"([^]*?)(setCustomSkill)([^]*?)placeholder="أضف مهارة([^>]*?)>/g,
  `$&\n<p className="text-xs text-slate-500 mt-1.5 opacity-80">💡 تحديد المهارات التقنية الدقيقة يجعل الفرز الآلي أكثر صرامة ودقة.</p>`
);


// ----------------------------------------------------
// MANAGE JOB UPDATES
// ----------------------------------------------------

// In ManageJob, we have: `وصف الوظيفة والمتطلبات <span className="text-red-500">*</span>`
// We need to change it to `نبذة عن الدور` and add `المهام والمسؤوليات`.
// Actually, let's inject `responsibilities` state into ManageJob:
const manageJobRegex = /(const \[description, setDescription\] = useState\(.*?;\n)/;
code = code.replace(manageJobRegex, '$1  const [responsibilities, setResponsibilities] = useState(job.responsibilities || "");\n');

// Also update `updatedJob` in ManageJob to include `responsibilities`
code = code.replace(/description,\n(.*?)status,/g, 'description,\n      responsibilities,\n$1status,');

// Modify description UI:
// from `وصف الوظيفة والمتطلبات <span className="text-red-500">*</span>` to `نبذة عن الدور`
code = code.replace(
  /وصف الوظيفة والمتطلبات <span className=\"text-red-500\">\*<\/span>/,
  'نبذة عن الدور'
);

// Remove required inside ManageJob description:
code = code.replace(
  /value=\{description\} onChange=\{\(e\) => setDescription\(e\.target\.value\)\} required placeholder="اكتب وصفاً مفصلاً للوظيفة والمهارات المطلوبة..."/,
  'value={description} onChange={(e) => setDescription(e.target.value)} placeholder="اكتب وصفاً مفصلاً للوظيفة والمهارات المطلوبة..."'
);
// Add Hint for ManageJob description:
code = code.replace(
  /<textarea rows=\{6\} value=\{description\}([\s\S]*?)<\/textarea>/,
  `<textarea rows={6} value={description}$1</textarea>\n                    <p className="text-xs text-slate-500 mt-1.5 opacity-80">💡 ترك هذا الحقل فارغاً سيجعل الذكاء الاصطناعي يعتمد على المعايير القياسية للمسمى الوظيفي. لتقييم أدق، أضف نبذة مختصرة.</p>`
);

// Add Responsibilities field into ManageJob details tab (right under description)
const newRespField = `
                  <div className="space-y-2 mt-6">
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">المهام والمسؤوليات</label>
                    <textarea rows={6} value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} placeholder="اكتب المهام في شكل نقاط..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none min-h-[100px]" />
                    <p className="text-xs text-slate-500 mt-1.5 opacity-80">💡 يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة الذكاء الاصطناعي.</p>
                  </div>`;
// insert it after the description field
code = code.replace(/(<textarea rows=\{6\} value=\{description\}[\s\S]*?<\/textarea>[\s\S]*?<\/p>\s*<\/div>)/, `$1${newRespField}`);


// Qualification in ManageJob: `الحد الأدنى للمؤهل <span className="text-slate-400 font-normal ml-1">(اختياري)</span>`
// Needs to become `الحد الأدنى للمؤهل <span className="text-red-500">*</span>` + required
code = code.replace(
  /الحد الأدنى للمؤهل <span className=\"text-slate-400 font-normal ml-1\">\(اختياري\)<\/span>/,
  'الحد الأدنى للمؤهل <span className="text-red-500">*</span>'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
