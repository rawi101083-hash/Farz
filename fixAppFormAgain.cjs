const fs = require('fs');
let content = fs.readFileSync('src/components/JobApplication.tsx', 'utf-8');

// Restore education select
const badEducationHtml = `                <div className="relative">
                  </div>
                </div>
              </div>`;

const goodEducationHtml = `                <div className="relative">
                  <select
                    required
                    name="education"
                    value={formDataState.education}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر المؤهل</option>
                    <option value="ثانوية عامة" className="bg-white text-navy dark:bg-slate-800 dark:text-white">ثانوية عامة</option>
                    <option value="دبلوم" className="bg-white text-navy dark:bg-slate-800 dark:text-white">دبلوم</option>
                    <option value="بكالوريوس" className="bg-white text-navy dark:bg-slate-800 dark:text-white">بكالوريوس</option>
                    <option value="ماجستير" className="bg-white text-navy dark:bg-slate-800 dark:text-white">ماجستير</option>
                    <option value="دكتوراه" className="bg-white text-navy dark:bg-slate-800 dark:text-white">دكتوراه</option>
                  </select>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>`;

// Regex replace because of whitespace differences
const eduRegex = /<div className="relative">\s*<\/div>\s*<\/div>\s*<\/div>/;
if (eduRegex.test(content)) {
  content = content.replace(eduRegex, goodEducationHtml);
  console.log("Restored education select");
} else {
  console.log("Could not find damaged education select block");
}

// Remove the salary placeholder
const badSalaryHtml = `<option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر نطاق الراتب المتوقع</option>`;
if (content.includes(badSalaryHtml)) {
  content = content.replace(badSalaryHtml, '');
  console.log("Removed salary placeholder");
} else {
  const badSalaryRegex = /<option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر نطاق الراتب المتوقع<\/option>\r?\n?/g;
  if (badSalaryRegex.test(content)) {
    content = content.replace(badSalaryRegex, '');
    console.log("Removed salary placeholder (regex)");
  } else {
    console.log("Could not find salary placeholder");
  }
}

fs.writeFileSync('src/components/JobApplication.tsx', content);
