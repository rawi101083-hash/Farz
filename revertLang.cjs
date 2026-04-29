const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regexToRemove = /<div className="relative">\s*<input\s*type="text"\s*value=\{customLanguage\}\s*onChange=\{\(e\) => setCustomLanguage\(e\.target\.value\)\}\s*onKeyDown=\{\(e\) => \{\s*if \(e\.key === "Enter"\) \{\s*e\.preventDefault\(\);\s*addCustomLanguage\(e\);\s*\}\s*\}\}\s*placeholder="أضف لغة\.\.\."\s*className="w-full pr-6 pl-14 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium"\s*\/>\s*<button\s*type="button"\s*onClick=\{addCustomLanguage\}\s*className="absolute left-3 top-1\/2 -translate-y-1\/2 w-10 h-10 bg-slate-50 dark:bg-slate-800\/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary transition-all"\s*>\s*<Plus size=\{20\} \/>\s*<\/button>\s*<\/div>\s*<p className="text-\[13px\] font-semibold text-slate-500 mt-2\.5">\(تلميح: يرجى كتابة اللغة مع مستوى الإتقان المطلوب، مثال: إنجليزي متقدم، إنجليزي بطلاقة\)<\/p>/g;

const replacementSelect = `<div className="relative">
                    <select
                      value=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !selectedLanguages.includes(val)) {
                          setSelectedLanguages([...selectedLanguages, val]);
                        }
                      }}
                      className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium appearance-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                    >
                      <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر لغة لإضافتها...</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="العربية">العربية</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الإنجليزية">الإنجليزية</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الفرنسية">الفرنسية</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الإسبانية">الإسبانية</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الهندية">الهندية</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الأوردو">الأوردو</option>
                    </select>
                  </div>`;

code = code.replace(regexToRemove, replacementSelect);

fs.writeFileSync('src/App.tsx', code, 'utf8');
