const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Replace the entire useEffect block for auto save.
const useEffectRegex = /useEffect\(\(\) => \{\s*if \(\!onAutoSaveDraft\) return;[\s\S]*?\}, \[\s*adType.*?\]\);/g;

const manualSaveBlock = `
  const handleSaveAsDraft = () => {
    if (!roleTitle.trim() && !campaignTitle.trim() && company === "شركة التوظيف الذكي") {
      alert("يرجى إدخال بعض البيانات للحفظ كمسودة.");
      return;
    }

    const finalRoles = adType === "single"
        ? [{
            id: editingRoleId || Math.random().toString(36).substr(2, 9),
            title: roleTitle.trim() || "شاغر جديد",
            description: roleDesc.trim(),
            aiInstructions,
            skills: selectedSkills,
            languages: selectedLanguages,
            customQuestions,
            requiredAttachments,
            customAttachments,
            location,
            type,
            experience,
            qualification,
            salaryMin,
            salaryMax,
            isSalaryHidden,
            knockoutQuestions,
            directUpload,
            requireVoiceInterview: isVoiceEnabled,
            voiceInterviewTemplate,
            voiceInterviewQuestions,
            photoRequirement,
          }]
        : roles.length > 0 ? roles : [];

    const mainTitle = adType === "single" ? roleTitle : campaignTitle;
    const mainDesc = adType === "single" ? roleDesc : campaignDescription;

    const draftData = {
      recordType: adType === "single" && createJobType === "quick_link" ? "quick_link" : adType,
      campaignTitle: enableWelcomeUI ? campaignTitle : undefined,
      campaignDescription: enableWelcomeUI ? campaignDescription : undefined,
      roles: finalRoles,
      company,
      companyLogo: companyLogo || undefined,
      type,
      location,
      experience,
      qualification,
      salaryMin,
      salaryMax,
      isSalaryHidden,
      description: mainDesc,
      title: mainTitle || "مسودة غير مسماة",
      aiInstructions,
      skills: selectedSkills,
      languages: selectedLanguages,
      customQuestions,
      requiredAttachments,
      customAttachments,
      directUpload,
      requireVoiceInterview: createJobType === "single" ? isVoiceEnabled : false,
      voiceInterviewTemplate: createJobType === "single" ? voiceInterviewTemplate : undefined,
      voiceInterviewQuestions: createJobType === "single" ? voiceInterviewQuestions : undefined,
      photoRequirement: createJobType === "single" ? photoRequirement : undefined,
      portfolioRequirement,
      startDate: startDate || undefined,
      endDate: isOpenEnded ? undefined : (endDate || undefined),
    };

    if (onAutoSaveDraft) {
      const draftId = onAutoSaveDraft({...draftData, status: "مسودة"}, currentDraftId);
      if (draftId && typeof onBack === "function") {
         alert("تم حفظ المسودة بنجاح");
         onBack();
      }
    } else if (onSubmit) {
       onSubmit({...draftData, status: "مسودة"}, currentDraftId || undefined);
       alert("تم حفظ المسودة بنجاح");
       if (typeof onBack === "function") onBack();
    }
  };
`;
code = code.replace(useEffectRegex, manualSaveBlock);

// 2. Add the Unsaved Changes Modal to the UI
const confirmModalRegex = /\{showConfirmModal && \([\s\S]*?\}\)[\s]*<\/div>[\s]*\)}[\s]*<\/AnimatePresence>/;

const unsavedModalBlock = `
        {showUnsavedModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-black text-navy dark:text-white text-center mb-2">
                تغييرات غير محفوظة!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium leading-relaxed">
                لقد قمت بإجراء تغييرات. إذا غادرت الآن، سيتم فقدان جميع البيانات التي أدخلتها.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setShowUnsavedModal(false)}
                  className="w-full px-4 py-3.5 rounded-xl font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-600"
                >
                  البقاء في الصفحة
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (typeof onBack === "function") onBack();
                  }}
                  className="w-full px-4 py-3.5 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  مغادرة وتجاهل التغييرات
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
`;
code = code.replace(/<\/AnimatePresence>/, unsavedModalBlock);


// 3. Make the buttons use handleBackAttempt and add "Save as Draft" below.
// First, update the Top button
code = code.replace(
  /onClick=\{\(e\) => \{\s*e\.preventDefault\(\);\s*onBack\(\);\s*\}\}/g,
  `onClick={(e) => { e.preventDefault(); handleBackAttempt(); }}`
);

// Next, add the Save as Draft button at the very bottom inline buttons block
code = code.replace(
  /<button\s*type="button"\s*onClick=\{\(\) => setIsLivePreview\(true\)\}\s*className="w-full md:w-auto px-8 bg-white dark:bg-slate-800 border-2 border-primary text-primary py-4 rounded-xl text-lg font-bold hover:bg-primary\/5 transition-all flex items-center justify-center gap-2"\s*>\s*<Eye size=\{20\} \/> معاينة الإعلان حياً\s*<\/button>/,
  `<button
                type="button"
                onClick={handleSaveAsDraft}
                className="w-full md:w-auto bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all items-center"
              >
                حفظ كمسودة
              </button>
              <button
                type="button"
                onClick={() => setIsLivePreview(true)}
                className="w-full md:w-auto px-8 bg-white dark:bg-slate-800 border-2 border-primary text-primary py-4 rounded-xl text-lg font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
              >
                <Eye size={20} /> معاينة الإعلان حياً
              </button>`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated state management and save draft logic!");
