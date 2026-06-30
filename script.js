const fs = require('fs');
const file = 'C:/Users/rawi1/Downloads/التوظيف-الذكي-_-smart-recruitment/src/components/CreateJob.tsx';
let content = fs.readFileSync(file, 'utf8');

const skipBoxTarget = \<div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 mt-2">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <h4 className="font-bold text-navy dark:text-white text-sm flex items-center gap-2">
                                    <Settings size={18} className="text-primary" />
                                    تخطي صفحة الوصف (إعداد عام)
                                  </h4>
                                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-2xl leading-relaxed">عند تفعيل هذا الخيار، سيتم توجيه المتقدمين مباشرة لصفحة التقديم ورفع السيرة الذاتية بدلاً من عرض تفاصيل الوظيفة.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                  <input type="checkbox" className="sr-only peer" checked={directUpload} onChange={(e) => setDirectUpload(e.target.checked)} />
                                  <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.3rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                                </label>
                              </div>
                            </div>\;

if(content.includes(skipBoxTarget)) {
    content = content.replace(skipBoxTarget, '');
    console.log('Removed standalone skip box.');
} else {
    console.log('Could not find standalone skip box target.');
}

const scheduleCardTarget = \<div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                                    <Calendar size={20} />
                                  </div>
                                  <h3 className="text-xl font-bold text-navy dark:text-white">التواريخ والجدولة</h3>
                                </div>
                              </div>\;

const scheduleCardReplacement = \<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                    <Calendar size={20} />
                                  </div>
                                  <h3 className="text-xl font-bold text-navy dark:text-white">التواريخ والجدولة</h3>
                                </div>
                                <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 p-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input type="checkbox" className="sr-only peer" checked={directUpload} onChange={(e) => setDirectUpload(e.target.checked)} />
                                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.3rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                                  </label>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-navy dark:text-white">تخطي صفحة الوظيفة</span>
                                    <span className="text-[10px] text-slate-500 font-medium">توجيه مباشر للتقديم</span>
                                  </div>
                                </div>
                              </div>\;

if(content.includes(scheduleCardTarget)) {
    content = content.replace(scheduleCardTarget, scheduleCardReplacement);
    console.log('Injected skip box into schedule card.');
} else {
    console.log('Could not find schedule card target.');
}

fs.writeFileSync(file, content);
console.log('DONE');
