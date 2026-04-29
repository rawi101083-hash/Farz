const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Change "بدون خبرة" to "لا يشترط خبرة" globally
code = code.replace(/بدون خبرة/g, 'لا يشترط خبرة');

// 2. Add "لا يشترط مؤهل" to the minimum qualification dropdown.
// The dropdown for qualification has options starting with "ثانوي".
// Find: `<option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ثانوي</option>`
// and prepend "لا يشترط مؤهل"
const highSchoolOption = '<option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ثانوي</option>';
const noQualOption = '<option className="bg-white text-navy dark:bg-slate-800 dark:text-white">لا يشترط مؤهل</option>';
code = code.replace(new RegExp(highSchoolOption.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'), 'g'), noQualOption + highSchoolOption);

// 3. Hide qualification when "لا يشترط مؤهل" in Applicant view
// Find: `{(activeRole?.qualification || job.qualification) && (`
// Replace: `{(activeRole?.qualification || job.qualification) && (activeRole?.qualification !== "لا يشترط مؤهل" && job.qualification !== "لا يشترط مؤهل") && (`
code = code.replace(
  /\{\(activeRole\?\.qualification \|\| job\.qualification\) && \(/g,
  `{(activeRole?.qualification || job.qualification) && (activeRole?.qualification !== "لا يشترط مؤهل" && job.qualification !== "لا يشترط مؤهل") && (`
);
// Also there might be `{job.qualification && (` (Line 9801)
code = code.replace(
  /\{job\.qualification && \(\s*<div className="inline-flex items-center justify-center gap-2 bg-white\/10 px-5/g,
  `{job.qualification && job.qualification !== "لا يشترط مؤهل" && (\n                      <div className="inline-flex items-center justify-center gap-2 bg-white/10 px-5`
);

// 4. Change Language Select to a Text Input with customLanguage state
// A) Inject customLanguage state and addCustomLanguage function
if (!code.includes('const [customLanguage, setCustomLanguage] = useState')) {
  code = code.replace(
    'const [customSkill, setCustomSkill] = useState("");',
    `const [customSkill, setCustomSkill] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");
  const addCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLanguage.trim() && !selectedLanguages.includes(customLanguage.trim())) {
      setSelectedLanguages([...selectedLanguages, customLanguage.trim()]);
      setCustomLanguage("");
    }
  };`
  );
}

// B) Replace `<select>` block for languages
const selectRegex = /<div className="relative">\s*<select\s*value=""\s*onChange=\{\(e\) => \{\s*const val = e\.target\.value;\s*if \(val && !selectedLanguages\.includes\(val\)\) \{\s*setSelectedLanguages\(\[\.\.\.selectedLanguages, val\]\);\s*\}\s*\}\}\s*className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium appearance-none hover:border-primary focus:ring-4 focus:ring-primary\/10 transition-all cursor-pointer"\s*>\s*<option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر لغة لإضافتها\.\.\.<\/option>\s*<option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="العربية">العربية<\/option>\s*<option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الإنجليزية">الإنجليزية<\/option>\s*<option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الفرنسية">الفرنسية<\/option>\s*<option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الإسبانية">الإسبانية<\/option>\s*<option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الهندية">الهندية<\/option>\s*<option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الأوردو">الأوردو<\/option>\s*<\/select>\s*<\/div>/g;

const languageInputBlock = `<div className="relative">
                    <input
                      type="text"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomLanguage(e);
                        }
                      }}
                      placeholder="أضف لغة..."
                      className="w-full pr-6 pl-14 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={addCustomLanguage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <p className="text-[13px] font-semibold text-slate-500 mt-2.5">(تلميح: يرجى كتابة اللغة مع مستوى الإتقان المطلوب، مثال: إنجليزي متقدم، إنجليزي بطلاقة)</p>`;

code = code.replace(selectRegex, languageInputBlock);

fs.writeFileSync('src/App.tsx', code, 'utf8');
