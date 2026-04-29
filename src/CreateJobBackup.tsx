const CreateJob = ({
  createJobType = "single",
  initialData = null,
  onBack,
  onSubmit,
  onAutoSaveDraft,
  userProfile,
  onGoToSettings,
}: {
  createJobType?: "single" | "campaign" | "quick_link";
  initialData?: Job | null;
  onBack: () => void;
  onSubmit: (
    job: Omit<Job, "id" | "applicants" | "status" | "createdAt" | "draftId">,
    existingDraftId?: string
  ) => string | null | undefined;
  onAutoSaveDraft?: (job: Omit<Job, "id" | "applicants" | "status" | "createdAt" | "draftId">, ds?: string | null) => string;
  userProfile?: any;
  onGoToSettings?: () => void;
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const handleBackAttempt = () => {
    const hasChanges = () => {
      const safeBaseRole = initialData?.recordType === "single" ? initialData.roles?.[0] || initialData : null;
      if (roleTitle.trim() !== (safeBaseRole?.title || "")) return true;
      if (roleDesc.trim() !== (safeBaseRole?.description || "")) return true;
      if (aiInstructions.trim() !== (safeBaseRole?.aiInstructions || "")) return true;
      
      if (campaignTitle.trim() !== (initialData?.campaignTitle || "")) return true;
      if (campaignDescription.trim() !== (initialData?.campaignDescription || "")) return true;

      const defaultCompany = initialData?.company || "شركة التوظيف الذكي";
      if (company.trim() !== defaultCompany) return true;
      
      const defaultLocation = initialData?.location || "";
      if (location.trim() !== defaultLocation) return true;

      if (selectedSkills.length !== (safeBaseRole?.skills?.length || 0)) return true;
      if (selectedLanguages.length !== (safeBaseRole?.languages?.length || 0)) return true;
      if (customQuestions.length !== (safeBaseRole?.customQuestions?.length || 0)) return true;
      
      const initialRolesCount = initialData?.recordType === "campaign" && initialData.roles ? initialData.roles.length : 0;
      if (roles.length !== initialRolesCount) return true;

      return false;
    };

    if (hasChanges()) {
      setShowUnsavedModal(true);
    } else {
      if (typeof onBack === "function") onBack();
    }
  };
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(
    initialData?.requireVoiceInterview ?? true,
  );
  const [voiceInterviewTemplate, setVoiceInterviewTemplate] = useState<"general" | "sales" | "custom">(
    initialData?.voiceInterviewTemplate || "general"
  );
  const [voiceInterviewQuestions, setVoiceInterviewQuestions] = useState<string[]>(
    initialData?.voiceInterviewQuestions || ["", ""]
  );
  const [directUpload, setDirectUpload] = useState(
    initialData?.directUpload || false,
  );
  const [photoRequirement, setPhotoRequirement] = useState<"hidden" | "optional" | "required">(
    initialData?.photoRequirement || "hidden"
  );
  const [isLivePreview, setIsLivePreview] = useState(false);
  const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(false);
  const [isAttachmentsExpanded, setIsAttachmentsExpanded] = useState(false);

  // Campaign Meta
  const [campaignTitle, setCampaignTitle] = useState(
    initialData?.campaignTitle || "",
  );
  const [campaignDescription, setCampaignDescription] = useState(
    initialData?.campaignDescription || "",
  );
  const [adType, setAdType] = useState<"single" | "campaign">(createJobType === "campaign" || initialData?.recordType === "campaign" ? "campaign" : "single");

  const [enableWelcomeUI, setEnableWelcomeUI] = useState<boolean>(!!initialData?.campaignTitle);
  // Common
  const [company, setCompany] = useState(
    initialData?.company || "شركة التوظيف الذكي",
  );
  const [companyLogo, setCompanyLogo] = useState<string | null>(() => {
    if (initialData?.companyLogo && !initialData.companyLogo.startsWith("blob:")) return initialData.companyLogo;
    const saved = localStorage.getItem("savedCompanyLogo");
    if (saved && saved.startsWith("blob:")) {
      localStorage.removeItem("savedCompanyLogo");
      return null;
    }
    return saved || null;
  });
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(initialData?.status === "مسودة" ? initialData.id : null);
  // Profile Data Mock
  const [type, setType] = useState(initialData?.type || "دوام كامل");
  const [location, setLocation] = useState(initialData?.location || "");
  const [locations, setLocations] = useState<string[]>(
    initialData?.locations || (initialData?.location ? [initialData.location] : [])
  );
  const [experience, setExperience] = useState(initialData?.experience || "بدون خبرة");
  const [qualification, setQualification] = useState(initialData?.qualification || "ثانوي");
  const [salaryMin, setSalaryMin] = useState(initialData?.salaryMin || "");
  const [salaryMax, setSalaryMax] = useState(initialData?.salaryMax || "");
  const [isSalaryHidden, setIsSalaryHidden] = useState(initialData?.isSalaryHidden || false);
  const defaultStart = new Date().toISOString().slice(0, 16);
  const defaultEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  const [startDate, setStartDate] = useState(
    initialData?.startDate || defaultStart,
  );
  const [endDate, setEndDate] = useState(initialData?.endDate || defaultEnd);
  const [isOpenEnded, setIsOpenEnded] = useState(initialData ? !initialData.endDate : false);
  // Role Form
  const baseRole =
    initialData?.recordType === "single"
      ? initialData.roles?.[0] || initialData
      : null;
  const [roleTitle, setRoleTitle] = useState(baseRole?.title || "");
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleDesc, setRoleDesc] = useState(baseRole?.description || "");
  const [roleSummary, setRoleSummary] = useState(baseRole?.roleSummary || "");
  const [responsibilities, setResponsibilities] = useState(baseRole?.responsibilities || "");
  const [qualifications, setQualifications] = useState(baseRole?.qualifications || "");
  const [benefits, setBenefits] = useState(baseRole?.benefits || "");
  const [targetMajors, setTargetMajors] = useState<string[]>(
    baseRole?.targetMajors || initialData?.targetMajors || []
  );
  const [newMajorInput, setNewMajorInput] = useState("");
  const [aiInstructions, setAiInstructions] = useState(baseRole?.aiInstructions || "");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    baseRole?.skills || [],
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    baseRole?.languages || [],
  );
  const [customSkill, setCustomSkill] = useState("");
  const [customQuestions, setCustomQuestions] = useState<
    { text: string; type: string; options?: string[]; required?: boolean }[]
  >(baseRole?.customQuestions || []);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("نص قصير");
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>([]);
  const [newOptionInput, setNewOptionInput] = useState("");
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);

  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(() => {
    if (initialData && initialData.status === "مسودة") return false;
    return true;
  });

  useEffect(() => {
    if (localStorage.getItem("hasSeenAdvancedSettings") !== "true") {
      localStorage.setItem("hasSeenAdvancedSettings", "true");
    }
  }, []);

  const [knockoutQuestions, setKnockoutQuestions] = useState<
    { text: string; type: "yes_no" | "options"; options?: string[]; requiredAnswer: string }[]
  >(baseRole?.knockoutQuestions || []);
  const [isKnockoutExpanded, setIsKnockoutExpanded] = useState(true);
  const [newKqText, setNewKqText] = useState("");
  const [newKqType, setNewKqType] = useState<"yes_no" | "options">("yes_no");
  const [newKqOptions, setNewKqOptions] = useState<string[]>([]);
  const [newKqOptionInput, setNewKqOptionInput] = useState("");
  const [newKqRequiredAnswer, setNewKqRequiredAnswer] = useState("نعم");

  const [requiredAttachments, setRequiredAttachments] = useState<string[]>(
    baseRole?.requiredAttachments || ["سيرة ذاتية PDF"],
  );
  const [portfolioRequirement, setPortfolioRequirement] = useState<"required" | "optional">(
    baseRole?.portfolioRequirement || "optional"
  );
  const [customAttachments, setCustomAttachments] = useState<
    CustomAttachment[]
  >(baseRole?.customAttachments || []);
  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newAttachmentType, setNewAttachmentType] = useState<"file" | "link" | "image" | "video" | "document" | "mixed_file" | "">("");
  const [newAttachmentRequired, setNewAttachmentRequired] = useState(false);
  const [roles, setRoles] = useState<Role[]>(() => {
    if (initialData?.recordType === "campaign" && initialData.roles) {
      return initialData.roles.map((r) => ({
        ...r,
        id: Math.random().toString(36).substr(2, 9),
      }));
    }
    return [];
  });
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [roleToastMessage, setRoleToastMessage] = useState<string | null>(null);

  const handleSwitchToMultiple = () => {
    if (adType === "single" && (roleTitle.trim() || roleDesc.trim()) && roles.length === 0) {
      setRoles([
        {
          id: Math.random().toString(36).substr(2, 9),
          title: roleTitle || "شاغر غير مسمى",
          description: roleDesc,
          aiInstructions,
          type,
          location,
          experience,
          qualification,
          salaryMin,
          salaryMax,
          isSalaryHidden,
          knockoutQuestions,
          skills: selectedSkills,
          languages: selectedLanguages,
          requireVoiceInterview: isVoiceEnabled,
          voiceInterviewTemplate,
          voiceInterviewQuestions,
          photoRequirement,
          directUpload
        }
      ]);
      setRoleTitle("");
      setRoleDesc("");
      setAiInstructions("");
      setSelectedSkills([]);
      setSelectedLanguages([]);
      setKnockoutQuestions([]);
      setRoleToastMessage("تم تحويل بيانات الشاغر لتكون الدور الأول في الحملة");
      setTimeout(() => setRoleToastMessage(null), 3500);
    }
    setAdType("campaign");
  };

  const handleSwitchToSingle = () => {
    if (adType === "campaign" && roles.length > 0) {
      const firstRole = roles[0];
      setRoleTitle(firstRole.title === "شاغر غير مسمى" ? "" : firstRole.title);
      setRoleDesc(firstRole.description || "");
      if (firstRole.aiInstructions) setAiInstructions(firstRole.aiInstructions);
      if (firstRole.type) setType(firstRole.type);
      if (firstRole.location) setLocation(firstRole.location);
      if (firstRole.experience) setExperience(firstRole.experience);
      if (firstRole.qualification) setQualification(firstRole.qualification);
      if (firstRole.salaryMin) setSalaryMin(firstRole.salaryMin);
      if (firstRole.salaryMax) setSalaryMax(firstRole.salaryMax);
      if (firstRole.isSalaryHidden !== undefined) setIsSalaryHidden(firstRole.isSalaryHidden);
      if (firstRole.knockoutQuestions) setKnockoutQuestions(firstRole.knockoutQuestions);
      if (firstRole.skills) setSelectedSkills(firstRole.skills);
      if (firstRole.languages) setSelectedLanguages(firstRole.languages);
      if (firstRole.requireVoiceInterview !== undefined) setIsVoiceEnabled(firstRole.requireVoiceInterview);
      if (firstRole.voiceInterviewTemplate) setVoiceInterviewTemplate(firstRole.voiceInterviewTemplate);
      if (firstRole.voiceInterviewQuestions) setVoiceInterviewQuestions(firstRole.voiceInterviewQuestions);
      if (firstRole.photoRequirement !== undefined) setPhotoRequirement(firstRole.photoRequirement);
      if (firstRole.directUpload !== undefined) setDirectUpload(firstRole.directUpload);
      
      setRoleToastMessage("تم اعتماد بيانات الوظيفة الأولى فقط للإعلان الفردي");
      setTimeout(() => setRoleToastMessage(null), 3500);
    }
    setAdType("single");
  };

  const getSuggestions = () => {
    const normalizedTitle = roleTitle.trim();
    if (!normalizedTitle) return [];

    const matchedSkills = new Set<string>();
    
    // Fuzzy matching against the skills dictionary
    for (const [key, skills] of Object.entries(skillsDictionary)) {
      if (
        normalizedTitle.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalizedTitle.toLowerCase())
      ) {
        skills.forEach(s => matchedSkills.add(s));
      }
    }

    // Fuzzy matching against user's previously saved custom skills
    const userSaved = getUserSavedSkills();
    for (const [key, skills] of Object.entries(userSaved)) {
      if (
        normalizedTitle.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalizedTitle.toLowerCase())
      ) {
        skills.forEach(s => matchedSkills.add(s));
      }
    }

    const suggestions = Array.from(matchedSkills);
    return suggestions.filter((s) => !selectedSkills.includes(s));
  };
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };
  const addCustomQuestion = () => {
    if (newQuestionText.trim()) {
      setCustomQuestions([
        ...customQuestions,
        {
          text: newQuestionText.trim(),
          type: newQuestionType,
          required: newQuestionRequired,
          ...(newQuestionType === "خيارات متعددة"
            ? { options: newQuestionOptions }
            : newQuestionType === "نعم / لا"
            ? { options: ["نعم", "لا"] }
            : {}),
        },
      ]);
      setNewQuestionText("");
      setNewQuestionType("نص قصير");
      setNewQuestionOptions([]);
      setNewQuestionRequired(false);
    }
  };
  const addQuestionOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newOptionInput.trim() &&
      !newQuestionOptions.includes(newOptionInput.trim())
    ) {
      setNewQuestionOptions([...newQuestionOptions, newOptionInput.trim()]);
      setNewOptionInput("");
    }
  };
  const removeQuestionOption = (opt: string) => {
    setNewQuestionOptions(newQuestionOptions.filter((o) => o !== opt));
  };
  const removeCustomQuestion = (index: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };
  const toggleAttachment = (attachment: string) => {
    if (attachment === "لا يتطلب مرفقات") {
      setRequiredAttachments(["لا يتطلب مرفقات"]);
      return;
    }
    let newAttachments = requiredAttachments.filter(
      (a) => a !== "لا يتطلب مرفقات",
    );
    if (newAttachments.includes(attachment)) {
      newAttachments = newAttachments.filter((a) => a !== attachment);
    } else {
      newAttachments.push(attachment);
    }
    setRequiredAttachments(
      newAttachments.length > 0 ? newAttachments : ["لا يتطلب مرفقات"],
    );
  };
  const addCustomAttachment = () => {
    if (!newAttachmentName.trim()) {
      alert("يرجى إدخال اسم المرفق.");
      return;
    }
    if (!newAttachmentType) {
      alert("يرجى تحديد الصيغة المطلوبة للمرفق.");
      return;
    }
    setCustomAttachments([
      ...customAttachments,
      {
        attachment_name: newAttachmentName.trim(),
        attachment_type: newAttachmentType,
        required: newAttachmentRequired,
      },
    ]);
    setNewAttachmentName("");
    setNewAttachmentType("");
    setNewAttachmentRequired(false);
  };
  const removeCustomAttachment = (idx: number) => {
    setCustomAttachments(customAttachments.filter((_, i) => i !== idx));
  };
  const handleEditRole = (role: Role) => {
    if (editingRoleId === role.id) {
      setIsAddingRole(false);
      setEditingRoleId(null);
      setRoleTitle("");
      setRoleDesc("");
      setRoleSummary("");
      setResponsibilities("");
      setQualifications("");
      setBenefits("");
      setAiInstructions("");
      setSelectedSkills([]);
      setSelectedLanguages([]);
      setCustomQuestions([]);
      setRequiredAttachments(["سيرة ذاتية PDF"]);
      setCustomAttachments([]);
      setKnockoutQuestions([]);
      setIsVoiceEnabled(true);
      setVoiceInterviewTemplate("general");
      setVoiceInterviewQuestions(["", ""]);
      setPhotoRequirement("hidden");
      setType("دوام كامل");
      setLocation("");
      setExperience("");
      setQualification("");
      setLocations([]);
      setTargetMajors([]);
      return;
    }

    setEditingRoleId(role.id);
    setIsAdvancedSettingsOpen(false);
    setRoleTitle(role.title);
    setRoleDesc(role.description || "");
    setRoleSummary(role.roleSummary || "");
    setResponsibilities(role.responsibilities || "");
    setQualifications(role.qualifications || "");
    setBenefits(role.benefits || "");
    setAiInstructions(role.aiInstructions || "");
    setIsVoiceEnabled(role.requireVoiceInterview ?? false);
    setVoiceInterviewTemplate(role.voiceInterviewTemplate || "general");
    setVoiceInterviewQuestions(role.voiceInterviewQuestions || ["", ""]);
    setPhotoRequirement(role.photoRequirement || "none");
    setSelectedSkills(role.skills || []);
    setSelectedLanguages(role.languages || []);
    setCustomQuestions(role.customQuestions || []);
    setRequiredAttachments(role.requiredAttachments || ["سيرة ذاتية PDF"]);
    setCustomAttachments(role.customAttachments || []);
    
    if (role.type) setType(role.type);
    if (role.location) setLocation(role.location);
    if (role.experience) setExperience(role.experience);
    if (role.qualification) setQualification(role.qualification);
    if (role.salaryMin) setSalaryMin(role.salaryMin);
    if (role.salaryMax) setSalaryMax(role.salaryMax);
    if (role.isSalaryHidden !== undefined) setIsSalaryHidden(role.isSalaryHidden);
    if (role.knockoutQuestions) setKnockoutQuestions(role.knockoutQuestions);
    setLocations(role.locations && role.locations.length > 0 ? role.locations : (role.location ? [role.location] : []));
    setTargetMajors(role.targetMajors || []);
  };

  const handleSaveRole = () => {
    if (!roleTitle.trim() || !roleSummary.trim()) {
      alert("يرجى تعبئة المسمى الوظيفي ونبذة عن الدور أولاً");
      return;
    }
    if (selectedSkills.length === 0) {
      alert("الرجاء إضافة مهارة واحدة على الأقل. هذه البيانات أساسية لعمل محرك الفرز بدقة.");
      return;
    }
    
    if (editingRoleId) {
      setRoles(roles.map(r => r.id === editingRoleId ? {
        ...r,
        title: roleTitle.trim(),
        description: "",
        roleSummary: roleSummary.trim(),
        responsibilities: responsibilities.trim(),
        qualifications: qualifications.trim(),
        benefits: benefits.trim(),
        aiInstructions: aiInstructions.trim(),
        skills: [...selectedSkills],
        languages: [...selectedLanguages],
        customQuestions: [...customQuestions],
        requiredAttachments: [...requiredAttachments],
        portfolioRequirement: requiredAttachments.includes("رابط معرض أعمال/Portfolio") ? portfolioRequirement : undefined,
        customAttachments: [...customAttachments],
        type,
        location,
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
        locations: [...locations],
        targetMajors: [...targetMajors],
      } : r));
      setEditingRoleId(null);
    } else {
      setRoles([
        ...roles,
        {
          id: Math.random().toString(36).substr(2, 9),
          title: roleTitle.trim(),
          description: "",
          roleSummary: roleSummary.trim(),
          responsibilities: responsibilities.trim(),
          qualifications: qualifications.trim(),
          benefits: benefits.trim(),
          aiInstructions: aiInstructions.trim(),
          skills: [...selectedSkills],
          languages: [...selectedLanguages],
          customQuestions: [...customQuestions],
          requiredAttachments: [...requiredAttachments],
          portfolioRequirement: requiredAttachments.includes("رابط معرض أعمال/Portfolio") ? portfolioRequirement : undefined,
          customAttachments: [...customAttachments],
          type,
          location,
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
          locations: [...locations],
          targetMajors: [...targetMajors],
        },
      ]);
    }
    setRoleTitle("");
    setRoleDesc("");
    setRoleSummary("");
    setResponsibilities("");
    setQualifications("");
    setBenefits("");
    setAiInstructions("");
    setDirectUpload(false);
    setIsVoiceEnabled(false);
    setPhotoRequirement("none");
    setSelectedSkills([]);
    setCustomQuestions([]);
    setRequiredAttachments(["سيرة ذاتية PDF"]);
    setCustomAttachments([]);

    setType("دوام كامل");
    setLocation("");
    setExperience("بدون خبرة");
    setQualification("ثانوي");
    setSalaryMin("");
    setSalaryMax("");
    setLocations([]);
    setTargetMajors([]);
    setIsAddingRole(false);

    setRoleToastMessage(editingRoleId ? "تم حفظ التعديلات بنجاح" : "تمت إضافة الدور بنجاح");
    setTimeout(() => setRoleToastMessage(null), 3500);
  };
  const handleRemoveRole = (id: string) => {
    setRoles(roles.filter((r) => r.id !== id));
  };
  const executePublishJob = async () => {
    setShowConfirmModal(false);
    let finalRoles = [...roles];
    
    let currentCampaignTitle = enableWelcomeUI ? campaignTitle : "";
    let currentCampaignDesc = enableWelcomeUI ? campaignDescription : "";

    if (adType === "campaign" && finalRoles.length === 0 && roleTitle.trim()) {
      finalRoles.push({
        id: Math.random().toString(36).substr(2, 9),
        title: roleTitle.trim(),
        description: "",
        roleSummary: roleSummary.trim(),
        responsibilities: responsibilities.trim(),
        qualifications: qualifications.trim(),
        benefits: benefits.trim(),
        aiInstructions: aiInstructions.trim(),
        skills: [...selectedSkills],
        customQuestions: [...customQuestions],
        requiredAttachments: [...requiredAttachments],
        portfolioRequirement: requiredAttachments.includes("رابط معرض أعمال/Portfolio") ? portfolioRequirement : undefined,
        customAttachments: [...customAttachments],
        type,
        location,
        experience,
        qualification,
        salaryMin,
        salaryMax,
        isSalaryHidden,
        knockoutQuestions,
      });
    }

    if (adType === "single" || createJobType === "quick_link") {
      finalRoles = [
        {
          id: Math.random().toString(36).substr(2, 9),
          title: roleTitle.trim() || "شاغر جديد",
          description: "",
          roleSummary: roleSummary.trim(),
          responsibilities: responsibilities.trim(),
          qualifications: qualifications.trim(),
          benefits: benefits.trim(),
          aiInstructions: createJobType === "quick_link" ? "" : aiInstructions.trim(),
          skills: createJobType === "quick_link" ? [] : selectedSkills,
          customQuestions: createJobType === "quick_link" ? [] : customQuestions,
          requiredAttachments: createJobType === "quick_link" ? ["سيرة ذاتية PDF"] : requiredAttachments,
          portfolioRequirement: createJobType === "quick_link" ? undefined : (requiredAttachments.includes("رابط معرض أعمال/Portfolio") ? portfolioRequirement : undefined),
          customAttachments: createJobType === "quick_link" ? [] : customAttachments,
          type,
          location,
          locations,
          targetMajors,
          experience,
          qualification,
          salaryMin,
          salaryMax,
          isSalaryHidden,
          knockoutQuestions,
        },
      ];
      if (!enableWelcomeUI && adType === "single" && createJobType !== "quick_link") {
        currentCampaignTitle = roleTitle.trim();
        currentCampaignDesc = roleDesc.trim();
      }
    }
    const currentDateStr = new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });
    const defaultTitle = `إعلان غير مسمى - ${currentDateStr}`;
    const mainTitle = (adType === "campaign" ? currentCampaignTitle : roleTitle) || defaultTitle;
    const mainDesc = adType === "campaign" ? currentCampaignDesc : "";
    const baseJobData: Omit<Job, "id" | "applicants" | "status" | "createdAt"> =
      {
        recordType: adType === "single" && createJobType === "quick_link" ? "quick_link" : adType,
        campaignTitle: enableWelcomeUI ? campaignTitle : undefined,
        campaignDescription: enableWelcomeUI ? campaignDescription : undefined,
        roleSummary: roleSummary.trim(),
        responsibilities: responsibilities.trim(),
        qualifications: qualifications.trim(),
        benefits: benefits.trim(),
        description: mainDesc,
        roles: finalRoles,
        startDate,
        endDate: isOpenEnded ? undefined : endDate,
        company: userProfile?.companyName || company,
        entityType: userProfile?.entityType,
        city: userProfile?.city,
        location: createJobType === "quick_link" ? "غير محدد" : location,
        locations: createJobType === "quick_link" ? [] : locations,
        targetMajors,
        experience: createJobType === "quick_link" ? "غير محدد" : experience,
        qualification: createJobType === "quick_link" ? "غير محدد" : qualification,
        salaryMin: createJobType === "quick_link" ? undefined : salaryMin,
        salaryMax: createJobType === "quick_link" ? undefined : salaryMax,
        isSalaryHidden: createJobType === "quick_link" ? false : isSalaryHidden,
        knockoutQuestions: createJobType === "quick_link" ? [] : knockoutQuestions,
        type: createJobType === "quick_link" ? "دوام كامل" : type,
        aiInstructions: createJobType === "quick_link" ? "" : aiInstructions.trim(),
        title: mainTitle,
        companyLogo: companyLogo || undefined,
        skills: createJobType === "quick_link" ? [] : selectedSkills,
        languages: selectedLanguages,
        customQuestions: createJobType === "quick_link" ? [] : customQuestions,
        requiredAttachments: createJobType === "quick_link" ? ["سيرة ذاتية PDF"] : requiredAttachments,
        directUpload: createJobType === "quick_link" ? false : directUpload,
        requireVoiceInterview: createJobType === "quick_link" ? false : isVoiceEnabled,
        voiceInterviewTemplate: createJobType === "quick_link" ? undefined : voiceInterviewTemplate,
        voiceInterviewQuestions: createJobType === "quick_link" ? undefined : voiceInterviewQuestions,
        photoRequirement: createJobType === "quick_link" ? "optional" : photoRequirement,
        portfolioRequirement: createJobType === "quick_link" ? undefined : (requiredAttachments.includes("رابط معرض أعمال/Portfolio") ? portfolioRequirement : undefined),
      };
    try {
      await fetch(
        "https://circular-struggle-ethical-membership.trycloudflare.com/webhook-test/2489027f-d077-4af4-9d3d-fc0dd9f38953",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "CreateJob", ...baseJobData }),
        },
      );
    } catch (error) {
      console.error("Webhook error:", error);
    }
    saveUserSkills(mainTitle || roleTitle, selectedSkills);
    const draftId = onSubmit(baseJobData, currentDraftId || undefined);
    if (draftId) {
      setCurrentDraftId(draftId);
    }
  };

  const handleSaveAsDraft = () => {
    if (!roleTitle.trim() && !campaignTitle.trim() && company === "شركة التوظيف الذكي") {
      alert("يرجى إدخال بعض البيانات للحفظ كمسودة.");
      return;
    }

    const finalRoles =
      adType === "single"
        ? [
            {
              id: editingRoleId || Math.random().toString(36).substr(2, 9),
              title: roleTitle.trim() || "شاغر جديد",
              description: "",
              roleSummary: roleSummary.trim(),
              responsibilities: responsibilities.trim(),
              qualifications: qualifications.trim(),
              benefits: benefits.trim(),
              aiInstructions,
              skills: selectedSkills,
              languages: selectedLanguages,
              customQuestions,
              requiredAttachments,
              customAttachments,
              location,
              locations,
              targetMajors,
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
            },
          ]
        : roles.length > 0 ? roles : [];

    if (finalRoles.length === 0) return;

    const mainTitle = adType === "single" ? roleTitle : campaignTitle;
    const mainDesc = adType === "single" ? roleDesc : campaignDescription;

    const draftData: Omit<Job, "id" | "applicants" | "status" | "createdAt" | "draftId"> = {
      recordType: adType === "single" && createJobType === "quick_link" ? "quick_link" : adType,
      campaignTitle: enableWelcomeUI ? campaignTitle : undefined,
      campaignDescription: enableWelcomeUI ? campaignDescription : undefined,
      roleSummary: roleSummary.trim(),
      responsibilities: responsibilities.trim(),
      qualifications: qualifications.trim(),
      benefits: benefits.trim(),
      roles: finalRoles,
      company,
      companyLogo: companyLogo || undefined,
      type,
      location,
      locations,
      targetMajors,
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
      photoRequirement: createJobType === "single" ? photoRequirement : undefined,
      portfolioRequirement,
      startDate: startDate || undefined,
      endDate: isOpenEnded ? undefined : (endDate || undefined),
    };

    if (onSubmit) {
       onSubmit({...draftData, status: "مسودة"} as any, currentDraftId || undefined);
       alert("تم حفظ المسودة بنجاح");
       if (typeof onBack === "function") onBack();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((adType === "single" || createJobType === "quick_link" || (adType === "campaign" && roles.length === 0 && roleTitle.trim())) && selectedSkills.length === 0) {
      alert("الرجاء إضافة مهارة واحدة على الأقل. هذه البيانات أساسية لعمل محرك الفرز بدقة.");
      return;
    }
    let finalRoles = [...roles];
    if (
      adType === "campaign" &&
      finalRoles.length === 0 &&
      roleTitle.trim()
    ) {
      // just logic checking for campaign roles validation
    } else if (adType === "campaign" && finalRoles.length === 0) {
      alert("يرجى إضافة دور وظيفي واحد على الأقل للحملة");
      return;
    }
    if (!isOpenEnded && endDate && new Date(endDate) <= new Date(startDate)) {
      alert("تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء");
      return;
    }

    setShowConfirmModal(true);
  };
  const showRoleForm = adType === "single" || createJobType === "quick_link" || isAddingRole || editingRoleId !== null || roles.length === 0;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8 pt-24 lg:pt-10">
      {" "}
      <AnimatePresence>

        {showConfirmModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <h2 className="text-2xl font-black text-navy dark:text-white text-center mb-4">
                تأكيد النشر
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium">
                هل أنت متأكد من رغبتك في نشر هذا الإعلان؟ لن تتمكن من تعديل بعض الحقول الأساسية بعد النشر.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  تراجع
                </button>
                <button
                  type="button"
                  onClick={executePublishJob}
                  className="flex-1 bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  نعم، انشر الإعلان
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showUnsavedModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <h2 className="text-2xl font-black text-navy dark:text-white text-center mb-4">
                تغييرات غير محفوظة!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium leading-relaxed">
                لقد قمت بإجراء تغييرات. إذا غادرت الآن، سيتم فقدان جميع البيانات التي أدخلتها.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSaveAsDraft();
                    setShowUnsavedModal(false);
                  }}
                  className="w-full px-4 py-3.5 rounded-xl font-bold bg-primary text-white hover:bg-teal-600 shadow-md hover:shadow-lg transition-all"
                >
                  حفظ كمسودة والمغادرة
                </button>
                <button
                  type="button"
                  onClick={() => setShowUnsavedModal(false)}
                  className="w-full px-4 py-3.5 rounded-xl font-bold bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
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
        {roleToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex flex-col items-center text-center space-y-4 mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 text-red-500 rounded-full flex items-center justify-center mb-2">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-2xl font-black text-navy dark:text-white">تأكيد الحذف</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">هل أنت متأكد من رغبتك في حذف هذا الدور؟ لا يمكن التراجع عن هذا الإجراء.</p>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRoleToDelete(null)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveRole(roleToDelete);
                    setRoleToDelete(null);
                  }}
                  className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  حذف الدور
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="max-w-5xl mx-auto pb-32">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); handleBackAttempt(); }}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary font-bold mb-8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white flex items-center justify-center group-hover:border-primary transition-all">
            <ArrowLeft size={18} className="rotate-180" />
          </div>
          العودة للوحة التحكم
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {" "}
          <div className="p-10 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
            {" "}
            <h2 className="text-3xl font-bold text-navy dark:text-white">
              {" "}
              {createJobType === "single"
                ? "إنشاء شاغر وظيفي"
                : createJobType === "quick_link"
                ? "إنشاء رابط توظيف سريع ⚡"
                : "إنشاء إعلان وظيفي"}{" "}
            </h2>{" "}
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              أدخل تفاصيل الوظيفة لبدء استقبال المتقدمين وفرزهم تلقائياً بكفاءة عالية.
            </p>{" "}
          </div>{" "}

          {createJobType !== "quick_link" && (
            <div className="mb-6">
              <div className="flex bg-white dark:bg-slate-800 p-1.5 gap-1.5 rounded-2xl w-full shadow-sm border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleSwitchToSingle}
                  className={`flex items-center justify-center gap-2.5 flex-1 px-8 py-3.5 rounded-xl font-bold text-sm md:text-base whitespace-nowrap transition-all ${adType === "single" ? "bg-primary text-white shadow-md" : "text-slate-500 hover:text-navy dark:hover:text-white"}`}
                >
                  إعلان لشاغر واحد
                </button>
                <button
                  type="button"
                  onClick={handleSwitchToMultiple}
                  className={`flex items-center justify-center gap-2.5 flex-1 px-8 py-3.5 rounded-xl font-bold text-sm md:text-base whitespace-nowrap transition-all ${adType === "campaign" ? "bg-primary text-white shadow-md" : "text-slate-500 hover:text-navy dark:hover:text-white"}`}
                >
                  إعلان لعدة شواغر (حملة توظيف)
                </button>
              </div>
            </div>
          )}

          <form className="space-y-6" id="createJobForm" onSubmit={handleSubmit}>

            

            {createJobType !== "quick_link" && (
              <div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 mb-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy dark:text-white">
                        واجهة الترحيب للمتقدمين <span className="text-slate-400 font-normal text-sm">(اختياري)</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">صفحة هبوط مخصصة لاستقبال المتقدمين قبل تعبئة النموذج</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={enableWelcomeUI} 
                      onChange={(e) => setEnableWelcomeUI(e.target.checked)} 
                    />
                    <div className="relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                    <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">تفعيل هذه الواجهة</span>
                  </label>
                </div>
                {enableWelcomeUI && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
                    {adType === "campaign" && (
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                          عنوان الإعلان / البوابة <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={campaignTitle}
                          onChange={(e) => setCampaignTitle(e.target.value)}
                          placeholder="مثال: وظيفة شاغرة - مبيعات 2026..."
                          className="w-full px-6 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                        رسالة الترحيب <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={campaignDescription}
                        onChange={(e) => setCampaignDescription(e.target.value)}
                        placeholder="مثال: نبذة مختصرة للترحيب..."
                        className="w-full px-6 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {createJobType === "quick_link" && (
              <div className="bg-cyan-50 dark:bg-cyan-900/20 border-2 border-cyan-100 dark:border-cyan-800/50 p-6 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-5 shadow-sm mb-4">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-full flex items-center justify-center shrink-0 text-cyan-600 dark:text-cyan-400">
                  <Sparkles className="animate-pulse" size={24} />
                </div>
                <div className="text-center md:text-right flex-1">
                  <h3 className="font-bold text-cyan-800 dark:text-cyan-400 text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                    💡 تنبيه هام لمرشح الذكاء الاصطناعي
                  </h3>
                  <p className="text-cyan-700 dark:text-cyan-300 font-medium text-[13px] leading-relaxed max-w-3xl border-r-2 border-cyan-200 dark:border-cyan-800/50 pr-4">
                    أداة الفرز السريع مصممة لإعطاء <span className="font-bold bg-cyan-100 dark:bg-cyan-900/50 px-1 rounded">(تقييم مبدئي لمدى المطابقة)</span> بناءً على القراءة السطحية للسير الذاتية وتوفير وقتك.
                    للحصول على <strong>مطابقة وتحليل دقيق 100%</strong> للمهارات العميقة، يرجى استخدام مسار (بوابة التوظيف الشاملة).
                  </p>
                </div>
              </div>
            )}
            

            
            {/* Card 1: Basic Info */}
            {createJobType !== "quick_link" && (
            <>
            <div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6">
              <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-3 mb-6">
                <Briefcase className="text-primary" size={24} /> المعلومات الأساسية
              </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-6 md:col-span-2 mb-2 p-5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div 
                  className={`relative overflow-hidden w-20 h-20 p-0 rounded-2xl bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 flex items-center justify-center border-2 ${companyLogo ? "border-solid border-primary/20 cursor-pointer hover:border-primary/50" : "border-dashed"} transition-colors shrink-0 shadow-sm`}
                  onClick={() => { if(companyLogo) setLightboxPhoto(companyLogo); }}
                >
                  {!companyLogo && (
                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer group">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                  const base64Url = reader.result as string;
                                  setCompanyLogo(base64Url);
                                  localStorage.setItem("savedCompanyLogo", base64Url);
                              };
                              reader.readAsDataURL(file);
                          }
                      }} />
                      <Upload className="text-slate-400 group-hover:text-primary transition-colors" />
                    </label>
                  )}
                  {companyLogo && (
                    <img src={companyLogo} className="w-full h-full object-cover rounded-[inherit] drop-shadow-sm" alt="Company Logo" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-navy dark:text-white mb-1">شعار جهة التوظيف</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">يرفق هذا الشعار في صفحة تفاصيل الوظيفة (اختياري)</p>
                  
                  <div className="flex items-center gap-4">
                    {companyLogo && (
                      <label className="text-xs font-bold text-primary hover:text-primary/80 cursor-pointer transition-colors">
                        تغيير الشعار
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    const base64Url = reader.result as string;
                                    setCompanyLogo(base64Url);
                                    localStorage.setItem("savedCompanyLogo", base64Url);
                                };
                                reader.readAsDataURL(file);
                            }
                        }} />
                      </label>
                    )}
                    {companyLogo && (
                      <button type="button" onClick={() => { setCompanyLogo(null); localStorage.removeItem("savedCompanyLogo"); }} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">إزالة الشعار</button>
                    )}
                  </div>
                </div>
              </div>
              {" "}
              <div className="space-y-3">
                {" "}
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  اسم الشركة / الفرع <span className="text-red-500">*</span>
                </label>{" "}
                <input
                  required
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="مثال: شركة الحلول الذكية..."
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                />{" "}
              </div>{" "}
            </div>
              </div>
                {roles.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between font-bold text-navy dark:text-white">
                      <h3>الشواغر المطلوبة ({roles.length}):</h3>
                      <AnimatePresence>
                        {roleToastMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg"
                          >
                            <CheckCircle size={16} />
                            {roleToastMessage}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid gap-4">
                      {roles.map((r) => (
                        <div
                          key={r.id}
                          className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl flex items-center justify-between shadow-sm"
                        >
                          {" "}
                          <div>
                            {" "}
                            <p className="font-bold text-navy dark:text-white">
                              {r.title}
                            </p>{" "}
                            <p className="text-sm text-slate-500 dark:text-slate-300 line-clamp-1 mt-1">
                              {r.description}
                            </p>{" "}
                          </div>{" "}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                handleEditRole(r as any);
                              }}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-indigo-900/40 text-slate-500 dark:text-indigo-300 hover:bg-primary dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white transition-all shrink-0"
                            >
                              {" "}
                              <Pencil size={16} />{" "}
                            </button>{" "}
                            <button
                              type="button"
                              onClick={() => setRoleToDelete(r.id)}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shrink-0"
                            >
                              {" "}
                              <Trash2 size={16} />{" "}
                            </button>{" "}
                          </div>
                        </div>
                      ))}{" "}
                    </div>{" "}
                    {!showRoleForm && (
                      <button
                        type="button"
                        onClick={() => {
                            setIsAddingRole(true);
                            setIsAdvancedSettingsOpen(true);
                            setEditingRoleId(null);
                            setType("دوام كامل");
                            setLocation("");
                            setExperience("بدون خبرة");
                            setQualification("ثانوي");
                            setSalaryMin("");
                            setSalaryMax("");
                            setRoleTitle("");
                            setRoleDesc("");
                            setRoleSummary("");
                            setResponsibilities("");
                            setQualifications("");
                            setBenefits("");
                            setAiInstructions("");
                            setSelectedSkills([]);
                            setCustomQuestions([]);
                            setRequiredAttachments(["سيرة ذاتية PDF"]);
                            setCustomAttachments([]);
                        }}
                        className="mt-6 border-2 border-dashed border-primary/30 text-primary hover:bg-primary hover:text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 w-full shadow-sm"
                      >
                        <Plus size={20} /> إضافة دور وظيفي جديد
                      </button>
                    )}
                  </div>
                )}{" "}
            </>
            )}

            {/* Card 3: Requirements and Roles */}
            {showRoleForm && (
            <div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6">
              <h3 className="text-xl font-bold text-navy dark:text-white flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="text-primary" size={24} /> تفاصيل الأدوار والمتطلبات
                </div>
                {adType === "campaign" && (
                  <span className="text-xs md:text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold">
                    الشاغر رقم {editingRoleId ? roles.findIndex(r => r.id === editingRoleId) + 1 : roles.length + 1}
                  </span>
                )}
              </h3>
              <p className="text-sm font-medium text-gray-500 mb-6 px-1">
                (تنبيه: هذه البيانات أساسية لعمل محرك الفرز بدقة، حتى وإن تم تفعيل خاصية التخطي للمتقدمين)
              </p>
              <div className="space-y-3">
                {" "}
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  المسمى الوظيفي (Role) <span className="text-red-500">*</span>
                </label>{" "}
                <input
                  required={createJobType === "single" || createJobType === "quick_link"}
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="مثال: مندوب مبيعات"
                  className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium"
                />{" "}
              </div>{" "}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                    نوع العمل <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none font-medium"
                    >
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دوام كامل</option> <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دوام جزئي</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">عن بعد</option> <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">تدريب</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                    مقر العمل / المدن <span className="text-red-500">*</span>
                  </label>
                  <SearchableSelect
                    options={SAUDI_CITIES.filter((c) => !locations.includes(c))}
                    value={""}
                    onChange={(val) => {
                      if (val && !locations.includes(val)) {
                        setLocations([...locations, val]);
                        setLocation(val); 
                      }
                    }}
                    placeholder="اختر المدن..."
                  />
                  {locations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <AnimatePresence>
                        {locations.map((loc) => (
                          <motion.span
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            key={loc}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-bold"
                          >
                            {loc}
                            <button
                              type="button"
                              onClick={() => {
                                const newLocs = locations.filter((l) => l !== loc);
                                setLocations(newLocs);
                                if(newLocs.length > 0) setLocation(newLocs[0]); else setLocation("");
                              }}
                              className="hover:text-red-500 transition-colors p-0.5"
                            >
                              <X size={14} />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                    سنوات الخبرة المطلوبة <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none font-medium"
                    >
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">بدون خبرة</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">1-3 سنوات</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">3-5 سنوات</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">5+ سنوات</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                    الحد الأدنى للمؤهل <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none font-medium"
                    >
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ثانوي</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دبلوم</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">بكالوريوس</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ماجستير</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 block">التخصصات المستهدفة <span className="text-slate-400 font-normal text-xs ml-1">(اختياري)</span></label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMajorInput}
                    onChange={(e) => setNewMajorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newMajorInput.trim() && !targetMajors.includes(newMajorInput.trim())) {
                          setTargetMajors([...targetMajors, newMajorInput.trim()]);
                          setNewMajorInput("");
                        }
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const paste = e.clipboardData.getData("text");
                      if (paste) {
                        const newMajors = paste
                          .split(/[,\n؛،]/)
                          .map(m => m.trim())
                          .filter(m => m.length > 0 && !targetMajors.includes(m));
                        if (newMajors.length > 0) {
                          setTargetMajors(prev => [...prev, ...newMajors]);
                        }
                      }
                    }}
                    placeholder="مثال: هندسة برمجيات، تسويق..."
                    className="flex-1 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                        if (newMajorInput.trim() && !targetMajors.includes(newMajorInput.trim())) {
                          setTargetMajors([...targetMajors, newMajorInput.trim()]);
                          setNewMajorInput("");
                        }
                    }}
                    className="px-6 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all font-bold flex items-center justify-center"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {targetMajors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <AnimatePresence>
                      {targetMajors.map((major) => (
                        <motion.span
                          layout
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          key={major}
                          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all"
                        >
                          {major}
                          <button
                            type="button"
                            onClick={() => setTargetMajors(targetMajors.filter((m) => m !== major))}
                            className="hover:text-red-500 transition-colors p-0.5"
                          >
                            <X size={14} />
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 block">
                  نطاق الراتب المتوقع (ريال)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-3">
                    <span className="text-xs text-slate-500 font-bold block">الراتب الأساسي</span>
                    <input
                      required={false}
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="أدخل قيمة الراتب.. مثلاً: 4000"
                      className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <span className="text-xs text-slate-500 font-bold block">الحد الأعلى <span className="text-slate-400 font-normal ml-1">(اختياري للرواتب المتفاوتة)</span></span>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="متفاوت إلى.. مثلاً: 6000"
                      className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="relative mt-2 flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" className="sr-only peer" checked={isSalaryHidden} onChange={(e) => setIsSalaryHidden(e.target.checked)} />
                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                    <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء الراتب عن المتقدمين (يُستخدم للفرز الآلي فقط)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="font-bold text-navy dark:text-white text-lg mb-4">التفاصيل الوظيفية (منهجية ATS)</h3>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1">
                      نبذة عن الدور <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required={createJobType === "single" || createJobType === "quick_link"}
                      rows={3}
                      value={roleSummary}
                      onChange={(e) => setRoleSummary(e.target.value)}
                      placeholder="نبذة عامة مختصرة عن دور الموظف في الشركة..."
                      className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1">
                    المهام والمسؤوليات <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required={createJobType === "single" || createJobType === "quick_link"}
                    rows={4}
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    placeholder="اكتب المهام في شكل نقاط (كل سطر يعتبر نقطة مستقلة في العرض للمتقدم)..."
                    className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1">
                    المؤهلات والمتطلبات <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required={createJobType === "single" || createJobType === "quick_link"}
                    rows={4}
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="اكتب المؤهلات المطلوبة (كل سطر يعتبر شرطاً مستقلاً)..."
                    className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1">
                    المميزات (Benefits)
                  </label>
                  <textarea
                    rows={3}
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    placeholder="أضف المميزات الوظيفية (تأمين، بونص، إجازات)..."
                    className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                  />
                </div>
              </div>

              {createJobType !== "quick_link" && (
                <>
              <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700/60 mt-8">
                {" "}
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">
                  المهارات المستهدفة <span className="text-red-500">*</span>
                </label>{" "}
                <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl">
                  {" "}
                  {selectedSkills.length === 0 && (
                    <span className="text-sm text-slate-400 dark:text-slate-500 py-2">
                      لا توجد مهارات.
                    </span>
                  )}{" "}
                  <AnimatePresence>
                    {" "}
                    {selectedSkills.map((skill) => (
                      <motion.button
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all"
                      >
                        {" "}
                        {skill} <X size={14} />{" "}
                      </motion.button>
                    ))}{" "}
                  </AnimatePresence>{" "}
                </div>{" "}
                {getSuggestions().length > 0 && (
                  <div className="space-y-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    {" "}
                    <p className="text-xs font-bold text-primary mr-1 flex items-center gap-2">
                      {" "}
                      <Sparkles size={14} /> اقتراحات ذكية:{" "}
                    </p>{" "}
                    <div className="flex flex-wrap gap-2">
                      {" "}
                      {getSuggestions().map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => toggleSkill(suggestion)}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold hover:border-primary hover:text-primary transition-all shadow-sm"
                        >
                          {" "}
                          + {suggestion}{" "}
                        </button>
                      ))}{" "}
                    </div>{" "}
                  </div>
                )}{" "}
                <div className="relative">
                  {" "}
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomSkill(e);
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const paste = e.clipboardData.getData("text");
                      if (paste) {
                        const newSkills = paste
                          .split(/[,\n،]/)
                          .map(s => s.trim())
                          .filter(s => s.length > 0 && !selectedSkills.includes(s));
                        if (newSkills.length > 0) {
                          setSelectedSkills(prev => [...prev, ...newSkills]);
                        }
                      }
                    }}
                    placeholder="أضف مهارة..."
                    className="w-full pr-6 pl-14 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium"
                  />{" "}
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary transition-all"
                  >
                    <Plus size={20} />
                  </button>{" "}
                </div>{" "}
              </div>{" "}
              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/60 flex flex-col gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                    اللغات المطلوبة <span className="text-slate-400 font-normal ml-1">(اختياري)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedLanguages.map((lang) => (
                      <span key={lang} className="bg-primary text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
                        {lang}
                        <button type="button" onClick={() => setSelectedLanguages(selectedLanguages.filter(l => l !== lang))}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <select
                      value=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !selectedLanguages.includes(val)) {
                          setSelectedLanguages([...selectedLanguages, val]);
                        }
                      }}
                      className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium appearance-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                    >
                      <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر لغة لإضافتها...</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="العربية">العربية</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الإنجليزية">الإنجليزية</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الفرنسية">الفرنسية</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الإسبانية">الإسبانية</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الهندية">الهندية</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الأوردو">الأوردو</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/60 flex flex-col gap-6">
                
                {/* Basic Attachments Section */}
                <div>
                  <label className="text-sm font-bold text-navy dark:text-white mb-4 block flex items-center gap-2">
                    المرفقات الأساسية المطلوبة
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {" "}
                    {[
                      { id: "سيرة ذاتية PDF", title: "ملف السيرة الذاتية", subtitle: "(يُقبل ملفات PDF و DOCX فقط)" },
                      { id: "رابط معرض أعمال/Portfolio", title: "رابط معرض أعمال/Portfolio" },
                      { id: "لا يتطلب مرفقات", title: "لا يتطلب مرفقات" },
                    ].map((opt) => (
                      <div key={opt.id} className="relative">
                        <label
                          className={`flex flex-col items-center justify-center text-center gap-1 ${opt.id === "رابط معرض أعمال/Portfolio" && requiredAttachments.includes(opt.id) ? "pt-4 pb-12" : "p-4"} h-full rounded-2xl border cursor-pointer transition-all ${requiredAttachments.includes(opt.id) ? "bg-primary/5 border-primary text-primary" : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-navy dark:text-white dark:bg-slate-800/50 dark:hover:bg-slate-700 dark:border-slate-700"}`}
                        >
                          {" "}
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={requiredAttachments.includes(opt.id)}
                            onChange={() => toggleAttachment(opt.id)}
                          />{" "}
                          <span className="font-bold text-sm">{opt.title}</span>{" "}
                          {opt.subtitle && <span className="text-[10px] sm:text-xs text-slate-400 font-medium">{opt.subtitle}</span>}
                        </label>
                        {opt.id === "رابط معرض أعمال/Portfolio" && requiredAttachments.includes(opt.id) && (
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%]">
                            <select
                              value={portfolioRequirement}
                              onChange={(e) => {
                                e.stopPropagation();
                                setPortfolioRequirement(e.target.value as "required" | "optional");
                              }}
                              className="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg py-1 px-2 text-navy dark:text-white outline-none cursor-pointer"
                            >
                              <option value="optional" className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختياري</option>
                              <option value="required" className="bg-white text-navy dark:bg-slate-800 dark:text-white">إلزامي</option>
                            </select>
                          </div>
                        )}
                      </div>
                    ))}{" "}
                  </div>{" "}
                </div>{" "}

              {/* Custom Attachments Section */}{" "}
              <div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/30 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsAttachmentsExpanded(!isAttachmentsExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-transparent transition-all group outline-none"
                  >
                    <span className="font-bold text-navy dark:text-white flex items-center gap-2">
                      المرفقات المخصصة - اختياري
                    </span>
                    <ChevronDown
                      className={`text-slate-400 group-hover:text-primary transition-transform duration-300 ${isAttachmentsExpanded ? 'rotate-180' : ''}`}
                      size={20}
                    />
                  </button>
                  <AnimatePresence>
                    {isAttachmentsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="border-t border-slate-200 dark:border-slate-700"
                      >
                        <div className="p-6 flex flex-col gap-4 bg-white dark:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    {" "}
                    <label className="text-sm font-bold text-navy dark:text-white mr-1">
                      إضافة مرفقات مخصصة جديدة
                    </label>{" "}
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      أضف مرفقات إضافية غير المذكورة أعلاه (اختياري)
                    </span>{" "}
                  </div>{" "}
                {customAttachments.length > 0 && (
                  <div className="space-y-3 mb-2">
                    {" "}
                    {customAttachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl gap-4"
                      >
                        {" "}
                        <div className="flex flex-col">
                          {" "}
                          <span className="font-bold text-navy dark:text-white text-sm">
                            {att.attachment_name}
                          </span>{" "}
                          <span className="text-xs text-primary font-medium">
                            النوع:{" "}
                            {att.attachment_type === "file" ? "ملف PDF" : att.attachment_type === "mixed_file" ? "مستند أو صورة (PDF/JPG)"
                              : att.attachment_type === "link"
                              ? "رابط Link"
                              : att.attachment_type === "image"
                              ? "صورة (Image - JPG/PNG)"
                              : att.attachment_type === "video"
                              ? "فيديو قصير (Video - MP4)"
                              : "مستندات أخرى (Word / Excel)"}
                          </span>{" "}
                          <span className="text-slate-300">•</span>
                          <span className={att.required ? "text-red-500 text-xs font-medium" : "text-slate-400 text-xs font-medium"}>
                            {att.required ? "إلزامي" : "اختياري"}
                          </span>
                        </div>{" "}
                        <button
                          type="button"
                          onClick={() => removeCustomAttachment(idx)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0"
                        >
                          {" "}
                          <Trash2 size={14} />{" "}
                        </button>{" "}
                      </div>
                    ))}{" "}
                  </div>
                )}{" "}
                <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                  {" "}
                  <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl shrink-0 h-[58px]">
                    <input
                      type="checkbox"
                      id="attRequired"
                      checked={newAttachmentRequired}
                      onChange={(e) => setNewAttachmentRequired(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="attRequired" className="text-sm font-bold text-navy dark:text-white cursor-pointer whitespace-nowrap">
                      إرفاق إلزامي
                    </label>
                  </div>
                  <input
                    type="text"
                    value={newAttachmentName}
                    onChange={(e) => setNewAttachmentName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomAttachment();
                      }
                    }}
                    placeholder="اسم المرفق (مثال: رخصة)..."
                    className="flex-1 w-full h-14 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none"
                  />{" "}
                  <div className="flex-1 relative w-full">
                    {" "}
                    <select
                      value={newAttachmentType}
                      onChange={(e) =>
                        setNewAttachmentType(e.target.value as "file" | "link" | "image" | "video" | "document" | "mixed_file" | "")
                      }
                      className="w-full h-14 px-6 pl-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none appearance-none font-medium cursor-pointer text-sm md:text-base"
                    >
                      {" "}
                      <option value="" disabled className="bg-white text-slate-400 dark:bg-slate-800 hidden">
                        (حدد الصيغة المطلوبة)
                      </option>
                      <option value="file" className="bg-white text-navy dark:bg-slate-800 dark:text-white">ملف PDF</option>
                      <option value="mixed_file" className="bg-white text-navy dark:bg-slate-800 dark:text-white">مستند أو صورة (PDF / JPG / PNG)</option>{" "}
                      <option value="link" className="bg-white text-navy dark:bg-slate-800 dark:text-white">رابط Link</option>{" "}
                      <option value="image" className="bg-white text-navy dark:bg-slate-800 dark:text-white">صورة (Image - JPG/PNG)</option>{" "}
                      <option value="video" className="bg-white text-navy dark:bg-slate-800 dark:text-white">فيديو قصير (Video - MP4)</option>{" "}
                      <option value="document" className="bg-white text-navy dark:bg-slate-800 dark:text-white">مستندات أخرى (Word / Excel)</option>{" "}
                    </select>{" "}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                      <ChevronDown size={20} />
                    </div>
                  </div>{" "}
                  <button
                    type="button"
                    onClick={addCustomAttachment}
                    className="flex-1 w-full h-14 bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 rounded-2xl font-bold flex items-center gap-2 justify-center transition-all border-2 border-primary/20 hover:border-primary whitespace-nowrap shadow-sm"
                  >
                    {" "}
                    <Plus size={20} strokeWidth={2.5} /> إضافة المرفق{" "}
                  </button>{" "}
                </div>{" "}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>


                {/* Knockout Questions Accordion */}
                <div className="border-2 border-red-100 dark:border-red-900/30 rounded-2xl bg-red-50/50 dark:bg-red-900/10 overflow-hidden mb-6">
                  <button
                    type="button"
                    onClick={() => setIsKnockoutExpanded(!isKnockoutExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-transparent transition-all group outline-none"
                  >
                    <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                      <Ban size={18} /> أسئلة الاستبعاد التلقائي (اختياري)
                    </span>
                    <ChevronDown
                      className={`text-slate-400 group-hover:text-red-500 transition-transform duration-300 ${isKnockoutExpanded ? 'rotate-180' : ''}`}
                      size={20}
                    />
                  </button>
                  <AnimatePresence>
                    {isKnockoutExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="border-t border-red-100 dark:border-red-900/30"
                      >
                        <div className="p-6 space-y-4 bg-white dark:bg-slate-800/50">
                          <div>
                            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-medium">
                              (استخدم هذا القسم للاستبعاد الفوري للمتقدمين غير المطابقين للشروط الحتمية. يمكنك تركه فارغاً لتقييم جميع المتقدمين عبر نظام الفرز الآلي).
                            </p>
                            <label className="text-sm font-bold text-navy dark:text-white mr-1 block">
                              إضافة سؤال استبعاد
                            </label>
                          </div>
                          <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <input
                              type="text"
                              value={newKqText}
                              onChange={(e) => setNewKqText(e.target.value)}
                              placeholder="نص السؤال (مثال: هل أنت سعودي الجنسية؟)"
                              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none focus:border-red-400 transition-all font-medium text-sm"
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <select
                                value={newKqType}
                                onChange={(e) => {
                                  setNewKqType(e.target.value as "yes_no" | "options");
                                  if (e.target.value === "yes_no") {
                                    setNewKqRequiredAnswer("نعم");
                                  } else {
                                    setNewKqRequiredAnswer(newKqOptions[0] || "");
                                  }
                                }}
                                className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none font-medium text-sm appearance-none"
                              >
                                <option value="yes_no" className="bg-white text-navy dark:bg-slate-800 dark:text-white">نعم / لا</option>
                                <option value="options" className="bg-white text-navy dark:bg-slate-800 dark:text-white">خيارات متعددة</option>
                              </select>

                              {newKqType === "yes_no" ? (
                                <select
                                  value={newKqRequiredAnswer}
                                  onChange={(e) => setNewKqRequiredAnswer(e.target.value)}
                                  className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none"
                                >
                                  <option value="نعم" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الإجابة المطلوبة للقَبول: نعم</option>
                                  <option value="لا" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الإجابة المطلوبة للقَبول: لا</option>
                                </select>
                              ) : (
                                <select
                                  value={newKqRequiredAnswer}
                                  onChange={(e) => setNewKqRequiredAnswer(e.target.value)}
                                  className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none"
                                >
                                  <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر الإجابة المطلوبة للقبول...</option>
                                  {newKqOptions.map((opt, i) => (
                                    <option key={i} value={opt} className="bg-white text-navy dark:bg-slate-800 dark:text-white">{opt}</option>
                                  ))}
                                </select>
                              )}
                            </div>

                            {newKqType === "options" && (
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newKqOptionInput}
                                    onChange={(e) => setNewKqOptionInput(e.target.value)}
                                    placeholder="أضف خياراً..."
                                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none text-sm"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (newKqOptionInput.trim() && !newKqOptions.includes(newKqOptionInput.trim())) {
                                          const up = [...newKqOptions, newKqOptionInput.trim()];
                                          setNewKqOptions(up);
                                          if (!newKqRequiredAnswer) setNewKqRequiredAnswer(up[0]);
                                          setNewKqOptionInput("");
                                        }
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (newKqOptionInput.trim() && !newKqOptions.includes(newKqOptionInput.trim())) {
                                        const up = [...newKqOptions, newKqOptionInput.trim()];
                                        setNewKqOptions(up);
                                        if (!newKqRequiredAnswer) setNewKqRequiredAnswer(up[0]);
                                        setNewKqOptionInput("");
                                      }
                                    }}
                                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl font-bold text-sm transition-all"
                                  >
                                    إضافة
                                  </button>
                                </div>
                                {newKqOptions.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {newKqOptions.map((opt, i) => (
                                      <div key={i} className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold dark:text-white">
                                        <span>{opt}</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const up = newKqOptions.filter((_, idx) => idx !== i);
                                            setNewKqOptions(up);
                                            if (newKqRequiredAnswer === opt) setNewKqRequiredAnswer(up[0] || "");
                                          }}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                if (!newKqText.trim() || !newKqRequiredAnswer.trim()) {
                                  alert("يرجى إدخال نص السؤال وتحديد الإجابة المطلوبة للقبول!");
                                  return;
                                }
                                if (newKqType === "options" && newKqOptions.length < 2) {
                                  alert("يرجى إضافة خيارين على الأقل!");
                                  return;
                                }
                                setKnockoutQuestions([...knockoutQuestions, {
                                  text: newKqText.trim(),
                                  type: newKqType,
                                  options: newKqType === "options" ? newKqOptions : undefined,
                                  requiredAnswer: newKqRequiredAnswer
                                }]);
                                setNewKqText("");
                                setNewKqOptions([]);
                                setNewKqOptionInput("");
                              }}
                              className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-xl font-bold text-sm transition-all"
                            >
                              إضافة سؤال استبعاد
                            </button>
                          </div>

                          {knockoutQuestions.length > 0 && (
                            <div className="space-y-3 mt-6">
                              {knockoutQuestions.map((q, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/30 rounded-xl">
                                  <div>
                                    <p className="font-bold text-navy dark:text-white text-sm mb-1">{q.text}</p>
                                    <p className="text-xs text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded inline-block">الإجابة المطلوبة للقبول: {q.requiredAnswer}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setKnockoutQuestions(knockoutQuestions.filter((_, i) => i !== idx))}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Questions Accordion */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/30 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsQuestionsExpanded(!isQuestionsExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-transparent transition-all group outline-none"
                  >
                    <span className="font-bold text-navy dark:text-white flex items-center gap-2">
                      الأسئلة الإضافية - اختياري
                    </span>
                    <ChevronDown
                      className={`text-slate-400 group-hover:text-primary transition-transform duration-300 ${isQuestionsExpanded ? 'rotate-180' : ''}`}
                      size={20}
                    />
                  </button>
                  <AnimatePresence>
                    {isQuestionsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="border-t border-slate-200 dark:border-slate-700"
                      >
                        <div className="p-6 space-y-4 bg-white dark:bg-slate-800/50">

              <div className="space-y-4">
                {" "}
                <label className="text-sm font-bold text-navy dark:text-white mr-1">
                  الأسئلة الإضافية (خاصة بهذا الدور)
                </label>{" "}
                {customQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl gap-4"
                  >
                    {" "}
                    <div className="space-y-1 flex-1">
                      {" "}
                      <p className="font-bold text-navy dark:text-white text-sm">
                        {q.text}
                      </p>{" "}
                      <p className="text-xs text-primary font-medium flex items-center gap-1.5">
                        نوع الإجابة: {q.type} 
                        <span className="text-slate-300">•</span>
                        <span className={q.required ? "text-red-500" : "text-slate-400"}>
                          {q.required ? "إلزامي" : "اختياري"}
                        </span>
                      </p>{" "}
                    </div>{" "}
                    <button
                      type="button"
                      onClick={() => removeCustomQuestion(idx)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>{" "}
                  </div>
                ))}{" "}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {" "}
                  <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl shrink-0 h-[58px]">
                    <input
                      type="checkbox"
                      id="qRequired"
                      checked={newQuestionRequired}
                      onChange={(e) => setNewQuestionRequired(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="qRequired" className="text-sm font-bold text-navy dark:text-white cursor-pointer whitespace-nowrap">
                      إجابة إلزامية
                    </label>
                  </div>
                  <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomQuestion();
                      }
                    }}
                    placeholder="اكتب سؤالك هنا..."
                    className="flex-1 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none"
                  />{" "}
                  <div className="relative min-w-[150px]">
                    {" "}
                    <select
                      value={newQuestionType}
                      onChange={(e) => {
                        setNewQuestionType(e.target.value);
                        if (e.target.value !== "خيارات متعددة")
                          setNewQuestionOptions([]);
                      }}
                      className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none appearance-none font-medium"
                    >
                      {" "}
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">نص قصير</option> <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">نص طويل</option>{" "}
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">خيارات متعددة</option>{" "}
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">نعم / لا</option>{" "}
                    </select>{" "}
                  </div>{" "}
                  <button
                    type="button"
                    onClick={addCustomQuestion}
                    className="bg-navy text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center"
                  >
                    <Plus size={18} />
                  </button>{" "}
                </div>{" "}
                {newQuestionType === "خيارات متعددة" && (
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 space-y-3">
                    {" "}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {" "}
                      {newQuestionOptions.map((opt) => (
                        <span
                          key={opt}
                          className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2"
                        >
                          {opt}{" "}
                          <button
                            type="button"
                            onClick={() => removeQuestionOption(opt)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      ))}{" "}
                    </div>{" "}
                    <div className="relative max-w-sm">
                      {" "}
                      <input
                        type="text"
                        value={newOptionInput}
                        onChange={(e) => setNewOptionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addQuestionOption(e);
                          }
                        }}
                        placeholder="اضف خيار واضغط Enter"
                        className="w-full pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border rounded-xl"
                      />{" "}
                    </div>{" "}
                  </div>
                )}{" "}
              </div>{" "}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

            <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-[32px] border-2 border-indigo-100 dark:border-indigo-800/30 shadow-inner mt-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">
                    توجيهات إضافية لنظام الفرز (داخلي)
                  </h3>
                </div>
              </div>
              <textarea
                required={false}
                rows={4}
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                placeholder="(نظام الفرز يقوم بتحليل ومطابقة السير الذاتية تلقائياً وبدقة عالية دون الحاجة لأي تدخل. استخدم هذا الحقل الاختياري فقط إذا أردت توجيه النظام للتركيز على مهارة نادرة أو شروط خاصة جداً خارج الوصف المعتاد. هذا النص داخلي ولن يظهر للمتقدمين للوظيفة)"
                className="w-full px-6 py-5 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100/50 dark:border-indigo-800/30 text-navy dark:text-white dark:placeholder-slate-500 rounded-2xl outline-none font-medium resize-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 transition-all placeholder:text-[13px] leading-relaxed"
              />
            </div>

            <details
              open={isAdvancedSettingsOpen}
              onToggle={(e) => setIsAdvancedSettingsOpen(e.currentTarget.open)}
              className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm mt-6 mb-6 group cursor-pointer"
            >
              <summary className="p-8 text-xl font-bold text-navy dark:text-white flex items-center gap-3 select-none outline-none">
                <Settings size={22} className="text-primary" />
                إعدادات الفرز المتقدمة
                <ChevronDown size={20} className="mr-auto text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>

              <div className="px-8 pb-8 pt-2 space-y-6 cursor-default border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 pb-6 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <h4 className="font-bold text-navy dark:text-white text-lg">الصورة الشخصية للمرشح</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-lg leading-relaxed">تحديد متطلب رفع صورة شخصية للمرشح أثناء ملء نموذج التقديم.</p>
                  </div>
                  <select
                    value={photoRequirement}
                    onChange={(e) => setPhotoRequirement(e.target.value as any)}
                    className="w-full md:w-auto px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shrink-0 font-bold"
                  >
                    <option value="hidden" className="bg-white text-navy dark:bg-slate-800 dark:text-white">لا أطلب صورة (مخفي)</option>
                    <option value="optional" className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختياري</option>
                    <option value="required" className="bg-white text-navy dark:bg-slate-800 dark:text-white">إلزامي</option>
                  </select>
                </div>

                <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
                  <div>
                    <h4 className="font-bold text-navy dark:text-white text-lg">تفعيل التقييم الصوتي الآلي</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-lg leading-relaxed">عند إيقاف هذا الخيار، سيكتفي النظام بجمع بيانات المرشح وسيرته الذاتية ليتم فرزها دون إلزامه بإجراء المقابلة الصوتية الآلية.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={isVoiceEnabled} onChange={(e) => setIsVoiceEnabled(e.target.checked)} />
                    <div className="relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                <AnimatePresence>
                  {isVoiceEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-4">
                        <label className="font-bold text-navy dark:text-white text-lg">قالب أسئلة المقابلة الصوتية (سؤالين كحد أقصى)</label>
                        <select
                          value={voiceInterviewTemplate}
                          onChange={(e) => setVoiceInterviewTemplate(e.target.value as any)}
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all"
                        >
                          <option value="general" className="bg-white text-navy dark:bg-slate-800 dark:text-white">فرز عام - للوظائف الإدارية والتقنية</option>
                          <option value="sales" className="bg-white text-navy dark:bg-slate-800 dark:text-white">مواجهة الجمهور والمبيعات</option>
                          <option value="custom" className="bg-white text-navy dark:bg-slate-800 dark:text-white">كتابة أسئلة مخصصة</option>
                        </select>

                        {voiceInterviewTemplate === "custom" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 space-y-4"
                          >
                            <div className="bg-amber-50 dark:bg-amber-500/10 border-r-4 border-amber-500 p-4 rounded-l-xl">
                              <p className="text-sm font-bold text-amber-700 dark:text-amber-400 leading-relaxed flex items-center gap-2">
                                <span>⚠️</span> تنبيه: نظام الفرز يحلل نبرة الصوت والثقة ومهارات التواصل. يرجى طرح أسئلة تعتمد على المواقف السلوكية وتجنب الأسئلة المعرفية أو التقنية المعقدة لضمان دقة التحليل الآلي.
                              </p>
                            </div>
                            
                            {[0, 1].map((index) => (
                              <div key={index}>
                                <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">السؤال {index + 1}</label>
                                <textarea
                                  value={voiceInterviewQuestions[index] || ""}
                                  maxLength={150}
                                  onChange={(e) => {
                                    const newQuestions = [...voiceInterviewQuestions];
                                    newQuestions[index] = e.target.value;
                                    setVoiceInterviewQuestions(newQuestions);
                                  }}
                                  placeholder={`اكتب السؤال السلوكي رقم ${index + 1} هنا...`}
                                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none font-medium h-24"
                                />
                                <div className="text-left text-xs font-medium text-slate-400 mt-1">
                                  {(voiceInterviewQuestions[index] || "").length}/150
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </details>
              </div>
              </>
              )}

              {adType === "campaign" && (
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center gap-3">
                  {/* Toast message moved to the top of the roles list */}
                  {roles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingRole(false);
                        setEditingRoleId(null);
                        setRoleTitle("");
                        setRoleDesc("");
                        setRoleSummary("");
                        setResponsibilities("");
                        setQualifications("");
                        setBenefits("");
                        setAiInstructions("");
                        setSelectedSkills([]);
                        setCustomQuestions([]);
                        setRequiredAttachments(["سيرة ذاتية PDF"]);
                        setCustomAttachments([]);
                        setKnockoutQuestions([]);
                        setIsVoiceEnabled(true);
                        setPhotoRequirement("hidden");
                      }}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 transition-all shrink-0"
                    >
                      <X size={20} /> إلغاء
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveRole}
                    className="bg-mint dark:bg-[#065f46] text-employer-green dark:text-[#a7f3d0] px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl flex items-center gap-2 transition-all shrink-0"
                  >
                    {" "}
                    {editingRoleId ? (
                      <>
                        <Pencil size={20} /> حفظ التعديلات{" "}
                      </>
                    ) : (
                      <>
                        <Plus size={20} /> إضافة الدور{" "}
                      </>
                    )}
                  </button>{" "}
                </div>
              )}{" "}
            </div>
            )}

            {/* Global Settings Block */}
            {createJobType !== "quick_link" && (
            <div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6 mb-8 mt-8">
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
                <div>
                  <h4 className="font-bold text-navy dark:text-white text-lg flex items-center gap-2">
                    <Settings size={22} className="text-primary" />
                    تخطي صفحة الوصف (إعداد عام)
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">عند تفعيل هذا الخيار، سيتم توجيه المتقدمين مباشرة إلى صفحة تعبئة البيانات ورفع السيرة الذاتية متجاهلاً صفحة الهبوط الخاصة بتفاصيل الوظيفة أو البوابة بأكملها.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={directUpload} onChange={(e) => setDirectUpload(e.target.checked)} />
                  <div className="relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            )}

            {/* Card: Schedule */}
            <div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-3">
                  <Calendar className="text-primary" size={24} /> التواريخ والجدولة
                </h3>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <span className="ml-3 font-bold text-navy dark:text-white ml-3">إعلان مستمر (مفتوح دائماً)</span>
                  <input type="checkbox" className="sr-only peer" checked={isOpenEnded} onChange={(e) => setIsOpenEnded(e.target.checked)} />
                  <div className="relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className={`grid grid-cols-1 ${isOpenEnded ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-8`}>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1">
                    تاريخ ووقت بدء التقديم
                  </label>
                  <input
                    required
                    lang="en"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-left"
                    dir="ltr"
                  />
                </div>
                {!isOpenEnded && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-navy dark:text-white mr-1">
                      تاريخ ووقت انتهاء التقديم
                    </label>
                    <input
                      required
                      lang="en"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-left"
                      dir="ltr"
                    />
                  </div>
                )}
              </div>
              
              {isOpenEnded && (
                <p className="text-sm text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  (سيبقى هذا الإعلان متاحاً للمتقدمين حتى تقوم بإغلاقه يدوياً من لوحة التحكم)
                </p>
              )}
            </div>



            <div className="flex flex-col md:flex-row items-center justify-end gap-3 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); handleBackAttempt(); }}
                className="w-full md:w-auto bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all items-center gap-2"
              >
                إلغاء والعودة
              </button>
              
              <button
                type="button"
                onClick={() => setIsLivePreview(true)}
                className="w-full md:w-auto px-8 bg-white dark:bg-slate-800 border-2 border-primary text-primary py-4 rounded-xl text-lg font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
              >
                <Eye size={20} /> معاينة الإعلان حياً
              </button>

              {adType === "single" && (
                <>
                  {initialData?.status === "نشط" ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent("showToast", { detail: "تم إيقاف النشر والتحويل لمسودة" }));
                          setTimeout(() => {
                            // Saving with a new status "مسودة"
                            onSubmit({ ...baseJobData, status: "مسودة" } as any, initialData.id);
                          }, 1000);
                        }}
                        className="w-full md:w-auto bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-6 py-4 rounded-xl text-lg font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all items-center"
                      >
                        إيقاف النشر (تحويل لمسودة)
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent("showToast", { detail: "تم تحديث بيانات الإعلان بنجاح" }));
                          setTimeout(() => {
                            handleSubmit(e as unknown as React.FormEvent);
                          }, 1000);
                        }}
                        className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                      >
                        حفظ التعديلات
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                           window.dispatchEvent(new CustomEvent("showToast", { detail: "تم حفظ المسودة بنجاح" }));
                           handleSaveAsDraft();
                        }}
                        className="w-full md:w-auto bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all items-center"
                      >
                        حفظ كمسودة
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent("showToast", { detail: "تم نشر الإعلان بنجاح، هو الآن متاح للمتقدمين" }));
                          setTimeout(() => {
                             // Submitting without draft logic automatically uses IsComplete logic or manually injects status if needed over in App
                             onSubmit(baseJobData as any, initialData?.id);
                          }, 1000);
                        }}
                        className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                      >
                        نشر الإعلان الآن
                      </button>
                    </>
                  )}
                </>
              )}

              {adType !== "single" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent("showToast", { detail: "تم حفظ المسودة بنجاح" }));
                        handleSaveAsDraft();
                    }}
                    className="w-full md:w-auto bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all items-center"
                  >
                    حفظ كمسودة
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      if (adType !== "single") {
                        if (initialData?.status === "مسودة" || !initialData) {
                          window.dispatchEvent(new CustomEvent("showToast", { detail: "تم نشر الإعلان بنجاح، هو الآن متاح للمتقدمين" }));
                        } else {
                          window.dispatchEvent(new CustomEvent("showToast", { detail: "تم تحديث بيانات الإعلان بنجاح" }));
                        }
                      }
                    }}
                    className="w-full md:w-auto px-10 bg-primary text-white py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    نشر الإعلان الوظيفي
                  </button>
                </>
              )}
            </div>
          </form>{" "}
        </motion.div>{" "}
      </div>{" "}
      {isLivePreview && (
        <PreviewModal
          job={{
            id: "preview",
            title: roleTitle || "مسمى الوظيفة",
            company,
            location,
            companyLogo: companyLogo || undefined,
            type,
            status: "نشط",
            applicants: 0,
            createdAt: new Date().toISOString().split("T")[0],
            startDate,
            endDate,
            description: "",
            roleSummary,
            responsibilities,
            qualifications,
            benefits,
            aiInstructions: aiInstructions.trim(),
            skills: selectedSkills,
            languages: selectedLanguages,
            experience,
            qualification,
            salaryMax,
            isSalaryHidden,
            knockoutQuestions,
            targetMajors,
            locations,
            recordType: adType === "single" && createJobType === "quick_link" ? "quick_link" : adType,
            campaignTitle,
            campaignDescription,
            photoRequirement: adType === "single" ? photoRequirement : undefined,
            directUpload,
            requireVoiceInterview: adType === "single" ? isVoiceEnabled : false,
            roles:
              adType === "single"
                ? [
                    {
                      id: "r1",
                      title: roleTitle,
                      description: "",
                      roleSummary,
                      responsibilities,
                      qualifications,
                      benefits,
                      aiInstructions: aiInstructions.trim(),
                      skills: selectedSkills,
                      customQuestions,
                      requiredAttachments,
                      customAttachments,
                      targetMajors,
                      locations,
                    },
                  ]
                : roles,
          }}
          onClose={() => setIsLivePreview(false)}
        />
      )}{" "}
      <ImageLightbox url={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
    </div>
  );
};