var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/components/CreateJob.tsx
var CreateJob_exports = {};
__export(CreateJob_exports, {
  CreateJob: () => CreateJob,
  PublicJobPage: () => PublicJobPage,
  default: () => CreateJob_default
});
module.exports = __toCommonJS(CreateJob_exports);
var import_lucide_react = require("lucide-react");
var import_react = require("react");
var import_react2 = require("motion/react");
var import_Shared = require("../Shared");
var import_jsx_runtime = require("react/jsx-runtime");
var CreateJob = ({
  createJobType = "single",
  initialData = null,
  onBack,
  onSubmit,
  onAutoSaveDraft,
  userProfile,
  onGoToSettings
}) => {
  const [showConfirmModal, setShowConfirmModal] = (0, import_react.useState)(false);
  const [showUnsavedModal, setShowUnsavedModal] = (0, import_react.useState)(false);
  const handleBackAttempt = () => {
    const hasChanges = () => {
      const safeBaseRole = initialData?.recordType === "single" ? initialData.roles?.[0] || initialData : null;
      if (roleTitle.trim() !== (safeBaseRole?.title || "")) return true;
      if (roleDesc.trim() !== (safeBaseRole?.description || "")) return true;
      if (aiInstructions.trim() !== (safeBaseRole?.aiInstructions || "")) return true;
      if (campaignTitle.trim() !== (initialData?.campaignTitle || "")) return true;
      if (campaignDescription.trim() !== (initialData?.campaignDescription || "")) return true;
      const defaultCompany = initialData?.company || "\u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0638\u064A\u0641 \u0627\u0644\u0630\u0643\u064A";
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
  const [roleToDelete, setRoleToDelete] = (0, import_react.useState)(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = (0, import_react.useState)(
    initialData?.requireVoiceInterview ?? true
  );
  const [voiceInterviewTemplate, setVoiceInterviewTemplate] = (0, import_react.useState)(
    initialData?.voiceInterviewTemplate || "general"
  );
  const [voiceInterviewQuestions, setVoiceInterviewQuestions] = (0, import_react.useState)(
    initialData?.voiceInterviewQuestions || ["", ""]
  );
  const [directUpload, setDirectUpload] = (0, import_react.useState)(
    initialData?.directUpload || false
  );
  const [photoRequirement, setPhotoRequirement] = (0, import_react.useState)(
    initialData?.photoRequirement || "hidden"
  );
  const [isLivePreview, setIsLivePreview] = (0, import_react.useState)(false);
  const [isQuestionsExpanded, setIsQuestionsExpanded] = (0, import_react.useState)(false);
  const [isAttachmentsExpanded, setIsAttachmentsExpanded] = (0, import_react.useState)(false);
  const [campaignTitle, setCampaignTitle] = (0, import_react.useState)(
    initialData?.campaignTitle || ""
  );
  const [campaignDescription, setCampaignDescription] = (0, import_react.useState)(
    initialData?.campaignDescription || ""
  );
  const [adType, setAdType] = (0, import_react.useState)(createJobType === "campaign" || initialData?.recordType === "campaign" ? "campaign" : "single");
  const [enableWelcomeUI, setEnableWelcomeUI] = (0, import_react.useState)(!!initialData?.campaignTitle);
  const [company, setCompany] = (0, import_react.useState)(
    initialData?.company || "\u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0638\u064A\u0641 \u0627\u0644\u0630\u0643\u064A"
  );
  const [companyLogo, setCompanyLogo] = (0, import_react.useState)(() => {
    if (initialData?.companyLogo && !initialData.companyLogo.startsWith("blob:")) return initialData.companyLogo;
    const saved = localStorage.getItem("savedCompanyLogo");
    if (saved && saved.startsWith("blob:")) {
      localStorage.removeItem("savedCompanyLogo");
      return null;
    }
    return saved || null;
  });
  const [lightboxPhoto, setLightboxPhoto] = (0, import_react.useState)(null);
  const [currentDraftId, setCurrentDraftId] = (0, import_react.useState)(initialData?.status === "\u0645\u0633\u0648\u062F\u0629" ? initialData.id : null);
  const [type, setType] = (0, import_react.useState)(initialData?.type || "\u062F\u0648\u0627\u0645 \u0643\u0627\u0645\u0644");
  const [location, setLocation] = (0, import_react.useState)(initialData?.location || "");
  const [locations, setLocations] = (0, import_react.useState)(
    initialData?.locations || (initialData?.location ? [initialData.location] : [])
  );
  const [experience, setExperience] = (0, import_react.useState)(initialData?.experience || "\u0628\u062F\u0648\u0646 \u062E\u0628\u0631\u0629");
  const [qualification, setQualification] = (0, import_react.useState)(initialData?.qualification || "\u062B\u0627\u0646\u0648\u064A");
  const [salaryMin, setSalaryMin] = (0, import_react.useState)(initialData?.salaryMin || "");
  const [salaryMax, setSalaryMax] = (0, import_react.useState)(initialData?.salaryMax || "");
  const [isSalaryHidden, setIsSalaryHidden] = (0, import_react.useState)(initialData?.isSalaryHidden || false);
  const defaultStart = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16);
  const defaultEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString().slice(0, 16);
  const [startDate, setStartDate] = (0, import_react.useState)(
    initialData?.startDate || defaultStart
  );
  const [endDate, setEndDate] = (0, import_react.useState)(initialData?.endDate || defaultEnd);
  const [isOpenEnded, setIsOpenEnded] = (0, import_react.useState)(initialData ? !initialData.endDate : false);
  const baseRole = initialData?.recordType === "single" ? initialData.roles?.[0] || initialData : null;
  const [roleTitle, setRoleTitle] = (0, import_react.useState)(baseRole?.title || "");
  const [editingRoleId, setEditingRoleId] = (0, import_react.useState)(null);
  const [roleDesc, setRoleDesc] = (0, import_react.useState)(baseRole?.description || "");
  const [roleSummary, setRoleSummary] = (0, import_react.useState)(baseRole?.roleSummary || "");
  const [responsibilities, setResponsibilities] = (0, import_react.useState)(baseRole?.responsibilities || "");
  const [qualifications, setQualifications] = (0, import_react.useState)(baseRole?.qualifications || "");
  const [benefits, setBenefits] = (0, import_react.useState)(baseRole?.benefits || "");
  const [targetMajors, setTargetMajors] = (0, import_react.useState)(
    baseRole?.targetMajors || initialData?.targetMajors || []
  );
  const [newMajorInput, setNewMajorInput] = (0, import_react.useState)("");
  const [aiInstructions, setAiInstructions] = (0, import_react.useState)(baseRole?.aiInstructions || "");
  const [selectedSkills, setSelectedSkills] = (0, import_react.useState)(
    baseRole?.skills || []
  );
  const [selectedLanguages, setSelectedLanguages] = (0, import_react.useState)(
    baseRole?.languages || []
  );
  const [customSkill, setCustomSkill] = (0, import_react.useState)("");
  const [customQuestions, setCustomQuestions] = (0, import_react.useState)(baseRole?.customQuestions || []);
  const [newQuestionText, setNewQuestionText] = (0, import_react.useState)("");
  const [newQuestionType, setNewQuestionType] = (0, import_react.useState)("\u0646\u0635 \u0642\u0635\u064A\u0631");
  const [newQuestionOptions, setNewQuestionOptions] = (0, import_react.useState)([]);
  const [newOptionInput, setNewOptionInput] = (0, import_react.useState)("");
  const [newQuestionRequired, setNewQuestionRequired] = (0, import_react.useState)(false);
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = (0, import_react.useState)(() => {
    if (initialData && initialData.status === "\u0645\u0633\u0648\u062F\u0629") return false;
    return true;
  });
  (0, import_react.useEffect)(() => {
    if (localStorage.getItem("hasSeenAdvancedSettings") !== "true") {
      localStorage.setItem("hasSeenAdvancedSettings", "true");
    }
  }, []);
  const [knockoutQuestions, setKnockoutQuestions] = (0, import_react.useState)(baseRole?.knockoutQuestions || []);
  const [isKnockoutExpanded, setIsKnockoutExpanded] = (0, import_react.useState)(true);
  const [newKqText, setNewKqText] = (0, import_react.useState)("");
  const [newKqType, setNewKqType] = (0, import_react.useState)("yes_no");
  const [newKqOptions, setNewKqOptions] = (0, import_react.useState)([]);
  const [newKqOptionInput, setNewKqOptionInput] = (0, import_react.useState)("");
  const [newKqRequiredAnswer, setNewKqRequiredAnswer] = (0, import_react.useState)("\u0646\u0639\u0645");
  const [requiredAttachments, setRequiredAttachments] = (0, import_react.useState)(
    baseRole?.requiredAttachments || ["\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 PDF"]
  );
  const [portfolioRequirement, setPortfolioRequirement] = (0, import_react.useState)(
    baseRole?.portfolioRequirement || "optional"
  );
  const [customAttachments, setCustomAttachments] = (0, import_react.useState)(baseRole?.customAttachments || []);
  const [newAttachmentName, setNewAttachmentName] = (0, import_react.useState)("");
  const [newAttachmentType, setNewAttachmentType] = (0, import_react.useState)("");
  const [newAttachmentRequired, setNewAttachmentRequired] = (0, import_react.useState)(false);
  const [roles, setRoles] = (0, import_react.useState)(() => {
    if (initialData?.recordType === "campaign" && initialData.roles) {
      return initialData.roles.map((r) => ({
        ...r,
        id: Math.random().toString(36).substr(2, 9)
      }));
    }
    return [];
  });
  const [isAddingRole, setIsAddingRole] = (0, import_react.useState)(false);
  const [roleToastMessage, setRoleToastMessage] = (0, import_react.useState)(null);
  const handleSwitchToMultiple = () => {
    if (adType === "single" && (roleTitle.trim() || roleDesc.trim()) && roles.length === 0) {
      setRoles([
        {
          id: Math.random().toString(36).substr(2, 9),
          title: roleTitle || "\u0634\u0627\u063A\u0631 \u063A\u064A\u0631 \u0645\u0633\u0645\u0649",
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
      setRoleToastMessage("\u062A\u0645 \u062A\u062D\u0648\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0634\u0627\u063A\u0631 \u0644\u062A\u0643\u0648\u0646 \u0627\u0644\u062F\u0648\u0631 \u0627\u0644\u0623\u0648\u0644 \u0641\u064A \u0627\u0644\u062D\u0645\u0644\u0629");
      setTimeout(() => setRoleToastMessage(null), 3500);
    }
    setAdType("campaign");
  };
  const handleSwitchToSingle = () => {
    if (adType === "campaign" && roles.length > 0) {
      const firstRole = roles[0];
      setRoleTitle(firstRole.title === "\u0634\u0627\u063A\u0631 \u063A\u064A\u0631 \u0645\u0633\u0645\u0649" ? "" : firstRole.title);
      setRoleDesc(firstRole.description || "");
      if (firstRole.aiInstructions) setAiInstructions(firstRole.aiInstructions);
      if (firstRole.type) setType(firstRole.type);
      if (firstRole.location) setLocation(firstRole.location);
      if (firstRole.experience) setExperience(firstRole.experience);
      if (firstRole.qualification) setQualification(firstRole.qualification);
      if (firstRole.salaryMin) setSalaryMin(firstRole.salaryMin);
      if (firstRole.salaryMax) setSalaryMax(firstRole.salaryMax);
      if (firstRole.isSalaryHidden !== void 0) setIsSalaryHidden(firstRole.isSalaryHidden);
      if (firstRole.knockoutQuestions) setKnockoutQuestions(firstRole.knockoutQuestions);
      if (firstRole.skills) setSelectedSkills(firstRole.skills);
      if (firstRole.languages) setSelectedLanguages(firstRole.languages);
      if (firstRole.requireVoiceInterview !== void 0) setIsVoiceEnabled(firstRole.requireVoiceInterview);
      if (firstRole.voiceInterviewTemplate) setVoiceInterviewTemplate(firstRole.voiceInterviewTemplate);
      if (firstRole.voiceInterviewQuestions) setVoiceInterviewQuestions(firstRole.voiceInterviewQuestions);
      if (firstRole.photoRequirement !== void 0) setPhotoRequirement(firstRole.photoRequirement);
      if (firstRole.directUpload !== void 0) setDirectUpload(firstRole.directUpload);
      setRoleToastMessage("\u062A\u0645 \u0627\u0639\u062A\u0645\u0627\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0648\u0638\u064A\u0641\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0641\u0642\u0637 \u0644\u0644\u0625\u0639\u0644\u0627\u0646 \u0627\u0644\u0641\u0631\u062F\u064A");
      setTimeout(() => setRoleToastMessage(null), 3500);
    }
    setAdType("single");
  };
  const getSuggestions = () => {
    const normalizedTitle = roleTitle.trim();
    if (!normalizedTitle) return [];
    const matchedSkills = /* @__PURE__ */ new Set();
    for (const [key, skills] of Object.entries(import_Shared.skillsDictionary)) {
      if (normalizedTitle.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle.toLowerCase())) {
        skills.forEach((s) => matchedSkills.add(s));
      }
    }
    const userSaved = (0, import_Shared.getUserSavedSkills)();
    for (const [key, skills] of Object.entries(userSaved)) {
      if (normalizedTitle.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTitle.toLowerCase())) {
        skills.forEach((s) => matchedSkills.add(s));
      }
    }
    const suggestions = Array.from(matchedSkills);
    return suggestions.filter((s) => !selectedSkills.includes(s));
  };
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  const addCustomSkill = (e) => {
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
          ...newQuestionType === "\u062E\u064A\u0627\u0631\u0627\u062A \u0645\u062A\u0639\u062F\u062F\u0629" ? { options: newQuestionOptions } : newQuestionType === "\u0646\u0639\u0645 / \u0644\u0627" ? { options: ["\u0646\u0639\u0645", "\u0644\u0627"] } : {}
        }
      ]);
      setNewQuestionText("");
      setNewQuestionType("\u0646\u0635 \u0642\u0635\u064A\u0631");
      setNewQuestionOptions([]);
      setNewQuestionRequired(false);
    }
  };
  const addQuestionOption = (e) => {
    e.preventDefault();
    if (newOptionInput.trim() && !newQuestionOptions.includes(newOptionInput.trim())) {
      setNewQuestionOptions([...newQuestionOptions, newOptionInput.trim()]);
      setNewOptionInput("");
    }
  };
  const removeQuestionOption = (opt) => {
    setNewQuestionOptions(newQuestionOptions.filter((o) => o !== opt));
  };
  const removeCustomQuestion = (index) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };
  const toggleAttachment = (attachment) => {
    if (attachment === "\u0644\u0627 \u064A\u062A\u0637\u0644\u0628 \u0645\u0631\u0641\u0642\u0627\u062A") {
      setRequiredAttachments(["\u0644\u0627 \u064A\u062A\u0637\u0644\u0628 \u0645\u0631\u0641\u0642\u0627\u062A"]);
      return;
    }
    let newAttachments = requiredAttachments.filter(
      (a) => a !== "\u0644\u0627 \u064A\u062A\u0637\u0644\u0628 \u0645\u0631\u0641\u0642\u0627\u062A"
    );
    if (newAttachments.includes(attachment)) {
      newAttachments = newAttachments.filter((a) => a !== attachment);
    } else {
      newAttachments.push(attachment);
    }
    setRequiredAttachments(
      newAttachments.length > 0 ? newAttachments : ["\u0644\u0627 \u064A\u062A\u0637\u0644\u0628 \u0645\u0631\u0641\u0642\u0627\u062A"]
    );
  };
  const addCustomAttachment = () => {
    if (!newAttachmentName.trim()) {
      alert("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0627\u0633\u0645 \u0627\u0644\u0645\u0631\u0641\u0642.");
      return;
    }
    if (!newAttachmentType) {
      alert("\u064A\u0631\u062C\u0649 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0635\u064A\u063A\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u0644\u0645\u0631\u0641\u0642.");
      return;
    }
    setCustomAttachments([
      ...customAttachments,
      {
        attachment_name: newAttachmentName.trim(),
        attachment_type: newAttachmentType,
        required: newAttachmentRequired
      }
    ]);
    setNewAttachmentName("");
    setNewAttachmentType("");
    setNewAttachmentRequired(false);
  };
  const removeCustomAttachment = (idx) => {
    setCustomAttachments(customAttachments.filter((_, i) => i !== idx));
  };
  const handleEditRole = (role) => {
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
      setRequiredAttachments(["\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 PDF"]);
      setCustomAttachments([]);
      setKnockoutQuestions([]);
      setIsVoiceEnabled(true);
      setVoiceInterviewTemplate("general");
      setVoiceInterviewQuestions(["", ""]);
      setPhotoRequirement("hidden");
      setType("\u062F\u0648\u0627\u0645 \u0643\u0627\u0645\u0644");
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
    setRequiredAttachments(role.requiredAttachments || ["\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 PDF"]);
    setCustomAttachments(role.customAttachments || []);
    if (role.type) setType(role.type);
    if (role.location) setLocation(role.location);
    if (role.experience) setExperience(role.experience);
    if (role.qualification) setQualification(role.qualification);
    if (role.salaryMin) setSalaryMin(role.salaryMin);
    if (role.salaryMax) setSalaryMax(role.salaryMax);
    if (role.isSalaryHidden !== void 0) setIsSalaryHidden(role.isSalaryHidden);
    if (role.knockoutQuestions) setKnockoutQuestions(role.knockoutQuestions);
    setLocations(role.locations && role.locations.length > 0 ? role.locations : role.location ? [role.location] : []);
    setTargetMajors(role.targetMajors || []);
  };
  const handleSaveRole = () => {
    if (!roleTitle.trim() || !roleSummary.trim()) {
      alert("\u064A\u0631\u062C\u0649 \u062A\u0639\u0628\u0626\u0629 \u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A \u0648\u0646\u0628\u0630\u0629 \u0639\u0646 \u0627\u0644\u062F\u0648\u0631 \u0623\u0648\u0644\u0627\u064B");
      return;
    }
    if (selectedSkills.length === 0) {
      alert("\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u0636\u0627\u0641\u0629 \u0645\u0647\u0627\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644. \u0647\u0630\u0647 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0623\u0633\u0627\u0633\u064A\u0629 \u0644\u0639\u0645\u0644 \u0645\u062D\u0631\u0643 \u0627\u0644\u0641\u0631\u0632 \u0628\u062F\u0642\u0629.");
      return;
    }
    if (editingRoleId) {
      setRoles(roles.map((r) => r.id === editingRoleId ? {
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
        portfolioRequirement: requiredAttachments.includes("\u0631\u0627\u0628\u0637 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644/Portfolio") ? portfolioRequirement : void 0,
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
        targetMajors: [...targetMajors]
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
          portfolioRequirement: requiredAttachments.includes("\u0631\u0627\u0628\u0637 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644/Portfolio") ? portfolioRequirement : void 0,
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
          targetMajors: [...targetMajors]
        }
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
    setRequiredAttachments(["\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 PDF"]);
    setCustomAttachments([]);
    setType("\u062F\u0648\u0627\u0645 \u0643\u0627\u0645\u0644");
    setLocation("");
    setExperience("\u0628\u062F\u0648\u0646 \u062E\u0628\u0631\u0629");
    setQualification("\u062B\u0627\u0646\u0648\u064A");
    setSalaryMin("");
    setSalaryMax("");
    setLocations([]);
    setTargetMajors([]);
    setIsAddingRole(false);
    setRoleToastMessage(editingRoleId ? "\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0628\u0646\u062C\u0627\u062D" : "\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062F\u0648\u0631 \u0628\u0646\u062C\u0627\u062D");
    setTimeout(() => setRoleToastMessage(null), 3500);
  };
  const handleRemoveRole = (id) => {
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
        portfolioRequirement: requiredAttachments.includes("\u0631\u0627\u0628\u0637 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644/Portfolio") ? portfolioRequirement : void 0,
        customAttachments: [...customAttachments],
        type,
        location,
        experience,
        qualification,
        salaryMin,
        salaryMax,
        isSalaryHidden,
        knockoutQuestions
      });
    }
    if (adType === "single" || createJobType === "quick_link") {
      finalRoles = [
        {
          id: Math.random().toString(36).substr(2, 9),
          title: roleTitle.trim() || "\u0634\u0627\u063A\u0631 \u062C\u062F\u064A\u062F",
          description: "",
          roleSummary: roleSummary.trim(),
          responsibilities: responsibilities.trim(),
          qualifications: qualifications.trim(),
          benefits: benefits.trim(),
          aiInstructions: createJobType === "quick_link" ? "" : aiInstructions.trim(),
          skills: createJobType === "quick_link" ? [] : selectedSkills,
          customQuestions: createJobType === "quick_link" ? [] : customQuestions,
          requiredAttachments: createJobType === "quick_link" ? ["\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 PDF"] : requiredAttachments,
          portfolioRequirement: createJobType === "quick_link" ? void 0 : requiredAttachments.includes("\u0631\u0627\u0628\u0637 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644/Portfolio") ? portfolioRequirement : void 0,
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
          knockoutQuestions
        }
      ];
      if (!enableWelcomeUI && adType === "single" && createJobType !== "quick_link") {
        currentCampaignTitle = roleTitle.trim();
        currentCampaignDesc = roleDesc.trim();
      }
    }
    const currentDateStr = (/* @__PURE__ */ new Date()).toLocaleDateString("ar-EG", { day: "numeric", month: "long" });
    const defaultTitle = `\u0625\u0639\u0644\u0627\u0646 \u063A\u064A\u0631 \u0645\u0633\u0645\u0649 - ${currentDateStr}`;
    const mainTitle = (adType === "campaign" ? currentCampaignTitle : roleTitle) || defaultTitle;
    const mainDesc = adType === "campaign" ? currentCampaignDesc : "";
    const baseJobData2 = {
      recordType: adType === "single" && createJobType === "quick_link" ? "quick_link" : adType,
      campaignTitle: enableWelcomeUI ? campaignTitle : void 0,
      campaignDescription: enableWelcomeUI ? campaignDescription : void 0,
      roleSummary: roleSummary.trim(),
      responsibilities: responsibilities.trim(),
      qualifications: qualifications.trim(),
      benefits: benefits.trim(),
      description: mainDesc,
      roles: finalRoles,
      startDate,
      endDate: isOpenEnded ? void 0 : endDate,
      company: userProfile?.companyName || company,
      entityType: userProfile?.entityType,
      city: userProfile?.city,
      location: createJobType === "quick_link" ? "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F" : location,
      locations: createJobType === "quick_link" ? [] : locations,
      targetMajors,
      experience: createJobType === "quick_link" ? "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F" : experience,
      qualification: createJobType === "quick_link" ? "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F" : qualification,
      salaryMin: createJobType === "quick_link" ? void 0 : salaryMin,
      salaryMax: createJobType === "quick_link" ? void 0 : salaryMax,
      isSalaryHidden: createJobType === "quick_link" ? false : isSalaryHidden,
      knockoutQuestions: createJobType === "quick_link" ? [] : knockoutQuestions,
      type: createJobType === "quick_link" ? "\u062F\u0648\u0627\u0645 \u0643\u0627\u0645\u0644" : type,
      aiInstructions: createJobType === "quick_link" ? "" : aiInstructions.trim(),
      title: mainTitle,
      companyLogo: companyLogo || void 0,
      skills: createJobType === "quick_link" ? [] : selectedSkills,
      languages: selectedLanguages,
      customQuestions: createJobType === "quick_link" ? [] : customQuestions,
      requiredAttachments: createJobType === "quick_link" ? ["\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 PDF"] : requiredAttachments,
      directUpload: createJobType === "quick_link" ? false : directUpload,
      requireVoiceInterview: createJobType === "quick_link" ? false : isVoiceEnabled,
      voiceInterviewTemplate: createJobType === "quick_link" ? void 0 : voiceInterviewTemplate,
      voiceInterviewQuestions: createJobType === "quick_link" ? void 0 : voiceInterviewQuestions,
      photoRequirement: createJobType === "quick_link" ? "optional" : photoRequirement,
      portfolioRequirement: createJobType === "quick_link" ? void 0 : requiredAttachments.includes("\u0631\u0627\u0628\u0637 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644/Portfolio") ? portfolioRequirement : void 0
    };
    try {
      await fetch(
        "https://circular-struggle-ethical-membership.trycloudflare.com/webhook-test/2489027f-d077-4af4-9d3d-fc0dd9f38953",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "CreateJob", ...baseJobData2 })
        }
      );
    } catch (error) {
      console.error("Webhook error:", error);
    }
    (0, import_Shared.saveUserSkills)(mainTitle || roleTitle, selectedSkills);
    const isEditing = initialData && initialData.status !== "\u0645\u0633\u0648\u062F\u0629";
    window.dispatchEvent(new CustomEvent("showToast", { detail: isEditing ? "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0628\u0646\u062C\u0627\u062D" : "\u062A\u0645 \u0646\u0634\u0631 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0628\u0646\u062C\u0627\u062D\u060C \u0647\u0648 \u0627\u0644\u0622\u0646 \u0645\u062A\u0627\u062D \u0644\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646" }));
    const draftId = onSubmit(baseJobData2, currentDraftId || void 0);
    if (draftId) {
      setCurrentDraftId(draftId);
    }
  };
  const handleSaveAsDraft = () => {
    if (!roleTitle.trim() && !campaignTitle.trim() && company === "\u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0648\u0638\u064A\u0641 \u0627\u0644\u0630\u0643\u064A") {
      alert("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0628\u0639\u0636 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0644\u0644\u062D\u0641\u0638 \u0643\u0645\u0633\u0648\u062F\u0629.");
      return;
    }
    const finalRoles = adType === "single" ? [
      {
        id: editingRoleId || Math.random().toString(36).substr(2, 9),
        title: roleTitle.trim() || "\u0634\u0627\u063A\u0631 \u062C\u062F\u064A\u062F",
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
        photoRequirement
      }
    ] : roles.length > 0 ? roles : [];
    if (finalRoles.length === 0) return;
    const mainTitle = adType === "single" ? roleTitle : campaignTitle;
    const mainDesc = adType === "single" ? roleDesc : campaignDescription;
    const draftData = {
      recordType: adType === "single" && createJobType === "quick_link" ? "quick_link" : adType,
      campaignTitle: enableWelcomeUI ? campaignTitle : void 0,
      campaignDescription: enableWelcomeUI ? campaignDescription : void 0,
      roleSummary: roleSummary.trim(),
      responsibilities: responsibilities.trim(),
      qualifications: qualifications.trim(),
      benefits: benefits.trim(),
      roles: finalRoles,
      company,
      companyLogo: companyLogo || void 0,
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
      photoRequirement: createJobType === "single" ? photoRequirement : void 0,
      portfolioRequirement,
      startDate: startDate || void 0,
      endDate: isOpenEnded ? void 0 : endDate || void 0
    };
    if (onSubmit) {
      onSubmit({ ...draftData, status: "\u0645\u0633\u0648\u062F\u0629" }, currentDraftId || void 0);
      alert("\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0645\u0633\u0648\u062F\u0629 \u0628\u0646\u062C\u0627\u062D");
      if (typeof onBack === "function") onBack();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isMainFormEmpty = !roleTitle.trim() || !type.trim() || !location.trim() && locations.length === 0 || !experience.trim();
    if ((adType === "single" || createJobType === "quick_link") && isMainFormEmpty) {
      alert("\u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u0623\u0643\u062F \u0645\u0646 \u062A\u0639\u0628\u0626\u0629 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0625\u0644\u0632\u0627\u0645\u064A\u0629: (\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A\u060C \u0646\u0648\u0639 \u0627\u0644\u0639\u0645\u0644\u060C \u0645\u0642\u0631 \u0627\u0644\u0639\u0645\u0644\u060C \u0648\u0633\u0646\u0648\u0627\u062A \u0627\u0644\u062E\u0628\u0631\u0629).");
      return;
    }
    if (adType === "campaign" && roles.length === 0) {
      if (isMainFormEmpty) {
        alert("\u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u0623\u0643\u062F \u0645\u0646 \u062A\u0639\u0628\u0626\u0629 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0625\u0644\u0632\u0627\u0645\u064A\u0629: (\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A\u060C \u0646\u0648\u0639 \u0627\u0644\u0639\u0645\u0644\u060C \u0645\u0642\u0631 \u0627\u0644\u0639\u0645\u0644\u060C \u0648\u0633\u0646\u0648\u0627\u062A \u0627\u0644\u062E\u0628\u0631\u0629) \u0644\u0644\u062F\u0648\u0631 \u0627\u0644\u0648\u0638\u064A\u0641\u064A \u0627\u0644\u0623\u0648\u0644 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644.");
        return;
      }
      if (enableWelcomeUI && !campaignTitle.trim()) {
        alert("\u064A\u0631\u062C\u0649 \u062A\u0639\u0628\u0626\u0629 \u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0628\u0648\u0627\u0628\u0629/\u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0644\u0644\u062D\u0645\u0644\u0629.");
        return;
      }
    }
    if ((adType === "single" || createJobType === "quick_link" || adType === "campaign" && roles.length === 0 && roleTitle.trim()) && selectedSkills.length === 0) {
      alert("\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u0636\u0627\u0641\u0629 \u0645\u0647\u0627\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644. \u0647\u0630\u0647 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0623\u0633\u0627\u0633\u064A\u0629 \u0644\u0639\u0645\u0644 \u0645\u062D\u0631\u0643 \u0627\u0644\u0641\u0631\u0632 \u0628\u062F\u0642\u0629.");
      return;
    }
    let finalRoles = [...roles];
    if (adType === "campaign" && finalRoles.length === 0 && roleTitle.trim()) {
    } else if (adType === "campaign" && finalRoles.length === 0) {
      alert("\u064A\u0631\u062C\u0649 \u0625\u0636\u0627\u0641\u0629 \u062F\u0648\u0631 \u0648\u0638\u064A\u0641\u064A \u0648\u0627\u062D\u062F \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0644\u0644\u062D\u0645\u0644\u0629");
      return;
    }
    if (!isOpenEnded && endDate && new Date(endDate) <= new Date(startDate)) {
      alert("\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0628\u0639\u062F \u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0628\u062F\u0621");
      return;
    }
    setShowConfirmModal(true);
  };
  const showRoleForm = adType === "single" || createJobType === "quick_link" || isAddingRole || editingRoleId !== null || roles.length === 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "min-h-screen bg-slate-100 dark:bg-slate-900 p-8 pt-24 lg:pt-10", children: [
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react2.AnimatePresence, { children: [
      showConfirmModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_react2.motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          className: "bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-2xl font-black text-navy dark:text-white text-center mb-4", children: "\u062A\u0623\u0643\u064A\u062F \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0625\u0639\u0644\u0627\u0646" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 text-center mb-6 font-medium", children: "\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u0631\u063A\u0628\u062A\u0643 \u0641\u064A \u0625\u0646\u0634\u0627\u0621 \u0648\u0639\u0631\u0636 \u0647\u0630\u0627 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u061F" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8 max-h-48 overflow-y-auto", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-bold text-navy dark:text-white text-sm mb-3", children: "\u0627\u0644\u0645\u0633\u0645\u064A\u0627\u062A \u0627\u0644\u0648\u0638\u064A\u0641\u064A\u0629 \u0627\u0644\u0645\u064F\u0636\u0627\u0641\u0629:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "space-y-2", children: adType === "single" || createJobType === "quick_link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 rounded-full bg-primary shrink-0" }),
                roleTitle.trim() || "\u0634\u0627\u063A\u0631 \u062C\u062F\u064A\u062F"
              ] }) : roles.length > 0 ? roles.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 rounded-full bg-primary shrink-0" }),
                r.title || `\u0634\u0627\u063A\u0631 \u0631\u0642\u0645 ${i + 1}`
              ] }, i)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: "text-slate-400 text-sm font-medium", children: "\u0644\u0645 \u064A\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0634\u0648\u0627\u063A\u0631 \u0644\u0644\u062D\u0645\u0644\u0629 \u0628\u0639\u062F." }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: () => setShowConfirmModal(false),
                  className: "flex-1 px-4 py-3 rounded-xl font-bold border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all",
                  children: "\u062A\u0631\u0627\u062C\u0639"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: executePublishJob,
                  className: "flex-1 bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all",
                  children: "\u0646\u0639\u0645\u060C \u0623\u0646\u0634\u0626 \u0627\u0644\u0625\u0639\u0644\u0627\u0646"
                }
              )
            ] })
          ]
        }
      ) }),
      showUnsavedModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_react2.motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          className: "bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-2xl font-black text-navy dark:text-white text-center mb-4", children: "\u062A\u063A\u064A\u064A\u0631\u0627\u062A \u063A\u064A\u0631 \u0645\u062D\u0641\u0648\u0638\u0629!" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 text-center mb-8 font-medium leading-relaxed", children: "\u0644\u0642\u062F \u0642\u0645\u062A \u0628\u0625\u062C\u0631\u0627\u0621 \u062A\u063A\u064A\u064A\u0631\u0627\u062A. \u0625\u0630\u0627 \u063A\u0627\u062F\u0631\u062A \u0627\u0644\u0622\u0646\u060C \u0633\u064A\u062A\u0645 \u0641\u0642\u062F\u0627\u0646 \u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u064A \u0623\u062F\u062E\u0644\u062A\u0647\u0627." }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    e.preventDefault();
                    handleSaveAsDraft();
                    setShowUnsavedModal(false);
                  },
                  className: "w-full px-4 py-3.5 rounded-xl font-bold bg-primary text-white hover:bg-teal-600 shadow-md hover:shadow-lg transition-all",
                  children: "\u062D\u0641\u0638 \u0643\u0645\u0633\u0648\u062F\u0629 \u0648\u0627\u0644\u0645\u063A\u0627\u062F\u0631\u0629"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: () => setShowUnsavedModal(false),
                  className: "w-full px-4 py-3.5 rounded-xl font-bold bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all",
                  children: "\u0627\u0644\u0628\u0642\u0627\u0621 \u0641\u064A \u0627\u0644\u0635\u0641\u062D\u0629"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    e.preventDefault();
                    if (typeof onBack === "function") onBack();
                  },
                  className: "w-full px-4 py-3.5 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all",
                  children: "\u0645\u063A\u0627\u062F\u0631\u0629 \u0648\u062A\u062C\u0627\u0647\u0644 \u0627\u0644\u062A\u063A\u064A\u064A\u0631\u0627\u062A"
                }
              )
            ] })
          ]
        }
      ) }),
      roleToDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_react2.motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          className: "bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col items-center text-center space-y-4 mb-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 h-16 bg-red-100 dark:bg-red-900/50 text-red-500 rounded-full flex items-center justify-center mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 32 }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-2xl font-black text-navy dark:text-white", children: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0630\u0641" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 font-medium leading-relaxed", children: "\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u0631\u063A\u0628\u062A\u0643 \u0641\u064A \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u062F\u0648\u0631\u061F \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0625\u062C\u0631\u0627\u0621." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: () => setRoleToDelete(null),
                  className: "flex-1 px-4 py-3 rounded-xl font-bold border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all",
                  children: "\u0625\u0644\u063A\u0627\u0621"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    handleRemoveRole(roleToDelete);
                    setRoleToDelete(null);
                  },
                  className: "flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all",
                  children: "\u062D\u0630\u0641 \u0627\u0644\u062F\u0648\u0631"
                }
              )
            ] })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-5xl mx-auto pb-32", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            handleBackAttempt();
          },
          className: "flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary font-bold mb-8 transition-colors group",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white flex items-center justify-center group-hover:border-primary transition-all", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowLeft, { size: 18, className: "rotate-180" }) }),
            "\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645"
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_react2.motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "flex flex-col gap-6",
          children: [
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-10 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700", children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { className: "text-3xl font-bold text-navy dark:text-white", children: [
                " ",
                createJobType === "single" ? "\u0625\u0646\u0634\u0627\u0621 \u0634\u0627\u063A\u0631 \u0648\u0638\u064A\u0641\u064A" : createJobType === "quick_link" ? "\u0625\u0646\u0634\u0627\u0621 \u0631\u0627\u0628\u0637 \u062A\u0648\u0638\u064A\u0641 \u0633\u0631\u064A\u0639 \u26A1" : "\u0625\u0646\u0634\u0627\u0621 \u0625\u0639\u0644\u0627\u0646 \u0648\u0638\u064A\u0641\u064A",
                " "
              ] }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 mt-2 font-medium", children: "\u0623\u062F\u062E\u0644 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0648\u0638\u064A\u0641\u0629 \u0644\u0628\u062F\u0621 \u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 \u0648\u0641\u0631\u0632\u0647\u0645 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0628\u0643\u0641\u0627\u0621\u0629 \u0639\u0627\u0644\u064A\u0629." }),
              " "
            ] }),
            " ",
            createJobType !== "quick_link" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex bg-white dark:bg-slate-800 p-1.5 gap-1.5 rounded-2xl w-full shadow-sm border border-slate-200 dark:border-slate-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: handleSwitchToSingle,
                  className: `flex items-center justify-center gap-2.5 flex-1 px-8 py-3.5 rounded-xl font-bold text-sm md:text-base whitespace-nowrap transition-all ${adType === "single" ? "bg-primary text-white shadow-md" : "text-slate-500 hover:text-navy dark:hover:text-white"}`,
                  children: "\u0625\u0639\u0644\u0627\u0646 \u0644\u0634\u0627\u063A\u0631 \u0648\u0627\u062D\u062F"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: handleSwitchToMultiple,
                  className: `flex items-center justify-center gap-2.5 flex-1 px-8 py-3.5 rounded-xl font-bold text-sm md:text-base whitespace-nowrap transition-all ${adType === "campaign" ? "bg-primary text-white shadow-md" : "text-slate-500 hover:text-navy dark:hover:text-white"}`,
                  children: "\u0625\u0639\u0644\u0627\u0646 \u0644\u0639\u062F\u0629 \u0634\u0648\u0627\u063A\u0631 (\u062D\u0645\u0644\u0629 \u062A\u0648\u0638\u064A\u0641)"
                }
              )
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { className: "space-y-6", id: "createJobForm", onSubmit: handleSubmit, children: [
              createJobType !== "quick_link" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 mb-8 space-y-6", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "text-primary", size: 20 }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xl font-bold text-navy dark:text-white", children: [
                        "\u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u062A\u0631\u062D\u064A\u0628 \u0644\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal text-sm", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1", children: "\u0635\u0641\u062D\u0629 \u0647\u0628\u0648\u0637 \u0645\u062E\u0635\u0635\u0629 \u0644\u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 \u0642\u0628\u0644 \u062A\u0639\u0628\u0626\u0629 \u0627\u0644\u0646\u0645\u0648\u0630\u062C" })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "relative inline-flex items-center cursor-pointer select-none", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        type: "checkbox",
                        className: "sr-only peer",
                        checked: enableWelcomeUI,
                        onChange: (e) => setEnableWelcomeUI(e.target.checked)
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-3 text-sm font-bold text-slate-700 dark:text-slate-300", children: "\u062A\u0641\u0639\u064A\u0644 \u0647\u0630\u0647 \u0627\u0644\u0648\u0627\u062C\u0647\u0629" })
                  ] })
                ] }),
                enableWelcomeUI && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6", children: [
                  adType === "campaign" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1", children: [
                      "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 / \u0627\u0644\u0628\u0648\u0627\u0628\u0629 ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        required: true,
                        type: "text",
                        value: campaignTitle,
                        onChange: (e) => setCampaignTitle(e.target.value),
                        placeholder: "\u0645\u062B\u0627\u0644: \u0648\u0638\u064A\u0641\u0629 \u0634\u0627\u063A\u0631\u0629 - \u0645\u0628\u064A\u0639\u0627\u062A 2026...",
                        className: "w-full px-6 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1", children: [
                      "\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062A\u0631\u062D\u064A\u0628 ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "textarea",
                      {
                        required: true,
                        rows: 3,
                        value: campaignDescription,
                        onChange: (e) => setCampaignDescription(e.target.value),
                        placeholder: "\u0645\u062B\u0627\u0644: \u0646\u0628\u0630\u0629 \u0645\u062E\u062A\u0635\u0631\u0629 \u0644\u0644\u062A\u0631\u062D\u064A\u0628...",
                        className: "w-full px-6 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium resize-none"
                      }
                    )
                  ] })
                ] })
              ] }),
              createJobType === "quick_link" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-cyan-50 dark:bg-cyan-900/20 border-2 border-cyan-100 dark:border-cyan-800/50 p-6 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-5 shadow-sm mb-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-full flex items-center justify-center shrink-0 text-cyan-600 dark:text-cyan-400", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "animate-pulse", size: 24 }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center md:text-right flex-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-bold text-cyan-800 dark:text-cyan-400 text-lg mb-2 flex items-center justify-center md:justify-start gap-2", children: "\u{1F4A1} \u062A\u0646\u0628\u064A\u0647 \u0647\u0627\u0645 \u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-cyan-700 dark:text-cyan-300 font-medium text-[13px] leading-relaxed max-w-3xl border-r-2 border-cyan-200 dark:border-cyan-800/50 pr-4", children: [
                    "\u0623\u062F\u0627\u0629 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0633\u0631\u064A\u0639 \u0645\u0635\u0645\u0645\u0629 \u0644\u0625\u0639\u0637\u0627\u0621 ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold bg-cyan-100 dark:bg-cyan-900/50 px-1 rounded", children: "(\u062A\u0642\u064A\u064A\u0645 \u0645\u0628\u062F\u0626\u064A \u0644\u0645\u062F\u0649 \u0627\u0644\u0645\u0637\u0627\u0628\u0642\u0629)" }),
                    " \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0627\u0644\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0633\u0637\u062D\u064A\u0629 \u0644\u0644\u0633\u064A\u0631 \u0627\u0644\u0630\u0627\u062A\u064A\u0629 \u0648\u062A\u0648\u0641\u064A\u0631 \u0648\u0642\u062A\u0643. \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u0645\u0637\u0627\u0628\u0642\u0629 \u0648\u062A\u062D\u0644\u064A\u0644 \u062F\u0642\u064A\u0642 100%" }),
                    " \u0644\u0644\u0645\u0647\u0627\u0631\u0627\u062A \u0627\u0644\u0639\u0645\u064A\u0642\u0629\u060C \u064A\u0631\u062C\u0649 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u0633\u0627\u0631 (\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u062A\u0648\u0638\u064A\u0641 \u0627\u0644\u0634\u0627\u0645\u0644\u0629)."
                  ] })
                ] })
              ] }),
              createJobType !== "quick_link" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xl font-bold text-navy dark:text-white flex items-center gap-3 mb-6", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Briefcase, { className: "text-primary", size: 24 }),
                    " \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-6 md:col-span-2 mb-2 p-5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        "div",
                        {
                          className: `relative overflow-hidden w-20 h-20 p-0 rounded-2xl bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 flex items-center justify-center border-2 ${companyLogo ? "border-solid border-primary/20 cursor-pointer hover:border-primary/50" : "border-dashed"} transition-colors shrink-0 shadow-sm`,
                          onClick: () => {
                            if (companyLogo) setLightboxPhoto(companyLogo);
                          },
                          children: [
                            !companyLogo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "absolute inset-0 flex items-center justify-center cursor-pointer group", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "file", className: "hidden", accept: "image/*", onChange: (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const base64Url = reader.result;
                                    setCompanyLogo(base64Url);
                                    localStorage.setItem("savedCompanyLogo", base64Url);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              } }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Upload, { className: "text-slate-400 group-hover:text-primary transition-colors" })
                            ] }),
                            companyLogo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: companyLogo, className: "w-full h-full object-cover rounded-[inherit] drop-shadow-sm", alt: "Company Logo" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-bold text-navy dark:text-white mb-1", children: "\u0634\u0639\u0627\u0631 \u062C\u0647\u0629 \u0627\u0644\u062A\u0648\u0638\u064A\u0641" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-slate-500 dark:text-slate-400 mb-3", children: "\u064A\u0631\u0641\u0642 \u0647\u0630\u0627 \u0627\u0644\u0634\u0639\u0627\u0631 \u0641\u064A \u0635\u0641\u062D\u0629 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0648\u0638\u064A\u0641\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4", children: [
                          companyLogo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-xs font-bold text-primary hover:text-primary/80 cursor-pointer transition-colors", children: [
                            "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0634\u0639\u0627\u0631",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "file", className: "hidden", accept: "image/*", onChange: (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const base64Url = reader.result;
                                  setCompanyLogo(base64Url);
                                  localStorage.setItem("savedCompanyLogo", base64Url);
                                };
                                reader.readAsDataURL(file);
                              }
                            } })
                          ] }),
                          companyLogo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => {
                            setCompanyLogo(null);
                            localStorage.removeItem("savedCompanyLogo");
                          }, className: "text-xs font-bold text-red-500 hover:text-red-600 transition-colors", children: "\u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u0634\u0639\u0627\u0631" })
                        ] })
                      ] })
                    ] }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1", children: [
                        "\u0627\u0633\u0645 \u0627\u0644\u0634\u0631\u0643\u0629 / \u0627\u0644\u0641\u0631\u0639 ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                      ] }),
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "input",
                        {
                          required: true,
                          type: "text",
                          value: company,
                          onChange: (e) => setCompany(e.target.value),
                          placeholder: "\u0645\u062B\u0627\u0644: \u0634\u0631\u0643\u0629 \u0627\u0644\u062D\u0644\u0648\u0644 \u0627\u0644\u0630\u0643\u064A\u0629...",
                          className: "w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                        }
                      ),
                      " "
                    ] }),
                    " "
                  ] })
                ] }),
                roles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-8 space-y-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between font-bold text-navy dark:text-white", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
                      "\u0627\u0644\u0634\u0648\u0627\u063A\u0631 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 (",
                      roles.length,
                      "):"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.AnimatePresence, { children: roleToastMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      import_react2.motion.div,
                      {
                        initial: { opacity: 0, y: 10 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, scale: 0.95 },
                        className: "flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle, { size: 16 }),
                          roleToastMessage
                        ]
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid gap-4", children: [
                    roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "div",
                      {
                        className: "p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl flex items-center justify-between shadow-sm",
                        children: [
                          " ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                            " ",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-bold text-navy dark:text-white", children: r.title }),
                            " ",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-slate-500 dark:text-slate-300 line-clamp-1 mt-1", children: r.description }),
                            " "
                          ] }),
                          " ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  handleEditRole(r);
                                },
                                className: "w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-indigo-900/40 text-slate-500 dark:text-indigo-300 hover:bg-primary dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white transition-all shrink-0",
                                children: [
                                  " ",
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { size: 16 }),
                                  " "
                                ]
                              }
                            ),
                            " ",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                              "button",
                              {
                                type: "button",
                                onClick: () => setRoleToDelete(r.id),
                                className: "w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shrink-0",
                                children: [
                                  " ",
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 16 }),
                                  " "
                                ]
                              }
                            ),
                            " "
                          ] })
                        ]
                      },
                      r.id
                    )),
                    " "
                  ] }),
                  " ",
                  !showRoleForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setIsAddingRole(true);
                        setIsAdvancedSettingsOpen(true);
                        setEditingRoleId(null);
                        setType("\u062F\u0648\u0627\u0645 \u0643\u0627\u0645\u0644");
                        setLocation("");
                        setExperience("\u0628\u062F\u0648\u0646 \u062E\u0628\u0631\u0629");
                        setQualification("\u062B\u0627\u0646\u0648\u064A");
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
                        setRequiredAttachments(["\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 PDF"]);
                        setCustomAttachments([]);
                      },
                      className: "mt-6 border-2 border-dashed border-primary/30 text-primary hover:bg-primary hover:text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 w-full shadow-sm",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 20 }),
                        " \u0625\u0636\u0627\u0641\u0629 \u062F\u0648\u0631 \u0648\u0638\u064A\u0641\u064A \u062C\u062F\u064A\u062F"
                      ]
                    }
                  )
                ] }),
                " "
              ] }),
              showRoleForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xl font-bold text-navy dark:text-white flex items-center justify-between mb-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Users, { className: "text-primary", size: 24 }),
                    " \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0623\u062F\u0648\u0627\u0631 \u0648\u0627\u0644\u0645\u062A\u0637\u0644\u0628\u0627\u062A"
                  ] }),
                  adType === "campaign" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs md:text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold", children: [
                    "\u0627\u0644\u0634\u0627\u063A\u0631 \u0631\u0642\u0645 ",
                    editingRoleId ? roles.findIndex((r) => r.id === editingRoleId) + 1 : roles.length + 1
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-500 mb-6 px-1", children: "(\u062A\u0646\u0628\u064A\u0647: \u0647\u0630\u0647 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0623\u0633\u0627\u0633\u064A\u0629 \u0644\u0639\u0645\u0644 \u0645\u062D\u0631\u0643 \u0627\u0644\u0641\u0631\u0632 \u0628\u062F\u0642\u0629\u060C \u062D\u062A\u0649 \u0648\u0625\u0646 \u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u062E\u0627\u0635\u064A\u0629 \u0627\u0644\u062A\u062E\u0637\u064A \u0644\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1", children: [
                    "\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A (Role) ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                  ] }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "input",
                    {
                      type: "text",
                      value: roleTitle,
                      onChange: (e) => setRoleTitle(e.target.value),
                      placeholder: "\u0645\u062B\u0627\u0644: \u0645\u0646\u062F\u0648\u0628 \u0645\u0628\u064A\u0639\u0627\u062A",
                      className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium"
                    }
                  ),
                  " "
                ] }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mt-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1", children: [
                      "\u0646\u0648\u0639 \u0627\u0644\u0639\u0645\u0644 ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "select",
                      {
                        value: type,
                        onChange: (e) => setType(e.target.value),
                        className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none font-medium",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u062F\u0648\u0627\u0645 \u0643\u0627\u0645\u0644" }),
                          " ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u062F\u0648\u0627\u0645 \u062C\u0632\u0626\u064A" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0639\u0646 \u0628\u0639\u062F" }),
                          " ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u062A\u062F\u0631\u064A\u0628" })
                        ]
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1", children: [
                      "\u0645\u0642\u0631 \u0627\u0644\u0639\u0645\u0644 / \u0627\u0644\u0645\u062F\u0646 ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_Shared.SearchableSelect,
                      {
                        options: import_Shared.SAUDI_CITIES.filter((c) => !locations.includes(c)),
                        value: "",
                        onChange: (val) => {
                          if (val && !locations.includes(val)) {
                            setLocations([...locations, val]);
                            setLocation(val);
                          }
                        },
                        placeholder: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u062F\u0646..."
                      }
                    ),
                    locations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2 mt-2 pt-1 border-t border-slate-100 dark:border-slate-800", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.AnimatePresence, { children: locations.map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      import_react2.motion.span,
                      {
                        initial: { scale: 0.8, opacity: 0 },
                        animate: { scale: 1, opacity: 1 },
                        exit: { scale: 0.8, opacity: 0 },
                        className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-bold",
                        children: [
                          loc,
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                const newLocs = locations.filter((l) => l !== loc);
                                setLocations(newLocs);
                                if (newLocs.length > 0) setLocation(newLocs[0]);
                                else setLocation("");
                              },
                              className: "hover:text-red-500 transition-colors p-0.5",
                              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 14 })
                            }
                          )
                        ]
                      },
                      loc
                    )) }) })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1", children: [
                      "\u0633\u0646\u0648\u0627\u062A \u0627\u0644\u062E\u0628\u0631\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "select",
                      {
                        value: experience,
                        onChange: (e) => setExperience(e.target.value),
                        className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none font-medium",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0628\u062F\u0648\u0646 \u062E\u0628\u0631\u0629" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "1-3 \u0633\u0646\u0648\u0627\u062A" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "3-5 \u0633\u0646\u0648\u0627\u062A" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "5+ \u0633\u0646\u0648\u0627\u062A" })
                        ]
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1", children: [
                      "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u0645\u0624\u0647\u0644 ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "select",
                      {
                        value: qualification,
                        onChange: (e) => setQualification(e.target.value),
                        className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none font-medium",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u062B\u0627\u0646\u0648\u064A" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u062F\u0628\u0644\u0648\u0645" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0645\u0627\u062C\u0633\u062A\u064A\u0631" })
                        ]
                      }
                    ) })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-6 space-y-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1", children: [
                    "\u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0647\u062F\u0641\u0629 ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal ml-1 text-xs", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "relative group inline-flex items-center ml-1", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { size: 14, className: "text-slate-400 group-hover:text-primary transition-colors cursor-help" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none", children: [
                        "\u0627\u062A\u0631\u0643 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0641\u0627\u0631\u063A\u0627\u064B \u0625\u0630\u0627 \u0643\u0627\u0646\u062A \u0627\u0644\u0648\u0638\u064A\u0641\u0629 \u062A\u0642\u0628\u0644 \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A \u0644\u062A\u0648\u0633\u064A\u0639 \u0646\u0637\u0627\u0642 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 \u0641\u064A \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A.",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        type: "text",
                        value: newMajorInput,
                        onChange: (e) => setNewMajorInput(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newMajorInput.trim() && !targetMajors.includes(newMajorInput.trim())) {
                              setTargetMajors([...targetMajors, newMajorInput.trim()]);
                              setNewMajorInput("");
                            }
                          }
                        },
                        onPaste: (e) => {
                          e.preventDefault();
                          const paste = e.clipboardData.getData("text");
                          if (paste) {
                            const newMajors = paste.split(/[,\n؛،]/).map((m) => m.trim()).filter((m) => m.length > 0 && !targetMajors.includes(m));
                            if (newMajors.length > 0) {
                              setTargetMajors((prev) => [...prev, ...newMajors]);
                            }
                          }
                        },
                        placeholder: "\u0645\u062B\u0627\u0644: \u0647\u0646\u062F\u0633\u0629 \u0628\u0631\u0645\u062C\u064A\u0627\u062A\u060C \u062A\u0633\u0648\u064A\u0642...",
                        className: "flex-1 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          if (newMajorInput.trim() && !targetMajors.includes(newMajorInput.trim())) {
                            setTargetMajors([...targetMajors, newMajorInput.trim()]);
                            setNewMajorInput("");
                          }
                        },
                        className: "px-6 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all font-bold flex items-center justify-center",
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 20 })
                      }
                    )
                  ] }),
                  targetMajors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2 mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.AnimatePresence, { children: targetMajors.map((major) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    import_react2.motion.span,
                    {
                      layout: true,
                      initial: { scale: 0.8, opacity: 0 },
                      animate: { scale: 1, opacity: 1 },
                      exit: { scale: 0.8, opacity: 0 },
                      className: "flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all",
                      children: [
                        major,
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          "button",
                          {
                            type: "button",
                            onClick: () => setTargetMajors(targetMajors.filter((m) => m !== major)),
                            className: "hover:text-red-500 transition-colors p-0.5",
                            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 14 })
                          }
                        )
                      ]
                    },
                    major
                  )) }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-6 space-y-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 block", children: "\u0646\u0637\u0627\u0642 \u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u0645\u062A\u0648\u0642\u0639 (\u0631\u064A\u0627\u0644)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-start", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs text-slate-500 font-bold block", children: "\u0627\u0644\u0631\u0627\u062A\u0628 \u0627\u0644\u0623\u0633\u0627\u0633\u064A" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "input",
                        {
                          required: false,
                          type: "number",
                          value: salaryMin,
                          onChange: (e) => setSalaryMin(e.target.value),
                          placeholder: "\u0645\u062B\u0627\u0644: 5000",
                          className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs text-slate-500 font-bold block", children: [
                        "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0639\u0644\u0649 ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal ml-1", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "input",
                        {
                          type: "number",
                          value: salaryMax,
                          onChange: (e) => setSalaryMax(e.target.value),
                          placeholder: "\u0645\u062B\u0627\u0644: 8000",
                          className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative mt-2 flex items-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "relative inline-flex items-center cursor-pointer select-none", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", className: "sr-only peer", checked: isSalaryHidden, onChange: (e) => setIsSalaryHidden(e.target.checked) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-3 text-sm font-bold text-slate-700 dark:text-slate-300", children: "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0631\u0627\u062A\u0628 \u0639\u0646 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 (\u064A\u064F\u0633\u062A\u062E\u062F\u0645 \u0644\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A \u0641\u0642\u0637)" })
                  ] }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6 mt-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-bold text-navy dark:text-white text-lg mb-4", children: "\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0648\u0638\u064A\u0641\u064A\u0629 (\u0645\u0646\u0647\u062C\u064A\u0629 ATS)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1", children: [
                        "\u0646\u0628\u0630\u0629 \u0639\u0646 \u0627\u0644\u062F\u0648\u0631 ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal text-xs ml-1", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "relative group inline-flex items-center ml-1", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { size: 14, className: "text-slate-400 group-hover:text-primary transition-colors cursor-help" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none", children: [
                            "\u062A\u0631\u0643 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0641\u0627\u0631\u063A\u0627\u064B \u0633\u064A\u062C\u0639\u0644 \u0645\u062D\u0631\u0643 \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u064A\u0639\u062A\u0645\u062F \u0639\u0644\u0649 \u0627\u0644\u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u0642\u064A\u0627\u0633\u064A\u0629 \u0644\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A. \u0644\u062A\u0642\u064A\u064A\u0645 \u0623\u062F\u0642\u060C \u0623\u0636\u0641 \u0646\u0628\u0630\u0629 \u0645\u062E\u062A\u0635\u0631\u0629.",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5" })
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "textarea",
                        {
                          rows: 3,
                          value: roleSummary,
                          onChange: (e) => setRoleSummary(e.target.value),
                          placeholder: "\u0645\u062B\u0627\u0644: \u0646\u0628\u062D\u062B \u0639\u0646 \u0645\u0648\u0638\u0641 \u0637\u0645\u0648\u062D \u0644\u0625\u062F\u0627\u0631\u0629 \u0639\u0644\u0627\u0642\u0627\u062A \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0641\u064A \u0641\u0631\u0639\u0646\u0627 \u0627\u0644\u0631\u0626\u064A\u0633\u064A...",
                          className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1", children: [
                      "\u0627\u0644\u0645\u0647\u0627\u0645 \u0648\u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0627\u062A ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal text-xs ml-1", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "relative group inline-flex items-center ml-1", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { size: 14, className: "text-slate-400 group-hover:text-primary transition-colors cursor-help" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none", children: [
                          "\u064A\u0641\u0636\u0644 \u0625\u0636\u0627\u0641\u062A\u0647\u0627 \u0641\u064A \u0634\u0643\u0644 \u0646\u0642\u0627\u0637 \u0644\u0644\u0648\u0638\u0627\u0626\u0641 \u0627\u0644\u0625\u062F\u0627\u0631\u064A\u0629 \u0623\u0648 \u0627\u0644\u0645\u062A\u062E\u0635\u0635\u0629 \u0644\u0631\u0641\u0639 \u062F\u0642\u0629 \u0645\u0637\u0627\u0628\u0642\u0629 \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A.",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5" })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "textarea",
                      {
                        rows: 4,
                        value: responsibilities,
                        onChange: (e) => setResponsibilities(e.target.value),
                        placeholder: "\u0645\u062B\u0627\u0644: - \u062A\u062D\u0642\u064A\u0642 \u0623\u0647\u062F\u0627\u0641 \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A \u0627\u0644\u0634\u0647\u0631\u064A\u0629. - \u0625\u0639\u062F\u0627\u062F \u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u0623\u062F\u0627\u0621...",
                        className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1", children: [
                      "\u0627\u0644\u0645\u0624\u0647\u0644\u0627\u062A \u0648\u0627\u0644\u0645\u062A\u0637\u0644\u0628\u0627\u062A ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal text-xs ml-1", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "relative group inline-flex items-center ml-1", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { size: 14, className: "text-slate-400 group-hover:text-primary transition-colors cursor-help" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none", children: [
                          "\u0623\u0636\u0641 \u0627\u0644\u0645\u0624\u0647\u0644\u0627\u062A \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u064A\u062A\u0645 \u0623\u062E\u0630\u0647\u0627 \u0628\u0639\u064A\u0646 \u0627\u0644\u0627\u0639\u062A\u0628\u0627\u0631 \u0641\u064A \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A.",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5" })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "textarea",
                      {
                        rows: 4,
                        value: qualifications,
                        onChange: (e) => setQualifications(e.target.value),
                        placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0644\u0645\u0624\u0647\u0644\u0627\u062A \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 (\u0643\u0644 \u0633\u0637\u0631 \u064A\u0639\u062A\u0628\u0631 \u0634\u0631\u0637\u0627\u064B \u0645\u0633\u062A\u0642\u0644\u0627\u064B)...",
                        className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 mb-2 flex items-center gap-1", children: [
                      "\u0627\u0644\u0645\u0645\u064A\u0632\u0627\u062A ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal text-xs ml-1", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "textarea",
                      {
                        rows: 3,
                        value: benefits,
                        onChange: (e) => setBenefits(e.target.value),
                        placeholder: "\u0645\u062B\u0627\u0644: \u062A\u0623\u0645\u064A\u0646 \u0637\u0628\u064A \u0641\u0626\u0629 A\u060C \u0639\u0645\u0648\u0644\u0627\u062A \u0645\u0628\u064A\u0639\u0627\u062A \u062A\u0635\u0644 \u0625\u0644\u0649 10%\u060C \u0633\u064A\u0627\u0631\u0629...",
                        className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                      }
                    )
                  ] })
                ] }),
                createJobType !== "quick_link" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700/60 mt-8", children: [
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2", children: [
                      "\u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0647\u062F\u0641\u0629 ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal text-xs ml-1", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "relative group inline-flex items-center ml-1", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { size: 14, className: "text-slate-400 group-hover:text-primary transition-colors cursor-help" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none", children: [
                          "\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0642\u0646\u064A\u0629 \u0627\u0644\u062F\u0642\u064A\u0642\u0629 \u064A\u062C\u0639\u0644 \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A \u0623\u0643\u062B\u0631 \u0635\u0631\u0627\u0645\u0629 \u0648\u062F\u0642\u0629.",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5" })
                        ] })
                      ] })
                    ] }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-2 min-h-[60px] p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl", children: [
                      " ",
                      selectedSkills.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm text-slate-400 dark:text-slate-500 py-2", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0647\u0627\u0631\u0627\u062A." }),
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react2.AnimatePresence, { children: [
                        " ",
                        selectedSkills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                          import_react2.motion.button,
                          {
                            layout: true,
                            initial: { scale: 0.8, opacity: 0 },
                            animate: { scale: 1, opacity: 1 },
                            exit: { scale: 0.8, opacity: 0 },
                            type: "button",
                            onClick: () => toggleSkill(skill),
                            className: "flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all",
                            children: [
                              " ",
                              skill,
                              " ",
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 14 }),
                              " "
                            ]
                          },
                          skill
                        )),
                        " "
                      ] }),
                      " "
                    ] }),
                    " ",
                    getSuggestions().length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3 p-4 bg-primary/5 rounded-2xl border border-primary/10", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs font-bold text-primary mr-1 flex items-center gap-2", children: [
                        " ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { size: 14 }),
                        " \u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A \u0630\u0643\u064A\u0629:",
                        " "
                      ] }),
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-2", children: [
                        " ",
                        getSuggestions().map((suggestion) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                          "button",
                          {
                            type: "button",
                            onClick: () => toggleSkill(suggestion),
                            className: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold hover:border-primary hover:text-primary transition-all shadow-sm",
                            children: [
                              " ",
                              "+ ",
                              suggestion,
                              " "
                            ]
                          },
                          suggestion
                        )),
                        " "
                      ] }),
                      " "
                    ] }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "input",
                        {
                          type: "text",
                          value: customSkill,
                          onChange: (e) => setCustomSkill(e.target.value),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomSkill(e);
                            }
                          },
                          onPaste: (e) => {
                            e.preventDefault();
                            const paste = e.clipboardData.getData("text");
                            if (paste) {
                              const newSkills = paste.split(/[,\n،]/).map((s) => s.trim()).filter((s) => s.length > 0 && !selectedSkills.includes(s));
                              if (newSkills.length > 0) {
                                setSelectedSkills((prev) => [...prev, ...newSkills]);
                              }
                            }
                          },
                          placeholder: "\u0623\u0636\u0641 \u0645\u0647\u0627\u0631\u0629...",
                          className: "w-full pr-6 pl-14 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium"
                        }
                      ),
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "button",
                        {
                          type: "button",
                          onClick: addCustomSkill,
                          className: "absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary transition-all",
                          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 20 })
                        }
                      ),
                      " "
                    ] }),
                    " "
                  ] }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/60 flex flex-col gap-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1", children: [
                      "\u0627\u0644\u0644\u063A\u0627\u062A \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-400 font-normal ml-1", children: "(\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2 mb-2", children: selectedLanguages.map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "bg-primary text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm", children: [
                      lang,
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => setSelectedLanguages(selectedLanguages.filter((l) => l !== lang)), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 12 }) })
                    ] }, lang)) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "select",
                      {
                        value: "",
                        onChange: (e) => {
                          const val = e.target.value;
                          if (val && !selectedLanguages.includes(val)) {
                            setSelectedLanguages([...selectedLanguages, val]);
                          }
                        },
                        className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium appearance-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", disabled: true, className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0627\u062E\u062A\u0631 \u0644\u063A\u0629 \u0644\u0625\u0636\u0627\u0641\u062A\u0647\u0627..." }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", children: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629", children: "\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0641\u0631\u0646\u0633\u064A\u0629", children: "\u0627\u0644\u0641\u0631\u0646\u0633\u064A\u0629" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0625\u0633\u0628\u0627\u0646\u064A\u0629", children: "\u0627\u0644\u0625\u0633\u0628\u0627\u0646\u064A\u0629" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0647\u0646\u062F\u064A\u0629", children: "\u0627\u0644\u0647\u0646\u062F\u064A\u0629" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", value: "\u0627\u0644\u0623\u0648\u0631\u062F\u0648", children: "\u0627\u0644\u0623\u0648\u0631\u062F\u0648" })
                        ]
                      }
                    ) })
                  ] }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/60 flex flex-col gap-6", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mb-4 block flex items-center gap-2", children: "\u0627\u0644\u0645\u0631\u0641\u0642\u0627\u062A \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                        " ",
                        [
                          { id: "\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 PDF", title: "\u0645\u0644\u0641 \u0627\u0644\u0633\u064A\u0631\u0629 \u0627\u0644\u0630\u0627\u062A\u064A\u0629", subtitle: "(\u064A\u064F\u0642\u0628\u0644 \u0645\u0644\u0641\u0627\u062A PDF \u0648 DOCX \u0641\u0642\u0637)" },
                          { id: "\u0631\u0627\u0628\u0637 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644/Portfolio", title: "\u0631\u0627\u0628\u0637 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644/Portfolio" },
                          { id: "\u0644\u0627 \u064A\u062A\u0637\u0644\u0628 \u0645\u0631\u0641\u0642\u0627\u062A", title: "\u0644\u0627 \u064A\u062A\u0637\u0644\u0628 \u0645\u0631\u0641\u0642\u0627\u062A" }
                        ].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                            "label",
                            {
                              className: `flex flex-col items-center justify-center text-center gap-1 ${opt.id === "\u0631\u0627\u0628\u0637 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644/Portfolio" && requiredAttachments.includes(opt.id) ? "pt-4 pb-12" : "p-4"} h-full rounded-2xl border cursor-pointer transition-all ${requiredAttachments.includes(opt.id) ? "bg-primary/5 border-primary text-primary" : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-navy dark:text-white dark:bg-slate-800/50 dark:hover:bg-slate-700 dark:border-slate-700"}`,
                              children: [
                                " ",
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                  "input",
                                  {
                                    type: "checkbox",
                                    className: "hidden",
                                    checked: requiredAttachments.includes(opt.id),
                                    onChange: () => toggleAttachment(opt.id)
                                  }
                                ),
                                " ",
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-sm", children: opt.title }),
                                " ",
                                opt.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-[10px] sm:text-xs text-slate-400 font-medium", children: opt.subtitle })
                              ]
                            }
                          ),
                          opt.id === "\u0631\u0627\u0628\u0637 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644/Portfolio" && requiredAttachments.includes(opt.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                            "select",
                            {
                              value: portfolioRequirement,
                              onChange: (e) => {
                                e.stopPropagation();
                                setPortfolioRequirement(e.target.value);
                              },
                              className: "w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg py-1 px-2 text-navy dark:text-white outline-none cursor-pointer",
                              children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "optional", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0627\u062E\u062A\u064A\u0627\u0631\u064A" }),
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "required", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0625\u0644\u0632\u0627\u0645\u064A" })
                              ]
                            }
                          ) })
                        ] }, opt.id)),
                        " "
                      ] }),
                      " "
                    ] }),
                    " ",
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/30 overflow-hidden", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        "button",
                        {
                          type: "button",
                          onClick: () => setIsAttachmentsExpanded(!isAttachmentsExpanded),
                          className: "w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-transparent transition-all group outline-none",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-navy dark:text-white flex items-center gap-2", children: "\u0627\u0644\u0645\u0631\u0641\u0642\u0627\u062A \u0627\u0644\u0645\u062E\u0635\u0635\u0629 - \u0627\u062E\u062A\u064A\u0627\u0631\u064A" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              import_lucide_react.ChevronDown,
                              {
                                className: `text-slate-400 group-hover:text-primary transition-transform duration-300 ${isAttachmentsExpanded ? "rotate-180" : ""}`,
                                size: 20
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.AnimatePresence, { children: isAttachmentsExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_react2.motion.div,
                        {
                          initial: { height: 0, opacity: 0 },
                          animate: { height: "auto", opacity: 1 },
                          exit: { height: 0, opacity: 0 },
                          transition: { duration: 0.3, ease: "easeInOut" },
                          className: "border-t border-slate-200 dark:border-slate-700",
                          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-6 flex flex-col gap-4 bg-white dark:bg-slate-800/50", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                              " ",
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1", children: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0631\u0641\u0642\u0627\u062A \u0645\u062E\u0635\u0635\u0629 \u062C\u062F\u064A\u062F\u0629" }),
                              " ",
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs text-slate-400 dark:text-slate-500 font-medium", children: "\u0623\u0636\u0641 \u0645\u0631\u0641\u0642\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629 \u063A\u064A\u0631 \u0627\u0644\u0645\u0630\u0643\u0648\u0631\u0629 \u0623\u0639\u0644\u0627\u0647 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }),
                              " "
                            ] }),
                            " ",
                            customAttachments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3 mb-2", children: [
                              " ",
                              customAttachments.map((att, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                "div",
                                {
                                  className: "flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl gap-4",
                                  children: [
                                    " ",
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col", children: [
                                      " ",
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-navy dark:text-white text-sm", children: att.attachment_name }),
                                      " ",
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs text-primary font-medium", children: [
                                        "\u0627\u0644\u0646\u0648\u0639:",
                                        " ",
                                        att.attachment_type === "file" ? "\u0645\u0644\u0641 PDF" : att.attachment_type === "mixed_file" ? "\u0645\u0633\u062A\u0646\u062F \u0623\u0648 \u0635\u0648\u0631\u0629 (PDF/JPG)" : att.attachment_type === "link" ? "\u0631\u0627\u0628\u0637 Link" : att.attachment_type === "image" ? "\u0635\u0648\u0631\u0629 (Image - JPG/PNG)" : att.attachment_type === "video" ? "\u0641\u064A\u062F\u064A\u0648 \u0642\u0635\u064A\u0631 (Video - MP4)" : "\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0623\u062E\u0631\u0649 (Word / Excel)"
                                      ] }),
                                      " ",
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-300", children: "\u2022" }),
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: att.required ? "text-red-500 text-xs font-medium" : "text-slate-400 text-xs font-medium", children: att.required ? "\u0625\u0644\u0632\u0627\u0645\u064A" : "\u0627\u062E\u062A\u064A\u0627\u0631\u064A" })
                                    ] }),
                                    " ",
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: () => removeCustomAttachment(idx),
                                        className: "w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0",
                                        children: [
                                          " ",
                                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 14 }),
                                          " "
                                        ]
                                      }
                                    ),
                                    " "
                                  ]
                                },
                                idx
                              )),
                              " "
                            ] }),
                            " ",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row items-center gap-4 w-full", children: [
                              " ",
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl shrink-0 h-[58px]", children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                  "input",
                                  {
                                    type: "checkbox",
                                    id: "attRequired",
                                    checked: newAttachmentRequired,
                                    onChange: (e) => setNewAttachmentRequired(e.target.checked),
                                    className: "w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                  }
                                ),
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "attRequired", className: "text-sm font-bold text-navy dark:text-white cursor-pointer whitespace-nowrap", children: "\u0625\u0631\u0641\u0627\u0642 \u0625\u0644\u0632\u0627\u0645\u064A" })
                              ] }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                "input",
                                {
                                  type: "text",
                                  value: newAttachmentName,
                                  onChange: (e) => setNewAttachmentName(e.target.value),
                                  onKeyDown: (e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addCustomAttachment();
                                    }
                                  },
                                  placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0631\u0641\u0642 (\u0645\u062B\u0627\u0644: \u0631\u062E\u0635\u0629)...",
                                  className: "flex-1 w-full h-14 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none"
                                }
                              ),
                              " ",
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex-1 relative w-full", children: [
                                " ",
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                  "select",
                                  {
                                    value: newAttachmentType,
                                    onChange: (e) => setNewAttachmentType(e.target.value),
                                    className: "w-full h-14 px-6 pl-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none appearance-none font-medium cursor-pointer text-sm md:text-base",
                                    children: [
                                      " ",
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", disabled: true, className: "bg-white text-slate-400 dark:bg-slate-800 hidden", children: "(\u062D\u062F\u062F \u0627\u0644\u0635\u064A\u063A\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629)" }),
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "file", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0645\u0644\u0641 PDF" }),
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "mixed_file", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0645\u0633\u062A\u0646\u062F \u0623\u0648 \u0635\u0648\u0631\u0629 (PDF / JPG / PNG)" }),
                                      " ",
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "link", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0631\u0627\u0628\u0637 Link" }),
                                      " ",
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "image", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0635\u0648\u0631\u0629 (Image - JPG/PNG)" }),
                                      " ",
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "video", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0641\u064A\u062F\u064A\u0648 \u0642\u0635\u064A\u0631 (Video - MP4)" }),
                                      " ",
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "document", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0623\u062E\u0631\u0649 (Word / Excel)" }),
                                      " "
                                    ]
                                  }
                                ),
                                " ",
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronDown, { size: 20 }) })
                              ] }),
                              " ",
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                "button",
                                {
                                  type: "button",
                                  onClick: addCustomAttachment,
                                  className: "flex-1 w-full h-14 bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 rounded-2xl font-bold flex items-center gap-2 justify-center transition-all border-2 border-primary/20 hover:border-primary whitespace-nowrap shadow-sm",
                                  children: [
                                    " ",
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 20, strokeWidth: 2.5 }),
                                    " \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0631\u0641\u0642",
                                    " "
                                  ]
                                }
                              ),
                              " "
                            ] }),
                            " "
                          ] })
                        }
                      ) })
                    ] }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "border-2 border-red-100 dark:border-red-900/30 rounded-2xl bg-red-50/50 dark:bg-red-900/10 overflow-hidden mb-6", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        "button",
                        {
                          type: "button",
                          onClick: () => setIsKnockoutExpanded(!isKnockoutExpanded),
                          className: "w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-transparent transition-all group outline-none",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-red-600 dark:text-red-400 flex items-center gap-2", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Ban, { size: 18 }),
                              " \u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0627\u0633\u062A\u0628\u0639\u0627\u062F \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              import_lucide_react.ChevronDown,
                              {
                                className: `text-slate-400 group-hover:text-red-500 transition-transform duration-300 ${isKnockoutExpanded ? "rotate-180" : ""}`,
                                size: 20
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.AnimatePresence, { children: isKnockoutExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_react2.motion.div,
                        {
                          initial: { height: 0, opacity: 0 },
                          animate: { height: "auto", opacity: 1 },
                          exit: { height: 0, opacity: 0 },
                          transition: { duration: 0.3, ease: "easeInOut" },
                          className: "border-t border-red-100 dark:border-red-900/30",
                          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-6 space-y-4 bg-white dark:bg-slate-800/50", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-slate-400 mb-4 leading-relaxed font-medium", children: "(\u0627\u0633\u062A\u062E\u062F\u0645 \u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 \u0644\u0644\u0627\u0633\u062A\u0628\u0639\u0627\u062F \u0627\u0644\u0641\u0648\u0631\u064A \u0644\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 \u063A\u064A\u0631 \u0627\u0644\u0645\u0637\u0627\u0628\u0642\u064A\u0646 \u0644\u0644\u0634\u0631\u0648\u0637 \u0627\u0644\u062D\u062A\u0645\u064A\u0629. \u064A\u0645\u0643\u0646\u0643 \u062A\u0631\u0643\u0647 \u0641\u0627\u0631\u063A\u0627\u064B \u0644\u062A\u0642\u064A\u064A\u0645 \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 \u0639\u0628\u0631 \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0622\u0644\u064A)." }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1 block", children: "\u0625\u0636\u0627\u0641\u0629 \u0633\u0624\u0627\u0644 \u0627\u0633\u062A\u0628\u0639\u0627\u062F" })
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                "input",
                                {
                                  type: "text",
                                  value: newKqText,
                                  onChange: (e) => setNewKqText(e.target.value),
                                  placeholder: "\u0646\u0635 \u0627\u0644\u0633\u0624\u0627\u0644 (\u0645\u062B\u0627\u0644: \u0647\u0644 \u0623\u0646\u062A \u0633\u0639\u0648\u062F\u064A \u0627\u0644\u062C\u0646\u0633\u064A\u0629\u061F)",
                                  className: "w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none focus:border-red-400 transition-all font-medium text-sm"
                                }
                              ),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                  "select",
                                  {
                                    value: newKqType,
                                    onChange: (e) => {
                                      setNewKqType(e.target.value);
                                      if (e.target.value === "yes_no") {
                                        setNewKqRequiredAnswer("\u0646\u0639\u0645");
                                      } else {
                                        setNewKqRequiredAnswer(newKqOptions[0] || "");
                                      }
                                    },
                                    className: "px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none font-medium text-sm appearance-none",
                                    children: [
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "yes_no", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0646\u0639\u0645 / \u0644\u0627" }),
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "options", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u062E\u064A\u0627\u0631\u0627\u062A \u0645\u062A\u0639\u062F\u062F\u0629" })
                                    ]
                                  }
                                ),
                                newKqType === "yes_no" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                  "select",
                                  {
                                    value: newKqRequiredAnswer,
                                    onChange: (e) => setNewKqRequiredAnswer(e.target.value),
                                    className: "px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none",
                                    children: [
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "\u0646\u0639\u0645", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u0644\u0642\u064E\u0628\u0648\u0644: \u0646\u0639\u0645" }),
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "\u0644\u0627", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u0644\u0642\u064E\u0628\u0648\u0644: \u0644\u0627" })
                                    ]
                                  }
                                ) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                  "select",
                                  {
                                    value: newKqRequiredAnswer,
                                    onChange: (e) => setNewKqRequiredAnswer(e.target.value),
                                    className: "px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none",
                                    children: [
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u0644\u0642\u0628\u0648\u0644..." }),
                                      newKqOptions.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: opt, className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: opt }, i))
                                    ]
                                  }
                                )
                              ] }),
                              newKqType === "options" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "input",
                                    {
                                      type: "text",
                                      value: newKqOptionInput,
                                      onChange: (e) => setNewKqOptionInput(e.target.value),
                                      placeholder: "\u0623\u0636\u0641 \u062E\u064A\u0627\u0631\u0627\u064B...",
                                      className: "flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none text-sm",
                                      onKeyDown: (e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          if (newKqOptionInput.trim() && !newKqOptions.includes(newKqOptionInput.trim())) {
                                            const up = [...newKqOptions, newKqOptionInput.trim()];
                                            setNewKqOptions(up);
                                            if (!newKqRequiredAnswer) setNewKqRequiredAnswer(up[0]);
                                            setNewKqOptionInput("");
                                          }
                                        }
                                      }
                                    }
                                  ),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: () => {
                                        if (newKqOptionInput.trim() && !newKqOptions.includes(newKqOptionInput.trim())) {
                                          const up = [...newKqOptions, newKqOptionInput.trim()];
                                          setNewKqOptions(up);
                                          if (!newKqRequiredAnswer) setNewKqRequiredAnswer(up[0]);
                                          setNewKqOptionInput("");
                                        }
                                      },
                                      className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl font-bold text-sm transition-all",
                                      children: "\u0625\u0636\u0627\u0641\u0629"
                                    }
                                  )
                                ] }),
                                newKqOptions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: newKqOptions.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold dark:text-white", children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt }),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: () => {
                                        const up = newKqOptions.filter((_, idx) => idx !== i);
                                        setNewKqOptions(up);
                                        if (newKqRequiredAnswer === opt) setNewKqRequiredAnswer(up[0] || "");
                                      },
                                      className: "text-red-500 hover:text-red-700",
                                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 14 })
                                    }
                                  )
                                ] }, i)) })
                              ] }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => {
                                    if (!newKqText.trim() || !newKqRequiredAnswer.trim()) {
                                      alert("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0646\u0635 \u0627\u0644\u0633\u0624\u0627\u0644 \u0648\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u0644\u0642\u0628\u0648\u0644!");
                                      return;
                                    }
                                    if (newKqType === "options" && newKqOptions.length < 2) {
                                      alert("\u064A\u0631\u062C\u0649 \u0625\u0636\u0627\u0641\u0629 \u062E\u064A\u0627\u0631\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644!");
                                      return;
                                    }
                                    setKnockoutQuestions([...knockoutQuestions, {
                                      text: newKqText.trim(),
                                      type: newKqType,
                                      options: newKqType === "options" ? newKqOptions : void 0,
                                      requiredAnswer: newKqRequiredAnswer
                                    }]);
                                    setNewKqText("");
                                    setNewKqOptions([]);
                                    setNewKqOptionInput("");
                                  },
                                  className: "w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-xl font-bold text-sm transition-all",
                                  children: "\u0625\u0636\u0627\u0641\u0629 \u0633\u0624\u0627\u0644 \u0627\u0633\u062A\u0628\u0639\u0627\u062F"
                                }
                              )
                            ] }),
                            knockoutQuestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-3 mt-6", children: knockoutQuestions.map((q, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/30 rounded-xl", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-bold text-navy dark:text-white text-sm mb-1", children: q.text }),
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded inline-block", children: [
                                  "\u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u0644\u0642\u0628\u0648\u0644: ",
                                  q.requiredAnswer
                                ] })
                              ] }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => setKnockoutQuestions(knockoutQuestions.filter((_, i) => i !== idx)),
                                  className: "p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all",
                                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 16 })
                                }
                              )
                            ] }, idx)) })
                          ] })
                        }
                      ) })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/30 overflow-hidden", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        "button",
                        {
                          type: "button",
                          onClick: () => setIsQuestionsExpanded(!isQuestionsExpanded),
                          className: "w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-transparent transition-all group outline-none",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-navy dark:text-white flex items-center gap-2", children: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0625\u0636\u0627\u0641\u064A\u0629 - \u0627\u062E\u062A\u064A\u0627\u0631\u064A" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              import_lucide_react.ChevronDown,
                              {
                                className: `text-slate-400 group-hover:text-primary transition-transform duration-300 ${isQuestionsExpanded ? "rotate-180" : ""}`,
                                size: 20
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.AnimatePresence, { children: isQuestionsExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_react2.motion.div,
                        {
                          initial: { height: 0, opacity: 0 },
                          animate: { height: "auto", opacity: 1 },
                          exit: { height: 0, opacity: 0 },
                          transition: { duration: 0.3, ease: "easeInOut" },
                          className: "border-t border-slate-200 dark:border-slate-700",
                          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-6 space-y-4 bg-white dark:bg-slate-800/50", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
                              " ",
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1", children: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0625\u0636\u0627\u0641\u064A\u0629 (\u062E\u0627\u0635\u0629 \u0628\u0647\u0630\u0627 \u0627\u0644\u062F\u0648\u0631)" }),
                              " ",
                              customQuestions.map((q, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                "div",
                                {
                                  className: "flex flex-col md:flex-row p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl gap-4",
                                  children: [
                                    " ",
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1 flex-1", children: [
                                      " ",
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-bold text-navy dark:text-white text-sm", children: q.text }),
                                      " ",
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs text-primary font-medium flex items-center gap-1.5", children: [
                                        "\u0646\u0648\u0639 \u0627\u0644\u0625\u062C\u0627\u0628\u0629: ",
                                        q.type,
                                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-slate-300", children: "\u2022" }),
                                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: q.required ? "text-red-500" : "text-slate-400", children: q.required ? "\u0625\u0644\u0632\u0627\u0645\u064A" : "\u0627\u062E\u062A\u064A\u0627\u0631\u064A" })
                                      ] }),
                                      " "
                                    ] }),
                                    " ",
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: () => removeCustomQuestion(idx),
                                        className: "w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0",
                                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 14 })
                                      }
                                    ),
                                    " "
                                  ]
                                },
                                idx
                              )),
                              " ",
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row gap-4 items-center", children: [
                                " ",
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl shrink-0 h-[58px]", children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "input",
                                    {
                                      type: "checkbox",
                                      id: "qRequired",
                                      checked: newQuestionRequired,
                                      onChange: (e) => setNewQuestionRequired(e.target.checked),
                                      className: "w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                    }
                                  ),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "qRequired", className: "text-sm font-bold text-navy dark:text-white cursor-pointer whitespace-nowrap", children: "\u0625\u062C\u0627\u0628\u0629 \u0625\u0644\u0632\u0627\u0645\u064A\u0629" })
                                ] }),
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                  "input",
                                  {
                                    type: "text",
                                    value: newQuestionText,
                                    onChange: (e) => setNewQuestionText(e.target.value),
                                    onKeyDown: (e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        addCustomQuestion();
                                      }
                                    },
                                    placeholder: "\u0627\u0643\u062A\u0628 \u0633\u0624\u0627\u0644\u0643 \u0647\u0646\u0627...",
                                    className: "flex-1 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none"
                                  }
                                ),
                                " ",
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative min-w-[150px]", children: [
                                  " ",
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                    "select",
                                    {
                                      value: newQuestionType,
                                      onChange: (e) => {
                                        setNewQuestionType(e.target.value);
                                        if (e.target.value !== "\u062E\u064A\u0627\u0631\u0627\u062A \u0645\u062A\u0639\u062F\u062F\u0629")
                                          setNewQuestionOptions([]);
                                      },
                                      className: "w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none appearance-none font-medium",
                                      children: [
                                        " ",
                                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0646\u0635 \u0642\u0635\u064A\u0631" }),
                                        " ",
                                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0646\u0635 \u0637\u0648\u064A\u0644" }),
                                        " ",
                                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u062E\u064A\u0627\u0631\u0627\u062A \u0645\u062A\u0639\u062F\u062F\u0629" }),
                                        " ",
                                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0646\u0639\u0645 / \u0644\u0627" }),
                                        " "
                                      ]
                                    }
                                  ),
                                  " "
                                ] }),
                                " ",
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: addCustomQuestion,
                                    className: "bg-navy text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center",
                                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 18 })
                                  }
                                ),
                                " "
                              ] }),
                              " ",
                              newQuestionType === "\u062E\u064A\u0627\u0631\u0627\u062A \u0645\u062A\u0639\u062F\u062F\u0629" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 space-y-3", children: [
                                " ",
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-2 mb-2", children: [
                                  " ",
                                  newQuestionOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                    "span",
                                    {
                                      className: "bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2",
                                      children: [
                                        opt,
                                        " ",
                                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                          "button",
                                          {
                                            type: "button",
                                            onClick: () => removeQuestionOption(opt),
                                            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { size: 12 })
                                          }
                                        )
                                      ]
                                    },
                                    opt
                                  )),
                                  " "
                                ] }),
                                " ",
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative max-w-sm", children: [
                                  " ",
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "input",
                                    {
                                      type: "text",
                                      value: newOptionInput,
                                      onChange: (e) => setNewOptionInput(e.target.value),
                                      onKeyDown: (e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          addQuestionOption(e);
                                        }
                                      },
                                      placeholder: "\u0627\u0636\u0641 \u062E\u064A\u0627\u0631 \u0648\u0627\u0636\u063A\u0637 Enter",
                                      className: "w-full pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border rounded-xl"
                                    }
                                  ),
                                  " "
                                ] }),
                                " "
                              ] }),
                              " "
                            ] }),
                            " "
                          ] })
                        }
                      ) })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-[32px] border-2 border-indigo-100 dark:border-indigo-800/30 shadow-inner mt-8 mb-8", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3 mb-4", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Zap, { size: 20 }) }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 group relative cursor-help w-max", children: [
                          "\u062A\u0648\u062C\u064A\u0647\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629 \u0644\u0645\u062D\u0631\u0643 \u0627\u0644\u0641\u0631\u0632",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xl", children: "\u2139\uFE0F" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-full mb-3 w-80 bg-slate-900 text-white text-xs leading-relaxed font-medium p-4 rounded-xl shadow-2xl shadow-indigo-900/20 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 left-1/2 -translate-x-1/2 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-900", children: "\u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u064A\u0642\u0648\u0645 \u0628\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0633\u064A\u0631 \u0627\u0644\u0630\u0627\u062A\u064A\u0629 \u0648\u0645\u0637\u0627\u0628\u0642\u062A\u0647\u0627 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B. \u0627\u0633\u062A\u062E\u062F\u0645 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0644\u0644\u062A\u0631\u0643\u064A\u0632 \u0639\u0644\u0649 \u0645\u0647\u0627\u0631\u0629 \u0646\u0627\u062F\u0631\u0629 \u0623\u0648 \u0634\u0631\u0648\u0637 \u062E\u0627\u0635\u0629 \u062C\u062F\u0627\u064B \u062E\u0627\u0631\u062C \u0627\u0644\u0648\u0635\u0641 \u0627\u0644\u0645\u0639\u062A\u0627\u062F." })
                        ] }) })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "textarea",
                        {
                          required: false,
                          rows: 3,
                          value: aiInstructions,
                          onChange: (e) => setAiInstructions(e.target.value),
                          placeholder: "(\u0627\u0643\u062A\u0628 \u062A\u0648\u062C\u064A\u0647\u0627\u062A\u0643 \u0627\u0644\u062F\u0642\u064A\u0642\u0629 \u0644\u0645\u062D\u0631\u0643 \u0627\u0644\u0641\u0631\u0632 \u0647\u0646\u0627...)",
                          className: "w-full px-6 py-5 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100/50 dark:border-indigo-800/30 text-navy dark:text-white dark:placeholder-slate-500 rounded-2xl outline-none font-medium resize-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 transition-all placeholder:text-[13px] leading-relaxed relative z-10"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "details",
                      {
                        open: isAdvancedSettingsOpen,
                        onToggle: (e) => setIsAdvancedSettingsOpen(e.currentTarget.open),
                        className: "bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm mt-6 mb-6 group cursor-pointer",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { className: "p-8 text-xl font-bold text-navy dark:text-white flex items-center gap-3 select-none outline-none", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Settings, { size: 22, className: "text-primary" }),
                            "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629",
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronDown, { size: 20, className: "mr-auto text-slate-400 group-open:rotate-180 transition-transform" })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "px-8 pb-8 pt-2 space-y-6 cursor-default border-t border-slate-100 dark:border-slate-700", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-start md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 pb-6 border-b border-slate-100 dark:border-slate-700", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-bold text-navy dark:text-white text-lg", children: "\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u062E\u0635\u064A\u0629 \u0644\u0644\u0645\u0631\u0634\u062D" }),
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-lg leading-relaxed", children: "\u062A\u062D\u062F\u064A\u062F \u0645\u062A\u0637\u0644\u0628 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0634\u062E\u0635\u064A\u0629 \u0644\u0644\u0645\u0631\u0634\u062D \u0623\u062B\u0646\u0627\u0621 \u0645\u0644\u0621 \u0646\u0645\u0648\u0630\u062C \u0627\u0644\u062A\u0642\u062F\u064A\u0645." })
                              ] }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                "select",
                                {
                                  value: photoRequirement,
                                  onChange: (e) => setPhotoRequirement(e.target.value),
                                  className: "w-full md:w-auto px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shrink-0 font-bold",
                                  children: [
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "hidden", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0644\u0627 \u0623\u0637\u0644\u0628 \u0635\u0648\u0631\u0629 (\u0645\u062E\u0641\u064A)" }),
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "optional", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0627\u062E\u062A\u064A\u0627\u0631\u064A" }),
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "required", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0625\u0644\u0632\u0627\u0645\u064A" })
                                  ]
                                }
                              )
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-start md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0", children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-bold text-navy dark:text-white text-lg", children: "\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0635\u0648\u062A\u064A \u0627\u0644\u0622\u0644\u064A" }),
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-lg leading-relaxed", children: "\u0639\u0646\u062F \u0625\u064A\u0642\u0627\u0641 \u0647\u0630\u0627 \u0627\u0644\u062E\u064A\u0627\u0631\u060C \u0633\u064A\u0643\u062A\u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645 \u0628\u062C\u0645\u0639 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0631\u0634\u062D \u0648\u0633\u064A\u0631\u062A\u0647 \u0627\u0644\u0630\u0627\u062A\u064A\u0629 \u0644\u064A\u062A\u0645 \u0641\u0631\u0632\u0647\u0627 \u062F\u0648\u0646 \u0625\u0644\u0632\u0627\u0645\u0647 \u0628\u0625\u062C\u0631\u0627\u0621 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u0627\u0644\u0635\u0648\u062A\u064A\u0629 \u0627\u0644\u0622\u0644\u064A\u0629." })
                              ] }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "relative inline-flex items-center cursor-pointer shrink-0", children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", className: "sr-only peer", checked: isVoiceEnabled, onChange: (e) => setIsVoiceEnabled(e.target.checked) }),
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary" })
                              ] })
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.AnimatePresence, { children: isVoiceEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              import_react2.motion.div,
                              {
                                initial: { opacity: 0, height: 0, marginTop: 0 },
                                animate: { opacity: 1, height: "auto", marginTop: 24 },
                                exit: { opacity: 0, height: 0, marginTop: 0 },
                                className: "overflow-hidden",
                                children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col gap-4", children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "font-bold text-navy dark:text-white text-lg", children: "\u0642\u0627\u0644\u0628 \u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u0627\u0644\u0635\u0648\u062A\u064A\u0629 (\u0633\u0624\u0627\u0644\u064A\u0646 \u0643\u062D\u062F \u0623\u0642\u0635\u0649)" }),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                    "select",
                                    {
                                      value: voiceInterviewTemplate,
                                      onChange: (e) => setVoiceInterviewTemplate(e.target.value),
                                      className: "w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all",
                                      children: [
                                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "general", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0641\u0631\u0632 \u0639\u0627\u0645 - \u0644\u0644\u0648\u0638\u0627\u0626\u0641 \u0627\u0644\u0625\u062F\u0627\u0631\u064A\u0629 \u0648\u0627\u0644\u062A\u0642\u0646\u064A\u0629" }),
                                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "sales", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0645\u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u062C\u0645\u0647\u0648\u0631 \u0648\u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A" }),
                                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "custom", className: "bg-white text-navy dark:bg-slate-800 dark:text-white", children: "\u0643\u062A\u0627\u0628\u0629 \u0623\u0633\u0626\u0644\u0629 \u0645\u062E\u0635\u0635\u0629" })
                                      ]
                                    }
                                  ),
                                  voiceInterviewTemplate === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                    import_react2.motion.div,
                                    {
                                      initial: { opacity: 0, y: -10 },
                                      animate: { opacity: 1, y: 0 },
                                      className: "mt-4 space-y-4",
                                      children: [
                                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-amber-50 dark:bg-amber-500/10 border-r-4 border-amber-500 p-4 rounded-l-xl", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm font-bold text-amber-700 dark:text-amber-400 leading-relaxed flex items-center gap-2", children: [
                                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u26A0\uFE0F" }),
                                          " \u062A\u0646\u0628\u064A\u0647: \u0646\u0638\u0627\u0645 \u0627\u0644\u0641\u0631\u0632 \u064A\u062D\u0644\u0644 \u0646\u0628\u0631\u0629 \u0627\u0644\u0635\u0648\u062A \u0648\u0627\u0644\u062B\u0642\u0629 \u0648\u0645\u0647\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644. \u064A\u0631\u062C\u0649 \u0637\u0631\u062D \u0623\u0633\u0626\u0644\u0629 \u062A\u0639\u062A\u0645\u062F \u0639\u0644\u0649 \u0627\u0644\u0645\u0648\u0627\u0642\u0641 \u0627\u0644\u0633\u0644\u0648\u0643\u064A\u0629 \u0648\u062A\u062C\u0646\u0628 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0645\u0639\u0631\u0641\u064A\u0629 \u0623\u0648 \u0627\u0644\u062A\u0642\u0646\u064A\u0629 \u0627\u0644\u0645\u0639\u0642\u062F\u0629 \u0644\u0636\u0645\u0627\u0646 \u062F\u0642\u0629 \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0622\u0644\u064A."
                                        ] }) }),
                                        [0, 1].map((index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2", children: [
                                            "\u0627\u0644\u0633\u0624\u0627\u0644 ",
                                            index + 1
                                          ] }),
                                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                            "textarea",
                                            {
                                              value: voiceInterviewQuestions[index] || "",
                                              maxLength: 150,
                                              onChange: (e) => {
                                                const newQuestions = [...voiceInterviewQuestions];
                                                newQuestions[index] = e.target.value;
                                                setVoiceInterviewQuestions(newQuestions);
                                              },
                                              placeholder: `\u0627\u0643\u062A\u0628 \u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u0633\u0644\u0648\u0643\u064A \u0631\u0642\u0645 ${index + 1} \u0647\u0646\u0627...`,
                                              className: "w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none font-medium h-24"
                                            }
                                          ),
                                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-left text-xs font-medium text-slate-400 mt-1", children: [
                                            (voiceInterviewQuestions[index] || "").length,
                                            "/150"
                                          ] })
                                        ] }, index))
                                      ]
                                    }
                                  )
                                ] })
                              }
                            ) })
                          ] })
                        ]
                      }
                    )
                  ] })
                ] }),
                adType === "campaign" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center gap-3", children: [
                  roles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
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
                        setRequiredAttachments(["\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 PDF"]);
                        setCustomAttachments([]);
                        setKnockoutQuestions([]);
                        setIsVoiceEnabled(true);
                        setPhotoRequirement("hidden");
                      },
                      className: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 transition-all shrink-0",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 20 }),
                        " \u0625\u0644\u063A\u0627\u0621"
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      type: "button",
                      onClick: handleSaveRole,
                      className: "bg-mint dark:bg-[#065f46] text-employer-green dark:text-[#a7f3d0] px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl flex items-center gap-2 transition-all shrink-0",
                      children: [
                        " ",
                        editingRoleId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Pencil, { size: 20 }),
                          " \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A",
                          " "
                        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { size: 20 }),
                          " \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062F\u0648\u0631",
                          " "
                        ] })
                      ]
                    }
                  ),
                  " "
                ] }),
                " "
              ] }),
              createJobType !== "quick_link" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6 mb-8 mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-start md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", { className: "font-bold text-navy dark:text-white text-lg flex items-center gap-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Settings, { size: 22, className: "text-primary" }),
                    "\u062A\u062E\u0637\u064A \u0635\u0641\u062D\u0629 \u0627\u0644\u0648\u0635\u0641 (\u0625\u0639\u062F\u0627\u062F \u0639\u0627\u0645)"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed", children: "\u0639\u0646\u062F \u062A\u0641\u0639\u064A\u0644 \u0647\u0630\u0627 \u0627\u0644\u062E\u064A\u0627\u0631\u060C \u0633\u064A\u062A\u0645 \u062A\u0648\u062C\u064A\u0647 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 \u0645\u0628\u0627\u0634\u0631\u0629 \u0625\u0644\u0649 \u0635\u0641\u062D\u0629 \u062A\u0639\u0628\u0626\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0648\u0631\u0641\u0639 \u0627\u0644\u0633\u064A\u0631\u0629 \u0627\u0644\u0630\u0627\u062A\u064A\u0629 \u0645\u062A\u062C\u0627\u0647\u0644\u0627\u064B \u0635\u0641\u062D\u0629 \u0627\u0644\u0647\u0628\u0648\u0637 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0648\u0638\u064A\u0641\u0629 \u0623\u0648 \u0627\u0644\u0628\u0648\u0627\u0628\u0629 \u0628\u0623\u0643\u0645\u0644\u0647\u0627." })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "relative inline-flex items-center cursor-pointer shrink-0", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", className: "sr-only peer", checked: directUpload, onChange: (e) => setDirectUpload(e.target.checked) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary" })
                ] })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-xl font-bold text-navy dark:text-white flex items-center gap-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Calendar, { className: "text-primary", size: 24 }),
                    " \u0627\u0644\u062A\u0648\u0627\u0631\u064A\u062E \u0648\u0627\u0644\u062C\u062F\u0648\u0644\u0629"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "relative inline-flex items-center cursor-pointer shrink-0", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-3 font-bold text-navy dark:text-white ml-3", children: "\u0625\u0639\u0644\u0627\u0646 \u0645\u0633\u062A\u0645\u0631 (\u0645\u0641\u062A\u0648\u062D \u062F\u0627\u0626\u0645\u0627\u064B)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", className: "sr-only peer", checked: isOpenEnded, onChange: (e) => setIsOpenEnded(e.target.checked) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary" })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `grid grid-cols-1 ${isOpenEnded ? "md:grid-cols-1" : "md:grid-cols-2"} gap-8`, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1", children: "\u062A\u0627\u0631\u064A\u062E \u0648\u0648\u0642\u062A \u0628\u062F\u0621 \u0627\u0644\u062A\u0642\u062F\u064A\u0645" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        required: true,
                        lang: "en",
                        style: { fontFamily: "Arial, Helvetica, sans-serif" },
                        type: "datetime-local",
                        value: startDate,
                        onChange: (e) => setStartDate(e.target.value),
                        className: "w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-left",
                        dir: "ltr"
                      }
                    )
                  ] }),
                  !isOpenEnded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "text-sm font-bold text-navy dark:text-white mr-1", children: "\u062A\u0627\u0631\u064A\u062E \u0648\u0648\u0642\u062A \u0627\u0646\u062A\u0647\u0627\u0621 \u0627\u0644\u062A\u0642\u062F\u064A\u0645" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        required: true,
                        lang: "en",
                        style: { fontFamily: "Arial, Helvetica, sans-serif" },
                        type: "datetime-local",
                        value: endDate,
                        onChange: (e) => setEndDate(e.target.value),
                        className: "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-left",
                        dir: "ltr"
                      }
                    )
                  ] })
                ] }),
                isOpenEnded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700", children: "(\u0633\u064A\u0628\u0642\u0649 \u0647\u0630\u0627 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0645\u062A\u0627\u062D\u0627\u064B \u0644\u0644\u0645\u062A\u0642\u062F\u0645\u064A\u0646 \u062D\u062A\u0649 \u062A\u0642\u0648\u0645 \u0628\u0625\u063A\u0644\u0627\u0642\u0647 \u064A\u062F\u0648\u064A\u0627\u064B \u0645\u0646 \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645)" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row items-center justify-end gap-3 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    onClick: (e) => {
                      e.preventDefault();
                      handleBackAttempt();
                    },
                    className: "w-full md:w-auto bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all items-center gap-2",
                    children: "\u0625\u0644\u063A\u0627\u0621 \u0648\u0627\u0644\u0639\u0648\u062F\u0629"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const singleTitleStr = roleTitle || "";
                      const campaignTitleStr = campaignTitle || "";
                      const hasInfo = adType === "single" ? singleTitleStr.trim() !== "" : campaignTitleStr.trim() !== "";
                      if (!hasInfo) {
                        window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "\u064A\u0631\u062C\u0649 \u062A\u0639\u0628\u0626\u0629 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0641\u064A \u0635\u0641\u062D\u0629 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u062D\u062A\u0649 \u062A\u062A\u0645\u0643\u0646 \u0645\u0646 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u0628\u0634\u0643\u0644 \u0635\u062D\u064A\u062D.", type: "warning" } }));
                        return;
                      }
                      setIsLivePreview(true);
                    },
                    className: "w-full md:w-auto px-8 bg-white dark:bg-slate-800 border-2 border-primary text-primary py-4 rounded-xl text-lg font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Eye, { size: 20 }),
                      " \u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u062D\u064A\u0627\u064B"
                    ]
                  }
                ),
                adType === "single" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: initialData?.status === "\u0646\u0634\u0637" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent("showToast", { detail: "\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0646\u0634\u0631 \u0648\u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0644\u0645\u0633\u0648\u062F\u0629" }));
                        setTimeout(() => {
                          onSubmit({ ...baseJobData, status: "\u0645\u0633\u0648\u062F\u0629" }, initialData.id);
                        }, 1e3);
                      },
                      className: "w-full md:w-auto bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-6 py-4 rounded-xl text-lg font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all items-center",
                      children: "\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0646\u0634\u0631 (\u062A\u062D\u0648\u064A\u0644 \u0644\u0645\u0633\u0648\u062F\u0629)"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      type: "submit",
                      className: "w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2",
                      children: "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A"
                    }
                  )
                ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.preventDefault();
                        handleSaveAsDraft();
                      },
                      className: "w-full md:w-auto bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all items-center",
                      children: "\u062D\u0641\u0638 \u0643\u0645\u0633\u0648\u062F\u0629"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      type: "submit",
                      className: "w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2",
                      children: "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0627\u0644\u0648\u0638\u064A\u0641\u064A"
                    }
                  )
                ] }) }),
                adType !== "single" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.preventDefault();
                        handleSaveAsDraft();
                      },
                      className: "w-full md:w-auto bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all items-center",
                      children: "\u062D\u0641\u0638 \u0643\u0645\u0633\u0648\u062F\u0629"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      type: "submit",
                      className: "w-full md:w-auto px-10 bg-primary text-white py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all",
                      children: "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0627\u0644\u0648\u0638\u064A\u0641\u064A"
                    }
                  )
                ] })
              ] })
            ] }),
            " "
          ]
        }
      ),
      " "
    ] }),
    " ",
    isLivePreview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_Shared.PreviewModal,
      {
        job: {
          id: "preview",
          recordType: adType === "single" && createJobType === "quick_link" ? "quick_link" : adType,
          campaignTitle: enableWelcomeUI ? campaignTitle : void 0,
          campaignDescription: enableWelcomeUI ? campaignDescription : void 0,
          roleSummary: (roleSummary || "").trim(),
          responsibilities: (responsibilities || "").trim(),
          qualifications: (qualifications || "").trim(),
          benefits: (benefits || "").trim(),
          description: !enableWelcomeUI && adType === "single" && createJobType !== "quick_link" ? (roleDesc || "").trim() : adType === "campaign" ? enableWelcomeUI ? campaignDescription : "" : "",
          startDate,
          endDate: isOpenEnded ? void 0 : endDate,
          company: userProfile?.companyName || company,
          entityType: userProfile?.entityType,
          city: userProfile?.city,
          location: createJobType === "quick_link" ? "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F" : location,
          locations: createJobType === "quick_link" ? [] : locations,
          targetMajors,
          experience: createJobType === "quick_link" ? "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F" : experience,
          qualification: createJobType === "quick_link" ? "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F" : qualification,
          salaryMin: createJobType === "quick_link" ? void 0 : salaryMin,
          salaryMax: createJobType === "quick_link" ? void 0 : salaryMax,
          isSalaryHidden: createJobType === "quick_link" ? false : isSalaryHidden,
          knockoutQuestions: createJobType === "quick_link" ? [] : knockoutQuestions,
          type: createJobType === "quick_link" ? "\u062F\u0648\u0627\u0645 \u0643\u0627\u0645\u0644" : type,
          aiInstructions: createJobType === "quick_link" ? "" : (aiInstructions || "").trim(),
          title: (adType === "campaign" ? enableWelcomeUI ? campaignTitle : "" : roleTitle) || roleTitle || "\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u0629",
          companyLogo: companyLogo || void 0,
          skills: createJobType === "quick_link" ? [] : selectedSkills,
          languages: selectedLanguages,
          customQuestions: createJobType === "quick_link" ? [] : customQuestions,
          requiredAttachments: createJobType === "quick_link" ? ["\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 PDF"] : requiredAttachments,
          directUpload: createJobType === "quick_link" ? false : directUpload,
          requireVoiceInterview: createJobType === "quick_link" ? false : isVoiceEnabled,
          voiceInterviewTemplate: createJobType === "quick_link" ? void 0 : voiceInterviewTemplate,
          voiceInterviewQuestions: createJobType === "quick_link" ? void 0 : voiceInterviewQuestions,
          photoRequirement: createJobType === "quick_link" ? "optional" : photoRequirement,
          portfolioRequirement: createJobType === "quick_link" ? void 0 : requiredAttachments.includes("\u0631\u0627\u0628\u0637 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644/Portfolio") ? portfolioRequirement : void 0,
          applicants: 0,
          status: "\u0646\u0634\u0637",
          createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          roles: adType === "single" || createJobType === "quick_link" ? [
            {
              id: "r1",
              title: (roleTitle || "").trim() || "\u0634\u0627\u063A\u0631 \u062C\u062F\u064A\u062F",
              description: "",
              roleSummary: (roleSummary || "").trim(),
              responsibilities: (responsibilities || "").trim(),
              qualifications: (qualifications || "").trim(),
              benefits: (benefits || "").trim(),
              aiInstructions: createJobType === "quick_link" ? "" : (aiInstructions || "").trim(),
              skills: createJobType === "quick_link" ? [] : selectedSkills,
              customQuestions: createJobType === "quick_link" ? [] : customQuestions,
              requiredAttachments: createJobType === "quick_link" ? ["\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 PDF"] : requiredAttachments,
              portfolioRequirement: createJobType === "quick_link" ? void 0 : requiredAttachments.includes("\u0631\u0627\u0628\u0637 \u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644/Portfolio") ? portfolioRequirement : void 0,
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
              knockoutQuestions
            }
          ] : roles
        },
        onClose: () => setIsLivePreview(false)
      }
    ),
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_Shared.ImageLightbox, { url: lightboxPhoto, onClose: () => setLightboxPhoto(null) })
  ] });
};
var PublicJobPage = ({
  job,
  selectedRoleId,
  onSelectRole,
  onApply,
  onBackToCampaign
}) => {
  if (job.status === "\u0645\u0633\u0648\u062F\u0629") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-xl max-w-lg w-full border border-slate-100 dark:border-slate-800", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-20 h-20 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { size: 32 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-2xl font-bold text-navy dark:text-white mb-4", children: "\u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-500 dark:text-slate-400 font-medium", children: "\u0639\u0630\u0631\u0627\u064B\u060C \u0647\u0630\u0627 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D \u062D\u0627\u0644\u064A\u0627\u064B \u0623\u0648 \u0645\u0639\u0644\u0642 \u0643\u0645\u0633\u0648\u062F\u0629\u060C \u064A\u064F\u0631\u062C\u0649 \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0634\u0631\u0643\u0629 \u0627\u0644\u0646\u0627\u0634\u0631\u0629 \u0644\u0644\u0625\u0639\u0644\u0627\u0646." })
    ] }) });
  }
  const isCampaign = job.recordType === "campaign";
  const isJobBoard = isCampaign && !selectedRoleId;
  const activeRole = isCampaign && selectedRoleId ? job.roles?.find((r) => r.id === selectedRoleId) : job.roles && job.roles.length > 0 ? job.roles[0] : null;
  const displayTitle = isJobBoard ? job.campaignTitle || job.title : activeRole?.title || job.title;
  const displayCompany = job.company;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-screen bg-slate-100 pt-32 pb-20 px-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_react2.motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl overflow-hidden border border-white dark:border-slate-700",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-10 md:p-16 bg-navy text-white relative overflow-hidden", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative z-10", children: [
            isCampaign && selectedRoleId && onBackToCampaign && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: onBackToCampaign,
                className: "mb-8 flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm w-fit",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { size: 16 }),
                  " \u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0648\u0638\u0627\u0626\u0641"
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 mb-8", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 h-16 p-0 bg-white dark:bg-slate-800/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white dark:border-slate-700/10 overflow-hidden shrink-0 shadow-sm", children: job.companyLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: job.companyLogo,
                  alt: `\u0634\u0639\u0627\u0631 ${job.company}`,
                  className: "w-full h-full object-cover rounded-[inherit] drop-shadow-sm"
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Briefcase, { size: 16, className: "text-primary opacity-80" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-300 font-bold text-sm drop-shadow-sm", children: displayCompany }),
                  job.entityType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 backdrop-blur-sm", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldCheck, { size: 12, className: job.entityType === "company" ? "text-emerald-400" : "text-blue-400" }),
                    job.entityType === "company" ? "\u0645\u0624\u0633\u0633\u0629 \u0645\u0639\u062A\u0645\u062F\u0629" : "\u0645\u0633\u062A\u0642\u0644 \u0645\u0639\u062A\u0645\u062F"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "text-3xl md:text-4xl lg:text-5xl font-black mb-2 leading-tight opacity-90 drop-shadow-sm", children: displayTitle })
              ] })
            ] }),
            isJobBoard && (job.campaignDescription || job.description) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 mb-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-slate-300 text-lg font-medium leading-relaxed whitespace-pre-wrap text-center max-w-4xl mx-auto", children: job.campaignDescription || job.description }) }),
            !isJobBoard && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap items-center gap-3 mt-4", children: [
              (activeRole?.type || job.type) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Clock, { size: 16, className: "text-white/80 shrink-0" }),
                " ",
                activeRole?.type || job.type
              ] }),
              (activeRole?.locations?.length ? activeRole.locations : job.locations?.length ? job.locations : activeRole?.location || job.location ? [activeRole?.location || job.location] : []).map((loc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 16, className: "text-white/80 shrink-0" }),
                " ",
                loc
              ] }, idx)),
              (activeRole?.experience || job.experience) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Briefcase, { size: 16, className: "text-white/80 shrink-0" }),
                " ",
                activeRole?.experience || job.experience
              ] }),
              (activeRole?.qualification || job.qualification) && (activeRole?.qualification !== "\u0644\u0627 \u064A\u0634\u062A\u0631\u0637 \u0645\u0624\u0647\u0644" && job.qualification !== "\u0644\u0627 \u064A\u0634\u062A\u0631\u0637 \u0645\u0624\u0647\u0644") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.FileText, { size: 16, className: "text-white/80 shrink-0" }),
                " ",
                activeRole?.qualification || job.qualification
              ] }),
              !(activeRole?.isSalaryHidden ?? job.isSalaryHidden) && (activeRole?.salaryMin || job.salaryMin) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-emerald-500/20 px-5 py-2.5 rounded-xl border border-emerald-400/40 text-sm font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CreditCard, { size: 16, className: "shrink-0 text-emerald-400" }),
                activeRole?.salaryMin || job.salaryMin,
                " ",
                activeRole?.salaryMax || job.salaryMax ? `- ${activeRole?.salaryMax || job.salaryMax}` : "",
                " \u0631\u064A\u0627\u0644"
              ] }),
              job.createdAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "inline-flex items-center justify-center gap-2 bg-white/5 px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold shadow-sm backdrop-blur-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Calendar, { size: 16, className: "text-white/60 shrink-0" }),
                " \u0646\u064F\u0634\u0631 \u0641\u064A ",
                job.createdAt
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-10 md:p-16 space-y-12", children: isJobBoard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-2xl font-bold text-navy dark:text-white mb-8 flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-8 bg-primary rounded-full" }),
            " \u0627\u0644\u0641\u0631\u0635 \u0627\u0644\u0648\u0638\u064A\u0641\u064A\u0629 \u0627\u0644\u0645\u062A\u0627\u062D\u0629"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: job.roles?.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "button",
            {
              onClick: () => onSelectRole?.(role.id),
              className: "group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/30 transition-all text-right flex flex-col items-start gap-4",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-full flex justify-between items-start gap-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "text-xl font-bold text-navy dark:text-white group-hover:text-primary transition-colors", children: role.title }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { size: 18, className: "-rotate-135" }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap items-center gap-2", children: [
                  (role.locations?.length ? role.locations : role.location ? [role.location] : []).map((loc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { size: 14 }),
                    " ",
                    loc
                  ] }, idx)),
                  role.type && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-xs font-bold text-blue-600 dark:text-blue-400", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Clock, { size: 14 }),
                    " ",
                    role.type
                  ] }),
                  !role.isSalaryHidden && role.salaryMin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-xs font-bold text-emerald-600 dark:text-emerald-400", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CreditCard, { size: 14 }),
                    " ",
                    role.salaryMin,
                    " ",
                    role.salaryMax ? `- ${role.salaryMax}` : "",
                    " \u0631\u064A\u0627\u0644"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-primary", children: "\u0627\u0644\u062A\u0642\u062F\u064A\u0645 \u0639\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u0648\u0638\u064A\u0641\u0629" }) })
              ]
            },
            role.id
          )) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          job.recordType !== "campaign" && job.campaignDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-primary/5 border border-primary/20 rounded-[28px] p-8 -mt-4 mb-8 text-center shadow-sm", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-navy dark:text-white font-medium text-lg leading-relaxed", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "inline-block mr-2 -mt-1 text-primary", size: 24 }),
            " ",
            job.campaignDescription
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pb-10", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-8 bg-primary rounded-full" }),
              " \u0646\u0628\u0630\u0629 \u0639\u0646 \u0627\u0644\u062F\u0648\u0631"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap text-lg", children: activeRole?.roleSummary || job.roleSummary || activeRole?.description || job.description })
          ] }),
          ((activeRole?.targetMajors?.length ?? 0) > 0 || (job.targetMajors?.length ?? 0) > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-10 border-t border-slate-100 dark:border-slate-700 pb-10", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-8 bg-primary rounded-full" }),
              " \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-3", children: (activeRole?.targetMajors || job.targetMajors || []).map((major, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold border border-blue-200 dark:border-blue-800/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5", children: major }, i)) })
          ] }),
          (activeRole?.responsibilities || job.responsibilities) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-10 border-t border-slate-100 dark:border-slate-700 pb-10", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-8 bg-primary rounded-full" }),
              " \u0627\u0644\u0645\u0647\u0627\u0645 \u0648\u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0627\u062A"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "space-y-4 list-none", children: (activeRole?.responsibilities || job.responsibilities || "").split("\n").filter((r) => r.trim()).map((res, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle, { size: 14 }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "leading-relaxed", children: res.trim() })
            ] }, i)) })
          ] }),
          (activeRole?.qualifications || job.qualifications) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-10 border-t border-slate-100 dark:border-slate-700 pb-10", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-8 bg-primary rounded-full" }),
              " \u0627\u0644\u0645\u0624\u0647\u0644\u0627\u062A \u0648\u0627\u0644\u0645\u062A\u0637\u0644\u0628\u0627\u062A"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "space-y-4 list-none", children: (activeRole?.qualifications || job.qualifications || "").split("\n").filter((q) => q.trim()).map((qual, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "leading-relaxed", children: qual.trim() })
            ] }, i)) })
          ] }),
          (activeRole?.benefits || job.benefits) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-10 border-t border-slate-100 dark:border-slate-700 pb-10", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-8 bg-primary rounded-full" }),
              " \u0627\u0644\u0645\u0645\u064A\u0632\u0627\u062A (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-3", children: (activeRole?.benefits || job.benefits || "").split("\n").filter((b) => b.trim()).map((ben, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-6 py-3 rounded-2xl text-sm font-bold border border-emerald-100 dark:border-emerald-800/30 shadow-sm flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Star, { size: 16, className: "text-emerald-500" }),
              " ",
              ben.trim()
            ] }, i)) })
          ] }),
          (activeRole?.skills || job.skills) && (activeRole?.skills?.length || job.skills?.length) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-10 border-t border-slate-100 dark:border-slate-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-8 bg-primary rounded-full" }),
              " \u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-3", children: (activeRole?.skills || job.skills || []).map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-slate-50 dark:bg-slate-800/50 text-navy dark:text-white px-6 py-3 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-700 shadow-sm", children: skill }, skill)) })
          ] }) : null,
          (activeRole?.languages || job.languages) && (activeRole?.languages?.length || job.languages?.length) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-10 border-t border-slate-100 dark:border-slate-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-8 bg-primary rounded-full" }),
              " \u0627\u0644\u0644\u063A\u0627\u062A \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-3", children: (activeRole?.languages || job.languages || []).map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-6 py-3 rounded-2xl text-sm font-bold border border-indigo-100 dark:border-indigo-800/30 shadow-sm", children: lang }, lang)) })
          ] }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-10 border-t border-slate-100 dark:border-slate-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: onApply, className: "w-full bg-primary text-white py-6 rounded-[24px] text-xl font-bold hover:bg-teal-600 transition-all shadow-xl shadow-primary/20 active:scale-[0.98]", children: "\u0627\u0644\u062A\u0642\u062F\u064A\u0645 \u0639\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u0648\u0638\u064A\u0641\u0629 \u0627\u0644\u0622\u0646" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-center text-slate-400 dark:text-slate-500 mt-6 text-sm font-medium", children: "\u064A\u062A\u0645 \u0641\u0631\u0632 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0622\u0644\u064A\u0627\u064B \u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0634\u0641\u0627\u0641\u064A\u0629 \u0648\u0633\u0631\u0639\u0629 \u0627\u0644\u0631\u062F" })
          ] })
        ] }) })
      ]
    }
  ) }) });
};
var CreateJob_default = CreateJob;
