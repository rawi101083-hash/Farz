?/** * @license * SPDX-License-Identifier: Apache-2.0 */
import React, { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from "react";

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    // @ts-ignore
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // @ts-ignore
      return this.props.fallback || (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl m-8">
          <h2 className="text-xl font-bold mb-4">حدث خطأ غير متوقع</h2>
          {/* @ts-ignore */}
          <pre className="text-left text-sm whitespace-pre-wrap overflow-auto max-h-96">{this.state.error?.stack}</pre>
        </div>
      );
    }
    // @ts-ignore
    return this.props.children;
  }
}

import { motion, AnimatePresence } from "motion/react";
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
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import skillsDictionaryRaw from "./skillsDictionary.json";
import { FEATURE_FLAGS } from "./config";
const skillsDictionary: Record<string, string[]> = skillsDictionaryRaw;

const getUserSavedSkills = (): Record<string, string[]> => {
  try {
    const saved = localStorage.getItem("userCustomSkills");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const saveUserSkills = (title: string, skills: string[]) => {
  if (!title.trim() || !skills || skills.length === 0) return;
  const normalizedTitle = title.trim();
  const allSaved = getUserSavedSkills();
  const existingForRole = new Set(allSaved[normalizedTitle] || []);
  skills.forEach((s) => existingForRole.add(s));
  allSaved[normalizedTitle] = Array.from(existingForRole);
  localStorage.setItem("userCustomSkills", JSON.stringify(allSaved));
};

const SAUDI_CITIES = [
  "عن بعد",
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الظهران",
  "الجبيل",
  "الأحساء",
  "الطائف",
  "تبوك",
  "أبها",
  "خميس مشيط",
  "جازان",
  "نجران",
  "حائل",
  "بريدة",
  "عنيزة",
  "ينبع",
  "الباحة",
  "عرعر",
  "سكاكا",
  "القريات",
  "حفر الباطن",
  "الخرج",
  "المجمعة",
  "الدوادمي",
  "بيشة",
  "محايل عسير"
];

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = "ابحث واختر..."
}: {
  options: string[],
  value: string,
  onChange: (val: string) => void,
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl cursor-pointer flex justify-between items-center transition-all hover:border-primary font-medium"
      >
        <span className={!value ? "text-slate-400" : ""}>{value || placeholder}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
              <div className="relative">
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="ابحث..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary/50 text-sm font-medium dark:text-white"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(opt => (
                  <div 
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`px-4 py-3 rounded-xl cursor-pointer transition-all text-sm font-bold ${value === opt ? "bg-primary text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                  >
                    {opt}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-slate-400 font-medium">لا توجد نتائج مطابقة</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

const VerificationModal = ({ isOpen, onClose, onVerify }: { isOpen: boolean, onClose: () => void, onVerify: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-800 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={24} />
        </button>
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-bold text-navy dark:text-white mb-2 text-center">
          توثيق الحساب مطلوب
        </h3>
        <p className="text-slate-500 mb-8 text-center text-sm leading-relaxed">
          يرجى إكمال توثيق حساب شركتك لتتمكن من استخدام هذه الميزة.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-2xl font-bold transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={onVerify}
            className="flex-1 py-4 bg-primary text-white hover:bg-primary/90 rounded-2xl font-bold transition-all"
          >
            توثيق الآن
          </button>
        </div>
      </motion.div>
    </div>
  );
};
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
// --- Types ---
type FlowStep =
  | "landing"
  | "form"
  | "dashboard"
  | "login"
  | "registerCompany"
  | "superAdmin"
  | "applicantDetails"
  | "createJob"
  | "jobSuccess"
  | "publicJob"
  | "manageJob";
interface CustomAttachment {
  attachment_name: string;
  attachment_type: "file" | "link" | "image" | "video" | "document" | "mixed_file";
  required?: boolean;
}
interface Role {
  id: string;
  title: string;
  description: string;
  roleSummary?: string;
  responsibilities?: string;
  qualifications?: string;
  benefits?: string;
  aiInstructions?: string;
  skills?: string[];
  languages?: string[];
  customQuestions?: { text: string; type: string; options?: string[]; required?: boolean }[];
  requiredAttachments?: string[];
  customAttachments?: CustomAttachment[];
  location?: string;
  locations?: string[];
  targetMajors?: string[];
  type?: string;
  experience?: string;
  qualification?: string;
  salaryMin?: string;
  salaryMax?: string;
  isSalaryHidden?: boolean;
  knockoutQuestions?: { text: string; type: "yes_no" | "options"; options?: string[]; requiredAnswer: string }[];
  requireVoiceInterview?: boolean;
  voiceInterviewTemplate?: "general" | "sales" | "custom";
  voiceInterviewQuestions?: string[];
  photoRequirement?: "optional" | "required" | "none";
  portfolioRequirement?: "optional" | "required" | "none";
  directUpload?: boolean;
}
interface Job {
  id: string;
  recordType?: "single" | "campaign" | "quick_link";
  campaignTitle?: string;
  campaignDescription?: string;
  welcomeMessage?: string;
  roles?: Role[];
  // Legacy or default fields fallback
  title: string;
  company: string;
  entityType?: "company" | "freelance";
  city?: string;
  type: string;
  description: string;
  roleSummary?: string;
  responsibilities?: string;
  qualifications?: string;
  benefits?: string;
  aiInstructions?: string;
  applicants: number;
  status: "نشط" | "مغلق" | "مسودة";
  createdAt: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  locations?: string[];
  targetMajors?: string[];
  experience?: string;
  qualification?: string;
  salaryMin?: string;
  salaryMax?: string;
  skills?: string[];
  languages?: string[];
  customQuestions?: { text: string; type: string; options?: string[]; required?: boolean }[];
  requiredAttachments?: string[];
  customAttachments?: CustomAttachment[];
  titles?: string[];
  companyLogo?: string;
  directUpload?: boolean;
  requireVoiceInterview?: boolean;
  voiceInterviewTemplate?: "general" | "sales" | "custom";
  voiceInterviewQuestions?: string[];
  photoRequirement?: "hidden" | "optional" | "required";
  portfolioRequirement?: "required" | "optional";
  isSalaryHidden?: boolean;
  knockoutQuestions?: { text: string; type: "yes_no" | "options"; options?: string[]; requiredAnswer: string }[];
}
// --- Components ---
const ImageLightbox = ({ url, onClose }: { url: string | null; onClose: () => void }) => (
  <AnimatePresence>
    {url && (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-5xl max-h-[90vh] w-full p-4 flex items-center justify-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors z-10 backdrop-blur-sm"
          >
            <X size={24} />
          </button>
          <img src={url} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const EmptyState = ({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel: string;
  onAction: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 px-8 text-center bg-white dark:bg-slate-800 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-700 shadow-sm"
  >
    {" "}
    <div className="relative mb-10">
      {" "}
      <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center relative z-10">
        {" "}
        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[32px] shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-300">
          {" "}
          <Search size={40} strokeWidth={1.5} />{" "}
        </div>{" "}
      </div>{" "}
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-mint/20 rounded-2xl blur-xl animate-pulse" />{" "}
      <div
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />{" "}
    </div>{" "}
    <h3 className="text-2xl font-bold text-navy dark:text-white mb-4 max-w-md leading-relaxed">
      {" "}
      {title}{" "}
    </h3>{" "}
    <button
      onClick={onAction}
      className="bg-mint dark:bg-[#065f46] text-employer-green dark:text-[#a7f3d0] px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#34d399] transition-all shadow-xl shadow-mint/20 active:scale-95 flex items-center gap-3 mt-4"
    >
      {" "}
      {actionLabel} <Plus size={20} />{" "}
    </button>{" "}
  </motion.div>
);
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

const OnboardingModal = ({ isOpen, onClose, userProfile, setUserProfile, onPublishDraft }: { isOpen: boolean; onClose: () => void; userProfile: any; setUserProfile: any; onPublishDraft?: () => void; }) => {
  const [entityType, setEntityType] = useState<"company" | "freelance">(userProfile.entityType || "company");
  const [companyName, setCompanyName] = useState(userProfile.companyName || "");
  const [crNumber, setCrNumber] = useState(userProfile.commercialRegistration || "");
  const [freelanceDoc, setFreelanceDoc] = useState(userProfile.freelanceDocument || "");
  const [city, setCity] = useState(userProfile.city || "");

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
  const link = `https://farz.sa/apply/${job.id}`;
  const copyToClipboard = () => {
    const verified = localStorage.getItem("company_verified") === "true";
    if (!verified) {
      setShowVerificationModal(true);
      return;
    }
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
            العودة للوحة التحكم{" "}
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
const PublicJobPage = ({ 
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
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
    <div className="min-h-screen bg-slate-100 pt-32 pb-20 px-4">
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
                    {((activeRole?.locations?.length ? activeRole.locations : job.locations?.length ? job.locations : (activeRole?.location || job.location) ? [activeRole?.location || job.location] : []) as string[]).map((loc, idx) => (
                      <div key={idx} className="inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm">
                        <MapPin size={16} className="text-white/80 shrink-0" /> {loc}
                      </div>
                    ))}
                    {(activeRole?.experience || job.experience) && (
                      <div className="inline-flex items-center justify-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-bold shadow-sm backdrop-blur-sm">
                        <Briefcase size={16} className="text-white/80 shrink-0" /> {activeRole?.experience || job.experience}
                      </div>
                    )}
                    {(activeRole?.qualification || job.qualification) && (
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
              <>
                {job.recordType !== "campaign" && job.campaignDescription && (
                  <div className="bg-primary/5 border border-primary/20 rounded-[28px] p-8 -mt-4 mb-8 text-center shadow-sm">
                     <p className="text-navy dark:text-white font-medium text-lg leading-relaxed"><Sparkles className="inline-block mr-2 -mt-1 text-primary" size={24} /> {job.campaignDescription}</p>
                  </div>
                )}
                
                <div className="pb-10">
                  <h3 className="text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full" /> نبذة عن الدور
                  </h3>
                  <div className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap text-lg">
                    {activeRole?.roleSummary || job.roleSummary || activeRole?.description || job.description}
                  </div>
                </div>

                {((activeRole?.targetMajors?.length ?? 0) > 0 || (job.targetMajors?.length ?? 0) > 0) && (
                  <div className="pt-10 border-t border-slate-100 dark:border-slate-700 pb-10">
                    <h3 className="text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-2 h-8 bg-primary rounded-full" /> التخصصات المطلوبة
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(activeRole?.targetMajors || job.targetMajors || []).map((major, i) => (
                        <span key={i} className="inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold border border-blue-200 dark:border-blue-800/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                          {major}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(activeRole?.responsibilities || job.responsibilities) && (
                  <div className="pt-10 border-t border-slate-100 dark:border-slate-700 pb-10">
                    <h3 className="text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-2 h-8 bg-primary rounded-full" /> المهام والمسؤوليات
                    </h3>
                    <ul className="space-y-4 list-none">
                      {(activeRole?.responsibilities || job.responsibilities || '').split('\n').filter(r => r.trim()).map((res, i) => (
                         <li key={i} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-lg">
                           <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><CheckCircle size={14} /></div>
                           <span className="leading-relaxed">{res.trim()}</span>
                         </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(activeRole?.qualifications || job.qualifications) && (
                  <div className="pt-10 border-t border-slate-100 dark:border-slate-700 pb-10">
                    <h3 className="text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-2 h-8 bg-primary rounded-full" /> المؤهلات والمتطلبات
                    </h3>
                    <ul className="space-y-4 list-none">
                       {(activeRole?.qualifications || job.qualifications || '').split('\n').filter(q => q.trim()).map((qual, i) => (
                         <li key={i} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-lg">
                           <div className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0" />
                           <span className="leading-relaxed">{qual.trim()}</span>
                         </li>
                       ))}
                    </ul>
                  </div>
                )}

                {(activeRole?.benefits || job.benefits) && (
                  <div className="pt-10 border-t border-slate-100 dark:border-slate-700 pb-10">
                    <h3 className="text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-2 h-8 bg-primary rounded-full" /> المميزات (Benefits)
                    </h3>
                    <div className="flex flex-wrap gap-3">
                       {(activeRole?.benefits || job.benefits || '').split('\n').filter(b => b.trim()).map((ben, i) => (
                         <span key={i} className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-6 py-3 rounded-2xl text-sm font-bold border border-emerald-100 dark:border-emerald-800/30 shadow-sm flex items-center gap-2">
                           <Star size={16} className="text-emerald-500" /> {ben.trim()}
                         </span>
                       ))}
                    </div>
                  </div>
                )}
                {(activeRole?.skills || job.skills) && (activeRole?.skills?.length || job.skills?.length) ? (
                  <div className="pt-10 border-t border-slate-100 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-2 h-8 bg-primary rounded-full" /> المهارات المطلوبة
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(activeRole?.skills || job.skills || []).map((skill) => (
                        <span key={skill} className="bg-slate-50 dark:bg-slate-800/50 text-navy dark:text-white px-6 py-3 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-700 shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {(activeRole?.languages || job.languages) && (activeRole?.languages?.length || job.languages?.length) ? (
                  <div className="pt-10 border-t border-slate-100 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-2 h-8 bg-primary rounded-full" /> اللغات المطلوبة
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(activeRole?.languages || job.languages || []).map((lang) => (
                        <span key={lang} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-6 py-3 rounded-2xl text-sm font-bold border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="pt-10 border-t border-slate-100 dark:border-slate-700">
                  <button onClick={onApply} className="w-full bg-primary text-white py-6 rounded-[24px] text-xl font-bold hover:bg-teal-600 transition-all shadow-xl shadow-primary/20 active:scale-[0.98]">
                    التقديم على هذه الوظيفة الآن
                  </button>
                  <p className="text-center text-slate-400 dark:text-slate-500 mt-6 text-sm font-medium">
                    يتم فرز الطلبات آلياً لضمان الشفافية وسرعة الرد
                  </p>
                </div>
              </>
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
  const [title, setTitle] = useState(job.title || job.campaignTitle || "");
  const [company, setCompany] = useState(job.company || "");
  const [location, setLocation] = useState(job.location || "");
  const [experience, setExperience] = useState(job.experience || "بدون خبرة");
  const [qualification, setQualification] = useState(job.qualification || "ثانوي");
  const [salaryMin, setSalaryMin] = useState(job.salaryMin || "");
  const [salaryMax, setSalaryMax] = useState(job.salaryMax || "");
  const [isSalaryHidden, setIsSalaryHidden] = useState(job.isSalaryHidden || false);
  const [type, setType] = useState(job.type || "دوام كامل");
  const [description, setDescription] = useState(job.description || job.campaignDescription || "");
  const [status, setStatus] = useState(job.status || "نشط");
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
      alert("تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء");
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
      type,
      description,
      status,
      skills: selectedSkills,
      languages: selectedLanguages,
      startDate,
      endDate: isOpenEnded ? undefined : endDate,
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
                {" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {" "}
                  <div className="space-y-2">
                    {" "}
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">
                      المسمى الوظيفي <span className="text-red-500">*</span>
                    </label>{" "}
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                      required
                    />{" "}
                  </div>{" "}
                  <div className="space-y-2">
                    {" "}
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">
                      الشركة / الفرع <span className="text-red-500">*</span>
                    </label>{" "}
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                      required
                    />{" "}
                  </div>{" "}
                </div>{" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    {" "}
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">
                      نوع العمل <span className="text-red-500">*</span>
                    </label>{" "}
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer"
                    >
                      {" "}
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دوام كامل</option> <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دوام جزئي</option>{" "}
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">عن بعد</option> <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">تدريب</option>{" "}
                    </select>{" "}
                  </div>{" "}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">
                      مقر العمل / المدينة <span className="text-red-500">*</span>
                    </label>
                    <SearchableSelect
                      options={SAUDI_CITIES}
                      value={location}
                      onChange={setLocation}
                      placeholder="اختر مقر العمل"
                    />
                  </div>
                </div>{" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">
                      سنوات الخبرة المطلوبة <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer"
                    >
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">بدون خبرة</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">1-3 سنوات</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">3-5 سنوات</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">5+ سنوات</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">
                      الحد الأدنى للمؤهل <span className="text-slate-400 font-normal ml-1">(اختياري)</span>
                    </label>
                    <select
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer"
                    >
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ثانوي</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دبلوم</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">بكالوريوس</option>
                      <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ماجستير</option>
                    </select>
                  </div>
                </div>{" "}
                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <label className="text-sm font-bold text-navy dark:text-white mr-2 block">
                    نطاق الراتب المتوقع (ريال) <span className="text-slate-400 font-normal ml-1">(اختياري)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="من..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                    />
                    <span className="text-slate-400 font-bold">-</span>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="إلى..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                    />
                  </div>
                  <div className="relative mt-3 flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" className="sr-only peer" checked={isSalaryHidden} onChange={(e) => setIsSalaryHidden(e.target.checked)} />
                      <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                      <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء الراتب عن المتقدمين (يُستخدم للفرز الآلي فقط)</span>
                    </label>
                  </div>
                </div>{" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="md:col-span-2 flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-navy dark:text-white flex items-center gap-2">
                      <Calendar className="text-primary" size={16} /> التواريخ والجدولة
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <span className="ml-3 font-bold text-sm text-navy dark:text-white">إعلان مستمر (مفتوح دائماً)</span>
                      <input type="checkbox" className="sr-only peer" checked={isOpenEnded} onChange={(e) => setIsOpenEnded(e.target.checked)} />
                      <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy dark:text-white mr-2">
                      بدء التقديم
                    </label>{" "}
                    <input
                      required
                      type="datetime-local"
                      lang="en"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-left"
                      dir="ltr"
                    />{" "}
                  </div>{" "}
                  {!isOpenEnded && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2">
                        انتهاء التقديم
                      </label>{" "}
                      <input
                        required
                        type="datetime-local"
                        lang="en"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-left"
                        dir="ltr"
                      />{" "}
                    </div>
                  )}
                  {isOpenEnded && (
                    <div className="space-y-2 flex items-center h-full pt-6">
                      <p className="text-xs text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 line-clamp-2">(سيبقى الإعلان متاحاً حتى يتم إغلاقه يدوياً)</p>
                    </div>
                  )}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">
                    وصف الوظيفة والمتطلبات <span className="text-red-500">*</span>
                  </label>{" "}
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none min-h-[100px]"
                    placeholder="اكتب وصفاً مفصلاً للوظيفة والمهارات المطلوبة..."
                    required
                  />{" "}
                </div>{" "}
                <div className="space-y-4">
                  {" "}
                  <div className="flex items-center justify-between">
                    {" "}
                    <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                      المهارات والتفضيلات <span className="text-slate-400 font-normal ml-1">(اختياري)</span>
                    </label>{" "}
                  </div>{" "}
                  <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl">
                    {" "}
                    {selectedSkills.length === 0 && (
                      <span className="text-sm text-slate-400 dark:text-slate-500 py-2">
                        لم يتم اختيار مهارات بعد...
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
                      className="w-full pr-6 pl-14 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                    />{" "}
                    <button
                      type="button"
                      onClick={addCustomSkill}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary hover:border-primary transition-all"
                    >
                      {" "}
                      <Plus size={20} />{" "}
                    </button>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 block">
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
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none hover:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium appearance-none cursor-pointer"
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
                </div>{" "}
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700">
                  {" "}
                  <div className="flex items-center gap-4">
                    {" "}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${status === "نشط" ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-400 dark:text-slate-500"}`}
                    >
                      {" "}
                      <CheckCircle size={20} />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <p className="font-bold text-navy dark:text-white">
                        حالة الوظيفة: {status}
                      </p>{" "}
                      <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
                        تحويل الحالة إلى {status === "نشط" ? "مغلق" : "نشط"}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <button
                    type="button"
                    onClick={() => setStatus(status === "نشط" ? "مغلق" : "نشط")}
                    className={`w-14 h-8 rounded-full relative transition-all ${status === "نشط" ? "bg-green-500" : "bg-slate-300"}`}
                  >
                    {" "}
                    <div
                      className={`absolute top-1 w-6 h-6 bg-white dark:bg-slate-800 rounded-full transition-all ${status === "نشط" ? "left-1" : "left-7"}`}
                    />{" "}
                  </button>{" "}
                </div>{" "}
                  <button
                    type="submit"
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
                      const verified = localStorage.getItem("company_verified") === "true";
                      if (!verified) {
                        setShowVerificationModal(true);
                        return;
                      }
                      navigator.clipboard.writeText(
                        `https://farz.sa/apply/${job.id}`,
                      );
                      alert("تم نسخ الرابط");
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
            `https://farz.sa/apply/${job.id}`,
          );
          alert("تم نسخ الرابط وتفعيل الحساب بنجاح!");
        }}
      />
    </div>
  );
};
const ApplicantDetails = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<"analysis" | "audio" | "questions">("analysis");
  
  // Simulated candidate data for conditional rendering of contact info
  const candidate = {
    linkedin: "https://linkedin.com/in/ahmed",
    whatsapp: "966500000000",
    email: "ahmed@example.com",
    phone: "966500000000"
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8 pt-24 lg:pt-10">
      {" "}
      <div className="max-w-7xl mx-auto">
        {" "}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onBack(); }}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary font-bold mb-8 transition-colors group"
        >
          {" "}
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 flex items-center justify-center group-hover:border-primary transition-all">
            {" "}
            <ArrowLeft size={18} className="rotate-180" />{" "}
          </div>{" "}
          العودة للوحة التحكم{" "}
        </button>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {" "}
          {/* Right Column - AI Analysis & Audio (6 columns) */}{" "}
          <div className="lg:col-span-5 space-y-8 order-1 lg:order-2">
            {" "}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white dark:border-slate-700 relative overflow-hidden">
              {" "}
              <div className="absolute top-0 left-0 w-full h-2 bg-primary/20" />{" "}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <h2 className="text-4xl font-bold text-navy dark:text-white mb-2">
                      أحمد علي
                    </h2>{" "}
                    <p className="text-primary font-bold text-lg">
                      مهندس برمجيات أول
                    </p>{" "}
                  </div>
                </div>{" "}
              <div className="flex flex-col items-center justify-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] mb-10 border border-slate-100 dark:border-slate-700">
                {" "}
                <div className="relative w-40 h-40 mb-6">
                  {" "}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {" "}
                    <circle
                      className="text-slate-200 stroke-current"
                      strokeWidth="8"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    />{" "}
                    <circle
                      className="text-primary stroke-current"
                      strokeWidth="8"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - 0.90)}
                    />{" "}
                  </svg>{" "}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {" "}
                    <span className="text-3xl font-bold text-navy dark:text-white">
                      90%
                    </span>{" "}
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      مطابقة
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <p className="text-navy dark:text-white font-bold">
                  توافق عالي جداً مع متطلبات الوظيفة
                </p>{" "}
              </div>{" "}
              <div className="flex bg-slate-50 dark:bg-slate-800/30 p-1.5 rounded-2xl mb-8 border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("analysis")}
                  className={`min-w-[120px] flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === "analysis" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
                >
                  المطابقة والتحليل
                </button>
                <button
                  onClick={() => setActiveTab("audio")}
                  className={`min-w-[120px] flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === "audio" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
                >
                  الردود الصوتية
                </button>
                <button
                  onClick={() => setActiveTab("questions")}
                  className={`min-w-[120px] flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === "questions" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
                >
                  أسئلة مقترحة
                </button>
              </div>

              {activeTab === "analysis" && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center gap-2">
                      <Sparkles size={20} className="text-primary" /> التوصية النهائية
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      يُظهر المتقدم قدرات تقنية وقيادية قوية في تطوير البرمجيات. لزيادة دقة القرار، ينصح بالتركيز في المقابلة على خبرة الواجهات الخلفية وطلب أمثلة عملية حول نتائج المشاريع التي تفاعل معها بشكل مباشر.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#F0FDF4] dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 p-6 rounded-[32px]">
                       <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                         <CheckCircle size={18} /> أبرز نقاط القوة
                       </h4>
                       <ul className="space-y-2">
                         <li className="flex gap-2 text-sm text-green-800 dark:text-green-300/90 leading-relaxed font-bold">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                           خبرة متقدمة في تطوير تطبيقات الويب باستخدام React, Node.js, TypeScript, و AWS
                         </li>
                         <li className="flex gap-2 text-sm text-green-800 dark:text-green-300/90 leading-relaxed font-bold">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                           قدرات قيادية مثبتة في إدارة الفرق وتسليم المشاريع التقنية
                         </li>
                       </ul>
                    </div>

                    <div className="bg-[#FFF7ED] dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 p-6 rounded-[32px]">
                       <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                         <Zap size={18} /> فجوات ونقاط الانتباه
                       </h4>
                       <ul className="space-y-2">
                         <li className="flex gap-2 text-sm text-orange-800 dark:text-orange-300/90 leading-relaxed font-bold">
                           <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                           إشارة محدودة لخبرة تطوير الواجهات الخلفية بشكل مكثف
                         </li>
                         <li className="flex gap-2 text-sm text-orange-800 dark:text-orange-300/90 leading-relaxed font-bold">
                           <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                           تفاصيل غير كافية حول المخرجات الفعلية للمشاريع السابقة والأرقام
                         </li>
                       </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "audio" && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-6">
                   {[
                      {
                        q: "حدثنا عن تحدي تقني واجهته مؤخراً وكيف قمت بحله؟",
                        tag: "تواصل فعّال ومباشر",
                        tagColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-[10px]",
                        time: "1:45"
                      },
                      {
                        q: "إذا اختلف أعضاء الفريق على حل تقني، كيف تتصرف؟",
                        tag: "نبرة واثقة ومنطقية",
                        tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-[10px]",
                        time: "2:10"
                      }
                   ].map((item, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex flex-col gap-3 mb-5">
                           <div className="flex items-start justify-between gap-4">
                             <h4 className="text-sm font-bold text-navy dark:text-white leading-relaxed">
                               {item.q}
                             </h4>
                             <span className={`px-3 py-1.5 rounded-full font-bold shrink-0 ${item.tagColor}`}>
                               {item.tag}
                             </span>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                          <button className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-md shadow-primary/20 shrink-0">
                            <Play size={20} fill="currentColor" className="text-white" />
                          </button>
                          <div className="flex-1 space-y-2">
                             <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                               <div className="h-full bg-primary w-1/3" />
                             </div>
                             <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                <span>0:00</span> <span>{item.time}</span>
                             </div>
                          </div>
                        </div>
                      </div>
                   ))}
                </motion.div>
              )}

              {activeTab === "questions" && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-4">
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-5 rounded-[24px] mb-6">
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-3">
                      <MessageCircle size={20} />
                      أسئلة مصممة للتركيز على الفجوات ونقاط التقييم الحرجة:
                    </p>
                  </div>
                  {[
                    {
                      q: "في سيرتك الذاتية، لاحظنا فجوة لمدة 6 أشهر تقريباً خلال عام 2021، هل يمكنك التوضيح عما كنت تفعله خلال تلك الفترة؟",
                      reason: "الهدف التحليلي: للتأكد من أسباب الانقطاع وهل أثرت على مسار التطوير المهني وتحديث المهارات."
                    },
                    {
                      q: "ذكرت خبرتك في Node.js، لكن كيف تقيم خبرتك الفعلية في التعامل مع خوادم AWS وتهيئتها من الصفر لمشاريع إنتاجية؟",
                      reason: "الهدف التحليلي: المهارة مذكورة ضمن الكلمات المفتاحية لكن السيرة تفتقر لأمثلة عملية وتطبيقات حقيقية."
                    },
                    {
                      q: "بناءً على ردك الصوتي حول طريقة تعاملك المنطقية مع الخلافات، هل يمكنك وضعنا في صورة موقف حقيقي فشلت فيه منهجيتك وكيف تكيفت معه؟",
                      reason: "الهدف التحليلي: النبرة واثقة، لكن كمنسق فريق نحتاج للتحقق من تقبله للخطأ وردة فعله عند عدم سير الأمور كما هو مخطط لها."
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                       <h4 className="font-bold text-navy dark:text-white mb-4 text-sm leading-relaxed flex items-start gap-3">
                         <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                           {idx + 1}
                         </span>
                         <span className="pt-1">{item.q}</span>
                       </h4>
                       <p className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 inline-block px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                         <span className="text-primary mr-1 text-sm bg-primary/10 px-2 py-0.5 rounded-lg ml-2">الهدف</span> 
                         {item.reason}
                       </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>{" "}
          </div>{" "}
          {/* Left Column - CV Viewer (7 columns) */}{" "}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col gap-6">
            {" "}
            <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white dark:border-slate-700 flex-1 min-h-[800px] flex flex-col overflow-hidden">
              {" "}
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                {" "}
                <div className="flex items-center gap-3">
                  {" "}
                  <FileText
                    size={20}
                    className="text-slate-400 dark:text-slate-500"
                  />{" "}
                  <span className="font-bold text-navy dark:text-white">
                    السيرة الذاتية - أحمد علي.pdf
                  </span>{" "}
                </div>{" "}
                <button className="text-primary font-bold text-sm hover:underline">
                  تحميل الملف
                </button>{" "}
              </div>{" "}
              <div className="flex-1 bg-slate-100 mx-8 mt-8 mb-6 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                {" "}
                <div className="text-center">
                  {" "}
                  <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    {" "}
                    <FileText size={40} className="text-slate-300" />{" "}
                  </div>{" "}
                  <p className="text-slate-400 dark:text-slate-500 font-bold">
                    عرض السيرة الذاتية (PDF)
                  </p>{" "}
                  <p className="text-xs text-slate-300 mt-2">
                    معاينة المستند قيد التحميل...
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              
              {/* Contact Icons - Bottom of CV Wrapper */}
              <div className="flex items-center justify-center gap-3 px-8 pb-8">
                {candidate.linkedin && (
                  <a href={candidate.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#0A66C2]/10 text-[#0A66C2] rounded-xl flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm" title="لينكد إن">
                    <Linkedin size={20} />
                  </a>
                )}
                {candidate.whatsapp && (
                  <a href={`https://wa.me/${candidate.whatsapp}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm" title="واتساب">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                  </a>
                )}
                {candidate.email && (
                  <a href={`mailto:${candidate.email}`} className="w-10 h-10 bg-navy/5 dark:bg-slate-700/50 text-navy dark:text-slate-200 rounded-xl flex items-center justify-center hover:bg-navy dark:hover:bg-slate-600 hover:text-white transition-all shadow-sm" title="إيميل">
                    <Mail size={20} />
                  </a>
                )}
                {candidate.phone && (
                  <a href={`tel:${candidate.phone}`} className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm" title="اتصال">
                    <Phone size={20} />
                  </a>
                )}
              </div>
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("إدارة الشركات");
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
      {" "}
      {/* Sidebar - Dark Mode */}{" "}
      <aside className="w-72 bg-[#0F172A] text-white p-6 hidden lg:flex flex-col fixed h-full right-0 z-30 shadow-2xl">
        {" "}
        <div className="flex items-center gap-3 mb-12 px-2">
          {" "}
          <LogoIcon />{" "}
          <div className="flex flex-col">
            {" "}
            <span className="text-lg font-bold tracking-tight">
              لوحة التحكم العليا
            </span>{" "}
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">
              Super Admin
            </span>{" "}
          </div>{" "}
        </div>{" "}
        <nav className="space-y-2 flex-1">
          {" "}
          {[
            { name: "نظرة عامة", icon: <LayoutDashboard size={20} /> },
            { name: "إدارة الشركات", icon: <Briefcase size={20} /> },
            { name: "الاشتراكات والفواتير", icon: <CreditCard size={20} /> },
            { name: "الإعدادات العامة", icon: <Settings size={20} /> },
            { name: "قاموس المهارات", icon: <FileText size={20} /> },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-semibold text-sm ${activeTab === item.name ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
            >
              {" "}
              {item.icon} <span>{item.name}</span>{" "}
            </button>
          ))}{" "}
        </nav>{" "}
        <div className="mt-auto pt-6 border-t border-white dark:border-slate-700/10">
          {" "}
          <button className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/5 rounded-xl transition-all font-bold text-sm">
            {" "}
            <LogOut size={20} /> <span>خروج الآمن</span>{" "}
          </button>{" "}
        </div>{" "}
      </aside>{" "}
      {/* Main Content */}{" "}
      <main className="flex-1 lg:mr-72 p-8 pt-20 lg:pt-8">
        {" "}
        <div className="max-w-7xl mx-auto space-y-8">
          
          {activeTab === "إدارة الشركات" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              {" "}
              <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">
                إدارة الشركات المشتركة
              </h1>{" "}
              <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
                مرحباً بك في لوحة تحكم النظام. يمكنك إدارة كافة الشركات
                والاشتراكات من هنا.
              </p>{" "}
            </div>{" "}
            <div className="flex gap-3">
              {" "}
              <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 dark:bg-slate-800/50 transition-all shadow-sm flex items-center gap-2">
                {" "}
                <Database size={18} /> قاعدة البيانات{" "}
              </button>{" "}
              <button className="bg-navy text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary transition-all shadow-lg flex items-center gap-2">
                {" "}
                <Zap size={18} /> تحديث النظام{" "}
              </button>{" "}
            </div>{" "}
          </header>{" "}
          {/* Companies Table */}{" "}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {" "}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50/30">
              {" "}
              <div className="flex items-center gap-4">
                {" "}
                <h3 className="font-bold text-navy dark:text-white">
                  الشركات المسجلة
                </h3>{" "}
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 px-3 py-1 rounded-full text-[10px] font-bold">
                  128 شركة
                </span>{" "}
              </div>{" "}
              <div className="flex gap-2">
                {" "}
                  <input
                  type="text"
                  placeholder="بحث عن شركة..."
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-60 font-medium dark:text-white dark:placeholder-slate-400"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="overflow-x-auto">
              {" "}
              <table className="w-full text-right">
                {" "}
                <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-200 text-[11px] uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                  {" "}
                  <tr>
                    {" "}
                    <th className="px-6 py-4 font-bold">اسم الشركة</th>{" "}
                    <th className="px-6 py-4 font-bold">الوظائف النشطة</th>{" "}
                    <th className="px-6 py-4 font-bold">
                      السير الذاتية المعالجة
                    </th>{" "}
                    <th className="px-6 py-4 font-bold">حالة الاشتراك</th>{" "}
                    <th className="px-6 py-4 font-bold">الإجراءات</th>{" "}
                  </tr>{" "}
                </thead>{" "}
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {" "}
                  {[
                    {
                      name: "شركة سحاب",
                      jobs: 3,
                      cvs: 150,
                      status: "فترة تجريبية",
                      color: "orange",
                    },
                    {
                      name: "مؤسسة الحلول الذكية",
                      jobs: 12,
                      cvs: 1240,
                      status: "نشط",
                      color: "teal",
                    },
                    {
                      name: "تقنية الغد",
                      jobs: 0,
                      cvs: 45,
                      status: "منتهي",
                      color: "red",
                    },
                    {
                      name: "مجموعة الرواد",
                      jobs: 8,
                      cvs: 890,
                      status: "نشط",
                      color: "teal",
                    },
                  ].map((company, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:bg-slate-800/50 transition-colors group"
                    >
                      {" "}
                      <td className="px-6 py-5">
                        {" "}
                        <div className="flex items-center gap-3">
                          {" "}
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 text-sm">
                            {" "}
                            {company.name.charAt(0)}{" "}
                          </div>{" "}
                          <span className="font-bold text-navy dark:text-white text-sm">
                            {company.name}
                          </span>{" "}
                        </div>{" "}
                      </td>{" "}
                      <td className="px-6 py-5">
                        {" "}
                        <span className="text-sm font-bold text-navy dark:text-white">
                          {company.jobs}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-6 py-5">
                        {" "}
                        <span className="text-sm font-bold text-navy dark:text-white">
                          {company.cvs.toLocaleString()}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-6 py-5">
                        {" "}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${company.color === "teal" ? "bg-teal-50 text-teal-700" : company.color === "orange" ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-700"}`}
                        >
                          {" "}
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${company.color === "teal" ? "bg-teal-500" : company.color === "orange" ? "bg-orange-500" : "bg-red-500"}`}
                          />{" "}
                          {company.status}{" "}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-6 py-5">
                        {" "}
                        <div className="flex items-center gap-2">
                          {" "}
                          <button className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-primary hover:text-white transition-all">
                            {" "}
                            <Calendar size={14} /> التحكم بأيام الفترة
                            التجريبية{" "}
                          </button>{" "}
                          <button className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-red-600 hover:text-white transition-all">
                            {" "}
                            <Ban size={14} /> إيقاف الحساب{" "}
                          </button>{" "}
                          <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-navy dark:text-white transition-colors">
                            {" "}
                            <MoreVertical size={16} />{" "}
                          </button>{" "}
                        </div>{" "}
                      </td>{" "}
                    </tr>
                  ))}{" "}
                </tbody>{" "}
              </table>{" "}
            </div>{" "}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50/30 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              {" "}
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                عرض 1-4 من أصل 128 شركة
              </span>{" "}
              <div className="flex gap-2">
                {" "}
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-400 dark:text-slate-500 hover:bg-white dark:bg-slate-800 transition-all">
                  السابق
                </button>{" "}
                <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-navy dark:text-white shadow-sm">
                  1
                </button>{" "}
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-400 dark:text-slate-500 hover:bg-white dark:bg-slate-800 transition-all">
                  2
                </button>{" "}
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-400 dark:text-slate-500 hover:bg-white dark:bg-slate-800 transition-all">
                  التالي
                </button>{" "}
              </div>{" "}
            </div>{" "}
              </div>
            </div>
          )}

          {activeTab === "قاموس المهارات" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-6">
                <h1 className="text-3xl font-bold mb-2 text-navy dark:text-white flex items-center gap-3">
                  <FileText className="text-primary" /> قاموس المهارات (الذكاء الاصطناعي)
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  للاطلاع والمراجعة فقط. هذا هو الدليل الآلي المستخدم لمطابقة الأدوار واقتراح المهارات على الشركات بشكل تلقائي وقت كتابة الوظيفة.
                </p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(skillsDictionary).map(([jobTitle, skills]) => (
                  <div key={jobTitle} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-navy dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">{jobTitle}</h3>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {skills.map((skill, idx) => (
                        <span key={idx} className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light px-3 py-1.5 rounded-lg text-xs font-bold border border-primary/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab !== "إدارة الشركات" && activeTab !== "قاموس المهارات" && (
            <div className="flex flex-col items-center justify-center p-20 bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
               <h2 className="text-2xl font-bold text-slate-400 mb-2">قريباً</h2>
               <p className="text-slate-500">هذه الأداة قيد التطوير...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
const LogoIcon = () => (
  <div className="logo-icon w-10 h-10 rounded-[12px] bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center relative shadow-[0_8px_16px_rgba(13,148,136,0.3),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.3)] transition-transform shrink-0">
    {" "}
    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-[12px]" />{" "}
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="relative z-10 drop-shadow-sm ml-0.5 mt-0.5"
    >
      {" "}
      <path
        d="M10 6H6V18H10"
        stroke="#064E3B"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />{" "}
      <circle cx="14" cy="12" r="3" fill="url(#copperGrd)" />{" "}
      <defs>
        {" "}
        <radialGradient
          id="copperGrd"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(14 12) rotate(90) scale(3)"
        >
          {" "}
          <stop stopColor="#FCD34D" />{" "}
          <stop offset="1" stopColor="#92400E" />{" "}
        </radialGradient>{" "}
      </defs>{" "}
    </svg>{" "}
  </div>
);
const Navbar = ({
  setStep,
  currentStep,
}: {
  setStep: (s: FlowStep) => void;
  currentStep: FlowStep;
}) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = ["features", "testimonials", "contact"];
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            current = section;
          }
        }
      }
      // Clear active if we are at the very top (Hero section)
      if (window.scrollY < window.innerHeight / 2) {
        current = "";
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? "bg-white dark:bg-slate-800 shadow-sm py-4" : "bg-transparent dark:bg-transparent dark:text-white py-5"}`}
    >
      {" "}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex items-center justify-between">
        {" "}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setStep("landing");
          }}
          className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity"
        >
          {" "}
          <LogoIcon />{" "}
          <span className="text-2xl font-black tracking-tighter text-navy dark:text-white flex items-center pt-1">
            فرز
          </span>{" "}
        </a>{" "}
        <div className="hidden md:flex items-center gap-8">
          {" "}
          {currentStep === "landing" ? (
            <div className="flex items-center gap-2 text-[15px] font-medium text-slate-800">
              {" "}
              {[
                { id: "features", label: "المميزات" },
                { id: "testimonials", label: "شركاء النجاح" },
                { id: "contact", label: "تواصل معنا" },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`px-4 py-2 rounded-lg transition-all ${activeSection === link.id ? "text-primary bg-primary/5 font-bold" : "hover:bg-slate-100 hover:text-primary"}`}
                >
                  {" "}
                  {link.label}{" "}
                </a>
              ))}{" "}
            </div>
          ) : (
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {" "}
              {currentStep === "form" && "خطوة 1: تقديم الطلب"}{" "}
              {currentStep === "dashboard" && "خطوة 2: مراجعة النتائج"}{" "}
              {currentStep === "login" && "بوابة أصحاب العمل"}{" "}
              {currentStep === "superAdmin" && "إدارة النظام"}{" "}
            </span>
          )}{" "}
        </div>{" "}
        <div className="flex items-center gap-4">
          {" "}
          {currentStep === "landing" && (
            <button
              onClick={() => setStep("login")}
              className="text-[15px] font-medium text-slate-800 hover:text-primary hover:bg-slate-100 transition-colors px-4 py-2 rounded-xl"
            >
              {" "}
              تسجيل الدخول{" "}
            </button>
          )}{" "}
          {currentStep === "dashboard" || currentStep === "superAdmin" ? (
            <button
              onClick={() => setStep("landing")}
              className="flex items-center gap-2 text-red-500 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
            >
              {" "}
              <LogOut size={18} /> إنهاء التجربة{" "}
            </button>
          ) : (
            <button
              onClick={() => setStep("registerCompany")}
              className={`bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all shadow-md active:scale-95`}
            >
              {" "}
              إنشاء حساب{" "}
            </button>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </nav>
  );
};
const LoginPage = ({
  onLogin,
  onBack,
  initialMode = "login",
}: {
  onLogin: () => void;
  onBack: () => void;
  initialMode?: "login" | "register";
}) => {
  const [mode, setMode] = useState(initialMode);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {" "}
      {/* Right Side - Dark Green */}{" "}
      <div className="md:w-1/2 bg-employer-green text-white p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
        {" "}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 max-w-md"
        >
          {" "}
          <button
            onClick={onBack}
            className="mb-10 flex justify-center w-full group cursor-pointer"
          >
            {" "}
            <LogoIcon className="group-hover:scale-105 transition-transform" />{" "}
          </button>{" "}
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            مرحباً بك في بوابة فرز
          </h2>{" "}
          <p className="text-xl text-white/80 font-medium leading-relaxed">
            {" "}
            {mode === "login"
              ? "أدر عمليات التوظيف بفعالية، وفرز آلاف المتقدمين بضغطة زر واحدة."
              : "أنشئ حساباً جديداً لشركتك وانطلق نحو توظيف أذكى وأسرع."}{" "}
          </p>{" "}
        </motion.div>{" "}
        {/* Decorative background elements */}{" "}
        <div className="absolute top-0 right-0 w-64 h-64 bg-mint/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />{" "}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />{" "}
      </div>{" "}
      {/* Left Side - Form */}{" "}
      <div className="md:w-1/2 bg-white dark:bg-slate-800 p-12 flex flex-col justify-center items-center relative">
        {" "}
        <button
          onClick={onBack}
          className="absolute top-8 right-8 flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
        >
          {" "}
          <ArrowRight size={18} /> العودة للرئيسية{" "}
        </button>{" "}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {" "}
          <div className="mb-12">
            {" "}
            <h3 className="text-3xl font-bold text-navy dark:text-white mb-2">
              {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب شركة"}
            </h3>{" "}
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
              {mode === "login"
                ? "أدخل بيانات الشركة للوصول إلى لوحة التحكم"
                : "سجل الآن وابدأ تجربتك المجانية لمدة 14 يوماً."}
            </p>{" "}
          </div>{" "}
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (mode === "register" && !acceptedTerms) {
                alert("يرجى الموافقة على الشروط والأحكام أولاً.");
                return;
              }
              onLogin();
            }}
          >
            {" "}
            <button
              type="button"
              onClick={() => {
                if (mode === "register" && !acceptedTerms) {
                  alert("يرجى الموافقة على الشروط والأحكام أولاً قبل التسجيل عبر Google.");
                  return;
                }
                onLogin();
              }}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3 text-slate-700 dark:text-white"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              {mode === "login" ? "تسجيل الدخول بواسطة Google" : "التسجيل بواسطة Google"}
            </button>{" "}
            
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">أو بالإيميل التقليدي</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>

            {/* تم إلغاء حقل اسم الشركة هنا لتسريع التسجيل */}
            <div className="space-y-2">
              {" "}
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-1">
                البريد الإلكتروني للشركة
              </label>{" "}
              <div className="relative">
                {" "}
                <Mail
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={20}
                />{" "}
                <input
                  required
                  type="email"
                  placeholder="company@example.com"
                  className="w-full pr-12 pl-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-mint/20 focus:border-mint outline-none transition-all font-medium"
                />{" "}
              </div>{" "}
            </div>{" "}
            {mode === "register" && (
              <div className="space-y-2">
                {" "}
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-1">
                  رقم الجوال
                </label>{" "}
                <div className="relative">
                  {" "}
                  <Phone
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    size={20}
                  />{" "}
                  <input
                    required
                    type="tel"
                    dir="ltr"
                    placeholder="05xxxxxxxx"
                    className="w-full pr-12 pl-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-mint/20 focus:border-mint outline-none transition-all text-right font-medium"
                  />{" "}
                </div>{" "}
              </div>
            )}{" "}
            <div className="space-y-2">
              {" "}
              <div className="flex justify-between items-center px-1">
                {" "}
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  كلمة المرور
                </label>{" "}
                {mode === "login" && (
                  <button
                    type="button"
                    className="text-xs font-bold text-employer-green dark:text-green-300 hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                )}{" "}
              </div>{" "}
              <div className="relative">
                {" "}
                <Lock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={20}
                />{" "}
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pr-12 pl-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-mint/20 focus:border-mint outline-none transition-all font-medium"
                />{" "}
              </div>{" "}
            </div>{" "}
            {mode === "register" && (
              <div className="flex items-start gap-3 pt-2">
                <input
                  required
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-primary border-2 focus:ring-primary accent-primary cursor-pointer shrink-0"
                />{" "}
                <label
                  htmlFor="terms"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed cursor-pointer select-none"
                >
                  {" "}
                  بإنشاء هذا الحساب، فإنك توافق على{" "}
                  <a
                    href="#"
                    className="text-primary font-bold hover:underline"
                  >
                    الشروط والأحكام
                  </a>{" "}
                  و{" "}
                  <a
                    href="#"
                    className="text-primary font-bold hover:underline"
                  >
                    سياسة الخصوصية
                  </a>{" "}
                  الخاصة بمنصة فرز.{" "}
                </label>{" "}
              </div>
            )}{" "}
            <button
              type="submit"
              className="w-full bg-navy text-white py-5 rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all shadow-xl shadow-navy/10 active:scale-[0.96] mt-4"
            >
              {" "}
              {mode === "login" ? "تسجيل الدخول" : "تأكيد وإنشاء الحساب"}{" "}
            </button>{" "}
          </form>{" "}
          <div className="mt-12 text-center">
            {" "}
            {mode === "login" ? (
              <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm">
                ليس لديك حساب؟{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-employer-green dark:text-green-300 font-bold hover:underline"
                >
                  سجل شركتك الآن
                </button>
              </p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm">
                لديك حساب بالفعل؟{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-employer-green dark:text-green-300 font-bold hover:underline"
                >
                  تسجيل الدخول من هنا
                </button>
              </p>
            )}{" "}
          </div>{" "}
        </motion.div>{" "}
      </div>{" "}
    </div>
  );
};
const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  return (
    <div className="pt-40 pb-20 px-4 overflow-hidden bg-watermark min-h-screen">
      {" "}
      {/* Hero Section */}{" "}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto text-center mb-32 relative"
      >
        {" "}
        {/* Decorative Elements */}{" "}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />{" "}
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        />{" "}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-white dark:border-slate-700 px-6 py-2.5 rounded-full text-sm font-bold text-primary mb-10 shadow-xl shadow-primary/5"
        >
          {" "}
          <Sparkles size={16} className="animate-spin-slow" /> ثورة في عالم
          التوظيف الذكي{" "}
        </motion.div>{" "}
        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-semibold mt-6 mb-8 lg:mb-10 leading-snug lg:leading-[1.4] text-navy dark:text-white tracking-tight text-center">
          {" "}
          وظف الكفاءات الصح <br />{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-600 relative font-bold inline-block">
            {" "}
            ووفر وقتك وجهدك مع فرز{" "}
            <svg
              className="absolute -bottom-4 left-0 w-full h-4 text-primary/20"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              {" "}
              <path
                d="M0 5 Q 25 0, 50 5 T 100 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />{" "}
            </svg>{" "}
          </span>{" "}
        </h1>{" "}
        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-14 max-w-xl mx-auto leading-relaxed font-medium text-center">
          {" "}
          منصة ترتب لك عمليات التوظيف، تفرز السير الذاتية، وتطلع لك الخلاصة عشان
          تختار الأنسب لفريقك بدون حوسة وتعب.{" "}
        </p>{" "}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          {" "}
          <button
            onClick={onStart}
            className="w-full sm:w-auto bg-primary text-white px-14 py-5 rounded-[24px] text-xl font-bold hover:shadow-[0_20px_50px_rgba(13,148,136,0.3)] transition-all hover:-translate-y-1.5 active:scale-95 flex items-center justify-center gap-3 group"
          >
            {" "}
            ابدأ مجاناً الآن{" "}
            <ArrowLeft
              size={22}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
          </button>{" "}
          <button
            onClick={() => setShowVideoModal(true)}
            className="w-full sm:w-auto bg-white dark:bg-slate-800/50 backdrop-blur-md text-navy dark:text-white border-2 border-white dark:border-slate-700 px-10 py-5 rounded-[24px] text-xl font-bold hover:bg-white dark:bg-slate-800 transition-all shadow-xl shadow-slate-200/20 active:scale-95 inline-flex items-center justify-center gap-3 group"
          >
            {" "}
            <Play
              size={22}
              className="text-primary fill-primary group-hover:scale-110 transition-transform"
            />{" "}
            شاهد كيف نعمل{" "}
          </button>{" "}
        </div>{" "}
        {/* Trust Section */}{" "}
        <div className="mt-32 pt-16 border-t border-slate-100 dark:border-slate-700">
          {" "}
          <p className="text-lg font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {" "}
            صُمم لخدمة الشركات والمشاريع التي تبحث عن الجودة والسرعة في التوظيف.{" "}
          </p>{" "}
        </div>{" "}
      </motion.section>{" "}
      {/* How it Works */}{" "}
      <section className="max-w-7xl mx-auto mb-16 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] py-24 px-8 md:px-12 border border-slate-100 dark:border-slate-700 relative">
        {" "}
        <div className="text-center mb-24">
          {" "}
          <h2 className="text-4xl md:text-5xl font-bold text-navy dark:text-white mb-6">
            كيف توظف مع فرز؟
          </h2>{" "}
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-lg font-medium">
            3 خطوات تفصلك عن مرشحك الأنسب
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {" "}
          {/* Connecting Line */}{" "}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-10" />{" "}
          {[
            {
              step: "01",
              title: "جهّز طلبك",
              desc: "حدد المهارات اللي تبيها وانشر الرابط في ثواني.",
              icon: (
                <FileText size={32} className="text-primary fill-primary/20" />
              ),
            },
            {
              step: "02",
              title: "الفرز الذكي",
              desc: "نظام ذكي يعتمد على خوارزميات متقدمة لفلترة آلاف السير الذاتية واستخراج المطابق لمعاييرك.",
              icon: <Zap size={32} className="text-primary fill-primary/20" />,
            },
            {
              step: "03",
              title: "القائمة المختصرة",
              desc: "نعطيك أفضل المرشحين جاهزين أمامك لكي تتخذ قرارك النهائي ببناء فريقك بثقة.",
              icon: (
                <CheckCircle
                  size={32}
                  className="text-primary fill-primary/20"
                />
              ),
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-md relative group hover:shadow-xl transition-all h-full"
            >
              {" "}
              <div className="absolute -top-6 right-10 w-12 h-12 bg-navy text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">
                {" "}
                {item.step}{" "}
              </div>{" "}
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {" "}
                {item.icon}{" "}
              </div>{" "}
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-4">
                {item.title}
              </h3>{" "}
              <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
                {item.desc}
              </p>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* Silent Scroll Indicator */}{" "}
      <div className="flex justify-center mb-20 relative z-10 w-full opacity-60">
        {" "}
        <div className="w-7 h-12 border-2 border-slate-300 rounded-full flex justify-center pt-1.5">
          {" "}
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-2.5 bg-slate-400 rounded-full"
          />{" "}
        </div>{" "}
      </div>{" "}
      {/* Features Grid */}{" "}
      <section id="features" className="max-w-5xl mx-auto mb-48">
        {" "}
        <div className="text-center mb-16">
          {" "}
          <h2 className="text-4xl md:text-5xl font-bold text-navy dark:text-white">
            قدرات تقنية تدير عملية التوظيف عنك
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {" "}
          {[
            {
              title: "مقابلات صوتية مدمجة",
              desc: "نظام ذكي يسجل ويحلل إجابات المتقدمين صوتياً داخل المنصة مباشرة لاستخراج أفضل الكفاءات دون عناء.",
              icon: (
                <ShieldCheck
                  className="text-primary fill-primary/20"
                  size={32}
                />
              ),
              color: "bg-primary/10",
            },
            {
              title: "قاعدة بيانات حية (ATS)",
              desc: "الوصول إلى آلاف الكفاءات المحدثة باستمرار والجاهزة للانضمام لفريقك، مع إدارة متكاملة لخط سير المرشحين.",
              icon: (
                <Database className="text-primary fill-primary/20" size={32} />
              ),
              color: "bg-primary/10",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="card-3d bg-white dark:bg-slate-800 p-10 rounded-[32px] shadow-md border border-slate-100 dark:border-slate-700 group hover:shadow-xl transition-all"
            >
              {" "}
              <div
                className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-inner-3d group-hover:scale-110 transition-transform`}
              >
                {" "}
                {feature.icon}{" "}
              </div>{" "}
              <h3 className="text-2xl font-bold mb-4 text-navy dark:text-white">
                {feature.title}
              </h3>{" "}
              <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
                {feature.desc}
              </p>{" "}
            </motion.div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* Testimonials */}{" "}
      <section
        id="testimonials"
        className="max-w-7xl mx-auto mb-40 bg-navy rounded-[40px] p-16 md:p-24 relative overflow-hidden"
      >
        {" "}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />{" "}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {" "}
          <div>
            {" "}
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              ماذا يقول <br /> شركاء النجاح؟
            </h2>{" "}
            <p className="text-slate-400 dark:text-slate-500 text-xl font-medium mb-12">
              انضم للشركات التي اختصرت 70% من وقت التوظيف واعتمدت على الذكاء
              الاصطناعي لاختيار أفضل الكفاءات.
            </p>{" "}
            <div className="flex gap-4">
              {" "}
              <div className="w-16 h-1 bg-primary rounded-full" />{" "}
              <div className="w-4 h-1 bg-white dark:bg-slate-800/20 rounded-full" />{" "}
              <div className="w-4 h-1 bg-white dark:bg-slate-800/20 rounded-full" />{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white dark:bg-slate-800/5 backdrop-blur-xl p-12 rounded-[40px] border border-white dark:border-slate-700/10 relative">
            {" "}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl">
              {" "}
              <Sparkles size={32} />{" "}
            </div>{" "}
            <p className="text-2xl font-medium text-white mb-10 leading-relaxed italic">
              {" "}
              "لقد وفر لنا هذا النظام أكثر من 70% من الوقت المستغرق في فرز السير
              الذاتية. النتائج كانت مذهلة والمرشحون الذين تم اختيارهم كانوا
              الأفضل على الإطلاق."{" "}
            </p>{" "}
            <div className="flex items-center gap-6">
              {" "}
              <div className="w-16 h-16 rounded-2xl bg-slate-700 overflow-hidden border-2 border-primary">
                {" "}
                <img
                  src="https://picsum.photos/seed/ceo/100/100"
                  alt="CEO"
                  referrerPolicy="no-referrer"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <h4 className="text-xl font-bold text-white">
                  م. فهد السعد
                </h4>{" "}
                <p className="text-primary font-bold">
                  الرئيس التنفيذي - شركة الحلول المتكاملة
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Contact Section */}{" "}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-32 bg-primary/5 rounded-[40px] p-12 relative overflow-hidden shadow-sm border border-primary/20"
      >
        {" "}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />{" "}
        <div className="relative z-10">
          {" "}
          <div className="text-center mb-12">
            {" "}
            <h2 className="text-4xl font-bold text-navy dark:text-white mb-4">
              هل لديك احتياجات توظيف ضخمة أو استفسارات أعمال؟
            </h2>{" "}
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 max-w-xl mx-auto font-medium text-lg">
              {" "}
              فريق المبيعات لدينا جاهز لتقديم عرض توضيحي مخصص وتصميم باقة تناسب
              حجم أعمالك. اترك بياناتك وسنتواصل معك.{" "}
            </p>{" "}
          </div>{" "}
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            onSubmit={(e) => e.preventDefault()}
          >
            {" "}
            <div className="space-y-3">
              {" "}
              <label className="text-sm font-bold text-navy dark:text-white mr-1">
                الاسم الكامل
              </label>{" "}
              <div className="relative">
                {" "}
                <Users
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={20}
                />{" "}
                <input
                  type="text"
                  placeholder="أدخل اسمك"
                  className="w-full pr-12 pl-5 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="space-y-3">
              {" "}
              <label className="text-sm font-bold text-navy dark:text-white mr-1">
                رقم الجوال
              </label>{" "}
              <div className="relative">
                {" "}
                <Phone
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={20}
                />{" "}
                <input
                  type="tel"
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  className="w-full pr-12 pl-5 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-right font-medium"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="md:col-span-2 space-y-3">
              {" "}
              <label className="text-sm font-bold text-navy dark:text-white mr-1">
                البريد الإلكتروني
              </label>{" "}
              <div className="relative">
                {" "}
                <Mail
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={20}
                />{" "}
                <input
                  type="email"
                  placeholder="example@domain.com"
                  className="w-full pr-12 pl-5 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="md:col-span-2 space-y-3">
              {" "}
              <label className="text-sm font-bold text-navy dark:text-white mr-1">
                استفسارك أو رسالتك <span className="font-normal text-xs text-slate-400">(اختياري)</span>
              </label>{" "}
              <div className="relative">
                {" "}
                <textarea
                  placeholder="اكتب تفاصيل طلبك أو استفسارك هنا..."
                  rows={4}
                  className="w-full p-5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="md:col-span-2 mt-4">
              {" "}
              <button className="w-full bg-primary text-white py-6 rounded-[24px] text-xl font-bold hover:shadow-[0_20px_50px_rgba(13,148,136,0.3)] transition-all active:scale-95">
                {" "}
                إرسال طلب التواصل{" "}
              </button>{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
      </motion.section>{" "}
      {/* Video Showcase Modal */}{" "}
      <AnimatePresence>
        {" "}
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-8"
          >
            {" "}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-[24px] md:rounded-[40px] shadow-2xl overflow-hidden border border-white dark:border-slate-700/10 flex items-center justify-center"
            >
              {" "}
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 bg-white dark:bg-slate-800/10 hover:bg-red-500 transition-colors rounded-full flex items-center justify-center text-white z-10 backdrop-blur-sm shadow-lg"
              >
                {" "}
                <X size={24} />{" "}
              </button>{" "}
              <div className="text-center">
                {" "}
                <div className="w-20 h-20 bg-white dark:bg-slate-800/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  {" "}
                  <Play
                    size={32}
                    className="text-white/50 fill-white/20 ml-2"
                  />{" "}
                </div>{" "}
                <p className="text-white/60 font-medium text-lg">
                  مكان عرض فيديو شرح المنصة (Video Player)
                </p>{" "}
              </div>{" "}
            </motion.div>{" "}
          </motion.div>
        )}{" "}
      </AnimatePresence>{" "}
    </div>
  );
};
const ApplicantForm = ({
  job,
  selectedRoleId,
  onBackToJobs,
  onSubmit,
}: {
  job: Job | null;
  selectedRoleId?: string | null;
  onBackToJobs?: () => void;
  onSubmit: () => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  const [formDataState, setFormDataState] = useState({
    fullName: "",
    phone: "",
    email: "",
    gender: "",
    nationality: "سعودي/سعودية",
    city: "",
    education: "",
    experience: "",
    birthDate: "",
    neighborhood: "",
    currentJobTitle: "",
    linkedin: "",
    source: "",
    knockoutAnswers: {} as Record<string, string>,
  });
  const [customQuestionErrors, setCustomQuestionErrors] = useState<Record<string, string>>({});
  const [linkedinError, setLinkedinError] = useState("");
  const [formStep, setFormStep] = useState<"details" | "audio" | "success">("details");
  const [portfolioLinksState, setPortfolioLinksState] = useState<string[]>([""]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<any>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const isCampaign = job?.recordType === "campaign";
  
  useEffect(() => {
    if (!job) return;
    const title = job.campaignTitle || job.title || "تقديم طلب توظيف";
    const desc = job.campaignDescription || job.description || "سجل بياناتك للتقديم على هذه الفرصة الوظيفية.";
    
    document.title = title;
    
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', desc);
  }, [job]);

  const roles = job?.roles || [];
  const activeRole = isCampaign
    ? roles.find((r) => r.id === selectedRoleId)
    : roles && roles.length > 0
      ? roles[0]
      : job;
  const customQuestions = activeRole?.customQuestions || [];
  const requiredAttachments = activeRole?.requiredAttachments || [
    "سيرة ذاتية PDF",
  ];
  const customAttachments = activeRole?.customAttachments || [];
  const hasResumeOption =
    requiredAttachments.includes("سيرة ذاتية PDF") ||
    requiredAttachments.includes("لا يتطلب مرفقات") === false;
  const showUploadStep = true;
  const shouldShowFormInputs = !hasResumeOption || isParsed;
  const isAllFieldsFilled = Object.entries(formDataState)
    .filter(([k]) => k !== "linkedin")
    .every(([, v]) => v.toString().trim() !== "");
  const photoReq = activeRole?.photoRequirement || job?.photoRequirement || "hidden";
  const shouldShowPhotoUpload = photoReq !== "hidden" && showUploadStep;
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent,
  ) => {
    if ("preventDefault" in e) e.preventDefault();
    setIsDragging(false);

    let file: File | null = null;
    if ("dataTransfer" in e) {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) file = e.dataTransfer.files[0];
    } else if ("target" in e && (e.target as HTMLInputElement).files) {
      file = (e.target as HTMLInputElement).files?.[0] || null;
    }

    if (file) {
      if (isCampaign && roles.length > 1 && !selectedRoleId) {
        alert("يرجى اختيار المسمى الوظيفي أولاً قبل رفع السيرة الذاتية.");
        return;
      }
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExts = ['pdf', 'doc', 'docx'];
      if (!allowedExts.includes(fileExt || '')) {
        alert("صيغة الملف غير مدعومة، يرجى رفع PDF أو Word");
        return;
      }
    } else {
      return;
    }

    setIsParsing(true);
    setTimeout(() => {
      setFormDataState({
        fullName: "عبدالله محمد",
        phone: "501234567",
        email: "abdullah@example.com",
        gender: "ذكر",
        nationality: "سعودي/سعودية",
        city: "الرياض",
        education: "بكالوريوس",
        experience: "3",
        birthDate: "1995-04-15",
        neighborhood: "الملقا",
        currentJobTitle: "مطور واجهات أمامية",
        linkedin: "https://linkedin.com/in/abdullah",
        expectedSalary: "6000",
        knockoutAnswers: {} as Record<string, string>,
      });
      setIsParsing(false);
      setIsParsed(true);
    }, 1500);
  };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("الرجاء السماح بالوصول للمايكروفون لبدء المقابلة الصوتية.");
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };
  const retryRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, "0")}`;
  };
  const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    let hasErrors = false;
    const newErrors: Record<string, string> = {};

    const linkedinVal = formValues.linkedin as string;
    if (linkedinVal && linkedinVal.trim() !== "") {
      try {
        const url = new URL(linkedinVal);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          setLinkedinError("الرجاء إدخال رابط صحيح (يبدأ بـ http أو https)");
          hasErrors = true;
        } else {
          setLinkedinError("");
        }
      } catch (_) {
        setLinkedinError("يرجى إدخال رابط URL صحيح (مثال: https://linkedin.com/in/...)");
        hasErrors = true;
      }
    } else {
      setLinkedinError("");
    }

    customQuestions.forEach((q: any, idx: number) => {
      if (q.required || q.isRequired) {
        const val = formValues[`customQuestion_${idx}`] as string;
        if (!val || val.trim() === "") {
          newErrors[`customQuestion_${idx}`] = "يرجى الإجابة على هذا الحقل الإلزامي للمتابعة.";
          hasErrors = true;
        }
      }
    });

    customAttachments.forEach((att: any, idx: number) => {
      if (att.required || att.isRequired) {
        const isFile = att.attachment_type !== "link";
        if (isFile) {
          const fileInput = document.getElementsByName(`customAttachment_${idx}`)[0] as HTMLInputElement;
          if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            newErrors[`customAttachment_${idx}`] = "يرجى إرفاق هذا الملف الإلزامي للمتابعة.";
            hasErrors = true;
          }
        } else {
          const val = formValues[`customAttachment_${idx}`] as string;
          if (!val || val.trim() === "") {
            newErrors[`customAttachment_${idx}`] = "يرجى إضافة هذا الرابط الإلزامي للمتابعة.";
            hasErrors = true;
          }
        }
      }
    });

    if (hasErrors) {
      setCustomQuestionErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    
    setCustomQuestionErrors({});

    const activeDirectUpload = activeRole?.directUpload ?? job?.directUpload ?? false;
    const activeRequireVoice = activeRole?.requireVoiceInterview ?? job?.requireVoiceInterview ?? false;

    if (isCampaign && !selectedRoleId && activeDirectUpload) {
      alert("يرجى اختيار المسمى الوظيفي المطلوب");
      return;
    } else if (isCampaign && !selectedRoleId && !activeDirectUpload) {
      // If we didn't skip landing, they should have selected role in landing!
      // Provide fallback safety just in case
      if (!selectedRoleId && job?.roles && job.roles.length > 0) {
        alert("لم يتم تحديد التخصص الوظيفي بشكل صحيح.");
        return;
      }
    }

    // Check if voice interview is disabled!
    if (activeRequireVoice === false) {
      handleFinalSubmit(true);
      return;
    }

    if (photoReq === "required" && !photoFile) {
      alert("الرجاء إرفاق صورتك الشخصية للمتابعة (أمر إلزامي).");
      return;
    }

    setFormStep("audio");
  };
  const handleFinalSubmit = async (isVoiceSkipped: boolean = false) => {
    if (!isVoiceSkipped && !audioBlob) {
      alert("يرجى تسجيل الإجابة الصوتية للمقابلة أولاً.");
      return;
    }
    if (!formRef.current) return;
    setIsSubmitting(true);
    const formData = new FormData(formRef.current);
    const submitData = Object.fromEntries(formData.entries());
    const customAnswers = customQuestions.map((q: any, idx: number) => ({
      question: q.text,
      answer: submitData[`customQuestion_${idx}`],
    }));
    const submittedCustomAttachments = customAttachments.map(
      (att: any, idx: number) => ({
        attachment_name: att.attachment_name,
        attachment_type: att.attachment_type,
        answer:
          att.attachment_type === "link"
            ? submitData[`customAttachment_${idx}`]
            : (submitData[`customAttachment_${idx}`] as File)?.name || "",
      }),
    );
    customQuestions.forEach(
      (_: any, idx: number) => delete submitData[`customQuestion_${idx}`],
    );
    customAttachments.forEach(
      (_: any, idx: number) => delete submitData[`customAttachment_${idx}`],
    );
    {(activeRole || job) && (() => {
      const displayRole = {
        title: activeRole?.title || job?.title,
        location: activeRole?.location || job?.location,
        type: activeRole?.type || job?.type,
        experience: activeRole?.experience || job?.experience,
        qualification: activeRole?.qualification || job?.qualification,
        salaryMin: activeRole?.salaryMin || job?.salaryMin,
        salaryMax: activeRole?.salaryMax || job?.salaryMax,
        isSalaryHidden: activeRole?.isSalaryHidden ?? job?.isSalaryHidden,
      };
      return null;
    })()}
    portfolioLinksState.forEach((_, idx) => {
      delete submitData[`portfolio_${idx}`];
    });
    const finalFormData = new FormData();
    finalFormData.append("type", "ApplicantSubmission");
    finalFormData.append("portfolioLinks", JSON.stringify(portfolioLinksState.filter(l => l.trim() !== "")));
    if (isVoiceSkipped === true) finalFormData.append("skippedVoiceInterview", "true");
    if (isCampaign && job?.id) finalFormData.append("campaignId", job.id);
    finalFormData.append("jobId", activeRole?.id || job?.id || "");
    finalFormData.append("jobTitle", activeRole?.title || job?.title || "");
    finalFormData.append("jobDescription", activeRole?.description || job?.description || "");
    
    const linkedinPayload = submitData.linkedin || "";
    const sourcePayload = submitData.source || "";
    delete submitData.linkedin;
    delete submitData.source;

    Object.keys(submitData).forEach((key) => {
      finalFormData.append(key, submitData[key] as string);
    });
    
    finalFormData.append("linkedin", linkedinPayload as string);
    finalFormData.append("source", sourcePayload as string);
    finalFormData.append("customAnswers", JSON.stringify(customAnswers));
    finalFormData.append(
      "submittedCustomAttachments",
      JSON.stringify(submittedCustomAttachments),
    );
    if (photoFile) finalFormData.append("photo", photoFile);
    if (!isVoiceSkipped && audioBlob) {
      finalFormData.append("audioInterview", audioBlob, "interview.webm");
    }

    let isAutoRejected = false;
    if (activeRole?.knockoutQuestions && activeRole.knockoutQuestions.length > 0) {
      const answers = formDataState.knockoutAnswers;
      isAutoRejected = activeRole.knockoutQuestions.some((kq, idx) => {
        const ans = answers[idx];
        return ans && ans !== kq.requiredAnswer;
      });
    }

    if (isAutoRejected) {
      finalFormData.append("matchScore", "0");
      finalFormData.append("status", "مستبعد آلياً / غير مطابق");
      finalFormData.append("skipAI", "true");
      console.log("Knockout Question failed: Applicant Auto-Rejected. Appended skipAI=true to avoid API costs.");
    }

    try {
      if (!isAutoRejected) {
        await fetch(
          "https://circular-struggle-ethical-membership.trycloudflare.com/webhook-test/2489027f-d077-4af4-9d3d-fc0dd9f38953",
          { method: "POST", body: finalFormData },
        );
      } else {
        // Mock webhook hit for auto-reject (usually would point to a faster, non-AI DB webhook route)
        console.log("Mocking instant webhook save for auto-rejected applicant.");
      }
    } catch (error) {
      console.error("Webhook error:", error);
    }
    setTimeout(() => {
      setFormStep("success");
    }, 1500);
  };
  const now = new Date();
  const jobStart = job?.startDate ? new Date(job.startDate) : new Date(0);
  const jobEnd = job?.endDate
    ? new Date(job.endDate)
    : new Date(8640000000000000);
  // far future fallback
  const isClosed = job?.status === "مغلق";
  
  if (formStep === "success") {
    return (
      <div className="min-h-screen pt-40 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 -z-10 translate-x-1/2" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800/90 backdrop-blur-xl w-full max-w-lg p-10 md:p-14 rounded-[40px] shadow-2xl border border-white dark:border-slate-700 text-center"
        >
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner-3d">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-navy dark:text-white">
            تم إرسال طلبك بنجاح!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
            شكراً لاهتمامك بالانضمام إلينا. سنقوم بمراجعة طلبك والتواصل معك في أقرب وقت. نتمنى لك التوفيق!
          </p>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                if (onBackToJobs) {
                  onBackToJobs();
                } else {
                  window.location.href = "/";
                }
              }}
              className="w-full bg-primary text-white py-5 rounded-2xl text-lg font-bold hover:bg-teal-600 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98] font-cairo"
            >
              العودة لقائمة الوظائف
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isClosed || now > jobEnd) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
        {" "}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 -z-10 translate-x-1/2" />{" "}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800/90 backdrop-blur-xl w-full max-w-lg p-10 md:p-14 rounded-[40px] shadow-2xl border border-white dark:border-slate-700 text-center"
        >
          {" "}
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner-3d">
            {" "}
            <Ban size={32} />{" "}
          </div>{" "}
          <h2 className="text-3xl font-bold mb-4 text-navy dark:text-white">
            عذراً، تم انتهاء وقت التقديم على هذه الوظيفة.
          </h2>{" "}
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
            نتمنى لك التوفيق في الفرص القادمة.
          </p>{" "}
        </motion.div>{" "}
      </div>
    );
  }
  if (now < jobStart) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
        {" "}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 -z-10 translate-x-1/2" />{" "}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800/90 backdrop-blur-xl w-full max-w-lg p-10 md:p-14 rounded-[40px] shadow-2xl border border-white dark:border-slate-700 text-center"
        >
          {" "}
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner-3d">
            {" "}
            <Clock size={32} />{" "}
          </div>{" "}
          <h2 className="text-3xl font-bold mb-4 text-navy dark:text-white">
            التقديم لم يبدأ بعد
          </h2>{" "}
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
            سيبدأ استقبال طلبات التوظيف بتاريخ:{" "}
            {new Date(jobStart).toLocaleString("ar-SA")}
          </p>{" "}
        </motion.div>{" "}
      </div>
    );
  }
  return (
    <div className="min-h-screen pt-40 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      {" "}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 -z-10 translate-x-1/2" />{" "}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800/80 backdrop-blur-xl w-full max-w-2xl p-10 md:p-14 rounded-[40px] shadow-2xl border border-white dark:border-slate-700"
      >
        {" "}
        <div className="text-center mb-12">
          {" "}
          {formStep === "details" && (
            <div className="flex flex-col items-center gap-2 mb-8">
              {" "}
              {job?.companyLogo && (
                <div className="w-20 h-20 p-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  <img
                    src={job.companyLogo}
                    alt={job.company || "Company"}
                    className="w-full h-full object-cover rounded-[inherit] drop-shadow-sm"
                    onError={(e) => {
                      e.currentTarget.parentElement!.style.display = 'none';
                    }}
                  />
                </div>
              )}{" "}
              {job?.company && (
                <span className="text-lg font-bold text-navy dark:text-white text-center">
                  {job.company}
                </span>
              )}{" "}
            </div>
          )}
          {formStep === "details" ? (
            <>
              {isCampaign && job?.campaignTitle && (
                <div className="mb-6 flex items-center justify-center">
                   <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">
                     حملة توظيفية: {job.campaignTitle}
                   </div>
                </div>
              )}
            </>
          ) : (
            <>
              {" "}
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner-3d">
                {" "}
                <Mic size={40} />{" "}
              </div>{" "}
              <h2 className="text-4xl font-bold mb-4 text-navy dark:text-white">
                المقابلة الصوتية
              </h2>{" "}
              <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
                {" "}
                نود أن نتعرف عليك أكثر! يرجى الاستماع للأسئلة أدناه والإجابة
                عليها في تسجيل صوتي واحد وواضح.{" "}
              </p>{" "}
            </>
          )}{" "}
        </div>{" "}
        <form
          ref={formRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${formStep === "details" ? "block" : "hidden"}`}
          onSubmit={handleNextStep}
        >
          {" "}
          {(activeRole || job) && (() => {
            const displayRole = {
              title: activeRole?.title || job.title,
              location: activeRole?.location || job.location,
              type: activeRole?.type || job.type,
              experience: activeRole?.experience || job.experience,
              qualification: activeRole?.qualification || job.qualification,
              salaryMin: activeRole?.salaryMin || job.salaryMin,
              salaryMax: activeRole?.salaryMax || job.salaryMax,
              isSalaryHidden: activeRole?.isSalaryHidden ?? job.isSalaryHidden,
            };
            return (
            <div className="md:col-span-2 space-y-4 bg-primary/5 p-6 rounded-[32px] border border-primary/10 mb-2">
              <div className="text-center space-y-1">
                <h3 className="text-2xl md:text-3xl font-bold text-primary">
                  {displayRole.title}
                </h3>
              </div>
              <div className="pt-4 border-t border-primary/10 flex flex-wrap justify-center gap-2 text-xs font-bold font-medium text-navy dark:text-white/80">
                <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                  <MapPin size={14} className="text-primary opacity-70" /> {displayRole.location || "غير محدد"}
                </span>
                <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                  <Clock size={14} className="text-primary opacity-70" /> {displayRole.type || "غير محدد"}
                </span>
                <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                  <Briefcase size={14} className="text-primary opacity-70" /> {displayRole.experience || "غير محدد"}
                </span>
                <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                  <FileText size={14} className="text-primary opacity-70" /> {displayRole.qualification || "غير محدد"}
                </span>
                {!displayRole.isSalaryHidden && (
                  <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
                    <CreditCard size={14} /> {displayRole.salaryMin ? `${displayRole.salaryMin} ${displayRole.salaryMax ? `- ${displayRole.salaryMax}` : ''} ريال` : "يحدد بالمقابلة"}
                  </span>
                )}
              </div>
            </div>
            );
          })()}

          {formStep === "details" && (
            <div className="md:col-span-2 text-center mt-2 mb-4">
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                ارفع سيرتك الذاتية وسنقوم باستخراج بياناتك تلقائياً. يرجى مراجعة البيانات وتعبئة الحقول المتبقية، ونتمنى لك التوفيق!
              </p>
            </div>
          )}

          {showUploadStep && hasResumeOption && !isParsed && (
            <div className="md:col-span-2 space-y-3">
              {" "}
              <label className="text-sm font-bold text-navy dark:text-white mr-1">
                إرفاق السيرة الذاتية (للتعبئة التلقائية)
              </label>{" "}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileUpload}
                className={`relative border-2 border-dashed rounded-[32px] p-12 text-center transition-all cursor-pointer overflow-hidden group ${isDragging ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-slate-50 dark:bg-slate-800/50"}`}
              >
                {" "}
                <input
                  type="file"
                  accept=".pdf, .doc, .docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />{" "}
                {!isParsing ? (
                  <>
                    {" "}
                    <div
                      className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-all ${isDragging ? "bg-primary text-white scale-110" : "bg-slate-100 text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:bg-primary/10"}`}
                    >
                      {" "}
                      <Upload size={32} />{" "}
                    </div>{" "}
                    <p className="text-navy dark:text-white font-bold text-lg mb-2">
                      ملف السيرة الذاتية
                    </p>{" "}
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      (يُقبل ملفات PDF و DOCX فقط)
                    </p>{" "}
                  </>
                ) : (
                  <div className="py-6 space-y-4">
                    {" "}
                    <div className="w-16 h-16 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin" />{" "}
                    <p className="text-primary font-bold animate-pulse">
                      جاري استخراج البيانات...
                    </p>{" "}
                  </div>
                )}{" "}
              </div>{" "}
            </div>
          )}{" "}
          {showUploadStep && shouldShowFormInputs && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {" "}
              {isParsed && hasResumeOption && (
                <div className={`md:col-span-2 p-4 rounded-2xl flex items-center gap-3 border ${isAllFieldsFilled ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
                  {" "}
                  <CheckCircle size={20} />{" "}
                  <p className="text-sm font-bold">
                    {isAllFieldsFilled
                      ? "تم استخراج جميع بياناتك بنجاح! يرجى التأكيد والانتقال للتالي."
                      : "تم استخراج بياناتك بنجاح! يرجى تعبئة الحقول المتبقية للمتابعة."}
                  </p>{" "}
                </div>
              )}{" "}
              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="fullName"
                  type="text"
                  value={formDataState.fullName}
                  onChange={handleInputChange}
                  placeholder="أحمد محمد علي"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="email"
                  type="email"
                  value={formDataState.email}
                  onChange={handleInputChange}
                  placeholder="example@domain.com"
                  dir="ltr"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-left font-medium"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  رقم الجوال <span className="text-red-500">*</span>
                </label>
                <div className="relative flex" dir="ltr">
                  <span className="inline-flex items-center px-4 rounded-l-2xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                    +966
                  </span>
                  <input
                    required
                    name="phone"
                    type="tel"
                    value={formDataState.phone}
                    onChange={handleInputChange}
                    placeholder="5xxxxxxxx"
                    dir="ltr"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-r-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-left font-medium"
                  />
                </div>
              </div>



              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  تاريخ الميلاد <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="birthDate"
                  type="date"
                  lang="en-US"
                  dir="ltr"
                  value={formDataState.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-left"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  الجنسية <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    name="nationality"
                    value={formDataState.nationality}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="سعودي/سعودية" className="bg-white text-navy dark:bg-slate-800 dark:text-white">سعودي / سعودية</option>
                    <option value="غير ذلك" className="bg-white text-navy dark:bg-slate-800 dark:text-white">غير ذلك (أخرى)</option>
                  </select>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                    <ArrowLeft size={18} className="-rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  الجنس <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    name="gender"
                    value={formDataState.gender}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر الجنس</option>
                    <option value="ذكر" className="bg-white text-navy dark:bg-slate-800 dark:text-white">ذكر</option>
                    <option value="أنثى" className="bg-white text-navy dark:bg-slate-800 dark:text-white">أنثى</option>
                  </select>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                    <ArrowLeft size={18} className="-rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  المدينة <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    name="city"
                    value={formDataState.city}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر المدينة</option>
                    <option value="الرياض" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الرياض</option>
                    <option value="جدة" className="bg-white text-navy dark:bg-slate-800 dark:text-white">جدة</option>
                    <option value="الدمام" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الدمام</option>
                    <option value="الخبر" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الخبر</option>
                    <option value="مكة المكرمة" className="bg-white text-navy dark:bg-slate-800 dark:text-white">مكة المكرمة</option>
                    <option value="المدينة المنورة" className="bg-white text-navy dark:bg-slate-800 dark:text-white">المدينة المنورة</option>
                    <option value="أخرى" className="bg-white text-navy dark:bg-slate-800 dark:text-white">مدينة أخرى</option>
                  </select>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                    <ArrowLeft size={18} className="-rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  الحي <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="neighborhood"
                  type="text"
                  value={formDataState.neighborhood}
                  onChange={handleInputChange}
                  placeholder="مثال: الملقا"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  أعلى مؤهل علمي <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    name="education"
                    value={formDataState.education}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر المؤهل</option>
                    <option value="ثانوية عامة" className="bg-white text-navy dark:bg-slate-800 dark:text-white">ثانوية عامة</option>
                    <option value="دبلوم" className="bg-white text-navy dark:bg-slate-800 dark:text-white">دبلوم</option>
                    <option value="بكالوريوس" className="bg-white text-navy dark:bg-slate-800 dark:text-white">بكالوريوس</option>
                    <option value="ماجستير" className="bg-white text-navy dark:bg-slate-800 dark:text-white">ماجستير</option>
                    <option value="دكتوراه" className="bg-white text-navy dark:bg-slate-800 dark:text-white">دكتوراه</option>
                  </select>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                    <ArrowLeft size={18} className="-rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  إجمالي سنوات الخبرة <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="experience"
                  type="number"
                  min="0"
                  step="1"
                  lang="en-US"
                  dir="ltr"
                  value={formDataState.experience}
                  onChange={handleInputChange}
                  placeholder="3"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-left"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">
                  المسمى الوظيفي الحالي / الأخير <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="currentJobTitle"
                  type="text"
                  value={formDataState.currentJobTitle}
                  onChange={handleInputChange}
                  placeholder="مثال: مدير مشتريات"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                />
              </div>


              {activeRole.isSalaryHidden && (
                <div className="space-y-3 md:col-span-2 mt-2">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1">
                    الراتب المتوقع (ريال) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="expectedSalary"
                    type="number"
                    value={formDataState.expectedSalary}
                    onChange={handleInputChange}
                    placeholder="مثال: 5000"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              )}
              {shouldShowPhotoUpload && (
                <div className="md:col-span-2 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">
                    <User size={16} className="text-primary" /> الصورة الشخصية {photoReq === "required" ? <span className="text-red-500">*</span> : <span className="text-slate-400">(اختياري)</span>}
                  </label>
                  <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-200 dark:border-slate-700 w-fit">
                    <div className="relative w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-dashed border-slate-400 dark:border-slate-500 flex flex-col items-center justify-center overflow-hidden shrink-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-slate-400" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        title="Upload Photo"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPhotoFile(file);
                            setPhotoPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-navy dark:text-white font-bold mb-1">حمّل صورتك الشخصية</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">الصيغ المدعومة: JPG, PNG (حد أقصى ٣ ميجابايت)</p>
                      {photoFile && (
                        <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">إزالة الصورة</button>
                      )}
                    </div>
                  </div>
                </div>
              )}{" "}
              {activeRole?.knockoutQuestions?.map((q, idx) => {
                const options = q.type === "options" && Array.isArray(q.options) && q.options.length > 0 ? q.options : ["نعم", "لا"];
                return (
                  <div key={`kq_${idx}`} className="md:col-span-2 space-y-3">
                    <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">
                      {q.text} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formDataState.knockoutAnswers[idx] || ""}
                        onChange={(e) => setFormDataState((prev) => ({
                          ...prev,
                          knockoutAnswers: { ...prev.knockoutAnswers, [idx]: e.target.value }
                        }))}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer font-medium"
                      >
                        <option value="" className="bg-white text-navy dark:bg-slate-800">اختر إجابة...</option>
                        {options.map((opt, i) => (
                          <option key={i} value={opt} className="bg-white text-navy dark:bg-slate-800 dark:text-white">{opt}</option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        size={20}
                      />
                    </div>
                  </div>
                );
              })}

              {customQuestions.map((q: any, idx: number) => {
                const options =
                  Array.isArray(q.options) && q.options.length > 0
                    ? q.options
                    : ["نعم", "لا"];
                const errorMsg = customQuestionErrors[`customQuestion_${idx}`];
                return (
                  <div key={idx} className="md:col-span-2 space-y-3">
                    {" "}
                    <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">
                      {q.text}
                      {q.required || q.isRequired ? (
                        <span className="text-red-500">*</span>
                      ) : (
                        <span className="text-slate-400 text-xs font-normal">(اختياري)</span>
                      )}
                    </label>{" "}
                    {q.type === "نص طويل" ? (
                      <textarea
                        name={`customQuestion_${idx}`}
                        rows={4}
                        placeholder="اكتب إجابتك هنا..."
                        className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border ${errorMsg ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium resize-none`}
                      />
                    ) : q.type === "خيارات متعددة" || q.type === "نعم / لا" ? (
                      <div className="relative">
                        {" "}
                        <select
                          name={`customQuestion_${idx}`}
                          className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border ${errorMsg ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer font-medium`}
                        >
                          {" "}
                          <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر إجابة</option>{" "}
                          {options.map((opt: string, i: number) => (
                            <option key={i} value={opt} className="bg-white text-navy dark:bg-slate-800 dark:text-white">
                              {opt}
                            </option>
                          ))}{" "}
                        </select>{" "}
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                          {" "}
                          <ArrowLeft size={18} className="-rotate-90" />{" "}
                        </div>{" "}
                      </div>
                    ) : (
                      <input
                        name={`customQuestion_${idx}`}
                        type="text"
                        placeholder="إجابة قصيرة..."
                        className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border ${errorMsg ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium`}
                      />
                    )}{" "}
                    {errorMsg && (
                      <p className="text-red-500 text-xs font-bold mt-1">
                        {errorMsg}
                      </p>
                    )}
                  </div>
                );
              })}{" "}
              {customAttachments.map((att: any, idx: number) => {
                const errorMsg = customQuestionErrors[`customAttachment_${idx}`];
                return (
                <div key={`att_${idx}`} className="md:col-span-2 space-y-3">
                  {" "}
                  <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">
                    {att.attachment_name}{" "}
                    {att.required || att.isRequired ? (
                      <span className="text-red-500">*</span>
                    ) : (
                      <span className="text-slate-400 text-xs font-normal">(اختياري)</span>
                    )}
                  </label>{" "}
                  {att.attachment_type === "link" ? (
                    <input
                      required={att.required}
                      name={`customAttachment_${idx}`}
                      type="url"
                      placeholder="https://..."
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-left"
                      dir="ltr"
                    />
                  ) : att.attachment_type === "image" ? (
                    <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-primary hover:bg-slate-50 dark:bg-slate-800/50 transition-all cursor-pointer group">
                      {" "}
                      <input
                        required={att.required}
                        type="file"
                        name={`customAttachment_${idx}`}
                        accept="image/jpeg, image/png"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />{" "}
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:bg-primary/10 flex items-center justify-center transition-all">
                        {" "}
                        <Upload size={24} />{" "}
                      </div>{" "}
                      <p className="text-sm font-bold text-navy dark:text-white">
                        اختر صورة (JPG/PNG)
                      </p>{" "}
                    </div>
                  ) : att.attachment_type === "video" ? (
                    <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-primary hover:bg-slate-50 dark:bg-slate-800/50 transition-all cursor-pointer group">
                      {" "}
                      <input
                        required={att.required}
                        type="file"
                        name={`customAttachment_${idx}`}
                        accept="video/mp4"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />{" "}
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:bg-primary/10 flex items-center justify-center transition-all">
                        {" "}
                        <Upload size={24} />{" "}
                      </div>{" "}
                      <p className="text-sm font-bold text-navy dark:text-white">
                        اختر فيديو (MP4)
                      </p>{" "}
                    </div>
                  ) : att.attachment_type === "document" ? (
                    <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-primary hover:bg-slate-50 dark:bg-slate-800/50 transition-all cursor-pointer group">
                      {" "}
                      <input
                        required={att.required}
                        type="file"
                        name={`customAttachment_${idx}`}
                        accept=".doc,.docx,.xls,.xlsx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />{" "}
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:bg-primary/10 flex items-center justify-center transition-all">
                        {" "}
                        <Upload size={24} />{" "}
                      </div>{" "}
                      <p className="text-sm font-bold text-navy dark:text-white">
                        اختر مستند (Word/Excel)
                      </p>{" "}
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-primary hover:bg-slate-50 dark:bg-slate-800/50 transition-all cursor-pointer group">
                      {" "}
                      <input
                        required={att.required}
                        type="file"
                        name={`customAttachment_${idx}`}
                        accept=".pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />{" "}
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:bg-primary/10 flex items-center justify-center transition-all">
                        {" "}
                        <Upload size={24} />{" "}
                      </div>{" "}
                      <p className="text-sm font-bold text-navy dark:text-white">
                        اختر ملف PDF
                      </p>{" "}
                    </div>
                  )}{" "}
                  {errorMsg && (
                    <p className="text-red-500 text-xs font-bold mt-1">
                      {errorMsg}
                    </p>
                  )}
                </div>
              );
              })}{" "}
              {requiredAttachments.includes("رابط معرض أعمال/Portfolio") && (
                <div className="md:col-span-2 space-y-4">
                  {" "}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">
                      روابط معرض الأعمال / Portfolio
                      {job?.portfolioRequirement === "required" ? <span className="text-red-500">*</span> : <span className="text-slate-400 dark:text-slate-500 text-xs font-normal"> (اختياري)</span>}
                    </label>
                  </div>
                  {portfolioLinksState.map((link, idx) => (
                    <div key={`portfolio_${idx}`} className="relative">
                      <input
                        required={job?.portfolioRequirement === "required" && idx === 0}
                        name={`portfolio_${idx}`}
                        type="url"
                        value={link}
                        onChange={(e) => {
                          const newLinks = [...portfolioLinksState];
                          newLinks[idx] = e.target.value;
                          setPortfolioLinksState(newLinks);
                        }}
                        placeholder="https://..."
                        dir="ltr"
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-left font-medium"
                      />
                      {portfolioLinksState.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newLinks = portfolioLinksState.filter((_, i) => i !== idx);
                            setPortfolioLinksState(newLinks);
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPortfolioLinksState([...portfolioLinksState, ""])}
                    className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    <Plus size={16} /> إضافة رابط آخر
                  </button>
                </div>
              )}
              {!hasResumeOption &&
                requiredAttachments.filter((a) => a !== "لا يتطلب مرفقات" && a !== "رابط معرض أعمال/Portfolio")
                  .length > 0 && (
                  <div className="md:col-span-2 space-y-3">
                    {" "}
                    <label className="text-sm font-bold text-navy dark:text-white mr-1">
                      {requiredAttachments
                        .filter((a) => a !== "لا يتطلب مرفقات" && a !== "رابط معرض أعمال/Portfolio")
                        .join(" و ")}
                    </label>{" "}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      className={`border-2 border-dashed rounded-[32px] p-12 text-center transition-all cursor-pointer group ${isDragging ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-slate-50 dark:bg-slate-800/50"}`}
                    >
                      {" "}
                      <div
                        className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-all ${isDragging ? "bg-primary text-white scale-110" : "bg-slate-100 text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:bg-primary/10"}`}
                      >
                        {" "}
                        <Upload size={32} />{" "}
                      </div>{" "}
                      <p className="text-navy dark:text-white font-bold text-lg mb-2">
                        اسحب المرفق الخاص المتطلب هنا
                      </p>{" "}
                      <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
                        أو انقر لاختيار ملف من جهازك
                      </p>{" "}
                    </div>{" "}
                  </div>
                )}{" "}
              <div className="space-y-3 md:col-span-2 mt-4 pt-6 center">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">
                  رابط لينكد إن (LinkedIn)
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-normal"> (اختياري)</span>
                </label>
                <input
                  name="linkedin"
                  type="url"
                  value={formDataState.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/..."
                  dir="ltr"
                  className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border ${linkedinError ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} dark:text-white dark:placeholder-slate-400 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-left font-medium`}
                />
                {linkedinError && (
                  <p className="text-red-500 text-xs font-bold mt-1 text-right">
                    {linkedinError}
                  </p>
                )}
              </div>
              

              <div className="space-y-3 md:col-span-2 mt-4 pt-6 border-t border-slate-100 dark:border-slate-700">
                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-2">
                  كيف عرفت عن هذه الوظيفة؟
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-normal"> (اختياري)</span>
                </label>
                <div className="relative">
                  <select
                    name="source"
                    value={formDataState.source}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white text-navy dark:bg-slate-800 dark:text-white">اختر المصدر...</option>
                    <option value="LinkedIn" className="bg-white text-navy dark:bg-slate-800 dark:text-white">LinkedIn</option>
                    <option value="منصة X / تويتر" className="bg-white text-navy dark:bg-slate-800 dark:text-white">منصة X / تويتر</option>
                    <option value="بحث جوجل" className="bg-white text-navy dark:bg-slate-800 dark:text-white">بحث جوجل</option>
                    <option value="توصية من صديق" className="bg-white text-navy dark:bg-slate-800 dark:text-white">توصية من صديق</option>
                    <option value="إعلان ممول" className="bg-white text-navy dark:bg-slate-800 dark:text-white">إعلان ممول</option>
                    <option value="أخرى" className="bg-white text-navy dark:bg-slate-800 dark:text-white">أخرى</option>
                  </select>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                    <ArrowLeft size={18} className="-rotate-90" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="md:col-span-2 bg-primary text-white py-5 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3"
              >
                {" "}
                التالي: المقابلة الصوتية <Mic size={20} />{" "}
              </button>{" "}
            </motion.div>
          )}{" "}
        </form>{" "}
        {formStep === "audio" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {" "}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-700">
              {" "}
              <h3 className="text-xl font-bold text-navy dark:text-white mb-4">
                أسئلة المقابلة:
              </h3>{" "}
              <ul className="space-y-4">
                {(() => {
                  const template = activeRole?.voiceInterviewTemplate ?? job?.voiceInterviewTemplate ?? "general";
                  const customQ = activeRole?.voiceInterviewQuestions ?? job?.voiceInterviewQuestions ?? [];
                  
                  let questionsToAsk = [];
                  if (template === "sales") {
                    questionsToAsk = [
                      "كيف تتعامل مع عميل يبدي انزعاجاً شديداً من الخدمة؟",
                      "صف موقفاً مستعصياً تمكنت فيه من استخدام مهاراتك الإقناعية لتحقيق هدف بيعي أو تغيير قناعة شخص."
                    ];
                  } else if (template === "custom" && customQ.length > 0 && customQ.some(q => q.trim() !== "")) {
                    questionsToAsk = customQ.filter(q => q.trim() !== "");
                  } else {
                    questionsToAsk = [
                      "تحدث عن نفسك وخبراتك السابقة التي تجعلك مناسباً لهذا الدور المتقدم عليه.",
                      "ما هو أكبر تحدي واجهته في عملك السابق وكيف قمت بحله؟"
                    ];
                  }

                  return questionsToAsk.map((q, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-600 dark:text-slate-300 font-medium">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      {q}
                    </li>
                  ));
                })()}
              </ul>{" "}
            </div>{" "}
            <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[32px] p-8 text-center flex flex-col items-center">
              {" "}
              {audioUrl ? (
                <div className="w-full space-y-6">
                  {" "}
                  <p className="font-bold text-green-600 flex items-center justify-center gap-2">
                    {" "}
                    <CheckCircle size={20} /> تم تسجيل المقطع بنجاح (
                    {formatTime(recordingTime)}){" "}
                  </p>{" "}
                  <audio controls src={audioUrl} className="w-full" />{" "}
                  <button
                    type="button"
                    onClick={retryRecording}
                    className="text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-red-500 font-bold flex items-center justify-center gap-2 w-full transition-colors"
                  >
                    {" "}
                    <RotateCcw size={18} /> إعادة التسجيل{" "}
                  </button>{" "}
                </div>
              ) : (
                <div className="space-y-6">
                  {" "}
                  <div
                    className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-50 text-red-500 animate-pulse scale-110 shadow-lg shadow-red-500/20" : "bg-slate-100 text-slate-400 dark:text-slate-500"}`}
                  >
                    {" "}
                    {isRecording ? <Mic size={40} /> : <Mic size={40} />}{" "}
                  </div>{" "}
                  {isRecording ? (
                    <div className="space-y-4">
                      {" "}
                      <p className="text-2xl font-bold text-red-500 font-mono">
                        {formatTime(recordingTime)}
                      </p>{" "}
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="bg-red-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 mx-auto shadow-lg shadow-red-500/20"
                      >
                        {" "}
                        <Square size={18} fill="currentColor" /> إيقاف
                        التسجيل{" "}
                      </button>{" "}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {" "}
                      <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
                        انقر للبدء بتسجيل إجابتك (يجب السماح للمتصفح بالوصول
                        للمايكروفون)
                      </p>{" "}
                      <button
                        type="button"
                        onClick={startRecording}
                        className="bg-navy text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mx-auto active:scale-95 shadow-lg shadow-navy/20"
                      >
                        {" "}
                        <Mic size={18} /> بدء التسجيل{" "}
                      </button>{" "}
                    </div>
                  )}{" "}
                </div>
              )}{" "}
            </div>{" "}
            <div className="flex gap-4 pt-4">
              {" "}
              <button
                type="button"
                onClick={() => setFormStep("details")}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 text-slate-600 dark:text-slate-300 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 dark:bg-slate-800/50 transition-all"
              >
                {" "}
                رجوع{" "}
              </button>{" "}
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting || !audioBlob}
                className="flex-[2] bg-primary text-white py-5 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale"
              >
                {" "}
                {isSubmitting ? (
                  <>
                    {" "}
                    <div className="w-5 h-5 border-2 border-white dark:border-slate-700/30 border-t-white rounded-full animate-spin" />{" "}
                    جاري الإرسال...{" "}
                  </>
                ) : (
                  "اعتماد وإرسال الطلب"
                )}{" "}
              </button>{" "}
            </div>{" "}
          </motion.div>
        )}{" "}
      </motion.div>{" "}
    </div>
  );
};
const PreviewModal = ({ job, onClose }: { job: Job; onClose: () => void }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [step, setStep] = useState(
    job.campaignTitle || job.recordType === "campaign"  
      ? "landing" 
      : (job.roles?.[0]?.directUpload || job.directUpload ? "form" : "landing")
  );
  return (
    <div className="fixed inset-0 z-[100] bg-slate-100 dark:bg-slate-900 flex flex-col">
      {" "}
      <div className="h-16 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 bg-white dark:bg-slate-800 sticky top-0 z-10 shadow-sm">
        {" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            {" "}
            <Eye size={20} className="text-primary" />{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-sm font-bold text-navy dark:text-white">
              معاينة حية للمتقدمين
            </p>{" "}
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              لن يتم حفظ البيانات المعبأة هنا
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <button
          onClick={onClose}
          className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors"
        >
          {" "}
          <X size={20} />{" "}
        </button>{" "}
      </div>{" "}
      <div className="flex-1 overflow-y-auto w-full relative">
        {" "}
        {step === "landing" ? (
          <PublicJobPage 
            job={job}
            selectedRoleId={selectedRoleId}
            onSelectRole={(id) => setSelectedRoleId(id)}
            onBackToCampaign={() => setSelectedRoleId(null)}
            onApply={() => setStep("form")}
          />
        ) : (
          <ApplicantForm
            job={job}
            selectedRoleId={selectedRoleId}
            onBackToJobs={() => {
              setStep("landing");
              setSelectedRoleId(null);
            }}
            onSubmit={() => {
              alert("نموذج المعاينة: لن يتم إرسال أي بيانات إلى الخادم.");
              onClose();
            }}
          />
        )}
      </div>{" "}
    </div>
  );
};
const TalentPoolModal = ({
  talent,
  onClose,
}: {
  talent: any;
  onClose: () => void;
}) => {
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  if (!talent) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {" "}
      <ImageLightbox url={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-t-[40px] md:rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border border-white dark:border-slate-700 shadow-2xl relative"
      >
        {" "}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 w-10 h-10 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          {" "}
          <X size={20} />{" "}
        </button>{" "}
        <div className="flex items-center gap-6 mb-8 border-b border-slate-100 dark:border-slate-700 pb-8 mt-4 md:mt-0">
          {" "}
          <div 
            className={`w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center text-3xl font-bold shadow-inner-3d shrink-0 overflow-hidden ${talent.photoUrl ? "cursor-pointer" : ""}`}
            onClick={(e) => {
              if (talent.photoUrl) {
                e.stopPropagation();
                // We don't have lightbox in this modal state, let me add it.
                // Wait, it's easier to add a global or local state to this file. I'll use the simplest react local hook inside the component.
              }
            }}
          >
            {" "}
            {talent.photoUrl ? (
              <img src={talent.photoUrl} alt={talent.name} className="w-full h-full object-cover" />
            ) : (
              talent.name.charAt(0)
            )}{" "}
          </div>{" "}
          <div>
            {" "}
            <h2 className="text-3xl font-bold text-navy dark:text-white mb-2">
              {talent.name}
            </h2>{" "}
            <p className="text-primary font-bold text-lg">
              {talent.job}{" "}
              <span className="text-slate-400 dark:text-slate-500 mx-2">•</span>{" "}
              التوافق:{" "}
              {talent.score || (talent.rating ? talent.rating + "%" : "")}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="space-y-8">
          {" "}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700">
            {" "}
            <h3 className="text-lg font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
              {" "}
              <Sparkles size={20} className="text-primary" /> ملخص الفرز{" "}
            </h3>{" "}
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {talent.aiSummary ||
                "مرشح متميز يمتلك خبرة تتوافق بشكل كبير مع المتطلبات المحددة. أظهر فهماً عميقاً في الجوانب التقنية بالإضافة لمهارات عالية في حل المشكلات."}
            </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <h3 className="text-lg font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
              {" "}
              <Zap size={20} className="text-primary" /> المهارات والكفاءات{" "}
            </h3>{" "}
            <div className="flex flex-wrap gap-2">
              {" "}
              {talent.skills?.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  {" "}
                  {skill}{" "}
                </span>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
            {" "}
            <a
              href={`tel:${talent.phone}`}
              className="flex items-center justify-center gap-3 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-blue-200/50 transition-all active:scale-95"
            >
              {" "}
              <Phone size={22} /> اتصال{" "}
            </a>{" "}
            <a
              href={`https://wa.me/${talent.phone}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-green-200 transition-all active:scale-95"
            >
              {" "}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg> تواصل واتساب{" "}
            </a>{" "}
            <a
              href={`mailto:${talent.email}`}
              className="flex items-center justify-center gap-3 bg-navy text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-navy/20 transition-all active:scale-95"
            >
              {" "}
              <Mail size={22} /> إرسال إيميل{" "}
            </a>{" "}
          </div>{" "}
        </div>{" "}
      </motion.div>{" "}
    </div>
  );
};
const TalentPool = ({
  jobs,
  shortlistedIds,
  onToggleShortlist,
  onCreateJob,
  onViewDetails,
  talentPool,
  onCrossNominate,
}: {
  jobs: Job[];
  shortlistedIds: string[];
  onToggleShortlist: (id: string) => void;
  onCreateJob: () => void;
  onViewDetails: () => void;
  talentPool: Applicant[];
  onCrossNominate?: (applicant: Applicant) => void;
}) => {
  const [jobFilter, setJobFilter] = useState("all");
  const [showOnlyShortlisted, setShowOnlyShortlisted] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<any>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const getScoreColor = (scoreStr: string) => {
    const score = parseInt(scoreStr);
    if (score >= 85) return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800";
    if (score >= 70) return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800";
    return "bg-slate-100 text-slate-600 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700";
  };
  if (jobs.length === 0) {
    return (
      <div className="space-y-10">
        {" "}
        <header>
          {" "}
          <h1 className="text-4xl font-bold mb-3 text-navy dark:text-white">
            بنك الكفاءات
          </h1>{" "}
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
            استكشف جميع المتقدمين عبر كافة الوظائف المتاحة.
          </p>{" "}
        </header>{" "}
        <EmptyState
          title="لوحة التحكم بانتظارك! لم تقم بإنشاء أي شواغر وظيفية حتى الآن."
          actionLabel="أنشئ أول وظيفة الآن"
          onAction={onCreateJob}
        />{" "}
      </div>
    );
  }
  const filteredTalents = talentPool.filter((t) => {
    const matchesJob =
      jobFilter === "all" ||
      t.job.includes(jobs.find((j) => j.id === jobFilter)?.title || "");
    const matchesShortlist =
      !showOnlyShortlisted || shortlistedIds.includes(t.id);
    return matchesJob && matchesShortlist;
  });
  return (
    <div className="space-y-10">
      {" "}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {" "}
        <div>
          {" "}
          <h1 className="text-4xl font-bold mb-3 text-navy dark:text-white">
            بنك الكفاءات
          </h1>{" "}
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
            استكشف جميع المتقدمين عبر كافة الوظائف المتاحة.
          </p>{" "}
        </div>{" "}
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {" "}
          <button
            onClick={() => setShowOnlyShortlisted(false)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!showOnlyShortlisted ? "bg-navy text-white shadow-lg shadow-navy/20" : "text-slate-400 dark:text-slate-500 hover:text-navy dark:text-white"}`}
          >
            {" "}
            الكل{" "}
          </button>{" "}
          <button
            onClick={() => setShowOnlyShortlisted(true)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${showOnlyShortlisted ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 dark:text-slate-500 hover:text-navy dark:text-white"}`}
          >
            {" "}
            <Star
              size={16}
              fill={showOnlyShortlisted ? "currentColor" : "none"}
            />{" "}
            المفضلين{" "}
          </button>{" "}
        </div>{" "}
      </header>{" "}
      <GlobalJobSelector
        jobs={jobs}
        selectedFilter={jobFilter}
        onFilterChange={setJobFilter}
      />{" "}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
        {" "}
        <div className="flex flex-col md:flex-row gap-6">
          {" "}
          <div className="flex-1 relative">
            {" "}
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={20}
            />{" "}
            <input
              type="text"
              placeholder="ابحث عن مهارة، اسم، أو مسمى وظيفي..."
              className="w-full pr-12 pl-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium dark:text-white dark:placeholder-slate-400"
            />{" "}
          </div>{" "}
          <div className="flex gap-4">
            {" "}
            <div className="relative">
              {" "}
              <Filter
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={18}
              />{" "}
              <select className="pr-12 pl-10 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer font-medium min-w-[160px] dark:text-white">
                {" "}
                <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">المهارة</option> <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">React</option>{" "}
                <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">Node.js</option> <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">UI/UX</option>{" "}
              </select>{" "}
            </div>{" "}
            <div className="relative group">
              {" "}
              <Sparkles
                className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-600 dark:text-teal-400 drop-shadow-[0_0_5px_rgba(13,148,136,0.3)] group-hover:scale-110 transition-transform pointer-events-none"
                size={18}
              />{" "}
              <select className="pr-12 pl-10 py-4 bg-teal-50/50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none cursor-pointer font-bold min-w-[160px] text-teal-800 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-teal-900/40">
                {" "}
                <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium">التقييم</option> 
                <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium">+90%</option>{" "}
                <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium">+80%</option> 
                <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium">+70%</option>{" "}
              </select>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {" "}
        {filteredTalents.map((talent: any) => (
          <motion.div
            key={talent.id}
            layout
            whileHover={{ y: -5 }}
            onClick={onViewDetails}
            className="cursor-pointer bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40 group relative overflow-hidden"
          >
            {" "}
            <div className="flex items-start justify-between mb-6">
              {" "}
              <div className="flex gap-3 items-center">
                <div 
                  className={`w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center font-bold text-slate-500 dark:text-slate-200 shadow-inner-3d shrink-0 overflow-hidden ${talent.photoUrl ? "cursor-pointer group-hover:opacity-80" : "group-hover:bg-primary/10 group-hover:text-primary"} transition-colors`}
                  onClick={(e) => {
                    if (talent.photoUrl) {
                      e.stopPropagation();
                      setLightboxPhoto(talent.photoUrl);
                    }
                  }}
                >
                  {" "}
                  {talent.photoUrl ? (
                    <img src={talent.photoUrl} alt={talent.name} className="w-full h-full object-cover" />
                  ) : (
                    talent.name.charAt(0)
                  )}{" "}
                </div>{" "}
                <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-sm ${getScoreColor(talent.rating.toString())}`}>
                  {" "}
                  {talent.rating}% مطابقة{" "}
                </div>{" "}
              </div>
              <div className="flex items-center gap-2 relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleShortlist(talent.id);
                  }}
                  className={`p-2 rounded-xl transition-all ${shortlistedIds.includes(talent.id) ? "bg-yellow-100 text-yellow-500 shadow-lg shadow-yellow-200/50" : "bg-slate-50 dark:bg-slate-800/50 text-slate-300 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"}`}
                >
                  <Star size={20} fill={shortlistedIds.includes(talent.id) ? "currentColor" : "none"} />
                </button>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === talent.id ? null : talent.id);
                    }}
                    className="p-2 rounded-xl transition-all bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-navy dark:hover:text-white"
                  >
                    <MoreVertical size={20} />
                  </button>
                  <AnimatePresence>
                    {openDropdownId === talent.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); }} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          style={{ left: 0, right: 'auto' }}
                          className="absolute top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 py-2 z-50 overflow-hidden"
                        >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onCrossNominate) {
                              onCrossNominate(talent);
                            }
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-right px-4 py-3 text-sm font-bold text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                        >
                          <Briefcase size={16} className="text-primary" /> ترشيح لشاغر جديد
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-slate-700 w-full my-1"></div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("هل أنت متأكد من الحذف؟")) setOpenDropdownId(null);
                          }}
                          className="w-full text-right px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
                        >
                          <Trash2 size={16} /> إزالة من البنك
                        </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>{" "}
            </div>{" "}
            <h3 className="text-xl font-bold text-navy dark:text-white mb-1">
              {talent.name}
            </h3>{" "}
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium mb-6">
              {talent.job}
            </p>{" "}
            <div className="flex flex-wrap gap-2 mb-8">
              {" "}
              {talent.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm"
                >
                  {" "}
                  {skill}{" "}
                </span>
              ))}{" "}
            </div>{" "}
            <div className="flex items-center gap-2 pt-6 border-t border-slate-50 dark:border-slate-700">
              {" "}
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                className="w-full flex items-center justify-center gap-2 bg-navy text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-navy/20"
              >
                {" "}
                <FileText size={18} /> عرض الملف{" "}
              </button>{" "}
            </div>{" "}
          </motion.div>
        ))}{" "}
        {filteredTalents.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white dark:bg-slate-800 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-700">
            {" "}
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              {" "}
              <Users size={32} className="text-slate-300" />{" "}
            </div>{" "}
            <h3 className="text-xl font-bold text-navy dark:text-white mb-2">
              لا يوجد مرشحين مطابقين
            </h3>{" "}
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
              حاول تغيير معايير البحث أو الفلترة.
            </p>{" "}
          </div>
        )}{" "}
      </div>{" "}
      <AnimatePresence>
        {" "}
        {selectedTalent && (
          <TalentPoolModal
            talent={selectedTalent}
            onClose={() => setSelectedTalent(null)}
          />
        )}{" "}
      </AnimatePresence>{" "}
      <ImageLightbox url={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
    </div>
  );
};
const GlobalJobSelector = ({
  jobs,
  selectedFilter,
  onFilterChange,
}: {
  jobs: Job[];
  selectedFilter: string;
  onFilterChange: (id: string) => void;
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-[32px] border border-white dark:border-slate-700 shadow-sm">
      {" "}
      <div className="flex items-center gap-4">
        {" "}
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
          {" "}
          <Filter size={20} />{" "}
        </div>{" "}
        <div>
          {" "}
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            عرض البيانات لـ:
          </p>{" "}
          <div className="relative mt-1 flex items-center">
            {" "}
            <select
              value={selectedFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="bg-transparent dark:bg-transparent dark:text-white font-bold text-navy dark:text-white text-lg outline-none appearance-none cursor-pointer pl-5"
            >
              {" "}
              <option value="all" className="bg-white text-navy dark:bg-slate-800 dark:text-white">كل الوظائف</option>{" "}
              {jobs.map((job) => (
                <option key={job.id} value={job.id} className="bg-white text-navy dark:bg-slate-800 dark:text-white">
                  {job.title} - {job.company}
                </option>
              ))}
            </select>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
              {" "}
              <ArrowLeft size={16} className="-rotate-90" />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-300 text-xs font-medium bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2 rounded-full border dark:border-slate-700">
        {" "}
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> يتم
        تحديث جميع الإحصائيات والرسوم البيانية تلقائياً{" "}
      </div>{" "}
    </div>
  );
};
const Reports = ({ jobs, filterId }: { jobs: Job[]; filterId: string }) => {
  const sourceOfHireData = [
    { 
      name: "منصات التوظيف", 
      value: filterId === "all" ? 45 : 12, 
      breakdown: [{name: "لينكد إن", value: 35}, {name: "بيت.كوم", value: 10}]
    },
    { 
      name: "شبكات التواصل", 
      value: filterId === "all" ? 30 : 8, 
      breakdown: [{name: "تويتر / X", value: 20}, {name: "فيسبوك", value: 10}]
    },
    { 
      name: "تطبيقات المراسلة", 
      value: filterId === "all" ? 15 : 5, 
      breakdown: [{name: "واتساب", value: 10}, {name: "تيليجرام", value: 5}]
    },
    { 
      name: "مصادر أخرى", 
      value: filterId === "all" ? 10 : 2, 
      breakdown: [{name: "الإحالات", value: 6}, {name: "موقع الشركة", value: 4}]
    },
  ];

  const hiringFunnelData = [
    { name: "إجمالي المتقدمين", value: filterId === "all" ? 1200 : 350, fill: "#3b82f6" },
    { name: "الفرز الآلي", value: filterId === "all" ? 400 : 120, fill: "#10b981" },
    { name: "المقابلات", value: filterId === "all" ? 150 : 45, fill: "#f59e0b" },
    { name: "العروض", value: filterId === "all" ? 40 : 12, fill: "#8b5cf6" },
  ];

  const rejectionReasonsData = [
    { name: "تجاوز الميزانية", value: filterId === "all" ? 300 : 85 },
    { name: "نقص الخبرة", value: filterId === "all" ? 250 : 70 },
    { name: "عدم تطابق المؤهل", value: filterId === "all" ? 200 : 60 },
    { name: "الجنسية", value: filterId === "all" ? 50 : 15 },
  ];
  const COLORS = ["#0077b5", "#0d9488", "#000000", "#f59e0b"];
  return (
    <div className="space-y-8 pb-10">
      {" "}
      <header className="mb-10">
        {" "}
        <h1 className="text-4xl font-bold mb-3 text-navy dark:text-white">
          التقارير والتحليلات
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium text-lg">
          نظرة شاملة ودقيقة على أداء عمليات التوظيف والبيانات التحليلية.
        </p>{" "}
      </header>{" "}
      {/* Top Row: Metric Cards */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {" "}
        {[
          {
            label: "إجمالي المتقدمين",
            value: "2,840",
            icon: <Users size={24} />,
            color: "text-teal-600",
            bg: "bg-teal-50",
            subtitle: "✨ تم استبعاد 70% آلياً.",
          },
          {
            label: "إجمالي الوظائف",
            value: "24",
            icon: <Briefcase size={24} />,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "متوسط وقت التوظيف",
            value: "12 يوم",
            icon: <Clock size={24} />,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center"
          >
            {" "}
            <div
              className={`w-16 h-16 ${metric.bg} ${metric.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner-3d`}
            >
              {" "}
              {metric.icon}{" "}
            </div>{" "}
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mb-2">
              {metric.label}
            </p>{" "}
            <h3 className="text-4xl font-bold text-navy dark:text-white">
              {metric.value}
            </h3>{" "}
            {metric.subtitle && (
              <p className="mt-4 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-xl">
                {metric.subtitle}
              </p>
            )}
          </motion.div>
        ))}{" "}
      </div>{" "}
      {/* Middle Row: Charts */}{" "}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {" "}
        {/* Source of Hire Pie Chart Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
          {" "}
          <div className="flex items-center justify-between mb-10">
            {" "}
            <h3 className="text-xl font-bold text-navy dark:text-white">
              مصادر التوظيف
            </h3>{" "}
            <PieChartIcon className="text-slate-300" size={24} />{" "}
          </div>{" "}
          <div className="h-[350px] w-full">
            {" "}
            <ResponsiveContainer width="100%" height="100%">
              {" "}
              <PieChart>
                {" "}
                <Pie
                  data={sourceOfHireData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                >
                  {" "}
                  {sourceOfHireData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}{" "}
                </Pie>{" "}
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 min-w-[160px] text-right" dir="rtl">
                          <p className="font-bold text-slate-500 dark:text-slate-400 mb-2 text-xs">{data.name}</p>
                          <p className="text-navy dark:text-white font-black text-lg mb-2">
                            {data.value} مرشحاً
                          </p>
                          {data.breakdown && data.breakdown.length > 0 && (
                            <div className="space-y-1 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                              {data.breakdown.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                  <span>{item.name}</span>
                                  <span className="text-primary">{item.value}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />{" "}
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-navy dark:text-white font-bold text-sm mr-2">
                      {value}
                    </span>
                  )}
                />{" "}
              </PieChart>{" "}
            </ResponsiveContainer>{" "}
          </div>{" "}
        </div>{" "}
        {/* Hiring Funnel Chart Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
          {" "}
          <div className="flex items-center justify-between mb-10">
            {" "}
            <h3 className="text-xl font-bold text-navy dark:text-white">
              مسار توظيف المتقدمين
            </h3>{" "}
            <BarChartIcon className="text-slate-300" size={24} />{" "}
          </div>{" "}
          <div className="h-[350px] w-full" dir="ltr">
            {" "}
            <ResponsiveContainer width="100%" height="100%">
              {" "}
              <BarChart
                data={hiringFunnelData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 160, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="funnelFlowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#bfdbfe" stopOpacity={0.9}/>
                    <stop offset="20%" stopColor="#60a5fa" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={1}/>
                  </linearGradient>
                  <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#94a3b8" floodOpacity="0.5"/>
                  </filter>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                  strokeOpacity={0.1}
                />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 14, fontWeight: "bold" }}
                  width={150}
                  tickMargin={10}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 min-w-[120px] text-right" dir="rtl">
                          <p className="font-bold text-slate-500 dark:text-slate-400 mb-2 text-xs">{label}</p>
                          <p className="text-emerald-600 font-black text-sm flex items-center gap-1">{payload[0].value} متقدماً</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#funnelFlowGrad)"
                  radius={16}
                  barSize={32}
                  filter="url(#barShadow)"
                />
              </BarChart>{" "}
            </ResponsiveContainer>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Bottom Row: Full Width Bar Chart for Rejection Reasons */}
      <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
        {" "}
        <div className="flex items-center justify-between mb-10">
          {" "}
          <div>
            {" "}
            <h3 className="text-xl font-bold text-navy dark:text-white">
              أبرز أسباب الاستبعاد الآلي
            </h3>{" "}
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1">
              مؤشر كفاءة محرك الفرز بناءً على تحليل أسباب رفض المتقدمين التلقائي.
            </p>{" "}
          </div>{" "}
          <BarChartIcon className="text-slate-300" size={24} />{" "}
        </div>{" "}
        <div className="h-[400px] w-full" dir="ltr">
          {" "}
          <ResponsiveContainer width="100%" height="100%">
            {" "}
            <BarChart
              data={rejectionReasonsData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 160, bottom: 20 }}
            >
              <defs>
                <linearGradient id="rejectionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity={0.9}/>
                  <stop offset="20%" stopColor="#94a3b8" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#475569" stopOpacity={1}/>
                </linearGradient>
                <filter id="barShadowRed" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#94a3b8" floodOpacity="0.5"/>
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#f1f5f9"
                strokeOpacity={0.2}
              />{" "}
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 500 }}
              />{" "}
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 14, fontWeight: "bold" }}
                width={150}
                tickMargin={10}
              />{" "}
              <Tooltip
                cursor={{ fill: 'transparent' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 min-w-[120px] text-right" dir="rtl">
                        <p className="font-bold text-slate-500 dark:text-slate-400 mb-2 text-xs">{label}</p>
                        <p className="text-slate-600 font-black text-sm flex items-center gap-1">تم استبعاد {payload[0].value} مرشحاً</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />{" "}
              <Bar
                dataKey="value"
                fill="url(#rejectionGrad)"
                radius={12}
                barSize={30}
                filter="url(#barShadowRed)"
              />{" "}
            </BarChart>{" "}
          </ResponsiveContainer>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
const SettingsPage = ({
  darkMode,
  setDarkMode,
  userProfile,
  setUserProfile
}: {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userProfile: any;
  setUserProfile: any;
}) => {
  const [activeTab, setActiveTab] = useState("الملف الشخصي");
  return (
    <div className="space-y-10">
      {" "}
      <header>
        {" "}
        <h1 className={`text-4xl font-bold mb-3 text-navy dark:text-white`}>
          الإعدادات
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
          إدارة حسابك، اشتراكك، وتكاملات النظام.
        </p>{" "}
      </header>{" "}
      <div
        className={`bg-white dark:bg-slate-800 border-white dark:bg-slate-800 dark:border-slate-700 rounded-[40px] border shadow-xl shadow-slate-200/40 overflow-hidden transition-colors duration-300`}
      >
        {" "}
        <div
          className={`flex border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 dark:bg-slate-900/50`}
        >
          {" "}
          {["الملف الشخصي", "ملف الشركة", "باقة الاشتراك", "المحفظة", "المظهر"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-6 font-bold text-sm transition-all relative ${activeTab === tab ? "text-primary" : "text-slate-400 dark:text-slate-500 hover:text-navy dark:text-white"}`}
            >
              {" "}
              {tab}{" "}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                />
              )}{" "}
            </button>
          ))}{" "}
        </div>{" "}
        <div className="p-12">
          {" "}
          {activeTab === "الملف الشخصي" && (
            <div className="max-w-2xl space-y-8">
              <div className="flex items-center gap-8 mb-10">
                <label className="cursor-pointer relative overflow-hidden w-24 h-24 rounded-3xl bg-slate-100 border-slate-200 dark:bg-slate-700 dark:border-slate-600 flex items-center justify-center border-2 border-dashed group hover:border-primary/50 transition-colors">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                          setUserProfile({...userProfile, avatar: URL.createObjectURL(e.target.files[0])});
                      }
                  }} />
                  {userProfile.avatar ? (
                      <img src={userProfile.avatar} className="w-full h-full object-cover" alt="User Avatar" />
                  ) : (
                      <Upload size={32} className="text-slate-300 group-hover:text-primary transition-colors" />
                  )}
                </label>
                <div>
                  <h4 className="font-bold text-navy dark:text-white mb-1">الصورة الشخصية</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">يفضل استخدام صورة مربعة واضحة المعالم</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-navy dark:text-slate-300">الاسم بالكامل</label>
                  <input type="text" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-navy dark:text-slate-300">المسمى الوظيفي</label>
                  <input type="text" value={userProfile.title} onChange={(e) => setUserProfile({...userProfile, title: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "ملف الشركة" && (

            <div className="max-w-2xl space-y-8">
              {" "}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {" "}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-navy dark:text-slate-300">نوع الكيان</label>
                  <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 gap-1.5 rounded-2xl w-full">
                    <button type="button" onClick={() => setUserProfile({...userProfile, entityType: "company"})} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${userProfile.entityType === "company" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>جهة اعتبارية (شركة/مؤسسة)</button>
                    <button type="button" onClick={() => setUserProfile({...userProfile, entityType: "freelance"})} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${userProfile.entityType === "freelance" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>فرد مستقل (عمل حر)</button>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-navy dark:text-slate-300">
                    {userProfile.entityType === "company" ? "اسم المنشأة" : "الاسم الثلاثي المعتمد"}
                  </label>
                  <input
                    type="text"
                    value={userProfile.companyName || ""}
                    onChange={(e) => setUserProfile({...userProfile, companyName: e.target.value})}
                    placeholder={userProfile.entityType === "company" ? "شركة الحلول الذكية..." : "عبدالله محمد..."}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                  />
                </div>
                
                {userProfile.entityType === "company" ? (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy dark:text-slate-300">رقم السجل التجاري (CR)</label>
                    <input
                      type="text"
                      value={userProfile.commercialRegistration || ""}
                      onChange={(e) => setUserProfile({...userProfile, commercialRegistration: e.target.value})}
                      placeholder="1010XXXXXX"
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                      dir="ltr"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy dark:text-slate-300">رقم وثيقة العمل الحر</label>
                    <input
                      type="text"
                      value={userProfile.freelanceDocument || ""}
                      onChange={(e) => setUserProfile({...userProfile, freelanceDocument: e.target.value})}
                      placeholder="FL-XXXXXX"
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                      dir="ltr"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy dark:text-slate-300">المدينة (اختياري)</label>
                  <input
                    type="text"
                    value={userProfile.city || ""}
                    onChange={(e) => setUserProfile({...userProfile, city: e.target.value})}
                    placeholder="الرياض، جدة..."
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  {" "}
                  <label
                    className={`text-sm font-bold text-navy dark:text-slate-300`}
                  >
                    الرقم الضريبي (Tax ID) <span className="text-slate-400 font-normal ml-1">(اختياري)</span>
                  </label>{" "}
                  <input
                    type="text"
                    value={userProfile.taxNumber || ""}
                    onChange={(e) => setUserProfile({...userProfile, taxNumber: e.target.value})}
                    placeholder="3000XXXXXXXX003"
                    className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium`}
                    dir="ltr"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
                حفظ التغييرات
              </button>{" "}
            </div>
          )}{" "}
          {activeTab === "باقة الاشتراك" && (
            <div className="space-y-8">
              {" "}
              <div className="bg-navy text-white p-10 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8">
                {" "}
                <div>
                  {" "}
                  <div className="bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-bold inline-block mb-4">
                    الباقة الاحترافية
                  </div>{" "}
                  <h3 className="text-3xl font-bold mb-2">
                    أنت تستخدم الباقة غير المحدودة
                  </h3>{" "}
                  <p className="text-slate-400 dark:text-slate-500 font-medium">
                    ينتهي اشتراكك في 15 مايو 2026
                  </p>{" "}
                </div>{" "}
                <button className="bg-white dark:bg-slate-800 text-navy dark:text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 dark:bg-slate-800/50 transition-all active:scale-95">
                  ترقية الباقة
                </button>{" "}
              </div>{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {" "}
                {[
                  {
                    label: "الوظائف النشطة",
                    value: <span dir="ltr">12 / ∞</span>,
                    icon: <Briefcase />,
                  },
                  {
                    label: "السير الذاتية المعالجة",
                    value: <span dir="ltr">1,240 / 5,000</span>,
                    icon: <FileText />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-6 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:bg-slate-900 dark:border-slate-700 rounded-[24px] border border-r-4 border-r-primary`}
                  >
                    {" "}
                    <div className="text-primary mb-4">{item.icon}</div>{" "}
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 font-bold mb-2">
                      {item.label}
                    </p>{" "}
                    <p
                      className={`text-2xl font-bold flex items-center justify-between xl:justify-start text-navy dark:text-white`}
                    >
                      {" "}
                      {item.value}{" "}
                    </p>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>
          )}{" "}
          {activeTab === "المحفظة" && (
            <div className="max-w-4xl space-y-8">
              <div>
                <h4 className="text-xl font-bold text-navy dark:text-white mb-2">محفظة الرصيد</h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  أضف رصيداً لدفع اشتراكاتك والخدمات الإضافية بسهولة وأمان.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-gradient-to-br from-primary to-primary/80 rounded-[32px] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 p-6 opacity-20"><Wallet size={160} /></div>
                  <h3 className="text-white/80 font-medium mb-2 relative z-10">الرصيد المتاح</h3>
                  <div className="flex items-baseline gap-2 relative z-10 mb-8">
                    <span className="text-5xl font-bold drop-shadow-md">0</span>
                    <span className="text-xl font-medium text-white/80">ر.س</span>
                  </div>
                  <button onClick={() => alert('نظام ميسور قيد التجهيز. هذه الواجهة للتدريب حالياً.')} className="w-full bg-white text-primary py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 relative z-10 group">
                    <Plus size={20} className="group-hover:scale-110 transition-transform" /> شحن الرصيد
                  </button>
                </div>

                <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700 p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-navy dark:text-white text-lg">سجل العمليات</h4>
                    <span className="text-xs font-bold text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">آخر 30 يوم</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-10">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300 dark:text-slate-600 shadow-inner">
                      <Clock size={32} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-500 dark:text-slate-400 mb-1">لا توجد عمليات سابقة</p>
                      <p className="text-sm text-slate-400 dark:text-slate-500">ستظهر هنا عمليات شحن وسحب الرصيد الخاصة بك.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}{" "}
          {activeTab === "المظهر" && (
            <div className="max-w-2xl space-y-8">
              {" "}
              <div>
                {" "}
                <h4
                  className={`text-xl font-bold text-navy dark:text-white mb-2`}
                >
                  تخصيص المظهر
                </h4>{" "}
                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
                  اختر الوضع الذي يريح عينيك أثناء العمل.
                </p>{" "}
              </div>{" "}
              <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700">
                {" "}
                <div className="flex items-center gap-4">
                  {" "}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 shadow-sm dark:bg-navy dark:text-primary`}
                  >
                    {" "}
                    {darkMode ? <Moon size={28} /> : <Sun size={28} />}{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className={`font-bold text-navy dark:text-white`}>
                      الوضع الليلي
                    </p>{" "}
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {darkMode ? "مفعل حالياً" : "غير مفعل"}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={darkMode} 
                    onChange={(e) => setDarkMode(e.target.checked)} 
                  />
                  <div className="relative w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.6rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                </label>
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
const ActiveJobs = ({
  jobs,
  onManage,
  onCreateJob,
  onClone,
  onDeactivate,
  onPreview,
  onReactivate,
  onDelete,
}: {
  jobs: Job[];
  onManage: (job: Job) => void;
  onCreateJob: () => void;
  onClone?: (job: Job) => void;
  onDeactivate?: (job: Job) => void;
  onPreview?: (job: Job) => void;
  onReactivate?: (job: Job) => void;
  onDelete?: (id: string) => void;
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="لا توجد شواغر وظيفية حالياً بانتظارك."
        actionLabel="أنشئ وظيفة جديدة الآن"
        onAction={onCreateJob}
      />
    );
  }
  const isJobExpired = (job: Job) => {
    if (job.status === "مغلق") return true;
    if (!job.endDate) return false;
    return new Date() > new Date(job.endDate);
  };
  const copyLink = (job: Job) => {
    if (job.status === "مسودة") {
      alert("لا يوجد رابط حالياً، يجب نشر الإعلان وظيفياً أولاً.");
      return;
    }
    navigator.clipboard.writeText(`https://smart-recruitment.sa/apply/${job.id}`);
    setCopiedId(job.id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  const getJobIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("خدمة") || t.includes("عملاء") || t.includes("customer"))
      return <User size={24} />;
    if (
      t.includes("كاشير") ||
      t.includes("بائع") ||
      t.includes("مبيعات") ||
      t.includes("sales") ||
      t.includes("cashier")
    )
      return <ShoppingBag size={24} />;
    return <Briefcase size={24} />;
  };
  return (
    <>
      {openDropdownId && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setOpenDropdownId(null)} 
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {" "}
        {jobs.map((job) => {
          const expired = isJobExpired(job);
        return (
          <motion.div
            key={job.id}
            style={{ zIndex: openDropdownId === job.id ? 20 : 1 }}
            whileHover={!expired ? { y: -5 } : {}}
            className={`bg-white relative dark:bg-slate-800 p-8 rounded-[32px] border border-white dark:border-slate-700 shadow-xl group flex flex-col transition-all ${expired ? "opacity-60 grayscale-[0.3]" : "shadow-slate-200/40"}`}
          >
            {" "}
            <div className="flex items-center justify-between mb-6">
              {" "}
              <div
                className={`w-14 h-14 ${expired ? "bg-slate-100 text-slate-400 dark:text-slate-500" : "bg-primary/10 text-primary"} rounded-2xl flex items-center justify-center shadow-inner-3d`}
              >
                {" "}
                {getJobIcon(job.title)}{" "}
              </div>{" "}
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold ${expired ? "bg-slate-100 text-slate-500 dark:text-slate-400 dark:text-slate-500" : "bg-green-100 text-green-700"}`}
              >
                {" "}
                {expired ? "منتهي/مغلق" : job.status}{" "}
              </div>{" "}
            </div>{" "}
            <h3
              className={`text-xl font-bold mb-1 ${expired ? "text-slate-500 dark:text-slate-400 dark:text-slate-500" : "text-navy dark:text-white"}`}
            >
              {job.title}
            </h3>{" "}
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium mb-6">
              {job.company}
            </p>{" "}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {" "}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                {" "}
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">
                  المتقدمين
                </p>{" "}
                <p
                  className={`text-lg font-bold ${expired ? "text-slate-500 dark:text-slate-400 dark:text-slate-500" : "text-navy dark:text-white"}`}
                >
                  {job.applicants}
                </p>{" "}
              </div>{" "}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                {" "}
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">
                  نوع العمل
                </p>{" "}
                <p
                  className={`text-lg font-bold ${expired ? "text-slate-500 dark:text-slate-400 dark:text-slate-500" : "text-navy dark:text-white"}`}
                >
                  {job.type}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
              {" "}
              <div className="flex items-center gap-3">
                {" "}
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                  نُشر: {job.createdAt}
                </span>{" "}
              </div>{" "}
              <div className="flex items-center gap-2">
                {" "}
                <button
                  onClick={() => job.status === "مسودة" ? onClone(job) : onManage(job)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.95] ${expired ? "bg-slate-200 text-slate-600 dark:text-slate-300 hover:bg-slate-300" : "bg-navy text-white hover:bg-slate-800 shadow-lg shadow-navy/10"}`}
                >
                  {" "}
                  {job.status === "مسودة" ? "إكمال المسودة" : "إدارة الوظيفة"}{" "}
                </button>{" "}
                <div className="relative">
                  {" "}
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === job.id ? null : job.id,
                      )
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:bg-slate-800/50 transition-colors"
                  >
                    {" "}
                    <MoreVertical size={18} />{" "}
                  </button>{" "}
                  {openDropdownId === job.id && (
                    <>
                      <div
                        style={{ left: 0, right: 'auto' }}
                        className="absolute bottom-full mb-2 w-48 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden z-20 py-2 origin-bottom-left"
                      >
                      {" "}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          copyLink(job);
                          setOpenDropdownId(null);
                        }}
                        className="w-full text-right px-4 py-3 text-sm font-bold text-navy dark:text-white hover:bg-slate-50 dark:bg-slate-800/50 transition-colors flex items-center gap-3"
                      >
                        {" "}
                        <Share2
                          size={16}
                          className="text-slate-400 dark:text-slate-500"
                        />{" "}
                        نسخ الرابط{" "}
                      </button>{" "}
                      {onPreview && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onPreview(job);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-right px-4 py-3 text-sm font-bold text-navy dark:text-white hover:bg-slate-50 dark:bg-slate-800/50 transition-colors flex items-center gap-3 border-t border-slate-50"
                        >
                          {" "}
                          <Eye
                            size={16}
                            className="text-slate-400 dark:text-slate-500"
                          />{" "}
                          معاينة الإعلان{" "}
                        </button>
                      )}{" "}
                      {onClone && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClone(job);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-right px-4 py-3 text-sm font-bold text-navy dark:text-white hover:bg-slate-50 dark:bg-slate-800/50 transition-colors flex items-center gap-3"
                        >
                          {" "}
                          <Copy
                            size={16}
                            className="text-slate-400 dark:text-slate-500"
                          />{" "}
                          تكرار الإعلان{" "}
                        </button>
                      )}{" "}
                      {!expired && onDeactivate && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeactivate(job);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-right px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-slate-50 mt-1"
                        >
                          {" "}
                          <Ban size={16} /> نقل إلى غير النشطة{" "}
                        </button>
                      )}{" "}
                      {expired && onReactivate && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onReactivate(job);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-right px-4 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center gap-3 border-t border-slate-50 dark:border-slate-700 mt-1"
                        >
                          {" "}
                          <RotateCcw size={16} /> تنشيط الإعلان{" "}
                        </button>
                      )}{" "}
                      {job.status === "مسودة" && onDelete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenDropdownId(null);
                            onDelete(job.id);
                          }}
                          className="w-full text-right px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-slate-50 mt-1"
                        >
                          <Trash2 size={16} /> حذف المسودة
                        </button>
                      )}
                    </div>
                    </>
                  )}{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </motion.div>
        );
      })}{" "}
    </div>
  </>
  );
};
interface Applicant {
  id: string;
  name: string;
  job: string;
  rating: number;
  photoUrl?: string;
  // For AI Score e.g. 95
  status: string;
  // e.g. "فوري", "أسبوعين"
  color: string;
  phone: string;
  email: string;
  skills: string[];
  aiSummary: string;
  voiceEval: string;
  customAnswers: { question: string; answer: string }[];
  decision?: "accepted" | "rejected" | "pending";
  nominatedTo?: string;
}
const mockApplicants: Applicant[] = [
  {
    id: "c1",
    name: "أحمد علي",
    job: "كاشير",
    rating: 95,
    photoUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    status: "فوري",
    color: "teal",
    phone: "966500000001",
    email: "ahmed@example.com",
    skills: ["React", "Node.js"],
    aiSummary:
      "مرشح متميز يمتلك خبرة تفوق 5 سنوات في إدارة المبيعات وتفاعل العملاء بمرونة واحترافية.",
    voiceEval:
      "نبرة صوت هادئة، إجابات واضحة ومباشرة. أظهر ثقة عالية عند التحدث عن تحديات العمل.",
    customAnswers: [
      {
        question: "لماذا ترغب بالعمل معنا؟",
        answer: "أرغب بتطوير مهاراتي في بيئة ديناميكية.",
      },
    ],
  },
  {
    id: "c2",
    name: "سارة محمد",
    job: "خدمة عملاء",
    rating: 88,
    status: "أسبوعين",
    color: "indigo",
    phone: "966500000002",
    email: "sara@example.com",
    skills: ["Figma", "UI/UX"],
    aiSummary:
      "أظهرت شغفاً واهتماماً بالتفاصيل، مع تركيز عالي على جودة تجربة العميل.",
    voiceEval: "تفاعلية وإيجابية، طريقة التحدث تظهر دبلوماسية ولباقة.",
    customAnswers: [
      {
        question: "كيف تتعاملين مع ضغط العمل؟",
        answer: "بتنظيم المهام وتحديد الأولويات.",
      },
    ],
  },
  {
    id: "c3",
    name: "خالد عبدالله",
    job: "مهندس برمجيات",
    rating: 76,
    status: "فوري",
    color: "orange",
    phone: "966500000003",
    email: "khaled@example.com",
    skills: ["Python", "SQL"],
    aiSummary:
      "يمتلك أساسيات برمجية قوية، لكنه يفتقر للخبرة العملية في إدارة المشاريع الكبيرة.",
    voiceEval: "هادئ، كان متردداً في بعض الإجابات التقنية العميقة.",
    customAnswers: [
      {
        question: "أكبر تحدي واجهته؟",
        answer: "نقل قاعدة بيانات ضخمة بدون توقف النظام.",
      },
    ],
  },
  {
    id: "c4",
    name: "ليلى حسن",
    job: "مدير مبيعات",
    rating: 92,
    status: "شهر",
    color: "teal",
    phone: "966500000004",
    email: "layla@example.com",
    skills: ["Agile", "Scrum"],
    aiSummary: "شخصية قيادية بقدرات تحليلية استثنائية وإمكانات نمو واعدة.",
    voiceEval: "واثقة ومقنعة، تجيد التفاوض بشكل ممتاز.",
    customAnswers: [
      {
        question: "أين ترين نفسك بعد 5 سنوات؟",
        answer: "مديرة إقليمية تقود فريق مبيعات ضخم.",
      },
    ],
  },
];

const FastScreening = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter((f: any) =>
        f.type === "application/pdf"
      );
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((f: any) =>
        f.type === "application/pdf"
      );
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startScreening = () => {
    if (!title.trim() || !description.trim() || files.length === 0) {
       alert("الرجاء تعبئة المسمى الوظيفي، الوصف، ورفع ملف PDF واحد على الأقل.");
       return;
    }
    
    setIsProcessing(true);
    
    const formData = new FormData();
    formData.append("jobTitle", title);
    formData.append("jobDescription", description);
    files.forEach((file, index) => {
      formData.append(`resume_${index}`, file);
    });
    
    console.log("🚀 [الفرز السريع] يتم الآن إرسال حزمة البيانات (Bulk Upload):");
    console.log("- المسمى الوظيفي:", formData.get("jobTitle"));
    console.log("- الوصف المطول:", formData.get("jobDescription"));
    console.log(`- عدد الملفات المرفوعة: ${files.length} ملف PDF`);
    
    // Webhook POST placeholder:
    // fetch("NEW_N8N_WEBHOOK_URL", { method: 'POST', body: formData })
    
    // Mock Response delay
    setTimeout(() => {
      setIsProcessing(false);
      setResults(files.map((f, i) => ({
        id: i + 1,
        name: f.name.replace(".pdf", ""),
        matchPercentage: Math.floor(Math.random() * (98 - 60 + 1) + 60),
      })).sort((a, b) => b.matchPercentage - a.matchPercentage));
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
          <Zap size={32} className="text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-navy dark:text-white mb-4">الفرز الذكي السريع</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto text-lg leading-relaxed">
          قيم السير الذاتية الجاهزة لديك مقابل أي مسمى وظيفي باستخدام محرك الذكاء الاصطناعي مباشرة دون الحاجة لفتح حملة توظيف.
        </p>
      </header>

      {!results ? (
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-100 dark:border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-navy dark:text-white mb-2 ml-1">
                المسمى الوظيفي <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: مطور واجهات أمامية"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl outline-none focus:border-primary font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-navy dark:text-white mb-2 ml-1">
                وصف ومعايير الوظيفة <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ألصق هنا الوصف الوظيفي والمسؤوليات وأي شروط إضافية تريد من الذكاء الاصطناعي مطابقتها بدقة..."
                rows={5}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl outline-none focus:border-primary font-medium resize-none leading-relaxed scrollbar-thin"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-navy dark:text-white mb-2 ml-1">
                رفع السير الذاتية (PDF Bulk) <span className="text-red-500">*</span>
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative overflow-hidden w-full p-10 border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center gap-4 ${isDragging ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/20 hover:border-primary/50 cursor-pointer"}`}
              >
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                  <Upload size={28} className={isDragging ? "text-primary" : "text-slate-400"} />
                </div>
                <div className="text-center">
                  <span className="font-bold text-navy dark:text-white block mb-1 text-lg">
                    اسحب وأفلت السير الذاتية هنا
                  </span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    أو اضغط لتحديد الملفات من جهازك (بصيغة PDF فقط)
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              
              {files.length > 0 && (
                <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 break-words">
                  <p className="text-sm font-bold text-navy dark:text-white mb-4">تم رفع ({files.length}) ملفات:</p>
                  <div className="flex flex-wrap gap-3">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm border border-slate-200 dark:border-slate-700">
                        <FileText size={16} className="text-primary" />
                        <span className="truncate max-w-[150px]">{file.name}</span>
                        <button onClick={() => removeFile(idx)} className="hover:text-red-500 transition-colors mr-2">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={startScreening}
              disabled={isProcessing || !title.trim() || !description.trim() || files.length === 0}
              className="w-full py-5 px-8 rounded-2xl bg-primary text-white font-bold text-lg transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 flex justify-center items-center gap-3 mt-6"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري تحليل السير المرفوعة...
                </>
              ) : (
                <>
                  ابدأ الفرز الذكي الآن
                  <Zap size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-100 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-700">
            <div>
                <h2 className="text-2xl font-bold text-navy dark:text-white flex items-center gap-3">نتائج مطابقة: {title} <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">{results.length} سير</span></h2>
            </div>
            <button 
              onClick={() => { setResults(null); setFiles([]); setTitle(""); setDescription(""); }} 
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              عملية فرز جديدة
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300 w-1/2">اسم المتقدم (من الملف)</th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300">نسبة المطابقة</th>
                  <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res: any, idx: number) => (
                  <tr key={res.id} className={`border-b dark:border-slate-700 ${idx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50 dark:bg-slate-900/50"} hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors`}>
                    <td className="px-6 py-4 font-bold text-navy dark:text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <span className="truncate max-w-[200px] text-base">{res.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-[150px] h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${res.matchPercentage >= 85 ? "bg-emerald-500" : res.matchPercentage >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${res.matchPercentage}%` }}
                          />
                        </div>
                        <span className={`font-bold text-base ${res.matchPercentage >= 85 ? "text-emerald-500" : res.matchPercentage >= 70 ? "text-amber-500" : "text-red-500"}`}>
                          {res.matchPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-2 text-primary font-bold hover:underline transition-all">
                        عرض التقييم <ArrowLeft size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
const Dashboard = ({
  onViewDetails,
  onCreateJob,
  onManageJob,
  onCloneJob,
  onDeactivateJob,
  onReactivateJob,
  onPreviewJob,
  jobs,
  shortlistedIds,
  onToggleShortlist,
  darkMode,
  setDarkMode,
  userProfile,
  setUserProfile,
  activeTab,
  setActiveTab,
  onShowOnboarding,
  talentPool,
  setTalentPool,
  onDeleteJob,
  onDeleteAllDrafts,
}: {
  onViewDetails: () => void;
  onCreateJob: () => void;
  onManageJob: (job: Job) => void;
  onCloneJob: (job: Job) => void;
  onDeactivateJob: (job: Job) => void;
  onReactivateJob?: (job: Job) => void;
  onPreviewJob: (job: Job) => void;
  jobs: Job[];
  shortlistedIds: string[];
  onToggleShortlist: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userProfile: any;
  setUserProfile: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onShowOnboarding: () => void;
  talentPool?: Applicant[];
  setTalentPool: React.Dispatch<React.SetStateAction<Applicant[]>>;
  onDeleteJob?: (id: string) => void;
  onDeleteAllDrafts?: () => void;
}) => {
  const [jobFilter, setJobFilter] = useState("all");
  const [decisionFilter, setDecisionFilter] = useState<"pending" | "accepted" | "rejected">("pending");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [crossNominateApplicant, setCrossNominateApplicant] = useState<Applicant | null>(null);
  const [crossNominateJobId, setCrossNominateJobId] = useState<string>("");
  const [subTab, setSubTabState] = useState<"active" | "inactive" | "drafts">(() => {
    return (localStorage.getItem("dashboardSubTab") as "active" | "inactive" | "drafts") || "active";
  });
  const setSubTab = (tab: "active" | "inactive" | "drafts") => {
    setSubTabState(tab);
    localStorage.setItem("dashboardSubTab", tab);
  };
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const [showBulkDeleteDraftsModal, setShowBulkDeleteDraftsModal] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const visibleApplicants = applicants.filter(a => {
    const d = a.decision || "pending";
    const statusMatch = d === decisionFilter;
    const jobMatch = jobFilter === "all" || a.job.includes(jobs.find(j => j.id === jobFilter)?.title || "");
    return statusMatch && jobMatch;
  });
  const handleDecision = (id: string, decision: "accepted" | "rejected" | "pending") => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, decision } : a));
    if (decision === "pending") {
      setToastMessage("تم التراجع بنجاح وعودة المرشح لمحطة 'قيد المراجعة'.");
    } else {
      setToastMessage(`تم ${decision === "accepted" ? "القبول" : "الرفض"} ونقل المرشح للقائمة المختصة!`);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBulkDelete = () => {
    if (selectedApplicantIds.length === 0) return;
    if (window.confirm("هل أنت متأكد من حذف المرشحين المحددين نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.")) {
      setApplicants(prev => prev.filter(a => !selectedApplicantIds.includes(a.id)));
      setSelectedApplicantIds([]);
      setToastMessage("تم حذف المرشحين المحددين بنجاح.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleMoveToPool = (applicant: Applicant) => {
    setTalentPool(prev => {
      if (prev.some(t => t.id === applicant.id)) return prev;
      return [...prev, applicant];
    });
    setToastMessage("تم نقل المرشح لبنك الكفاءات بنجاح!");
    setTimeout(() => setToastMessage(null), 3000);
    setOpenDropdownId(null);
  };

  const handleRemoveFromPool = (id: string) => {
    setTalentPool(prev => prev.filter(t => t.id !== id));
    setToastMessage("تمت الإزالة من بنك الكفاءات.");
    setTimeout(() => setToastMessage(null), 3000);
    setOpenDropdownId(null);
  };

  const handleCrossNominate = () => {
    if (!crossNominateApplicant || !crossNominateJobId) return;
    const targetJob = jobs.find(j => j.id === crossNominateJobId);
    if (!targetJob) return;

    const clonedApplicant = {
      ...crossNominateApplicant,
      id: "app_" + Math.random().toString(36).substr(2, 9),
      job: targetJob.title,
      status: "مقبول مبدئياً",
      decision: "pending" as any,
      nominatedTo: undefined,
      aiSummary: "تم الترشيح المتقاطع من شاغر سابق.",
      date: new Date().toISOString(),
    };

    setApplicants(prev => [...prev, clonedApplicant]);
    setToastMessage(`تم ترشيح المتقدم للوظيفة بنجاح`);
    setTimeout(() => setToastMessage(null), 3000);
    setCrossNominateApplicant(null);
    setCrossNominateJobId("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من الحذف النهائي للمرشح؟ لا يمكن التراجع عن هذا الإجراء.")) {
      setApplicants(prev => prev.filter(a => a.id !== id));
    }
    setOpenDropdownId(null);
  };

  const handleAiSort = () => {
    const sorted = [...applicants].sort((a, b) => b.rating - a.rating);
    setApplicants(sorted);
  };
  const exportToCSV = () => {
    // Preparing CSV content including all standard and hidden fields
    const headers = [
      "الاسم",
      "المسمى الوظيفي",
      "مؤشر المطابقة",
      "الجاهزية",
      "الجوال",
      "الإيميل",
      "المهارات",
      "التحليل الوظيفي",
      "تحليل المقابلة",
      "إجابة: سؤال مخصص 1",
    ];
    const csvContent = [headers.join(",")];
    visibleApplicants.forEach((app) => {
      const row = [
        app.name,
        app.job,
        app.rating + "%",
        app.status,
        app.phone,
        app.email,
        app.skills.join(" - "),
        `"${app.aiSummary}"`,
        `"${app.voiceEval}"`,
        `"${app.customAnswers[0]?.answer || ""}"`,
      ];
      csvContent.push(row.join(","));
    });
    const blob = new Blob(["\uFEFF" + csvContent.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "applicants-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const isJobExpired = (job: Job) => {
    if (job.status === "مغلق") return true;
    if (!job.endDate) return false;
    return new Date() > new Date(job.endDate);
  };
  const activeJobsList = jobs.filter((j) => !isJobExpired(j) && j.status !== "مسودة");
  const inactiveJobsList = jobs.filter((j) => isJobExpired(j) && j.status !== "مسودة");
  const draftJobsList = jobs.filter((j) => j.status === "مسودة");
  const renderContent = () => {
    switch (activeTab) {
      case "الفرز السريع":
        return FEATURE_FLAGS.enable_fast_sorting ? <FastScreening /> : null;
      case "الرئيسية":
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            {" "}
            <header className="flex justify-between items-center w-full mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-navy dark:text-white">
                  طلبات التوظيف
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">
                  مرحباً بك مجدداً. إليك نظرة شاملة على نشاط اليوم.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {FEATURE_FLAGS.enable_fast_sorting && (
                <button
                  onClick={() => setActiveTab("الفرز السريع")}
                  className="bg-primary/10 text-primary px-4 md:px-6 py-3 md:py-4 rounded-2xl font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-2 shadow-sm text-sm md:text-base"
                >
                  <Zap size={20} /> <span className="hidden md:inline">الفرز السريع</span>
                </button>
                )}
                <button
                  onClick={onCreateJob}
                  className="bg-primary text-white px-4 md:px-8 py-3 md:py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 text-sm md:text-base whitespace-nowrap"
                >
                  <Briefcase size={20} /> <span className="hidden md:inline">إنشاء إعلان وظيفي</span>
                </button>
              </div>
            </header>
            <GlobalJobSelector
              jobs={jobs}
              selectedFilter={jobFilter}
              onFilterChange={setJobFilter}
            />{" "}
            {/* Stats Cards */}{" "}
            {(() => {
              const baseStatsApps = applicants;
              const totalCount = baseStatsApps.length;
              const pendingCount = baseStatsApps.filter(a => !a.decision || a.decision === "pending").length;
              const acceptedCount = baseStatsApps.filter(a => a.decision === "accepted").length;
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {" "}
                  {[
                    {
                      label: "إجمالي المتقدمين",
                      value: totalCount.toString(),
                      change: `+${totalCount}`,
                      icon: <Users className="text-teal-600" />,
                      color: "bg-teal-50",
                    },
                    {
                      label: "قيد المراجعة",
                      value: pendingCount.toString(),
                      change: pendingCount > 0 ? "يجب اتخاذ قرار" : "مكتمل",
                      icon: <Clock className="text-orange-500" />,
                      color: "bg-orange-50",
                    },
                    {
                      label: "تم قبولهم",
                      value: acceptedCount.toString(),
                      change: `+${acceptedCount} مرشحين`,
                      icon: <CheckCircle className="text-indigo-500" />,
                      color: "bg-indigo-50",
                    },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40"
                    >
                      {" "}
                      <div className="flex items-center justify-between mb-6">
                        {" "}
                        <div
                          className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-inner-3d`}
                        >
                          {" "}
                          {stat.icon}{" "}
                        </div>{" "}
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl ${stat.change.includes("+") ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                        >
                          {" "}
                          {stat.change}{" "}
                        </span>{" "}
                      </div>{" "}
                      <p className="text-slate-500 dark:text-slate-300 text-sm font-bold mb-1">
                        {stat.label}
                      </p>{" "}
                      <p className="text-4xl font-bold text-navy dark:text-white">
                        {stat.value}
                      </p>{" "}
                    </motion.div>
                  ))}{" "}
                </div>
              );
            })()}
            {/* Data Table */}{" "}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-white dark:border-slate-700 shadow-2xl shadow-slate-200/50 overflow-hidden">
              {" "}
              <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 dark:bg-slate-800/50">
                {" "}
                <h3 className="font-bold text-lg text-navy dark:text-white">
                  قائمة المرشحين
                </h3>{" "}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      if (isSelectionMode) {
                        setIsSelectionMode(false);
                        setSelectedApplicantIds([]);
                      } else {
                        setIsSelectionMode(true);
                      }
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${isSelectionMode ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200' : 'bg-white text-navy border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700'}`}
                  >
                    <CheckSquare size={18} />
                    {isSelectionMode ? "إلغاء التصفية" : "تصفية"}
                  </button>
                  <AnimatePresence>
                    {isSelectionMode && selectedApplicantIds.length > 0 && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={handleBulkDelete}
                        className="bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center gap-2"
                      >
                        <Trash2 size={18} /> حذف المحدد ({selectedApplicantIds.length})
                      </motion.button>
                    )}
                  </AnimatePresence>
                  {" "}
                  <div className="relative">
                    {" "}
                    <select 
                      value={jobFilter}
                      onChange={(e) => setJobFilter(e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pr-5 pl-10 py-2.5 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer"
                    >
                      {" "}
                      <option value="all" className="bg-white text-navy dark:bg-slate-800 dark:text-white">تصفية حسب الوظيفة: الكل</option>{" "}
                      {jobs.map(job => (
                        <option key={job.id} value={job.id} className="bg-white text-navy dark:bg-slate-800 dark:text-white">{job.title}</option>
                      ))}
                    </select>{" "}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                      {" "}
                      <ArrowLeft size={14} className="-rotate-90" />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="relative">
                    {" "}
                    <select value={decisionFilter} onChange={(e) => setDecisionFilter(e.target.value as any)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pr-5 pl-10 py-2.5 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer">
                      {" "}
                      <option value="pending" className="bg-white text-navy dark:bg-slate-800 dark:text-white">قيد المراجعة</option>{" "}
                      <option value="accepted" className="bg-white text-green-600 dark:bg-slate-800 dark:text-green-400">المقبولين</option> 
                      <option value="rejected" className="bg-white text-red-600 dark:bg-slate-800 dark:text-red-400">المرفوضين</option>{" "}
                    </select>{" "}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                      {" "}
                      <ArrowLeft size={14} className="-rotate-90" />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="relative">
                    {" "}
                    <Search
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      size={18}
                    />{" "}
                    <input
                      type="text"
                      placeholder="بحث عن مرشح..."
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pr-12 pl-5 py-2.5 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all w-64 font-medium dark:text-white dark:placeholder-slate-400"
                    />{" "}
                  </div>{" "}
                  <button
                    onClick={exportToCSV}
                    className="bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-100 dark:hover:bg-green-900/60 transition-all shadow-sm flex items-center gap-2"
                  >
                    {" "}
                    <Download size={18} /> تصدير CSV{" "}
                  </button>{" "}
                  <button
                    onClick={handleAiSort}
                    className="relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border border-indigo-400/50 dark:border-indigo-500/30 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-2xl" />
                    <Zap size={18} className="relative z-10" /> 
                    <span className="relative z-10">فرز تلقائي</span>
                  </button>{" "}
                </div>{" "}
              </div>{" "}
              <div className="overflow-x-auto min-h-[60vh]">
                {" "}
                <table className="w-full text-right">
                  {" "}
                  <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-200 text-xs uppercase tracking-widest">
                    {" "}
                    <tr>
                      {isSelectionMode && (
                        <th className="px-6 py-5 w-14 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white">
                          <div
                            onClick={() => {
                              const allSelected = visibleApplicants.length > 0 && selectedApplicantIds.length === visibleApplicants.length;
                              if (allSelected) {
                                setSelectedApplicantIds([]);
                              } else {
                                setSelectedApplicantIds(visibleApplicants.map(a => a.id));
                              }
                            }}
                            className={`w-5 h-5 mx-auto rounded-[6px] border flex items-center justify-center cursor-pointer transition-all ${visibleApplicants.length > 0 && selectedApplicantIds.length === visibleApplicants.length ? "bg-primary border-primary text-white" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-50 hover:opacity-100 hover:border-slate-400"}`}
                          >
                            {visibleApplicants.length > 0 && selectedApplicantIds.length === visibleApplicants.length && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                          </div>
                        </th>
                      )}
                      <th className="px-4 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-right">اسم المتقدم</th>{" "}
                      <th className="px-3 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-right">المسمى الوظيفي</th>{" "}
                      <th className="px-3 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-right">مؤشر المطابقة</th>{" "}
                      <th className="px-3 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-right">الجاهزية</th>{" "}
                      <th className="px-3 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-center">التواصل</th>{" "}
                      <th className="px-4 py-4 font-bold bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white text-center whitespace-nowrap">الإجراء</th>{" "}
                    </tr>{" "}
                  </thead>{" "}
                  <tbody className="divide-y divide-slate-50">
                    {" "}
                    {jobs.length === 0 ? (
                      <tr>
                        {" "}
                        <td colSpan={isSelectionMode ? 7 : 6} className="p-0">
                          {" "}
                          <EmptyState
                            title="لوحة التحكم بانتظارك! لم تقم بإنشاء أي شواغر وظيفية حتى الآن."
                            actionLabel="أنشئ إعلان وظيفي الآن"
                            onAction={onCreateJob}
                          />{" "}
                        </td>{" "}
                      </tr>
                    ) : visibleApplicants.length === 0 ? (
                      <tr>
                        <td colSpan={isSelectionMode ? 7 : 6} className="p-0">
                          <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white dark:bg-slate-800/50">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner-3d">
                              <Search size={32} className="text-slate-300 dark:text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-navy dark:text-white mb-2">
                              {decisionFilter === "accepted" ? "لا يوجد مرشحين مقبولين حالياً" : decisionFilter === "rejected" ? "لا يوجد مرشحين مرفوضين حالياً" : "لا يوجد مرشحين قيد المراجعة في الوقت الحالي"}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                              لم يتم العثور على أي مرشح مطابق لخيارات التصفية الحالية.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {" "}
                        {visibleApplicants.map((row) => (
                          <motion.tr
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={row.id}
                            className="hover:bg-slate-50 dark:bg-slate-800/80 transition-colors group"
                          >
                            {" "}
                            {isSelectionMode && (
                              <td className="px-6 py-6 w-14">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedApplicantIds.includes(row.id)) {
                                      setSelectedApplicantIds(prev => prev.filter(id => id !== row.id));
                                    } else {
                                      setSelectedApplicantIds(prev => [...prev, row.id]);
                                    }
                                  }}
                                  className={`w-5 h-5 mx-auto rounded-[6px] border flex items-center justify-center cursor-pointer transition-all ${selectedApplicantIds.includes(row.id) ? "bg-primary border-primary text-white opacity-100" : "border-slate-300 dark:border-slate-600 bg-slate-100/50 dark:bg-slate-800 opacity-0 group-hover:opacity-100 hover:border-slate-400"}`}
                                >
                                  {selectedApplicantIds.includes(row.id) && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                  )}
                                </div>
                              </td>
                            )}
                            <td className="px-4 py-4">
                              {" "}
                              <div className="flex items-center gap-3 w-max">
                                {" "}
                                <button
                                  onClick={() => onToggleShortlist(row.id)}
                                  className={`transition-all ${shortlistedIds.includes(row.id) ? "text-yellow-500 scale-110" : "text-slate-200 hover:text-yellow-500"}`}
                                >
                                  {" "}
                                  <Star
                                    size={18}
                                    fill={
                                      shortlistedIds.includes(row.id)
                                        ? "currentColor"
                                        : "none"
                                    }
                                  />{" "}
                                </button>{" "}
                                <div 
                                  onClick={(e) => {
                                    if (row.photoUrl) {
                                      e.stopPropagation();
                                      setLightboxPhoto(row.photoUrl);
                                    }
                                  }}
                                  className={`w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-200 shadow-inner-3d transition-colors overflow-hidden ${row.photoUrl ? "cursor-pointer hover:opacity-80" : "group-hover:bg-white dark:hover:bg-slate-600"}`}
                                >
                                  {" "}
                                  {row.photoUrl ? (
                                    <img src={row.photoUrl} alt={row.name} className="w-full h-full object-cover" />
                                  ) : (
                                    row.name.charAt(0)
                                  )}{" "}
                                </div>{" "}
                                <div className="flex flex-col">
                                  <span className="font-bold text-navy dark:text-white">
                                    {row.name}
                                  </span>
                                  {row.nominatedTo && (
                                    <div className="mt-1 text-[10px] bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md inline-block font-bold w-fit border border-blue-100 dark:border-blue-800/30 shadow-sm">
                                      🔄 تم ترشيحه لـ: {row.nominatedTo}
                                    </div>
                                  )}
                                </div>
                              </div>{" "}
                            </td>{" "}
                            <td className="px-3 py-4">
                              {" "}
                              <div className="flex justify-start w-full">
                                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white px-4 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center whitespace-nowrap w-fit">
                                  {" "}
                                  {row.job}{" "}
                                </span>{" "}
                              </div>
                            </td>{" "}
                            <td className="px-3 py-4">
                              {" "}
                              <div className="flex items-center justify-start gap-2">
                                {" "}
                                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  {" "}
                                  <div
                                    className={`h-full ${row.color === "teal" ? "bg-teal-500" : row.color === "indigo" ? "bg-indigo-500" : "bg-orange-500"}`}
                                    style={{ width: `${row.rating}%` }}
                                  />{" "}
                                </div>{" "}
                                <span className="text-sm font-bold text-navy dark:text-white">
                                  {row.rating}%
                                </span>{" "}
                              </div>{" "}
                            </td>{" "}
                            <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap text-right">
                              {row.status}
                            </td>{" "}
                            <td className="px-3 py-4">
                              {" "}
                              <div className="flex items-center justify-center gap-1.5 min-w-max">
                                {" "}
                                <a
                                  href={`https://wa.me/${row.phone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-10 h-10 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-xl flex items-center justify-center hover:bg-green-500 dark:hover:bg-green-500/60 dark:hover:text-green-100 hover:text-white transition-all shadow-sm"
                                  title="واتساب"
                                >
                                  {" "}
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                                  </svg>{" "}
                                </a>{" "}
                                <a
                                  href={`mailto:${row.email}`}
                                  className="w-10 h-10 bg-navy/5 dark:bg-slate-700/50 text-navy dark:text-slate-200 rounded-xl flex items-center justify-center hover:bg-navy dark:hover:bg-slate-600 hover:text-white transition-all shadow-sm"
                                  title="إيميل"
                                >
                                  {" "}
                                  <Mail size={18} />{" "}
                                </a>{" "}
                                <a
                                  href={`tel:${row.phone}`}
                                  className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-xl flex items-center justify-center hover:bg-blue-500 dark:hover:bg-blue-500/60 dark:hover:text-blue-100 hover:text-white transition-all shadow-sm"
                                  title="اتصال"
                                >
                                  {" "}
                                  <Phone size={18} />{" "}
                                </a>{" "}
                              </div>{" "}
                            </td>{" "}
                            <td className="px-4 py-4">
                              {" "}
                              <div className="flex items-center justify-end gap-1.5 w-max ml-auto">
                                {row.decision && row.decision !== "pending" ? (
                                  <button
                                    onClick={() => {
                                      if (window.confirm("هل أنت متأكد من رغبتك في التراجع عن هذا القرار وإعادته لقيد المراجعة؟")) {
                                        handleDecision(row.id, "pending");
                                      }
                                    }}
                                    className="flex items-center justify-center gap-1.5 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 hover:border-slate-400 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                                    title="تراجع"
                                  >
                                    <RotateCcw size={14} /> تراجع عن القرار
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleDecision(row.id, "accepted")}
                                      className="flex items-center justify-center gap-1.5 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white px-3 py-2 rounded-xl text-[11px] font-bold transition-all shadow-sm"
                                      title="قبول"
                                    >
                                      <CheckCircle size={14} /> قبول
                                    </button>
                                    <button
                                      onClick={() => handleDecision(row.id, "rejected")}
                                      className="flex items-center justify-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white px-3 py-2 rounded-xl text-[11px] font-bold transition-all shadow-sm"
                                      title="رفض"
                                    >
                                      <X size={14} /> رفض
                                    </button>
                                  </>
                                )}
                                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                <button
                                  onClick={onViewDetails}
                                  className="flex items-center justify-center gap-1.5 bg-white text-navy border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-2 rounded-xl text-[11px] font-bold transition-all shadow-sm"
                                  title="عرض الملف"
                                >
                                  {" "}
                                  <FileText size={14} /> عرض الملف{" "}
                                </button>
                                <div className="relative">
                                  <button
                                    onClick={() => setOpenDropdownId(openDropdownId === row.id ? null : row.id)}
                                    className="flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-navy hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                  
                                  <AnimatePresence>
                                    {openDropdownId === row.id && (
                                      <>
                                        <div 
                                          className="fixed inset-0 z-40" 
                                          onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); }} 
                                        />
                                        <motion.div
                                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.95 }}
                                          style={{ left: 0, right: 'auto' }}
                                          className="absolute mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 dark:border-slate-700 py-2 z-50 overflow-hidden"
                                        >
                                        <button
                                          onClick={() => { onToggleShortlist(row.id); setOpenDropdownId(null); }}
                                          className="w-full text-right px-4 py-3 text-sm font-bold text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                                        >
                                          <Star size={16} className={shortlistedIds.includes(row.id) ? "text-yellow-500" : "text-slate-400"} fill={shortlistedIds.includes(row.id) ? "currentColor" : "none"} /> 
                                          {shortlistedIds.includes(row.id) ? "إزالة من المفضلة" : "مفضل للوظيفة"}
                                        </button>
                                        {talentPool.some(t => t.id === row.id) ? (
                                          <button
                                            onClick={() => handleRemoveFromPool(row.id)}
                                            className="w-full text-right px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
                                          >
                                            <Database size={16} className="text-red-500" /> إزالة من بنك الكفاءات
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() => handleMoveToPool(row)}
                                            className="w-full text-right px-4 py-3 text-sm font-bold text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                                          >
                                            <Database size={16} className="text-slate-400" /> إضافة إلى بنك الكفاءات
                                          </button>
                                        )}
                                        <button
                                          onClick={() => {
                                            setCrossNominateApplicant(row);
                                            setCrossNominateJobId(jobs.find(j => j.status === "نشط")?.id || "");
                                            setOpenDropdownId(null);
                                          }}
                                          className="w-full text-right px-4 py-3 text-sm font-bold text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                                        >
                                          <Briefcase size={16} className="text-primary" /> ترشيح لوظيفة أخرى
                                        </button>
                                        <div className="h-px bg-slate-100 dark:bg-slate-700 w-full my-1"></div>
                                        <button
                                          onClick={() => handleDelete(row.id)}
                                          className="w-full text-right px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
                                        >
                                          <Trash2 size={16} /> حذف المرشح نهائياً
                                        </button>
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>{" "}
                            </td>{" "}
                          </motion.tr>
                        ))}{" "}
                      </AnimatePresence>
                    )}{" "}
                  </tbody>{" "}
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        );
      case "إدارة الوظائف":
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            {" "}
            <header className="flex flex-col md:flex-row items-center justify-between gap-6">
              {" "}
              <div>
                {" "}
                <h1 className="text-4xl font-bold mb-3 text-navy dark:text-white">
                  إدارة الإعلانات
                </h1>{" "}
                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
                  أدر جميع الوظائف المتاحة والمنتهية وتابع المتقدمين.
                </p>{" "}
              </div>{" "}
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                {FEATURE_FLAGS.enable_fast_sorting && (
                <button
                  onClick={() => setActiveTab("الفرز السريع")}
                  className="bg-primary/10 text-primary px-6 py-4 rounded-2xl font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Zap size={20} /> الفرز السريع
                </button>
                )}
                <button
                  onClick={onCreateJob}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase size={20} /> إنشاء إعلان وظيفي
                </button>
              </div>{" "}
            </header>{" "}
            <div className="flex flex-wrap items-center justify-between gap-4 w-full mb-2">
              <div className="flex flex-wrap bg-white dark:bg-slate-800 p-2 gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
                {" "}
                <button
                  onClick={() => setSubTab("active")}
                  className={`flex items-center justify-center gap-2.5 flex-1 px-6 md:px-8 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${subTab === "active" ? "bg-navy text-white shadow-md" : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white"}`}
                >
                  <div className={`w-2 h-2 rounded-full shadow-sm ${subTab === "active" ? "bg-emerald-400" : "bg-emerald-500"}`}></div>
                  النشطة ({activeJobsList.length}){" "}
                </button>{" "}
                <button
                  onClick={() => setSubTab("inactive")}
                  className={`flex items-center justify-center gap-2.5 flex-1 px-6 md:px-8 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${subTab === "inactive" ? "bg-navy text-white shadow-md" : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white"}`}
                >
                  <div className={`w-2 h-2 rounded-full shadow-sm ${subTab === "inactive" ? "bg-red-400" : "bg-slate-500"}`}></div>
                  المنتهية/المغلقة ({inactiveJobsList.length}){" "}
                </button>{" "}
                <button
                  onClick={() => setSubTab("drafts")}
                  className={`flex items-center justify-center gap-2.5 flex-1 px-6 md:px-8 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${subTab === "drafts" ? "bg-navy text-white shadow-md" : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white"}`}
                >
                  <div className={`w-2 h-2 rounded-full shadow-sm ${subTab === "drafts" ? "bg-amber-400" : "bg-slate-300 dark:bg-slate-600"}`}></div>
                  المسودات ({draftJobsList.length}){" "}
                </button>{" "}
              </div>{" "}
              {subTab === "drafts" && draftJobsList.length > 0 && onDeleteAllDrafts && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowBulkDeleteDraftsModal(true);
                  }}
                  className="flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm ml-auto mr-4"
                >
                  <Trash2 size={18} /> مسح جماعي للمسودات
                </button>
              )}
            </div>{" "}
            <ActiveJobs
              jobs={subTab === "active" ? activeJobsList : subTab === "inactive" ? inactiveJobsList : draftJobsList}
              onManage={onManageJob}
              onCreateJob={onCreateJob}
              onClone={onCloneJob}
              onDeactivate={subTab === "active" ? onDeactivateJob : undefined}
              onReactivate={subTab === "inactive" ? onReactivateJob : undefined}
              onDelete={(id) => setDraftToDelete(id)}
            />{" "}
          </div>
        );
      case "بنك الكفاءات":
        return (
          <TalentPool
            jobs={jobs}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={onToggleShortlist}
            onCreateJob={onCreateJob}
            onViewDetails={onViewDetails}
            talentPool={talentPool}
            onCrossNominate={(applicant) => {
              setCrossNominateApplicant(applicant);
              setCrossNominateJobId(jobs.find(j => j.status === "نشط")?.id || "");
            }}
          />
        );
      case "التقارير":
        return (
          <div className="space-y-6">
            {" "}
            <GlobalJobSelector
              jobs={jobs}
              selectedFilter={jobFilter}
              onFilterChange={setJobFilter}
            />{" "}
            <Reports jobs={jobs} filterId={jobFilter} />{" "}
          </div>
        );
      case "الحساب":
        return <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} userProfile={userProfile} setUserProfile={setUserProfile} />;
      default:
        return null;
    }
  };
  return (
    <>
      <AnimatePresence>
        {draftToDelete && (
          <motion.div
            key="draft-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
            onClick={() => setDraftToDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <h2 className="text-2xl font-black text-red-600 dark:text-red-400 text-center mb-4">
                تأكيد حذف المسودة
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium">
                هل أنت متأكد من حذف هذه المسودة نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setDraftToDelete(null)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteJob) onDeleteJob(draftToDelete);
                    setDraftToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transition-all"
                >
                  نعم، احذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showBulkDeleteDraftsModal && (
          <motion.div
            key="bulk-draft-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
            onClick={() => setShowBulkDeleteDraftsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <h2 className="text-2xl font-black text-red-600 dark:text-red-400 text-center mb-4">
                مسح جماعي للمسودات
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium">
                هل أنت متأكد من مسح جميع المسودات بشكل نهائي؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowBulkDeleteDraftsModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteAllDrafts) onDeleteAllDrafts();
                    setShowBulkDeleteDraftsModal(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transition-all"
                >
                  نعم، امسح مسوداتي
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {toastMessage && (
          <motion.div
            key="toast-msg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-navy text-white border border-slate-700/50 px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 font-bold"
          >
            <CheckCircle size={20} className="text-primary" />
            {toastMessage}
          </motion.div>
        )}

        {crossNominateApplicant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-2">
                  <Briefcase size={24} className="text-primary" /> ترشيح لوظيفة أخرى
                </h3>
                <button
                  onClick={() => {
                    setCrossNominateApplicant(null);
                    setCrossNominateJobId("");
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-4">
                  اختر الوظيفة التي تود ترشيح المتقدم <span className="text-primary font-bold">{crossNominateApplicant.name}</span> لها:
                </p>
                
                <select
                  value={crossNominateJobId}
                  onChange={(e) => setCrossNominateJobId(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl outline-none focus:border-primary font-medium"
                >
                  <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">-- اختر وظيفة نشطة --</option>
                  {jobs.filter(j => j.status === "نشط").map(j => (
                    <option key={j.id} value={j.id} className="bg-white text-navy dark:bg-slate-800 dark:text-white">{j.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCrossNominate}
                  disabled={!crossNominateJobId}
                  className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-sm lg:text-base hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
                >
                  تأكيد الترشيح
                </button>
                <button
                  onClick={() => {
                    setCrossNominateApplicant(null);
                    setCrossNominateJobId("");
                  }}
                  className="flex-1 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 py-4 rounded-xl font-bold text-sm lg:text-base hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
        {" "}
      {/* Sidebar */}{" "}
      <aside className="w-80 bg-navy text-white p-8 hidden lg:flex flex-col fixed h-full right-0 shadow-2xl z-20">
        {" "}
        <div className="flex items-center gap-4 mb-16 px-2">
          {" "}
          <LogoIcon />{" "}
          <span className="text-3xl font-black tracking-tighter text-white">
            فرز
          </span>{" "}
        </div>{" "}
        <nav className="space-y-3 flex-1">
          {" "}
          {[
            { name: "الحساب", icon: <User size={22} /> },
            FEATURE_FLAGS.enable_fast_sorting ? { name: "الفرز السريع", icon: <Zap size={22} /> } : null,
            { name: "الرئيسية", icon: <LayoutDashboard size={22} /> },
            { name: "إدارة الوظائف", icon: <Briefcase size={22} /> },
            { name: "بنك الكفاءات", icon: <Database size={22} /> },
            { name: "التقارير", icon: <BarChartIcon size={22} /> },
          ].filter(Boolean).map((item: any) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold ${activeTab === item.name ? "bg-mint text-employer-green shadow-xl shadow-mint/30" : "text-slate-400 dark:text-slate-500 hover:text-slate-200 hover:bg-slate-700/50"}`}
            >
              {" "}
              {item.icon} <span>{item.name}</span>{" "}
            </button>
          ))}{" "}
        </nav>{" "}
        <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-white dark:border-slate-700/10 shrink-0">
          <div className="flex items-center gap-4 p-3 bg-white/5 dark:bg-slate-800/30 rounded-2xl border border-white/10 dark:border-slate-700">
            <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-primary overflow-hidden shrink-0">
              <img src={userProfile.avatar} alt="Admin" referrerPolicy="no-referrer" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{userProfile.name}</p>
              <p className="text-xs text-slate-300 dark:text-slate-400 truncate">{userProfile.title}</p>
            </div>
          </div>

          

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all font-bold group"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>{" "}
      {/* Main Content */}{" "}
      <main className="flex-1 lg:mr-80 flex flex-col min-h-screen">
        {(!userProfile?.commercialRegistration && !userProfile?.freelanceDocument) && (
          <div className="bg-amber-100 dark:bg-amber-900/50 border-b border-amber-200 dark:border-amber-700/50 mt-16 md:mt-0 z-10 transition-colors">
            <div className="max-w-6xl mx-auto p-3 sm:px-8 flex items-center justify-between text-amber-900 dark:text-amber-100 text-sm md:text-base">
              <span className="font-bold flex items-center gap-2 max-w-[70%] leading-relaxed">
                <ShieldCheck size={20} className="text-amber-600 dark:text-amber-400 shrink-0" /> أهلاً بك! لتتمكن من نشر إعلاناتك الوظيفية، يرجى استكمال بيانات الكيان القانونية.
              </span>
              <button
                onClick={onShowOnboarding}
                className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 px-4 py-2 md:px-5 md:py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors mr-auto"
              >
                استكمال البيانات
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 p-10 pt-24 lg:pt-10 w-full max-w-[100vw]">
          <AnimatePresence mode="wait">
          {" "}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {" "}
            {renderContent()}{" "}
          </motion.div>{" "}
        </AnimatePresence>{" "}
        </div>
      </main>{" "}
      <ImageLightbox url={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
    </div>
    </>
  );
};
export default function App() {
  const [talentPool, setTalentPool] = useState<Applicant[]>([]);
  const [applicantSelectedRoleId, setApplicantSelectedRoleId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState({
    name: "أحمد المدير",
    title: "مدير التوظيف",
    avatar: "https://picsum.photos/seed/admin/100/100",
    companyLogo: "",
    commercialRegistration: "",
    freelanceDocument: "",
    taxNumber: "",
    subscription_tier: "free",
    entityType: "company",
    city: "",
  });
  const [step, setStep] = useState<FlowStep>("landing");
  const [dashboardTab, setDashboardTab] = useState("الرئيسية");
  const [darkMode, setDarkMode] = useState(false);
  const [showOnboardingGlobal, setShowOnboardingGlobal] = useState(false);
  const [globalPendingDraftId, setGlobalPendingDraftId] = useState<string | null>(null);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [globalToastMessage, setGlobalToastMessage] = useState<string | null>(null);
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setGlobalToastMessage(customEvent.detail);
        setTimeout(() => setGlobalToastMessage(null), 3500);
      }
    };
    window.addEventListener("showToast", handler);
    return () => window.removeEventListener("showToast", handler);
  }, []);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [clonedJob, setClonedJob] = useState<Job | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [previewJobState, setPreviewJobState] = useState<Job | null>(null);
  const [createJobType, setCreateJobType] = useState<"single" | "campaign" | "quick_link">(
    "single",
  );
  const [jobs, setJobs] = useState<Job[]>(() => {
    const savedJobs = localStorage.getItem("mock_jobs_db");
    if (savedJobs) {
      try {
        return JSON.parse(savedJobs);
      } catch (e) {
        console.error("Error parsing jobs", e);
      }
    }
    return [
      {
        id: "1",
        title: "كاشير",
        company: "فرع الرياض",
        companyLogo: localStorage.getItem("savedCompanyLogo") || undefined,
        location: "الرياض",
        type: "دوام كامل",
        applicants: 45,
        status: "نشط",
        createdAt: "2026-04-10",
        description:
          "مطلوب كاشير سعودي للعمل في فرع الرياض. يشترط الجدية والالتزام.",
        skills: ["خدمة عملاء", "نقاط البيع POS", "سرعة الحساب"],
      },
      {
        id: "2",
        title: "بائع تجزئة",
        company: "فرع جدة",
        companyLogo: localStorage.getItem("savedCompanyLogo") || undefined,
        location: "جدة",
        type: "دوام جزئي",
        applicants: 28,
        status: "نشط",
        createdAt: "2026-04-12",
        description:
          "مطلوب بائع تجزئة للعمل في فرع جدة. يفضل من لديه خبرة سابقة.",
        skills: ["مهارات البيع", "الإقناع", "خدمة عملاء"],
      },
    ];
  });
  useEffect(() => {
    localStorage.setItem("mock_jobs_db", JSON.stringify(jobs));
  }, [jobs]);
  const handleAutoSaveDraft = (
    jobData: Omit<Job, "id" | "applicants" | "status" | "createdAt" | "draftId">,
    existingDraftId: string | null
  ) => {
    const jobIdToUse = existingDraftId || Math.random().toString(36).substr(2, 9);
    
    setJobs(prevJobs => {
      const draftExists = prevJobs.some(j => j.id === existingDraftId);
      if (draftExists && existingDraftId) {
        return prevJobs.map(j => j.id === existingDraftId ? { ...j, ...jobData, status: "مسودة" } : j);
      } else {
        const newJob: Job = {
          ...jobData,
          id: jobIdToUse,
          applicants: 0,
          status: "مسودة",
          createdAt: new Date().toISOString().split("T")[0],
        };
        return [newJob, ...prevJobs];
      }
    });
    return jobIdToUse;
  };

  const handleCreateJob = (
    jobData: Omit<Job, "id" | "applicants" | "status" | "createdAt" | "draftId">,
    existingDraftId?: string
  ) => {
    const isComplete = Boolean(userProfile.commercialRegistration || userProfile.freelanceDocument);
    const resolvedStatus = isComplete ? "نشط" : "مسودة";
    
    const jobIdToUse = existingDraftId || Math.random().toString(36).substr(2, 9);
    
    const newJob: Job = {
      ...jobData,
      id: jobIdToUse,
      applicants: 0,
      status: resolvedStatus,
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (existingDraftId) {
      setJobs(jobs.map(j => j.id === existingDraftId ? newJob : j));
    } else {
      setJobs([newJob, ...jobs]);
    }
    
    if (isComplete) {
      setSelectedJob(newJob);
      setClonedJob(null);
      setStep("jobSuccess");
      return null;
    } else {
      setGlobalPendingDraftId(jobIdToUse);
      setShowOnboardingGlobal(true);
      return jobIdToUse; // return draft id to CreateJob so it doesn't create multiple drafts
    }
  };

  const handlePublishDraft = () => {
    if (globalPendingDraftId) {
      const pendingJob = jobs.find(j => j.id === globalPendingDraftId);
      if (pendingJob) {
        setJobs(jobs.map((j) => j.id === globalPendingDraftId ? { ...j, status: "نشط" } : j));
        setSelectedJob({ ...pendingJob, status: "نشط" });
        setClonedJob(null);
        setStep("jobSuccess");
      }
      setGlobalPendingDraftId(null);
    }
  };
  const handleDeactivateJob = (job: Job) => {
    const updatedJobs = jobs.map((j) =>
      j.id === job.id ? { ...j, status: "مغلق" as const } : j,
    );
    setJobs(updatedJobs);
  };

  const handleReactivateJob = (job: Job) => {
    const updatedJobs = jobs.map((j) =>
      j.id === job.id ? { ...j, status: "نشط" as const, createdAt: new Date().toISOString().split("T")[0] } : j,
    );
    setJobs(updatedJobs);
  };


  const startJobCreation = (
    type: "single" | "campaign" | "quick_link",
    initialJobData: Job | null = null,
  ) => {
    setCreateJobType(type);
    setClonedJob(initialJobData);

    setStep("createJob");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 bg-slate-100 dark:bg-slate-900 selection:bg-primary/20 selection:text-primary`}
    >
      <OnboardingModal isOpen={showOnboardingGlobal} onClose={() => {
        setShowOnboardingGlobal(false);
        if (globalPendingDraftId) {
          alert("تم حفظ الإعلان كمسودة، يمكنك إكماله لاحقاً من قسم الإدارة");
        }
      }} userProfile={userProfile} setUserProfile={setUserProfile} onPublishDraft={handlePublishDraft} />
      {step === "landing" && (
          <Navbar setStep={setStep} currentStep={step} />
      )}{" "}
{" "}

      {showPaywallModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl relative border border-amber-200 dark:border-amber-900/50"
          >
            <div className="p-8 text-center pt-12">
              <button
                onClick={() => setShowPaywallModal(false)}
                className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
                <Star size={40} className="text-amber-500 fill-amber-500" />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-amber-500 to-yellow-400 text-white text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-lg border-2 border-white dark:border-slate-800">
                  Pro
                </div>
              </div>
              <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">
                هذه الميزة مدفوعة
              </h2>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">
                أداة "الفرز السريع ⚡" مصممة لتسريع عمليات التوظيف وتوفير وقتك عن طريق الذكاء الاصطناعي بشكل كامل. يرجى الترقية للباقات المتقدمة لفتح هذه الخاصية.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowPaywallModal(false);
                    // Mock redirection logic
                    alert("سيتم نقلك لصفحة الترقية والاشتراكات قريباً!");
                  }}
                  className="w-full py-4 bg-gradient-to-l from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-amber-500/20 flex justify-center items-center gap-2"
                >
                  <Sparkles size={20} /> ترقية الباقة الآن
                </button>
                <button
                  onClick={() => setShowPaywallModal(false)}
                  className="w-full py-4 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  الاستمرار بالباقة العادية
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Global Toast Notification */}
      <AnimatePresence>
        {globalToastMessage && (
          <motion.div
            key="global-toast"
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-8 left-1/2 z-[999] bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm md:text-base whitespace-nowrap"
          >
            <CheckCircle size={20} className="text-primary" />
            {globalToastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {" "}
        <AnimatePresence mode="wait">
          {" "}
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {" "}
            {step === "landing" && (
              <LandingPage onStart={() => setStep("registerCompany")} />
            )}{" "}

            {step === "dashboard" && (
              <Dashboard
                activeTab={dashboardTab}
                setActiveTab={setDashboardTab}
                onViewDetails={() => setStep("applicantDetails")}
                onCreateJob={() => {
                  setClonedJob(null);
                  startJobCreation("single");
                }}
                onManageJob={(job) => {
                  setSelectedJob(job);
                  setStep("manageJob");
                }}
                onCloneJob={(job) =>
                  startJobCreation(job.recordType || "single", job)
                }
                onDeactivateJob={handleDeactivateJob}
                onReactivateJob={handleReactivateJob}
                onPreviewJob={(job) => setPreviewJobState(job)}
                jobs={jobs}
                shortlistedIds={shortlistedIds}
                onToggleShortlist={(id) => {
                  setShortlistedIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((i) => i !== id)
                      : [...prev, id],
                  );
                }}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                onShowOnboarding={() => setShowOnboardingGlobal(true)}
                talentPool={talentPool}
                setTalentPool={setTalentPool}
                onDeleteJob={(id) => {
                  setJobs(prev => {
                    const newJobs = prev.filter(j => j.id !== id);
                    // تحديث الذاكرة فوراً لمنع ظهور المسودة بعد الـ Refresh
                    localStorage.setItem("smart_recruitment_jobs", JSON.stringify(newJobs)); 
                    return newJobs;
                  });
                }}
                onDeleteAllDrafts={() => {
                  setJobs(prev => prev.filter(j => j.status !== "مسودة"));
                }}
              />
            )}{" "}
            {step === "login" && (
              <LoginPage
                onLogin={() => setStep("dashboard")}
                onBack={() => setStep("landing")}
                initialMode="login"
              />
            )}{" "}
            {step === "registerCompany" && (
              <LoginPage
                onLogin={() => setStep("dashboard")}
                onBack={() => setStep("landing")}
                initialMode="register"
              />
            )}{" "}
            {step === "superAdmin" && <SuperAdminDashboard />}{" "}
            {step === "applicantDetails" && (
              <ApplicantDetails onBack={() => setStep("dashboard")} />
            )}{" "}
            {step === "createJob" && (
              <CreateJob
                createJobType={createJobType}
                initialData={clonedJob}
                onBack={() => {
                  setStep("dashboard");
                  setClonedJob(null);
                }}
                onSubmit={handleCreateJob}
                onAutoSaveDraft={handleAutoSaveDraft}
                userProfile={userProfile}
                onGoToSettings={() => {
                  setDashboardTab("الحساب");
                  setStep("dashboard");
                }}
              />
            )}{" "}
            {step === "manageJob" && selectedJob && (
              <ErrorBoundary>
                <ManageJob
                  job={selectedJob}
                  onBack={() => setStep("dashboard")}
                  onUpdate={(updatedJob) => {
                    setJobs(
                      jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j)),
                    );
                    setStep("dashboard");
                  }}
                  onDelete={(id) => {
                    setJobs(jobs.filter((j) => j.id !== id));
                    setStep("dashboard");
                  }}
                />
              </ErrorBoundary>
            )}{" "}
            {step === "jobSuccess" && selectedJob && (
              <JobSuccess
                job={selectedJob}
                onDone={() => setStep("dashboard")}
                onPreview={() =>
                  setStep(selectedJob?.recordType === "campaign" ? "publicJob" : (selectedJob?.roles?.[0]?.directUpload || selectedJob?.directUpload ? "form" : "publicJob"))
                }
              />
            )}{" "}
            {step === "publicJob" && selectedJob && (
              <PublicJobPage
                job={selectedJob}
                selectedRoleId={applicantSelectedRoleId}
                onSelectRole={(id) => setApplicantSelectedRoleId(id)}
                onBackToCampaign={() => setApplicantSelectedRoleId(null)}
                onApply={() => setStep("form")}
              />
            )}
            {step === "form" && selectedJob && (
              <ApplicantForm
                job={selectedJob}
                selectedRoleId={applicantSelectedRoleId}
                onBackToJobs={() => {
                  setStep("publicJob");
                  setApplicantSelectedRoleId(null);
                }}
                onSubmit={() => setStep("dashboard")}
              />
            )}
          </motion.div>{" "}
        </AnimatePresence>{" "}
      </main>{" "}
      {previewJobState && (
        <PreviewModal
          job={previewJobState}
          onClose={() => setPreviewJobState(null)}
        />
      )}{" "}
      {/* Demo Helper - Subtle indicator */}{" "}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
        {" "}
        <button
          onClick={() => setStep("superAdmin")}
          className="bg-navy/10 dark:bg-slate-800 hover:bg-navy/20 dark:hover:bg-slate-700 backdrop-blur px-4 py-2 rounded-full border border-navy/5 dark:border-slate-700 transition-all shadow-sm"
        >
          {" "}
          <p className="text-[10px] font-bold text-navy dark:text-slate-300 uppercase tracking-widest">
            {" "}
            دخول المسؤول (Super Admin){" "}
          </p>{" "}
        </button>{" "}
        <div className="bg-navy/10 dark:bg-slate-800/80 backdrop-blur px-4 py-2 rounded-full border border-navy/5 dark:border-slate-700">
          {" "}
          <p className="text-[10px] font-bold text-navy dark:text-slate-400 uppercase tracking-widest">
            {" "}
            وضع التجربة النشط{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
