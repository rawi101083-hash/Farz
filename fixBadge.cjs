const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const badBadgeRegex = /\{\/\* Expected Salary Badge \*\/\}\s*\{applicant\.expectedSalary && \(\s*<div className="bg-slate-100 dark:bg-slate-800 p-4 mb-0 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">\s*<p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">\s*💰 <span className="text-slate-500 dark:text-slate-400">ملاحظة مالية: الراتب المتوقع للمتقدم<\/span> \(\{applicant\.expectedSalary\} ريال\) \{activeRole\?\.salaryMin \? \` - نطاق الوظيفة \(\$\{activeRole\.salaryMin\} إلى \$\{activeRole\.salaryMax \|\| 'غير محدد'\} ريال\)\` : ''\}\s*<\/p>\s*<\/div>\s*\)\}\s*<div className="bg-slate-50 dark:bg-slate-800\/50 p-6 rounded-\[32px\] border border-slate-100 dark:border-slate-700">\s*\{\" \"\}\s*<h3 className="text-lg font-bold text-navy dark:text-white mb-4 flex items-center gap-2">/g;

code = code.replace(badBadgeRegex, '<div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700">\n            {" "}\n            <h3 className="text-lg font-bold text-navy dark:text-white mb-4 flex items-center gap-2">');

fs.writeFileSync('src/App.tsx', code, 'utf8');
