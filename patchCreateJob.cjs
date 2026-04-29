const fs = require('fs');
let content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');

// 1. Add state initialization for expectedSalaryRanges
const state1 = `const [askExpectedSalary, setAskExpectedSalary] = useState<"hidden" | "open" | "ranges">(initialData?.askExpectedSalary || "hidden");`;
const state1New = `const [askExpectedSalary, setAskExpectedSalary] = useState<"hidden" | "open" | "ranges">(initialData?.askExpectedSalary || "hidden");\n  const [expectedSalaryRanges, setExpectedSalaryRanges] = useState<string[]>(initialData?.expectedSalaryRanges || []);\n  const [salaryRangeInput, setSalaryRangeInput] = useState("");`;
content = content.replace(state1, state1New);

const state2 = `const [askExpectedSalary, setAskExpectedSalary] = useState<"hidden" | "open" | "ranges">(job.askExpectedSalary || "hidden");`;
const state2New = `const [askExpectedSalary, setAskExpectedSalary] = useState<"hidden" | "open" | "ranges">(job.askExpectedSalary || "hidden");\n  const [expectedSalaryRanges, setExpectedSalaryRanges] = useState<string[]>(job.expectedSalaryRanges || []);\n  const [salaryRangeInput, setSalaryRangeInput] = useState("");`;
content = content.replace(state2, state2New);

// 2. Add expectedSalaryRanges to payload
const payload1 = `askExpectedSalary: initialData?.askExpectedSalary || "hidden",`;
const payload1New = `askExpectedSalary: initialData?.askExpectedSalary || "hidden",\n    expectedSalaryRanges: initialData?.expectedSalaryRanges || [],`;
content = content.replace(payload1, payload1New);

const payload2 = `askExpectedSalary: safeBaseRole?.askExpectedSalary || "hidden",`;
const payload2New = `askExpectedSalary: safeBaseRole?.askExpectedSalary || "hidden",\n      expectedSalaryRanges: safeBaseRole?.expectedSalaryRanges || [],`;
content = content.replace(payload2, payload2New);

const payload3 = `askExpectedSalary: createJobType === "quick_link" ? "hidden" : askExpectedSalary,`;
const payload3New = `askExpectedSalary: createJobType === "quick_link" ? "hidden" : askExpectedSalary,\n      expectedSalaryRanges: createJobType === "quick_link" ? [] : expectedSalaryRanges,`;
// Replace globally since it appears twice
content = content.replace(/askExpectedSalary: createJobType === "quick_link" \? "hidden" : askExpectedSalary,/g, payload3New);

const payload4 = `askExpectedSalary,`;
const payload4New = `askExpectedSalary,\n        expectedSalaryRanges,`;
content = content.replace(`askExpectedSalary,\n        knockoutQuestions,`, `${payload4New}\n        knockoutQuestions,`);

// Update role load from job edit
content = content.replace(
  `if (role.askExpectedSalary !== undefined) setAskExpectedSalary(role.askExpectedSalary);`,
  `if (role.askExpectedSalary !== undefined) setAskExpectedSalary(role.askExpectedSalary);\n    if (role.expectedSalaryRanges !== undefined) setExpectedSalaryRanges(role.expectedSalaryRanges);`
);
content = content.replace(
  `if (firstRole.askExpectedSalary !== undefined) setAskExpectedSalary(firstRole.askExpectedSalary);`,
  `if (firstRole.askExpectedSalary !== undefined) setAskExpectedSalary(firstRole.askExpectedSalary);\n      if (firstRole.expectedSalaryRanges !== undefined) setExpectedSalaryRanges(firstRole.expectedSalaryRanges);`
);


// 3. UI Block - Select Dropdown + Tags Input
const newUI = `                  <div className="relative mt-5">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 block">طريقة سؤال المتقدم عن الراتب المتوقع</label>
                    <div className="relative">
                      <select
                        value={askExpectedSalary}
                        onChange={(e) => setAskExpectedSalary(e.target.value as any)}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="hidden" className="bg-white text-navy dark:bg-slate-800 dark:text-white">عدم السؤال (إخفاء الحقل)</option>
                        <option value="open" className="bg-white text-navy dark:bg-slate-800 dark:text-white">سؤال مفتوح (إدخال رقم)</option>
                        <option value="ranges" className="bg-white text-navy dark:bg-slate-800 dark:text-white">خيارات محددة مسبقاً</option>
                      </select>
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                    
                    {askExpectedSalary === "ranges" && (
                      <div className="mt-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">نطاقات الراتب (اضغط Enter للإضافة)</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <AnimatePresence>
                            {expectedSalaryRanges.map((range, idx) => (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                key={idx}
                                className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2"
                              >
                                {range}
                                <button 
                                  type="button"
                                  onClick={() => setExpectedSalaryRanges(prev => prev.filter((_, i) => i !== idx))}
                                  className="hover:text-red-500 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </motion.span>
                            ))}
                          </AnimatePresence>
                          {expectedSalaryRanges.length === 0 && (
                            <span className="text-sm text-slate-400 font-medium py-1.5">لم يتم إضافة أي نطاقات بعد...</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={salaryRangeInput}
                            onChange={(e) => setSalaryRangeInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (salaryRangeInput.trim() && !expectedSalaryRanges.includes(salaryRangeInput.trim())) {
                                  setExpectedSalaryRanges(prev => [...prev, salaryRangeInput.trim()]);
                                  setSalaryRangeInput('');
                                }
                              }
                            }}
                            placeholder="مثال: 4000 - 6000 ريال"
                            className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:border-primary outline-none text-sm transition-all"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              if (salaryRangeInput.trim() && !expectedSalaryRanges.includes(salaryRangeInput.trim())) {
                                setExpectedSalaryRanges(prev => [...prev, salaryRangeInput.trim()]);
                                setSalaryRangeInput('');
                              }
                            }}
                            className="px-4 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                          >
                            إضافة
                          </button>
                        </div>
                      </div>
                    )}
                  </div>`;

// We have 2 instances to replace
const oldUI1Regex = /<div className="relative mt-5">[\s\S]*?<label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 block">الراتب المتوقع للمتقدم<\/label>[\s\S]*?<div className="flex flex-col gap-3">[\s\S]*?<\/div>\s*<\/div>/;

// There is also an old remnant at line 3802
const oldUIRemnant = /<div className="relative mt-3 flex items-center">\s*<label className="relative inline-flex items-center cursor-pointer select-none">\s*<input type="checkbox" className="sr-only peer" checked=\{askExpectedSalary\} onChange=\{\(e\) => setAskExpectedSalary\(e\.target\.checked\)\} \/>[\s\S]*?<\/label>\s*<\/div>/;

// Also I'll ensure I target the exact HTML structures. I'll read and replace.
let count1 = 0;
content = content.replace(oldUI1Regex, () => { count1++; return newUI; });
content = content.replace(oldUIRemnant, () => { count1++; return newUI; });

// Wait, I should also replace the second instance of oldUI1Regex
content = content.replace(oldUI1Regex, () => { count1++; return newUI; });

// Ensure we import ChevronDown and X if not imported
if (!content.includes('ChevronDown')) {
  content = content.replace('import { ', 'import { ChevronDown, X, ');
} else if (!content.includes('X,')) {
  content = content.replace('ChevronDown', 'ChevronDown, X');
}

fs.writeFileSync('src/components/CreateJob.tsx', content);
console.log('CreateJob.tsx patched. Replaced UI blocks:', count1);
