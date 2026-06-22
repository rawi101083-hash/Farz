const fs = require('fs');

const path = 'src/components/CreateJob.tsx';
let code = fs.readFileSync(path, 'utf8');

// Use robust splitting that ignores newline characters
const splitAt = (str, delimiter) => {
    const idx = str.indexOf(delimiter);
    if (idx === -1) {
        console.error("COULD NOT FIND: " + delimiter);
        process.exit(1);
    }
    return [str.substring(0, idx + delimiter.length), str.substring(idx + delimiter.length)];
};

const formStartDelimiter = 'id="createJobForm" onSubmit={handleSubmit}>';
const rolesCardDelimiter = '{showRoleForm && (';
const aiSettingsDelimiter = '<div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20';
const submitBtnDelimiter = '<button type="submit"';

let [part1, rest1] = splitAt(code, formStartDelimiter);
let [part2, rest2] = splitAt(rest1, rolesCardDelimiter);
let [part3, rest3] = splitAt(rest2, aiSettingsDelimiter);
// We don't want the exact text included in part3, so we split *before* it.
// Actually `splitAt` includes the delimiter in the left part.
// So part3 ends WITH `aiSettingsDelimiter`. But we want aiSettingsDelimiter to be inside Step 3!
// Let's rewrite splitAt to NOT include the delimiter in the left part, or just handle it.

const splitBefore = (str, delimiter) => {
    const idx = str.indexOf(delimiter);
    if (idx === -1) {
        console.error("COULD NOT FIND: " + delimiter.substring(0, 40));
        process.exit(1);
    }
    return [str.substring(0, idx), str.substring(idx)];
};

[part1, rest1] = splitAt(code, formStartDelimiter);
[part2, rest2] = splitBefore(rest1, rolesCardDelimiter);
[part3, rest3] = splitBefore(rest2, aiSettingsDelimiter);
[part4, rest4] = splitBefore(rest3, submitBtnDelimiter);

const newStepperUI = `
            {/* --- STEPPER UI START --- */}
            {adType !== "campaign" && (
            <div className="mb-12 w-full max-w-3xl mx-auto px-4 mt-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-slate-200 dark:bg-slate-700 z-0 rounded-full transform -translate-y-1/2 shadow-inner" />
                <div className="absolute top-1/2 right-8 h-1.5 bg-gradient-to-l from-primary via-emerald-400 to-emerald-500 z-0 rounded-full transition-all duration-700 transform -translate-y-1/2" style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }} />
                
                <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => setCurrentStep(1)}>
                  <div className={\`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 \${currentStep === 1 ? 'bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 border-white/50' : currentStep > 1 ? 'bg-primary text-white border-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}\`}>
                    {currentStep > 1 ? <CheckCircle size={24} className="animate-in zoom-in" /> : "1"}
                  </div>
                  <span className={\`text-sm font-black mt-1 transition-colors \${currentStep === 1 ? 'text-primary drop-shadow-sm' : currentStep > 1 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}\`}>المعلومات الأساسية</span>
                </div>

                <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => { if (currentStep >= 1) setCurrentStep(2) }}>
                  <div className={\`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 \${currentStep === 2 ? 'bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 border-white/50' : currentStep > 2 ? 'bg-primary text-white border-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}\`}>
                    {currentStep > 2 ? <CheckCircle size={24} className="animate-in zoom-in" /> : "2"}
                  </div>
                  <span className={\`text-sm font-black mt-1 transition-colors \${currentStep === 2 ? 'text-primary drop-shadow-sm' : currentStep > 2 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}\`}>متطلبات التقديم</span>
                </div>

                <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => { if (currentStep >= 2) setCurrentStep(3) }}>
                  <div className={\`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 \${currentStep === 3 ? 'bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 border-white/50' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}\`}>
                    3
                  </div>
                  <span className={\`text-sm font-black mt-1 transition-colors \${currentStep === 3 ? 'text-primary drop-shadow-sm' : 'text-slate-400'}\`}>إعدادات الفرز</span>
                </div>
              </div>
            </div>
            )}
            {/* --- STEPPER UI END --- */}
            <div className={currentStep === 1 ? "block space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
`;

const step1Nav = `
              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setCurrentStep(2)} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">التالي <ArrowLeft size={18} className="rotate-180"/></button>
              </div>
            </div>
            <div className={currentStep === 2 ? "block space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
`;

const step2Nav = `
              <div className="mt-8 flex justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setCurrentStep(1)} className="bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><ArrowLeft size={18}/> السابق</button>
                <button type="button" onClick={() => setCurrentStep(3)} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">التالي <ArrowLeft size={18} className="rotate-180"/></button>
              </div>
            </div>
            <div className={currentStep === 3 ? "block space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
`;

const step3Nav = `
              <div className="mt-8 flex justify-start gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mb-8">
                <button type="button" onClick={() => setCurrentStep(2)} className="bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><ArrowLeft size={18}/> السابق</button>
              </div>
            </div>
`;

let finalCode = part1 + newStepperUI + part2 + step1Nav + part3 + step2Nav + part4 + step3Nav + rest4;

fs.writeFileSync(path, finalCode);
console.log("Successfully rebuilt layout safely!");
