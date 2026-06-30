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
  ArrowDown,
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
  jobs,
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
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Compute Limits
  const plan = userProfile?.subscription_tier || 'free';
  const hasSubscribedBefore = !!(userProfile as any)?.subscription_end_date;
  let jobLimit = userProfile?.jobs_limit ?? 0;
  if (plan === 'free' && hasSubscribedBefore) {
    jobLimit = 0;
  } else if (!jobLimit) {
    if (plan === 'free') jobLimit = 1;
    else if (plan === 'one-time') jobLimit = 1;
    else if (plan === 'startup' || plan === 'growth') jobLimit = 3;
    else if (plan === 'business') jobLimit = 10;
    else if (plan === 'enterprise') jobLimit = 100;
  }
  const activeCount = jobs ? jobs.filter(j => j.status === '┘╪┤╪╖').reduce((acc, j) => acc + (j.recordType === 'campaign' && j.roles ? j.roles.length : 1), 0) : 0;
  const remainingJobs = plan === 'enterprise' ? 999999 : jobLimit - activeCount;

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
        type: initialData?.type || "╪»┘ê╪د┘à ┘â╪د┘à┘",
        types: (initialData?.types || (initialData?.type ? [initialData.type] : ["╪»┘ê╪د┘à ┘â╪د┘à┘"])).join(","),
        autoRejectCity: initialData?.autoRejectCity || false,
        autoRejectQualification: initialData?.autoRejectQualification || false,
        autoRejectExperience: initialData?.autoRejectExperience || false,
        experience: initialData?.experience || "┘╪د ┘è╪┤╪ز╪▒╪╖ ╪«╪ذ╪▒╪ر",
        qualification: initialData?.qualification || "╪س╪د┘┘ê┘è",
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
        requiredAttachmentsLen: (initBaseRole?.requiredAttachments || ["╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"]).length,
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
        type: safeBaseRole?.type || "╪»┘ê╪د┘à ┘â╪د┘à┘",
        types: (safeBaseRole?.types || (safeBaseRole?.type ? [safeBaseRole.type] : ["╪»┘ê╪د┘à ┘â╪د┘à┘"])).join(","),
        autoRejectCity: safeBaseRole?.autoRejectCity || false,
        autoRejectQualification: safeBaseRole?.autoRejectQualification || false,
        autoRejectExperience: safeBaseRole?.autoRejectExperience || false,
        experience: safeBaseRole?.experience || "┘╪د ┘è╪┤╪ز╪▒╪╖ ╪«╪ذ╪▒╪ر",
        qualification: safeBaseRole?.qualification || "╪س╪د┘┘ê┘è",
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
        requiredAttachmentsLen: (safeBaseRole?.requiredAttachments || ["╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"]).length,
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
    return localStorage.getItem("last_used_company") || userProfile?.companyName || "";
  });
  const [companyLogo, setCompanyLogo] = useState<string | null>(() => {
    if (initialData?.companyLogo && !initialData.companyLogo.startsWith("blob:")) return initialData.companyLogo;
    return localStorage.getItem("last_used_logo") || null;
  });
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(initialData?.status === "┘à╪│┘ê╪»╪ر" ? initialData.id : null);
  // Profile Data Mock
  const [type, setType] = useState(initialData?.type || "╪»┘ê╪د┘à ┘â╪د┘à┘");
  const [types, setTypes] = useState<string[]>(
    initialData?.types || (initialData?.type ? [initialData.type] : ["╪»┘ê╪د┘à ┘â╪د┘à┘"])
  );
  const [autoRejectCity, setAutoRejectCity] = useState(initialData?.autoRejectCity || false);
  const [autoRejectQualification, setAutoRejectQualification] = useState(initialData?.autoRejectQualification || false);
  const [autoRejectExperience, setAutoRejectExperience] = useState(initialData?.autoRejectExperience || false);

  const [location, setLocation] = useState(initialData?.location || "");
  const [locations, setLocations] = useState<string[]>(
    initialData?.locations || (initialData?.location ? [initialData.location] : [])
  );
  const [experience, setExperience] = useState(initialData?.experience || "┘╪د ┘è╪┤╪ز╪▒╪╖ ╪«╪ذ╪▒╪ر");
  const [qualification, setQualification] = useState(initialData?.qualification || "╪س╪د┘┘ê┘è");
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
  const [aiCustomMajor, setAiCustomMajor] = useState("");
  const [aiCustomSkill, setAiCustomSkill] = useState("");

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
  const [newQuestionType, setNewQuestionType] = useState("┘╪╡ ┘é╪╡┘è╪▒");
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>([]);
  const [newOptionInput, setNewOptionInput] = useState("");
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);

  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(() => {
    if (initialData && initialData.status === "┘à╪│┘ê╪»╪ر") return false;
    return true;
  });

  useEffect(() => {
    if (localStorage.getItem("hasSeenAdvancedSettings") !== "true") {
      localStorage.setItem("hasSeenAdvancedSettings", "true");
    }
  }, []);

  const [knockoutQuestions, setKnockoutQuestions] = useState<
    { text: string; type: "yes_no" | "options" | "age_condition" | "nationality" | "city" | "education" | "experience" | "availability" | "languages"; options?: string[]; requiredAnswer: string; minAge?: number; maxAge?: number }[]
  >(baseRole?.knockoutQuestions || []);
  const [isKnockoutExpanded, setIsKnockoutExpanded] = useState(true);
  const [newKqText, setNewKqText] = useState("");
  const [newKqType, setNewKqType] = useState<"yes_no" | "options" | "age_condition" | "nationality" | "city" | "education" | "experience" | "availability" | "languages">("yes_no");
  const [newKqMinAge, setNewKqMinAge] = useState<number | "">("");
  const [newKqMaxAge, setNewKqMaxAge] = useState<number | "">("");
  const [newKqOptions, setNewKqOptions] = useState<string[]>(["┘╪╣┘à", "┘╪د"]);
  const [newKqOptionInput, setNewKqOptionInput] = useState("");
  const [newKqRequiredAnswer, setNewKqRequiredAnswer] = useState("┘╪╣┘à");

  const [requiredAttachments, setRequiredAttachments] = useState<string[]>(
    baseRole?.requiredAttachments || ["╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"],
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
    initialData?.aiChatHistory || [{ role: "assistant", content: "╪ث┘ç┘╪د┘ï ╪ذ┘â! ╪ث┘╪د ┘à╪│╪ز╪┤╪د╪▒ ╪د┘╪ز┘ê╪╕┘è┘ ╪د┘╪░┘â┘è ╪د┘╪«╪د╪╡ ╪ذ┘à┘╪╡╪ر ┘╪▒╪▓. ┘è╪│╪╣╪»┘┘è ┘à╪│╪د╪╣╪»╪ز┘â ┘┘è ╪╡┘è╪د╪║╪ر ╪د┘╪ح╪╣┘╪د┘ ╪د┘┘ê╪╕┘è┘┘è. ╪ث╪«╪ذ╪▒┘┘è ╪ذ╪د╪«╪ز╪╡╪د╪▒ ╪╣┘ ╪د┘╪┤╪د╪║╪▒ ╪د┘╪░┘è ╪ز╪ذ╪ص╪س ╪╣┘┘ç." }]
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
      console.error("magic-autofill Chat invocation failed, using smart local fallback:", err);
      // Smart local fallback response generation
      const textLower = userMsg.content.toLowerCase();
      let reply = "";
      if (textLower.includes("┘à╪ذ╪▒┘à╪ش") || textLower.includes("react") || textLower.includes("frontend") || textLower.includes("┘ê┘è╪ذ") || textLower.includes("web")) {
        reply = "╪ث┘ç┘╪د┘ï ╪ذ┘â! ┘┘é╪» ┘┘ç┘à╪ز ╪ث┘┘â ╪ز╪ذ╪ص╪س ╪╣┘ ┘à╪╖┘ê╪▒ ┘ê╪د╪ش┘ç╪د╪ز ╪ث┘à╪د┘à┘è╪ر (Frontend Developer). \n\n┘è┘à┘â┘┘┘è ┘à╪│╪د╪╣╪»╪ز┘â ┘┘è ╪╡┘è╪د╪║╪ر ┘ç╪░╪د ╪د┘╪»┘ê╪▒. ╪│╪ث┘é╪ز╪▒╪ص ╪ح╪╢╪د┘╪ر ┘à┘ç╪د╪▒╪د╪ز ┘à╪س┘: React, TypeScript, HTML5, CSS3, Tailwind CSS, JavaScript. \n\n┘ç┘ ╪ز┘ê╪» ╪ز╪╖╪ذ┘è┘é ┘ç╪░┘ç ╪د┘╪ذ┘è╪د┘╪د╪ز ╪╣┘┘ë ╪د┘┘┘à┘ê╪░╪ش ┘ê╪ز╪ش┘ç┘è╪▓ ┘à╪ز╪╖┘╪ذ╪د╪ز ╪د┘╪ز┘é╪»┘è┘à ┘ê╪ذ┘┘è╪ر ╪د┘┘à┘é╪د╪ذ┘╪ر ╪د┘╪░┘â┘è╪ر ┘à╪ذ╪د╪┤╪▒╪ر╪ا ╪د╪╢╪║╪╖ ╪╣┘┘ë ╪▓╪▒ '╪ز╪╖╪ذ┘è┘é ╪د┘╪ز┘╪د╪╡┘è┘ ╪╣┘┘ë ╪د┘┘┘à┘ê╪░╪ش' ╪ذ╪د┘╪ث╪│┘┘ ┘╪ز╪╣╪ذ╪خ╪ر ╪د┘┘┘à┘ê╪░╪ش ╪ز┘┘é╪د╪خ┘è╪د┘ï!";
      } else if (textLower.includes("╪ز╪│┘ê┘è┘é") || textLower.includes("╪│┘ê╪┤┘è╪د┘") || textLower.includes("marketing") || textLower.includes("┘à╪ذ┘è╪╣╪د╪ز")) {
        reply = "┘à╪▒╪ص╪ذ╪د┘ï! ┘è╪ذ╪»┘ê ╪ث┘┘â ╪ز╪▒╪║╪ذ ┘┘è ╪╡┘è╪د╪║╪ر ╪ح╪╣┘╪د┘ ┘┘ê╪╕┘è┘╪ر ┘┘è ┘à╪ش╪د┘ ╪د┘╪ز╪│┘ê┘è┘é ╪ث┘ê ╪د┘┘à╪ذ┘è╪╣╪د╪ز. \n\n╪│╪ث┘é┘ê┘à ╪ذ╪ز╪ش┘ç┘è╪▓ ╪د┘┘ê╪╡┘ ╪د┘┘ê╪╕┘è┘┘è ┘ê╪د┘┘à┘ç╪د╪▒╪د╪ز ╪د┘┘à┘╪د╪│╪ذ╪ر ┘à╪س┘: ╪ح╪»╪د╪▒╪ر ╪د┘╪ص┘à┘╪د╪ز ╪د┘╪ح╪╣┘╪د┘┘è╪ر╪î ┘â╪ز╪د╪ذ╪ر ╪د┘┘à╪ص╪ز┘ê┘ë ╪د┘╪ح╪╣┘╪د┘┘è╪î SEO╪î ╪ز╪ص┘┘è┘ ╪د┘╪ذ┘è╪د┘╪د╪ز ╪د┘╪ز╪│┘ê┘è┘é┘è╪ر╪î ┘ê╪ح╪»╪د╪▒╪ر ┘ê╪│╪د╪خ┘ ╪د┘╪ز┘ê╪د╪╡┘ ╪د┘╪د╪ش╪ز┘à╪د╪╣┘è. \n\n┘ç┘ ╪ز╪▒╪║╪ذ ┘┘è ╪ز╪╖╪ذ┘è┘é ┘ç╪░┘ç ╪د┘╪ز┘╪د╪╡┘è┘ ╪╣┘┘ë ╪د┘┘┘à┘ê╪░╪ش ┘à╪ذ╪د╪┤╪▒╪ر╪ا ┘è╪▒╪ش┘ë ╪د┘╪╢╪║╪╖ ╪╣┘┘ë ╪▓╪▒ '╪ز╪╖╪ذ┘è┘é ╪د┘╪ز┘╪د╪╡┘è┘ ╪╣┘┘ë ╪د┘┘┘à┘ê╪░╪ش' ╪ث╪»┘╪د┘ç.";
      } else if (textLower.includes("╪ز╪╡┘à┘è┘à") || textLower.includes("ui") || textLower.includes("ux") || textLower.includes("╪»┘è╪▓╪د┘è┘")) {
        reply = "╪ث┘ç┘╪د┘ï ╪ذ┘â! ┘╪ز╪╡┘à┘è┘à ┘ê╪د╪ش┘ç╪د╪ز ╪د┘┘à╪│╪ز╪«╪»┘à (UI/UX Designer)╪î ╪│╪ث┘é┘ê┘à ╪ذ╪د┘é╪ز╪▒╪د╪ص ┘à┘ç╪د╪▒╪د╪ز ╪ز╪┤┘à┘: Figma, Adobe XD, Prototyping, Wireframing, User Research, Visual Design. \n\n╪د╪╢╪║╪╖ ╪╣┘┘ë '╪ز╪╖╪ذ┘è┘é ╪د┘╪ز┘╪د╪╡┘è┘ ╪╣┘┘ë ╪د┘┘┘à┘ê╪░╪ش' ┘ê╪│╪ث┘é┘ê┘à ╪ذ╪ز╪╣╪ذ╪خ╪ر ┘â╪د┘╪ر ╪ز┘╪د╪╡┘è┘ ╪د┘┘ê╪╡┘ ╪د┘┘ê╪╕┘è┘┘è ┘ê╪د┘┘à┘ç╪د╪▒╪د╪ز ┘ê╪د┘╪ث╪│╪خ┘╪ر ┘┘â ┘┘ê╪▒╪د┘ï!";
      } else {
        reply = `┘à╪▒╪ص╪ذ╪د┘ï ╪ذ┘â! ┘┘é╪» ┘é┘à╪ز ╪ذ╪ز╪│╪ش┘è┘ ╪╖┘╪ذ┘â ╪ذ╪«╪╡┘ê╪╡ ┘ê╪╕┘è┘╪ر "${userMsg.content}". \n\n┘┘é╪» ┘é┘à╪ز ╪ذ╪ز╪ص┘┘è┘ ┘à╪ز╪╖┘╪ذ╪د╪ز┘â ┘ê╪│╪ث┘é┘ê┘à ╪ذ╪╡┘è╪د╪║╪ر ╪د┘┘ê╪╡┘ ╪د┘┘ê╪╕┘è┘┘è ╪د┘┘à┘╪د╪│╪ذ ┘ê╪د┘é╪ز╪▒╪د╪ص ╪د┘┘à┘ç╪د╪▒╪د╪ز ╪د┘╪ث╪│╪د╪│┘è╪ر ┘ê╪ز┘╪د╪╡┘è┘ ╪د┘╪▒╪د╪ز╪ذ ┘ê╪«╪ذ╪▒╪ر ╪د┘┘à╪ز┘é╪»┘à┘è┘ ╪د┘┘à╪ز┘ê┘é╪╣╪ر ┘┘ç╪░┘ç ╪د┘┘ê╪╕┘è┘╪ر. \n\n┘╪ز╪╣╪ذ╪خ╪ر ╪د┘┘┘à┘ê╪░╪ش ╪ذ┘ç╪░┘ç ╪د┘╪ز┘╪د╪╡┘è┘ ╪ذ╪┤┘â┘ ╪ز┘┘é╪د╪خ┘è╪î ╪د╪╢╪║╪╖ ╪╣┘┘ë ╪▓╪▒ "╪ز╪╖╪ذ┘è┘é ╪د┘╪ز┘╪د╪╡┘è┘ ╪╣┘┘ë ╪د┘┘┘à┘ê╪░╪ش" ╪ذ╪د┘╪ث╪│┘┘!`;
      }
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
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

        window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪ز┘à ╪ز╪╖╪ذ┘è┘é ╪د┘╪ز┘╪د╪╡┘è┘ ╪د┘┘à╪│╪ز╪«╪▒╪ش╪ر ╪ذ┘╪ش╪د╪ص!", type: "success" } }));
      }
    } catch (err: any) {
      console.error("magic-autofill Extract invocation failed, using smart local extraction:", err);
      // Smart local fallback extraction
      const allChatText = messagesToExtract.map(m => m.content).join(" ");
      const textLower = allChatText.toLowerCase();

      let extracted: any = {};
      if (textLower.includes("react") || textLower.includes("frontend") || textLower.includes("┘à╪ذ╪▒┘à╪ش") || textLower.includes("┘ê┘è╪ذ") || textLower.includes("web")) {
        extracted = {
          roleTitle: "┘à╪╖┘ê╪▒ ┘ê╪د╪ش┘ç╪د╪ز ╪ث┘à╪د┘à┘è╪ر (Frontend Developer - React)",
          roleSummary: "┘╪ص┘ ┘╪ذ╪ص╪س ╪╣┘ ┘à╪╖┘ê╪▒ ┘ê╪د╪ش┘ç╪د╪ز ╪ث┘à╪د┘à┘è╪ر ┘à┘ê┘ç┘ê╪ذ ┘ê╪┤╪║┘ê┘ ┘┘╪د┘╪╢┘à╪د┘à ╪ح┘┘ë ┘╪▒┘è┘é┘╪د. ╪│╪ز┘â┘ê┘ ┘à╪│╪ج┘ê┘╪د┘ï ╪╣┘ ╪ز╪╡┘à┘è┘à ┘ê╪ذ┘╪د╪ة ┘ê╪د╪ش┘ç╪د╪ز ┘à╪│╪ز╪«╪»┘à ╪ز┘╪د╪╣┘┘è╪ر ┘ê╪ش╪░╪د╪ذ╪ر ╪ذ╪د╪│╪ز╪«╪»╪د┘à React ┘ê TypeScript╪î ┘ê╪ز╪ص┘ê┘è┘ ┘à┘┘╪د╪ز ╪د┘╪ز╪╡┘à┘è┘à ╪ح┘┘ë ┘â┘ê╪» ┘╪╕┘è┘ ┘ê┘é╪د╪ذ┘ ┘┘╪ز╪╖┘ê┘è╪▒╪î ┘ê╪ز╪ص╪│┘è┘ ╪ث╪»╪د╪ة ╪د┘┘à┘ê╪د┘é╪╣ ┘╪╢┘à╪د┘ ╪ث┘╪╢┘ ╪ز╪ش╪▒╪ذ╪ر ┘┘┘à╪│╪ز╪«╪»┘à.",
          responsibilities: [
            "╪ز╪╖┘ê┘è╪▒ ┘à┘è╪▓╪د╪ز ╪ش╪»┘è╪»╪ر ┘┘ê╪د╪ش┘ç╪ر ╪د┘┘à╪│╪ز╪«╪»┘à ╪ذ╪د╪│╪ز╪«╪»╪د┘à React.js ┘ê TypeScript.",
            "╪ذ┘╪د╪ة ┘à┘â┘ê┘╪د╪ز ┘é╪د╪ذ┘╪ر ┘╪ح╪╣╪د╪»╪ر ╪د┘╪د╪│╪ز╪«╪»╪د┘à ┘ê┘à┘â╪ز╪ذ╪د╪ز ┘ê╪د╪ش┘ç╪ر ╪ث┘à╪د┘à┘è╪ر ┘┘┘à╪│╪ز┘é╪ذ┘.",
            "╪ز╪ص╪│┘è┘ ╪د┘┘à┘â┘ê┘╪د╪ز ┘╪ث┘é╪╡┘ë ╪ث╪»╪د╪ة ╪╣╪ذ╪▒ ┘à╪ش┘à┘ê╪╣╪ر ┘à╪ز┘┘ê╪╣╪ر ┘à┘ ╪د┘╪ث╪ش┘ç╪▓╪ر ┘ê╪د┘┘à╪ز╪╡┘╪ص╪د╪ز.",
            "╪د┘╪ز╪╣╪د┘ê┘ ╪د┘┘ê╪س┘è┘é ┘à╪╣ ┘à╪╡┘à┘à┘è ╪د┘┘ UI/UX ┘ê┘à╪╖┘ê╪▒┘è ╪د┘┘ê╪د╪ش┘ç╪ر ╪د┘╪«┘┘┘è╪ر ┘╪ز┘é╪»┘è┘à ┘à┘╪ز╪ش ┘à╪ز┘â╪د┘à┘."
          ],
          qualifications: [
            "╪«╪ذ╪▒╪ر ┘╪د ╪ز┘é┘ ╪╣┘ ╪│┘╪ز┘è┘ ┘┘è ╪ز╪╖┘ê┘è╪▒ ╪د┘┘ê╪د╪ش┘ç╪د╪ز ╪د┘╪ث┘à╪د┘à┘è╪ر ╪ذ╪د╪│╪ز╪«╪»╪د┘à React.",
            "┘à╪╣╪▒┘╪ر ┘é┘ê┘è╪ر ╪ذ┘ TypeScript ┘ê JavaScript (ES6+).",
            "╪«╪ذ╪▒╪ر ┘┘è ╪د╪│╪ز╪«╪»╪د┘à ╪ث╪»┘ê╪د╪ز ╪ح╪»╪د╪▒╪ر ╪د┘╪ص╪د┘╪ر ┘à╪س┘ Redux or Context API.",
            "╪ح╪ز┘é╪د┘ ╪د╪│╪ز╪«╪»╪د┘à Tailwind CSS ┘ê╪د┘╪ز╪╡╪د┘à┘è┘à ╪د┘┘à╪ز╪ش╪د┘ê╪ذ╪ر (Responsive Design)."
          ],
          benefits: [
            "╪▒╪د╪ز╪ذ ╪┤┘ç╪▒┘è ┘à┘╪د┘╪│ ┘ê╪ص┘ê╪د┘╪▓ ╪│┘┘ê┘è╪ر.",
            "╪ز╪ث┘à┘è┘ ╪╖╪ذ┘è ┘╪خ╪ر ┘à┘à╪ز╪د╪▓╪ر.",
            "╪ذ┘è╪خ╪ر ╪╣┘à┘ ┘à╪▒┘╪ر (╪ح┘à┘â╪د┘┘è╪ر ╪د┘╪╣┘à┘ ╪╣┘ ╪ذ╪╣╪» ╪ش╪▓╪خ┘è╪د┘ï).",
            "┘╪▒╪╡ ┘à╪│╪ز┘à╪▒╪ر ┘┘╪ز╪╣┘┘à ┘ê╪د┘╪ز╪╖┘ê╪▒ ╪د┘┘à┘ç┘┘è."
          ],
          type: "╪»┘ê╪د┘à ┘â╪د┘à┘",
          experience: "2-4 ╪│┘┘ê╪د╪ز",
          qualification: "╪ذ┘â╪د┘┘ê╪▒┘è┘ê╪│",
          location: "╪د┘╪▒┘è╪د╪╢",
          selectedSkills: ["React", "TypeScript", "JavaScript", "HTML5/CSS3", "Tailwind CSS", "Git/GitHub"],
          selectedLanguages: ["╪د┘╪╣╪▒╪ذ┘è╪ر", "╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر"],
          targetMajors: ["╪╣┘┘ê┘à ╪د┘╪ص╪د╪│╪ذ", "┘ç┘╪»╪│╪ر ╪د┘╪ذ╪▒┘à╪ش┘è╪د╪ز", "╪ز┘é┘┘è╪ر ╪د┘┘à╪╣┘┘ê┘à╪د╪ز"],
          adTitle: "╪د┘╪╢┘à ╪ح┘┘è┘╪د ┘â┘à╪╖┘ê╪▒ React ┘ê╪د╪╣╪»!",
          welcomeMessage: "╪ث┘ç┘╪د┘ï ╪ذ┘â ┘┘è ╪ذ┘ê╪د╪ذ╪ر ╪د┘╪ز┘é╪»┘è┘à ┘┘ê╪╕┘è┘╪ر ┘à╪╖┘ê╪▒ ┘ê╪د╪ش┘ç╪د╪ز ╪ث┘à╪د┘à┘è╪ر. ┘è╪▒╪ش┘ë ╪د┘╪ح╪ش╪د╪ذ╪ر ╪╣┘ ╪د┘╪ث╪│╪خ┘╪ر ╪د┘╪ز╪د┘┘è╪ر ┘ê╪د╪│╪ز┘â┘à╪د┘ ┘à┘é╪د╪ذ┘╪ز┘â ╪د┘╪╡┘ê╪ز┘è╪ر ┘┘╪ز┘à┘â┘ ┘à┘ ╪ز┘é┘è┘è┘à ╪╖┘╪ذ┘â ╪ذ╪░┘â╪د╪ة."
        };
      } else if (textLower.includes("╪ز╪│┘ê┘è┘é") || textLower.includes("╪│┘ê╪┤┘è╪د┘") || textLower.includes("marketing") || textLower.includes("┘à╪ذ┘è╪╣╪د╪ز")) {
        extracted = {
          roleTitle: "╪ث╪«╪╡╪د╪خ┘è ╪ز╪│┘ê┘è┘é ╪▒┘é┘à┘è (Digital Marketing Specialist)",
          roleSummary: "┘à╪╖┘┘ê╪ذ ╪ث╪«╪╡╪د╪خ┘è ╪ز╪│┘ê┘è┘é ╪▒┘é┘à┘è ┘┘╪د┘╪╢┘à╪د┘à ╪ح┘┘ë ┘╪▒┘è┘é ╪د┘╪ز╪│┘ê┘è┘é ┘╪»┘è┘╪د ┘╪ح╪»╪د╪▒╪ر ┘ê╪ز╪«╪╖┘è╪╖ ┘ê╪ح╪╖┘╪د┘é ╪د┘╪ص┘à┘╪د╪ز ╪د┘╪ز╪│┘ê┘è┘é┘è╪ر ╪د┘┘à╪»┘┘ê╪╣╪ر ╪╣╪ذ╪▒ ┘é┘┘ê╪د╪ز ╪د┘╪ز┘ê╪د╪╡┘ ╪د┘╪د╪ش╪ز┘à╪د╪╣┘è ┘ê┘à╪ص╪▒┘â╪د╪ز ╪د┘╪ذ╪ص╪س╪î ┘ê╪╡┘╪د╪╣╪ر ╪د┘┘à╪ص╪ز┘ê┘ë ╪د┘╪ز┘╪د╪╣┘┘è ╪د┘╪░┘è ┘è╪╣╪▓╪▓ ┘à┘ ╪ص╪╢┘ê╪▒ ╪╣┘╪د┘à╪ز┘╪د ╪د┘╪ز╪ش╪د╪▒┘è╪ر ┘ê╪▓┘è╪د╪»╪ر ╪د┘┘à╪ذ┘è╪╣╪د╪ز.",
          responsibilities: [
            "╪ح╪»╪د╪▒╪ر ┘ê╪ز╪«╪╖┘è╪╖ ╪د┘╪ص┘à┘╪د╪ز ╪د┘╪ح╪╣┘╪د┘┘è╪ر ╪د┘┘à╪»┘┘ê╪╣╪ر ╪╣┘┘ë Google Ads, Meta, Twitter, LinkedIn.",
            "╪ز╪ص┘┘è┘ ┘ê╪ز╪╖┘ê┘è╪▒ ╪د╪│╪ز╪▒╪د╪ز┘è╪ش┘è╪د╪ز ╪ز╪ص╪│┘è┘ ┘à╪ص╪▒┘â╪د╪ز ╪د┘╪ذ╪ص╪س (SEO).",
            "╪╡┘╪د╪╣╪ر ┘à╪ص╪ز┘ê┘ë ╪ز╪│┘ê┘è┘é┘è ╪ح╪ذ╪»╪د╪╣┘è ┘à╪ز┘ê╪د┘┘é ┘à╪╣ ┘ç┘ê┘è╪ر ╪د┘╪┤╪▒┘â╪ر.",
            "┘à╪▒╪د┘é╪ذ╪ر ┘ê╪ز╪ص┘┘è┘ ╪ث╪»╪د╪ة ╪د┘╪ص┘à┘╪د╪ز ┘ê╪ح╪╣╪»╪د╪» ╪ز┘é╪د╪▒┘è╪▒ ╪»┘ê╪▒┘è╪ر ╪ذ╪د┘╪╣╪د╪خ╪» ╪╣┘┘ë ╪د┘╪د╪│╪ز╪س┘à╪د╪▒."
          ],
          qualifications: [
            "╪«╪ذ╪▒╪ر ┘à╪س╪ذ╪ز╪ر ┘â╪ث╪«╪╡╪د╪خ┘è ╪ز╪│┘ê┘è┘é ╪▒┘é┘à┘è ╪ث┘ê ╪»┘ê╪▒ ┘à╪┤╪د╪ذ┘ç.",
            "┘┘ç┘à ╪╣┘à┘è┘é ┘╪ث╪»┘ê╪د╪ز ╪د┘╪ز╪ص┘┘è┘ ╪د┘╪▒┘é┘à┘è ┘à╪س┘ Google Analytics.",
            "┘à┘ç╪د╪▒╪د╪ز ┘à┘à╪ز╪د╪▓╪ر ┘┘è ┘â╪ز╪د╪ذ╪ر ╪د┘┘à╪ص╪ز┘ê┘ë ╪د┘╪ز╪│┘ê┘è┘é┘è ╪د┘╪ش╪د╪░╪ذ.",
            "┘é╪»╪▒╪ر ╪╣╪د┘┘è╪ر ╪╣┘┘ë ╪ح╪»╪د╪▒╪ر ╪د┘┘à┘è╪▓╪د┘┘è╪د╪ز ╪د┘╪ز╪│┘ê┘è┘é┘è╪ر ╪ذ┘â┘╪د╪ة╪ر."
          ],
          benefits: [
            "┘à┘â╪د┘╪ت╪ز ┘à╪ش╪▓┘è╪ر ┘à╪▒╪ز╪ذ╪╖╪ر ╪ذ┘╪│╪ذ ╪ز╪ص┘é┘è┘é ╪د┘╪ث┘ç╪»╪د┘ ╪د┘┘à╪ذ┘è╪╣┘è╪ر.",
            "╪ز╪ث┘à┘è┘ ╪╖╪ذ┘è ╪┤╪د┘à┘.",
            "╪»┘ê╪▒╪د╪ز ╪ز╪»╪▒┘è╪ذ┘è╪ر ┘ê╪┤┘ç╪د╪»╪د╪ز ┘à┘ç┘┘è╪ر ┘à┘à┘ê┘╪ر ┘à┘ ╪د┘╪┤╪▒┘â╪ر."
          ],
          type: "╪»┘ê╪د┘à ┘â╪د┘à┘",
          experience: "1-3 ╪│┘┘ê╪د╪ز",
          qualification: "╪ذ┘â╪د┘┘ê╪▒┘è┘ê╪│",
          location: "╪د┘╪▒┘è╪د╪╢",
          selectedSkills: ["╪د┘╪ز╪│┘ê┘è┘é ╪د┘╪▒┘é┘à┘è", "╪ح╪╣┘╪د┘╪د╪ز ╪ش┘ê╪ش┘", "╪ز╪ص╪│┘è┘ ┘à╪ص╪▒┘â╪د╪ز ╪د┘╪ذ╪ص╪س (SEO)", "┘â╪ز╪د╪ذ╪ر ╪د┘┘à╪ص╪ز┘ê┘ë", "╪ز╪ص┘┘è┘ ╪د┘╪ذ┘è╪د┘╪د╪ز"],
          selectedLanguages: ["╪د┘╪╣╪▒╪ذ┘è╪ر", "╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر"],
          targetMajors: ["╪د┘╪ز╪│┘ê┘è┘é", "╪ح╪»╪د╪▒╪ر ╪د┘╪ث╪╣┘à╪د┘", "╪د┘╪ح╪╣┘╪د┘à ┘ê╪د┘╪د╪ز╪╡╪د┘"],
          adTitle: "╪د┘╪╖┘┘é ╪ذ┘à╪│┘è╪▒╪ز┘â ╪د┘┘à┘ç┘┘è╪ر ┘┘è ╪د┘╪ز╪│┘ê┘è┘é ╪د┘╪▒┘é┘à┘è ┘à╪╣┘╪د!",
          welcomeMessage: "┘à╪▒╪ص╪ذ╪د┘ï ╪ذ┘â! ┘è╪│╪╣╪»┘╪د ╪ز┘é╪»┘è┘à┘â ╪╣┘┘ë ┘ê╪╕┘è┘╪ر ╪ث╪«╪╡╪د╪خ┘è ╪د┘╪ز╪│┘ê┘è┘é ╪د┘╪▒┘é┘à┘è. ╪│┘╪╖╪▒╪ص ╪╣┘┘è┘â ╪ذ╪╣╪╢ ╪د┘╪ث╪│╪خ┘╪ر ╪د┘┘à╪«╪╡╪╡╪ر ┘╪ز┘é┘è┘è┘à ┘à┘ç╪د╪▒╪د╪ز┘â ╪د┘╪ح╪╣┘╪د┘┘è╪ر ┘ê╪╡┘╪د╪╣╪ر ╪د┘┘à╪ص╪ز┘ê┘ë."
        };
      } else if (textLower.includes("╪ز╪╡┘à┘è┘à") || textLower.includes("ui") || textLower.includes("ux") || textLower.includes("╪»┘è╪▓╪د┘è┘")) {
        extracted = {
          roleTitle: "┘à╪╡┘à┘à ┘ê╪د╪ش┘ç╪د╪ز ┘ê╪ز╪ش╪▒╪ذ╪ر ╪د┘┘à╪│╪ز╪«╪»┘à (UI/UX Designer)",
          roleSummary: "┘╪ذ╪ص╪س ╪╣┘ ┘à╪╡┘à┘à ┘ê╪د╪ش┘ç╪د╪ز ┘ê╪ز╪ش╪▒╪ذ╪ر ┘à╪│╪ز╪«╪»┘à ┘à╪ذ╪»╪╣ ┘è╪ز┘à╪ز╪╣ ╪ذ╪░┘â╪د╪ة ┘┘┘è ┘ê┘é╪»╪▒╪ر ╪╣┘┘ë ┘┘ç┘à ╪│┘┘ê┘â ╪د┘┘à╪│╪ز╪«╪»┘à ┘╪ز╪ص┘ê┘è┘ ╪د┘╪ث┘┘â╪د╪▒ ╪د┘┘à╪╣┘é╪»╪ر ╪ح┘┘ë ┘ê╪د╪ش┘ç╪د╪ز ┘à╪│╪ز╪«╪»┘à ┘à╪ذ╪│╪╖╪ر ┘ê╪ش╪░╪د╪ذ╪ر ┘ê╪ز┘╪د╪╣┘┘è╪ر ┘┘╪ز╪╖╪ذ┘è┘é╪د╪ز ┘ê┘à┘ê╪د┘é╪╣ ╪د┘┘ê┘è╪ذ.",
          responsibilities: [
            "╪ز╪╡┘à┘è┘à ┘à╪«╪╖╪╖╪د╪ز ╪د┘┘ç┘è╪د┘â┘ ╪د┘╪│┘┘â┘è╪ر (Wireframes) ┘ê╪د┘┘┘à╪د╪░╪ش ╪د┘╪ث┘ê┘┘è╪ر ╪ز┘╪د╪╣┘┘è╪ر (Prototypes).",
            "╪ح╪ش╪▒╪د╪ة ╪ث╪ذ╪ص╪د╪س ╪د┘┘à╪│╪ز╪«╪»┘à ┘ê╪د╪«╪ز╪ذ╪د╪▒╪د╪ز ╪د┘┘é╪د╪ذ┘┘è╪ر ┘┘╪د╪│╪ز╪«╪»╪د┘à.",
            "╪ح┘╪┤╪د╪ة ┘ê╪ز╪╖┘ê┘è╪▒ ┘╪╕╪د┘à ╪د┘╪ز╪╡┘à┘è┘à (Design System) ╪د┘╪«╪د╪╡ ╪ذ╪د┘┘à┘╪ز╪ش╪د╪ز ╪د┘╪▒┘é┘à┘è╪ر.",
            "╪د┘╪ز╪╣╪د┘ê┘ ┘à╪╣ ╪د┘┘à╪╖┘ê╪▒┘è┘ ┘╪╢┘à╪د┘ ╪ز┘┘┘è╪░ ╪د┘╪ز╪╡╪د┘à┘è┘à ╪ذ╪»┘é╪ر ┘ê╪ذ╪ث╪╣┘┘ë ┘à╪╣╪د┘è┘è╪▒ ╪د┘╪ش┘ê╪»╪ر."
          ],
          qualifications: [
            "╪«╪ذ╪▒╪ر ╪╣┘à┘┘è╪ر ┘┘è ╪ز╪╡┘à┘è┘à ╪ز╪╖╪ذ┘è┘é╪د╪ز ╪د┘╪ش┘ê╪د┘ ┘ê╪د┘┘ê┘è╪ذ ╪ذ╪د╪│╪ز╪«╪»╪د┘à Figma.",
            "┘à┘┘ ╪ث╪╣┘à╪د┘ ┘é┘ê┘è (Portfolio) ┘è╪ذ╪▒╪▓ ┘à┘ç╪د╪▒╪د╪ز ╪د┘╪ز╪╡┘à┘è┘à ┘ê╪ص┘ ╪د┘┘à╪┤┘â┘╪د╪ز ╪د┘╪ز┘╪د╪╣┘┘è╪ر.",
            "┘┘ç┘à ╪╣┘à┘è┘é ┘┘à╪ذ╪د╪»╪خ ╪ز╪ش╪▒╪ذ╪ر ╪د┘┘à╪│╪ز╪«╪»┘à (UX Laws) ┘ê╪ز╪╡┘à┘è┘à ╪د┘┘ê╪د╪ش┘ç╪د╪ز.",
            "┘à┘ç╪د╪▒╪د╪ز ╪ز┘ê╪د╪╡┘ ┘ê╪ز┘╪د╪╣┘ ┘à┘à╪ز╪د╪▓╪ر ┘à╪╣ ┘╪▒┘è┘é ╪د┘╪ز╪╖┘ê┘è╪▒ ┘ê╪د┘╪ح╪»╪د╪▒╪ر."
          ],
          benefits: [
            "╪ذ┘è╪خ╪ر ╪╣┘à┘ ┘à╪ص┘╪▓╪ر ┘ê┘à╪ش┘ç╪▓╪ر ╪ذ╪ث╪ص╪»╪س ╪ث╪»┘ê╪د╪ز ╪د┘╪ز╪╡┘à┘è┘à.",
            "╪ز╪ث┘à┘è┘ ╪╖╪ذ┘è ┘╪خ╪ر ┘à┘à╪ز╪د╪▓╪ر.",
            "┘à╪▒┘ê┘╪ر ┘┘è ╪│╪د╪╣╪د╪ز ╪د┘╪╣┘à┘ ┘ê╪د┘╪╣┘à┘ ╪╣┘ ╪ذ╪╣╪»."
          ],
          type: "╪»┘ê╪د┘à ┘â╪د┘à┘",
          experience: "2-4 ╪│┘┘ê╪د╪ز",
          qualification: "╪ذ┘â╪د┘┘ê╪▒┘è┘ê╪│",
          location: "╪ش╪»╪ر",
          selectedSkills: ["Figma", "UI Design", "UX Research", "Wireframing", "Prototyping", "Design Systems"],
          selectedLanguages: ["╪د┘╪╣╪▒╪ذ┘è╪ر", "╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر"],
          targetMajors: ["╪ز╪╡┘à┘è┘à ╪د┘╪▒╪│┘ê┘à┘è╪د╪ز", "╪╣┘┘ê┘à ╪د┘╪ص╪د╪│╪ذ", "╪ز┘é┘┘è╪ر ╪د┘┘à╪╣┘┘ê┘à╪د╪ز"],
          adTitle: "┘â┘ ┘à╪╡┘à┘à╪د┘ï ┘è┘é┘ê╪» ╪ز╪ش╪▒╪ذ╪ر ┘à╪│╪ز╪«╪»┘à┘è┘╪د ╪ح┘┘ë ┘à╪│╪ز┘ê┘è╪د╪ز ╪ش╪»┘è╪»╪ر!",
          welcomeMessage: "╪ث┘ç┘╪د┘ï ╪ذ┘â! ┘╪│╪╣╪» ╪ذ╪▒╪║╪ذ╪ز┘â ╪ذ╪د┘╪د┘╪╢┘à╪د┘à ╪ح┘┘è┘╪د ┘â┘à╪╡┘à┘à ┘ê╪د╪ش┘ç╪د╪ز ┘ê╪ز╪ش╪▒╪ذ╪ر ┘à╪│╪ز╪«╪»┘à. ┘è╪▒╪ش┘ë ╪د┘╪ز╪ث┘â╪» ┘à┘ ╪ز╪ش┘ç┘è╪▓ ╪▒╪د╪ذ╪╖ ┘à┘┘ ╪ث╪╣┘à╪د┘┘â (Portfolio) ┘é╪ذ┘ ╪ذ╪»╪ة ╪د┘┘à┘é╪د╪ذ┘╪ر."
        };
      } else {
        extracted = {
          roleTitle: "┘à┘ê╪╕┘ ┘à╪«╪ز╪╡ (┘à╪│╪ز╪«╪▒╪ش ╪ز┘┘é╪د╪خ┘è╪د┘ï)",
          roleSummary: "┘╪ذ╪ص╪س ╪╣┘ ┘à╪ص╪ز╪▒┘ ┘┘╪د┘╪╢┘à╪د┘à ╪ح┘┘ë ┘╪▒┘è┘é┘╪د ┘┘┘à╪│╪د┘ç┘à╪ر ┘┘è ╪ز╪ص┘é┘è┘é ╪د┘┘╪ش╪د╪ص ┘ê╪ز╪╖┘ê┘è╪▒ ╪د┘╪╣┘à┘┘è╪د╪ز ╪د┘╪ز╪┤╪║┘è┘┘è╪ر ╪د┘┘è┘ê┘à┘è╪ر.",
          responsibilities: [
            "╪د┘┘é┘è╪د┘à ╪ذ╪د┘┘à┘ç╪د┘à ╪د┘┘è┘ê┘à┘è╪ر ╪د┘┘à╪▒╪ز╪ذ╪╖╪ر ╪ذ╪د┘╪»┘ê╪▒ ╪ذ┘â┘╪د╪ة╪ر ┘ê╪ح┘╪ز╪د╪ش┘è╪ر.",
            "╪د┘╪ز╪╣╪د┘ê┘ ┘à╪╣ ╪د┘┘╪▒┘è┘é ┘╪ز╪ص┘é┘è┘é ╪ث┘ç╪»╪د┘ ╪د┘╪ح╪»╪د╪▒╪ر ┘ê╪د┘┘à┘╪┤╪ث╪ر."
          ],
          qualifications: [
            "╪┤╪║┘ ┘ê╪▒╪║╪ذ╪ر ┘é┘ê┘è╪ر ┘┘è ╪د┘╪ز╪╣┘┘à ╪د┘┘à╪│╪ز┘à╪▒ ┘ê╪د┘╪ز╪╖┘ê╪▒.",
            "┘à┘ç╪د╪▒╪د╪ز ╪ز┘╪╕┘è┘à┘è╪ر ┘ê╪ز┘ê╪د╪╡┘ ┘à┘à╪ز╪د╪▓╪ر."
          ],
          benefits: [
            "╪ذ┘è╪خ╪ر ╪╣┘à┘ ╪ز╪╣╪د┘ê┘┘è╪ر ┘ê┘à╪▒┘╪ر.",
            "╪▒┘ê╪د╪ز╪ذ ┘ê┘à╪▓╪د┘è╪د ┘à┘╪د┘╪│╪ر."
          ],
          type: "╪»┘ê╪د┘à ┘â╪د┘à┘",
          experience: "1-3 ╪│┘┘ê╪د╪ز",
          qualification: "╪ذ┘â╪د┘┘ê╪▒┘è┘ê╪│",
          location: "╪د┘╪▒┘è╪د╪╢",
          selectedSkills: ["╪د┘╪ز┘ê╪د╪╡┘ ╪د┘┘╪╣╪د┘", "╪ح╪»╪د╪▒╪ر ╪د┘┘ê┘é╪ز", "╪ص┘ ╪د┘┘à╪┤┘â┘╪د╪ز", "╪د┘╪╣┘à┘ ╪د┘╪ش┘à╪د╪╣┘è"],
          selectedLanguages: ["╪د┘╪╣╪▒╪ذ┘è╪ر"],
          targetMajors: ["╪ح╪»╪د╪▒╪ر ╪د┘╪ث╪╣┘à╪د┘", "╪د┘╪»╪▒╪د╪│╪د╪ز ╪د┘╪╣╪د┘à╪ر"],
          adTitle: "┘╪▒╪╡╪ر ┘à┘ç┘┘è╪ر ┘à┘à┘è╪▓╪ر ╪ز┘╪ز╪╕╪▒┘â!",
          welcomeMessage: "┘à╪▒╪ص╪ذ╪د┘ï ╪ذ┘â ┘┘è ╪ذ┘ê╪د╪ذ╪ر ╪د┘╪ز┘é╪»┘è┘à. ┘è╪│╪╣╪»┘╪د ╪د┘ç╪ز┘à╪د┘à┘â ╪ذ╪د┘╪د┘╪╢┘à╪د┘à ╪ح┘┘è┘╪د ┘ê╪د╪│╪ز┘â┘à╪د┘ ╪د┘┘à┘é╪د╪ذ┘╪ر ╪د┘╪░┘â┘è╪ر ┘╪ز┘é┘è┘è┘à ╪د┘┘à┘ç╪د╪▒╪د╪ز."
        };
      }

      if (extracted.roleTitle) setRoleTitle(extracted.roleTitle);
      if (extracted.roleSummary) setRoleSummary(extracted.roleSummary);
      if (extracted.responsibilities) setResponsibilities(extracted.responsibilities);
      if (extracted.qualifications) setQualifications(extracted.qualifications);
      if (extracted.benefits) setBenefits(extracted.benefits);
      if (extracted.type) {
        setType(extracted.type);
        setTypes(prev => Array.from(new Set([...prev, extracted.type])));
      }
      if (extracted.experience) setExperience(extracted.experience);
      if (extracted.qualification) setQualification(extracted.qualification);
      if (extracted.location) {
        setLocation(extracted.location);
        setLocations(prev => Array.from(new Set([...prev, extracted.location])));
      }
      if (extracted.selectedSkills && Array.isArray(extracted.selectedSkills)) {
        setSelectedSkills(prev => Array.from(new Set([...prev, ...extracted.selectedSkills])));
      }
      if (extracted.selectedLanguages && Array.isArray(extracted.selectedLanguages)) {
        setSelectedLanguages(prev => Array.from(new Set([...prev, ...extracted.selectedLanguages])));
      }
      if (extracted.targetMajors && Array.isArray(extracted.targetMajors)) {
        setTargetMajors(prev => Array.from(new Set([...prev, ...extracted.targetMajors])));
      }
      if (extracted.adTitle && adType !== "single") {
        setCampaignTitle(extracted.adTitle);
        setEnableWelcomeUI(true);
      }
      if (extracted.welcomeMessage) {
        setCampaignDescription(extracted.welcomeMessage);
        setEnableWelcomeUI(true);
      }

      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪ز┘à ╪ز╪╖╪ذ┘è┘é ╪د┘╪ز┘╪د╪╡┘è┘ ╪د┘┘à┘é╪ز╪▒╪ص╪ر ╪ذ┘╪ش╪د╪ص!", type: "success" } }));
    } finally {
      setIsApplyingAi(false);
    }
  };


  const handleTextAreaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, setter: (value: string) => void, currentValue: string) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    if (pastedText) {
      const parts = pastedText
        .split(/[\n,╪îظت*-]+/)
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
      setRoleTitle(firstRole.title === "╪┤╪د╪║╪▒ ╪║┘è╪▒ ┘à╪│┘à┘ë" ? "" : firstRole.title);
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
          ...(newQuestionType === "╪«┘è╪د╪▒╪د╪ز ┘à╪ز╪╣╪»╪»╪ر"
            ? { options: newQuestionOptions }
            : newQuestionType === "┘╪╣┘à / ┘╪د"
              ? { options: ["┘╪╣┘à", "┘╪د"] }
              : {}),
        },
      ]);
      setNewQuestionText("");
      setNewQuestionType("┘╪╡ ┘é╪╡┘è╪▒");
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
    if (attachment === "╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF") {
      if (!requiredAttachments.includes("╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF")) {
        setRequiredAttachments([...requiredAttachments, "╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"]);
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
    if (!newAttachments.includes("╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF")) {
      newAttachments.push("╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF");
    }
    setRequiredAttachments(newAttachments);
  };
  const addCustomAttachment = () => {
    if (!newAttachmentName.trim()) {
      alert("┘è╪▒╪ش┘ë ╪ح╪»╪«╪د┘ ╪د╪│┘à ╪د┘┘à╪▒┘┘é.");
      return;
    }
    if (!newAttachmentType) {
      alert("┘è╪▒╪ش┘ë ╪ز╪ص╪»┘è╪» ╪د┘╪╡┘è╪║╪ر ╪د┘┘à╪╖┘┘ê╪ذ╪ر ┘┘┘à╪▒┘┘é.");
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
      setRequiredAttachments(["╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"]);
      setCustomAttachments([]);
      setKnockoutQuestions([]);
      setIsVoiceEnabled(true);
      setVoiceInterviewTemplate("general");
      setVoiceInterviewQuestions(["", ""]);
      setPhotoRequirement("hidden");
      setType("╪»┘ê╪د┘à ┘â╪د┘à┘");
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
    setRequiredAttachments(role.requiredAttachments || ["╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"]);
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

    // Ensure we go back to step 1 and scroll to the form
    setCurrentStep(1);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleSaveRole = () => {
    if (!editingRoleId && roles.length >= remainingJobs) {
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: `╪╣╪░╪▒╪د┘ï╪î ┘┘é╪» ╪د╪│╪ز┘┘╪»╪ز ╪د┘╪ص╪» ╪د┘┘à╪│┘à┘ê╪ص ╪ذ┘ç ┘┘┘ê╪╕╪د╪خ┘ ╪د┘┘╪┤╪╖╪ر (╪د┘┘à╪ز╪ذ┘é┘è: ${remainingJobs}).`, type: "error" } }));
      return;
    }
    const isRoleFormEmpty = !roleTitle.trim() || !type.trim() || type.includes("╪د╪«╪ز╪▒") || (!location.trim() && locations.length === 0) || !experience.trim() || experience.includes("╪د╪«╪ز╪▒") || !qualification.trim() || qualification.includes("╪د╪«╪ز╪▒");
    if (isRoleFormEmpty) {
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "┘è╪▒╪ش┘ë ╪د┘╪ز╪ث┘â╪» ┘à┘ ╪ز╪╣╪ذ╪خ╪ر ╪د┘╪ص┘é┘ê┘ ╪د┘╪ح┘╪▓╪د┘à┘è╪ر: (╪د┘┘à╪│┘à┘ë ╪د┘┘ê╪╕┘è┘┘è╪î ┘┘ê╪╣ ╪د┘╪╣┘à┘╪î ┘à┘é╪▒ ╪د┘╪╣┘à┘╪î ╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë ┘┘┘à╪ج┘ç┘╪î ┘ê╪│┘┘ê╪د╪ز ╪د┘╪«╪ذ╪▒╪ر).", type: "warning" } }));
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
        portfolioRequirement: requiredAttachments.includes("╪▒╪د╪ذ╪╖ ┘à╪╣╪▒╪╢ ╪ث╪╣┘à╪د┘/Portfolio") ? portfolioRequirement : undefined,
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
          portfolioRequirement: requiredAttachments.includes("╪▒╪د╪ذ╪╖ ┘à╪╣╪▒╪╢ ╪ث╪╣┘à╪د┘/Portfolio") ? portfolioRequirement : undefined,
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
    setRequiredAttachments(["╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"]);
    setCustomAttachments([]);

    setType("╪»┘ê╪د┘à ┘â╪د┘à┘");
    setLocation("");
    setExperience("┘╪د ┘è╪┤╪ز╪▒╪╖ ╪«╪ذ╪▒╪ر");
    setQualification("╪س╪د┘┘ê┘è");
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
    setIsAddingRole(true); // Keep the form open for the next role
    setCurrentStep(1); // Go back to Step 1 for the new role

    setRoleToastMessage(editingRoleId ? "╪ز┘à ╪ص┘╪╕ ╪د┘╪ز╪╣╪»┘è┘╪د╪ز ╪ذ┘╪ش╪د╪ص" : "╪ز┘à╪ز ╪ح╪╢╪د┘╪ر ╪د┘╪»┘ê╪▒ ╪ذ┘╪ش╪د╪ص");
    setTimeout(() => setRoleToastMessage(null), 3500);

    // Scroll back to the top of the form smoothly
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };
  const handleRemoveRole = (id: string) => {
    setRoles(roles.filter((r) => r.id !== id));
  };
  const executePublishJob = async () => {
    setShowConfirmModal(false);
    let finalRoles = [...roles];

    let currentCampaignTitle = enableWelcomeUI ? campaignTitle : "";
    let currentCampaignDesc = enableWelcomeUI ? campaignDescription : "";

    if (adType === "campaign" && roleTitle.trim()) {
      const activeRoleData = {
        id: editingRoleId || Math.random().toString(36).substr(2, 9),
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
        portfolioRequirement: requiredAttachments.includes("╪▒╪د╪ذ╪╖ ┘à╪╣╪▒╪╢ ╪ث╪╣┘à╪د┘/Portfolio") ? portfolioRequirement : undefined,
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
      };

      if (editingRoleId) {
        const index = finalRoles.findIndex(r => r.id === editingRoleId);
        if (index >= 0) finalRoles[index] = { ...finalRoles[index], ...activeRoleData };
      } else {
        finalRoles.push(activeRoleData as any);
      }
    }

    if (adType === "single" || createJobType === "quick_link") {
      finalRoles = [
        {
          id: Math.random().toString(36).substr(2, 9),
          title: roleTitle.trim() || "╪┤╪د╪║╪▒ ╪ش╪»┘è╪»",
          description: "",
          roleSummary: roleSummary.trim(),
          responsibilities: responsibilities.trim(),
          qualifications: qualifications.trim(),
          benefits: benefits.trim(),
          aiInstructions: createJobType === "quick_link" ? "" : aiInstructions.trim(),
          skills: createJobType === "quick_link" ? [] : selectedSkills,
          customQuestions: createJobType === "quick_link" ? [] : customQuestions,
          requiredAttachments: createJobType === "quick_link" ? ["╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"] : requiredAttachments,
          portfolioRequirement: createJobType === "quick_link" ? undefined : (requiredAttachments.includes("╪▒╪د╪ذ╪╖ ┘à╪╣╪▒╪╢ ╪ث╪╣┘à╪د┘/Portfolio") ? portfolioRequirement : undefined),
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
    
    if (adType === "campaign" && finalRoles.length > remainingJobs) {
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: `╪╣╪░╪▒╪د┘ï╪î ╪╣╪»╪» ╪د┘┘ê╪╕╪د╪خ┘ ╪د┘┘à╪╖┘┘ê╪ذ╪ر ┘è╪ز╪ش╪د┘ê╪▓ ╪د┘╪ص╪» ╪د┘┘à╪│┘à┘ê╪ص ╪ذ┘ç ┘┘┘ê╪╕╪د╪خ┘ ╪د┘┘╪┤╪╖╪ر (╪د┘┘à╪ز╪ذ┘é┘è: ${remainingJobs} ┘┘é╪╖). ┘è╪▒╪ش┘ë ╪ح╪▓╪د┘╪ر ╪ذ╪╣╪╢ ╪د┘╪ث╪»┘ê╪د╪▒.`, type: "error" } }));
      return;
    }

    if (adType === "campaign" && !enableWelcomeUI && finalRoles.length > 0) {
      currentCampaignTitle = finalRoles[0].title;
    }

    if (adType === "campaign" && !enableWelcomeUI && finalRoles.length > 0) {
      currentCampaignTitle = finalRoles[0].title;
    }
    const currentDateStr = new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });
    const defaultTitle = `╪ح╪╣┘╪د┘ ╪║┘è╪▒ ┘à╪│┘à┘ë - ${currentDateStr}`;
    const mainTitle = (adType === "campaign" ? currentCampaignTitle : roleTitle) || defaultTitle;
    const mainDesc = adType === "campaign" ? currentCampaignDesc : "";
    const baseJobData: Omit<Job, "id" | "applicants" | "status" | "createdAt"> =
    {
      recordType: adType === "single" && createJobType === "quick_link" ? "quick_link" : adType,
      campaignTitle: enableWelcomeUI ? campaignTitle : undefined,
      campaignDescription: enableWelcomeUI ? campaignDescription : undefined,
      title: mainTitle,
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
      location: createJobType === "quick_link" ? "╪║┘è╪▒ ┘à╪ص╪»╪»" : location,
      locations: createJobType === "quick_link" ? [] : locations,
      targetMajors,
      experience: createJobType === "quick_link" ? "╪║┘è╪▒ ┘à╪ص╪»╪»" : experience,
      qualification: createJobType === "quick_link" ? "╪║┘è╪▒ ┘à╪ص╪»╪»" : qualification,
      salaryMin: createJobType === "quick_link" ? undefined : salaryMin,
      salaryMax: createJobType === "quick_link" ? undefined : salaryMax,
      isSalaryHidden: createJobType === "quick_link" ? false : isSalaryHidden,
      askExpectedSalary: createJobType === "quick_link" ? "hidden" : askExpectedSalary,
      expectedSalaryRanges: createJobType === "quick_link" ? [] : expectedSalaryRanges,
      knockoutQuestions: createJobType === "quick_link" ? [] : knockoutQuestions,
      type: createJobType === "quick_link" ? "╪»┘ê╪د┘à ┘â╪د┘à┘" : type,
      types: createJobType === "quick_link" ? ["╪»┘ê╪د┘à ┘â╪د┘à┘"] : types,
      autoRejectCity: createJobType === "quick_link" ? false : autoRejectCity,
      autoRejectQualification: createJobType === "quick_link" ? false : autoRejectQualification,
      autoRejectExperience: createJobType === "quick_link" ? false : autoRejectExperience,
      aiInstructions: createJobType === "quick_link" ? "" : aiInstructions.trim(),
      companyLogo: companyLogo || undefined,
      skills: createJobType === "quick_link" ? [] : selectedSkills,
      languages: selectedLanguages,
      customQuestions: createJobType === "quick_link" ? [] : customQuestions,
      requiredAttachments: createJobType === "quick_link" ? ["╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"] : requiredAttachments,
      directUpload: createJobType === "quick_link" ? false : directUpload,
      requireVoiceInterview: createJobType === "quick_link" ? false : isVoiceEnabled,
      voiceInterviewTemplate: createJobType === "quick_link" ? undefined : voiceInterviewTemplate,
      voiceInterviewQuestions: createJobType === "quick_link" ? undefined : voiceInterviewQuestions,
      photoRequirement: createJobType === "quick_link" ? "optional" : photoRequirement,
      portfolioRequirement: createJobType === "quick_link" ? undefined : (requiredAttachments.includes("╪▒╪د╪ذ╪╖ ┘à╪╣╪▒╪╢ ╪ث╪╣┘à╪د┘/Portfolio") ? portfolioRequirement : undefined),
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

    const isEditing = initialData && initialData.status !== "┘à╪│┘ê╪»╪ر";
    window.dispatchEvent(new CustomEvent("showToast", { detail: isEditing ? "╪ز┘à ╪ز╪ص╪»┘è╪س ╪ذ┘è╪د┘╪د╪ز ╪د┘╪ح╪╣┘╪د┘ ╪ذ┘╪ش╪د╪ص" : "╪ز┘à ┘╪┤╪▒ ╪د┘╪ح╪╣┘╪د┘ ╪ذ┘╪ش╪د╪ص╪î ┘ç┘ê ╪د┘╪ت┘ ┘à╪ز╪د╪ص ┘┘┘à╪ز┘é╪»┘à┘è┘" }));

    const draftId = onSubmit(baseJobData, currentDraftId || undefined);
    if (draftId) {
      setCurrentDraftId(draftId);
    }
  };


  const handleSaveAsDraft = (preventRedirect = false) => {

    let finalRoles = [...roles];

    if (adType === "single" || (adType === "campaign" && roleTitle.trim())) {
      const activeRoleData = {
        id: editingRoleId || Math.random().toString(36).substr(2, 9),
        title: roleTitle.trim() || "╪┤╪د╪║╪▒ ╪ش╪»┘è╪»",
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
      };

      if (editingRoleId) {
        const index = finalRoles.findIndex(r => r.id === editingRoleId);
        if (index >= 0) finalRoles[index] = { ...finalRoles[index], ...activeRoleData };
      } else {
        if (adType === "single") finalRoles = [activeRoleData as any];
        else finalRoles.push(activeRoleData as any);
      }
    }

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
      onSubmit({ ...draftData, status: "┘à╪│┘ê╪»╪ر" } as any, currentDraftId || undefined);
      window.dispatchEvent(new CustomEvent("showToast", { detail: "╪ز┘à ╪ص┘╪╕ ╪د┘┘à╪│┘ê╪»╪ر ╪ذ┘╪ش╪د╪ص" }));
      if (!preventRedirect && typeof onBack === "function") onBack();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isCompanyDataIncomplete = userProfile?.isLoaded && (!userProfile?.commercialRegistration && !userProfile?.freelanceDocument);
    if (isCompanyDataIncomplete && initialData?.status !== "┘à╪│┘ê╪»╪ر") {
      handleSaveAsDraft(true);
      window.dispatchEvent(new CustomEvent('showOnboardingGlobal'));
      return;
    }

    const isMainFormEmpty = !company.trim() || !roleTitle.trim() || !type.trim() || type.includes("╪د╪«╪ز╪▒") || (!location.trim() && locations.length === 0) || !experience.trim() || experience.includes("╪د╪«╪ز╪▒") || !qualification.trim() || qualification.includes("╪د╪«╪ز╪▒");

    if ((adType === "single" || createJobType === "quick_link") && isMainFormEmpty) {
      alert("┘è╪▒╪ش┘ë ╪د┘╪ز╪ث┘â╪» ┘à┘ ╪ز╪╣╪ذ╪خ╪ر ╪د┘╪ص┘é┘ê┘ ╪د┘╪ح┘╪▓╪د┘à┘è╪ر: (╪د╪│┘à ╪د┘╪┤╪▒┘â╪ر╪î ╪د┘┘à╪│┘à┘ë ╪د┘┘ê╪╕┘è┘┘è╪î ┘┘ê╪╣ ╪د┘╪╣┘à┘╪î ┘à┘é╪▒ ╪د┘╪╣┘à┘╪î ╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë ┘┘┘à╪ج┘ç┘╪î ┘ê╪│┘┘ê╪د╪ز ╪د┘╪«╪ذ╪▒╪ر).");
      return;
    }

    if (adType === "campaign" && roles.length === 0) {
      if (isMainFormEmpty) {
        alert("┘è╪▒╪ش┘ë ╪د┘╪ز╪ث┘â╪» ┘à┘ ╪ز╪╣╪ذ╪خ╪ر ╪د┘╪ص┘é┘ê┘ ╪د┘╪ح┘╪▓╪د┘à┘è╪ر: (╪د╪│┘à ╪د┘╪┤╪▒┘â╪ر╪î ╪د┘┘à╪│┘à┘ë ╪د┘┘ê╪╕┘è┘┘è╪î ┘┘ê╪╣ ╪د┘╪╣┘à┘╪î ┘à┘é╪▒ ╪د┘╪╣┘à┘╪î ╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë ┘┘┘à╪ج┘ç┘╪î ┘ê╪│┘┘ê╪د╪ز ╪د┘╪«╪ذ╪▒╪ر) ┘┘╪»┘ê╪▒ ╪د┘┘ê╪╕┘è┘┘è ╪د┘╪ث┘ê┘ ╪╣┘┘ë ╪د┘╪ث┘é┘.");
        return;
      }
      if (enableWelcomeUI && !campaignTitle.trim()) {
        window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "┘è╪▒╪ش┘ë ╪ز╪╣╪ذ╪خ╪ر ╪╣┘┘ê╪د┘ ╪د┘╪ذ┘ê╪د╪ذ╪ر/╪د┘╪ح╪╣┘╪د┘ ╪د┘╪ث╪│╪د╪│┘è ┘┘╪ص┘à┘╪ر.", type: "warning" } }));
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
      alert("┘è╪▒╪ش┘ë ╪ح╪╢╪د┘╪ر ╪»┘ê╪▒ ┘ê╪╕┘è┘┘è ┘ê╪د╪ص╪» ╪╣┘┘ë ╪د┘╪ث┘é┘ ┘┘╪ص┘à┘╪ر");
      return;
    }
    if (!isOpenEnded && endDate && new Date(endDate) <= new Date(startDate)) {
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪ز╪د╪▒┘è╪« ╪د┘╪د┘╪ز┘ç╪د╪ة ┘è╪ش╪ذ ╪ث┘ ┘è┘â┘ê┘ ╪ذ╪╣╪» ╪ز╪د╪▒┘è╪« ╪د┘╪ذ╪»╪ة.", type: "error" } }));
      return;
    }

    setShowConfirmModal(true);
  };
  const showRoleForm = true;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8 pt-24 lg:pt-10">
      {" "}
      <AnimatePresence>

        {showConfirmModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm" style={{ perspective: '1000px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: 20, y: 40 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateX: -20, y: 40 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
              className="bg-white dark:bg-slate-800 rounded-[32px] p-8 max-w-md w-full shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-2xl font-black text-navy dark:text-white text-center mb-4">
                ╪ز╪ث┘â┘è╪» ╪ح┘╪┤╪د╪ة ╪د┘╪ح╪╣┘╪د┘
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-6 font-medium">
                ┘ç┘ ╪ث┘╪ز ┘à╪ز╪ث┘â╪» ┘à┘ ╪▒╪║╪ذ╪ز┘â ┘┘è ╪ح┘╪┤╪د╪ة ┘ê╪╣╪▒╪╢ ┘ç╪░╪د ╪د┘╪ح╪╣┘╪د┘╪ا
              </p>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8 max-h-48 overflow-y-auto">
                <h3 className="font-bold text-navy dark:text-white text-sm mb-3">╪د┘┘à╪│┘à┘è╪د╪ز ╪د┘┘ê╪╕┘è┘┘è╪ر ╪د┘┘à┘╪╢╪د┘╪ر:</h3>
                <ul className="space-y-2">
                  {adType === "single" || createJobType === "quick_link" ? (
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      {roleTitle.trim() || "╪┤╪د╪║╪▒ ╪ش╪»┘è╪»"}
                    </li>
                  ) : (
                    roles.length > 0 ? roles.map((r, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        {r.title || `╪┤╪د╪║╪▒ ╪▒┘é┘à ${i + 1}`}
                      </li>
                    )) : (
                      <li className="text-slate-400 text-sm font-medium">┘┘à ┘è╪ز┘à ╪ح╪╢╪د┘╪ر ╪┤┘ê╪د╪║╪▒ ┘┘╪ص┘à┘╪ر ╪ذ╪╣╪».</li>
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
                  ╪ز╪▒╪د╪ش╪╣
                </button>
                <button
                  type="button"
                  onClick={executePublishJob}
                  className="flex-1 bg-primary text-white px-4 py-3 rounded-xl font-bold shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)] hover:shadow-lg hover:shadow-primary/30 transition-all border-b-4 border-[#0a7a70] active:border-b-0 active:translate-y-1 active:mt-1"
                >
                  ┘╪╣┘à╪î ╪ث┘╪┤╪خ ╪د┘╪ح╪╣┘╪د┘
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
                ╪ز╪║┘è┘è╪▒╪د╪ز ╪║┘è╪▒ ┘à╪ص┘┘ê╪╕╪ر!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium leading-relaxed">
                ┘┘é╪» ┘é┘à╪ز ╪ذ╪ح╪ش╪▒╪د╪ة ╪ز╪║┘è┘è╪▒╪د╪ز. ╪ح╪░╪د ╪║╪د╪»╪▒╪ز ╪د┘╪ت┘╪î ╪│┘è╪ز┘à ┘┘é╪»╪د┘ ╪ش┘à┘è╪╣ ╪د┘╪ذ┘è╪د┘╪د╪ز ╪د┘╪ز┘è ╪ث╪»╪«┘╪ز┘ç╪د.
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
                  ╪ص┘╪╕ ┘â┘à╪│┘ê╪»╪ر ┘ê╪د┘┘à╪║╪د╪»╪▒╪ر
                </button>
                <button
                  type="button"
                  onClick={() => setShowUnsavedModal(false)}
                  className="w-full px-4 py-3.5 rounded-xl font-bold bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  ╪د┘╪ذ┘é╪د╪ة ┘┘è ╪د┘╪╡┘╪ص╪ر
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (typeof onBack === "function") onBack();
                  }}
                  className="w-full px-4 py-3.5 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  ┘à╪║╪د╪»╪▒╪ر ┘ê╪ز╪ش╪د┘ç┘ ╪د┘╪ز╪║┘è┘è╪▒╪د╪ز
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
                <h3 className="text-2xl font-black text-navy dark:text-white">╪ز╪ث┘â┘è╪» ╪د┘╪ص╪░┘</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">┘ç┘ ╪ث┘╪ز ┘à╪ز╪ث┘â╪» ┘à┘ ╪▒╪║╪ذ╪ز┘â ┘┘è ╪ص╪░┘ ┘ç╪░╪د ╪د┘╪»┘ê╪▒╪ا ┘╪د ┘è┘à┘â┘ ╪د┘╪ز╪▒╪د╪ش╪╣ ╪╣┘ ┘ç╪░╪د ╪د┘╪ح╪ش╪▒╪د╪ة.</p>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRoleToDelete(null)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  ╪ح┘╪║╪د╪ة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveRole(roleToDelete);
                    setRoleToDelete(null);
                  }}
                  className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  ╪ص╪░┘ ╪د┘╪»┘ê╪▒
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subtle Banner For Incomplete Company Data */}
      {userProfile?.isLoaded && (!userProfile?.commercialRegistration && !userProfile?.freelanceDocument) && (
        <div className="w-full max-w-[800px] mx-auto px-4 mt-8 mb-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 px-4 py-3 rounded-2xl text-center">
            <p className="text-orange-800 dark:text-orange-300 text-sm md:text-base font-medium flex flex-wrap items-center justify-center gap-2">
              <Info size={18} className="shrink-0" />
              ┘è┘à┘â┘┘â ╪╡┘è╪د╪║╪ر ╪ح╪╣┘╪د┘┘â ╪د┘┘ê╪╕┘è┘┘è ╪د┘╪ت┘ ╪ذ┘â┘ ╪ث╪▒┘è╪ص┘è╪ر. ┘ê┘╪ز╪ز┘à┘â┘ ┘à┘ ┘╪┤╪▒┘ç ┘╪د╪ص┘é╪د┘ï╪î ┘è╪▒╪ش┘ë ╪د╪│╪ز┘â┘à╪د┘ ╪ذ┘è╪د┘╪د╪ز ╪د┘┘â┘è╪د┘ ╪د┘┘é╪د┘┘ê┘┘è.
              <button
                onClick={() => {
                  handleSaveAsDraft(true);
                  window.dispatchEvent(new CustomEvent('showOnboardingGlobal'));
                }}
                className="font-bold underline hover:text-orange-600 dark:hover:text-orange-200 transition-colors"
              >
                (╪د╪│╪ز┘â┘à╪د┘ ╪د┘╪ت┘)
              </button>
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1400px] mx-auto pb-32 flex flex-col lg:flex-row gap-8 px-4 items-start relative">

        {/* Smart Assistant Sidebar */}
        <div className="order-2 lg:order-2 w-full lg:w-[400px] shrink-0 lg:sticky lg:top-8 lg:mt-[68px] bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[500px] lg:h-[650px] z-40">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-navy dark:text-white flex items-center gap-2">
                <Sparkles className="text-primary" size={18} /> ┘à╪│╪ز╪┤╪د╪▒ ╪د┘╪ز┘ê╪╕┘è┘ ╪د┘╪░┘â┘è
              </h3>
              <p className="text-xs text-slate-500 mt-1">┘è╪│╪د╪╣╪»┘â ┘┘è ╪╡┘è╪د╪║╪ر ╪د┘╪ح╪╣┘╪د┘ ┘ê ╪د╪│╪ز╪«╪▒╪د╪ش ╪د┘╪ز┘╪د╪╡┘è┘</p>
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
                placeholder="╪د┘â╪ز╪ذ ╪▒╪│╪د┘╪ز┘â ┘ç┘╪د..."
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
              ╪ز╪╖╪ذ┘è┘é ╪د┘╪ز┘╪د╪╡┘è┘ ╪╣┘┘ë ╪د┘┘┘à┘ê╪░╪ش
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
            ╪د┘╪╣┘ê╪»╪ر ┘┘┘ê╪ص╪ر ╪د┘╪ز╪ص┘â┘à
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >

            {createJobType !== "quick_link" && (
              <div className="mb-1 hidden">
                <div className="flex bg-white dark:bg-slate-800 p-1.5 gap-1.5 rounded-2xl w-full shadow-sm border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleSwitchToSingle}
                    className={`flex items-center justify-center gap-2.5 flex-1 px-8 py-3.5 rounded-xl font-bold text-sm md:text-base whitespace-nowrap transition-all ${adType === "single" ? "bg-primary text-white shadow-md" : "text-slate-500 hover:text-navy dark:hover:text-white"}`}
                  >
                    ╪ح╪╣┘╪د┘ ┘╪┤╪د╪║╪▒ ┘ê╪د╪ص╪»
                  </button>
                  <button
                    type="button"
                    onClick={handleSwitchToMultiple}
                    className={`flex items-center justify-center gap-2.5 flex-1 px-8 py-3.5 rounded-xl font-bold text-sm md:text-base whitespace-nowrap transition-all ${adType === "campaign" ? "bg-primary text-white shadow-md" : "text-slate-500 hover:text-navy dark:hover:text-white"}`}
                  >
                    ╪ح╪╣┘╪د┘ ┘╪╣╪»╪ر ╪┤┘ê╪د╪║╪▒ (╪ص┘à┘╪ر ╪ز┘ê╪╕┘è┘)
                  </button>
                </div>
              </div>
            )}

            <form className="space-y-6" id="createJobForm" onSubmit={handleSubmit}>
              {/* --- STEPPER UI START --- */}
              {createJobType !== "quick_link" && (
                <div className="mb-14 w-full max-w-3xl mx-auto px-4 mt-8">
                  <div className="flex items-center justify-between relative">
                    {/* Stepper Lines */}
                    <div className="absolute top-6 left-[24px] right-[24px] h-[6px] bg-slate-100 dark:bg-slate-800 z-0 rounded-full shadow-inner border border-slate-200/50 dark:border-slate-700/50">
                      <div className="absolute top-0 bottom-0 right-0 bg-gradient-to-l from-teal-300 to-teal-600 z-0 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(13,148,136,0.4)]" style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }} />
                    </div>

                    <div className="flex flex-col items-center relative z-10 cursor-pointer group" onClick={() => setCurrentStep(1)}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-500 relative z-10 ${currentStep === 1 ? 'bg-gradient-to-b from-teal-400 to-teal-600 text-white shadow-[0_8px_16px_rgba(13,148,136,0.3),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.3)] scale-110 border-2 border-white/20' : currentStep > 1 ? 'bg-teal-600 text-white shadow-[0_4px_8px_rgba(13,148,136,0.2),inset_0_-2px_4px_rgba(0,0,0,0.2)]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 shadow-inner'}`}>
                        {currentStep > 1 ? <CheckCircle size={20} className="animate-in zoom-in drop-shadow-md" /> : "1"}
                      </div>
                      <span className={`absolute top-full mt-3 w-max text-[13px] font-black transition-colors ${currentStep === 1 ? 'text-teal-700 dark:text-teal-400 drop-shadow-sm' : currentStep > 1 ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>╪ز┘╪د╪╡┘è┘ ╪د┘╪د╪╣┘╪د┘</span>
                    </div>

                    <div className="flex flex-col items-center relative z-10 cursor-pointer group" onClick={() => { if (currentStep >= 1) setCurrentStep(2) }}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-500 relative z-10 ${currentStep === 2 ? 'bg-gradient-to-b from-teal-400 to-teal-600 text-white shadow-[0_8px_16px_rgba(13,148,136,0.3),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.3)] scale-110 border-2 border-white/20' : currentStep > 2 ? 'bg-teal-600 text-white shadow-[0_4px_8px_rgba(13,148,136,0.2),inset_0_-2px_4px_rgba(0,0,0,0.2)]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 shadow-inner'}`}>
                        {currentStep > 2 ? <CheckCircle size={20} className="animate-in zoom-in drop-shadow-md" /> : "2"}
                      </div>
                      <span className={`absolute top-full mt-3 w-max text-[13px] font-black transition-colors ${currentStep === 2 ? 'text-teal-700 dark:text-teal-400 drop-shadow-sm' : currentStep > 2 ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>┘à╪ز╪╖┘╪ذ╪د╪ز ╪د┘╪ز┘é╪»┘è┘à</span>
                    </div>

                    <div className="flex flex-col items-center relative z-10 cursor-pointer group" onClick={() => { if (currentStep >= 2) setCurrentStep(3) }}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-500 relative z-10 ${currentStep === 3 ? 'bg-gradient-to-b from-teal-400 to-teal-600 text-white shadow-[0_8px_16px_rgba(13,148,136,0.3),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.3)] scale-110 border-2 border-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 shadow-inner'}`}>
                        3
                      </div>
                      <span className={`absolute top-full mt-3 w-max text-[13px] font-black transition-colors ${currentStep === 3 ? 'text-teal-700 dark:text-teal-400 drop-shadow-sm' : 'text-slate-400'}`}>╪د┘╪ز╪د╪▒┘è╪« ┘ê╪د┘┘╪┤╪▒</span>
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
                      ≡اْة ╪ز┘╪ذ┘è┘ç ┘ç╪د┘à ┘┘╪╕╪د┘à ╪د┘┘╪▒╪▓ ╪د┘╪ت┘┘è
                    </h3>
                    <p className="text-cyan-700 dark:text-cyan-300 font-medium text-[13px] leading-relaxed max-w-3xl border-r-2 border-cyan-200 dark:border-cyan-800/50 pr-4">
                      ╪ث╪»╪د╪ر ╪د┘┘╪▒╪▓ ╪د┘╪│╪▒┘è╪╣ ┘à╪╡┘à┘à╪ر ┘╪ح╪╣╪╖╪د╪ة <span className="font-bold bg-cyan-100 dark:bg-cyan-900/50 px-1 rounded">(╪ز┘é┘è┘è┘à ┘à╪ذ╪»╪خ┘è ┘┘à╪»┘ë ╪د┘┘à╪╖╪د╪ذ┘é╪ر)</span> ╪ذ┘╪د╪ة┘ï ╪╣┘┘ë ╪د┘┘é╪▒╪د╪ة╪ر ╪د┘╪│╪╖╪ص┘è╪ر ┘┘╪│┘è╪▒ ╪د┘╪░╪د╪ز┘è╪ر ┘ê╪ز┘ê┘┘è╪▒ ┘ê┘é╪ز┘â.
                      ┘┘╪ص╪╡┘ê┘ ╪╣┘┘ë <strong>┘à╪╖╪د╪ذ┘é╪ر ┘ê╪ز╪ص┘┘è┘ ╪»┘é┘è┘é 100%</strong> ┘┘┘à┘ç╪د╪▒╪د╪ز ╪د┘╪╣┘à┘è┘é╪ر╪î ┘è╪▒╪ش┘ë ╪د╪│╪ز╪«╪»╪د┘à ┘à╪│╪د╪▒ (╪ذ┘ê╪د╪ذ╪ر ╪د┘╪ز┘ê╪╕┘è┘ ╪د┘╪┤╪د┘à┘╪ر).
                    </p>
                  </div>
                </div>
              )}



              {/* Card 1: Basic Info */}
              {createJobType !== "quick_link" && (
                <div className={currentStep === 1 ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
                  <div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-3">
                        <Briefcase className="text-primary" size={24} /> ╪د┘┘à╪╣┘┘ê┘à╪د╪ز ╪د┘╪ث╪│╪د╪│┘è╪ر
                      </h3>
                      {adType === "campaign" && (
                        <span className="bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-xl text-sm">
                          ╪د┘╪┤╪د╪║╪▒ ╪▒┘é┘à {roles.length + 1}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-6">
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
                                      localStorage.setItem("last_used_logo", base64Url);
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
                            <h4 className="font-bold text-navy dark:text-white mb-1">╪┤╪╣╪د╪▒ ╪ش┘ç╪ر ╪د┘╪ز┘ê╪╕┘è┘</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">┘è╪▒┘┘é ┘ç╪░╪د ╪د┘╪┤╪╣╪د╪▒ ┘┘è ╪╡┘╪ص╪ر ╪ز┘╪د╪╡┘è┘ ╪د┘┘ê╪╕┘è┘╪ر</p>
                            <div className="flex items-center gap-4">
                              {companyLogo && (
                                <label className="text-xs font-bold text-primary hover:text-primary/80 cursor-pointer transition-colors">
                                  ╪ز╪║┘è┘è╪▒ ╪د┘╪┤╪╣╪د╪▒
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        const base64Url = reader.result as string;
                                        setCompanyLogo(base64Url);
                                        localStorage.setItem("last_used_logo", base64Url);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }} />
                                </label>
                              )}
                              {companyLogo && (
                                <button type="button" onClick={() => { setCompanyLogo(null); localStorage.removeItem("last_used_logo"); localStorage.removeItem("savedCompanyLogo"); }} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">╪ح╪▓╪د┘╪ر ╪د┘╪┤╪╣╪د╪▒</button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 flex flex-col justify-center">
                          <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                            ╪د╪│┘à ╪د┘╪┤╪▒┘â╪ر / ╪د┘┘╪▒╪╣ <span className="text-red-500">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            value={company}
                            onChange={(e) => {
                              setCompany(e.target.value);
                              localStorage.setItem("last_used_company", e.target.value);
                            }}
                            placeholder="┘à╪س╪د┘: ╪┤╪▒┘â╪ر ╪د┘╪ص┘┘ê┘ ╪د┘╪░┘â┘è╪ر..."
                            className="w-full px-6 py-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-3">
                        <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                          ╪د┘┘à╪│┘à┘ë ╪د┘┘ê╪╕┘è┘┘è (Role) <Sparkles size={14} className="text-primary/70" /> <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={roleTitle}
                          onChange={(e) => setRoleTitle(e.target.value)}
                          placeholder="┘à╪س╪د┘: ┘à┘╪»┘ê╪ذ ┘à╪ذ┘è╪╣╪د╪ز"
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                          ┘à┘é╪▒ ╪د┘╪╣┘à┘ / ╪د┘┘à╪»┘ <span className="text-red-500">*</span>
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
                          placeholder="╪د╪«╪ز╪▒ ╪د┘┘à╪»┘..."
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
                          ┘┘ê╪╣ ╪د┘╪╣┘à┘ <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <SearchableSelect
                            options={["╪»┘ê╪د┘à ┘â╪د┘à┘", "╪»┘ê╪د┘à ╪ش╪▓╪خ┘è", "╪╣┘ ╪ذ╪╣╪»", "╪ز╪»╪▒┘è╪ذ"].filter((c) => !types.includes(c))}
                            value={""}
                            onChange={(val) => {
                              if (val && !types.includes(val)) {
                                setTypes([...types, val]);
                                setType(val); // fallback for older clients if needed
                                if (val === "╪╣┘ ╪ذ╪╣╪»" && !locations.includes("┘╪د ┘è╪┤╪ز╪▒╪╖ / ┘â╪د┘╪ر ╪د┘┘à╪»┘")) {
                                  setLocations([...locations, "┘╪د ┘è╪┤╪ز╪▒╪╖ / ┘â╪د┘╪ر ╪د┘┘à╪»┘"]);
                                }
                              }
                            }}
                            placeholder="╪د╪«╪ز╪▒ ┘┘ê╪╣ ╪د┘╪╣┘à┘..."
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
                                        setTypes(newTypes.length > 0 ? newTypes : ["╪»┘ê╪د┘à ┘â╪د┘à┘"]);
                                        if (newTypes.length > 0) setType(newTypes[0]); else setType("╪»┘ê╪د┘à ┘â╪د┘à┘");
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
                          ╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë ┘┘┘à╪ج┘ç┘ <Sparkles size={14} className="text-primary/70" /> <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none font-medium"
                          >
                            <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘╪د ┘è╪┤╪ز╪▒╪╖ ┘à╪ج┘ç┘</option>
                            <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪س╪د┘┘ê┘è</option>
                            <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪»╪ذ┘┘ê┘à</option>
                            <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪ذ┘â╪د┘┘ê╪▒┘è┘ê╪│</option>
                            <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘à╪د╪ش╪│╪ز┘è╪▒</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                          ╪│┘┘ê╪د╪ز ╪د┘╪«╪ذ╪▒╪ر ╪د┘┘à╪╖┘┘ê╪ذ╪ر <Sparkles size={14} className="text-primary/70" /> <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none font-medium"
                          >
                            <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘╪د ┘è╪┤╪ز╪▒╪╖ ╪«╪ذ╪▒╪ر</option>
                            <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">1-3 ╪│┘┘ê╪د╪ز</option>
                            <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">3-5 ╪│┘┘ê╪د╪ز</option>
                            <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">5+ ╪│┘┘ê╪د╪ز</option>
                          </select>
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="mt-6 space-y-3">
                          <label className="text-sm font-bold text-navy dark:text-white mr-1 block">
                            ┘à┘è╪▓╪د┘┘è╪ر ╪د┘┘ê╪╕┘è┘╪ر / ╪د┘╪▒╪د╪ز╪ذ <span className="text-slate-400 dark:text-slate-500 text-xs font-normal mr-1">(╪د╪«╪ز┘è╪د╪▒┘è)</span>
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-3">
                              <span className="text-xs text-slate-500 font-bold block">╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë</span>
                              <input
                                required={false}
                                type="number"
                                value={salaryMin}
                                onChange={(e) => setSalaryMin(e.target.value)}
                                placeholder="┘à╪س╪د┘: 5000"
                                className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                              />
                            </div>

                            <div className="space-y-3">
                              <span className="text-xs text-slate-500 font-bold block">╪د┘╪ص╪» ╪د┘╪ث╪╣┘┘ë</span>
                              <input
                                type="number"
                                value={salaryMax}
                                onChange={(e) => setSalaryMax(e.target.value)}
                                placeholder="┘à╪س╪د┘: 8000"
                                className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                              />
                            </div>
                          </div>
                          <div className="relative mt-2 flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input type="checkbox" className="sr-only peer" checked={isSalaryHidden} onChange={(e) => setIsSalaryHidden(e.target.checked)} />
                              <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                              <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">╪ح╪«┘╪د╪ة ╪د┘╪▒╪د╪ز╪ذ ╪╣┘ ╪د┘┘à╪ز┘é╪»┘à┘è┘</span>
                            </label>
                          </div>
                          <div className="mt-5 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/80 dark:border-slate-700/80">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                                <Settings size={18} className="text-slate-400" />
                                <span className="text-sm font-bold">╪│╪ج╪د┘ ╪د┘┘à╪ز┘é╪»┘à ╪╣┘ ╪د┘╪▒╪د╪ز╪ذ ╪د┘┘à╪ز┘ê┘é╪╣</span>
                              </div>
                              <div className="relative min-w-[220px]">
                                <select
                                  value={askExpectedSalary}
                                  onChange={(e) => setAskExpectedSalary(e.target.value as any)}
                                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-bold appearance-none cursor-pointer text-slate-700 dark:text-slate-300"
                                >
                                  <option value="hidden">╪╣╪»┘à ╪د┘╪│╪ج╪د┘</option>
                                  <option value="open">╪│╪ج╪د┘ ┘à┘╪ز┘ê╪ص</option>
                                  <option value="ranges">╪«┘è╪د╪▒╪د╪ز ┘à╪ص╪»╪»╪ر</option>
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                  <ChevronDown size={16} />
                                </div>
                              </div>
                            </div>

                            {askExpectedSalary === "ranges" && (
                              <div className="mt-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">┘╪╖╪د┘é╪د╪ز ╪د┘╪▒╪د╪ز╪ذ (╪د╪╢╪║╪╖ Enter ┘┘╪ح╪╢╪د┘╪ر)</label>
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
                                    <span className="text-sm text-slate-400 font-medium py-1.5">┘┘à ┘è╪ز┘à ╪ح╪╢╪د┘╪ر ╪ث┘è ┘╪╖╪د┘é╪د╪ز ╪ذ╪╣╪»...</span>
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
                                        else if (max) rangeStr = `╪ص╪ز┘ë ${max}`;

                                        if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                          setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                          setSalaryRangeMinInput('');
                                          setSalaryRangeMaxInput('');
                                        }
                                      }
                                    }}
                                    placeholder="╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë (┘à╪س╪د┘: 4000)"
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
                                        else if (max) rangeStr = `╪ص╪ز┘ë ${max}`;

                                        if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                          setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                          setSalaryRangeMinInput('');
                                          setSalaryRangeMaxInput('');
                                        }
                                      }
                                    }}
                                    placeholder="╪د┘╪ص╪» ╪د┘╪ث╪╣┘┘ë (┘à╪س╪د┘: 6000)"
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
                                      else if (max) rangeStr = `╪ص╪ز┘ë ${max}`;

                                      if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                        setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                        setSalaryRangeMinInput('');
                                        setSalaryRangeMaxInput('');
                                      }
                                    }}
                                    className="px-4 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                                  >
                                    ╪ح╪╢╪د┘╪ر
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                              <Users className="text-primary" size={24} /> ╪ز┘╪د╪╡┘è┘ ╪د┘╪ث╪»┘ê╪د╪▒ ┘ê╪د┘┘à╪ز╪╖┘╪ذ╪د╪ز
                            </div>
                            <span className="text-xs md:text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold">
                              ╪د┘╪┤╪د╪║╪▒ ╪▒┘é┘à {editingRoleId ? roles.findIndex(r => r.id === editingRoleId) + 1 : roles.length + 1}
                            </span>
                          </h3>
                        )}
                        {adType === "campaign" && (
                          <p className="text-sm font-medium text-gray-500 mb-6 px-1">
                            (╪ز┘╪ذ┘è┘ç: ┘ç╪░┘ç ╪د┘╪ذ┘è╪د┘╪د╪ز ╪ث╪│╪د╪│┘è╪ر ┘╪╣┘à┘ ┘à╪ص╪▒┘â ╪د┘┘╪▒╪▓ ╪ذ╪»┘é╪ر╪î ╪ص╪ز┘ë ┘ê╪ح┘ ╪ز┘à ╪ز┘╪╣┘è┘ ╪«╪د╪╡┘è╪ر ╪د┘╪ز╪«╪╖┘è ┘┘┘à╪ز┘é╪»┘à┘è┘)
                          </p>
                        )}
                        {/* Main Section Heading */}
                        <h3 className="text-xl font-bold text-navy dark:text-white mb-6 mt-8">╪ز┘╪د╪╡┘è┘ ╪د┘╪د╪╣┘╪د┘</h3>

                        {/* AI Override Fields Toggle - Moved to Step 1 */}
                        <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/20 shadow-sm mb-8">
                          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2`}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                <Sparkles size={16} />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-primary">┘à╪╣╪د┘è┘è╪▒ ┘à╪«╪╡╪╡╪ر ┘┘à╪ص╪▒┘â ╪د┘┘╪▒╪▓</h3>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={useAiOverride}
                                onChange={(e) => setUseAiOverride(e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
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
                                    <span>ظأبي╕</span> ╪د╪│╪ز╪«╪»┘à ┘ç╪░┘ç ╪د┘╪ص┘é┘ê┘ ┘┘é╪╖ ╪ح╪░╪د ┘â╪د┘ ┘╪»┘è┘â ╪┤╪▒┘ê╪╖ ┘╪د ╪ز╪▒╪║╪ذ ╪ث┘ ┘è╪▒╪د┘ç╪د ╪د┘┘à╪ز┘é╪»┘à┘ê┘ ┘┘┘ê╪╕┘è┘╪ر. ╪ح╪░╪د ╪ز╪▒┘â╪ز┘ç╪د ┘╪د╪▒╪║╪ر╪î ╪│┘è╪╣╪ز┘à╪» ╪د┘┘╪╕╪د┘à ╪╣┘┘ë ╪د┘┘ê╪╡┘ ╪د┘╪╣╪د┘à ╪ث╪»┘╪د┘ç.
                                  </p>
                                </div>
                                <div className="space-y-6 border-t border-primary/20 pt-6 mt-2">
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2 flex items-center gap-1">┘╪ذ╪░╪ر ╪╣┘ ╪د┘╪»┘ê╪▒ <Sparkles size={14} className="text-primary/70" /></label>
                                    <textarea
                                      value={aiRoleSummary}
                                      onChange={(e) => setAiRoleSummary(e.target.value)}
                                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                                      rows={3}
                                      placeholder="╪د┘â╪ز╪ذ ╪د┘┘à╪╣╪د┘è┘è╪▒ ╪د┘╪»┘é┘è┘é╪ر ┘┘┘╪ذ╪░╪ر ╪╣┘ ╪د┘╪»┘ê╪▒..."
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2 flex items-center gap-1">╪د┘┘à┘ç╪د┘à ┘ê╪د┘┘à╪│╪ج┘ê┘┘è╪د╪ز <Sparkles size={14} className="text-primary/70" /></label>
                                    <textarea
                                      value={aiResponsibilities}
                                      onChange={(e) => setAiResponsibilities(e.target.value)}
                                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                                      rows={4}
                                      placeholder="╪د┘â╪ز╪ذ ╪د┘┘à┘ç╪د┘à ┘ê╪د┘┘à╪│╪ج┘ê┘┘è╪د╪ز ╪د┘┘à╪«╪╡╪╡╪ر ┘┘┘╪▒╪▓..."
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2 flex items-center gap-1">╪د┘┘à╪ج┘ç┘╪د╪ز ┘ê╪د┘┘à╪ز╪╖┘╪ذ╪د╪ز <Sparkles size={14} className="text-primary/70" /></label>
                                    <textarea
                                      value={aiQualifications}
                                      onChange={(e) => setAiQualifications(e.target.value)}
                                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-navy dark:text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                                      rows={4}
                                      placeholder="╪د┘â╪ز╪ذ ╪د┘┘à╪ج┘ç┘╪د╪ز ┘ê╪د┘┘à╪ز╪╖┘╪ذ╪د╪ز ╪د┘┘à╪«╪╡╪╡╪ر ┘┘┘╪▒╪▓..."
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2 flex items-center gap-1">╪د┘╪ز╪«╪╡╪╡╪د╪ز ╪د┘┘à╪│╪ز┘ç╪»┘╪ر <Sparkles size={14} className="text-primary/70" /></label>
                                    <div className="relative">
                                      <input type="text" value={aiCustomMajor} onChange={(e) => setAiCustomMajor(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (aiCustomMajor.trim() && !aiTargetMajors.includes(aiCustomMajor.trim())) { setAiTargetMajors([...aiTargetMajors, aiCustomMajor.trim()]); setAiCustomMajor(""); } } }} placeholder="╪ث╪╢┘ ╪ز╪«╪╡╪╡..." className="w-full pr-4 pl-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:border-primary transition-all font-medium" />
                                      <button type="button" onClick={() => { if (aiCustomMajor.trim() && !aiTargetMajors.includes(aiCustomMajor.trim())) { setAiTargetMajors([...aiTargetMajors, aiCustomMajor.trim()]); setAiCustomMajor(""); } }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all"><Plus size={18} /></button>
                                    </div>
                                    {aiTargetMajors.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {aiTargetMajors.map((major) => (
                                          <button key={major} type="button" onClick={() => setAiTargetMajors(aiTargetMajors.filter(m => m !== major))} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all">{major} <X size={14} /></button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2 flex items-center gap-1">╪د┘┘à┘ç╪د╪▒╪د╪ز ╪د┘┘à╪│╪ز┘ç╪»┘╪ر <Sparkles size={14} className="text-primary/70" /></label>
                                    <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl mb-2">
                                      {aiTargetSkills.length === 0 && <span className="text-sm text-slate-400 dark:text-slate-500 py-2">┘┘à ┘è╪ز┘à ╪د╪«╪ز┘è╪د╪▒ ┘à┘ç╪د╪▒╪د╪ز ╪ذ╪╣╪»...</span>}
                                      {aiTargetSkills.map((skill) => (
                                        <button key={skill} type="button" onClick={() => setAiTargetSkills(aiTargetSkills.filter(s => s !== skill))} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all">{skill} <X size={14} /></button>
                                      ))}
                                    </div>
                                    <div className="relative">
                                      <input type="text" value={aiCustomSkill} onChange={(e) => setAiCustomSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (aiCustomSkill.trim() && !aiTargetSkills.includes(aiCustomSkill.trim())) { setAiTargetSkills([...aiTargetSkills, aiCustomSkill.trim()]); setAiCustomSkill(""); } } }} placeholder="╪ث╪╢┘ ┘à┘ç╪د╪▒╪ر..." className="w-full pr-6 pl-14 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                                      <button type="button" onClick={() => { if (aiCustomSkill.trim() && !aiTargetSkills.includes(aiCustomSkill.trim())) { setAiTargetSkills([...aiTargetSkills, aiCustomSkill.trim()]); setAiCustomSkill(""); } }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary transition-all"><Plus size={20} /></button>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-navy dark:text-white mb-2 flex items-center gap-1">╪د┘┘╪║╪د╪ز ╪د┘┘à╪╖┘┘ê╪ذ╪ر <Sparkles size={14} className="text-primary/70" /></label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {aiLanguages.map((lang) => (
                                        <span key={lang} className="bg-primary text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">{lang}
                                          <button type="button" onClick={() => setAiLanguages(aiLanguages.filter(l => l !== lang))}><X size={12} /></button>
                                        </span>
                                      ))}
                                    </div>
                                    <div className="relative">
                                      <select value="" onChange={(e) => { const val = e.target.value; if (val && !aiLanguages.includes(val)) setAiLanguages([...aiLanguages, val]); }} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary transition-all font-medium appearance-none cursor-pointer">
                                        <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د╪«╪ز╪▒ ┘╪║╪ر ┘╪ح╪╢╪د┘╪ز┘ç╪د...</option>
                                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪╣╪▒╪ذ┘è╪ر">╪د┘╪╣╪▒╪ذ┘è╪ر</option>
                                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر">╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر</option>
                                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘┘╪▒┘╪│┘è╪ر">╪د┘┘╪▒┘╪│┘è╪ر</option>
                                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪ح╪│╪ذ╪د┘┘è╪ر">╪د┘╪ح╪│╪ذ╪د┘┘è╪ر</option>
                                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘┘ç┘╪»┘è╪ر">╪د┘┘ç┘╪»┘è╪ر</option>
                                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪ث┘ê╪▒╪»┘ê">╪د┘╪ث┘ê╪▒╪»┘ê</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* AI Instructions inside useAiOverride */}
                                  <div className="bg-gradient-to-br from-white to-primary/5 dark:from-slate-800 dark:to-primary/10 p-5 rounded-2xl border border-primary/20 border-b-4 dark:border-primary/30 shadow-md shadow-primary/10 mt-8 mb-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Sparkles size={16} />
                                      </div>
                                      <div>
                                        <h3 className="text-base font-bold text-navy dark:text-white flex items-center gap-2 group relative cursor-help w-max">
                                          ╪ز┘ê╪ش┘è┘ç╪د╪ز ╪ح╪╢╪د┘┘è╪ر ┘┘à╪ص╪▒┘â ╪د┘┘╪▒╪▓
                                          <div className="w-[16px] h-[16px] rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold leading-none shrink-0 shadow-sm" style={{ fontFamily: 'monospace' }}>
                                            i
                                          </div>
                                          <div className="absolute bottom-full mb-3 w-80 bg-slate-900 text-white text-xs leading-relaxed font-medium p-4 rounded-xl shadow-2xl shadow-primary/20 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 left-1/2 -translate-x-1/2 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-900">
                                            ┘╪╕╪د┘à ╪د┘┘╪▒╪▓ ┘è┘é┘ê┘à ╪ذ╪ز╪ص┘┘è┘ ╪د┘╪│┘è╪▒ ╪د┘╪░╪د╪ز┘è╪ر ┘ê┘à╪╖╪د╪ذ┘é╪ز┘ç╪د ╪ز┘┘é╪د╪خ┘è╪د┘ï. ╪د╪│╪ز╪«╪»┘à ┘ç╪░╪د ╪د┘╪ص┘é┘ ┘┘╪ز╪▒┘â┘è╪▓ ╪╣┘┘ë ┘à┘ç╪د╪▒╪ر ┘╪د╪»╪▒╪ر ╪ث┘ê ╪┤╪▒┘ê╪╖ ╪«╪د╪╡╪ر ╪ش╪»╪د┘ï ╪«╪د╪▒╪ش ╪د┘┘ê╪╡┘ ╪د┘┘à╪╣╪ز╪د╪».
                                          </div>
                                        </h3>
                                      </div>
                                    </div>
                                    <textarea
                                      required={false}
                                      rows={3}
                                      value={aiInstructions}
                                      onChange={(e) => setAiInstructions(e.target.value)}
                                      placeholder="(╪د┘â╪ز╪ذ ╪ز┘ê╪ش┘è┘ç╪د╪ز┘â ╪د┘╪»┘é┘è┘é╪ر ┘┘à╪ص╪▒┘â ╪د┘┘╪▒╪▓ ┘ç┘╪د...)"
                                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-primary/20 border-b-2 dark:border-primary/30 text-navy dark:text-white dark:placeholder-slate-500 rounded-xl outline-none font-medium resize-none focus:border-primary focus:border-b-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/20 transition-all placeholder:text-[13px] leading-relaxed relative z-10 shadow-sm"
                                    />
                                    <div className="mt-3 flex flex-wrap gap-2 relative z-10">
                                      {[
                                        { label: "+ ╪ح╪╣╪╖╪د╪ة ╪ث┘ê┘┘ê┘è╪ر ┘┘╪«╪ذ╪▒╪ر ╪د┘┘à╪ص┘┘è╪ر", text: "╪▒┘â╪▓ ╪ذ╪┤┘â┘ ╪ث┘â╪ذ╪▒ ╪╣┘┘ë ╪د┘╪«╪ذ╪▒╪ر ╪د┘╪╣┘à┘┘è╪ر ╪»╪د╪«┘ ╪د┘╪│┘ê┘é ╪د┘┘à╪ص┘┘è." },
                                        { label: "+ ╪د┘╪ز╪▒┘â┘è╪▓ ╪╣┘┘ë ╪د┘╪د╪│╪ز┘é╪▒╪د╪▒ ╪د┘┘ê╪╕┘è┘┘è", text: "╪ث╪╣╪╖┘ ╪ث┘ê┘┘ê┘è╪ر ┘┘┘à╪ز┘é╪»┘à┘è┘ ╪د┘╪░┘è┘ ╪ث╪╕┘ç╪▒┘ê╪د ╪د╪│╪ز┘é╪▒╪د╪▒╪د┘ï ┘┘è ┘ê╪╕╪د╪خ┘┘ç┘à ╪د┘╪│╪د╪ذ┘é╪ر ┘ê╪ز╪ش┘╪ذ ╪د┘╪ز┘┘é┘ ╪د┘╪│╪▒┘è╪╣." },
                                        { label: "+ ╪ز┘╪╢┘è┘ ╪د┘╪┤┘ç╪د╪»╪د╪ز ╪د┘┘à┘ç┘┘è╪ر", text: "╪ث╪╣╪╖┘ ┘ê╪▓┘╪د┘ï ╪ث╪╣┘┘ë ┘┘╪┤┘ç╪د╪»╪د╪ز ╪د┘┘à┘ç┘┘è╪ر ╪د┘┘à╪╣╪ز┘à╪»╪ر ┘à┘é╪د╪▒┘╪ر ╪ذ╪د┘╪┤┘ç╪د╪»╪د╪ز ╪د┘╪ث┘â╪د╪»┘è┘à┘è╪ر ╪د┘╪ذ╪ص╪ز╪ر." },
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
                                          className="text-[11px] px-3 py-1.5 rounded-full bg-primary/5 dark:bg-primary/10 text-primary font-bold hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors border border-primary/20 dark:border-primary/30"
                                        >
                                          {suggestion.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {useAiOverride ? (
                          <p className="text-sm text-amber-600 dark:text-amber-500 mb-6 font-bold">
                            ╪│┘è┘é┘ê┘à ┘à╪ص╪▒┘â ╪د┘┘╪▒╪▓ ╪ذ╪ز╪ص┘┘è┘ ╪د┘┘à╪▒╪┤╪ص┘è┘ ╪ذ┘╪د╪ة┘ï ╪╣┘┘ë <span className="text-primary">┘à╪╣╪د┘è┘è╪▒ ┘à╪ص╪▒┘â ╪د┘┘╪▒╪▓ ╪د┘┘à╪«╪╡╪╡╪ر</span> ╪د┘╪ز┘è ╪ز┘à ╪ز┘╪╣┘è┘┘ç╪د╪î ┘ê╪│┘è╪ز╪ش╪د┘ç┘ ╪د┘┘à╪╣┘┘ê┘à╪د╪ز ╪ذ╪د┘╪ث╪│┘┘.
                          </p>
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                            ≡اْة ╪│┘è┘é┘ê┘à ┘à╪ص╪▒┘â ╪د┘┘╪▒╪▓ ╪ذ┘é╪▒╪د╪ة╪ر ╪د┘┘ê╪╡┘ ╪د┘╪╣╪د┘à ╪ث╪»┘╪د┘ç ┘ê┘╪▒╪▓ ╪د┘╪│┘è╪▒ ╪د┘╪░╪د╪ز┘è╪ر ╪ذ┘╪د╪ة┘ï ╪╣┘┘è┘ç ╪ز┘┘é╪د╪خ┘è╪د┘ï
                          </p>
                        )}

                        {/* Welcome UI removed as requested */}

                        {/* Fields moved to Basic Information section */}

                        <div className="mt-6 space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">╪د┘╪ز╪«╪╡╪╡╪د╪ز ╪د┘┘à╪│╪ز┘ç╪»┘╪ر {!useAiOverride && <Sparkles size={14} className="text-primary/70" />} <span className="text-slate-400 font-normal ml-1 text-xs">(╪د╪«╪ز┘è╪د╪▒┘è)</span>
                              <span className="relative group inline-flex items-center ml-1">
                                <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                                <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                  ╪د╪ز╪▒┘â ┘ç╪░╪د ╪د┘╪ص┘é┘ ┘╪د╪▒╪║╪د┘ï ╪ح╪░╪د ┘â╪د┘╪ز ╪د┘┘ê╪╕┘è┘╪ر ╪ز┘é╪ذ┘ ╪ش┘à┘è╪╣ ╪د┘╪ز╪«╪╡╪╡╪د╪ز ┘╪ز┘ê╪│┘è╪╣ ┘╪╖╪د┘é ╪د┘┘à╪ز┘é╪»┘à┘è┘ ┘┘è ┘╪╕╪د┘à ╪د┘┘╪▒╪▓ ╪د┘╪ت┘┘è.
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
                                    .split(/[,\n╪ؤ╪î]/)
                                    .map(m => m.trim())
                                    .filter(m => m.length > 0 && !targetMajors.includes(m));
                                  if (newMajors.length > 0) {
                                    setTargetMajors(prev => [...prev, ...newMajors]);
                                  }
                                }
                              }}
                              placeholder="┘à╪س╪د┘: ┘ç┘╪»╪│╪ر ╪ذ╪▒┘à╪ش┘è╪د╪ز╪î ╪ز╪│┘ê┘è┘é..."
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
                                  ┘╪ذ╪░╪ر ╪╣┘ ╪د┘╪»┘ê╪▒ {!useAiOverride && <Sparkles size={14} className="text-primary/70" />}
                                  <span className="relative group inline-flex items-center ml-1">
                                    <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                                    <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                      ╪ز╪▒┘â ┘ç╪░╪د ╪د┘╪ص┘é┘ ┘╪د╪▒╪║╪د┘ï ╪│┘è╪ش╪╣┘ ┘à╪ص╪▒┘â ┘╪╕╪د┘à ╪د┘┘╪▒╪▓ ┘è╪╣╪ز┘à╪» ╪╣┘┘ë ╪د┘┘à╪╣╪د┘è┘è╪▒ ╪د┘┘é┘è╪د╪│┘è╪ر ┘┘┘à╪│┘à┘ë ╪د┘┘ê╪╕┘è┘┘è. ┘╪ز┘é┘è┘è┘à ╪ث╪»┘é╪î ╪ث╪╢┘ ┘╪ذ╪░╪ر ┘à╪«╪ز╪╡╪▒╪ر.
                                      <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                                    </div>
                                  </span>
                                </label>
                              </div>
                              <textarea
                                rows={3}
                                value={roleSummary}
                                onChange={(e) => setRoleSummary(e.target.value)}
                                placeholder="┘à╪س╪د┘: ┘╪ذ╪ص╪س ╪╣┘ ┘à┘ê╪╕┘ ╪╖┘à┘ê╪ص ┘╪ح╪»╪د╪▒╪ر ╪╣┘╪د┘é╪د╪ز ╪د┘╪╣┘à┘╪د╪ة ┘┘è ┘╪▒╪╣┘╪د ╪د┘╪▒╪خ┘è╪│┘è..."
                                className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                              />

                            </div>
                          </div>


                          <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                                ╪د┘┘à┘ç╪د┘à ┘ê╪د┘┘à╪│╪ج┘ê┘┘è╪د╪ز {!useAiOverride && <Sparkles size={14} className="text-primary/70" />}
                                <span className="relative group inline-flex items-center ml-1">
                                  <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                                  <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                    ┘è┘╪╢┘ ╪ح╪╢╪د┘╪ز┘ç╪د ┘┘è ╪┤┘â┘ ┘┘é╪د╪╖ ┘┘┘ê╪╕╪د╪خ┘ ╪د┘╪ح╪»╪د╪▒┘è╪ر ╪ث┘ê ╪د┘┘à╪ز╪«╪╡╪╡╪ر ┘╪▒┘╪╣ ╪»┘é╪ر ┘à╪╖╪د╪ذ┘é╪ر ┘╪╕╪د┘à ╪د┘┘╪▒╪▓ ╪د┘╪ت┘┘è.
                                    <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                                  </div>
                                </span>
                              </label>
                            </div>
                            <textarea onPaste={(e) => handleTextAreaPaste(e, setResponsibilities, responsibilities)}
                              rows={4}
                              value={responsibilities}
                              onChange={(e) => setResponsibilities(e.target.value)}
                              placeholder="┘à╪س╪د┘: - ╪ز╪ص┘é┘è┘é ╪ث┘ç╪»╪د┘ ╪د┘┘à╪ذ┘è╪╣╪د╪ز ╪د┘╪┤┘ç╪▒┘è╪ر. - ╪ح╪╣╪»╪د╪» ╪ز┘é╪د╪▒┘è╪▒ ╪د┘╪ث╪»╪د╪ة..."
                              className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                            />

                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                                ╪د┘┘à╪ج┘ç┘╪د╪ز ┘ê╪د┘┘à╪ز╪╖┘╪ذ╪د╪ز {!useAiOverride && <Sparkles size={14} className="text-primary/70" />}
                                <span className="relative group inline-flex items-center ml-1">
                                  <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                                  <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                    ╪ث╪╢┘ ╪د┘┘à╪ج┘ç┘╪د╪ز ╪د┘╪ث╪│╪د╪│┘è╪ر ╪د┘┘à╪╖┘┘ê╪ذ╪ر ┘┘è╪ز┘à ╪ث╪«╪░┘ç╪د ╪ذ╪╣┘è┘ ╪د┘╪د╪╣╪ز╪ذ╪د╪▒ ┘┘è ┘╪╕╪د┘à ╪د┘┘╪▒╪▓ ╪د┘╪ت┘┘è.
                                    <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                                  </div>
                                </span>
                              </label>
                            </div>
                            <textarea

                              rows={4}
                              value={qualifications}
                              onChange={(e) => setQualifications(e.target.value)}
                              placeholder="┘à╪س╪د┘: ╪«╪ذ╪▒╪ر ┘╪د ╪ز┘é┘ ╪╣┘ 3 ╪│┘┘ê╪د╪ز ┘┘è ┘à╪ذ┘è╪╣╪د╪ز ╪د┘╪ز╪ش╪▓╪خ╪ر╪î ╪ح╪ش╪د╪»╪ر ╪د╪│╪ز╪«╪»╪د┘à ╪ث┘╪╕┘à╪ر CRM..."
                              className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                            />
                          </div>

                          {createJobType !== "quick_link" && (
                            <>
                              <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700/60 mt-8">
                                {" "}
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">
                                    ╪د┘┘à┘ç╪د╪▒╪د╪ز ╪د┘┘à╪│╪ز┘ç╪»┘╪ر {!useAiOverride && <Sparkles size={14} className="text-primary/70" />}
                                    <span className="relative group inline-flex items-center ml-1">
                                      <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                                      <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                        ╪ز╪ص╪»┘è╪» ╪د┘┘à┘ç╪د╪▒╪د╪ز ╪د┘╪ز┘é┘┘è╪ر ╪د┘╪»┘é┘è┘é╪ر ┘è╪ش╪╣┘ ┘╪╕╪د┘à ╪د┘┘╪▒╪▓ ╪د┘╪ت┘┘è ╪ث┘â╪س╪▒ ╪╡╪▒╪د┘à╪ر ┘ê╪»┘é╪ر.
                                        <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                                      </div>
                                    </span>
                                  </label>
                                </div>{" "}
                                <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl">
                                  {" "}
                                  {selectedSkills.length === 0 && (
                                    <span className="text-sm text-slate-400 dark:text-slate-500 py-2">
                                      ┘╪د ╪ز┘ê╪ش╪» ┘à┘ç╪د╪▒╪د╪ز.
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
                                      <Sparkles size={14} /> ╪د┘é╪ز╪▒╪د╪ص╪د╪ز ╪░┘â┘è╪ر:{" "}
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
                                          .split(/[,\n╪î]/)
                                          .map(s => s.trim())
                                          .filter(s => s.length > 0 && !selectedSkills.includes(s));
                                        if (newSkills.length > 0) {
                                          setSelectedSkills(prev => [...prev, ...newSkills]);
                                        }
                                      }
                                    }}
                                    placeholder="╪ث╪╢┘ ┘à┘ç╪د╪▒╪ر..."
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
                                      ╪د┘┘╪║╪د╪ز ╪د┘┘à╪╖┘┘ê╪ذ╪ر {!useAiOverride && <Sparkles size={14} className="text-primary/70" />} <span className="text-slate-400 font-normal ml-1">(╪د╪«╪ز┘è╪د╪▒┘è)</span>
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
                                      <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د╪«╪ز╪▒ ┘╪║╪ر ┘╪ح╪╢╪د┘╪ز┘ç╪د...</option>
                                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪╣╪▒╪ذ┘è╪ر">╪د┘╪╣╪▒╪ذ┘è╪ر</option>
                                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر">╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر</option>
                                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘┘╪▒┘╪│┘è╪ر">╪د┘┘╪▒┘╪│┘è╪ر</option>
                                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪ح╪│╪ذ╪د┘┘è╪ر">╪د┘╪ح╪│╪ذ╪د┘┘è╪ر</option>
                                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘┘ç┘╪»┘è╪ر">╪د┘┘ç┘╪»┘è╪ر</option>
                                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪ث┘ê╪▒╪»┘ê">╪د┘╪ث┘ê╪▒╪»┘ê</option>
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
                                ╪د┘┘à┘à┘è╪▓╪د╪ز <span className="text-slate-400 font-normal text-xs ml-1">(╪د╪«╪ز┘è╪د╪▒┘è)</span>
                              </label>
                            </div>
                            <textarea onPaste={(e) => handleTextAreaPaste(e, setBenefits, benefits)}
                              rows={3}
                              value={benefits}
                              onChange={(e) => setBenefits(e.target.value)}
                              placeholder="┘à╪س╪د┘: ╪ز╪ث┘à┘è┘ ╪╖╪ذ┘è ┘╪خ╪ر A╪î ╪╣┘à┘ê┘╪د╪ز ┘à╪ذ┘è╪╣╪د╪ز ╪ز╪╡┘ ╪ح┘┘ë 10%╪î ╪│┘è╪د╪▒╪ر..."
                              className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none font-medium resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all leading-relaxed"
                            />
                          </div>
                        </div>

                        {createJobType !== "quick_link" && !useAiOverride && (
                          <div className="bg-gradient-to-br from-white to-primary/5 dark:from-slate-800 dark:to-primary/10 p-5 rounded-2xl border border-primary/20 border-b-4 dark:border-primary/30 shadow-md shadow-primary/10 mt-8 mb-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                <Sparkles size={16} />
                              </div>
                              <div>
                                <h3 className="text-base font-bold text-navy dark:text-white flex items-center gap-2 group relative cursor-help w-max">
                                  ╪ز┘ê╪ش┘è┘ç╪د╪ز ╪ح╪╢╪د┘┘è╪ر ┘┘à╪ص╪▒┘â ╪د┘┘╪▒╪▓
                                  <div className="w-[16px] h-[16px] rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold leading-none shrink-0 shadow-sm" style={{ fontFamily: 'monospace' }}>
                                    i
                                  </div>
                                  <div className="absolute bottom-full mb-3 w-80 bg-slate-900 text-white text-xs leading-relaxed font-medium p-4 rounded-xl shadow-2xl shadow-primary/20 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 left-1/2 -translate-x-1/2 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-900">
                                    ┘╪╕╪د┘à ╪د┘┘╪▒╪▓ ┘è┘é┘ê┘à ╪ذ╪ز╪ص┘┘è┘ ╪د┘╪│┘è╪▒ ╪د┘╪░╪د╪ز┘è╪ر ┘ê┘à╪╖╪د╪ذ┘é╪ز┘ç╪د ╪ز┘┘é╪د╪خ┘è╪د┘ï. ╪د╪│╪ز╪«╪»┘à ┘ç╪░╪د ╪د┘╪ص┘é┘ ┘┘╪ز╪▒┘â┘è╪▓ ╪╣┘┘ë ┘à┘ç╪د╪▒╪ر ┘╪د╪»╪▒╪ر ╪ث┘ê ╪┤╪▒┘ê╪╖ ╪«╪د╪╡╪ر ╪ش╪»╪د┘ï ╪«╪د╪▒╪ش ╪د┘┘ê╪╡┘ ╪د┘┘à╪╣╪ز╪د╪».
                                  </div>
                                </h3>
                              </div>
                            </div>
                            <textarea
                              required={false}
                              rows={3}
                              value={aiInstructions}
                              onChange={(e) => setAiInstructions(e.target.value)}
                              placeholder="(╪د┘â╪ز╪ذ ╪ز┘ê╪ش┘è┘ç╪د╪ز┘â ╪د┘╪»┘é┘è┘é╪ر ┘┘à╪ص╪▒┘â ╪د┘┘╪▒╪▓ ┘ç┘╪د...)"
                              className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-primary/20 border-b-2 dark:border-primary/30 text-navy dark:text-white dark:placeholder-slate-500 rounded-xl outline-none font-medium resize-none focus:border-primary focus:border-b-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/20 transition-all placeholder:text-[13px] leading-relaxed relative z-10 shadow-sm"
                            />
                            <div className="mt-3 flex flex-wrap gap-2 relative z-10">
                              {[
                                { label: "+ ╪ح╪╣╪╖╪د╪ة ╪ث┘ê┘┘ê┘è╪ر ┘┘╪«╪ذ╪▒╪ر ╪د┘┘à╪ص┘┘è╪ر", text: "╪▒┘â╪▓ ╪ذ╪┤┘â┘ ╪ث┘â╪ذ╪▒ ╪╣┘┘ë ╪د┘╪«╪ذ╪▒╪ر ╪د┘╪╣┘à┘┘è╪ر ╪»╪د╪«┘ ╪د┘╪│┘ê┘é ╪د┘┘à╪ص┘┘è." },
                                { label: "+ ╪د┘╪ز╪▒┘â┘è╪▓ ╪╣┘┘ë ╪د┘╪د╪│╪ز┘é╪▒╪د╪▒ ╪د┘┘ê╪╕┘è┘┘è", text: "╪ث╪╣╪╖┘ ╪ث┘ê┘┘ê┘è╪ر ┘┘┘à╪ز┘é╪»┘à┘è┘ ╪د┘╪░┘è┘ ╪ث╪╕┘ç╪▒┘ê╪د ╪د╪│╪ز┘é╪▒╪د╪▒╪د┘ï ┘┘è ┘ê╪╕╪د╪خ┘┘ç┘à ╪د┘╪│╪د╪ذ┘é╪ر ┘ê╪ز╪ش┘╪ذ ╪د┘╪ز┘┘é┘ ╪د┘╪│╪▒┘è╪╣." },
                                { label: "+ ╪ز┘╪╢┘è┘ ╪د┘╪┤┘ç╪د╪»╪د╪ز ╪د┘┘à┘ç┘┘è╪ر", text: "╪ث╪╣╪╖┘ ┘ê╪▓┘╪د┘ï ╪ث╪╣┘┘ë ┘┘╪┤┘ç╪د╪»╪د╪ز ╪د┘┘à┘ç┘┘è╪ر ╪د┘┘à╪╣╪ز┘à╪»╪ر ┘à┘é╪د╪▒┘╪ر ╪ذ╪د┘╪┤┘ç╪د╪»╪د╪ز ╪د┘╪ث┘â╪د╪»┘è┘à┘è╪ر ╪د┘╪ذ╪ص╪ز╪ر." },
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
                                  className="text-[11px] px-3 py-1.5 rounded-full bg-primary/5 dark:bg-primary/10 text-primary font-bold hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors border border-primary/20 dark:border-primary/30"
                                >
                                  {suggestion.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}



                        {createJobType !== "quick_link" && (
                          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">╪د┘╪ز╪د┘┘è <ArrowLeft size={18} /></button>
                          </div>
                        )}
                      </>
                    )}

                    {currentStep === 2 && (
                      <>
                        {adType === "campaign" && (
                          <div className="flex items-center justify-end mb-2">
                            <span className="bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-xl text-sm">
                              ╪د┘╪┤╪د╪║╪▒ ╪▒┘é┘à {editingRoleId ? roles.findIndex(r => r.id === editingRoleId) + 1 : roles.length + 1}
                            </span>
                          </div>
                        )}
                        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/60 flex flex-col gap-6">

                          {/* Basic Attachments Section */}
                          <div>
                            <label className="text-sm font-bold text-navy dark:text-white mb-4 block flex items-center gap-2">
                              ╪د┘┘à╪▒┘┘é╪د╪ز ╪د┘╪ث╪│╪د╪│┘è╪ر ╪د┘┘à╪╖┘┘ê╪ذ╪ر
                            </label>
                            <div className="grid grid-cols-1 gap-4">
                              {" "}
                              {[
                                { id: "╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF", title: "┘à┘┘ ╪د┘╪│┘è╪▒╪ر ╪د┘╪░╪د╪ز┘è╪ر", subtitle: "(┘è┘┘é╪ذ┘ ┘à┘┘╪د╪ز PDF ┘ê DOCX ┘┘é╪╖)" }
                              ].map((opt) => (
                                <div key={opt.id} className="relative">
                                  <label
                                    className={`flex flex-col items-center justify-center text-center gap-1 p-4 h-full rounded-2xl border cursor-pointer transition-all ${requiredAttachments.includes(opt.id) ? "bg-primary/5 border-primary text-primary" : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-navy dark:text-white dark:bg-slate-800/50 dark:hover:bg-slate-700 dark:border-slate-700"}`}
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
                                    ╪د┘┘à╪▒┘┘é╪د╪ز ╪د┘┘à╪«╪╡╪╡╪ر - ╪د╪«╪ز┘è╪د╪▒┘è
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
                                            ╪ح╪╢╪د┘╪ر ┘à╪▒┘┘é╪د╪ز ┘à╪«╪╡╪╡╪ر ╪ش╪»┘è╪»╪ر
                                          </label>{" "}
                                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                            ╪ث╪╢┘ ┘à╪▒┘┘é╪د╪ز ╪ح╪╢╪د┘┘è╪ر ╪║┘è╪▒ ╪د┘┘à╪░┘â┘ê╪▒╪ر ╪ث╪╣┘╪د┘ç (╪د╪«╪ز┘è╪د╪▒┘è)
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
                                                    ╪د┘┘┘ê╪╣:{" "}
                                                    {att.attachment_type === "file" ? "┘à┘┘ PDF" : att.attachment_type === "mixed_file" ? "┘à╪│╪ز┘╪» ╪ث┘ê ╪╡┘ê╪▒╪ر (PDF/JPG)"
                                                      : att.attachment_type === "link"
                                                        ? "╪▒╪د╪ذ╪╖ Link"
                                                        : att.attachment_type === "image"
                                                          ? "╪╡┘ê╪▒╪ر (Image - JPG/PNG)"
                                                          : att.attachment_type === "video"
                                                            ? "┘┘è╪»┘è┘ê ┘é╪╡┘è╪▒ (Video - MP4)"
                                                            : "┘à╪│╪ز┘╪»╪د╪ز ╪ث╪«╪▒┘ë (Word / Excel)"}
                                                  </span>{" "}
                                                  <span className="text-slate-300">ظت</span>
                                                  <span className={att.required ? "text-red-500 text-xs font-medium" : "text-slate-400 text-xs font-medium"}>
                                                    {att.required ? "╪ح┘╪▓╪د┘à┘è" : "╪د╪«╪ز┘è╪د╪▒┘è"}
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
                                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 self-center ml-2">╪ح╪╢╪د┘╪د╪ز ╪│╪▒┘è╪╣╪ر:</span>
                                          <button type="button" onClick={() => { setCustomAttachments(prev => [...prev, { attachment_name: "╪د┘╪╡┘ê╪▒╪ر ╪د┘╪┤╪«╪╡┘è╪ر", attachment_type: "image", required: newAttachmentRequired }]); setNewAttachmentRequired(false); }} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-600 flex items-center gap-1"><Plus size={14} /> ╪د┘╪╡┘ê╪▒╪ر ╪د┘╪┤╪«╪╡┘è╪ر</button>
                                          <button type="button" onClick={() => { setCustomAttachments(prev => [...prev, { attachment_name: "╪▒╪«╪╡╪ر ╪د┘┘é┘è╪د╪»╪ر", attachment_type: "mixed_file", required: newAttachmentRequired }]); setNewAttachmentRequired(false); }} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-600 flex items-center gap-1"><Plus size={14} /> ╪▒╪«╪╡╪ر ╪د┘┘é┘è╪د╪»╪ر</button>
                                          <button type="button" onClick={() => { setCustomAttachments(prev => [...prev, { attachment_name: "╪╡┘ê╪▒╪ر ╪د┘┘ç┘ê┘è╪ر", attachment_type: "mixed_file", required: newAttachmentRequired }]); setNewAttachmentRequired(false); }} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-600 flex items-center gap-1"><Plus size={14} /> ╪╡┘ê╪▒╪ر ╪د┘┘ç┘ê┘è╪ر</button>
                                          <button type="button" onClick={() => { setCustomAttachments(prev => [...prev, { attachment_name: "╪▒╪د╪ذ╪╖ ┘à╪╣╪▒╪╢ ╪د┘╪ث╪╣┘à╪د┘", attachment_type: "link", required: newAttachmentRequired }]); setNewAttachmentRequired(false); }} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-600 flex items-center gap-1"><Plus size={14} /> ╪▒╪د╪ذ╪╖ ┘à╪╣╪▒╪╢ ╪د┘╪ث╪╣┘à╪د┘</button>
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
                                              ╪ح╪▒┘╪د┘é ╪ح┘╪▓╪د┘à┘è
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
                                            placeholder="╪د╪│┘à ╪د┘┘à╪▒┘┘é (┘à╪س╪د┘: ╪▒╪«╪╡╪ر)..."
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
                                                (╪ص╪»╪» ╪د┘╪╡┘è╪║╪ر ╪د┘┘à╪╖┘┘ê╪ذ╪ر)
                                              </option>
                                              <option value="file" className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘à┘┘ PDF</option>
                                              <option value="mixed_file" className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘à╪│╪ز┘╪» ╪ث┘ê ╪╡┘ê╪▒╪ر (PDF / JPG / PNG)</option>{" "}
                                              <option value="link" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪▒╪د╪ذ╪╖ Link</option>{" "}
                                              <option value="image" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪╡┘ê╪▒╪ر (Image - JPG/PNG)</option>{" "}
                                              <option value="video" className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘┘è╪»┘è┘ê ┘é╪╡┘è╪▒ (Video - MP4)</option>{" "}
                                              <option value="document" className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘à╪│╪ز┘╪»╪د╪ز ╪ث╪«╪▒┘ë (Word / Excel)</option>{" "}
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
                                            <Plus size={20} strokeWidth={2.5} /> ╪ح╪╢╪د┘╪ر ╪د┘┘à╪▒┘┘é{" "}
                                          </button>{" "}
                                        </div>{" "}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>


                            {/* Knockout Questions Accordion */}
                            <div className={`border-2 border-red-100 dark:border-red-900/30 rounded-2xl bg-red-50/50 dark:bg-red-900/10 mb-6 ${isKnockoutExpanded ? 'overflow-visible' : 'overflow-hidden'}`}>
                              <button
                                type="button"
                                onClick={() => setIsKnockoutExpanded(!isKnockoutExpanded)}
                                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-transparent transition-all group outline-none"
                              >
                                <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                                  <Ban size={18} /> ╪ث╪│╪خ┘╪ر ╪د┘╪د╪│╪ز╪ذ╪╣╪د╪» ╪د┘╪ز┘┘é╪د╪خ┘è (╪د╪«╪ز┘è╪د╪▒┘è)
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
                                          (╪د╪│╪ز╪«╪»┘à ┘ç╪░╪د ╪د┘┘é╪│┘à ┘┘╪د╪│╪ز╪ذ╪╣╪د╪» ╪د┘┘┘ê╪▒┘è ┘┘┘à╪ز┘é╪»┘à┘è┘ ╪║┘è╪▒ ╪د┘┘à╪╖╪د╪ذ┘é┘è┘ ┘┘╪┤╪▒┘ê╪╖ ╪د┘╪ص╪ز┘à┘è╪ر. ┘è┘à┘â┘┘â ╪ز╪▒┘â┘ç ┘╪د╪▒╪║╪د┘ï ┘╪ز┘é┘è┘è┘à ╪ش┘à┘è╪╣ ╪د┘┘à╪ز┘é╪»┘à┘è┘ ╪╣╪ذ╪▒ ┘╪╕╪د┘à ╪د┘┘╪▒╪▓ ╪د┘╪ت┘┘è).
                                        </p>
                                        <label className="text-sm font-bold text-navy dark:text-white mr-1 block">
                                          ╪ح╪╢╪د┘╪ر ╪│╪ج╪د┘ ╪د╪│╪ز╪ذ╪╣╪د╪»
                                        </label>
                                      </div>
                                      <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                        {!["nationality", "city", "education", "experience", "availability", "languages", "age_condition"].includes(newKqType) && (
                                          <input
                                            type="text"
                                            value={newKqText}
                                            onChange={(e) => setNewKqText(e.target.value)}
                                            placeholder="┘╪╡ ╪د┘╪│╪ج╪د┘ (┘à╪س╪د┘: ┘ç┘ ╪ث┘╪ز ╪│╪╣┘ê╪»┘è ╪د┘╪ش┘╪│┘è╪ر╪ا)"
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none focus:border-red-400 transition-all font-medium text-sm"
                                          />
                                        )}
                                        <div className={`grid ${["nationality", "city", "education", "experience", "availability", "languages", "age_condition"].includes(newKqType) ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2"} gap-4`}>
                                          <select
                                            value={newKqType}
                                            onChange={(e) => {
                                              const val = e.target.value as "yes_no" | "options" | "age_condition" | "nationality" | "city" | "education" | "experience" | "availability" | "languages";
                                              setNewKqType(val);
                                              if (val === "yes_no") {
                                                setNewKqRequiredAnswer("┘╪╣┘à");
                                              } else if (val === "nationality") {
                                                setNewKqRequiredAnswer("");
                                              } else if (val === "city") {
                                                setNewKqRequiredAnswer("");
                                              } else if (val === "education" || val === "experience") {
                                                setNewKqRequiredAnswer("");
                                              } else if (val === "availability" || val === "languages") {
                                                setNewKqRequiredAnswer("");
                                              } else {
                                                setNewKqRequiredAnswer(newKqOptions[0] || "");
                                              }
                                            }}
                                            className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none font-medium text-sm appearance-none"
                                          >
                                            <option value="yes_no" className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘╪╣┘à / ┘╪د</option>
                                            <option value="options" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪«┘è╪د╪▒╪د╪ز ┘à╪ز╪╣╪»╪»╪ر</option>
                                            <option value="age_condition" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪┤╪▒╪╖ ╪د┘╪╣┘à╪▒</option>
                                            <option value="nationality" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ش┘╪│┘è╪د╪ز ╪د┘┘à┘é╪ذ┘ê┘╪ر</option>
                                            <option value="city" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘┘à╪»┘ ╪د┘┘à┘é╪ذ┘ê┘╪ر</option>
                                            <option value="education" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë ┘┘┘à╪ج┘ç┘</option>
                                            <option value="experience" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë ┘╪│┘┘ê╪د╪ز ╪د┘╪«╪ذ╪▒╪ر</option>
                                            <option value="availability" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ص╪» ╪د┘╪ث┘é╪╡┘ë ┘┘à╪»╪ر ╪د┘╪د┘╪╢┘à╪د┘à</option>
                                            <option value="languages" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘┘╪║╪د╪ز ╪د┘┘à╪╖┘┘ê╪ذ╪ر</option>
                                          </select>

                                          {newKqType === "age_condition" ? (
                                            <div className="md:col-span-2 flex items-center gap-4">
                                              <input
                                                type="number"
                                                placeholder="╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë (┘à╪╖┘┘ê╪ذ)"
                                                value={newKqMinAge}
                                                onChange={(e) => setNewKqMinAge(e.target.value ? Number(e.target.value) : "")}
                                                className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm"
                                              />
                                              <input
                                                type="number"
                                                placeholder="╪د┘╪ص╪» ╪د┘╪ث╪╣┘┘ë (╪د╪«╪ز┘è╪د╪▒┘è)"
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
                                                placeholder="╪د╪«╪ز╪▒ ╪د┘╪ش┘╪│┘è╪د╪ز ╪د┘┘à┘é╪ذ┘ê┘╪ر..."
                                              />
                                            </div>
                                          ) : newKqType === "city" ? (
                                            <div className="md:col-span-2">
                                              <MultiSearchableSelect
                                                options={SAUDI_CITIES}
                                                value={newKqRequiredAnswer}
                                                onChange={(val) => setNewKqRequiredAnswer(val as string)}
                                                multiple={true}
                                                placeholder="╪د╪«╪ز╪▒ ╪د┘┘à╪»┘ ╪د┘┘à┘é╪ذ┘ê┘╪ر..."
                                              />
                                            </div>
                                          ) : newKqType === "education" ? (
                                            <select
                                              value={newKqRequiredAnswer}
                                              onChange={(e) => setNewKqRequiredAnswer(e.target.value)}
                                              className="md:col-span-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none"
                                            >
                                              <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د╪«╪ز╪▒ ╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë ┘┘┘à╪ج┘ç┘...</option>
                                              <option value="╪س╪د┘┘ê┘è" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪س╪د┘┘ê┘è</option>
                                              <option value="╪»╪ذ┘┘ê┘à" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪»╪ذ┘┘ê┘à</option>
                                              <option value="╪ذ┘â╪د┘┘ê╪▒┘è┘ê╪│" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪ذ┘â╪د┘┘ê╪▒┘è┘ê╪│</option>
                                              <option value="┘à╪د╪ش╪│╪ز┘è╪▒" className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘à╪د╪ش╪│╪ز┘è╪▒</option>
                                              <option value="╪»┘â╪ز┘ê╪▒╪د┘ç" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪»┘â╪ز┘ê╪▒╪د┘ç</option>
                                            </select>
                                          ) : newKqType === "experience" ? (
                                            <select
                                              value={newKqRequiredAnswer}
                                              onChange={(e) => setNewKqRequiredAnswer(e.target.value)}
                                              className="md:col-span-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none"
                                            >
                                              <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د╪«╪ز╪▒ ╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë ┘┘╪«╪ذ╪▒╪ر...</option>
                                              <option value="0" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë: ╪ث┘é┘ ┘à┘ ╪│┘╪ر</option>
                                              <option value="1" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë: ╪│┘╪ر</option>
                                              <option value="2" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë: ╪│┘╪ز┘è┘</option>
                                              <option value="3" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë: 3 ╪│┘┘ê╪د╪ز</option>
                                              <option value="4" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë: 4 ╪│┘┘ê╪د╪ز</option>
                                              <option value="5" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë: 5 ╪│┘┘ê╪د╪ز</option>
                                              <option value="10" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë: 10 ╪│┘┘ê╪د╪ز</option>
                                            </select>
                                          ) : newKqType === "availability" ? (
                                            <select
                                              value={newKqRequiredAnswer}
                                              onChange={(e) => setNewKqRequiredAnswer(e.target.value)}
                                              className="md:col-span-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none"
                                            >
                                              <option value="" disabled hidden className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د╪«╪ز╪▒ ╪ث┘é╪╡┘ë ┘à╪»╪ر ┘à┘é╪ذ┘ê┘╪ر...</option>
                                              <option value="┘┘ê╪▒┘è" className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘┘ê╪▒┘è</option>
                                              <option value="╪ث╪│╪ذ┘ê╪╣" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪ث╪│╪ذ┘ê╪╣</option>
                                              <option value="╪ث╪│╪ذ┘ê╪╣┘è┘" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪ث╪│╪ذ┘ê╪╣┘è┘</option>
                                              <option value="╪┤┘ç╪▒" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪┤┘ç╪▒</option>
                                              <option value="╪ث┘â╪س╪▒ ┘à┘ ╪┤┘ç╪▒" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪ث┘â╪س╪▒ ┘à┘ ╪┤┘ç╪▒</option>
                                            </select>
                                          ) : newKqType === "languages" ? (
                                            <div className="md:col-span-2">
                                              <MultiSearchableSelect
                                                options={["╪د┘╪╣╪▒╪ذ┘è╪ر", "╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر", "╪د┘┘╪▒┘╪│┘è╪ر", "╪د┘╪ح╪│╪ذ╪د┘┘è╪ر", "╪د┘╪ث┘ê╪▒╪»┘ê", "╪د┘┘ç┘╪»┘è╪ر", "╪د┘╪ذ┘╪║╪د┘┘è╪ر", "╪د┘┘┘╪ذ┘è┘┘è╪ر", "╪ث╪«╪▒┘ë"]}
                                                value={newKqRequiredAnswer}
                                                onChange={(val) => setNewKqRequiredAnswer(val as string)}
                                                multiple={true}
                                                placeholder="╪د╪«╪ز╪▒ ╪د┘┘╪║╪د╪ز ╪د┘┘à╪╖┘┘ê╪ذ╪ر..."
                                              />
                                            </div>
                                          ) : newKqType === "yes_no" ? (
                                            <select
                                              value={newKqRequiredAnswer}
                                              onChange={(e) => setNewKqRequiredAnswer(e.target.value)}
                                              className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none"
                                            >
                                              <option value="┘╪╣┘à" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ح╪ش╪د╪ذ╪ر ╪د┘┘à╪╖┘┘ê╪ذ╪ر ┘┘┘é┘╪ذ┘ê┘: ┘╪╣┘à</option>
                                              <option value="┘╪د" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د┘╪ح╪ش╪د╪ذ╪ر ╪د┘┘à╪╖┘┘ê╪ذ╪ر ┘┘┘é┘╪ذ┘ê┘: ┘╪د</option>
                                            </select>
                                          ) : (
                                            <select
                                              value={newKqRequiredAnswer}
                                              onChange={(e) => setNewKqRequiredAnswer(e.target.value)}
                                              className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm appearance-none"
                                            >
                                              <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د╪«╪ز╪▒ ╪د┘╪ح╪ش╪د╪ذ╪ر ╪د┘┘à╪╖┘┘ê╪ذ╪ر ┘┘┘é╪ذ┘ê┘...</option>
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
                                                placeholder="╪ث╪╢┘ ╪«┘è╪د╪▒╪د┘ï..."
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
                                                ╪ح╪╢╪د┘╪ر
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
                                            const autoTexts: Record<string, string> = {
                                              nationality: "╪د┘╪ش┘╪│┘è╪د╪ز ╪د┘┘à┘é╪ذ┘ê┘╪ر",
                                              city: "╪د┘┘à╪»┘ ╪د┘┘à┘é╪ذ┘ê┘╪ر",
                                              education: "╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë ┘┘┘à╪ج┘ç┘",
                                              experience: "╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë ┘╪│┘┘ê╪د╪ز ╪د┘╪«╪ذ╪▒╪ر",
                                              availability: "╪د┘╪ص╪» ╪د┘╪ث┘é╪╡┘ë ┘┘à╪»╪ر ╪د┘╪د┘╪╢┘à╪د┘à",
                                              languages: "╪د┘┘╪║╪د╪ز ╪د┘┘à╪╖┘┘ê╪ذ╪ر",
                                              age_condition: "╪ز╪د╪▒┘è╪« ╪د┘┘à┘è┘╪د╪»"
                                            };
                                            const finalKqText = autoTexts[newKqType] || newKqText.trim();
                                            if (!finalKqText || (newKqType !== "age_condition" && !newKqRequiredAnswer.trim()) || (newKqType === "age_condition" && newKqMinAge === "")) {
                                              alert("┘è╪▒╪ش┘ë ╪ح╪»╪«╪د┘ ╪د┘╪ص┘é┘ê┘ ╪د┘┘à╪╖┘┘ê╪ذ╪ر!");
                                              return;
                                            }
                                            if (newKqType === "options" && newKqOptions.length < 2) {
                                              window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "┘è╪▒╪ش┘ë ╪ح╪╢╪د┘╪ر ╪«┘è╪د╪▒┘è┘ ╪╣┘┘ë ╪د┘╪ث┘é┘!", type: "warning" } }));
                                              return;
                                            }
                                            setKnockoutQuestions([...knockoutQuestions, {
                                              text: finalKqText,
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
                                          ╪ح╪╢╪د┘╪ر ╪│╪ج╪د┘ ╪د╪│╪ز╪ذ╪╣╪د╪»
                                        </button>
                                      </div>

                                      {knockoutQuestions.length > 0 && (
                                        <div className="space-y-3 mt-6">
                                          {knockoutQuestions.map((q, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/30 rounded-xl">
                                              <div>
                                                <p className="font-bold text-navy dark:text-white text-sm mb-1">{q.text}</p>
                                                <p className="text-xs text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded inline-block">{q.type === "age_condition" ? `╪د┘╪╣┘à╪▒ ╪د┘┘à╪╖┘┘ê╪ذ: ┘à┘ ${q.minAge}${q.maxAge ? ` ╪ح┘┘ë ${q.maxAge}` : " ┘╪ث┘â╪س╪▒"}` : `╪د┘╪ح╪ش╪د╪ذ╪ر ╪د┘┘à╪╖┘┘ê╪ذ╪ر ┘┘┘é╪ذ┘ê┘: ${q.requiredAnswer}`}</p>
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
                                  ╪د┘╪ث╪│╪خ┘╪ر ╪د┘╪ح╪╢╪د┘┘è╪ر - ╪د╪«╪ز┘è╪د╪▒┘è
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
                                          ╪د┘╪ث╪│╪خ┘╪ر ╪د┘╪ح╪╢╪د┘┘è╪ر (╪«╪د╪╡╪ر ╪ذ┘ç╪░╪د ╪د┘╪»┘ê╪▒)
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
                                                ┘┘ê╪╣ ╪د┘╪ح╪ش╪د╪ذ╪ر: {q.type}
                                                <span className="text-slate-300">ظت</span>
                                                <span className={q.required ? "text-red-500" : "text-slate-400"}>
                                                  {q.required ? "╪ح┘╪▓╪د┘à┘è" : "╪د╪«╪ز┘è╪د╪▒┘è"}
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
                                              ╪ح╪ش╪د╪ذ╪ر ╪ح┘╪▓╪د┘à┘è╪ر
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
                                            placeholder="╪د┘â╪ز╪ذ ╪│╪ج╪د┘┘â ┘ç┘╪د..."
                                            className="flex-1 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none"
                                          />{" "}
                                          <div className="relative min-w-[150px]">
                                            {" "}
                                            <select
                                              value={newQuestionType}
                                              onChange={(e) => {
                                                setNewQuestionType(e.target.value);
                                                if (e.target.value !== "╪«┘è╪د╪▒╪د╪ز ┘à╪ز╪╣╪»╪»╪ر")
                                                  setNewQuestionOptions([]);
                                              }}
                                              className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none appearance-none font-medium"
                                            >
                                              {" "}
                                              <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘╪╡ ┘é╪╡┘è╪▒</option> <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘╪╡ ╪╖┘ê┘è┘</option>{" "}
                                              <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪«┘è╪د╪▒╪د╪ز ┘à╪ز╪╣╪»╪»╪ر</option>{" "}
                                              <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘╪╣┘à / ┘╪د</option>{" "}
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
                                        {newQuestionType === "╪«┘è╪د╪▒╪د╪ز ┘à╪ز╪╣╪»╪»╪ر" && (
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
                                                placeholder="╪د╪╢┘ ╪«┘è╪د╪▒ ┘ê╪د╪╢╪║╪╖ Enter"
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
                        {adType === "campaign" && (
                          <div className="flex items-center justify-end mb-2">
                            <span className="bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-xl text-sm">
                              ╪د┘╪┤╪د╪║╪▒ ╪▒┘é┘à {editingRoleId ? roles.findIndex(r => r.id === editingRoleId) + 1 : roles.length + 1}
                            </span>
                          </div>
                        )}
                        {adType === "campaign" && (
                          <div className="flex items-center justify-end mb-2">
                            <span className="bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-xl text-sm">
                              ╪د┘╪┤╪د╪║╪▒ ╪▒┘é┘à {editingRoleId ? roles.findIndex(r => r.id === editingRoleId) + 1 : roles.length + 1}
                            </span>
                          </div>
                        )}
                        {createJobType !== "quick_link" && (
                          <>







                            <details
                              open={isAdvancedSettingsOpen}
                              onToggle={(e) => setIsAdvancedSettingsOpen(e.currentTarget.open)}
                              className="hidden bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm mt-6 mb-6 group cursor-pointer"
                            >
                              <summary className="p-8 text-xl font-bold text-navy dark:text-white flex items-center gap-3 select-none outline-none">
                                <Settings size={22} className="text-primary" />
                                ╪ح╪╣╪»╪د╪»╪د╪ز ╪د┘┘╪▒╪▓ ╪د┘┘à╪ز┘é╪»┘à╪ر
                                <ChevronDown size={20} className="mr-auto text-slate-400 group-open:rotate-180 transition-transform" />
                              </summary>

                              <div className="px-8 pb-8 pt-2 space-y-6 cursor-default border-t border-slate-100 dark:border-slate-700">
                                {getVoiceInterviewFeatureEnabled() && (<>
                                  <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 pb-6">
                                    <div>
                                      <h4 className="font-bold text-navy dark:text-white text-lg">╪ز┘╪╣┘è┘ ╪د┘╪ز┘é┘è┘è┘à ╪د┘╪╡┘ê╪ز┘è ╪د┘╪ت┘┘è</h4>
                                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-lg leading-relaxed">╪╣┘╪» ╪ح┘è┘é╪د┘ ┘ç╪░╪د ╪د┘╪«┘è╪د╪▒╪î ╪│┘è┘â╪ز┘┘è ╪د┘┘╪╕╪د┘à ╪ذ╪ش┘à╪╣ ╪ذ┘è╪د┘╪د╪ز ╪د┘┘à╪▒╪┤╪ص ┘ê╪│┘è╪▒╪ز┘ç ╪د┘╪░╪د╪ز┘è╪ر ┘┘è╪ز┘à ┘╪▒╪▓┘ç╪د ╪»┘ê┘ ╪ح┘╪▓╪د┘à┘ç ╪ذ╪ح╪ش╪▒╪د╪ة ╪د┘┘à┘é╪د╪ذ┘╪ر ╪د┘╪╡┘ê╪ز┘è╪ر ╪د┘╪ت┘┘è╪ر.</p>
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
                                          <label className="font-bold text-navy dark:text-white text-lg">┘é╪د┘╪ذ ╪ث╪│╪خ┘╪ر ╪د┘┘à┘é╪د╪ذ┘╪ر ╪د┘╪╡┘ê╪ز┘è╪ر (╪│╪ج╪د┘┘è┘ ┘â╪ص╪» ╪ث┘é╪╡┘ë)</label>
                                          <select
                                            value={voiceInterviewTemplate}
                                            onChange={(e) => setVoiceInterviewTemplate(e.target.value as any)}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold transition-all"
                                          >
                                            <option value="general" className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘╪▒╪▓ ╪╣╪د┘à - ┘┘┘ê╪╕╪د╪خ┘ ╪د┘╪ح╪»╪د╪▒┘è╪ر ┘ê╪د┘╪ز┘é┘┘è╪ر</option>
                                            <option value="sales" className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘à┘ê╪د╪ش┘ç╪ر ╪د┘╪ش┘à┘ç┘ê╪▒ ┘ê╪د┘┘à╪ذ┘è╪╣╪د╪ز</option>
                                            <option value="custom" className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘â╪ز╪د╪ذ╪ر ╪ث╪│╪خ┘╪ر ┘à╪«╪╡╪╡╪ر</option>
                                          </select>

                                          {voiceInterviewTemplate === "custom" && (
                                            <motion.div
                                              initial={{ opacity: 0, y: -10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              className="mt-4 space-y-4"
                                            >
                                              <div className="bg-amber-50 dark:bg-amber-500/10 border-r-4 border-amber-500 p-4 rounded-l-xl">
                                                <p className="text-sm font-bold text-amber-700 dark:text-amber-400 leading-relaxed flex items-center gap-2">
                                                  <span>ظأبي╕</span> ╪ز┘╪ذ┘è┘ç: ┘╪╕╪د┘à ╪د┘┘╪▒╪▓ ┘è╪ص┘┘ ┘╪ذ╪▒╪ر ╪د┘╪╡┘ê╪ز ┘ê╪د┘╪س┘é╪ر ┘ê┘à┘ç╪د╪▒╪د╪ز ╪د┘╪ز┘ê╪د╪╡┘. ┘è╪▒╪ش┘ë ╪╖╪▒╪ص ╪ث╪│╪خ┘╪ر ╪ز╪╣╪ز┘à╪» ╪╣┘┘ë ╪د┘┘à┘ê╪د┘é┘ ╪د┘╪│┘┘ê┘â┘è╪ر ┘ê╪ز╪ش┘╪ذ ╪د┘╪ث╪│╪خ┘╪ر ╪د┘┘à╪╣╪▒┘┘è╪ر ╪ث┘ê ╪د┘╪ز┘é┘┘è╪ر ╪د┘┘à╪╣┘é╪»╪ر ┘╪╢┘à╪د┘ ╪»┘é╪ر ╪د┘╪ز╪ص┘┘è┘ ╪د┘╪ت┘┘è.
                                                </p>
                                              </div>

                                              {[0, 1].map((index) => (
                                                <div key={index}>
                                                  <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">╪د┘╪│╪ج╪د┘ {index + 1}</label>
                                                  <textarea
                                                    value={voiceInterviewQuestions[index] || ""}
                                                    maxLength={150}
                                                    onChange={(e) => {
                                                      const newQuestions = [...voiceInterviewQuestions];
                                                      newQuestions[index] = e.target.value;
                                                      setVoiceInterviewQuestions(newQuestions);
                                                    }}
                                                    placeholder={`╪د┘â╪ز╪ذ ╪د┘╪│╪ج╪د┘ ╪د┘╪│┘┘ê┘â┘è ╪▒┘é┘à ${index + 1} ┘ç┘╪د...`}
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
                                  setRequiredAttachments(["╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"]);
                                  setCustomAttachments([]);
                                  setKnockoutQuestions([]);
                                  setIsVoiceEnabled(true);
                                  setPhotoRequirement("hidden");
                                }}
                                className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 transition-all shrink-0"
                              >
                                <X size={20} /> ╪ح┘╪║╪د╪ة
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={handleSaveRole}
                              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-md hover:bg-primary/90 flex items-center gap-2 transition-colors shrink-0"
                            >
                              {" "}
                              {editingRoleId ? (
                                <>
                                  <Pencil size={20} /> ╪ص┘╪╕ ╪د┘╪ز╪╣╪»┘è┘╪د╪ز{" "}
                                </>
                              ) : (
                                <>
                                  <Plus size={20} /> ╪ص┘╪╕ ╪د┘╪┤╪د╪║╪▒ ┘ê╪ح╪╢╪د┘╪ر ╪┤╪د╪║╪▒ ╪ت╪«╪▒{" "}
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
                  <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">╪د┘╪│╪د╪ذ┘é <ArrowLeft size={18} className="rotate-180" /></button>
                  <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"><ArrowLeft size={18} /> ╪د┘╪ز╪د┘┘è</button>
                </div>
              )}

              <div className={currentStep === 3 ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
                <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm p-8 mt-6 mb-6">
                  {/* Card: Schedule and Options */}
                  {createJobType !== "quick_link" && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-navy dark:text-white text-base flex items-center gap-2 mb-1">
                          <Settings size={20} className="text-primary" />
                          ╪ز╪«╪╖┘è ╪╡┘╪ص╪ر ╪د┘┘ê╪╡┘ (╪ح╪╣╪»╪د╪» ╪╣╪د┘à)
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl leading-relaxed pr-7">╪╣┘╪» ╪ز┘╪╣┘è┘ ┘ç╪░╪د ╪د┘╪«┘è╪د╪▒╪î ╪│┘è╪ز┘à ╪ز┘ê╪ش┘è┘ç ╪د┘┘à╪ز┘é╪»┘à┘è┘ ┘à╪ذ╪د╪┤╪▒╪ر ┘╪╡┘╪ص╪ر ╪د┘╪ز┘é╪»┘è┘à ┘ê╪▒┘╪╣ ╪د┘╪│┘è╪▒╪ر ╪د┘╪░╪د╪ز┘è╪ر ╪ذ╪»┘╪د┘ï ┘à┘ ╪╣╪▒╪╢ ╪ز┘╪د╪╡┘è┘ ╪د┘┘ê╪╕┘è┘╪ر.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" className="sr-only peer" checked={directUpload} onChange={(e) => setDirectUpload(e.target.checked)} />
                        <div className="relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-3">
                      <Calendar className="text-primary" size={24} /> ╪د┘╪ز┘ê╪د╪▒┘è╪« ┘ê╪د┘╪ش╪»┘ê┘╪ر
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <span className="ml-3 font-bold text-navy dark:text-white ml-3">╪ح╪╣┘╪د┘ ┘à╪│╪ز┘à╪▒ (┘à┘╪ز┘ê╪ص ╪»╪د╪خ┘à╪د┘ï)</span>
                      <input type="checkbox" className="sr-only peer" checked={isOpenEnded} onChange={(e) => setIsOpenEnded(e.target.checked)} />
                      <div className="relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className={`grid grid-cols-1 ${isOpenEnded ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-8`}>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-navy dark:text-white mr-1">
                        ╪ز╪د╪▒┘è╪« ┘ê┘ê┘é╪ز ╪ذ╪»╪ة ╪د┘╪ز┘é╪»┘è┘à
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
                          ╪ز╪د╪▒┘è╪« ┘ê┘ê┘é╪ز ╪د┘╪ز┘ç╪د╪ة ╪د┘╪ز┘é╪»┘è┘à
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
                      (╪│┘è╪ذ┘é┘ë ┘ç╪░╪د ╪د┘╪ح╪╣┘╪د┘ ┘à╪ز╪د╪ص╪د┘ï ┘┘┘à╪ز┘é╪»┘à┘è┘ ╪ص╪ز┘ë ╪ز┘é┘ê┘à ╪ذ╪ح╪║┘╪د┘é┘ç ┘è╪»┘ê┘è╪د┘ï ┘à┘ ┘┘ê╪ص╪ر ╪د┘╪ز╪ص┘â┘à)
                    </p>
                  )}
                </div>

              </div>

              {createJobType !== "quick_link" && currentStep === 3 && (
                <div className="mt-8 flex justify-start gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mb-8">
                  <button type="button" onClick={(e) => { e.preventDefault(); setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">╪د┘╪│╪د╪ذ┘é <ArrowLeft size={18} className="rotate-180" /></button>
                </div>
              )}
              {adType === "campaign" && roles.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between font-bold text-navy dark:text-white">
                    <h3>╪د┘╪┤┘ê╪د╪║╪▒ ╪د┘┘à╪╖┘┘ê╪ذ╪ر ({roles.length}):</h3>
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
                            {Boolean(r.salaryMin) && String(r.salaryMin) !== "0" ? <span className="text-[11px] flex items-center gap-1.5 font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30 px-2.5 py-1 rounded-lg"><CreditCard size={14} className="ml-1.5" /> {r.salaryMin} {r.salaryMax && `- ${r.salaryMax}`} ╪▒┘è╪د┘</span> : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pr-3 pt-3 mt-2 border-t border-slate-100 dark:border-slate-700/50 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              handleEditRole(r as any);
                            }}
                            className="bg-white text-primary border border-primary/20 hover:bg-primary/5 dark:bg-slate-800 dark:text-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center flex-1 sm:flex-none"
                            title="╪ز╪╣╪»┘è┘ ╪د┘╪┤╪د╪║╪▒"
                          >
                            <Pencil size={14} className="ml-1" /> ╪ز╪╣╪»┘è┘
                          </button>
                          <button
                            type="button"
                            onClick={() => setRoleToDelete(r.id)}
                            className="bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center flex-1 sm:flex-none"
                            title="╪ص╪░┘ ╪د┘╪┤╪د╪║╪▒"
                          >
                            <Trash2 size={14} className="ml-1" /> ╪ص╪░┘
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}{" "}
              <div className="flex flex-col md:flex-row items-center justify-end gap-3 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); handleBackAttempt(); }}
                  className="w-full md:w-auto bg-slate-100 dark:bg-slate-800/80 border-2 border-transparent dark:border-slate-600 text-slate-600 dark:text-slate-300 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  ╪ح┘╪║╪د╪ة ┘ê╪د┘╪╣┘ê╪»╪ر
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLivePreview(true);
                  }}
                  className="w-full md:w-auto px-8 bg-white dark:bg-slate-800 border-2 border-primary text-primary py-4 rounded-xl text-lg font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={20} /> ┘à╪╣╪د┘è┘╪ر ╪د┘╪ح╪╣┘╪د┘ ╪ص┘è╪د┘ï
                </button>

                {adType === "single" && (
                  <>
                    {initialData?.status === "┘╪┤╪╖" ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent("showToast", { detail: "╪ز┘à ╪ح┘è┘é╪د┘ ╪د┘┘╪┤╪▒ ┘ê╪د┘╪ز╪ص┘ê┘è┘ ┘┘à╪│┘ê╪»╪ر" }));
                            setTimeout(() => {
                              // Saving with a new status "┘à╪│┘ê╪»╪ر"
                              onSubmit({ ...baseJobData, status: "┘à╪│┘ê╪»╪ر" } as any, initialData.id);
                            }, 1000);
                          }}
                          className="w-full md:w-auto bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-6 py-4 rounded-xl text-lg font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all items-center"
                        >
                          ╪ح┘è┘é╪د┘ ╪د┘┘╪┤╪▒ (╪ز╪ص┘ê┘è┘ ┘┘à╪│┘ê╪»╪ر)
                        </button>
                        <button
                          type="submit"
                          className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          ╪ص┘╪╕ ╪د┘╪ز╪╣╪»┘è┘╪د╪ز
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
                          ╪ص┘╪╕ ╪د┘┘à╪│┘ê╪»╪ر
                        </button>
                        <button
                          type="submit"
                          className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          ╪ح┘╪┤╪د╪ة ╪د┘╪ح╪╣┘╪د┘ ╪د┘┘ê╪╕┘è┘┘è
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
                      ╪ص┘╪╕ ╪د┘┘à╪│┘ê╪»╪ر
                    </button>
                    <button
                      type="submit"
                      className="w-full md:w-auto px-10 bg-primary text-white py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      ╪ح┘╪┤╪د╪ة ╪د┘╪ح╪╣┘╪د┘ ╪د┘┘ê╪╕┘è┘┘è
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
            location: createJobType === "quick_link" ? "╪║┘è╪▒ ┘à╪ص╪»╪»" : location,
            locations: createJobType === "quick_link" ? [] : locations,
            targetMajors,
            experience: createJobType === "quick_link" ? "╪║┘è╪▒ ┘à╪ص╪»╪»" : experience,
            qualification: createJobType === "quick_link" ? "╪║┘è╪▒ ┘à╪ص╪»╪»" : qualification,
            salaryMin: createJobType === "quick_link" ? undefined : salaryMin,
            salaryMax: createJobType === "quick_link" ? undefined : salaryMax,
            isSalaryHidden: createJobType === "quick_link" ? false : isSalaryHidden,
            askExpectedSalary: createJobType === "quick_link" ? "hidden" : askExpectedSalary,
            expectedSalaryRanges: createJobType === "quick_link" ? [] : expectedSalaryRanges,
            knockoutQuestions: createJobType === "quick_link" ? [] : knockoutQuestions,
            type: createJobType === "quick_link" ? "╪»┘ê╪د┘à ┘â╪د┘à┘" : type,
            aiInstructions: createJobType === "quick_link" ? "" : (aiInstructions || "").trim(),
            title: (adType === "campaign" ? (enableWelcomeUI ? campaignTitle : "") : roleTitle) || roleTitle || "",
            companyLogo: companyLogo || undefined,
            skills: createJobType === "quick_link" ? [] : selectedSkills,
            languages: selectedLanguages,
            customQuestions: createJobType === "quick_link" ? [] : customQuestions,
            requiredAttachments: createJobType === "quick_link" ? ["╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"] : requiredAttachments,
            directUpload: createJobType === "quick_link" ? false : directUpload,
            requireVoiceInterview: createJobType === "quick_link" ? false : isVoiceEnabled,
            voiceInterviewTemplate: createJobType === "quick_link" ? undefined : voiceInterviewTemplate,
            voiceInterviewQuestions: createJobType === "quick_link" ? undefined : voiceInterviewQuestions,
            photoRequirement: createJobType === "quick_link" ? "optional" : photoRequirement,
            portfolioRequirement: createJobType === "quick_link" ? undefined : (requiredAttachments.includes("╪▒╪د╪ذ╪╖ ┘à╪╣╪▒╪╢ ╪ث╪╣┘à╪د┘/Portfolio") ? portfolioRequirement : undefined),
            applicants: 0,
            status: "┘╪┤╪╖",
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
                requiredAttachments: createJobType === "quick_link" ? ["╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر PDF"] : requiredAttachments,
                portfolioRequirement: createJobType === "quick_link" ? undefined : (requiredAttachments.includes("╪▒╪د╪ذ╪╖ ┘à╪╣╪▒╪╢ ╪ث╪╣┘à╪د┘/Portfolio") ? portfolioRequirement : undefined),
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
  const [contactPhone, setContactPhone] = useState(userProfile.contactPhone || "");
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
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return 'ظت ' + trimmed.substring(2);
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) return 'ظت ' + trimmed.substring(1).trim();
        if (!trimmed.startsWith('ظت')) return 'ظت ' + trimmed;
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
        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/40 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner-3d">
          <ShieldCheck size={40} />
        </div>
        <h3 className="text-2xl font-bold text-center text-navy dark:text-white mb-3">╪«╪╖┘ê╪ر ╪ث╪«┘è╪▒╪ر ┘┘╪┤╪▒ ╪ح╪╣┘╪د┘┘â!</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm leading-relaxed">
          ┘è╪▒╪ش┘ë ╪د╪│╪ز┘â┘à╪د┘ ╪ذ┘è╪د┘╪د╪ز ╪د┘┘â┘è╪د┘ ╪د┘╪«╪د╪╡ ╪ذ┘â ┘┘╪ز┘à┘â┘ ┘à┘ ╪╣╪▒╪╢┘ç╪د ┘┘┘à╪ز┘é╪»┘à┘è┘ ┘ê┘╪┤╪▒ ╪ز┘╪د╪╡┘è┘ ╪د┘╪┤┘ê╪د╪║╪▒ ╪د┘╪«╪د╪╡╪ر ╪ذ┘â.
        </p>
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (entityType === "company") {
            if (!companyName.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪د╪│┘à ╪د┘┘à┘╪┤╪ث╪ر ┘à╪╖┘┘ê╪ذ", type: "error" } })); return; }
            if (!/^\d{10}$/.test(crNumber.trim())) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪▒┘é┘à ╪د┘╪│╪ش┘ ╪د┘╪ز╪ش╪د╪▒┘è ┘è╪ش╪ذ ╪ث┘ ┘è╪ز┘â┘ê┘ ┘à┘ 10 ╪ث╪▒┘é╪د┘à", type: "error" } })); return; }
            if (!contactPhone.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪▒┘é┘à ╪ش┘ê╪د┘ ╪د┘┘à┘╪┤╪ث╪ر ┘à╪╖┘┘ê╪ذ", type: "error" } })); return; }
            if (!/^(05\d{8}|9665\d{8})$/.test(contactPhone.trim())) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪▒┘é┘à ╪د┘╪ش┘ê╪د┘ ┘è╪ش╪ذ ╪ث┘ ┘è╪ذ╪»╪ث ╪ذ┘ 05 (10 ╪ث╪▒┘é╪د┘à) ╪ث┘ê 9665 (12 ╪▒┘é┘à)", type: "error" } })); return; }
            if (!city.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪د┘┘à╪»┘è┘╪ر ┘à╪╖┘┘ê╪ذ╪ر", type: "error" } })); return; }
          } else {
            if (!companyName.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪د┘╪د╪│┘à ╪د┘╪س┘╪د╪س┘è ┘à╪╖┘┘ê╪ذ", type: "error" } })); return; }
            if (!/^FL-\d{6,15}$/i.test(freelanceDoc.trim())) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪▒┘é┘à ╪د┘┘ê╪س┘è┘é╪ر ┘è╪ش╪ذ ╪ث┘ ┘è╪ذ╪»╪ث ╪ذ┘ FL- ┘è┘┘è┘ç ╪ث╪▒┘é╪د┘à", type: "error" } })); return; }
            if (!contactPhone.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪▒┘é┘à ╪د┘╪ش┘ê╪د┘ ┘à╪╖┘┘ê╪ذ", type: "error" } })); return; }
            if (!/^(05\d{8}|9665\d{8})$/.test(contactPhone.trim())) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪▒┘é┘à ╪د┘╪ش┘ê╪د┘ ┘è╪ش╪ذ ╪ث┘ ┘è╪ذ╪»╪ث ╪ذ┘ 05 (10 ╪ث╪▒┘é╪د┘à) ╪ث┘ê 9665 (12 ╪▒┘é┘à)", type: "error" } })); return; }
            if (!city.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪د┘┘à╪»┘è┘╪ر ┘à╪╖┘┘ê╪ذ╪ر", type: "error" } })); return; }
          }

          const updatedProfile = {
            ...userProfile,
            entityType,
            companyName,
            city,
            contactPhone,
            commercialRegistration: entityType === "company" ? crNumber : "",
            freelanceDocument: entityType === "freelance" ? freelanceDoc : "",
            fields_locked: true
          };

          setUserProfile(updatedProfile);
          localStorage.setItem("onboarding_complete", "true");

          try {
            const { supabase: sb } = await import('../lib/supabaseClient');
            const { data: { user } } = await sb.auth.getUser();
            if (user) {
              await sb.from('companies').upsert({
                id: user.id,
                company_name: companyName,
                entity_type: entityType,
                city: city || null,
                contact_phone: contactPhone,
                commercial_registration: entityType === "company" ? crNumber.trim() : null,
                freelance_document: entityType === "freelance" ? freelanceDoc.trim() : null,
                fields_locked: true
              }, { onConflict: 'id' });
            }
          } catch (err) {
            console.error("Failed to save onboarding data:", err);
          }

          window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪ز┘à ╪ص┘╪╕ ╪د┘╪ذ┘è╪د┘╪د╪ز ╪ذ┘╪ش╪د╪ص", type: "success" } }));

          if (onPublishDraft) {
            onPublishDraft();
          }
          onClose();
        }} className="space-y-4">

          <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 gap-1.5 rounded-2xl w-full mb-4">
            <button type="button" onClick={() => setEntityType("company")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${entityType === "company" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>╪ش┘ç╪ر ╪د╪╣╪ز╪ذ╪د╪▒┘è╪ر</button>
            <button type="button" onClick={() => setEntityType("freelance")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${entityType === "freelance" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>╪╣┘à┘ ╪ص╪▒ (┘à╪│╪ز┘é┘)</button>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">{entityType === "company" ? "╪د╪│┘à ╪د┘┘à┘╪┤╪ث╪ر ╪د┘┘à╪╣╪ز┘à╪»" : "╪د┘╪د╪│┘à ╪د┘╪س┘╪د╪س┘è ╪د┘┘à╪╣╪ز┘à╪»"}</label>
            <input required type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder={entityType === "company" ? "┘à╪ج╪│╪│╪ر ╪د┘╪ز┘é┘┘è╪ر ╪د┘╪ذ╪│┘è╪╖╪ر..." : "┘à╪س╪د┘: ╪╣╪ذ╪»╪د┘┘┘ç ┘à╪ص┘à╪»..."} className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 font-medium dark:text-white transition-all" />
          </div>

          {entityType === "company" ? (
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">╪▒┘é┘à ╪د┘╪│╪ش┘ ╪د┘╪ز╪ش╪د╪▒┘è (CR)</label>
              <input required type="text" value={crNumber} onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 10) setCrNumber(val);
              }} maxLength={10} minLength={10} placeholder="1010123456" className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 font-medium dark:text-white text-left transition-all" dir="ltr" />
            </div>
          ) : (
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">╪▒┘é┘à ┘ê╪س┘è┘é╪ر ╪د┘╪╣┘à┘ ╪د┘╪ص╪▒</label>
              <input required type="text" value={freelanceDoc} onChange={e => setFreelanceDoc(e.target.value)} placeholder="FL-XXXXXX" className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 font-medium dark:text-white text-left transition-all" dir="ltr" />
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">
              {entityType === "company" ? "╪▒┘é┘à ╪ش┘ê╪د┘ ╪د┘┘à┘╪┤╪ث╪ر" : "╪▒┘é┘à ╪د┘╪ش┘ê╪د┘"}
            </label>
            <input required type="tel" value={contactPhone} onChange={e => {
              let val = e.target.value.replace(/\D/g, '');
              if (val.length === 0) {
                setContactPhone('');
              } else if (val.startsWith('966')) {
                if (val.length <= 12) setContactPhone(val);
              } else if (val.startsWith('0')) {
                if (val.length <= 10) setContactPhone(val);
              } else if (val === '9' || val === '96') {
                setContactPhone(val);
              }
            }} placeholder="05XXXXXXXX" className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 font-medium dark:text-white transition-all text-left" dir="ltr" />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">╪د┘┘à╪»┘è┘╪ر</label>
            <input required type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="╪د┘╪▒┘è╪د╪╢╪î ╪ش╪»╪ر..." className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 font-medium dark:text-white transition-all" />
          </div>

          <button type="submit" className="w-full py-5 mt-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <CheckCircle size={20} />
            ╪ص┘╪╕ ┘ê┘à╪ز╪د╪ذ╪╣╪ر
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
            ╪ز┘à ╪ح┘╪┤╪د╪ة ╪د┘╪┤╪د╪║╪▒ ╪ذ┘╪ش╪د╪ص!
          </h2>{" "}
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium mb-12">
            ╪ز┘à ╪ز┘╪╣┘è┘ ╪د┘┘ê╪╕┘è┘╪ر ┘ê╪ح┘╪┤╪د╪ة ╪▒╪د╪ذ╪╖ ╪د┘╪ز┘é╪»┘è┘à ╪د┘╪«╪د╪╡ ╪ذ┘ç╪د. ┘è┘à┘â┘┘â ╪د┘╪ت┘ ┘à╪┤╪د╪▒┘â╪ز┘ç ┘à╪╣
            ╪د┘┘à╪ز┘é╪»┘à┘è┘.
          </p>{" "}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 mb-10">
            {" "}
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase mb-3 text-right">
              ╪▒╪د╪ذ╪╖ ╪د┘╪ز┘é╪»┘è┘à ╪د┘┘à╪ذ╪د╪┤╪▒
            </p>{" "}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              {" "}
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${copied ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-teal-600"}`}
              >
                {" "}
                {copied ? "╪ز┘à ╪د┘┘╪│╪«!" : "┘╪│╪« ╪د┘╪▒╪د╪ذ╪╖"} <Copy size={18} />{" "}
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
              <ExternalLink size={20} /> ┘à╪╣╪د┘è┘╪ر ╪╡┘╪ص╪ر ╪د┘╪ز┘é╪»┘è┘à{" "}
            </button>{" "}
            <button
              onClick={onDone}
              className="bg-navy text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              {" "}
              ╪د┘╪╣┘ê╪»╪ر ┘┘┘ê╪ص╪ر ╪د┘╪ز╪ص┘â┘à{""}
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
  if (job.status === "┘à╪│┘ê╪»╪ر") {
    return (
      <div className="min-h-screen bg-bg dark:bg-navy flex items-center justify-center p-6">
        <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-xl max-w-lg w-full border border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">╪د┘╪ح╪╣┘╪د┘ ╪║┘è╪▒ ┘à╪ز╪د╪ص</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">╪╣╪░╪▒╪د┘ï╪î ┘ç╪░╪د ╪د┘╪ح╪╣┘╪د┘ ╪║┘è╪▒ ┘à╪ز╪د╪ص ╪ص╪د┘┘è╪د┘ï ╪ث┘ê ┘à╪╣┘┘é ┘â┘à╪│┘ê╪»╪ر╪î ┘è┘╪▒╪ش┘ë ┘à╪▒╪د╪ش╪╣╪ر ╪د┘╪┤╪▒┘â╪ر ╪د┘┘╪د╪┤╪▒╪ر ┘┘╪ح╪╣┘╪د┘.</p>
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
                  <ArrowRight size={16} /> ╪د┘╪╣┘ê╪»╪ر ┘┘é╪د╪خ┘à╪ر ╪د┘┘ê╪╕╪د╪خ┘
                </button>
              )}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 p-0 bg-white dark:bg-slate-800/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white dark:border-slate-700/10 overflow-hidden shrink-0 shadow-sm">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={`╪┤╪╣╪د╪▒ ${job.company}`}
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
                        {job.entityType === "company" ? "┘à╪ج╪│╪│╪ر ┘à╪╣╪ز┘à╪»╪ر" : "┘à╪│╪ز┘é┘ ┘à╪╣╪ز┘à╪»"}
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
                  {((activeRole?.locations?.length ? activeRole.locations : job.locations?.length ? job.locations : (activeRole?.location || job.location) ? [activeRole?.location || job.location] : []) as string[]).filter(loc => loc !== "┘╪د ┘è╪┤╪ز╪▒╪╖ / ┘â╪د┘╪ر ╪د┘┘à╪»┘").map((loc, idx) => (
                    <div key={idx} className="inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm">
                      <MapPin size={16} className="text-white/80 shrink-0" /> {loc}
                    </div>
                  ))}
                  {(activeRole?.experience || job.experience) && (
                    <div className="inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm">
                      <Briefcase size={16} className="text-white/80 shrink-0" /> {activeRole?.experience || job.experience}
                    </div>
                  )}
                  {(activeRole?.qualification || job.qualification) && (activeRole?.qualification !== "┘╪د ┘è╪┤╪ز╪▒╪╖ ┘à╪ج┘ç┘" && job.qualification !== "┘╪د ┘è╪┤╪ز╪▒╪╖ ┘à╪ج┘ç┘") && (
                    <div className="inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm">
                      <FileText size={16} className="text-white/80 shrink-0" /> {activeRole?.qualification || job.qualification}
                    </div>
                  )}
                  {!(activeRole?.isSalaryHidden ?? job.isSalaryHidden) && (activeRole?.salaryMin || job.salaryMin) && (
                    <div className="inline-flex items-center justify-center gap-2 bg-emerald-500/20 px-5 py-2.5 rounded-xl border border-emerald-400/40 text-sm font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-sm">
                      <CreditCard size={16} className="shrink-0 text-emerald-400" />
                      {activeRole?.salaryMin || job.salaryMin} {(activeRole?.salaryMax || job.salaryMax) ? `- ${activeRole?.salaryMax || job.salaryMax}` : ''} ╪▒┘è╪د┘
                    </div>
                  )}
                  {job.createdAt && (
                    <div className="inline-flex items-center justify-center gap-2 bg-white/5 px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold shadow-sm backdrop-blur-sm">
                      <Calendar size={16} className="text-white/60 shrink-0" /> ┘┘╪┤╪▒ ┘┘è {job.createdAt}
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
                  <div className="w-2 h-8 bg-primary rounded-full" /> ╪د┘┘╪▒╪╡ ╪د┘┘ê╪╕┘è┘┘è╪ر ╪د┘┘à╪ز╪د╪ص╪ر
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
                        {!role.isSalaryHidden && Boolean(role.salaryMin) && String(role.salaryMin) !== "0" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CreditCard size={14} /> {role.salaryMin} {role.salaryMax ? `- ${role.salaryMax}` : ''} ╪▒┘è╪د┘
                          </span>
                        ) : null}
                      </div>
                      <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
                        <span className="font-bold text-primary">╪د┘╪ز┘é╪»┘è┘à ╪╣┘┘ë ┘ç╪░┘ç ╪د┘┘ê╪╕┘è┘╪ر</span>
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
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> ┘╪ذ╪░╪ر ╪╣┘ ╪د┘╪»┘ê╪▒
                      </h3>
                      <div className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap text-base">
                        {activeRole?.roleSummary || job.roleSummary || activeRole?.description || job.description}
                      </div>
                    </div>
                  ) : null}

                  {(!activeRole?.hideResponsibilities && !job.hideResponsibilities) && (activeRole?.responsibilities || job.responsibilities) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> ╪د┘┘à┘ç╪د┘à ┘ê╪د┘┘à╪│╪ج┘ê┘┘è╪د╪ز
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
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> ╪د┘┘à╪ج┘ç┘╪د╪ز ┘ê╪د┘┘à╪ز╪╖┘╪ذ╪د╪ز
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
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> ╪د┘╪ز╪«╪╡╪╡╪د╪ز ╪د┘┘à╪│╪ز┘ç╪»┘╪ر
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
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> ╪د┘┘à┘ç╪د╪▒╪د╪ز ╪د┘┘à╪│╪ز┘ç╪»┘╪ر
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
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> ╪د┘┘╪║╪د╪ز ╪د┘┘à╪╖┘┘ê╪ذ╪ر
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
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> ╪د┘┘à┘à┘è╪▓╪د╪ز
                      </h3>
                      <ul className="space-y-4 list-none">
                        {(activeRole?.benefits || job.benefits || '').split('\n').filter(b => b.trim()).map((ben, i) => (
                          <li key={i} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-base">
                            <div className="mt-1 shrink-0 bg-primary/10 p-1.5 rounded-full text-primary">
                              <Sparkles size={16} strokeWidth={2.5} />
                            </div>
                            <span className="leading-relaxed pt-0.5">{ben.replace(/\(╪د╪«╪ز┘è╪د╪▒┘è\)/g, '').trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-12 pb-4">
                    <button onClick={onApply} className="w-full max-w-md mx-auto flex bg-primary text-white py-5 rounded-2xl text-xl font-bold hover:bg-teal-600 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] items-center justify-center gap-3">
                      ╪د┘╪ز┘é╪»┘è┘à ╪╣┘┘ë ┘ç╪░┘ç ╪د┘┘ê╪╕┘è┘╪ر
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
  const [newKqOptions, setNewKqOptions] = useState<string[]>(["┘╪╣┘à", "┘╪د"]);

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
  const [experience, setExperience] = useState(job.experience || "┘╪د ┘è╪┤╪ز╪▒╪╖ ╪«╪ذ╪▒╪ر");
  const [qualification, setQualification] = useState(job.qualification || "╪س╪د┘┘ê┘è");
  const [salaryMin, setSalaryMin] = useState(job.salaryMin || "");
  const [salaryMax, setSalaryMax] = useState(job.salaryMax || "");
  const [isSalaryHidden, setIsSalaryHidden] = useState(job.isSalaryHidden || false);
  const [askExpectedSalary, setAskExpectedSalary] = useState<"hidden" | "open" | "ranges">(job.askExpectedSalary || "hidden");
  const [expectedSalaryRanges, setExpectedSalaryRanges] = useState<string[]>(job.expectedSalaryRanges || []);
  const [salaryRangeMinInput, setSalaryRangeMinInput] = useState("");
  const [salaryRangeMaxInput, setSalaryRangeMaxInput] = useState("");
  const [type, setType] = useState(job.type || "╪»┘ê╪د┘à ┘â╪د┘à┘");
  const [description, setDescription] = useState(job.description || job.campaignDescription || "");
  const [status, setStatus] = useState(job.status || "┘╪┤╪╖");
  const isLocked = status === "┘╪┤╪╖" && job.applicants > 0;
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
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪ز╪د╪▒┘è╪« ╪د┘╪د┘╪ز┘ç╪د╪ة ┘è╪ش╪ذ ╪ث┘ ┘è┘â┘ê┘ ╪ذ╪╣╪» ╪ز╪د╪▒┘è╪« ╪د┘╪ذ╪»╪ة.", type: "error" } }));
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
            ╪د┘╪╣┘ê╪»╪ر ┘┘┘ê╪ص╪ر ╪د┘╪ز╪ص┘â┘à{" "}
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
                ╪ح╪»╪د╪▒╪ر ╪د┘┘ê╪╕┘è┘╪ر: {job.title}
              </h2>{" "}
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl mb-8">
                  <button type="button" onClick={() => setActiveTab("details")} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === "details" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:bg-white/50"}`}>╪د┘╪ز┘╪د╪╡┘è┘</button>
                  <button type="button" onClick={() => setActiveTab("filters")} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === "filters" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:bg-white/50"}`}>┘à╪ز╪╖┘╪ذ╪د╪ز ╪د┘┘╪▒╪▓ {isLocked && <span title="┘à┘é┘┘" className="ml-1 inline-flex text-orange-500"><Lock size={14} /></span>}</button>
                  <button type="button" onClick={() => setActiveTab("settings")} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === "settings" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:bg-white/50"}`}>╪د┘╪ح╪╣╪»╪د╪»╪د╪ز</button>
                </div>

                <div className={activeTab !== "details" ? "hidden" : "space-y-6"}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">╪د┘┘à╪│┘à┘ë ╪د┘┘ê╪╕┘è┘┘è <span className="text-red-500">*</span></label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">╪د┘╪┤╪▒┘â╪ر / ╪د┘┘╪▒╪╣ <span className="text-red-500">*</span></label>
                      <input type="text" value={company} onChange={(e) => { setCompany(e.target.value); localStorage.setItem("last_used_company", e.target.value); }} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">┘┘ê╪╣ ╪د┘╪╣┘à┘ <span className="text-red-500">*</span></label>
                      <select required value={type} onChange={(e) => {
                        const val = e.target.value;
                        setType(val);
                        if (val === "╪╣┘ ╪ذ╪╣╪»") setLocation("┘╪د ┘è╪┤╪ز╪▒╪╖ / ┘â╪د┘╪ر ╪د┘┘à╪»┘");
                      }} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer">
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪»┘ê╪د┘à ┘â╪د┘à┘</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪»┘ê╪د┘à ╪ش╪▓╪خ┘è</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪╣┘ ╪ذ╪╣╪»</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪ز╪»╪▒┘è╪ذ</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">┘à┘é╪▒ ╪د┘╪╣┘à┘ / ╪د┘┘à╪»┘è┘╪ر <span className="text-red-500">*</span></label>
                      <SearchableSelect options={SAUDI_CITIES} value={location} onChange={setLocation} placeholder="╪د╪«╪ز╪▒ ┘à┘é╪▒ ╪د┘╪╣┘à┘" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">┘╪ذ╪░╪ر ╪╣┘ ╪د┘╪»┘ê╪▒ <span className="text-slate-400 font-normal ml-1 text-xs">(╪د╪«╪ز┘è╪د╪▒┘è)</span> <span className="relative group inline-flex items-center ml-1">
                        <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                        <div className="absolute right-0 bottom-full mb-2 w-64 p-2.5 bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-normal leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                          ╪ز╪▒┘â ┘ç╪░╪د ╪د┘╪ص┘é┘ ┘╪د╪▒╪║╪د┘ï ╪│┘è╪ش╪╣┘ ┘à╪ص╪▒┘â ╪د┘┘╪▒╪▓ ┘è╪╣╪ز┘à╪» ╪╣┘┘ë ╪د┘┘à╪╣╪د┘è┘è╪▒ ╪د┘┘é┘è╪د╪│┘è╪ر ┘┘┘à╪│┘à┘ë ╪د┘┘ê╪╕┘è┘┘è
                          <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                        </div>
                      </span></label>
                    </div>
                    <textarea onPaste={(e) => formatPastedText(e, description, setDescription)} rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="(┘à╪س╪د┘: ╪ذ╪▒┘à╪ش╪ر ╪د┘╪ز╪╖╪ذ┘è┘é╪د╪ز╪î ╪ح╪»╪د╪▒╪ر ┘à╪┤╪د╪▒┘è╪╣ ┘à╪╣┘è┘╪ر╪î ┘à╪ز╪د╪ذ╪╣╪ر ╪د┘┘à┘┘╪د╪ز...)" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none min-h-[100px]" />
                  </div>
                </div>

                <div className={activeTab !== "filters" ? "hidden" : "space-y-6"}>
                  {isLocked && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-2xl border border-orange-200 dark:border-orange-900/50">
                      <Lock size={20} className="shrink-0" />
                      <p className="text-sm font-bold leading-relaxed">(╪ز┘à ┘é┘┘ ╪د┘╪ز╪╣╪»┘è┘ ┘┘ê╪ش┘ê╪» ┘à╪ز┘é╪»┘à┘è┘╪î ┘ê╪░┘┘â ┘┘╪ص┘╪د╪╕ ╪╣┘┘ë ╪»┘é╪ر ╪د┘╪ز┘é┘è┘è┘à ╪د┘╪ت┘┘è)</p>
                    </div>
                  )}
                  <div className={"grid grid-cols-1 md:grid-cols-2 gap-6 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">╪│┘┘ê╪د╪ز ╪د┘╪«╪ذ╪▒╪ر ╪د┘┘à╪╖┘┘ê╪ذ╪ر <span className="text-red-500">*</span></label>
                      <select disabled={isLocked} value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer">
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘╪د ┘è╪┤╪ز╪▒╪╖ ╪«╪ذ╪▒╪ر</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">1-3 ╪│┘┘ê╪د╪ز</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">3-5 ╪│┘┘ê╪د╪ز</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">5+ ╪│┘┘ê╪د╪ز</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë ┘┘┘à╪ج┘ç┘ <span className="text-red-500">*</span></label>
                      <select disabled={isLocked} value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer">
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘╪د ┘è╪┤╪ز╪▒╪╖ ┘à╪ج┘ç┘</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘╪د ┘è╪┤╪ز╪▒╪╖ ┘à╪ج┘ç┘</option>
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪س╪د┘┘ê┘è</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪»╪ذ┘┘ê┘à</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪ذ┘â╪د┘┘ê╪▒┘è┘ê╪│</option><option className="bg-white text-navy dark:bg-slate-800 dark:text-white">┘à╪د╪ش╪│╪ز┘è╪▒</option>
                      </select>
                    </div>
                  </div>
                  <div className={"space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-navy dark:text-white block">╪د┘╪ز╪«╪╡╪╡╪د╪ز ╪د┘┘à╪│╪ز┘ç╪»┘╪ر <span className="text-slate-400 font-normal ml-1 text-xs">(╪د╪«╪ز┘è╪د╪▒┘è)</span></label>
                    </div>
                    <div className="relative">
                      <input type="text" disabled={isLocked} value={newMajorInput} onChange={(e) => setNewMajorInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newMajorInput.trim() && !targetMajors.includes(newMajorInput.trim())) { setTargetMajors([...targetMajors, newMajorInput.trim()]); setNewMajorInput(""); } } }} placeholder="╪ث╪╢┘ ╪ز╪«╪╡╪╡╪د┘ï (╪د╪ز╪▒┘â ╪د┘╪ص┘é┘ ┘╪د╪▒╪║╪د┘ï ┘┘┘é╪ذ┘ê┘ ╪د┘╪╣╪د┘à)..." className="w-full pr-4 pl-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:border-primary transition-all font-medium" />
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
                      <label className="text-sm font-bold text-navy dark:text-white block">╪د┘┘à┘ç╪د╪▒╪د╪ز ╪د┘┘à╪│╪ز┘ç╪»┘╪ر <span className="text-slate-400 font-normal ml-1 text-xs">(╪د╪«╪ز┘è╪د╪▒┘è)</span></label>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl">
                      {selectedSkills.length === 0 && <span className="text-sm text-slate-400 dark:text-slate-500 py-2">┘┘à ┘è╪ز┘à ╪د╪«╪ز┘è╪د╪▒ ┘à┘ç╪د╪▒╪د╪ز ╪ذ╪╣╪»...</span>}
                      {selectedSkills.map((skill) => (
                        <button key={skill} type="button" disabled={isLocked} onClick={() => toggleSkill(skill)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all">{skill} <X size={14} /></button>
                      ))}
                    </div>
                    <div className="relative">
                      <input type="text" disabled={isLocked} value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(e); } }} placeholder="╪ث╪╢┘ ┘à┘ç╪د╪▒╪ر (╪ز╪ص╪»┘è╪» ╪د┘┘à┘ç╪د╪▒╪د╪ز ╪د┘╪»┘é┘è┘é╪ر ┘è╪ش╪╣┘ ╪د┘┘╪▒╪▓ ╪د┘╪ت┘┘è ╪ث┘â╪س╪▒ ╪»┘é╪ر)..." className="w-full pr-6 pl-14 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                      <button type="button" disabled={isLocked} onClick={addCustomSkill} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary transition-all"><Plus size={20} /></button>
                    </div>
                  </div>
                  <div className={"space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-navy dark:text-white block">╪د┘┘╪║╪د╪ز ╪د┘┘à╪╖┘┘ê╪ذ╪ر <span className="text-slate-400 font-normal ml-1">(╪د╪«╪ز┘è╪د╪▒┘è)</span></label>
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
                        <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د╪«╪ز╪▒ ┘╪║╪ر ┘╪ح╪╢╪د┘╪ز┘ç╪د...</option>
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪╣╪▒╪ذ┘è╪ر">╪د┘╪╣╪▒╪ذ┘è╪ر</option>
                        <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر">╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر</option>
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
                          <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">┘à╪│╪د╪▒ ╪د┘╪░┘â╪د╪ة ╪د┘╪د╪╡╪╖┘╪د╪╣┘è ╪د┘┘à╪«╪╡╪╡</h3>
                          <p className="text-sm text-indigo-700/70 dark:text-indigo-400/70 mt-1 font-medium">┘â╪ز╪د╪ذ╪ر ┘à╪╣╪د┘è┘è╪▒ ╪»┘é┘è┘é╪ر ┘ê╪│╪▒┘è╪ر ┘è┘é╪▒╪ث┘ç╪د ╪د┘╪░┘â╪د╪ة ╪د┘╪د╪╡╪╖┘╪د╪╣┘è ┘┘é╪╖╪î ╪ذ╪»┘╪د┘ï ┘à┘ ╪د┘┘ê╪╡┘ ╪د┘╪╣╪د┘à.</p>
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
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1">┘╪ذ╪░╪ر ╪╣┘ ╪د┘╪»┘ê╪▒ <Sparkles size={14} className="text-primary/70" /></label>
                              <textarea
                                value={aiRoleSummary}
                                onChange={(e) => setAiRoleSummary(e.target.value)}
                                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm"
                                rows={3}
                                placeholder="╪د┘â╪ز╪ذ ╪د┘┘à╪╣╪د┘è┘è╪▒ ╪د┘╪»┘é┘è┘é╪ر ┘┘┘╪ذ╪░╪ر ╪╣┘ ╪د┘╪»┘ê╪▒..."
                                disabled={isLocked}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1">╪د┘┘à┘ç╪د┘à ┘ê╪د┘┘à╪│╪ج┘ê┘┘è╪د╪ز <Sparkles size={14} className="text-primary/70" /></label>
                              <textarea
                                value={aiResponsibilities}
                                onChange={(e) => setAiResponsibilities(e.target.value)}
                                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm"
                                rows={4}
                                placeholder="╪د┘â╪ز╪ذ ╪د┘┘à┘ç╪د┘à ┘ê╪د┘┘à╪│╪ج┘ê┘┘è╪د╪ز ╪د┘┘à╪«╪╡╪╡╪ر ┘┘┘╪▒╪▓..."
                                disabled={isLocked}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1">╪د┘┘à╪ج┘ç┘╪د╪ز ┘ê╪د┘┘à╪ز╪╖┘╪ذ╪د╪ز <Sparkles size={14} className="text-primary/70" /></label>
                              <textarea
                                value={aiQualifications}
                                onChange={(e) => setAiQualifications(e.target.value)}
                                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm"
                                rows={4}
                                placeholder="╪د┘â╪ز╪ذ ╪د┘┘à╪ج┘ç┘╪د╪ز ┘ê╪د┘┘à╪ز╪╖┘╪ذ╪د╪ز ╪د┘┘à╪«╪╡╪╡╪ر ┘┘┘╪▒╪▓..."
                                disabled={isLocked}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1">╪د┘╪ز╪«╪╡╪╡╪د╪ز ╪د┘┘à╪│╪ز┘ç╪»┘╪ر <Sparkles size={14} className="text-primary/70" /></label>
                              <div className="relative">
                                <input type="text" disabled={isLocked} value={aiCustomMajor} onChange={(e) => setAiCustomMajor(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (aiCustomMajor.trim() && !aiTargetMajors.includes(aiCustomMajor.trim())) { setAiTargetMajors([...aiTargetMajors, aiCustomMajor.trim()]); setAiCustomMajor(""); } } }} placeholder="╪ث╪╢┘ ╪ز╪«╪╡╪╡..." className="w-full pr-4 pl-12 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm" />
                                <button type="button" disabled={isLocked} onClick={() => { if (aiCustomMajor.trim() && !aiTargetMajors.includes(aiCustomMajor.trim())) { setAiTargetMajors([...aiTargetMajors, aiCustomMajor.trim()]); setAiCustomMajor(""); } }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"><Plus size={18} /></button>
                              </div>
                              {aiTargetMajors.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {aiTargetMajors.map((major) => (
                                    <button key={major} type="button" disabled={isLocked} onClick={() => setAiTargetMajors(aiTargetMajors.filter(m => m !== major))} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all">{major} <X size={14} /></button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1">╪د┘┘à┘ç╪د╪▒╪د╪ز ╪د┘┘à╪│╪ز┘ç╪»┘╪ر <Sparkles size={14} className="text-primary/70" /></label>
                              <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-white/50 dark:bg-slate-800/50 border-2 border-indigo-100 dark:border-indigo-800/30 rounded-2xl mb-2">
                                {aiTargetSkills.length === 0 && <span className="text-sm text-slate-400 dark:text-slate-500 py-2">┘┘à ┘è╪ز┘à ╪د╪«╪ز┘è╪د╪▒ ┘à┘ç╪د╪▒╪د╪ز ╪ذ╪╣╪»...</span>}
                                {aiTargetSkills.map((skill) => (
                                  <button key={skill} type="button" disabled={isLocked} onClick={() => setAiTargetSkills(aiTargetSkills.filter(s => s !== skill))} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all">{skill} <X size={14} /></button>
                                ))}
                              </div>
                              <div className="relative">
                                <input type="text" disabled={isLocked} value={aiCustomSkill} onChange={(e) => setAiCustomSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (aiCustomSkill.trim() && !aiTargetSkills.includes(aiCustomSkill.trim())) { setAiTargetSkills([...aiTargetSkills, aiCustomSkill.trim()]); setAiCustomSkill(""); } } }} placeholder="╪ث╪╢┘ ┘à┘ç╪د╪▒╪ر..." className="w-full pr-6 pl-14 py-4 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm" />
                                <button type="button" disabled={isLocked} onClick={() => { if (aiCustomSkill.trim() && !aiTargetSkills.includes(aiCustomSkill.trim())) { setAiTargetSkills([...aiTargetSkills, aiCustomSkill.trim()]); setAiCustomSkill(""); } }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-800/30 text-slate-400 rounded-xl flex items-center justify-center hover:text-indigo-600 transition-all"><Plus size={20} /></button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1">╪د┘┘╪║╪د╪ز ╪د┘┘à╪╖┘┘ê╪ذ╪ر <Sparkles size={14} className="text-primary/70" /></label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {aiLanguages.map((lang) => (
                                  <span key={lang} className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">{lang}
                                    <button type="button" disabled={isLocked} onClick={() => setAiLanguages(aiLanguages.filter(l => l !== lang))}><X size={12} /></button>
                                  </span>
                                ))}
                              </div>
                              <div className="relative">
                                <select disabled={isLocked} value="" onChange={(e) => { const val = e.target.value; if (val && !aiLanguages.includes(val)) setAiLanguages([...aiLanguages, val]); }} className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border-2 border-indigo-100 dark:border-indigo-800/30 text-navy dark:text-white rounded-xl outline-none focus:border-indigo-400 transition-all text-sm appearance-none cursor-pointer">
                                  <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">╪د╪«╪ز╪▒ ┘╪║╪ر ┘╪ح╪╢╪د┘╪ز┘ç╪د...</option>
                                  <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪╣╪▒╪ذ┘è╪ر">╪د┘╪╣╪▒╪ذ┘è╪ر</option>
                                  <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر">╪د┘╪ح┘╪ش┘┘è╪▓┘è╪ر</option>
                                  <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘┘╪▒┘╪│┘è╪ر">╪د┘┘╪▒┘╪│┘è╪ر</option>
                                  <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪ح╪│╪ذ╪د┘┘è╪ر">╪د┘╪ح╪│╪ذ╪د┘┘è╪ر</option>
                                  <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘┘ç┘╪»┘è╪ر">╪د┘┘ç┘╪»┘è╪ر</option>
                                  <option className="bg-white text-navy dark:bg-slate-800 dark:text-white" value="╪د┘╪ث┘ê╪▒╪»┘ê">╪د┘╪ث┘ê╪▒╪»┘ê</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>



                  {/* Knockout Questions inside Filter Tab */}
                  <div className={"space-y-4 pt-6 mt-6 border-t font-medium border-slate-200 dark:border-slate-700 " + (isLocked ? "opacity-60 pointer-events-none" : "")}>
                    <label className="text-sm font-bold text-navy dark:text-white flex items-center gap-2">
                      ╪د┘╪ث╪│╪خ┘╪ر ╪د┘╪ز┘é┘è┘è┘à┘è╪ر ╪د┘╪ز┘┘é╪د╪خ┘è╪ر (Knockout Questions)
                    </label>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                        <div className="md:col-span-6">
                          <label className="text-xs font-bold text-slate-500 mb-1 block">┘╪╡ ╪د┘╪│╪ج╪د┘</label>
                          <input type="text" disabled={isLocked} value={newKqText} onChange={(e) => setNewKqText(e.target.value)} placeholder="┘à╪س╪د┘: ┘ç┘ ╪ز┘à╪ز┘┘â ╪▒╪«╪╡╪ر ┘é┘è╪د╪»╪ر ╪│╪د╪▒┘è╪ر╪ا" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm" />
                        </div>
                        <div className="md:col-span-4">
                          <label className="text-xs font-bold text-slate-500 mb-1 block">┘┘ê╪╣ ╪د┘╪ح╪ش╪د╪ذ╪ر</label>
                          <select disabled={isLocked} value={newKqType} onChange={(e) => setNewKqType(e.target.value as any)} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm appearance-none cursor-pointer">
                            <option value="yes_no">┘╪╣┘à / ┘╪د</option>
                            <option value="options">╪«┘è╪د╪▒╪د╪ز ┘à╪ز╪╣╪»╪»╪ر</option>
                            <option value="age_condition">╪┤╪▒╪╖ ╪د┘╪╣┘à╪▒</option>
                          </select>
                        </div>
                        {newKqType === "age_condition" && (
                          <div className="md:col-span-12 flex gap-4 mt-2">
                            <input type="number" disabled={isLocked} value={newKqMinAge} onChange={(e) => setNewKqMinAge(e.target.value ? Number(e.target.value) : "")} placeholder="╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë (╪د╪«╪ز┘è╪د╪▒┘è)" className="w-1/2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm" />
                            <input type="number" disabled={isLocked} value={newKqMaxAge} onChange={(e) => setNewKqMaxAge(e.target.value ? Number(e.target.value) : "")} placeholder="╪د┘╪ص╪» ╪د┘╪ث╪╣┘┘ë (╪د╪«╪ز┘è╪د╪▒┘è)" className="w-1/2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm" />
                          </div>
                        )}
                        <div className="md:col-span-2 flex items-end">
                          <button type="button" disabled={isLocked} onClick={(e) => { e.preventDefault(); if (!newKqText.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "┘è╪▒╪ش┘ë ╪ح╪»╪«╪د┘ ┘╪╡ ╪د┘╪│╪ج╪د┘!", type: "warning" } })); return; } setKnockoutQuestions([...knockoutQuestions, { text: newKqText.trim(), type: newKqType, options: newKqType === "options" ? newKqOptions : undefined, requiredAnswer: newKqType === "age_condition" ? "" : (newKqType === "yes_no" ? "┘╪╣┘à" : newKqOptions[0]), minAge: newKqType === "age_condition" && newKqMinAge !== "" ? Number(newKqMinAge) : undefined, maxAge: newKqType === "age_condition" && newKqMaxAge !== "" ? Number(newKqMaxAge) : undefined }]); setNewKqText(""); setNewKqMinAge(""); setNewKqMaxAge(""); }} className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white transition-all font-bold py-3 px-4 rounded-xl text-sm h-[46px] flex items-center justify-center gap-2">
                            <Plus size={16} /> ╪ث╪╢┘
                          </button>
                        </div>
                      </div>
                      {knockoutQuestions.length > 0 && (
                        <div className="space-y-3 mt-6">
                          {knockoutQuestions.map((q, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                              <div><p className="font-bold text-navy dark:text-white text-sm mb-1">{q.text}</p>
                                <p className="text-xs text-slate-500">{q.type === "age_condition" ? `╪┤╪▒╪╖ ╪د┘╪╣┘à╪▒: ┘à┘ ${q.minAge}${q.maxAge ? ` ╪ح┘┘ë ${q.maxAge}` : " ┘╪ث┘â╪س╪▒"}` : `${q.type === "yes_no" ? "┘╪╣┘à/┘╪د" : "╪«┘è╪د╪▒╪د╪ز ┘à╪ز╪╣╪»╪»╪ر"} - ╪د┘╪ح╪ش╪د╪ذ╪ر ╪د┘┘à╪╖┘┘ê╪ذ╪ر:`} {q.type !== "age_condition" && <span className="font-bold text-primary">{q.requiredAnswer}</span>}</p></div>
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
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 block">┘╪╖╪د┘é ╪د┘╪▒╪د╪ز╪ذ ╪د┘┘à╪ز┘ê┘é╪╣ (╪▒┘è╪د┘) <span className="text-slate-400 font-normal ml-1">(╪د╪«╪ز┘è╪د╪▒┘è)</span></label>
                    <div className="flex items-center gap-4">
                      <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="┘à┘..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                      <span className="text-slate-400 font-bold">-</span>
                      <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="╪ح┘┘ë..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                    </div>
                    <div className="relative mt-3 flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input type="checkbox" className="sr-only peer" checked={isSalaryHidden} onChange={(e) => setIsSalaryHidden(e.target.checked)} />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                        <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">╪ح╪«┘╪د╪ة ╪د┘╪▒╪د╪ز╪ذ ╪╣┘ ╪د┘┘à╪ز┘é╪»┘à┘è┘</span>
                      </label>
                    </div>
                    <div className="mt-5 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                          <Settings size={18} className="text-slate-400" />
                          <span className="text-sm font-bold">╪│╪ج╪د┘ ╪د┘┘à╪ز┘é╪»┘à ╪╣┘ ╪د┘╪▒╪د╪ز╪ذ ╪د┘┘à╪ز┘ê┘é╪╣</span>
                        </div>
                        <div className="relative min-w-[220px]">
                          <select
                            value={askExpectedSalary}
                            onChange={(e) => setAskExpectedSalary(e.target.value as any)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-bold appearance-none cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            <option value="hidden">╪╣╪»┘à ╪د┘╪│╪ج╪د┘</option>
                            <option value="open">╪│╪ج╪د┘ ┘à┘╪ز┘ê╪ص</option>
                            <option value="ranges">╪«┘è╪د╪▒╪د╪ز ┘à╪ص╪»╪»╪ر</option>
                          </select>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown size={16} />
                          </div>
                        </div>
                      </div>

                      {askExpectedSalary === "ranges" && (
                        <div className="mt-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">┘╪╖╪د┘é╪د╪ز ╪د┘╪▒╪د╪ز╪ذ (╪د╪╢╪║╪╖ Enter ┘┘╪ح╪╢╪د┘╪ر)</label>
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
                              <span className="text-sm text-slate-400 font-medium py-1.5">┘┘à ┘è╪ز┘à ╪ح╪╢╪د┘╪ر ╪ث┘è ┘╪╖╪د┘é╪د╪ز ╪ذ╪╣╪»...</span>
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
                                  else if (max) rangeStr = `╪ص╪ز┘ë ${max}`;

                                  if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                    setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                    setSalaryRangeMinInput('');
                                    setSalaryRangeMaxInput('');
                                  }
                                }
                              }}
                              placeholder="╪د┘╪ص╪» ╪د┘╪ث╪»┘┘ë (┘à╪س╪د┘: 4000)"
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
                                  else if (max) rangeStr = `╪ص╪ز┘ë ${max}`;

                                  if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                    setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                    setSalaryRangeMinInput('');
                                    setSalaryRangeMaxInput('');
                                  }
                                }
                              }}
                              placeholder="╪د┘╪ص╪» ╪د┘╪ث╪╣┘┘ë (┘à╪س╪د┘: 6000)"
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
                                else if (max) rangeStr = `╪ص╪ز┘ë ${max}`;

                                if (rangeStr && !expectedSalaryRanges.includes(rangeStr)) {
                                  setExpectedSalaryRanges(prev => [...prev, rangeStr]);
                                  setSalaryRangeMinInput('');
                                  setSalaryRangeMaxInput('');
                                }
                              }}
                              className="px-4 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                            >
                              ╪ح╪╢╪د┘╪ر
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="md:col-span-2 flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-navy dark:text-white flex items-center gap-2"><Calendar className="text-primary" size={16} /> ╪د┘╪ز┘ê╪د╪▒┘è╪« ┘ê╪د┘╪ش╪»┘ê┘╪ر</label>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <span className="ml-3 font-bold text-sm text-navy dark:text-white">╪ح╪╣┘╪د┘ ┘à╪│╪ز┘à╪▒ (┘à┘╪ز┘ê╪ص ╪»╪د╪خ┘à╪د┘ï)</span>
                        <input type="checkbox" className="sr-only peer" checked={isOpenEnded} onChange={(e) => setIsOpenEnded(e.target.checked)} />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2">╪ذ╪»╪ة ╪د┘╪ز┘é╪»┘è┘à</label>
                      <input required type="datetime-local" lang="en" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-left" dir="ltr" />
                    </div>
                    {!isOpenEnded && (
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy dark:text-white mr-2">╪د┘╪ز┘ç╪د╪ة ╪د┘╪ز┘é╪»┘è┘à</label>
                        <input required type="datetime-local" lang="en" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-left" dir="ltr" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${status === "┘╪┤╪╖" ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-400 dark:text-slate-500"}`}><CheckCircle size={20} /></div>
                      <div>
                        <p className="font-bold text-navy dark:text-white">╪ص╪د┘╪ر ╪د┘┘ê╪╕┘è┘╪ر: {status}</p><p className="text-xs text-slate-500 font-medium">╪ز╪ص┘ê┘è┘ ╪د┘╪ص╪د┘╪ر ╪ح┘┘ë {status === "┘╪┤╪╖" ? "┘à╪║┘┘é" : "┘╪┤╪╖"}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setStatus(status === "┘╪┤╪╖" ? "┘à╪║┘┘é" : "┘╪┤╪╖")} className={`w-14 h-8 rounded-full relative transition-all ${status === "┘╪┤╪╖" ? "bg-green-500" : "bg-slate-300"}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white dark:bg-slate-800 rounded-full transition-all ${status === "┘╪┤╪╖" ? "left-1" : "left-7"}`} />
                    </button>
                  </div>
                </div>
                <button type="submit"
                  className="w-full bg-primary text-white py-3 md:py-4 mt-4 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {" "}
                  <Save size={20} /> ╪ص┘╪╕ ╪د┘╪ز╪╣╪»┘è┘╪د╪ز{" "}
                </button>{" "}
              </form>{" "}
            </motion.div>{" "}
          </div>{" "}
          <div className="space-y-8">
            {" "}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
              {" "}
              <h3 className="font-bold text-navy dark:text-white mb-6">
                ╪ح╪ص╪╡╪د╪خ┘è╪د╪ز ╪│╪▒┘è╪╣╪ر
              </h3>{" "}
              <div className="space-y-4">
                {" "}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  {" "}
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-1">
                    ╪ح╪ش┘à╪د┘┘è ╪د┘┘à╪ز┘é╪»┘à┘è┘
                  </p>{" "}
                  <p className="text-2xl font-bold text-navy dark:text-white">
                    {job.applicants}
                  </p>{" "}
                </div>{" "}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  {" "}
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-1">
                    ╪ز╪د╪▒┘è╪« ╪د┘┘╪┤╪▒
                  </p>{" "}
                  <p className="text-lg font-bold text-navy dark:text-white">
                    {job.createdAt}
                  </p>{" "}
                </div>{" "}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  {" "}
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-1">
                    ╪▒╪د╪ذ╪╖ ╪د┘╪ز┘é╪»┘è┘à
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
                      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪ز┘à ┘╪│╪« ╪د┘╪▒╪د╪ذ╪╖ ╪ذ┘╪ش╪د╪ص.", type: "success" } }));
                    }}
                    className="text-primary text-sm font-bold flex items-center gap-2 hover:underline"
                  >
                    {" "}
                    <Share2 size={16} /> ┘╪│╪« ╪د┘╪▒╪د╪ذ╪╖ ╪د┘┘à╪ذ╪د╪┤╪▒{" "}
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
              <h3 className="text-xl font-bold mb-2">╪د┘┘ç╪»┘ ╪د┘╪ز╪ص┘┘è┘┘è ╪د┘┘╪┤╪╖</h3>{" "}
              <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-6">
                {" "}
                ┘è┘é┘ê┘à ╪د┘┘╪╕╪د┘à ╪ص╪د┘┘è╪د┘ï ╪ذ╪ز╪ص┘┘è┘ {job.applicants} ╪│┘è╪▒╪ر ╪░╪د╪ز┘è╪ر ┘┘ç╪░╪د
                ╪د┘╪┤╪د╪║╪▒. ┘è┘à┘â┘┘â ╪▒╪ج┘è╪ر ╪د┘┘╪ز╪د╪خ╪ش ┘┘è ┘é╪د╪خ┘à╪ر ╪د┘┘à╪▒╪┤╪ص┘è┘.{" "}
              </p>{" "}
              <button className="w-full py-3 bg-white dark:bg-white/20 hover:bg-white/90 dark:hover:bg-white/30 text-navy dark:text-white rounded-xl font-bold text-sm transition-all focus:ring-4 focus:ring-primary/20">
                {" "}
                ╪ز╪ص╪»┘è╪س ╪د┘╪ز╪ص┘┘è┘{" "}
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
          window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "╪ز┘à ┘╪│╪« ╪د┘╪▒╪د╪ذ╪╖ ┘ê╪ز┘╪╣┘è┘ ╪د┘╪ص╪│╪د╪ذ ╪ذ┘╪ش╪د╪ص!", type: "success" } }));
        }}
      />
    </div>
  );
};
export default CreateJob;
