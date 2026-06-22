const fs = require('fs');

let code = fs.readFileSync('C:/Users/rawi1/Downloads/التوظيف-الذكي-_-smart-recruitment/src/components/CreateJob.tsx', 'utf8');

// 1. Insert Stepper UI at the start of the form
const formStartRegex = /(<form className="space-y-6" id="createJobForm" onSubmit={handleSubmit}>\s*)/;
const stepperUI = `
            {/* --- STEPPER UI START --- */}
            <div className="mb-8 w-full max-w-3xl mx-auto px-4 mt-4">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -z-10 rounded-full" />
                <div className="absolute top-1/2 right-0 h-1 bg-primary -z-10 rounded-full transition-all duration-500" style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }} />
                
                <div className="flex flex-col items-center gap-2 relative z-10 cursor-pointer" onClick={() => setCurrentStep(1)}>
                  <div className={\`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 \${currentStep >= 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'}\`}>
                    {currentStep > 1 ? <CheckCircle size={24} /> : "1"}
                  </div>
                  <span className={\`text-sm font-bold \${currentStep >= 1 ? 'text-primary' : 'text-slate-500'}\`}>المعلومات الأساسية</span>
                </div>

                <div className="flex flex-col items-center gap-2 relative z-10 cursor-pointer" onClick={() => { if (currentStep >= 1) setCurrentStep(2) }}>
                  <div className={\`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 \${currentStep >= 2 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'}\`}>
                    {currentStep > 2 ? <CheckCircle size={24} /> : "2"}
                  </div>
                  <span className={\`text-sm font-bold \${currentStep >= 2 ? 'text-primary' : 'text-slate-500'}\`}>متطلبات الوظيفة</span>
                </div>

                <div className="flex flex-col items-center gap-2 relative z-10 cursor-pointer" onClick={() => { if (currentStep >= 2) setCurrentStep(3) }}>
                  <div className={\`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 \${currentStep >= 3 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'}\`}>
                    3
                  </div>
                  <span className={\`text-sm font-bold \${currentStep >= 3 ? 'text-primary' : 'text-slate-500'}\`}>إعدادات الفرز</span>
                </div>
              </div>
            </div>
            {/* --- STEPPER UI END --- */}
            
`;
code = code.replace(formStartRegex, "$1" + stepperUI);

// Wrap Card 1 (Company Info & Roles List) in Step 1
code = code.replace('{/* Card 1: Basic Info */}', '<div className={currentStep === 1 ? "block space-y-6" : "hidden"}>\n{/* Card 1: Basic Info */}');
code = code.replace('{showRoleForm && (', '</div>\n\n            {showRoleForm && (');

// Now inside showRoleForm...
// It starts with title and generic details. We wrap the first part of showRoleForm in Step 1.
code = code.replace(
  '<div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6">',
  '<div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6">\n              <div className={currentStep === 1 ? "block space-y-6" : "hidden"}>'
);

// End Step 1 before المهارات المستهدفة and start Step 2
code = code.replace(
  '{createJobType !== "quick_link" && (\n                  <>\n                    <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700/60 mt-8">\n                      {" "}\n                      <div className="flex items-center justify-between mb-2">\n                        <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">\n                          المهارات المستهدفة',
  '                    {/* Next Button Step 1 */}\n                    <div className="flex justify-end pt-6 mt-6 border-t border-slate-200 dark:border-slate-700"><button type="button" onClick={() => setCurrentStep(2)} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">التالي <ArrowLeft size={18} /></button></div>\n                  </div>\n\n                  <div className={currentStep === 2 ? "block space-y-6" : "hidden"}>\n{createJobType !== "quick_link" && (\n                  <>\n                    <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700/60 mt-8">\n                      {" "}\n                      <div className="flex items-center justify-between mb-2">\n                        <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">\n                          المهارات المستهدفة'
);

// End Step 2 before AI Override and start Step 3
code = code.replace(
  '{/* AI Override Fields Toggle */}',
  '                    {/* Nav Buttons Step 2 */}\n                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">\n                      <button type="button" onClick={() => setCurrentStep(1)} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">السابق</button>\n                      <button type="button" onClick={() => setCurrentStep(3)} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">التالي <ArrowLeft size={18} /></button>\n                    </div>\n                  </div>\n\n                  <div className={currentStep === 3 ? "block space-y-6" : "hidden"}>\n                      {/* AI Override Fields Toggle */}'
);

// Form Submit buttons in Step 3 need the Back button too.
// The form submit buttons start around `if (adType === "campaign") ... handleSaveRole`
// We will locate `onClick={(e) => { e.preventDefault(); handleBackAttempt(); }}` which is the cancel button
code = code.replace(
  '<div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center gap-4 justify-between">',
  '<div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center gap-4 justify-between">\n                <button type="button" onClick={() => setCurrentStep(2)} className="w-full md:w-auto bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl text-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">السابق</button>'
);

// Close Step 3
code = code.replace(
  '              </div>\n            )}\n\n            <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center gap-4 justify-between">',
  '                  </div>{/* Close Step 3 */}\n              </div>\n            )}\n\n            <div className={currentStep === 3 ? "block pt-8 mt-8 border-t border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center gap-4 justify-between" : "hidden"}>'
);


fs.writeFileSync('C:/Users/rawi1/Downloads/التوظيف-الذكي-_-smart-recruitment/src/components/CreateJob.tsx', code);
console.log("Refactored!");
