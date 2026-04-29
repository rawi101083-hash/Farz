const fs = require('fs');
const path = './src/App.tsx';
let txt = fs.readFileSync(path, 'utf8');

// 1. Update Job interface
txt = txt.replace(
  /titles\?: string\[\];\s*companyLogo\?: string;\s*\}/,
  `titles?: string[];
  companyLogo?: string;
  directUpload?: boolean;
  requireVoiceInterview?: boolean;
}`
);

// 2. Add 'directUpload' state in CreateJob
txt = txt.replace(
  /const \[isVoiceEnabled, setIsVoiceEnabled\] = useState\(true\);/,
  `const [isVoiceEnabled, setIsVoiceEnabled] = useState(initialData?.requireVoiceInterview ?? true);
  const [directUpload, setDirectUpload] = useState(initialData?.directUpload || false);`
);

// Include them in baseJobData
txt = txt.replace(
  /requiredAttachments,\s*customAttachments,\s*\n*\s*\};\s*try \{/m,
  `requiredAttachments,
        customAttachments,
        directUpload,
        requireVoiceInterview: isVoiceEnabled,
      };
    try {`
);

// 3. Expose the settings UI in CreateJob right above the save buttons block
const uiRegex = /<div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">/;
txt = txt.replace(uiRegex, `
        {/* إعدادات متقدمة للرابط */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-8">
          <h2 className="text-xl font-bold mb-6 text-navy dark:text-white flex items-center gap-3">
            <Settings size={22} className="text-primary" />
            إعدادات متقدمة للرابط
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-6">
              <div>
                <h4 className="font-bold text-navy dark:text-white text-lg">تخطي صفحة الوصف الوظيفي (Direct Upload)</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">توجيه المتقدمين مباشرة إلى صفحة رفع السيرة الذاتية وتعبئة البيانات.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={directUpload} onChange={(e) => setDirectUpload(e.target.checked)} />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-navy dark:text-white text-lg">تفعيل المقابلة الصوتية (AI Voice Interview)</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">تفعيل أو إيقاف توجيه المرشح للمقابلة الصوتية بالذكاء الاصطناعي.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isVoiceEnabled} onChange={(e) => setIsVoiceEnabled(e.target.checked)} />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">`
);


// 4. Update routing to skip landing page if directUpload
// In <ManageJob /> preview:
// onPreview={() => setStep("publicJob")}
txt = txt.replace(
  /onPreview=\{\(\) => setStep\("publicJob"\)\}/g,
  `onPreview={() => setStep(selectedJob?.directUpload ? "form" : "publicJob")}`
);

// PreviewModal is not explicitly navigating to "publicJob" via step, but rendering ApplicantForm directly or PublicJobPage.
// Wait, `PreviewModal` renders `ApplicantForm` directly!
// But wait, what if I modify `setStep("publicJob")` in App when job modal is clicked?
// Let's also check `Dashboard` job cards' copy link preview. The mock URL is generic.


// 5. Update ApplicantForm to handle skip-voice logic and Multi-Job Selector!
// Find `const handleNextStep`
const handleNextStepRegex = /const handleNextStep = \(e: React\.FormEvent<HTMLFormElement>\) => \{\s*e\.preventDefault\(\);\s*if \(isCampaign && !selectedRoleId\) \{\s*alert\("يرجى اختيار المسمى الوظيفي المطلوب"\);\s*return;\s*\}\s*setFormStep\("audio"\);\s*\};/;

txt = txt.replace(handleNextStepRegex, `const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCampaign && !selectedRoleId && job?.directUpload) {
      alert("يرجى اختيار المسمى الوظيفي المطلوب");
      return;
    } else if (isCampaign && !selectedRoleId && !job?.directUpload) {
      // If we didn't skip landing, they should have selected role in landing!
      // Provide fallback safety just in case
      if (!selectedRoleId && job?.roles && job.roles.length > 0) {
        alert("لم يتم تحديد التخصص الوظيفي بشكل صحيح.");
        return;
      }
    }
    
    // Check if voice interview is disabled!
    if (job?.requireVoiceInterview === false) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setFormStep('processing' as any); // Jump ahead or trigger submit
        onSubmit();
      }, 1500);
      return;
    }
    
    setFormStep("audio");
  };`
);


// 6. Inject the Multi-Job Dropdown
// Look for `<h2 className="text-2xl font-bold mb-6 text-navy dark:text-white">البيانات الأساسية</h2>`
// Wait, in my previous view it was `<h2 className="text-2xl font-bold mb-6 text-navy dark:text-white">البيانات الشخصية</h2>` or something.
// Let's do a replace that anchors onto the `fullName` input field container.
const fullNameInputRegex = /(<div className="col-span-1 md:col-span-2[^>]*>\s*<label[^>]*>[\s\S]*?الاسم الكامل)/;
txt = txt.replace(fullNameInputRegex, `
              {job?.recordType === "campaign" && job?.directUpload && job?.roles && job.roles.length > 0 && (
                <div className="col-span-1 md:col-span-2 mb-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    المسمى الوظيفي المطلوب <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={selectedRoleId || ""}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-5 py-4 rounded-xl text-navy dark:text-white font-medium focus:ring-4 outline-none transition-all focus:border-primary focus:ring-primary/20"
                  >
                    <option value="" disabled>الرجاء اختيار المسمى الوظيفي...</option>
                    {job.roles.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                </div>
              )}
              $1`
);


fs.writeFileSync(path, txt, 'utf8');
console.log('Script updated');
