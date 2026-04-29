const fs = require('fs');
let content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');

const targetStr = `<div className="relative mt-5">
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
                    </div>`;

const replaceStr = `<div className="mt-5 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                        <Settings size={18} className="text-slate-400" />
                        <span className="text-sm font-bold">سؤال المتقدم عن الراتب</span>
                      </div>
                      <div className="relative min-w-[220px]">
                        <select
                          value={askExpectedSalary}
                          onChange={(e) => setAskExpectedSalary(e.target.value as any)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-bold appearance-none cursor-pointer text-slate-700 dark:text-slate-300"
                        >
                          <option value="hidden">عدم السؤال</option>
                          <option value="open">سؤال مفتوح (رقم)</option>
                          <option value="ranges">خيارات محددة</option>
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>`;

content = content.split(targetStr).join(replaceStr);
fs.writeFileSync('src/components/CreateJob.tsx', content);
console.log('Replaced all UI blocks.');
