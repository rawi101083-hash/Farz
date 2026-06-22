import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Search,
  Filter,
  Users,
  User,
  ShoppingBag,
  Database,
  Upload,
  LayoutDashboard,
  CheckCircle,
  Play,
  FileText,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  LogOut,
  Lock,
  Mail,
  Shield,
  CreditCard,
  Settings,
  MoreVertical,
  Ban,
  Calendar,
  Phone,
  Globe,
  Bell,
  Copy,
  ExternalLink,
  MapPin,
  Share2,
  Trash2,
  Save,
  Star,
  MessageCircle,
  X,
  Plus,
  Moon,
  Sun,
  Eye,
  Download,
  ChevronDown,
  Mic,
  Square,
  RotateCcw,
  CheckSquare,
  Pencil,
  AlertTriangle,
  Linkedin,
  Info,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import * as pdfjsLib from "pdfjs-dist";
import { supabase } from "../lib/supabaseClient";
import React, { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import skillsDictionaryRaw from "../skillsDictionary.json";
import { FEATURE_FLAGS, getVoiceInterviewFeatureEnabled } from "../config";

import { Job, SearchableSelect, VerificationModal, PreviewModal, ImageLightbox, SAUDI_CITIES, getUserSavedSkills, saveUserSkills, skillsDictionary, CustomAttachment, Role } from '../Shared';
import { MultiSearchableSelect } from './MultiSearchableSelect';
import { countriesList } from '../data/countries';
export const CreateJob = ({
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
      const safeBaseRole = editingRoleId ? roles.find(r => r.id === editingRoleId) : (initialData?.recordType === "single" ? (initialData.roles?.[0] || initialData) : initialData);

      const initBaseRole = initialData?.recordType === "single" ? (initialData.roles?.[0] || initialData) : null;

      const trackRoleFields = adType === "single" || !!editingRoleId;

      const isCompletelyNewAndEmpty = !initialData &&
        campaignTitle.trim() === "" &&
        campaignDescription.trim() === "" &&
        roleTitle.trim() === "" &&
        roleDesc.trim() === "" &&
        roles.length === 0;

      if (isCompletelyNewAndEmpty) return false;

      const cleanRolesForComparison = (roleArr: Role[]) => roleArr.map(({ id, ...rest }) => rest);

      const current = {
        campaignTitle: campaignTitle.trim(),
        campaignDescription: campaignDescription.trim(),
        company: company.trim(),
        enableWelcomeUI: enableWelcomeUI,
        rolesStr: JSON.stringify(cleanRolesForComparison(roles)),

        isVoiceEnabled: isVoiceEnabled,
        voiceInterviewTemplate: voiceInterviewTemplate,
        voiceInterviewQuestionsLength: voiceInterviewQuestions.length,
        directUpload: directUpload,
        photoRequirement: photoRequirement,

        ...(initialData ? {
          startDate: startDate,
          endDate: endDate,
          isOpenEnded: isOpenEnded,
        } : {}),

        ...(trackRoleFields ? {
          roleTitle: roleTitle.trim(),
          roleDesc: roleDesc.trim(),
          roleSummary: roleSummary.trim(),
          responsibilities: responsibilities.trim(),
          qualifications: qualifications.trim(),
          benefits: benefits.trim(),
          aiInstructions: aiInstructions.trim(),
          location: location.trim(),
          type: type,
          types: types.join(","),
          autoRejectCity: autoRejectCity,
          autoRejectQualification: autoRejectQualification,
          autoRejectExperience: autoRejectExperience,
          experience: experience,
          qualification: qualification,
          salaryMin: salaryMin,
          salaryMax: salaryMax,
          isSalaryHidden: isSalaryHidden,
          askExpectedSalary: askExpectedSalary,
          selectedSkillsLen: selectedSkills.length,
          selectedLanguagesLen: selectedLanguages.length,
          customQuestionsLen: customQuestions.length,
          targetMajorsLen: targetMajors.length,
          knockoutQuestionsLen: knockoutQuestions.length,
          requiredAttachmentsLen: requiredAttachments.length,
          portfolioRequirement: portfolioRequirement,
          customAttachmentsLen: customAttachments.length,
        } : {})
      };

      const expectedMount = {
        roleTitle: (initBaseRole?.title || "").trim(),
        roleDesc: (initBaseRole?.description || "").trim(),
        roleSummary: (initBaseRole?.roleSummary || "").trim(),
        responsibilities: (initBaseRole?.responsibilities || "").trim(),
        qualifications: (initBaseRole?.qualifications || "").trim(),
        benefits: (initBaseRole?.benefits || "").trim(),
        aiInstructions: (initBaseRole?.aiInstructions || "").trim(),

        location: (initialData?.location || "").trim(),
        type: initialData?.type || "دوام كامل",
        types: (initialData?.types || (initialData?.type ? [initialData.type] : ["دوام كامل"])).join(","),
        autoRejectCity: initialData?.autoRejectCity || false,
        autoRejectQualification: initialData?.autoRejectQualification || false,
        autoRejectExperience: initialData?.autoRejectExperience || false,
        experience: initialData?.experience || "لا يشترط خبرة",
        qualification: initialData?.qualification || "ثانوي",
        salaryMin: initialData?.salaryMin || "",
        salaryMax: initialData?.salaryMax || "",
        isSalaryHidden: !!initialData?.isSalaryHidden,
        askExpectedSalary: initialData?.askExpectedSalary || "hidden",
        expectedSalaryRanges: initialData?.expectedSalaryRanges || [],

        targetMajorsLen: (initBaseRole?.targetMajors || initialData?.targetMajors || []).length,
        selectedSkillsLen: (initBaseRole?.skills || []).length,
        selectedLanguagesLen: (initBaseRole?.languages || []).length,
        customQuestionsLen: (initBaseRole?.customQuestions || []).length,
        knockoutQuestionsLen: (initBaseRole?.knockoutQuestions || []).length,
        requiredAttachmentsLen: (initBaseRole?.requiredAttachments || ["سيرة ذاتية PDF"]).length,
        portfolioRequirement: initBaseRole?.portfolioRequirement || "optional",
        customAttachmentsLen: (initBaseRole?.customAttachments || []).length,
      };

      const expectedEdit = {
        roleTitle: (safeBaseRole?.title || "").trim(),
        roleDesc: (safeBaseRole?.description || "").trim(),
        roleSummary: (safeBaseRole?.roleSummary || "").trim(),
        responsibilities: (safeBaseRole?.responsibilities || "").trim(),
        qualifications: (safeBaseRole?.qualifications || "").trim(),
        benefits: (safeBaseRole?.benefits || "").trim(),
        aiInstructions: (safeBaseRole?.aiInstructions || "").trim(),

        location: (safeBaseRole?.location || "").trim(),
        type: safeBaseRole?.type || "دوام كامل",
        types: (safeBaseRole?.types || (safeBaseRole?.type ? [safeBaseRole.type] : ["دوام كامل"])).join(","),
        autoRejectCity: safeBaseRole?.autoRejectCity || false,
        autoRejectQualification: safeBaseRole?.autoRejectQualification || false,
        autoRejectExperience: safeBaseRole?.autoRejectExperience || false,
        experience: safeBaseRole?.experience || "لا يشترط خبرة",
        qualification: safeBaseRole?.qualification || "ثانوي",
        salaryMin: safeBaseRole?.salaryMin || "",
        salaryMax: safeBaseRole?.salaryMax || "",
        isSalaryHidden: !!safeBaseRole?.isSalaryHidden,
        askExpectedSalary: safeBaseRole?.askExpectedSalary || "hidden",
        expectedSalaryRanges: safeBaseRole?.expectedSalaryRanges || [],

        targetMajorsLen: (safeBaseRole?.targetMajors || []).length,
        selectedSkillsLen: (safeBaseRole?.skills || []).length,
        selectedLanguagesLen: (safeBaseRole?.languages || []).length,
        customQuestionsLen: (safeBaseRole?.customQuestions || []).length,
        knockoutQuestionsLen: (safeBaseRole?.knockoutQuestions || []).length,
        requiredAttachmentsLen: (safeBaseRole?.requiredAttachments || ["سيرة ذاتية PDF"]).length,
        portfolioRequirement: safeBaseRole?.portfolioRequirement || "optional",
        customAttachmentsLen: (safeBaseRole?.customAttachments || []).length,
      };

      const expected = {
        campaignTitle: (initialData?.campaignTitle || initialData?.title || "").trim(),
        campaignDescription: (initialData?.campaignDescription || "").trim(),
        company: (initialData?.company || localStorage.getItem("last_used_company") || "").trim(),
        enableWelcomeUI: !!(initialData?.campaignTitle),
        rolesStr: initialData?.recordType === "campaign" && initialData.roles ? JSON.stringify(cleanRolesForComparison(initialData.roles)) : "[]",

        isVoiceEnabled: editingRoleId ? (safeBaseRole?.requireVoiceInterview ?? false) : (initialData?.requireVoiceInterview ?? true),
        voiceInterviewTemplate: editingRoleId ? (safeBaseRole?.voiceInterviewTemplate || "general") : (initialData?.voiceInterviewTemplate || "general"),
        voiceInterviewQuestionsLength: editingRoleId ? (safeBaseRole?.voiceInterviewQuestions?.length || 2) : (initialData?.voiceInterviewQuestions?.length || 2),
        directUpload: editingRoleId ? (safeBaseRole?.directUpload || false) : (initialData?.directUpload || false),
        photoRequirement: editingRoleId ? (safeBaseRole?.photoRequirement || "none") : (initialData?.photoRequirement || "hidden"),

        ...(initialData ? {
          startDate: initialData.startDate || defaultStart,
          endDate: initialData.endDate || defaultEnd,
          isOpenEnded: initialData.endDate ? false : true,
        } : {}),

        ...(trackRoleFields ? (editingRoleId ? expectedEdit : expectedMount) : {})
      };

      const isDiff = JSON.stringify(current) !== JSON.stringify(expected);
      if (isDiff) {
        const diffs: any = {};
        for (const key in current) {
          if (JSON.stringify((current as any)[key]) !== JSON.stringify((expected as any)[key])) {
            diffs[key] = { current: (current as any)[key], expected: (expected as any)[key] };
          }
        }
        for (const key in expected) {
          if (!(key in current)) {
            diffs[key] = { current: undefined, expected: (expected as any)[key] };
          }
        }
        console.log("Unsaved changes detected in fields:", diffs);
      }
      return isDiff;
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
  const [company, setCompany] = useState(() => {
    if (initialData?.company) return initialData.company;
    return userProfile?.companyName || "";
  });
  const [companyLogo, setCompanyLogo] = useState<string | null>(() => {
    if (initialData?.companyLogo && !initialData.companyLogo.startsWith("blob:")) return initialData.companyLogo;
    return localStorage.getItem("last_used_logo") || null;
  });
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(initialData?.status === "مسودة" ? initialData.id : null);
  // Profile Data Mock
  const [type, setType] = useState(initialData?.type || "دوام كامل");
  const [types, setTypes] = useState<string[]>(
    initialData?.types || (initialData?.type ? [initialData.type] : ["دوام كامل"])
  );
  const [autoRejectCity, setAutoRejectCity] = useState(initialData?.autoRejectCity || false);
  const [autoRejectQualification, setAutoRejectQualification] = useState(initialData?.autoRejectQualification || false);
  const [autoRejectExperience, setAutoRejectExperience] = useState(initialData?.autoRejectExperience || false);

  const [location, setLocation] = useState(initialData?.location || "");
  const [locations, setLocations] = useState<string[]>(
    initialData?.locations || (initialData?.location ? [initialData.location] : [])
  );
  const [experience, setExperience] = useState(initialData?.experience || "لا يشترط خبرة");
  const [qualification, setQualification] = useState(initialData?.qualification || "ثانوي");
  const [salaryMin, setSalaryMin] = useState(initialData?.salaryMin || "");
  const [salaryMax, setSalaryMax] = useState(initialData?.salaryMax || "");
  const [isSalaryHidden, setIsSalaryHidden] = useState(initialData?.isSalaryHidden || false);
  const [askExpectedSalary, setAskExpectedSalary] = useState<"hidden" | "open" | "ranges">(initialData?.askExpectedSalary || "hidden");
  const [expectedSalaryRanges, setExpectedSalaryRanges] = useState<string[]>(initialData?.expectedSalaryRanges || []);
  const [salaryRangeMinInput, setSalaryRangeMinInput] = useState("");
  const [salaryRangeMaxInput, setSalaryRangeMaxInput] = useState("");
  const defaultStart = new Date().toISOString().slice(0, 16);
  const defaultDays = (userProfile?.subscription_tier === 'immediate' || userProfile?.subscription_tier === 'one-time') ? 45 : 30;
  const defaultEnd = new Date(Date.now() + defaultDays * 24 * 60 * 60 * 1000)
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
  const [hideRoleSummary, setHideRoleSummary] = useState(baseRole?.hideRoleSummary || false);
  const [hideResponsibilities, setHideResponsibilities] = useState(baseRole?.hideResponsibilities || false);
  const [hideQualifications, setHideQualifications] = useState(baseRole?.hideQualifications || false);
  const [hideBenefits, setHideBenefits] = useState(baseRole?.hideBenefits || false);
  const [hideTargetMajors, setHideTargetMajors] = useState(baseRole?.hideTargetMajors || false);
  const [hideSkillsAndLanguages, setHideSkillsAndLanguages] = useState(baseRole?.hideSkillsAndLanguages || false);
  const [newMajorInput, setNewMajorInput] = useState("");
  const [aiInstructions, setAiInstructions] = useState(baseRole?.aiInstructions || "");

  const [useAiOverride, setUseAiOverride] = useState(!!baseRole?.aiOverrideFields || !!initialData?.aiOverrideFields || false);
  const [aiRoleSummary, setAiRoleSummary] = useState(baseRole?.aiOverrideFields?.roleSummary || initialData?.aiOverrideFields?.roleSummary || "");
  const [aiResponsibilities, setAiResponsibilities] = useState(baseRole?.aiOverrideFields?.responsibilities || initialData?.aiOverrideFields?.responsibilities || "");
  const [aiQualifications, setAiQualifications] = useState(baseRole?.aiOverrideFields?.qualifications || initialData?.aiOverrideFields?.qualifications || "");
  const [aiTargetMajors, setAiTargetMajors] = useState<string[]>(baseRole?.aiOverrideFields?.targetMajors || initialData?.aiOverrideFields?.targetMajors || []);
  const [aiTargetSkills, setAiTargetSkills] = useState<string[]>(baseRole?.aiOverrideFields?.targetSkills || initialData?.aiOverrideFields?.targetSkills || []);
  const [aiLanguages, setAiLanguages] = useState<string[]>(baseRole?.aiOverrideFields?.languages || initialData?.aiOverrideFields?.languages || []);

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
    { text: string; type: "yes_no" | "options" | "age_condition"; options?: string[]; requiredAnswer: string; minAge?: number; maxAge?: number }[]
  >(baseRole?.knockoutQuestions || []);
  const [isKnockoutExpanded, setIsKnockoutExpanded] = useState(true);
  const [newKqText, setNewKqText] = useState("");
  const [newKqType, setNewKqType] = useState<"yes_no" | "options" | "age_condition" | "nationality" | "city" | "education" | "experience">("yes_no");
  const [newKqMinAge, setNewKqMinAge] = useState<number | "">("");
  const [newKqMaxAge, setNewKqMaxAge] = useState<number | "">("");
  const [newKqOptions, setNewKqOptions] = useState<string[]>(["نعم", "لا"]);
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

  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant", content: string }[]>(
    initialData?.aiChatHistory || [{ role: "assistant", content: "أهلاً بك! أنا مستشار التوظيف الذكي الخاص بمنصة فرز. يسعدني مساعدتك في صياغة الإعلان الوظيفي. أخبرني باختصار عن الشاغر الذي تبحث عنه." }]
  );
  const [chatInput, setChatInput] = useState("");
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isApplyingAi, setIsApplyingAi] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user" as const, content: chatInput.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatError(null);
    setIsChatLoading(true);

    try {
      const response = await supabase.functions.invoke('magic-autofill', {
        body: { mode: 'chat', messages: [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content })) }
      });
      if (response.error) throw new Error(response.error.message);

      const data = response.data;
      if (data && data.reply) {
        setChatMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = "حدث خطأ أثناء الاتصال بالمستشار الذكي.";
      try {
        if (err.message && !err.message.includes("fetch")) {
          errMsg = err.message;
        }
      } catch (e) { }

      setChatError(errMsg);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleApplyChatToForm = async () => {
    const messagesToExtract = chatInput.trim()
      ? [...chatMessages, { role: "user" as const, content: chatInput.trim() }]
      : chatMessages;

    if (messagesToExtract.length === 0) return;

    setIsApplyingAi(true);
    try {
      const response = await supabase.functions.invoke('magic-autofill', {
        body: { mode: 'extract', messages: messagesToExtract.map(m => ({ role: m.role, content: m.content })) }
      });
      if (response.error) throw new Error(response.error.message);

      const data = response.data;
      if (data && data.extracted) {
        const ext = data.extracted;
        if (ext.roleTitle) setRoleTitle(ext.roleTitle);
        if (ext.roleSummary) setRoleSummary(ext.roleSummary);
        if (ext.responsibilities) setResponsibilities(ext.responsibilities);
        if (ext.qualifications) setQualifications(ext.qualifications);
        if (ext.benefits) setBenefits(ext.benefits);
        if (ext.type) {
          setType(ext.type);
          setTypes(prev => Array.from(new Set([...prev, ext.type])));
        }
        if (ext.experience) setExperience(ext.experience);
        if (ext.qualification) setQualification(ext.qualification);
        if (ext.location) {
          setLocation(ext.location);
          setLocations(prev => Array.from(new Set([...prev, ext.location])));
        }
        if (ext.selectedSkills && Array.isArray(ext.selectedSkills)) {
          setSelectedSkills(prev => Array.from(new Set([...prev, ...ext.selectedSkills])));
        }
        if (ext.selectedLanguages && Array.isArray(ext.selectedLanguages)) {
          setSelectedLanguages(prev => Array.from(new Set([...prev, ...ext.selectedLanguages])));
        }
        if (ext.targetMajors && Array.isArray(ext.targetMajors)) {
          setTargetMajors(prev => Array.from(new Set([...prev, ...ext.targetMajors])));
        }
        if (ext.adTitle && adType !== "single") {
          setCampaignTitle(ext.adTitle);
          setEnableWelcomeUI(true);
        }
        if (ext.welcomeMessage) {
          setCampaignDescription(ext.welcomeMessage);
          setEnableWelcomeUI(true);
        }

        window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "تم تطبيق التفاصيل المستخرجة بنجاح!", type: "success" } }));
      }
    } catch (err: any) {
      console.error(err);
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "فشل استخراج البيانات من المحادثة.", type: "error" } }));
    } finally {
      setIsApplyingAi(false);
    }
  };


  const handleTextAreaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, setter: (value: string) => void, currentValue: string) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    if (pastedText) {
      const parts = pastedText
        .split(/[\n,،•*-]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const newText = parts.join('\n');
      setter(currentValue ? currentValue + '\n' + newText : newText);
    }
  };

  const handleSwitchToMultiple = () => {
    if (roles.length > 0) {
      setEditingRoleId(roles[0].id);
    }
    setAdType("campaign");
    setIsAdvancedSettingsOpen(true);
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
      if (firstRole.askExpectedSalary !== undefined) setAskExpectedSalary(firstRole.askExpectedSalary);
      if (firstRole.expectedSalaryRanges !== undefined) setExpectedSalaryRanges(firstRole.expectedSalaryRanges);
      if (firstRole.knockoutQuestions) setKnockoutQuestions(firstRole.knockoutQuestions);
      if (firstRole.skills) setSelectedSkills(firstRole.skills);
      if (firstRole.languages) setSelectedLanguages(firstRole.languages);
      if (firstRole.requireVoiceInterview !== undefined) setIsVoiceEnabled(firstRole.requireVoiceInterview);
      if (firstRole.voiceInterviewTemplate) setVoiceInterviewTemplate(firstRole.voiceInterviewTemplate);
      if (firstRole.voiceInterviewQuestions) setVoiceInterviewQuestions(firstRole.voiceInterviewQuestions);
      if (firstRole.photoRequirement !== undefined) setPhotoRequirement(firstRole.photoRequirement);
      if (firstRole.directUpload !== undefined) setDirectUpload(firstRole.directUpload);


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
    if (attachment === "سيرة ذاتية PDF") {
      if (!requiredAttachments.includes("سيرة ذاتية PDF")) {
        setRequiredAttachments([...requiredAttachments, "سيرة ذاتية PDF"]);
      }
      return;
    }
    let newAttachments = [...requiredAttachments];
    if (newAttachments.includes(attachment)) {
      newAttachments = newAttachments.filter((a) => a !== attachment);
    } else {
      newAttachments.push(attachment);
    }
    // Always ensure CV is required
    if (!newAttachments.includes("سيرة ذاتية PDF")) {
      newAttachments.push("سيرة ذاتية PDF");
    }
    setRequiredAttachments(newAttachments);
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
      setHideRoleSummary(false);
      setHideResponsibilities(false);
      setHideQualifications(false);
      setHideBenefits(false);
      setHideTargetMajors(false);
      setHideSkillsAndLanguages(false);
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
    if (role.askExpectedSalary !== undefined) setAskExpectedSalary(role.askExpectedSalary);
    if (role.expectedSalaryRanges !== undefined) setExpectedSalaryRanges(role.expectedSalaryRanges);
    if (role.knockoutQuestions) setKnockoutQuestions(role.knockoutQuestions);
    setLocations(role.locations && role.locations.length > 0 ? role.locations : (role.location ? [role.location] : []));
    setTargetMajors(role.targetMajors || []);
    setHideRoleSummary(role.hideRoleSummary || false);
    setHideResponsibilities(role.hideResponsibilities || false);
    setHideQualifications(role.hideQualifications || false);
    setHideBenefits(role.hideBenefits || false);
    setHideTargetMajors(role.hideTargetMajors || false);
    setHideSkillsAndLanguages(role.hideSkillsAndLanguages || false);
  };

  const handleSaveRole = () => {
    if (!roleTitle.trim()) {
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى تعبئة المسمى الوظيفي أولاً.", type: "warning" } }));
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
        types: [...types],
        autoRejectCity,
        autoRejectQualification,
        autoRejectExperience,
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
        hideRoleSummary,
        hideResponsibilities,
        hideQualifications,
        hideBenefits,
        hideSkillsAndLanguages,
        aiOverrideFields: useAiOverride ? {
          roleSummary: aiRoleSummary,
          responsibilities: aiResponsibilities,
          qualifications: aiQualifications,
          targetMajors: aiTargetMajors,
          targetSkills: aiTargetSkills,
          languages: aiLanguages
        } : undefined,
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
          types: [...types],
          autoRejectCity,
          autoRejectQualification,
          autoRejectExperience,
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
          hideRoleSummary,
          hideResponsibilities,
          hideQualifications,
          hideBenefits,
          hideTargetMajors,
          hideSkillsAndLanguages,
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
    setExperience("لا يشترط خبرة");
    setQualification("ثانوي");
    setSalaryMin("");
    setSalaryMax("");
    setLocations([]);
    setTargetMajors([]);
    setHideRoleSummary(false);
    setHideResponsibilities(false);
    setHideQualifications(false);
    setHideBenefits(false);
    setHideTargetMajors(false);
    setHideSkillsAndLanguages(false);
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
        types: [...types],
        autoRejectCity,
        autoRejectQualification,
        autoRejectExperience,
        location,
        experience,
        qualification,
        salaryMin,
        salaryMax,
        isSalaryHidden,
        knockoutQuestions,
        hideRoleSummary,
        hideResponsibilities,
        hideQualifications,
        hideBenefits,
        hideSkillsAndLanguages,
        aiOverrideFields: useAiOverride ? {
          roleSummary: aiRoleSummary,
          responsibilities: aiResponsibilities,
          qualifications: aiQualifications,
          targetMajors: aiTargetMajors,
          targetSkills: aiTargetSkills,
          languages: aiLanguages
        } : undefined,
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
          types: [...types],
          autoRejectCity,
          autoRejectQualification,
          autoRejectExperience,
          location,
          locations,
          targetMajors,
          experience,
          qualification,
          salaryMin,
          salaryMax,
          isSalaryHidden,
          knockoutQuestions,
          hideRoleSummary,
          hideResponsibilities,
          hideQualifications,
          hideBenefits,
          hideTargetMajors,
          hideSkillsAndLanguages,
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
      aiChatHistory: chatMessages,
      description: mainDesc,
      roles: finalRoles,
      startDate,
      endDate: isOpenEnded ? undefined : endDate,
      company: company,
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
      askExpectedSalary: createJobType === "quick_link" ? "hidden" : askExpectedSalary,
      expectedSalaryRanges: createJobType === "quick_link" ? [] : expectedSalaryRanges,
      knockoutQuestions: createJobType === "quick_link" ? [] : knockoutQuestions,
      type: createJobType === "quick_link" ? "دوام كامل" : type,
      types: createJobType === "quick_link" ? ["دوام كامل"] : types,
      autoRejectCity: createJobType === "quick_link" ? false : autoRejectCity,
      autoRejectQualification: createJobType === "quick_link" ? false : autoRejectQualification,
      autoRejectExperience: createJobType === "quick_link" ? false : autoRejectExperience,
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

    const isEditing = initialData && initialData.status !== "مسودة";
    window.dispatchEvent(new CustomEvent("showToast", { detail: isEditing ? "تم تحديث بيانات الإعلان بنجاح" : "تم نشر الإعلان بنجاح، هو الآن متاح للمتقدمين" }));

    const draftId = onSubmit(baseJobData, currentDraftId || undefined);
    if (draftId) {
      setCurrentDraftId(draftId);
    }
  };


  const handleSaveAsDraft = () => {

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
            types: [...types],
            autoRejectCity,
            autoRejectQualification,
            autoRejectExperience,
            experience,
            qualification,
            salaryMin,
            salaryMax,
            isSalaryHidden,
            knockoutQuestions,
            hideRoleSummary,
            hideResponsibilities,
            hideQualifications,
            hideBenefits,
            hideSkillsAndLanguages,
            aiOverrideFields: useAiOverride ? {
              roleSummary: aiRoleSummary,
              responsibilities: aiResponsibilities,
              qualifications: aiQualifications,
              targetMajors: aiTargetMajors,
              targetSkills: aiTargetSkills,
              languages: aiLanguages
            } : undefined,
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
      aiChatHistory: chatMessages,
      roles: finalRoles,
      company,
      companyLogo: companyLogo || undefined,
      type,
      types: [...types],
      autoRejectCity,
      autoRejectQualification,
      autoRejectExperience,
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
      requireVoiceInterview: isVoiceEnabled,
      voiceInterviewTemplate,
      voiceInterviewQuestions,
      knockoutQuestions,
      askExpectedSalary,
      expectedSalaryRanges,
      photoRequirement: createJobType === "single" ? photoRequirement : undefined,
      portfolioRequirement,
      startDate: startDate || undefined,
      endDate: isOpenEnded ? undefined : (endDate || undefined),
    };

    if (onSubmit) {
      onSubmit({ ...draftData, status: "مسودة" } as any, currentDraftId || undefined);
      window.dispatchEvent(new CustomEvent("showToast", { detail: "تم حفظ المسودة بنجاح" }));
      if (typeof onBack === "function") onBack();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isMainFormEmpty = !roleTitle.trim() || !type.trim() || (!location.trim() && locations.length === 0) || !experience.trim();

    if ((adType === "single" || createJobType === "quick_link") && isMainFormEmpty) {
      alert("يرجى التأكد من تعبئة الحقول الإلزامية: (المسمى الوظيفي، نوع العمل، مقر العمل، وسنوات الخبرة).");
      return;
    }

    if (adType === "campaign" && roles.length === 0) {
      if (isMainFormEmpty) {
        alert("يرجى التأكد من تعبئة الحقول الإلزامية: (المسمى الوظيفي، نوع العمل، مقر العمل، وسنوات الخبرة) للدور الوظيفي الأول على الأقل.");
        return;
      }
      if (enableWelcomeUI && !campaignTitle.trim()) {
        window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى تعبئة عنوان البوابة/الإعلان الأساسي للحملة.", type: "warning" } }));
        return;
      }
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
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.", type: "error" } }));
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
                تأكيد إنشاء الإعلان
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-6 font-medium">
                هل أنت متأكد من رغبتك في إنشاء وعرض هذا الإعلان؟
              </p>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8 max-h-48 overflow-y-auto">
                <h3 className="font-bold text-navy dark:text-white text-sm mb-3">المسميات الوظيفية المُضافة:</h3>
                <ul className="space-y-2">
                  {adType === "single" || createJobType === "quick_link" ? (
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      {roleTitle.trim() || "شاغر جديد"}
                    </li>
                  ) : (
                    roles.length > 0 ? roles.map((r, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        {r.title || `شاغر رقم ${i + 1}`}
                      </li>
                    )) : (
                      <li className="text-slate-400 text-sm font-medium">لم يتم إضافة شواغر للحملة بعد.</li>
                    )
                  )}
                </ul>
              </div>

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
                  نعم، أنشئ الإعلان
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
      <div className="w-full max-w-[1400px] mx-auto pb-32 flex flex-col lg:flex-row gap-8 px-4 items-start relative">

        {/* Smart Assistant Sidebar */}
        <div className="order-2 lg:order-2 w-full lg:w-[400px] shrink-0 lg:sticky lg:top-8 lg:mt-[68px] bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[500px] lg:h-[650px] z-40">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-navy dark:text-white flex items-center gap-2">
                <Sparkles className="text-primary" size={18} /> مستشار التوظيف الذكي
              </h3>
              <p className="text-xs text-slate-500 mt-1">يساعدك في صياغة الإعلان و استخراج التفاصيل</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatScrollRef}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`} dir="ltr">
                <div dir="rtl" className={`p-3 rounded-2xl max-w-[90%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-700 text-navy dark:text-white rounded-tl-sm'}`}>
                  {msg.content.split('\n').map((line, idx) => <React.Fragment key={idx}>{line}<br /></React.Fragment>)}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-start" dir="ltr">
                <div dir="rtl" className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700 rounded-tl-sm flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => {
                  setChatInput(e.target.value);
                  if (chatError) setChatError(null);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !chatError) handleSendChatMessage(); }}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary dark:text-white"
                disabled={isChatLoading || isApplyingAi}
                maxLength={4000}
              />
              <button type="button" onClick={handleSendChatMessage} disabled={!chatInput.trim() || isChatLoading || isApplyingAi || !!chatError} className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 disabled:opacity-50 transition-opacity">
                <ArrowLeft size={18} className="rotate-180" />
              </button>
            </div>
            {chatError && (
              <div className="mb-3 px-2 flex items-start gap-1.5 text-orange-600 dark:text-orange-400">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <p className="text-xs font-bold">{chatError}</p>
              </div>
            )}
            <button
              type="button"
              onClick={async () => { await handleApplyChatToForm(); }}
              disabled={chatMessages.length < 2 || isApplyingAi || isChatLoading}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-navy font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity shadow-md"
            >
              {isApplyingAi ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Download size={16} />}
              تطبيق التفاصيل على النموذج
            </button>
          </div>
        </div>
        {/* Main Form Content */}
        <div className="order-1 flex-1 min-w-0 w-full lg:max-w-[900px] bg-transparent">
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
            className="flex flex-col gap-4"
          >

            {createJobType !== "quick_link" && (
              <div className="mb-1">
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
              {/* --- STEPPER UI START --- */}
              {createJobType !== "quick_link" && (
                <div className="mb-12 w-full max-w-3xl mx-auto px-4 mt-8">
                  <div className="flex items-center justify-between relative">
                    {/* Stepper Lines */}
                    <div className="absolute top-1/2 left-[28px] right-[28px] h-2 bg-slate-200 dark:bg-slate-700 z-0 rounded-full transform -translate-y-1/2 shadow-inner">
                      <div className="absolute top-0 bottom-0 right-0 bg-gradient-to-l from-primary/90 to-primary z-0 rounded-full transition-all duration-700 shadow-md" style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }} />
                    </div>

                    <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => setCurrentStep(1)}>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 ${currentStep === 1 ? 'bg-gradient-to-b from-primary to-primary/80 text-white shadow-[0_8px_15px_-3px_rgba(0,0,0,0.2),0_4px_0_0_rgba(0,0,0,0.15)] scale-110 border-white/50' : currentStep > 1 ? 'bg-primary text-white border-white shadow-[0_4px_0_0_rgba(0,0,0,0.1)]' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
                        {currentStep > 1 ? <CheckCircle size={24} className="animate-in zoom-in" /> : "1"}
                      </div>
                      <span className={`text-sm font-black mt-1 transition-colors ${currentStep === 1 ? 'text-primary drop-shadow-sm' : currentStep > 1 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>تفاصيل الاعلان</span>
                    </div>

                    <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => { if (currentStep >= 1) setCurrentStep(2) }}>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 ${currentStep === 2 ? 'bg-gradient-to-b from-primary to-primary/80 text-white shadow-[0_8px_15px_-3px_rgba(0,0,0,0.2),0_4px_0_0_rgba(0,0,0,0.15)] scale-110 border-white/50' : currentStep > 2 ? 'bg-primary text-white border-white shadow-[0_4px_0_0_rgba(0,0,0,0.1)]' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
                        {currentStep > 2 ? <CheckCircle size={24} className="animate-in zoom-in" /> : "2"}
                      </div>
                      <span className={`text-sm font-black mt-1 transition-colors ${currentStep === 2 ? 'text-primary drop-shadow-sm' : currentStep > 2 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>متطلبات التقديم</span>
                    </div>

                    <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={() => { if (currentStep >= 2) setCurrentStep(3) }}>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 border-4 dark:border-slate-900 ${currentStep === 3 ? 'bg-gradient-to-b from-primary to-primary/80 text-white shadow-[0_8px_15px_-3px_rgba(0,0,0,0.2),0_4px_0_0_rgba(0,0,0,0.15)] scale-110 border-white/50' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
                        3
                      </div>
                      <span className={`text-sm font-black mt-1 transition-colors ${currentStep === 3 ? 'text-primary drop-shadow-sm' : 'text-slate-400'}`}>توجيهات الفرز والنشر</span>
                    </div>
                  </div>
                </div>
              )}
              {/* --- STEPPER UI END --- */}



              {createJobType === "quick_link" && (
                <div className="bg-cyan-50 dark:bg-cyan-900/20 border-2 border-cyan-100 dark:border-cyan-800/50 p-6 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-5 shadow-sm mb-4">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-full flex items-center justify-center shrink-0 text-cyan-600 dark:text-cyan-400">
                    <Sparkles className="animate-pulse" size={24} />
                  </div>
                  <div className="text-center md:text-right flex-1">
                    <h3 className="font-bold text-cyan-800 dark:text-cyan-400 text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                      💡 تنبيه هام لنظام الفرز الآلي
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
                <div className={currentStep === 1 ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
                  <div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6">
                    <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-3 mb-6">
                      <Briefcase className="text-primary" size={24} /> المعلومات الأساسية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex items-center gap-6 md:col-span-2 mb-2 p-5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div
                          className={`relative overflow-hidden w-20 h-20 p-0 rounded-2xl bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 flex items-center justify-center border-2 ${companyLogo ? "border-solid border-primary/20 cursor-pointer hover:border-primary/50" : "border-dashed"} transition-colors shrink-0 shadow-sm`}
                          onClick={() => { if (companyLogo) setLightboxPhoto(companyLogo); }}
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
                              <button type="button" onClick={() => { setCompanyLogo(null); localStorage.removeItem("last_used_logo"); localStorage.removeItem("savedCompanyLogo"); }} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">إزالة الشعار</button>
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
                          onChange={(e) => {
                            setCompany(e.target.value);
                          }}
                          placeholder="مثال: شركة الحلول الذكية..."
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                        />{" "}
                      </div>{" "}
                    </div>
                  </div>
                  {adType === "campaign" && roles.length > 0 && (
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {roles.map((r) => (
                          <div
                            key={r.id}
                            className="group relative bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between gap-4 overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-2 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                            <div className="pr-3 flex-1 flex flex-col">
                              <h4 className="text-lg font-bold text-navy dark:text-white group-hover:text-primary transition-colors truncate">
                                {r.title}
                              </h4>
                              {r.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                                  {r.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2.5 pt-4 mt-auto">
                                {r.location && <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">{r.location}</span>}
                                {r.type && <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">{r.type}</span>}
                                {r.salaryMin && <span className="text-[11px] flex items-center gap-1.5 font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30 px-2.5 py-1 rounded-lg"><CreditCard size={14} className="ml-1.5" /> {r.salaryMin} {r.salaryMax && `- ${r.salaryMax}`} ريال</span>}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pr-3 pt-3 mt-2 border-t border-slate-100 dark:border-slate-700/50 justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  handleEditRole(r as any);
                                }}
                                className="bg-white text-primary border border-primary/20 hover:bg-primary/5 dark:bg-slate-800 dark:text-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center flex-1 sm:flex-none"
                                title="تعديل الشاغر"
                              >
                                <Pencil size={14} className="ml-1" /> تعديل
                              </button>
                              <button
                                type="button"
                                onClick={() => setRoleToDelete(r.id)}
                                className="bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center flex-1 sm:flex-none"
                                title="حذف الشاغر"
                              >
                                <Trash2 size={14} className="ml-1" /> حذف
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {!showRoleForm && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingRole(true);
                            setIsAdvancedSettingsOpen(true);
                            setEditingRoleId(null);
                            setType("دوام كامل");
                            setLocation("");
                            setExperience("لا يشترط خبرة");
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
                </div>
              )}


              <div className={currentStep === 1 || currentStep === 2 || currentStep === 3 ? "block animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6" : "hidden"}>
                {showRoleForm && (
                  <div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6">
                    {currentStep === 1 && (
                      <>
                        {adType === "campaign" && (
                          <h3 className="text-xl font-bold text-navy dark:text-white flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <Users className="text-primary" size={24} /> تفاصيل الأدوار والمتطلبات
                            </div>
                            <span className="text-xs md:text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold">
                              الشاغر رقم {editingRoleId ? roles.findIndex(r => r.id === editingRoleId) + 1 : roles.length + 1}
                            </span>
                          </h3>
                        )}
                        {adType === "campaign" && (
                          <p className="text-sm font-medium text-gray-500 mb-6 px-1">
                            (تنبيه: هذه البيانات أساسية لعمل محرك الفرز بدقة، حتى وإن تم تفعيل خاصية التخطي للمتقدمين)
                          </p>
                        )}
                        {/* Main Section Heading */}
                        {/* AI Override Fields Toggle - Moved to Step 1 */}
                        <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-[32px] border-2 border-primary/20 shadow-inner mt-8 mb-8">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                <Sparkles size={20} />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-primary">معايير مخصصة لمحرك الفرز</h3>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={useAiOverride}
                                onChange={(e) => setUseAiOverride(e.target.checked)}
                              />
                              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>

                          <AnimatePresence>
                            {useAiOverride && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-amber-50 dark:bg-amber-500/10 border-r-4 border-amber-500 p-4 rounded-xl mt-4 mb-2">
                                  <p className="text-sm font-bold text-amber-700 dark:text-amber-400 leading-relaxed flex items-center gap-2">
                                    <span>⚠️</span> استخدم هذه الحقول فقط إذا كان لديك شروط دقيقة أو معقدة لا ترغب أن يراها المتقدمون للوظيفة. إذا تركتها فارغة، سيعتمد النظام على الوصف العام أدناه.
                                  </p>
                                </div>
                                <div className="space-y-6 border-t border-primary/20 pt-6 mt-2">
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2">نبذة عن الدور (للذكاء الاصطناعي)</label>
                                    <textarea
                                      value={aiRoleSummary}
                                      onChange={(e) => setAiRoleSummary(e.target.value)}
                                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                                      rows={3}
                                      placeholder="اكتب المعايير الدقيقة للنبذة عن الدور..."
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2">المهام والمسؤوليات (للذكاء الاصطناعي)</label>
                                    <textarea
                                      value={aiResponsibilities}
                                      onChange={(e) => setAiResponsibilities(e.target.value)}
                                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                                      rows={4}
                                      placeholder="اكتب المهام والمسؤوليات المخصصة للفرز..."
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2">المؤهلات والمتطلبات (للذكاء الاصطناعي)</label>
                                    <textarea
                                      value={aiQualifications}
                                      onChange={(e) => setAiQualifications(e.target.value)}
                                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                                      rows={4}
                                      placeholder="اكتب المؤهلات والمتطلبات المخصصة للفرز..."
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2">التخصصات المستهدفة (للذكاء الاصطناعي)</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {aiTargetMajors.map((major, i) => (
                                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center gap-1">
                                          {major}
                                          <button type="button" onClick={() => setAiTargetMajors(prev => prev.filter((_, idx) => idx !== i))}><X size={12} /></button>
                                        </span>
                                      ))}
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="أضف تخصص واضغط Enter"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          const val = e.currentTarget.value.trim();
                                          if (val && !aiTargetMajors.includes(val)) {
                                            setAiTargetMajors(prev => [...prev, val]);
                                            e.currentTarget.value = "";
                                          }
                                        }
                                      }}
                                      className="w-full px-4 py-2 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2">المهارات المستهدفة (للذكاء الاصطناعي)</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {aiTargetSkills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center gap-1">
                                          {skill}
                                          <button type="button" onClick={() => setAiTargetSkills(prev => prev.filter((_, idx) => idx !== i))}><X size={12} /></button>
                                        </span>
                                      ))}
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="أضف مهارة واضغط Enter"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          const val = e.currentTarget.value.trim();
                                          if (val && !aiTargetSkills.includes(val)) {
                                            setAiTargetSkills(prev => [...prev, val]);
                                            e.currentTarget.value = "";
                                          }
                                        }
                                      }}
                                      className="w-full px-4 py-2 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2">اللغات المطلوبة (للذكاء الاصطناعي)</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {aiLanguages.map((lang, i) => (
                                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center gap-1">
                                          {lang}
                                          <button type="button" onClick={() => setAiLanguages(prev => prev.filter((_, idx) => idx !== i))}><X size={12} /></button>
                                        </span>
                                      ))}
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="أضف لغة واضغط Enter"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          const val = e.currentTarget.value.trim();
                                          if (val && !aiLanguages.includes(val)) {
                                            setAiLanguages(prev => [...prev, val]);
                                            e.currentTarget.value = "";
                                          }
                                        }
                                      }}
                                      className="w-full px-4 py-2 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <h3 className="text-xl font-bold text-navy dark:text-white mb-2">تفاصيل الاعلان</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">💡 سيقوم محرك الفرز بقراءة هذا الوصف وفرز السير الذاتية بناءً عليه تلقائياً.</p>

                        {createJobType !== "quick_link" && (
                          <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 mt-2">
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
                          </div>
                        )}

                        {/* Welcome UI removed as requested */}

                        <div className="space-y-3">
                          <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                            المسمى الوظيفي (Role) <span className="text-red-500">*</span>
                          </label>
                          <input

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
                              <SearchableSelect
                                options={["دوام كامل", "دوام جزئي", "عن بعد", "تدريب"].filter((c) => !types.includes(c))}
                                value={""}
                                onChange={(val) => {
                                  if (val && !types.includes(val)) {
                                    setTypes([...types, val]);
                                    setType(val); // fallback for older clients if needed
                                    if (val === "عن بعد" && !locations.includes("لا يشترط / كافة المدن")) {
                                      setLocations([...locations, "لا يشترط / كافة المدن"]);
                                    }
                                  }
                                }}
                                placeholder="اختر نوع العمل..."
                              />
                              {types.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                  <AnimatePresence>
                                    {types.map((t) => (
                                      <motion.span
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        key={t}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-bold"
                                      >
                                        {t}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newTypes = types.filter((l) => l !== t);
                                            setTypes(newTypes.length > 0 ? newTypes : ["دوام كامل"]);
                                            if (newTypes.length > 0) setType(newTypes[0]); else setType("دوام كامل");
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
                                          if (newLocs.length > 0) setLocation(newLocs[0]); else setLocation("");
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
                                <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">لا يشترط خبرة</option>
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
                                <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">لا يشترط مؤهل</option>
                                <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ثانوي</option>
                                <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دبلوم</option>
                                <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">بكالوريوس</option>
                                <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ماجستير</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">التخصصات المستهدفة <span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>
                              <span className="relative group inline-flex items-center ml-1">
                                <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                                <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                  اترك هذا الحقل فارغاً إذا كانت الوظيفة تقبل جميع التخصصات لتوسيع نطاق المتقدمين في نظام الفرز الآلي.
                                  <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                                </div>
                              </span>
                            </label>
                          </div>
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

                        {/* AI Assistant Button Removed */}

                        <div className="space-y-6 mt-6">
                          <div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                                  نبذة عن الدور
                                  <span className="relative group inline-flex items-center ml-1">
                                    <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                                    <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                      ترك هذا الحقل فارغاً سيجعل محرك نظام الفرز يعتمد على المعايير القياسية للمسمى الوظيفي. لتقييم أدق، أضف نبذة مختصرة.
                                      <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                                    </div>
                                  </span>
                                </label>
                              </div>
                              <textarea
                                rows={3}
                                value={roleSummary}
                                onChange={(e) => setRoleSummary(e.target.value)}
                                placeholder="مثال: نبحث عن موظف طموح لإدارة علاقات العملاء في فرعنا الرئيسي..."
                                className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                              />

                            </div>
                          </div>


                          <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                                المهام والمسؤوليات
                                <span className="relative group inline-flex items-center ml-1">
                                  <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                                  <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                    يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة نظام الفرز الآلي.
                                    <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                                  </div>
                                </span>
                              </label>
                            </div>
                            <textarea onPaste={(e) => handleTextAreaPaste(e, setResponsibilities, responsibilities)}
                              rows={4}
                              value={responsibilities}
                              onChange={(e) => setResponsibilities(e.target.value)}
                              placeholder="مثال: - تحقيق أهداف المبيعات الشهرية. - إعداد تقارير الأداء..."
                              className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                            />

                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                                المؤهلات والمتطلبات
                                <span className="relative group inline-flex items-center ml-1">
                                  <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                                  <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                    أضف المؤهلات الأساسية المطلوبة ليتم أخذها بعين الاعتبار في نظام الفرز الآلي.
                                    <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                                  </div>
                                </span>
                              </label>
                            </div>
                            <textarea

                              rows={4}
                              value={qualifications}
                              onChange={(e) => setQualifications(e.target.value)}
                              placeholder="مثال: خبرة لا تقل عن 3 سنوات في مبيعات التجزئة، إجادة استخدام أنظمة CRM..."
                              className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                            />
                          </div>

                          {createJobType !== "quick_link" && (
                            <>
                              <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700/60 mt-8">
                                {" "}
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">
                                    المهارات المستهدفة
                                    <span className="relative group inline-flex items-center ml-1">
                                      <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                                      <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                        تحديد المهارات التقنية الدقيقة يجعل نظام الفرز الآلي أكثر صرامة ودقة.
                                        <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                                      </div>
                                    </span>
                                  </label>
                                </div>{" "}
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
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                                      اللغات المطلوبة <span className="text-slate-400 font-normal ml-1">(اختياري)</span>
                                    </label>
                                  </div>
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
                              {/* Custom Attachments Section */}{" "}
                            </>
                          )}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                                المميزات <span className="text-slate-400 font-normal text-xs ml-1">(اختياري)</span>
                              </label>
                            </div>
                            <textarea onPaste={(e) => handleTextAreaPaste(e, setBenefits, benefits)}
                              rows={3}
                              value={benefits}
                              onChange={(e) => setBenefits(e.target.value)}
                              placeholder="مثال: تأمين طبي فئة A، عمولات مبيعات تصل إلى 10%، سيارة..."
                              className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                            />
                          </div>
                        </div>
                        <div className="space-y-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                          <div className="mt-6 space-y-3">
                            <label className="text-sm font-bold text-navy dark:text-white mr-1 block">
                              ميزانية الوظيفة / الراتب <span className="text-slate-400 dark:text-slate-500 text-xs font-normal mr-1">(اختياري)</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                              <div className="space-y-3">
                                <span className="text-xs text-slate-500 font-bold block">الحد الأدنى</span>
                                <input
                                  required={false}
                                  type="number"
                                  value={salaryMin}
                                  onChange={(e) => setSalaryMin(e.target.value)}
                                  placeholder="مثال: 5000"
                                  className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                />
                              </div>

                              <div className="space-y-3">
                                <span className="text-xs text-slate-500 font-bold block">الحد الأعلى</span>
                                <input
                                  type="number"
                                  value={salaryMax}
                                  onChange={(e) => setSalaryMax(e.target.value)}
                                  placeholder="مثال: 8000"
                                  className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                />
                              </div>
                            </div>
                            <div className="relative mt-2 flex items-center">
                              <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input type="checkbox" className="sr-only peer" checked={isSalaryHidden} onChange={(e) => setIsSalaryHidden(e.target.checked)} />
                                <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                                <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء الراتب عن المتقدمين</span>
                              </label>
                            </div>
                            <div className="mt-5 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/80 dark:border-slate-700/80">
                              <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                                  <Settings size={18} className="text-slate-400" />
                                  <span className="text-sm font-bold">سؤال المتقدم عن الراتب المتوقع</span>
                                </div>
                                <div className="relative min-w-[220px]">
                                  <select
                                    value={askExpectedSalary}
                                    onChange={(e) => setAskExpectedSalary(e.target.value as any)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-bold appearance-none cursor-pointer text-slate-700 dark:text-slate-300"
                                  >
                                    <option value="hidden">عدم السؤال</option>
                                    <option value="open">سؤال مفتوح</option>
                                    <option value="ranges">خيارات محددة</option>
                                  </select>
                                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ChevronDown size={16} />
                                  </div>
                                </div>
                              </div>

                              {askExpectedSalary === "ranges" && (
                                <div className="mt-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">نطاقات الراتب (اضغط Enter للإضافة)</label>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <AnimatePresence>
                                      {expectedSalaryRanges.map((range, idx) => (
                                        <motion.span
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.8 }}
                                          key={idx}
                                          className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2"
                                        >
                                          {range}
                                          <button
                                            type="button"
                                            onClick={() => setExpectedSalaryRanges(prev => prev.filter((_, i) => i !== idx))}
                                            className="hover:text-red-500 transition-colors"
                                          >
                                            <X size={14} />
                                          </button>
                                        </motion.span>
                                      ))}
                                    </AnimatePresence>
                                    {expectedSalaryRanges.length === 0 && (
                                      <span className="text-sm text-slate-400 font-medium py-1.5">لم يتم إضافة أي نطاقات بعد...</span>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <input
                                      type="number"
                                      value={salaryRangeMinInput}
                                      onChange={(e) => setSalaryRangeMinInput(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          let rangeStr = "";
                                          const min = salaryRangeMinInput.trim();
                                          const max = salaryRangeMaxInput.trim();
                                          if (min && max) rangeStr = `${min} - ${max}`;
                                          else if (min) rangeStr = `${min}`;
                                          else if (max) rangeStr = `حتى ${max}`;

                                          if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                            setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                            setSalaryRangeMinInput('');
                                            setSalaryRangeMaxInput('');
                                          }
                                        }
                                      }}
                                      placeholder="الحد الأدنى (مثال: 4000)"
                                      className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:border-primary outline-none text-sm transition-all"
                                    />
                                    <input
                                      type="number"
                                      value={salaryRangeMaxInput}
                                      onChange={(e) => setSalaryRangeMaxInput(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          let rangeStr = "";
                                          const min = salaryRangeMinInput.trim();
                                          const max = salaryRangeMaxInput.trim();
                                          if (min && max) rangeStr = `${min} - ${max}`;
                                          else if (min) rangeStr = `${min}`;
                                          else if (max) rangeStr = `حتى ${max}`;

                                          if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                            setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                            setSalaryRangeMinInput('');
                                            setSalaryRangeMaxInput('');
                                          }
                                        }
                                      }}
                                      placeholder="الحد الأعلى (مثال: 6000)"
                                      className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:border-primary outline-none text-sm transition-all"
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        let rangeStr = "";
                                        const min = salaryRangeMinInput.trim();
                                        const max = salaryRangeMaxInput.trim();
                                        if (min && max) rangeStr = `${min} - ${max}`;
                                        else if (min) rangeStr = `${min}`;
                                        else if (max) rangeStr = `حتى ${max}`;

                                        if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                          setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                          setSalaryRangeMinInput('');
                                          setSalaryRangeMaxInput('');
                                        }
                                      }}
                                      className="px-4 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                                    >
                                      إضافة
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {createJobType !== "quick_link" && (
                          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">التالي <ArrowLeft size={18} /></button>
                          </div>
                        )}
                      </>
                    )}

                    {currentStep === 2 && (
                      <>
                        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/60 flex flex-col gap-6">

                          {/* Basic Attachments Section */}
                          <div>
                            <label className="text-sm font-bold text-navy dark:text-white mb-4 block flex items-center gap-2">
                              المرفقات الأساسية المطلوبة
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {" "}
                              {[
                                { id: "سيرة ذاتية PDF", title: "ملف السيرة الذاتية", subtitle: "(يُقبل ملفات PDF و DOCX فقط)" },
                                { id: "رابط معرض أعمال/Portfolio", title: "رابط معرض أعمال/Portfolio" }
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
                        </div>


                        {createJobType !== "quick_link" && (
                          <>
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
                                        <div className="flex flex-wrap gap-2 mb-4">
                                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 self-center ml-2">إضافات سريعة:</span>
                                          <button type="button" onClick={() => { setNewAttachmentName("الصورة الشخصية"); setNewAttachmentType("image"); }} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-600 flex items-center gap-1"><Plus size={14} /> الصورة الشخصية</button>
                                          <button type="button" onClick={() => { setNewAttachmentName("رخصة القيادة"); setNewAttachmentType("mixed_file"); }} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-600 flex items-center gap-1"><Plus size={14} /> رخصة القيادة</button>
                                          <button type="button" onClick={() => { setNewAttachmentName("صورة الهوية"); setNewAttachmentType("mixed_file"); }} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-600 flex items-center gap-1"><Plus size={14} /> صورة الهوية</button>
                                        </div>
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
                                        {!["nationality", "city", "education", "experience"].includes(newKqType) && (
                                          <input
                                            type="text"
                                            value={newKqText}
                                            onChange={(e) => setNewKqText(e.target.value)}
                                            placeholder="نص السؤال (مثال: هل أنت سعودي الجنسية؟)"
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none focus:border-red-400 transition-all font-medium text-sm"
                                          />
                                        )}
                                        <div className={`grid ${["nationality", "city", "education", "experience"].includes(newKqType) ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2"} gap-4`}>
                                          <select
                                            value={newKqType}
                                            onChange={(e) => {
                                              const val = e.target.value as "yes_no" | "options" | "age_condition" | "nationality" | "city" | "education" | "experience";
                                              setNewKqType(val);
                                              if (val === "yes_no") {
                                                setNewKqRequiredAnswer("نعم");
                                              } else if (val === "nationality") {
                                                setNewKqRequiredAnswer("");
                                              } else if (val === "city") {
                                                setNewKqRequiredAnswer("");
                                              } else if (val === "education" || val === "experience") {
                                                setNewKqRequiredAnswer("");
                                              } else if (val === "availability") {
                                                setNewKqRequiredAnswer("");
                                              } else {
                                                setNewKqRequiredAnswer(newKqOptions[0] || "");
                                              }
                                            }}
                                            className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none font-medium text-sm appearance-none"
                                          >
                                            <option value="yes_no" className="bg-white text-navy dark:bg-slate-800 dark:text-white">نعم / لا</option>
                                            <option value="options" className="bg-white text-navy dark:bg-slate-800 dark:text-white">خيارات متعددة</option>
                                            <option value="age_condition" className="bg-white text-navy dark:bg-slate-800 dark:text-white">شرط العمر</option>
                                            <option value="nationality" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الجنسيات المقبولة</option>
                                            <option value="city" className="bg-white text-navy dark:bg-slate-800 dark:text-white">المدن المقبولة</option>
                                            <option value="education" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الحد الأدنى للمؤهل</option>
                                            <option value="experience" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الحد الأدنى لسنوات الخبرة</option>
                                            <option value="availability" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الحد الأقصى لمدة الانضمام</option>
                                          </select>

                                          {newKqType === "age_condition" ? (
                                            <div className="flex items-center gap-4">
                                              <input
                                                type="number"
                                                placeholder="الحد الأدنى (مطلوب)"
                                                value={newKqMinAge}
                                                onChange={(e) => setNewKqMinAge(e.target.value ? Number(e.target.value) : "")}
                                                className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm"
                                              />
                                              <input
                                                type="number"
                                                placeholder="الحد الأعلى (اختياري)"
                                                value={newKqMaxAge}
                                                onChange={(e) => setNewKqMaxAge(e.target.value ? Number(e.target.value) : "")}
                                                className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm"
                                              />
                                            </div>
                                          ) : newKqType === "nationality" ? (
                                            <div className="md:col-span-2">
                                              <MultiSearchableSelect
                                                options={countriesList}
                                                value={newKqRequiredAnswer}
                                                onChange={(val) => setNewKqRequiredAnswer(val as string)}
                                                multiple={true}
                                                placeholder="اختر الجنسيات المقبولة..."
                                              />
                                            </div>
                                          ) : newKqType === "city" ? (
                                            <div className="md:col-span-2">
                                              <MultiSearchableSelect
                                                options={SAUDI_CITIES}
                                                value={newKqRequiredAnswer}
                                                onChange={(val) => setNewKqRequiredAnswer(val as string)}
                                                multiple={true}
                                                placeholder="اختر المدن المقبولة..."
                                              />
                                            </div>
                                          ) : newKqType === "education" ? (
                                            <select
                                              value={newKqRequiredAnswer}
                                              onChange={(e) => setNewKqRequiredAnswer(e.target.value)}
                                              className="md:col-span-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none"
                                            >
                                              <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر الحد الأدنى للمؤهل...</option>
                                              <option value="ثانوي" className="bg-white text-navy dark:bg-slate-800 dark:text-white">ثانوي</option>
                                              <option value="دبلوم" className="bg-white text-navy dark:bg-slate-800 dark:text-white">دبلوم</option>
                                              <option value="بكالوريوس" className="bg-white text-navy dark:bg-slate-800 dark:text-white">بكالوريوس</option>
                                              <option value="ماجستير" className="bg-white text-navy dark:bg-slate-800 dark:text-white">ماجستير</option>
                                              <option value="دكتوراه" className="bg-white text-navy dark:bg-slate-800 dark:text-white">دكتوراه</option>
                                            </select>
                                          ) : newKqType === "experience" ? (
                                            <select
                                              value={newKqRequiredAnswer}
                                              onChange={(e) => setNewKqRequiredAnswer(e.target.value)}
                                              className="md:col-span-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none"
                                            >
                                              <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر الحد الأدنى للخبرة...</option>
                                              <option value="0" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الحد الأدنى: أقل من سنة</option>
                                              <option value="1" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الحد الأدنى: سنة</option>
                                              <option value="2" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الحد الأدنى: سنتين</option>
                                              <option value="3" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الحد الأدنى: 3 سنوات</option>
                                              <option value="4" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الحد الأدنى: 4 سنوات</option>
                                              <option value="5" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الحد الأدنى: 5 سنوات</option>
                                              <option value="10" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الحد الأدنى: 10 سنوات</option>
                                            </select>
                                          ) : newKqType === "availability" ? (
                                            <select
                                              value={newKqRequiredAnswer}
                                              onChange={(e) => setNewKqRequiredAnswer(e.target.value)}
                                              className="md:col-span-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none"
                                            >
                                              <option value="" disabled hidden className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر أقصى مدة مقبولة...</option>
                                              <option value="فوري" className="bg-white text-navy dark:bg-slate-800 dark:text-white">فوري (مقبول المتاح فوراً فقط)</option>
                                              <option value="أسبوع" className="bg-white text-navy dark:bg-slate-800 dark:text-white">أسبوع (مقبول المتاح فوراً أو خلال أسبوع)</option>
                                              <option value="أسبوعين" className="bg-white text-navy dark:bg-slate-800 dark:text-white">أسبوعين (كحد أقصى)</option>
                                              <option value="شهر" className="bg-white text-navy dark:bg-slate-800 dark:text-white">شهر (كحد أقصى)</option>
                                              <option value="أكثر من شهر" className="bg-white text-navy dark:bg-slate-800 dark:text-white">أكثر من شهر (قبول الجميع)</option>
                                            </select>
                                          ) : newKqType === "yes_no" ? (
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
                                                      if (!newKqRequiredAnswer) setNewKqRequiredAnswer(up[0] || "");
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
                                                    if (!newKqRequiredAnswer) setNewKqRequiredAnswer(up[0] || "");
                                                    setNewKqOptionInput("");
                                                  }
                                                }}
                                                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white px-4 rounded-xl font-bold transition-all"
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
                                              window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى إضافة خيارين على الأقل!", type: "warning" } }));
                                              return;
                                            }
                                            setKnockoutQuestions([...knockoutQuestions, {
                                              text: newKqText.trim(),
                                              type: newKqType,
                                              options: newKqType === "options" ? newKqOptions : undefined,
                                              requiredAnswer: newKqType === "age_condition" ? "" : newKqRequiredAnswer,
                                              minAge: newKqType === "age_condition" ? Number(newKqMinAge) : undefined,
                                              maxAge: newKqType === "age_condition" && newKqMaxAge !== "" ? Number(newKqMaxAge) : undefined
                                            }]);
                                            setNewKqText("");
                                            setNewKqOptions([]);
                                            setNewKqOptionInput("");
                                            setNewKqMinAge("");
                                            setNewKqMaxAge("");
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
                                                <p className="text-xs text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded inline-block">{q.type === "age_condition" ? `العمر المطلوب: من ${q.minAge}${q.maxAge ? ` إلى ${q.maxAge}` : " فأكثر"}` : `الإجابة المطلوبة للقبول: ${q.requiredAnswer}`}</p>
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
                          </>
                        )}
                      </>
                    )}

                    {currentStep === 3 && (
                      <>
                        {createJobType !== "quick_link" && (
                          <>
                            <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-[32px] border-2 border-indigo-100 dark:border-indigo-800/30 shadow-inner mt-8 mb-8">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                  <Zap size={20} />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 group relative cursor-help w-max">
                                    توجيهات إضافية لمحرك الفرز
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#1d4ed8] dark:bg-indigo-400 text-white flex items-center justify-center text-[12px] font-bold leading-none shrink-0 shadow-sm" style={{ fontFamily: 'monospace' }}>
                                      i
                                    </div>
                                    <div className="absolute bottom-full mb-3 w-80 bg-slate-900 text-white text-xs leading-relaxed font-medium p-4 rounded-xl shadow-2xl shadow-indigo-900/20 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 left-1/2 -translate-x-1/2 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-900">
                                      نظام الفرز يقوم بتحليل السير الذاتية ومطابقتها تلقائياً. استخدم هذا الحقل للتركيز على مهارة نادرة أو شروط خاصة جداً خارج الوصف المعتاد.
                                    </div>
                                  </h3>
                                </div>
                              </div>
                              <textarea
                                required={false}
                                rows={3}
                                value={aiInstructions}
                                onChange={(e) => setAiInstructions(e.target.value)}
                                placeholder="(اكتب توجيهاتك الدقيقة لمحرك الفرز هنا...)"
                                className="w-full px-6 py-5 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100/50 dark:border-indigo-800/30 text-navy dark:text-white dark:placeholder-slate-500 rounded-2xl outline-none font-medium resize-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 transition-all placeholder:text-[13px] leading-relaxed relative z-10"
                              />
                              <div className="mt-3 flex flex-wrap gap-2 relative z-10">
                                {[
                                  { label: "+ إعطاء أولوية للخبرة المحلية", text: "ركز بشكل أكبر على الخبرة العملية داخل السوق المحلي." },
                                  { label: "+ التركيز على الاستقرار الوظيفي", text: "أعطِ أولوية للمتقدمين الذين أظهروا استقراراً في وظائفهم السابقة وتجنب التنقل السريع." },
                                  { label: "+ تفضيل الشهادات المهنية", text: "أعطِ وزناً أعلى للشهادات المهنية المعتمدة مقارنة بالشهادات الأكاديمية البحتة." },
                                ].map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setAiInstructions(prev => {
                                        const textToAdd = suggestion.text;
                                        return prev ? `${prev}\n${textToAdd}` : textToAdd;
                                      });
                                    }}
                                    className="text-[11px] px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-800/50"
                                  >
                                    {suggestion.label}
                                  </button>
                                ))}
                              </div>
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
                                {getVoiceInterviewFeatureEnabled() && (<>
                                  <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 pb-6">
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
                                </>)}
                              </div>
                            </details>
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
                      </>
                    )}
                  </div>
                )}




              </div>

              {createJobType !== "quick_link" && currentStep === 2 && (
                <div className="mt-8 flex justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mb-8">
                  <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">السابق <ArrowLeft size={18} className="rotate-180" /></button>
                  <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"><ArrowLeft size={18} /> التالي</button>
                </div>
              )}

              <div className={currentStep === 3 ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
                {/* Card: Schedule */}
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

              {createJobType !== "quick_link" && currentStep === 3 && (
                <div className="mt-8 flex justify-start gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mb-8">
                  <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">السابق <ArrowLeft size={18} className="rotate-180" /></button>
                </div>
              )}
              <div className="flex flex-col md:flex-row items-center justify-end gap-3 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); handleBackAttempt(); }}
                  className="w-full md:w-auto bg-slate-100 dark:bg-slate-800/80 border-2 border-transparent dark:border-slate-600 text-slate-600 dark:text-slate-300 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  إلغاء والعودة
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLivePreview(true);
                  }}
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
                          type="submit"
                          className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          حفظ التعديلات
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSaveAsDraft();
                          }}
                          className="w-full md:w-auto bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all items-center"
                        >
                          حفظ المسودة
                        </button>
                        <button
                          type="submit"
                          className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          إنشاء الإعلان الوظيفي
                        </button>
                      </>
                    )}
                  </>
                )}

                {adType !== "single" && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSaveAsDraft();
                      }}
                      className="w-full md:w-auto bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all items-center"
                    >
                      حفظ المسودة
                    </button>
                    <button
                      type="submit"
                      className="w-full md:w-auto px-10 bg-primary text-white py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      إنشاء الإعلان الوظيفي
                    </button>
                  </>
                )}
              </div>
            </form>{" "}
          </motion.div>{" "}
        </div>{" "}
      </div>{" "}
      {isLivePreview && (
        <PreviewModal
          job={{
            id: "preview",
            recordType: adType === "single" && createJobType === "quick_link" ? "quick_link" : adType,
            campaignTitle: enableWelcomeUI ? campaignTitle : undefined,
            campaignDescription: enableWelcomeUI ? campaignDescription : undefined,
            roleSummary: (roleSummary || "").trim(),
            responsibilities: (responsibilities || "").trim(),
            qualifications: (qualifications || "").trim(),
            benefits: (benefits || "").trim(),
            description: (!enableWelcomeUI && adType === "single" && createJobType !== "quick_link") ? (roleDesc || "").trim() : (adType === "campaign" ? (enableWelcomeUI ? campaignDescription : "") : ""),
            startDate,
            endDate: isOpenEnded ? undefined : endDate,
            company: company,
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
            askExpectedSalary: createJobType === "quick_link" ? "hidden" : askExpectedSalary,
            expectedSalaryRanges: createJobType === "quick_link" ? [] : expectedSalaryRanges,
            knockoutQuestions: createJobType === "quick_link" ? [] : knockoutQuestions,
            type: createJobType === "quick_link" ? "دوام كامل" : type,
            aiInstructions: createJobType === "quick_link" ? "" : (aiInstructions || "").trim(),
            title: (adType === "campaign" ? (enableWelcomeUI ? campaignTitle : "") : roleTitle) || roleTitle || "",
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
            applicants: 0,
            status: "نشط",
            createdAt: new Date().toISOString().split("T")[0],
            roles: adType === "single" || createJobType === "quick_link" ? [
              {
                id: "r1",
                title: (roleTitle || "").trim() || "",
                description: "",
                roleSummary: (roleSummary || "").trim(),
                responsibilities: (responsibilities || "").trim(),
                qualifications: (qualifications || "").trim(),
                benefits: (benefits || "").trim(),
                aiInstructions: createJobType === "quick_link" ? "" : (aiInstructions || "").trim(),
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
              }
            ] : roles,
          }}
          onClose={() => setIsLivePreview(false)}
        />
      )}{" "}
      <ImageLightbox url={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
    </div>
  );
};

const OnboardingModal = ({ isOpen, onClose, userProfile, setUserProfile, onPublishDraft }: { isOpen: boolean; onClose: () => void; userProfile: any; setUserProfile: any; onPublishDraft?: () => void; }) => {
  const [entityType, setEntityType] = useState<"company" | "freelance">(userProfile.entityType || "company");
  const [companyName, setCompanyName] = useState(userProfile.companyName || "");
  const [crNumber, setCrNumber] = useState(userProfile.commercialRegistration || "");
  const [freelanceDoc, setFreelanceDoc] = useState(userProfile.freelanceDocument || "");
  const [city, setCity] = useState(userProfile.city || "");

  const handleSmartPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, setter: (val: string) => void) => {
    const paste = e.clipboardData.getData("text");
    e.preventDefault();
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const formattedPaste = paste
      .split('\n')
      .map(line => {
        let trimmed = line.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return '• ' + trimmed.substring(2);
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) return '• ' + trimmed.substring(1).trim();
        if (!trimmed.startsWith('•')) return '• ' + trimmed;
        return trimmed;
      })
      .filter(Boolean)
      .join('\n');

    const currentValue = textarea.value;
    const newValue = currentValue.substring(0, start) + formattedPaste + currentValue.substring(end);
    setter(newValue);

    setTimeout(() => {
      textarea.setSelectionRange(start + formattedPaste.length, start + formattedPaste.length);
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative border border-white dark:border-slate-700">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
          <X size={24} />
        </button>
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner-3d">
          <ShieldCheck size={40} />
        </div>
        <h3 className="text-2xl font-bold text-center text-navy dark:text-white mb-3">خطوة أخيرة لنشر إعلانك!</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm leading-relaxed">
          يرجى استكمال بيانات الكيان الخاص بك لنتمكن من عرضها للمتقدمين ونشر تفاصيل الشواغر الخاصة بك.
        </p>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (entityType === "company" && (!companyName || !crNumber)) return;
          if (entityType === "freelance" && (!companyName || !freelanceDoc)) return;

          setUserProfile({
            ...userProfile,
            entityType,
            companyName,
            city,
            commercialRegistration: entityType === "company" ? crNumber : "",
            freelanceDocument: entityType === "freelance" ? freelanceDoc : ""
          });
          localStorage.setItem("onboarding_complete", "true");
          if (onPublishDraft) {
            onPublishDraft();
          }
          onClose();
        }} className="space-y-4">

          <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 gap-1.5 rounded-2xl w-full mb-4">
            <button type="button" onClick={() => setEntityType("company")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${entityType === "company" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>جهة اعتبارية</button>
            <button type="button" onClick={() => setEntityType("freelance")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${entityType === "freelance" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>عمل حر (مستقل)</button>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">{entityType === "company" ? "اسم المنشأة المعتمد" : "الاسم الثلاثي المعتمد"}</label>
            <input required type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder={entityType === "company" ? "مؤسسة التقنية البسيطة..." : "مثال: عبدالله محمد..."} className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-primary font-medium dark:text-white" />
          </div>

          {entityType === "company" ? (
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">رقم السجل التجاري (CR)</label>
              <input required type="text" value={crNumber} onChange={e => setCrNumber(e.target.value)} placeholder="1010XXXXXX" className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-primary font-medium dark:text-white text-left" dir="ltr" />
            </div>
          ) : (
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">رقم وثيقة العمل الحر</label>
              <input required type="text" value={freelanceDoc} onChange={e => setFreelanceDoc(e.target.value)} placeholder="FL-XXXXXX" className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-primary font-medium dark:text-white text-left" dir="ltr" />
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">المدينة (اختياري)</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="الرياض، جدة..." className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-primary font-medium dark:text-white" />
          </div>

          <button type="submit" className="w-full py-5 mt-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <CheckCircle size={20} />
            حفظ ومتابعة
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const JobSuccess = ({
  job,
  onDone,
  onPreview,
}: {
  job: Job;
  onDone: () => void;
  onPreview: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const link = `${window.location.origin}/apply/${job.id}`;
  const copyToClipboard = () => {
    // const verified = localStorage.getItem("company_verified") === "true";
    /* if (!verified) {
      setShowVerificationModal(true);
      return;
    } */
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        {" "}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl p-10 md:p-16 max-w-2xl w-full text-center border border-white dark:border-slate-700"
        >
          {" "}
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner-3d">
            {" "}
            <CheckCircle size={48} />{" "}
          </div>{" "}
          <h2 className="text-4xl font-bold text-navy dark:text-white mb-4">
            تم إنشاء الشاغر بنجاح!
          </h2>{" "}
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium mb-12">
            تم تفعيل الوظيفة وإنشاء رابط التقديم الخاص بها. يمكنك الآن مشاركته مع
            المتقدمين.
          </p>{" "}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 mb-10">
            {" "}
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase mb-3 text-right">
              رابط التقديم المباشر
            </p>{" "}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              {" "}
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${copied ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-teal-600"}`}
              >
                {" "}
                {copied ? "تم النسخ!" : "نسخ الرابط"} <Copy size={18} />{" "}
              </button>{" "}
              <input
                readOnly
                value={link}
                className="flex-1 bg-transparent dark:bg-transparent dark:text-white outline-none text-slate-500 dark:text-slate-400 dark:text-slate-500 font-mono text-sm text-left"
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {" "}
            <button
              onClick={onPreview}
              className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white py-4 rounded-2xl font-bold hover:bg-slate-50 dark:bg-slate-800/50 transition-all"
            >
              {" "}
              <ExternalLink size={20} /> معاينة صفحة التقديم{" "}
            </button>{" "}
            <button
              onClick={onDone}
              className="bg-navy text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              {" "}
              العودة للوحة التحكم{""}
            </button>{" "}
          </div>{" "}
        </motion.div>{" "}
      </div>
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerify={() => {
          setShowVerificationModal(false);
          copyToClipboard();
        }}
      />
    </>
  );
};
export const PublicJobPage = ({
  job,
  selectedRoleId,
  onSelectRole,
  onApply,
  onBackToCampaign
}: {
  job: Job;
  selectedRoleId?: string | null;
  onSelectRole?: (roleId: string) => void;
  onApply: () => void;
  onBackToCampaign?: () => void;
}) => {
  if (job.status === "مسودة") {
    return (
      <div className="min-h-screen bg-bg dark:bg-navy flex items-center justify-center p-6">
        <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-xl max-w-lg w-full border border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">الإعلان غير متاح</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">عذراً، هذا الإعلان غير متاح حالياً أو معلق كمسودة، يُرجى مراجعة الشركة الناشرة للإعلان.</p>
        </div>
      </div>
    );
  }

  const isCampaign = job.recordType === "campaign";
  const isJobBoard = isCampaign && !selectedRoleId;

  const activeRole = isCampaign && selectedRoleId
    ? job.roles?.find((r) => r.id === selectedRoleId)
    : (job.roles && job.roles.length > 0 ? job.roles[0] : null);

  const displayTitle = isJobBoard ? (job.campaignTitle || job.title) : (activeRole?.title || job.title);
  const displayCompany = job.company;

  return (
    <div className="min-h-screen bg-bg dark:bg-navy pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl overflow-hidden border border-white dark:border-slate-700"
        >
          <div className="p-10 md:p-16 bg-navy text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              {isCampaign && selectedRoleId && onBackToCampaign && (
                <button
                  onClick={onBackToCampaign}
                  className="mb-8 flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm w-fit"
                >
                  <ArrowRight size={16} /> العودة لقائمة الوظائف
                </button>
              )}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 p-0 bg-white dark:bg-slate-800/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white dark:border-slate-700/10 overflow-hidden shrink-0 shadow-sm">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={`شعار ${job.company}`}
                      className="w-full h-full object-cover rounded-[inherit] drop-shadow-sm"
                    />
                  ) : (
                    <Briefcase size={16} className="text-primary opacity-80" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-slate-300 font-bold text-sm drop-shadow-sm">
                      {displayCompany}
                    </p>
                    {job.entityType && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                        <ShieldCheck size={12} className={job.entityType === "company" ? "text-emerald-400" : "text-blue-400"} />
                        {job.entityType === "company" ? "مؤسسة معتمدة" : "مستقل معتمد"}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2 leading-tight opacity-90 drop-shadow-sm">
                    {displayTitle}
                  </h1>
                </div>
              </div>

              {isJobBoard && (job.campaignDescription || job.description) && (
                <div className="mt-4 mb-6">
                  <p className="text-slate-300 text-lg font-medium leading-relaxed whitespace-pre-wrap text-center max-w-4xl mx-auto">
                    {job.campaignDescription || job.description}
                  </p>
                </div>
              )}
              {!isJobBoard && (
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  {(activeRole?.type || job.type) && (
                    <div className="inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm">
                      <Clock size={16} className="text-white/80 shrink-0" /> {activeRole?.type || job.type}
                    </div>
                  )}
                  {((activeRole?.locations?.length ? activeRole.locations : job.locations?.length ? job.locations : (activeRole?.location || job.location) ? [activeRole?.location || job.location] : []) as string[]).filter(loc => loc !== "لا يشترط / كافة المدن").map((loc, idx) => (
                    <div key={idx} className="inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm">
                      <MapPin size={16} className="text-white/80 shrink-0" /> {loc}
                    </div>
                  ))}
                  {(activeRole?.experience || job.experience) && (
                    <div className="inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm">
                      <Briefcase size={16} className="text-white/80 shrink-0" /> {activeRole?.experience || job.experience}
                    </div>
                  )}
                  {(activeRole?.qualification || job.qualification) && (activeRole?.qualification !== "لا يشترط مؤهل" && job.qualification !== "لا يشترط مؤهل") && (
                    <div className="inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm">
                      <FileText size={16} className="text-white/80 shrink-0" /> {activeRole?.qualification || job.qualification}
                    </div>
                  )}
                  {!(activeRole?.isSalaryHidden ?? job.isSalaryHidden) && (activeRole?.salaryMin || job.salaryMin) && (
                    <div className="inline-flex items-center justify-center gap-2 bg-emerald-500/20 px-5 py-2.5 rounded-xl border border-emerald-400/40 text-sm font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-sm">
                      <CreditCard size={16} className="shrink-0 text-emerald-400" />
                      {activeRole?.salaryMin || job.salaryMin} {(activeRole?.salaryMax || job.salaryMax) ? `- ${activeRole?.salaryMax || job.salaryMax}` : ''} ريال
                    </div>
                  )}
                  {job.createdAt && (
                    <div className="inline-flex items-center justify-center gap-2 bg-white/5 px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold shadow-sm backdrop-blur-sm">
                      <Calendar size={16} className="text-white/60 shrink-0" /> نُشر في {job.createdAt}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-10 md:p-16 space-y-12">
            {isJobBoard ? (
              <div>
                <h3 className="text-2xl font-bold text-navy dark:text-white mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full" /> الفرص الوظيفية المتاحة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {job.roles?.map(role => (
                    <button
                      key={role.id}
                      onClick={() => onSelectRole?.(role.id)}
                      className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/30 transition-all text-right flex flex-col items-start gap-4"
                    >
                      <div className="w-full flex justify-between items-start gap-4">
                        <h4 className="text-xl font-bold text-navy dark:text-white group-hover:text-primary transition-colors">
                          {role.title}
                        </h4>
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <ArrowRight size={18} className="-rotate-135" />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {((role.locations?.length ? role.locations : role.location ? [role.location] : []) as string[]).map((loc, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300">
                            <MapPin size={14} /> {loc}
                          </span>
                        ))}
                        {role.type && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-xs font-bold text-blue-600 dark:text-blue-400">
                            <Clock size={14} /> {role.type}
                          </span>
                        )}
                        {!role.isSalaryHidden && role.salaryMin && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CreditCard size={14} /> {role.salaryMin} {role.salaryMax ? `- ${role.salaryMax}` : ''} ريال
                          </span>
                        )}
                      </div>
                      <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
                        <span className="font-bold text-primary">التقديم على هذه الوظيفة</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-10">
                <div className="space-y-10">
                  {job.recordType !== "campaign" && job.campaignDescription && (
                    <div className="bg-primary/5 border border-primary/20 rounded-[28px] p-8 -mt-4 mb-8 text-center shadow-sm">
                      <p className="text-navy dark:text-white font-medium text-lg leading-relaxed"><Sparkles className="inline-block mr-2 -mt-1 text-primary" size={24} /> {job.campaignDescription}</p>
                    </div>
                  )}

                  {(!activeRole?.hideRoleSummary && !job.hideRoleSummary) && (activeRole?.roleSummary || job.roleSummary || activeRole?.description || job.description) ? (
                    <div>
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> نبذة عن الدور
                      </h3>
                      <div className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap text-base">
                        {activeRole?.roleSummary || job.roleSummary || activeRole?.description || job.description}
                      </div>
                    </div>
                  ) : null}

                  {(!activeRole?.hideResponsibilities && !job.hideResponsibilities) && (activeRole?.responsibilities || job.responsibilities) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المهام والمسؤوليات
                      </h3>
                      <ul className="space-y-4 list-none">
                        {(activeRole?.responsibilities || job.responsibilities || '').split('\n').filter(r => r.trim()).map((res, i) => (
                          <li key={i} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-base">
                            <div className="mt-1 shrink-0 bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                              <CheckCircle size={16} strokeWidth={2.5} />
                            </div>
                            <span className="leading-relaxed pt-0.5">{res.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(!activeRole?.hideQualifications && !job.hideQualifications) && (activeRole?.qualifications || job.qualifications) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المؤهلات والمتطلبات
                      </h3>
                      <ul className="space-y-4 list-disc list-inside px-2">
                        {(activeRole?.qualifications || job.qualifications || '').split('\n').filter(q => q.trim()).map((qual, i) => (
                          <li key={i} className="text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">
                            {qual.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(!activeRole?.hideTargetMajors && !job.hideTargetMajors) && ((activeRole?.targetMajors?.length ?? 0) > 0 || (job.targetMajors?.length ?? 0) > 0) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> التخصصات المستهدفة
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(activeRole?.targetMajors || job.targetMajors || []).map((major, i) => (
                          <span key={i} className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-100/50 dark:border-blue-800/20 shadow-sm transition-all hover:-translate-y-0.5">
                            {major}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!activeRole?.hideSkillsAndLanguages && !job.hideSkillsAndLanguages) && (activeRole?.skills?.length || job.skills?.length) ? (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المهارات المستهدفة
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(activeRole?.skills || job.skills || []).map((skill: string) => (
                          <span key={skill} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-600 shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {(!activeRole?.hideSkillsAndLanguages && !job.hideSkillsAndLanguages) && (activeRole?.languages?.length || job.languages?.length) ? (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> اللغات المطلوبة
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(activeRole?.languages || job.languages || []).map((lang: string) => (
                          <span key={lang} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl text-sm font-bold border border-blue-200 dark:border-blue-800 shadow-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {(!activeRole?.hideBenefits && !job.hideBenefits) && (activeRole?.benefits || job.benefits) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المميزات
                      </h3>
                      <ul className="space-y-4 list-none">
                        {(activeRole?.benefits || job.benefits || '').split('\n').filter(b => b.trim()).map((ben, i) => (
                          <li key={i} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-base">
                            <div className="mt-1 shrink-0 bg-primary/10 p-1.5 rounded-full text-primary">
                              <Sparkles size={16} strokeWidth={2.5} />
                            </div>
                            <span className="leading-relaxed pt-0.5">{ben.replace(/\(اختياري\)/g, '').trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-12 pb-4">
                    <button onClick={onApply} className="w-full max-w-md mx-auto flex bg-primary text-white py-5 rounded-2xl text-xl font-bold hover:bg-teal-600 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] items-center justify-center gap-3">
                      التقديم على هذه الوظيفة
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
const ManageJob = ({
  job,
  onBack,
  onUpdate,
  onDelete,
}: {
  job: Job;
  onBack: () => void;
  onUpdate: (job: Job) => void;
  onDelete: (id: string) => void;
}) => {

  const [activeTab, setActiveTab] = useState<"details" | "filters" | "settings">("details");
  const [targetMajors, setTargetMajors] = useState<string[]>(job.targetMajors || []);
  const [newMajorInput, setNewMajorInput] = useState("");
  const [knockoutQuestions, setKnockoutQuestions] = useState<any[]>(job.knockoutQuestions || []);
  const [newKqText, setNewKqText] = useState("");
  const [newKqType, setNewKqType] = useState<"yes_no" | "options" | "age_condition">("yes_no");
  const [newKqMinAge, setNewKqMinAge] = useState<number | "">("");
  const [newKqMaxAge, setNewKqMaxAge] = useState<number | "">("");
  const [newKqOptions, setNewKqOptions] = useState<string[]>(["نعم", "لا"]);

  const [useAiOverride, setUseAiOverride] = useState(!!job.aiOverrideFields || false);
  const [aiRoleSummary, setAiRoleSummary] = useState(job.aiOverrideFields?.roleSummary || "");
  const [aiResponsibilities, setAiResponsibilities] = useState(job.aiOverrideFields?.responsibilities || "");
  const [aiQualifications, setAiQualifications] = useState(job.aiOverrideFields?.qualifications || "");
  const [aiTargetMajors, setAiTargetMajors] = useState<string[]>(job.aiOverrideFields?.targetMajors || []);
  const [aiTargetSkills, setAiTargetSkills] = useState<string[]>(job.aiOverrideFields?.targetSkills || []);
  const [aiLanguages, setAiLanguages] = useState<string[]>(job.aiOverrideFields?.languages || []);


  const [title, setTitle] = useState(job.title || job.campaignTitle || "");
  const [company, setCompany] = useState(job.company || "");
  const [location, setLocation] = useState(job.location || "");
  const [experience, setExperience] = useState(job.experience || "لا يشترط خبرة");
  const [qualification, setQualification] = useState(job.qualification || "ثانوي");
  const [salaryMin, setSalaryMin] = useState(job.salaryMin || "");
  const [salaryMax, setSalaryMax] = useState(job.salaryMax || "");
  const [isSalaryHidden, setIsSalaryHidden] = useState(job.isSalaryHidden || false);
  const [askExpectedSalary, setAskExpectedSalary] = useState<"hidden" | "open" | "ranges">(job.askExpectedSalary || "hidden");
  const [expectedSalaryRanges, setExpectedSalaryRanges] = useState<string[]>(job.expectedSalaryRanges || []);
  const [salaryRangeMinInput, setSalaryRangeMinInput] = useState("");
  const [salaryRangeMaxInput, setSalaryRangeMaxInput] = useState("");
  const [type, setType] = useState(job.type || "دوام كامل");
  const [description, setDescription] = useState(job.description || job.campaignDescription || "");
  const [status, setStatus] = useState(job.status || "نشط");
  const isLocked = status === "نشط" && job.applicants > 0;
  const defaultStart = new Date().toISOString().slice(0, 16);
  const defaultEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  const [startDate, setStartDate] = useState(job.startDate || defaultStart);
  const [endDate, setEndDate] = useState(job.endDate || defaultEnd);
  const [isOpenEnded, setIsOpenEnded] = useState(!job.endDate);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    Array.isArray(job.skills) ? job.skills : (typeof job.skills === 'string' ? [job.skills] : [])
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    Array.isArray(job.languages) ? job.languages : (typeof job.languages === 'string' ? [job.languages] : [])
  );
  const [customSkill, setCustomSkill] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const getSuggestions = () => {
    const normalizedTitle = title ? title.trim() : "";
    if (!normalizedTitle) return [];

    const matchedSkills = new Set<string>();

    // Fuzzy matching against the skills dictionary
    for (const [key, skills] of Object.entries(skillsDictionary)) {
      if (
        normalizedTitle.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(normalizedTitle.toLowerCase())
      ) {
        if (Array.isArray(skills)) skills.forEach(s => matchedSkills.add(s));
      }
    }

    // Fuzzy matching against user's previously saved custom skills
    const userSaved = getUserSavedSkills();
    for (const [key, skills] of Object.entries(userSaved)) {
      if (
        normalizedTitle.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(normalizedTitle.toLowerCase())
      ) {
        if (Array.isArray(skills)) {
          skills.forEach(s => matchedSkills.add(s));
        } else if (typeof skills === 'string') {
          matchedSkills.add(skills);
        }
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
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOpenEnded && endDate && new Date(endDate) <= new Date(startDate)) {
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.", type: "error" } }));
      return;
    }
    const updatedJob = {
      ...job,
      title,
      company,
      location,
      experience,
      qualification,
      salaryMin,
      salaryMax,
      isSalaryHidden,

      askExpectedSalary,
      type,
      description,
      status,
      skills: selectedSkills,
      targetMajors,
      knockoutQuestions,
      languages: selectedLanguages,
      startDate,
      endDate: isOpenEnded ? undefined : endDate,
      aiOverrideFields: useAiOverride ? {
        roleSummary: aiRoleSummary,
        responsibilities: aiResponsibilities,
        qualifications: aiQualifications,
        targetMajors: aiTargetMajors,
        targetSkills: aiTargetSkills,
        languages: aiLanguages
      } : undefined,
    };
    try {
      await fetch(
        "https://circular-struggle-ethical-membership.trycloudflare.com/webhook-test/2489027f-d077-4af4-9d3d-fc0dd9f38953",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "UpdateJob", ...updatedJob }),
        },
      );
    } catch (error) {
      console.error("Webhook error:", error);
    }
    saveUserSkills(title, selectedSkills);
    onUpdate(updatedJob);
  };
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8 pt-24 lg:pt-10">
      {" "}
      <div className="max-w-4xl mx-auto relative z-[100]">
        {" "}
        <div className="flex items-center justify-between mb-10 relative z-[100]">
          {" "}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onBack(); }}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary font-bold transition-colors group"
          >
            {" "}
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 flex items-center justify-center group-hover:border-primary transition-all">
              {" "}
              <ArrowLeft size={18} className="rotate-180" />{" "}
            </div>{" "}
            العودة للوحة التحكم{" "}
          </button>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {" "}
          <div className="lg:col-span-2 space-y-8">
            {" "}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-white dark:border-slate-700 shadow-xl shadow-slate-200/50"
            >
              {" "}
              <h2 className="text-3xl font-bold text-navy dark:text-white mb-8">
                إدارة الوظيفة: {job.title}
              </h2>{" "}
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl mb-8">
                  <button type="button" onClick={() => setActiveTab("details")} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === "details" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:bg-white/50"}`}>التفاصيل</button>
                  <button type="button" onClick={() => setActiveTab("filters")} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === "filters" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:bg-white/50"}`}>متطلبات الفرز {isLocked && <span title="مقفل" className="ml-1 inline-flex text-orange-500"><Lock size={14} /></span>}</button>
                  <button type="button" onClick={() => setActiveTab("settings")} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === "settings" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:bg-white/50"}`}>الإعدادات</button>
                </div>

                <div className={activeTab !== "details" ? "hidden" : "space-y-6"}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">المسمى الوظيفي <span className="text-red-500">*</span></label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">الشركة / الفرع <span className="text-red-500">*</span></label>
                      <input type="text" value={company} onChange={(e) => { setCompany(e.target.value); localStorage.setItem("last_used_company", e.target.value); }} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">نوع العمل <span className="text-red-500">*</span></label>
                      <select required value={type} onChange={(e) => {
                        const val = e.target.value;
                        setType(val);
                        if (val === "عن بعد") setLocation("لا يشترط / كافة المدن");
                      }} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer">
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دوام كامل</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دوام جزئي</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">عن بعد</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">تدريب</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">مقر العمل / المدينة <span className="text-red-500">*</span></label>
                      <SearchableSelect options={SAUDI_CITIES} value={location} onChange={setLocation} placeholder="اختر مقر العمل" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">نبذة عن الدور <span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span> <span className="relative group inline-flex items-center ml-1">
                        <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                        <div className="absolute right-0 bottom-full mb-2 w-64 p-2.5 bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-normal leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                          ترك هذا الحقل فارغاً سيجعل محرك الفرز يعتمد على المعايير القياسية للمسمى الوظيفي
                          <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                        </div>
                      </span></label>
                    </div>
                    <textarea onPaste={(e) => formatPastedText(e, description, setDescription)} rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="(مثال: برمجة التطبيقات، إدارة مشاريع معينة، متابعة الملفات...)" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none min-h-[100px]" />
                  </div>
                </div>

                <div className={activeTab !== "filters" ? "hidden" : "space-y-6"}>
                  {isLocked && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-2xl border border-orange-200 dark:border-orange-900/50">
                      <Lock size={20} className="shrink-0" />
                      <p className="text-sm font-bold leading-relaxed">(تم قفل التعديل لوجود متقدمين، وذلك للحفاظ على دقة التقييم الآلي)</p>
                    </div>
                  )}
                  <div className={"grid grid-cols-1 md:grid-cols-2 gap-6 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">سنوات الخبرة المطلوبة <span className="text-red-500">*</span></label>
                      <select disabled={isLocked} value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer">
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">لا يشترط خبرة</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">1-3 سنوات</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">3-5 سنوات</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">5+ سنوات</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">الحد الأدنى للمؤهل <span className="text-red-500">*</span></label>
                      <select disabled={isLocked} value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer">
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">لا يشترط مؤهل</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">لا يشترط مؤهل</option>
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ثانوي</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دبلوم</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">بكالوريوس</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ماجستير</option>
                      </select>
                    </div>
                  </div>
                  <div className={"space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-navy dark:text-white block">التخصصات المستهدفة <span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span></label>
                    </div>
                    <div className="relative">
                      <input type="text" disabled={isLocked} value={newMajorInput} onChange={(e) => setNewMajorInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newMajorInput.trim() && !targetMajors.includes(newMajorInput.trim())) { setTargetMajors([...targetMajors, newMajorInput.trim()]); setNewMajorInput(""); } } }} placeholder="أضف تخصصاً (اترك الحقل فارغاً للقبول العام)..." className="w-full pr-4 pl-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:border-primary transition-all font-medium" />
                      <button type="button" disabled={isLocked} onClick={() => { if (newMajorInput.trim() && !targetMajors.includes(newMajorInput.trim())) { setTargetMajors([...targetMajors, newMajorInput.trim()]); setNewMajorInput(""); } }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all"><Plus size={18} /></button>
                    </div>
                    {targetMajors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {targetMajors.map((major) => (
                          <span key={major} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold border border-blue-200 dark:border-blue-800/50 shadow-sm">{major}
                            <button type="button" disabled={isLocked} onClick={() => setTargetMajors(targetMajors.filter(m => m !== major))} className="hover:text-red-500"><X size={14} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={"space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-navy dark:text-white block">المهارات المستهدفة <span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span></label>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl">
                      {selectedSkills.length === 0 && <span className="text-sm text-slate-400 dark:text-slate-500 py-2">لم يتم اختيار مهارات بعد...</span>}
                      {selectedSkills.map((skill) => (
                        <button key={skill} type="button" disabled={isLocked} onClick={() => toggleSkill(skill)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all">{skill} <X size={14} /></button>
                      ))}
                    </div>
                    <div className="relative">
                      <input type="text" disabled={isLocked} value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(e); } }} placeholder="أضف مهارة (تحديد المهارات الدقيقة يجعل الفرز الآلي أكثر دقة)..." className="w-full pr-6 pl-14 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                      <button type="button" disabled={isLocked} onClick={addCustomSkill} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary transition-all"><Plus size={20} /></button>
                    </div>
                  </div>
                  <div className={"space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-navy dark:text-white block">اللغات المطلوبة <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedLanguages.map((lang) => (
                        <span key={lang} className="bg-primary text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">{lang}
                          <button type="button" disabled={isLocked} onClick={() => setSelectedLanguages(selectedLanguages.filter(l => l !== lang))}><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <select disabled={isLocked} value="" onChange={(e) => { const val = e.target.value; if (val && !selectedLanguages.includes(val)) setSelectedLanguages([...selectedLanguages, val]); }} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary transition-all font-medium appearance-none cursor-pointer">
                        <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر لغة لإضافتها...</option>
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="العربية">العربية</option>
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="الإنجليزية">الإنجليزية</option>
                      </select>
                    </div>
                  </div>

                  {/* AI Override Fields Toggle */}
                  <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-[32px] border-2 border-indigo-100 dark:border-indigo-800/30 shadow-inner mt-8 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">مسار الذكاء الاصطناعي المخصص</h3>
                          <p className="text-sm text-indigo-700/70 dark:text-indigo-400/70 mt-1 font-medium">كتابة معايير دقيقة وسرية يقرأها الذكاء الاصطناعي فقط، بدلاً من الوصف العام.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={useAiOverride}
                          onChange={(e) => setUseAiOverride(e.target.checked)}
                          disabled={isLocked}
                        />
                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <AnimatePresence>
                      {useAiOverride && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-6 border-t border-indigo-200/50 dark:border-indigo-800/50 pt-6 mt-2">
                            <div>
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">نبذة عن الدور (للذكاء الاصطناعي)</label>
                              <textarea
                                value={aiRoleSummary}
                                onChange={(e) => setAiRoleSummary(e.target.value)}
                                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm"
                                rows={3}
                                placeholder="اكتب المعايير الدقيقة للنبذة عن الدور..."
                                disabled={isLocked}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">المهام والمسؤوليات (للذكاء الاصطناعي)</label>
                              <textarea
                                value={aiResponsibilities}
                                onChange={(e) => setAiResponsibilities(e.target.value)}
                                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm"
                                rows={4}
                                placeholder="اكتب المهام والمسؤوليات المخصصة للفرز..."
                                disabled={isLocked}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">المؤهلات والمتطلبات (للذكاء الاصطناعي)</label>
                              <textarea
                                value={aiQualifications}
                                onChange={(e) => setAiQualifications(e.target.value)}
                                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm"
                                rows={4}
                                placeholder="اكتب المؤهلات والمتطلبات المخصصة للفرز..."
                                disabled={isLocked}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">التخصصات المستهدفة (للذكاء الاصطناعي)</label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {aiTargetMajors.map((major, i) => (
                                  <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full text-xs font-bold flex items-center gap-1">
                                    {major}
                                    {!isLocked && <button type="button" onClick={() => setAiTargetMajors(prev => prev.filter((_, idx) => idx !== i))}><X size={12} /></button>}
                                  </span>
                                ))}
                              </div>
                              {!isLocked && <input
                                type="text"
                                placeholder="أضف تخصص واضغط Enter"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    const val = e.currentTarget.value.trim();
                                    if (val && !aiTargetMajors.includes(val)) {
                                      setAiTargetMajors(prev => [...prev, val]);
                                      e.currentTarget.value = "";
                                    }
                                  }
                                }}
                                className="w-full px-4 py-2 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm"
                              />}
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">المهارات المستهدفة (للذكاء الاصطناعي)</label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {aiTargetSkills.map((skill, i) => (
                                  <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full text-xs font-bold flex items-center gap-1">
                                    {skill}
                                    {!isLocked && <button type="button" onClick={() => setAiTargetSkills(prev => prev.filter((_, idx) => idx !== i))}><X size={12} /></button>}
                                  </span>
                                ))}
                              </div>
                              {!isLocked && <input
                                type="text"
                                placeholder="أضف مهارة واضغط Enter"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    const val = e.currentTarget.value.trim();
                                    if (val && !aiTargetSkills.includes(val)) {
                                      setAiTargetSkills(prev => [...prev, val]);
                                      e.currentTarget.value = "";
                                    }
                                  }
                                }}
                                className="w-full px-4 py-2 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm"
                              />}
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">اللغات المطلوبة (للذكاء الاصطناعي)</label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {aiLanguages.map((lang, i) => (
                                  <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full text-xs font-bold flex items-center gap-1">
                                    {lang}
                                    {!isLocked && <button type="button" onClick={() => setAiLanguages(prev => prev.filter((_, idx) => idx !== i))}><X size={12} /></button>}
                                  </span>
                                ))}
                              </div>
                              {!isLocked && <input
                                type="text"
                                placeholder="أضف لغة واضغط Enter"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    const val = e.currentTarget.value.trim();
                                    if (val && !aiLanguages.includes(val)) {
                                      setAiLanguages(prev => [...prev, val]);
                                      e.currentTarget.value = "";
                                    }
                                  }
                                }}
                                className="w-full px-4 py-2 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm"
                              />}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Knockout Questions inside Filter Tab */}
                  <div className={"space-y-4 pt-6 mt-6 border-t font-medium border-slate-200 dark:border-slate-700 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <label className="text-sm font-bold text-navy dark:text-white flex items-center gap-2">
                      الأسئلة التقييمية التلقائية (Knockout Questions)
                    </label>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                        <div className="md:col-span-6">
                          <label className="text-xs font-bold text-slate-500 mb-1 block">نص السؤال</label>
                          <input type="text" disabled={isLocked} value={newKqText} onChange={(e) => setNewKqText(e.target.value)} placeholder="مثال: هل تمتلك رخصة قيادة سارية؟" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm" />
                        </div>
                        <div className="md:col-span-4">
                          <label className="text-xs font-bold text-slate-500 mb-1 block">نوع الإجابة</label>
                          <select disabled={isLocked} value={newKqType} onChange={(e) => setNewKqType(e.target.value as any)} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm appearance-none cursor-pointer">
                            <option value="yes_no">نعم / لا</option>
                            <option value="options">خيارات متعددة</option>
                            <option value="age_condition">شرط العمر</option>
                          </select>
                        </div>
                        {newKqType === "age_condition" && (
                          <div className="md:col-span-12 flex gap-4 mt-2">
                            <input type="number" disabled={isLocked} value={newKqMinAge} onChange={(e) => setNewKqMinAge(e.target.value ? Number(e.target.value) : "")} placeholder="الحد الأدنى (اختياري)" className="w-1/2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm" />
                            <input type="number" disabled={isLocked} value={newKqMaxAge} onChange={(e) => setNewKqMaxAge(e.target.value ? Number(e.target.value) : "")} placeholder="الحد الأعلى (اختياري)" className="w-1/2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm" />
                          </div>
                        )}
                        <div className="md:col-span-2 flex items-end">
                          <button type="button" disabled={isLocked} onClick={(e) => { e.preventDefault(); if (!newKqText.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى إدخال نص السؤال!", type: "warning" } })); return; } setKnockoutQuestions([...knockoutQuestions, { text: newKqText.trim(), type: newKqType, options: newKqType === "options" ? newKqOptions : undefined, requiredAnswer: newKqType === "age_condition" ? "" : (newKqType === "yes_no" ? "نعم" : newKqOptions[0]), minAge: newKqType === "age_condition" && newKqMinAge !== "" ? Number(newKqMinAge) : undefined, maxAge: newKqType === "age_condition" && newKqMaxAge !== "" ? Number(newKqMaxAge) : undefined }]); setNewKqText(""); setNewKqMinAge(""); setNewKqMaxAge(""); }} className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white transition-all font-bold py-3 px-4 rounded-xl text-sm h-[46px] flex items-center justify-center gap-2">
                            <Plus size={16} /> أضف
                          </button>
                        </div>
                      </div>
                      {knockoutQuestions.length > 0 && (
                        <div className="space-y-3 mt-6">
                          {knockoutQuestions.map((q, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                              <div><p className="font-bold text-navy dark:text-white text-sm mb-1">{q.text}</p>
                                <p className="text-xs text-slate-500">{q.type === "age_condition" ? `شرط العمر: من ${q.minAge}${q.maxAge ? ` إلى ${q.maxAge}` : " فأكثر"}` : `${q.type === "yes_no" ? "نعم/لا" : "خيارات متعددة"} - الإجابة المطلوبة:`} {q.type !== "age_condition" && <span className="font-bold text-primary">{q.requiredAnswer}</span>}</p></div>
                              <button type="button" disabled={isLocked} onClick={() => setKnockoutQuestions(knockoutQuestions.filter((_, i) => i !== idx))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><Trash2 size={16} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={activeTab !== "settings" ? "hidden" : "space-y-6"}>
                  <div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6">
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 block">نطاق الراتب المتوقع (ريال) <span className="text-slate-400 font-normal ml-1">(اختياري)</span></label>
                    <div className="flex items-center gap-4">
                      <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="من..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                      <span className="text-slate-400 font-bold">-</span>
                      <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="إلى..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                    </div>
                    <div className="relative mt-3 flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input type="checkbox" className="sr-only peer" checked={isSalaryHidden} onChange={(e) => setIsSalaryHidden(e.target.checked)} />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                        <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء الراتب عن المتقدمين</span>
                      </label>
                    </div>
                    <div className="mt-5 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                          <Settings size={18} className="text-slate-400" />
                          <span className="text-sm font-bold">سؤال المتقدم عن الراتب المتوقع</span>
                        </div>
                        <div className="relative min-w-[220px]">
                          <select
                            value={askExpectedSalary}
                            onChange={(e) => setAskExpectedSalary(e.target.value as any)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-bold appearance-none cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            <option value="hidden">عدم السؤال</option>
                            <option value="open">سؤال مفتوح</option>
                            <option value="ranges">خيارات محددة</option>
                          </select>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown size={16} />
                          </div>
                        </div>
                      </div>

                      {askExpectedSalary === "ranges" && (
                        <div className="mt-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">نطاقات الراتب (اضغط Enter للإضافة)</label>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <AnimatePresence>
                              {expectedSalaryRanges.map((range, idx) => (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  key={idx}
                                  className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2"
                                >
                                  {range}
                                  <button
                                    type="button"
                                    onClick={() => setExpectedSalaryRanges(prev => prev.filter((_, i) => i !== idx))}
                                    className="hover:text-red-500 transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                </motion.span>
                              ))}
                            </AnimatePresence>
                            {expectedSalaryRanges.length === 0 && (
                              <span className="text-sm text-slate-400 font-medium py-1.5">لم يتم إضافة أي نطاقات بعد...</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={salaryRangeMinInput}
                              onChange={(e) => setSalaryRangeMinInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  let rangeStr = "";
                                  const min = salaryRangeMinInput.trim();
                                  const max = salaryRangeMaxInput.trim();
                                  if (min && max) rangeStr = `${min} - ${max}`;
                                  else if (min) rangeStr = `${min}`;
                                  else if (max) rangeStr = `حتى ${max}`;

                                  if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                    setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                    setSalaryRangeMinInput('');
                                    setSalaryRangeMaxInput('');
                                  }
                                }
                              }}
                              placeholder="الحد الأدنى (مثال: 4000)"
                              className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:border-primary outline-none text-sm transition-all"
                            />
                            <input
                              type="number"
                              value={salaryRangeMaxInput}
                              onChange={(e) => setSalaryRangeMaxInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  let rangeStr = "";
                                  const min = salaryRangeMinInput.trim();
                                  const max = salaryRangeMaxInput.trim();
                                  if (min && max) rangeStr = `${min} - ${max}`;
                                  else if (min) rangeStr = `${min}`;
                                  else if (max) rangeStr = `حتى ${max}`;

                                  if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                    setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                    setSalaryRangeMinInput('');
                                    setSalaryRangeMaxInput('');
                                  }
                                }
                              }}
                              placeholder="الحد الأعلى (مثال: 6000)"
                              className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:border-primary outline-none text-sm transition-all"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                let rangeStr = "";
                                const min = salaryRangeMinInput.trim();
                                const max = salaryRangeMaxInput.trim();
                                if (min && max) rangeStr = `${min} - ${max}`;
                                else if (min) rangeStr = `${min}`;
                                else if (max) rangeStr = `حتى ${max}`;

                                if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                  setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                  setSalaryRangeMinInput('');
                                  setSalaryRangeMaxInput('');
                                }
                              }}
                              className="px-4 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                            >
                              إضافة
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="md:col-span-2 flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-navy dark:text-white flex items-center gap-2"><Calendar className="text-primary" size={16} /> التواريخ والجدولة</label>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <span className="ml-3 font-bold text-sm text-navy dark:text-white">إعلان مستمر (مفتوح دائماً)</span>
                        <input type="checkbox" className="sr-only peer" checked={isOpenEnded} onChange={(e) => setIsOpenEnded(e.target.checked)} />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2">بدء التقديم</label>
                      <input required type="datetime-local" lang="en" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-left" dir="ltr" />
                    </div>
                    {!isOpenEnded && (
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy dark:text-white mr-2">انتهاء التقديم</label>
                        <input required type="datetime-local" lang="en" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-left" dir="ltr" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${status === "نشط" ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-400 dark:text-slate-500"}`}><CheckCircle size={20} /></div>
                      <div>
                        <p className="font-bold text-navy dark:text-white">حالة الوظيفة: {status}</p><p className="text-xs text-slate-500 font-medium">تحويل الحالة إلى {status === "نشط" ? "مغلق" : "نشط"}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setStatus(status === "نشط" ? "مغلق" : "نشط")} className={`w-14 h-8 rounded-full relative transition-all ${status === "نشط" ? "bg-green-500" : "bg-slate-300"}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white dark:bg-slate-800 rounded-full transition-all ${status === "نشط" ? "left-1" : "left-7"}`} />
                    </button>
                  </div>
                </div>
                <button type="submit"
                  className="w-full bg-primary text-white py-3 md:py-4 mt-4 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {" "}
                  <Save size={20} /> حفظ التعديلات{" "}
                </button>{" "}
              </form>{" "}
            </motion.div>{" "}
          </div>{" "}
          <div className="space-y-8">
            {" "}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
              {" "}
              <h3 className="font-bold text-navy dark:text-white mb-6">
                إحصائيات سريعة
              </h3>{" "}
              <div className="space-y-4">
                {" "}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  {" "}
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-1">
                    إجمالي المتقدمين
                  </p>{" "}
                  <p className="text-2xl font-bold text-navy dark:text-white">
                    {job.applicants}
                  </p>{" "}
                </div>{" "}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  {" "}
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-1">
                    تاريخ النشر
                  </p>{" "}
                  <p className="text-lg font-bold text-navy dark:text-white">
                    {job.createdAt}
                  </p>{" "}
                </div>{" "}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  {" "}
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-1">
                    رابط التقديم
                  </p>{" "}
                  <button
                    onClick={() => {
                      // const verified = localStorage.getItem("company_verified") === "true";
                      /* if (!verified) {
                        setShowVerificationModal(true);
                        return;
                      } */
                      navigator.clipboard.writeText(
                        `${window.location.origin}/apply/${job.id}`,
                      );
                      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "تم نسخ الرابط بنجاح.", type: "success" } }));
                    }}
                    className="text-primary text-sm font-bold flex items-center gap-2 hover:underline"
                  >
                    {" "}
                    <Share2 size={16} /> نسخ الرابط المباشر{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="bg-navy text-white p-6 rounded-3xl shadow-xl shadow-navy/20">
              {" "}
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6">
                {" "}
                <Zap size={24} />{" "}
              </div>{" "}
              <h3 className="text-xl font-bold mb-2">الهدف التحليلي النشط</h3>{" "}
              <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-6">
                {" "}
                يقوم النظام حالياً بتحليل {job.applicants} سيرة ذاتية لهذا
                الشاغر. يمكنك رؤية النتائج في قائمة المرشحين.{" "}
              </p>{" "}
              <button className="w-full py-3 bg-white dark:bg-white/20 hover:bg-white/90 dark:hover:bg-white/30 text-navy dark:text-white rounded-xl font-bold text-sm transition-all focus:ring-4 focus:ring-primary/20">
                {" "}
                تحديث التحليل{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerify={() => {
          setShowVerificationModal(false);
          navigator.clipboard.writeText(
            `${window.location.origin}/apply/${job.id}`,
          );
          window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "تم نسخ الرابط وتفعيل الحساب بنجاح!", type: "success" } }));
        }}
      />
    </div>
  );
};
export default CreateJob;