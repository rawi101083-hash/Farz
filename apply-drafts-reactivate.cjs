const fs = require('fs');

async function fixApp() {
  const filePath = 'src/App.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add handleReactivateJob in App.tsx
  const deactivateRegex = /(const handleDeactivateJob = \(job: Job\) => \{[\s\S]*?setJobs\(updatedJobs\);\n\s*\};)/;
  if (content.match(deactivateRegex) && !content.includes('const handleReactivateJob')) {
    content = content.replace(deactivateRegex, `$1\n  const handleReactivateJob = (job: Job) => {
    const updatedJobs = jobs.map((j) =>
      j.id === job.id ? { ...j, status: "نشط" as const, createdAt: new Date().toISOString().split("T")[0] } : j,
    );
    setJobs(updatedJobs);
  };\n`);
  }

  // 1.5 Add onReactivateJob to Dashboard Props
  const dashboardPropsRegex = /(onDeactivateJob: \(job: Job\) => void;)/;
  if (!content.includes('onReactivateJob: (job: Job) => void;')) {
    content = content.replace(dashboardPropsRegex, `$1\n  onReactivateJob?: (job: Job) => void;`);
  }
  
  const dashboardDestructRegex = /(onDeactivateJob,)/;
  if (!content.includes('onReactivateJob,')) {
    content = content.replace(dashboardDestructRegex, `$1\n  onReactivateJob,`);
  }

  // 2. Pass handleReactivateJob to Dashboard
  const passToDashboardRegex = /(onDeactivateJob=\{handleDeactivateJob\})/;
  if (!content.includes('onReactivateJob={handleReactivateJob}')) {
    content = content.replace(passToDashboardRegex, `$1\n                onReactivateJob={handleReactivateJob}`);
  }

  // 3. Add onReactivate to ActiveJobs props
  const activeJobsPropsDestructRegex = /(onDeactivate,\n\s*onPreview,)/;
  if (!content.includes('onReactivate,')) {
    content = content.replace(activeJobsPropsDestructRegex, `$1\n  onReactivate,`);
  }

  const activeJobsPropsTypeRegex = /(onDeactivate\?: \(job: Job\) => void;\n\s*onPreview\?: \(job: Job\) => void;)/;
  if (!content.includes('onReactivate?: (job: Job) => void;')) {
    content = content.replace(activeJobsPropsTypeRegex, `$1\n  onReactivate?: (job: Job) => void;`);
  }

  // 4. Pass down onReactivate from Dashboard to ActiveJobs
  const passToActiveJobsRegex = /(onDeactivate=\{subTab === "active" \? onDeactivateJob : undefined\})/;
  if (!content.includes('onReactivate={subTab === "inactive" ? onReactivateJob : undefined}')) {
    content = content.replace(passToActiveJobsRegex, `$1\n              onReactivate={subTab === "inactive" ? onReactivateJob : undefined}`);
  }

  // 5. Add button in ActiveJobs menu
  const menuButtonsRegex = /(<Ban size=\{16\} \/> نقل إلى غير النشطة {" "}\n\s*<\/button>\n\s*\)} {" "})/;
  if (content.match(menuButtonsRegex) && !content.includes('تنشيط الإعلان')) {
    content = content.replace(menuButtonsRegex, `$1\n                      {expired && onReactivate && (
                        <button
                          onClick={() => {
                            onReactivate(job);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-right px-4 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center gap-3 border-t border-slate-50 dark:border-slate-700 mt-1"
                        >
                          {" "}
                          <RotateCcw size={16} /> تنشيط الإعلان{" "}
                        </button>
                      )}{" "}`);
  }

  // 6. Add auto-draft saving logic to CreateJob inside App.tsx
  // Since `CreateJob` passes `handleCreateJob` natively, which creates a draft, we can just hook a `useEffect` inside CreateJob
  // and call onSubmit with the partial data. But onSubmit sets it to "jobSuccess" and closes modal if isComplete is true!
  // Oh wait, `handleCreateJob` checks `isComplete` and closes the modal if true. We don't want to close the modal!
  // Instead, we will write it to `localStorage` continuously and if they go to 'المسودات' tab, they won't see it until they reopen 'CreateJob', 
  // BUT the user asked "it must go to the drafts automatically". 
  // We can pass `onAutoSaveDraft` prop to `CreateJob` and implement it in App.tsx.

  // 6.a Implement handleAutoSave in App.tsx
  const handleCreateJobRegex = /(const handleCreateJob = \([\s\S]*?\n\s*\};)/;
  if (!content.includes('const handleAutoSaveDraft =')) {
    content = content.replace(handleCreateJobRegex, `$1

  const handleAutoSaveDraft = (
    jobData: Omit<Job, "id" | "applicants" | "status" | "createdAt" | "draftId">,
    existingDraftId: string | null
  ) => {
    const jobIdToUse = existingDraftId || Math.random().toString(36).substr(2, 9);
    
    // Check if the same draft exists
    const draftExists = jobs.some(j => j.id === existingDraftId);
    
    if (draftExists && existingDraftId) {
      setJobs(prevJobs => prevJobs.map(j => j.id === existingDraftId ? { ...j, ...jobData, status: "مسودة" } : j));
    } else {
      const newJob: Job = {
        ...jobData,
        id: jobIdToUse,
        applicants: 0,
        status: "مسودة",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setJobs(prevJobs => [newJob, ...prevJobs]);
    }
    return jobIdToUse;
  };\n`);
  }

  // 6.b Pass `onAutoSaveDraft` to `<CreateJob>`
  const createJobUsageRegex = /(onSubmit=\{handleCreateJob\})/;
  if (!content.includes('onAutoSaveDraft={handleAutoSaveDraft}')) {
    content = content.replace(createJobUsageRegex, `$1\n                onAutoSaveDraft={handleAutoSaveDraft}`);
  }

  // 6.c Add `onAutoSaveDraft` to `CreateJob` component signature
  const createJobSignatureRegex = /(onSubmit: \([\s\S]*?\) => string \| null \| undefined;\n\s*userProfile\?: any;)/;
  if (!content.includes('onAutoSaveDraft?: (job: Omit<Job, "id" | "applicants" | "status" | "createdAt" | "draftId">, ds?: string | null) => string;')) {
    content = content.replace(createJobSignatureRegex, `$1\n  onAutoSaveDraft?: (job: Omit<Job, "id" | "applicants" | "status" | "createdAt" | "draftId">, ds?: string | null) => string;`);
  }
  
  const createJobDestructRegex = /(onSubmit,\n\s*userProfile,\n\s*onGoToSettings,)/;
  if (!content.includes('onAutoSaveDraft,')) {
    content = content.replace(createJobDestructRegex, `onSubmit,\n  onAutoSaveDraft,\n  userProfile,\n  onGoToSettings,`);
  }

  // 6.d Add `useEffect` in `CreateJob`
  const createJobUseEffectRegex = /(const handleSubmit = \([\s\S]*?\};)/;
  if (!content.includes('// Auto draft saving mechanism')) {
    content = content.replace(createJobUseEffectRegex, `// Auto draft saving mechanism
  useEffect(() => {
    if (!onAutoSaveDraft) return;
    
    const debounceTimer = setTimeout(() => {
      // Avoid saving identical or completely empty forms
      if (!roleTitle.trim() && !campaignTitle.trim() && company === "شركة التوظيف الذكي") return;

      const finalRoles =
        adType === "single"
          ? [
              {
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
              },
            ]
          : roles.length > 0 ? roles : [];

      if (finalRoles.length === 0) return;

      const mainTitle = adType === "single" ? roleTitle : campaignTitle;
      const mainDesc = adType === "single" ? roleDesc : campaignDescription;

      const draftData: Omit<Job, "id" | "applicants" | "status" | "createdAt" | "draftId"> = {
        recordType: adType,
        campaignTitle: adType === "single" ? undefined : campaignTitle,
        campaignDescription: adType === "single" ? undefined : campaignDescription,
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
        title: mainTitle,
        aiInstructions,
        skills: selectedSkills,
        languages: selectedLanguages,
        customQuestions,
        requiredAttachments,
        customAttachments,
        directUpload,
        requireVoiceInterview: isVoiceEnabled,
        photoRequirement,
        portfolioRequirement,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const newDraftId = onAutoSaveDraft(draftData, currentDraftId);
      if (newDraftId && newDraftId !== currentDraftId) {
        setCurrentDraftId(newDraftId);
      }
    }, 2000);

    return () => clearTimeout(debounceTimer);
  }, [
    adType, campaignTitle, campaignDescription, company, type, location, experience, qualification,
    salaryMin, salaryMax, isSalaryHidden, roleTitle, roleDesc, aiInstructions, selectedSkills,
    selectedLanguages, customQuestions, requiredAttachments, customAttachments, roles, 
    directUpload, isVoiceEnabled, photoRequirement, portfolioRequirement, startDate, endDate,
    companyLogo
  ]);

  $1`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Fixes applied successfully.");
}

fixApp().catch(console.error);
