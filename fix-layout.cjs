const fs = require('fs');

const path = 'C:/Users/rawi1/Downloads/التوظيف-الذكي-_-smart-recruitment/src/components/CreateJob.tsx';
let code = fs.readFileSync(path, 'utf8');

const misplacedNav = `
                      <div className="mt-8 flex justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onClick={() => setCurrentStep(1)} className="bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><ArrowLeft size={18}/> السابق</button>
                        <button type="button" onClick={() => setCurrentStep(3)} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">التالي <ArrowLeft size={18} className="rotate-180"/></button>
                      </div>
                    </div>

                    <div className={currentStep === 3 ? "block space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>`;

code = code.replace(misplacedNav, "");

const aiStartStr = '<div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-[32px] border-2 border-indigo-100 dark:border-indigo-800/30 shadow-inner mt-8 mb-8">';
const aiStartIdx = code.indexOf(aiStartStr);

const photoTitleIdx = code.indexOf('إعدادات التقديم الإضافية');
const step2OpenIdx = code.lastIndexOf('<div className={currentStep === 2', photoTitleIdx);
const step3OpenIdx = code.indexOf('<div className={currentStep === 3', photoTitleIdx);

const aiSettingsBlock = code.substring(aiStartIdx, step2OpenIdx);
const photoSettingsBlock = code.substring(step2OpenIdx, step3OpenIdx);

console.log("AI Settings Length:", aiSettingsBlock.length);
console.log("Photo Settings Length:", photoSettingsBlock.length);

if (aiSettingsBlock.length < 1000 || photoSettingsBlock.length < 1000) {
   console.log("Extraction failed!");
   process.exit(1);
}

const part1 = code.substring(0, aiStartIdx);
const part3 = code.substring(step3OpenIdx + '<div className={currentStep === 3 ? "block space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>'.length);

// Inside part1, we are inside `createJobType !== "quick_link" && (<>` (Step 2).
// So we append the Photo settings directly (stripping the redundant step 2 wrapper).
let cleanedPhotoBlock = photoSettingsBlock.replace('<div className={currentStep === 2 ? "block space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>\n', '');
// Wait, the string in the file has a newline and spaces. I will just replace the exact string.
cleanedPhotoBlock = cleanedPhotoBlock.replace('<div className={currentStep === 2 ? "block space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>', '');
// Note: we still need to close the `div` that this opened? 
// No! The Step 2 wrapper closed at step3OpenIdx in the original broken code? Wait.
// The broken code had:
// <div className={currentStep === 2...}>
//    Photo & Voice...
// </div> </div>
// So if I strip the opening wrapper, I must strip one closing `</div>`.
cleanedPhotoBlock = cleanedPhotoBlock.trim();
if (cleanedPhotoBlock.endsWith('</div>\n                    </div>')) {
    cleanedPhotoBlock = cleanedPhotoBlock.substring(0, cleanedPhotoBlock.lastIndexOf('</div>'));
}

const closingTags = `
                  </>
                )}
`;

const openTags = `
                {createJobType !== "quick_link" && (
                  <>
`;

const rebuilt = 
  part1 + 
  cleanedPhotoBlock + 
  "\n" +
  closingTags +
  "\n" +
  misplacedNav + 
  "\n" +
  openTags + 
  aiSettingsBlock + 
  part3;

fs.writeFileSync(path + '.test.tsx', rebuilt);
console.log("Wrote to test file.");
