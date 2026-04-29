const fs = require('fs');
let content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');

// Update state declarations
content = content.replace(/const \[askExpectedSalary, setAskExpectedSalary\] = useState\(initialData\?.askExpectedSalary \|\| false\);/g, 'const [askExpectedSalary, setAskExpectedSalary] = useState<"hidden" | "open" | "ranges">(initialData?.askExpectedSalary || "hidden");');
content = content.replace(/const \[askExpectedSalary, setAskExpectedSalary\] = useState\(job\.askExpectedSalary \|\| false\);/g, 'const [askExpectedSalary, setAskExpectedSalary] = useState<"hidden" | "open" | "ranges">(job.askExpectedSalary || "hidden");');

// Update boolean casting
content = content.replace(/askExpectedSalary: !!initialData\?.askExpectedSalary,/g, 'askExpectedSalary: initialData?.askExpectedSalary || "hidden",');
content = content.replace(/askExpectedSalary: !!safeBaseRole\?.askExpectedSalary,/g, 'askExpectedSalary: safeBaseRole?.askExpectedSalary || "hidden",');
content = content.replace(/askExpectedSalary: createJobType === "quick_link" \? false : askExpectedSalary,/g, 'askExpectedSalary: createJobType === "quick_link" ? "hidden" : askExpectedSalary,');

// Replace Toggle #1
const toggle1 = `                  <div className="relative mt-3 flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" className="sr-only peer" checked={askExpectedSalary} onChange={(e) => setAskExpectedSalary(e.target.checked)} />
                      <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                      <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">سؤال المتقدم عن راتبه المتوقع (يُظهر قائمة خيارات في نموذج التقديم)</span>
                    </label>
                  </div>`;
const replace1 = `                  <div className="relative mt-5">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 block">الراتب المتوقع للمتقدم</label>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 cursor-pointer bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                        <input type="radio" name="askSalary1" value="hidden" checked={askExpectedSalary === "hidden" || askExpectedSalary === false} onChange={() => setAskExpectedSalary("hidden")} className="w-5 h-5 text-primary border-slate-300 focus:ring-primary dark:bg-slate-700 dark:border-slate-600" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء السؤال (لا تسأل المتقدم عن الراتب)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                        <input type="radio" name="askSalary1" value="open" checked={askExpectedSalary === "open" || askExpectedSalary === true} onChange={() => setAskExpectedSalary("open")} className="w-5 h-5 text-primary border-slate-300 focus:ring-primary dark:bg-slate-700 dark:border-slate-600" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">سؤال مفتوح (إجبار المتقدم على كتابة رقم الراتب المتوقع)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                        <input type="radio" name="askSalary1" value="ranges" checked={askExpectedSalary === "ranges"} onChange={() => setAskExpectedSalary("ranges")} className="w-5 h-5 text-primary border-slate-300 focus:ring-primary dark:bg-slate-700 dark:border-slate-600" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">خيارات محددة (إجبار المتقدم على الاختيار من قائمة نطاقات رواتب)</span>
                      </label>
                    </div>
                  </div>`;
content = content.replace(toggle1, replace1);

// Replace Toggle #2
const toggle2 = `                  <div className="relative mt-3 flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" className="sr-only peer" checked={askExpectedSalary} onChange={(e) => setAskExpectedSalary(e.target.checked)} />
                      <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                      <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">سؤال المتقدم عن راتبه المتوقع (يُظهر قائمة خيارات في نموذج التقديم)</span>
                    </label>
                  </div>`;
const replace2 = `                  <div className="relative mt-5">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 block">الراتب المتوقع للمتقدم</label>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 cursor-pointer bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                        <input type="radio" name="askSalary2" value="hidden" checked={askExpectedSalary === "hidden" || askExpectedSalary === false} onChange={() => setAskExpectedSalary("hidden")} className="w-5 h-5 text-primary border-slate-300 focus:ring-primary dark:bg-slate-700 dark:border-slate-600" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء السؤال (لا تسأل المتقدم عن الراتب)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                        <input type="radio" name="askSalary2" value="open" checked={askExpectedSalary === "open" || askExpectedSalary === true} onChange={() => setAskExpectedSalary("open")} className="w-5 h-5 text-primary border-slate-300 focus:ring-primary dark:bg-slate-700 dark:border-slate-600" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">سؤال مفتوح (إجبار المتقدم على كتابة رقم الراتب المتوقع)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                        <input type="radio" name="askSalary2" value="ranges" checked={askExpectedSalary === "ranges"} onChange={() => setAskExpectedSalary("ranges")} className="w-5 h-5 text-primary border-slate-300 focus:ring-primary dark:bg-slate-700 dark:border-slate-600" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">خيارات محددة (إجبار المتقدم على الاختيار من قائمة نطاقات رواتب)</span>
                      </label>
                    </div>
                  </div>`;
content = content.replace(toggle2, replace2);

fs.writeFileSync('src/components/CreateJob.tsx', content);
console.log('CreateJob.tsx replaced successfully');
