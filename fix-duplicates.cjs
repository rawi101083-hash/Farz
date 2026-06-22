const fs = require('fs');
let code = fs.readFileSync('src/components/CreateJob.tsx', 'utf8');

// 1. Fix duplicate step 1 wrappers
const badString = '<div className={currentStep === 1 ? "block space-y-6" : "hidden"}>\n<div className={currentStep === 1 ? "block space-y-6" : "hidden"}>';
const goodString = '<div className={currentStep === 1 ? "block space-y-6" : "hidden"}>';
while (code.includes(badString)) {
  code = code.replace(badString, goodString);
}
const badString2 = '<div className={currentStep === 1 ? "block space-y-6" : "hidden"}>\n              <div className={currentStep === 1 ? "block space-y-6" : "hidden"}>';
while (code.includes(badString2)) {
  code = code.replace(badString2, goodString);
}

// 2. Add 3D Stepper UI
const stepperStartStr = '{/* --- STEPPER UI START --- */}';
const stepperEndStr = '{/* --- STEPPER UI END --- */}';

const newStepperUI = `            {/* --- STEPPER UI START --- */}
            {adType !== "campaign" && (
            <div className="mb-12 w-full max-w-3xl mx-auto px-4 mt-8">
              <div className="flex items-center justify-between relative">
                {/* Connecting Lines */}
                <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-slate-200 dark:bg-slate-700 z-0 rounded-full transform -translate-y-1/2 shadow-inner" />
                <div className="absolute top-1/2 right-8 h-1.5 bg-gradient-to-l from-primary via-emerald-400 to-emerald-500 z-0 rounded-full transition-all duration-700 transform -translate-y-1/2" style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }} />
                
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => setCurrentStep(1)}>
                  <div className={\`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 \${currentStep === 1 ? 'bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 border-white/50' : currentStep > 1 ? 'bg-primary text-white border-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}\`}>
                    {currentStep > 1 ? <CheckCircle size={24} className="animate-in zoom-in" /> : "1"}
                  </div>
                  <span className={\`text-sm font-black mt-1 transition-colors \${currentStep === 1 ? 'text-primary drop-shadow-sm' : currentStep > 1 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}\`}>المعلومات الأساسية</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => { if (currentStep >= 1) setCurrentStep(2) }}>
                  <div className={\`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 \${currentStep === 2 ? 'bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 border-white/50' : currentStep > 2 ? 'bg-primary text-white border-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}\`}>
                    {currentStep > 2 ? <CheckCircle size={24} className="animate-in zoom-in" /> : "2"}
                  </div>
                  <span className={\`text-sm font-black mt-1 transition-colors \${currentStep === 2 ? 'text-primary drop-shadow-sm' : currentStep > 2 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}\`}>متطلبات التقديم</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => { if (currentStep >= 2) setCurrentStep(3) }}>
                  <div className={\`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 \${currentStep === 3 ? 'bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 border-white/50' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}\`}>
                    3
                  </div>
                  <span className={\`text-sm font-black mt-1 transition-colors \${currentStep === 3 ? 'text-primary drop-shadow-sm' : 'text-slate-400'}\`}>إعدادات الفرز</span>
                </div>
              </div>
            </div>
            )}
            {/* --- STEPPER UI END --- */}`;

const startIndex = code.indexOf(stepperStartStr);
const endIndex = code.indexOf(stepperEndStr) + stepperEndStr.length;

if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + newStepperUI + code.substring(endIndex);
}

fs.writeFileSync('src/components/CreateJob.tsx', code);
console.log('Fixed CreateJob duplicates and applied 3D Stepper');
