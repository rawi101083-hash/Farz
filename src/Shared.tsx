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
  Check,
} from "lucide-react";
import { addDays, addMonths, addYears } from "date-fns";
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
import React, { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import skillsDictionaryRaw from "./skillsDictionary.json";
import { FEATURE_FLAGS } from "./config";
import { PublicJobPage } from "./components/CreateJob";
import { ApplicantForm } from "./components/JobApplication";

export const skillsDictionary: Record<string, string[]> = skillsDictionaryRaw;

export const getUserSavedSkills = (): Record<string, string[]> => {
  try {
    const saved = localStorage.getItem("userCustomSkills");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export const saveUserSkills = (title: string, skills: string[]) => {
  if (!title.trim() || !skills || skills.length === 0) return;
  const normalizedTitle = title.trim();
  const allSaved = getUserSavedSkills();
  const existingForRole = new Set(allSaved[normalizedTitle] || []);
  skills.forEach((s) => existingForRole.add(s));
  allSaved[normalizedTitle] = Array.from(existingForRole);
  localStorage.setItem("userCustomSkills", JSON.stringify(allSaved));
};

export const SAUDI_CITIES = [
  "لا يشترط / كافة المدن",
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

export const SearchableSelect = ({
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

export const VerificationModal = ({ isOpen, onClose, onVerify }: { isOpen: boolean, onClose: () => void, onVerify: () => void }) => {
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
// --- Types ---
export type FlowStep =
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
  | "manageJob"
  | "interview"
  | "share";
export interface CustomAttachment {
  attachment_name: string;
  attachment_type: "file" | "link" | "image" | "video" | "document" | "mixed_file";
  required?: boolean;
}
export interface Role {
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
  types?: string[];
  autoRejectCity?: boolean;
  autoRejectQualification?: boolean;
  autoRejectExperience?: boolean;
  experience?: string;
  qualification?: string;
  salaryMin?: string;
  salaryMax?: string;
  isSalaryHidden?: boolean;
  askExpectedSalary?: "hidden" | "open" | "ranges";
  expectedSalaryRanges?: string[];
  knockoutQuestions?: { text: string; type: "yes_no" | "options"; options?: string[]; requiredAnswer: string }[];
  requireVoiceInterview?: boolean;
  voiceInterviewTemplate?: "general" | "sales" | "custom";
  voiceInterviewQuestions?: string[];
  photoRequirement?: "optional" | "required" | "none";
  portfolioRequirement?: "optional" | "required" | "none";
  directUpload?: boolean;
  // Visibility controls (AI gets data, applicant may not see it)
  hideRoleSummary?: boolean;
  hideResponsibilities?: boolean;
  hideQualifications?: boolean;
  hideBenefits?: boolean;
  hideTargetMajors?: boolean;
  hideSkillsAndLanguages?: boolean;
}
export interface Job {
  id: string;
  company_id?: string;
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
  types?: string[];
  autoRejectCity?: boolean;
  autoRejectQualification?: boolean;
  autoRejectExperience?: boolean;
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
  askExpectedSalary?: "hidden" | "open" | "ranges";
  expectedSalaryRanges?: string[];
  knockoutQuestions?: { text: string; type: "yes_no" | "options"; options?: string[]; requiredAnswer: string }[];
  // Visibility controls (AI gets data, applicant may not see it)
  hideRoleSummary?: boolean;
  hideResponsibilities?: boolean;
  hideQualifications?: boolean;
  hideBenefits?: boolean;
  hideTargetMajors?: boolean;
  hideSkillsAndLanguages?: boolean;
  aiChatHistory?: { role: "user" | "assistant"; content: string }[];
}
// --- Components ---
export const LogoIcon = () => (
  <div className="logo-icon w-10 h-10 rounded-[12px] bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center relative shadow-[0_8px_16px_rgba(13,148,136,0.3),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.3)] transition-transform shrink-0">
    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-[12px]" />
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="relative z-10 drop-shadow-sm ml-0.5 mt-0.5">
      <path d="M10 6H6V18H10" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
      <circle cx="14" cy="12" r="3" fill="url(#copperGrd)" />
      <defs>
        <radialGradient id="copperGrd" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14 12) rotate(90) scale(3)">
          <stop stopColor="#FCD34D" />
          <stop offset="1" stopColor="#92400E" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);
export const ImageLightbox = ({ url, onClose }: { url: string | null; onClose: () => void }) => (
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

export const EmptyState = ({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel: string;
  onAction: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 px-8 text-center bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 relative overflow-hidden w-full mx-auto"
  >
    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent -z-10" />
    <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />

    <div className="mb-10 relative" style={{ perspective: "1000px" }}>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800/80 rounded-[32px] flex items-center justify-center mx-auto shadow-inner-3d border border-white/50 dark:border-slate-700">
          <Search size={56} className="text-slate-300 dark:text-slate-500" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 border-2 border-white dark:border-slate-800">
          <Briefcase size={24} className="text-white drop-shadow-md" strokeWidth={2} />
        </div>
      </motion.div>
    </div>

    <h3 className="text-2xl md:text-3xl font-black text-navy dark:text-white mb-6 max-w-lg leading-tight text-center relative z-10">
      {title}
    </h3>

    <button
      onClick={onAction}
      className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 active:scale-95 flex items-center gap-3 mt-2 relative z-10 group"
    >
      <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
        <Plus size={20} strokeWidth={3} />
      </div>
      {actionLabel}
    </button>
  </motion.div>
);
export const PreviewModal = ({ job, onClose }: { job: Job; onClose: () => void }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [step, setStep] = useState(
    job.directUpload || job.roles?.some(r => r.directUpload) || job.roles?.[0]?.directUpload
      ? "form"
      : "landing"
  );
  return (
    <div className="fixed inset-0 z-[100] bg-bg dark:bg-navy flex flex-col">
      <div className="h-16 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 bg-white dark:bg-slate-800 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Eye size={20} className="text-primary" />{" "}
          </div>{" "}
          <div>
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
          className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all border border-red-200 dark:border-red-500/20 shadow-sm"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto w-full relative">
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
            isPreview={true}
          />
        )}
      </div>{" "}
    </div>
  );
};
export const TalentPoolModal = ({
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
      <ImageLightbox url={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-t-[40px] md:rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border border-white dark:border-slate-700 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 left-6 w-10 h-10 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <X size={20} />{" "}
        </button>{" "}
        <div className="flex items-center gap-6 mb-8 border-b border-slate-100 dark:border-slate-700 pb-8 mt-4 md:mt-0">
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
            {talent.photoUrl ? (
              <img src={talent.photoUrl} alt={talent.name} className="w-full h-full object-cover" />
            ) : (
              talent.name.charAt(0)
            )}{" "}
          </div>{" "}
          <div>
            <h2 className="text-3xl font-bold text-navy dark:text-white mb-2">
              {talent.name}
            </h2>{" "}
            <p className="text-primary font-bold text-lg flex items-center flex-wrap gap-2">
              <span>{talent.job}</span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span>التوافق: {talent.score || (talent.rating ? talent.rating + "%" : "")}</span>
              {(talent.expectedSalary || talent.status) && (
                <>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <span className="text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-lg text-sm flex items-center gap-1">
                    <Briefcase size={14} /> الجاهزية: {talent.status}
                  </span>
                </>
              )}
              {talent.expectedSalary && (talent.askExpectedSalary === "open" || talent.askExpectedSalary === "ranges") && (
                <>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <span className="text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-lg text-sm flex items-center gap-1">
                    <CreditCard size={14} /> متوقع: {talent.expectedSalary}
                  </span>
                </>
              )}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="space-y-8">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-primary" /> ملخص الفرز{" "}
            </h3>{" "}
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {talent.aiSummary ||
                "مرشح متميز يمتلك خبرة تتوافق بشكل كبير مع المتطلبات المحددة. أظهر فهماً عميقاً في الجوانب التقنية بالإضافة لمهارات عالية في حل المشكلات."}
            </p>{" "}
          </div>{" "}
          <div>
            <h3 className="text-lg font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
              <Zap size={20} className="text-primary" /> المهارات والكفاءات{" "}
            </h3>{" "}
            <div className="flex flex-wrap gap-2">
              {talent.skills?.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  {skill}{" "}
                </span>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
            <a
              href={`tel:${talent.phone}`}
              className="flex items-center justify-center gap-3 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-blue-200/50 transition-all active:scale-95"
            >
              <Phone size={22} /> اتصال{" "}
            </a>{" "}
            <a
              href={`https://wa.me/${talent.phone}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-green-200 transition-all active:scale-95"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg> تواصل واتساب{" "}
            </a>{" "}
            <a
              href={`mailto:${talent.email}`}
              className="flex items-center justify-center gap-3 bg-navy text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-navy/20 transition-all active:scale-95"
            >
              <Mail size={22} /> إرسال إيميل{" "}
            </a>{" "}
          </div>{" "}
        </div>{" "}
      </motion.div>{" "}
    </div>
  );
};

const CompactSkillSelector = ({
  skills,
  selectedFilter,
  onFilterChange,
}: {
  skills: string[];
  selectedFilter: string;
  onFilterChange: (skill: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSkills = skills
    .filter((s) => s.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 50);

  return (
    <div className="relative z-[50] group" ref={ref}>
      <Filter
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10"
        size={18}
      />
      <div
        className={`pr-12 pl-10 py-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all min-w-[160px] border ${selectedFilter === "all" ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary/50" : "bg-primary/10 border-primary/50 dark:bg-primary/20 dark:border-primary/50"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`font-medium truncate max-w-[120px] ${selectedFilter === "all" ? "text-navy dark:text-white" : "font-bold text-primary"}`}>
          {selectedFilter === "all" ? "المهارة: الكل" : selectedFilter}
        </span>
        <ChevronDown size={14} className={`transition-transform ${selectedFilter === "all" ? "text-slate-400" : "text-primary"} ${isOpen ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 left-0 right-0 min-w-[240px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-slate-100 dark:border-slate-700 relative">
              <Search size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="ابحث عن مهارة..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pr-10 pl-3 py-2 text-sm outline-none focus:border-primary transition-colors text-navy dark:text-white font-medium"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="max-h-64 overflow-y-auto p-2 scrollbar-thin">
              <div
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${selectedFilter === "all" ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"}`}
                onClick={() => { onFilterChange("all"); setIsOpen(false); setSearch(""); }}
              >
                <div className="w-4 shrink-0">
                  {selectedFilter === "all" && <CheckCircle size={14} />}
                </div>
                <span className="text-sm font-bold">الكل</span>
              </div>
              {filteredSkills.map(skill => (
                <div
                  key={skill}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedFilter === skill ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
                  onClick={() => { onFilterChange(skill); setIsOpen(false); setSearch(""); }}
                >
                  <div className="w-4 shrink-0">
                    {selectedFilter === skill && <CheckCircle size={14} className="text-primary" />}
                  </div>
                  <span className="font-medium text-navy dark:text-white truncate">{skill}</span>
                </div>
              ))}
              {filteredSkills.length === 0 && (
                <div className="p-4 text-center text-sm font-medium text-slate-500">لا توجد نتائج مطابقة</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export const TalentPool = ({
  jobs,
  shortlistedIds,
  onToggleShortlist,
  onCreateJob,
  onViewDetails,
  talentPool,
  onCrossNominate,
  externalApplicants,
}: {
  jobs: Job[];
  shortlistedIds: string[];
  onToggleShortlist: (id: string) => void;
  onCreateJob: () => void;
  onViewDetails: () => void;
  talentPool: Applicant[];
  onCrossNominate?: (applicant: Applicant) => void;
  externalApplicants?: Applicant[];
}) => {
  const [jobFilter, setJobFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
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
        <header>
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
  const allStarredApplicants: any[] = [];

  // Collect all starred applicants from everywhere
  (jobs || []).forEach(job => {
    if (job && job.applicantsList) {
      job.applicantsList.forEach(app => {
        if (app && app.id && shortlistedIds && shortlistedIds.includes(app.id) && !allStarredApplicants.find(t => t && t.id === app.id)) {
          allStarredApplicants.push({ ...app, job: job.title || "غير محدد" });
        }
      });
    }
  });

  if (externalApplicants && Array.isArray(externalApplicants)) {
    externalApplicants.forEach(app => {
      if (app && app.id && shortlistedIds && shortlistedIds.includes(app.id) && !allStarredApplicants.find(t => t && t.id === app.id)) {
        allStarredApplicants.push({ ...app, job: app.job || "غير محدد" });
      }
    });
  }

  (talentPool || []).forEach(app => {
    if (app && app.id && shortlistedIds && shortlistedIds.includes(app.id) && !allStarredApplicants.find(t => t && t.id === app.id)) {
      allStarredApplicants.push(app);
    }
  });

  const baseApplicants = showOnlyShortlisted ? allStarredApplicants : (talentPool || []);

  const allUniqueSkills = Array.from(new Set(
    baseApplicants.filter((t: any) => t && !t.is_removed_from_pool).flatMap((t: any) => t.skills || [])
  )).filter(Boolean).sort();

  const filteredTalents = baseApplicants.filter((t: any) => {
    if (!t || t.is_removed_from_pool) return false;
    const matchesJob =
      jobFilter === "all" ||
      (t.job && typeof t.job === 'string' && t.job.includes((jobs || []).find((j: any) => j && j.id === jobFilter)?.title || ""));
    const matchesSkill = skillFilter === "all" || (t.skills && Array.isArray(t.skills) && t.skills.includes(skillFilter));
    const searchLower = (searchTerm || "").toLowerCase();
    const matchesSearch = !searchTerm ||
      (t.name && typeof t.name === 'string' && t.name.toLowerCase().includes(searchLower)) ||
      (t.job && typeof t.job === 'string' && t.job.toLowerCase().includes(searchLower)) ||
      (t.skills && Array.isArray(t.skills) && t.skills.some((s: string) => s && typeof s === 'string' && s.toLowerCase().includes(searchLower)));

    const matchesRating = ratingFilter === "all" ||
      (ratingFilter === "+90" && (t.rating || 0) >= 90) ||
      (ratingFilter === "+80" && (t.rating || 0) >= 80) ||
      (ratingFilter === "+70" && (t.rating || 0) >= 70) ||
      (ratingFilter === "-70" && (t.rating || 0) < 70);

    return matchesJob && matchesSkill && matchesSearch && matchesRating;
  });
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-3 text-navy dark:text-white">
            بنك الكفاءات
          </h1>{" "}
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
            استكشف جميع المتقدمين عبر كافة الوظائف المتاحة.
          </p>{" "}
        </div>{" "}
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <button
            onClick={() => setShowOnlyShortlisted(false)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!showOnlyShortlisted ? "bg-navy text-white shadow-lg shadow-navy/20" : "text-slate-400 dark:text-slate-500 hover:text-navy dark:text-white"}`}
          >
            الكل{" "}
          </button>{" "}
          <button
            onClick={() => setShowOnlyShortlisted(true)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${showOnlyShortlisted ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 dark:text-slate-500 hover:text-navy dark:text-white"}`}
          >
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
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={20}
            />{" "}
            <input
              type="text"
              placeholder="ابحث عن مهارة، اسم، أو مسمى وظيفي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium dark:text-white dark:placeholder-slate-400"
            />{" "}
          </div>{" "}
          <div className="flex gap-4">
            <CompactSkillSelector
              skills={allUniqueSkills}
              selectedFilter={skillFilter}
              onFilterChange={setSkillFilter}
            />
            <div className="relative group">
              <Sparkles
                className={`absolute right-4 top-1/2 -translate-y-1/2 drop-shadow-[0_0_5px_rgba(13,148,136,0.3)] transition-transform pointer-events-none ${ratingFilter === "all" ? "text-slate-400 dark:text-slate-500" : "text-primary dark:text-primary group-hover:scale-110"}`}
                size={18}
              />{" "}
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className={`pr-12 pl-10 py-4 rounded-2xl outline-none transition-all appearance-none cursor-pointer font-bold min-w-[160px] border ${ratingFilter === "all" ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-navy dark:text-white hover:border-primary/50" : "bg-primary/10 border-primary/50 text-primary dark:bg-primary/20 dark:border-primary/50"}`}
              >
                <option value="all" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium">التقييم الآلي: الكل</option>
                <option value="+90" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium">90% فما فوق</option>{" "}
                <option value="+80" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium">80% فما فوق</option>
                <option value="+70" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium">70% فما فوق</option>{" "}
                <option value="-70" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium">أقل من 70%</option>
              </select>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTalents.map((talent: any) => (
          <motion.div
            key={talent.id}
            layout
            whileHover={{ y: -5 }}
            onClick={() => onViewDetails(talent)}
            className="cursor-pointer bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40 group relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-6">
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
                  {talent.photoUrl ? (
                    <img src={talent.photoUrl} alt={talent.name} className="w-full h-full object-cover" />
                  ) : (
                    talent.name ? talent.name.charAt(0) : "م"
                  )}{" "}
                </div>{" "}
                <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-sm ${getScoreColor((talent.rating || 0).toString())}`}>
                  {talent.rating || 0}% مطابقة{" "}
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
              {(talent.skills || []).slice(0, 3).map((skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm truncate max-w-[140px]"
                  title={skill}
                >
                  {skill}{" "}
                </span>
              ))}
              {(talent.skills || []).length > 3 && (
                <span className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200/50 dark:border-slate-700/50 shadow-sm shrink-0">
                  +{(talent.skills || []).length - 3}
                </span>
              )}{" "}
            </div>{" "}
            <div className="flex items-center gap-2 pt-6 border-t border-slate-50 dark:border-slate-700">
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetails(talent); }}
                className="w-full flex items-center justify-center gap-2 bg-navy text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-navy/20"
              >
                <FileText size={18} /> عرض الملف{" "}
              </button>{" "}
            </div>{" "}
          </motion.div>
        ))}{" "}
        {filteredTalents.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 rounded-[32px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner-3d">
              <Search size={40} className="text-slate-300 dark:text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">لا توجد نتائج مطابقة</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">
              لم نتمكن من العثور على أي متقدم يطابق خيارات الفلاتر الحالية. حاول تعديل أو إزالة بعض الفلاتر لرؤية المزيد من النتائج.
            </p>
          </div>
        )}{" "}
      </div>{" "}
      <AnimatePresence>
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
export const GlobalJobSelector = ({
  jobs,
  selectedFilter,
  onFilterChange,
}: {
  jobs: Job[];
  selectedFilter: string;
  onFilterChange: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredJobs = jobs
    .filter((j) => j.status !== "مسودة")
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .filter((j) =>
      (j.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (j.company || "").toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 50);

  const selectedJob = jobs.find((j) => j.id === selectedFilter);

  const formatJobLabel = (job: Job) => {
    const date = new Date(job.createdAt || Date.now());
    const dateStr = `${date.getMonth() + 1}/${date.getFullYear()}`;
    return (
      <div className="flex items-center justify-between w-full text-right gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-navy dark:text-white truncate max-w-[200px]">{job.title || "إعلان وظائف"}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{dateStr}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${job.status === "نشط" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"}`}>
          {job.status}
        </span>
      </div>
    );
  };

  return (
    <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-[32px] border border-white dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
          <Filter size={20} />
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">
            عرض البيانات لـ:
          </p>
          <div className="relative w-64 md:w-80" ref={ref}>
            <div
              className={`px-4 py-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors border ${selectedFilter === "all" ? "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-primary/50" : "bg-primary/10 border-primary/50 dark:bg-primary/20"}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={`font-bold text-sm truncate max-w-[200px] ${selectedFilter === "all" ? "text-navy dark:text-white" : "text-primary"}`}>
                {selectedFilter === "all" ? "المسمى: الكل" : (selectedJob?.title || "كل الوظائف")}
              </span>
              <ChevronDown size={16} className={`transition-transform ${selectedFilter === "all" ? "text-slate-400" : "text-primary"} ${isOpen ? "rotate-180" : ""}`} />
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute z-50 top-full mt-2 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-100 dark:border-slate-700 relative">
                    <Search size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="ابحث عن وظيفة..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pr-10 pl-3 py-2 text-sm outline-none focus:border-primary transition-colors text-navy dark:text-white font-medium"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2 scrollbar-thin">
                    <div
                      className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${selectedFilter === "all" ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"}`}
                      onClick={() => { onFilterChange("all"); setIsOpen(false); setSearch(""); }}
                    >
                      <div className="w-4 shrink-0">
                        {selectedFilter === "all" && <CheckCircle size={16} />}
                      </div>
                      <span className="text-sm font-bold">كل الوظائف</span>
                    </div>
                    {filteredJobs.map(job => (
                      <div
                        key={job.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedFilter === job.id ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
                        onClick={() => { onFilterChange(job.id); setIsOpen(false); setSearch(""); }}
                      >
                        <div className="w-4 shrink-0">
                          {selectedFilter === job.id && <CheckCircle size={16} className="text-primary" />}
                        </div>
                        {formatJobLabel(job)}
                      </div>
                    ))}
                    {filteredJobs.length === 0 && (
                      <div className="p-4 text-center text-sm font-medium text-slate-500">لا توجد نتائج مطابقة</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-300 text-xs font-medium bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2 rounded-full border dark:border-slate-700">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> يتم
        تحديث جميع الإحصائيات والرسوم البيانية تلقائياً
      </div>
    </div>
  );
};

const GlassBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  if (!width || !height) return null;
  const overflow = 20;

  // Extract RGB from fill or use default green
  const rgbMatch = fill ? fill.match(/rgba?\((\d+,\s*\d+,\s*\d+)/) : null;
  const rgb = rgbMatch ? rgbMatch[1] : '25, 168, 145';

  return (
    <foreignObject x={x - overflow} y={y - overflow} width={width + overflow * 2} height={height + overflow * 2}>
      <div style={{ padding: overflow, width: '100%', height: '100%', boxSizing: 'border-box' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(180deg, rgba(${rgb}, 0.9) 0%, rgba(${rgb}, 0.1) 100%)`,
            boxShadow: `0px -5px 20px rgba(${rgb}, 0.4)`,
            borderTop: '2px solid rgba(111, 247, 166, 0.8)',
            borderLeft: `1px solid rgba(${rgb}, 0.4)`,
            borderRight: `1px solid rgba(${rgb}, 0.4)`,
            borderRadius: '6px 6px 0 0'
          }}
        />
      </div>
    </foreignObject>
  );
};
export const Reports = ({ jobs, filterId, applicants = [] }: { jobs: Job[]; filterId: string; applicants?: any[] }) => {
  const filteredJobs = filterId === "all" ? jobs : jobs.filter(j => j.id === filterId);
  const totalJobs = filteredJobs.length;

  const relevantApplicants = filterId === "all"
    ? applicants
    : applicants.filter(a => {
      const searchJob = jobs.find(j => j.id === filterId)?.title || "";
      return searchJob ? a.job.includes(searchJob) : false;
    });

  const totalApplicants = applicants.length > 0
    ? relevantApplicants.length
    : filteredJobs.reduce((sum, j) => sum + (j.applicants || 0), 0);

  const pendingCount = relevantApplicants.filter(a => !a.decision || a.decision === "pending").length;
  const interviewCount = relevantApplicants.filter(a => a.decision === "interview").length;
  const acceptedCount = relevantApplicants.filter(a => a.decision === "accepted").length;
  const rejectedCount = relevantApplicants.filter(a => a.decision === "rejected").length;
  const autoRejectedCount = relevantApplicants.filter(a => a.decision === "filtered").length;

  let linkdinCount = 0;
  let baytCount = 0;
  let twitterCount = 0;
  let facebookCount = 0;
  let whatsappCount = 0;
  let telegramCount = 0;
  let referralCount = 0;
  let websiteCount = 0;

  relevantApplicants.forEach(app => {
    const src = (app.source || "").toLowerCase();
    if (src.includes("لينكد إن") || src.includes("linkedin")) linkdinCount++;
    else if (src.includes("بيت.كوم") || src.includes("bayt")) baytCount++;
    else if (src.includes("تويتر") || src.includes("إكس") || src.includes("x.com") || src.includes("twitter")) twitterCount++;
    else if (src.includes("فيسبوك") || src.includes("facebook")) facebookCount++;
    else if (src.includes("واتساب") || src.includes("whatsapp")) whatsappCount++;
    else if (src.includes("تيليجرام") || src.includes("telegram")) telegramCount++;
    else if (src.includes("توصية") || src.includes("referral") || src.includes("معارف")) referralCount++;
    else if (src.includes("موقع الشركة") || src.includes("website") || src.includes("غير محدد")) websiteCount++;
    else websiteCount++;
  });

  // Removed mock data as per user request to display actual real data (even if 0)

  const platformsTotal = linkdinCount + baytCount;
  const socialTotal = twitterCount + facebookCount;
  const messagingTotal = whatsappCount + telegramCount;
  const otherTotal = referralCount + websiteCount;

  const safePercent = (part: number, total: number) => total > 0 ? Math.round((part / total) * 100) : 0;

  const sourceOfHireData = [
    {
      name: "منصات التوظيف",
      value: platformsTotal,
      breakdown: [{ name: "لينكد إن", value: safePercent(linkdinCount, platformsTotal) }, { name: "بيت.كوم", value: safePercent(baytCount, platformsTotal) }]
    },
    {
      name: "شبكات التواصل",
      value: socialTotal,
      breakdown: [{ name: "تويتر / X", value: safePercent(twitterCount, socialTotal) }, { name: "فيسبوك", value: safePercent(facebookCount, socialTotal) }]
    },
    {
      name: "تطبيقات المراسلة",
      value: messagingTotal,
      breakdown: [{ name: "واتساب", value: safePercent(whatsappCount, messagingTotal) }, { name: "تيليجرام", value: safePercent(telegramCount, messagingTotal) }]
    },
    {
      name: "مصادر أخرى",
      value: otherTotal,
      breakdown: [{ name: "الإحالات", value: safePercent(referralCount, otherTotal) }, { name: "موقع الشركة", value: safePercent(websiteCount, otherTotal) }]
    },
  ];

  // Hiring funnel
  const screenedCount = Math.max(0, totalApplicants - autoRejectedCount);
  const interviewsStageCount = interviewCount + acceptedCount;
  const offersCount = acceptedCount;

  const hiringFunnelData = [
    { name: "إجمالي المتقدمين", value: totalApplicants },
    { name: "الفرز الآلي", value: screenedCount },
    { name: "المقابلات", value: interviewsStageCount },
    { name: "المقبولين", value: offersCount },
  ];

  // Candidate Quality Index
  const highQualityCount = relevantApplicants.filter(a => { const r = a.rating || a.match_percentage || 0; return r >= 80; }).length;
  const mediumQualityCount = relevantApplicants.filter(a => { const r = a.rating || a.match_percentage || 0; return r >= 70 && r < 80; }).length;
  const lowQualityCount = relevantApplicants.filter(a => { const r = a.rating || a.match_percentage || 0; return r < 70; }).length;

  const qualityIndexData = [
    { name: "كفاءة عالية (+80%)", value: highQualityCount },
    { name: "كفاءة متوسطة (70%-79%)", value: mediumQualityCount },
    { name: "كفاءة ضعيفة (<70%)", value: lowQualityCount }
  ].filter(d => d.value > 0);

  // Calculate dynamic average time to hire (based on time since job creation)
  let totalDays = 0;
  let validJobsCount = 0;

  filteredJobs.forEach(job => {
    if (job.createdAt) {
      const createdDate = new Date(job.createdAt);
      const currentDate = new Date();
      // Calculate diff in days
      const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays += diffDays;
      validJobsCount++;
    }
  });

  const avgTime = validJobsCount > 0 ? Math.round(totalDays / validJobsCount) : 0;

  const glassStyleStr = { background: "rgba(25, 168, 145, 0.30)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(25, 168, 145, 0.50)", boxShadow: "0 4px 15px rgba(25, 168, 145, 0.2)" };

  // Glass versions of original colors: Blue, Orange, Purple, Teal
  const COLORS = [
    "rgba(59, 130, 246, 0.40)",
    "rgba(249, 115, 22, 0.40)",
    "rgba(139, 92, 246, 0.40)",
    "rgba(13, 148, 136, 0.40)"
  ];
  const STROKE_COLORS = [
    "rgba(59, 130, 246, 0.60)",
    "rgba(249, 115, 22, 0.60)",
    "rgba(139, 92, 246, 0.60)",
    "rgba(13, 148, 136, 0.60)"
  ];
  return (
    <div className="space-y-6 pb-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-3 text-navy dark:text-white">
          التقارير
        </h1>{" "}
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium text-lg">
          نظرة شاملة ودقيقة على أداء عمليات التوظيف والبيانات التحليلية.
        </p>{" "}
      </header>{" "}
      {/* Top Row: Metric Cards */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            label: "إجمالي المتقدمين",
            value: totalApplicants.toString(),
            icon: <Users size={18} />,
            color: "text-primary",
            bg: "bg-primary/10",
            subtitle: totalApplicants > 0 ? (
              <span className="flex items-center gap-1.5 justify-center">
                <Sparkles size={14} className="text-primary fill-primary/20" />
                <span>تم استبعاد {Math.round((autoRejectedCount / totalApplicants) * 100)}% آلياً.</span>
              </span>
            ) : undefined,
          },
          {
            label: "إجمالي الوظائف",
            value: totalJobs.toString(),
            icon: <Briefcase size={18} />,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "متوسط وقت التوظيف",
            value: `${avgTime} يوم`,
            icon: <Clock size={18} />,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center"
          >
            <div
              className={`w-10 h-10 ${metric.bg} ${metric.color} rounded-xl flex items-center justify-center mb-4 shadow-inner-3d`}
            >
              {metric.icon}{" "}
            </div>{" "}
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
              {metric.label}
            </p>{" "}
            <h3 className="text-2xl font-black text-navy dark:text-white">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Source of Hire Pie Chart Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-navy dark:text-white">
              مصادر التوظيف
            </h3>{" "}
            <PieChartIcon className="text-slate-300" size={20} />{" "}
          </div>{" "}
          <div className="h-[240px] w-full flex items-center justify-between">
            <div className="relative w-[55%] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {["96, 165, 250", "139, 92, 246", "156, 163, 175", "13, 148, 136"].map((rgb, index) => (
                      <linearGradient key={`grad-${index}`} id={`pieGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={`rgba(${rgb}, 0.9)`} />
                        <stop offset="100%" stopColor={`rgba(${rgb}, 0.4)`} />
                      </linearGradient>
                    ))}
                    {["96, 165, 250", "139, 92, 246", "156, 163, 175", "13, 148, 136"].map((rgb, index) => (
                      <filter key={`glow-${index}`} id={`pieGlow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={`rgba(${rgb}, 0.5)`} />
                      </filter>
                    ))}
                  </defs>
                  <Pie
                    data={sourceOfHireData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                      if (percent === 0) return null;
                      return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold">
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {sourceOfHireData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#pieGrad-${index % 4})`} 
                        filter={`url(#pieGlow-${index % 4})`} 
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] min-w-[160px] text-right" style={glassStyleStr} dir="rtl">
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
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <PieChartIcon size={24} className="text-slate-400 dark:text-slate-500" />
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="w-[45%] flex flex-col justify-center gap-3 pr-4 border-r border-slate-100 dark:border-slate-700">
              {sourceOfHireData.map((entry, index) => {
                const PIE_RGBS = ["96, 165, 250", "139, 92, 246", "156, 163, 175", "13, 148, 136"];
                const total = sourceOfHireData.reduce((sum, item) => sum + item.value, 0);
                const percent = total > 0 ? Math.round((entry.value / total) * 100) : 0;
                
                return (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `rgb(${PIE_RGBS[index % 4]})`, boxShadow: `0 0 8px rgba(${PIE_RGBS[index % 4]}, 0.6)` }}></div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{entry.name}</span>
                    </div>
                    <span className="text-sm font-bold text-navy dark:text-white mr-4">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>{" "}
        {/* Hiring Funnel Chart Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-navy dark:text-white">
              مسار توظيف المتقدمين
            </h3>{" "}
            <BarChartIcon className="text-slate-300" size={20} />{" "}
          </div>{" "}
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hiringFunnelData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 160, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" strokeOpacity={0.1} />
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
                        <div className="p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] min-w-[140px] text-right" style={glassStyleStr} dir="rtl">
                          <p className="font-bold text-slate-500 dark:text-slate-400 mb-2 text-xs">{label}</p>
                          <p className="text-white font-black text-sm flex items-center gap-1">{payload[0].value} متقدماً</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  trigger="hover"
                  wrapperStyle={{ pointerEvents: 'auto' }}
                />
                <Bar
                  dataKey="value"
                  radius={12}
                  barSize={30}
                  stroke="none"
                  shape={<GlassBar />}
                >
                  {hiringFunnelData.map((entry, index) => {
                    let fillRgba = "rgba(13, 148, 136, 0.40)"; // Green for Total and Accepted
                    let strokeRgba = "rgba(13, 148, 136, 0.60)";
                    if (entry.name === "الفرز الآلي") {
                      fillRgba = "rgba(59, 130, 246, 0.40)"; // Blue for AI Screening
                      strokeRgba = "rgba(59, 130, 246, 0.60)";
                    } else if (entry.name === "المقابلات") {
                      fillRgba = "rgba(249, 115, 22, 0.40)"; // Orange for Interviews
                      strokeRgba = "rgba(249, 115, 22, 0.60)";
                    }
                    return <Cell key={"cell-" + index} fill={fillRgba} stroke={strokeRgba} strokeWidth={1} />;
                  })}
                  <LabelList position="right" fill="#64748b" stroke="none" dataKey="value" fontSize={14} fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Bottom Row: Full Width Bar Chart for Candidate Quality Index */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-navy dark:text-white">
              مؤشر جودة المتقدمين
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1">
              تحليل مستويات كفاءة المتقدمين بناءً على نسب المطابقة.
            </p>
          </div>
          <BarChartIcon className="text-slate-300" size={20} />
        </div>
        <div className="w-full h-80 transition-all duration-300" dir="ltr">
          {qualityIndexData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={qualityIndexData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 160, bottom: 20 }}
              >
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
                        <div className="p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] min-w-[140px] text-right" style={glassStyleStr} dir="rtl">
                          <p className="font-bold text-slate-500 dark:text-slate-400 mb-2 text-xs">{label}</p>
                          <p className="text-slate-600 dark:text-slate-300 font-black text-sm mb-2">{payload[0].value} متقدم</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  wrapperStyle={{ pointerEvents: 'auto' }}
                />
                <Bar
                  dataKey="value"
                  radius={12}
                  barSize={30}
                  stroke="none"
                  shape={<GlassBar />}
                >
                  {qualityIndexData.map((entry, index) => {
                    let fillRgba = "rgba(13, 148, 136, 0.40)"; // Teal/Green for high efficiency
                    let strokeRgba = "rgba(13, 148, 136, 0.60)";
                    if (entry.name.includes("متوسطة")) {
                      fillRgba = "rgba(249, 115, 22, 0.40)"; // Orange for medium efficiency
                      strokeRgba = "rgba(249, 115, 22, 0.60)";
                    } else if (entry.name.includes("ضعيفة")) {
                      fillRgba = "rgba(239, 68, 68, 0.40)"; // Red for low efficiency
                      strokeRgba = "rgba(239, 68, 68, 0.60)";
                    }
                    return <Cell key={"cell-" + index} fill={fillRgba} stroke={strokeRgba} strokeWidth={1} />;
                  })}
                  <LabelList position="right" fill="#64748b" stroke="none" dataKey="value" fontSize={14} fontWeight="bold" offset={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">لا توجد بيانات كافية</div>
          )}
        </div>
      </div>
    </div>
  );
};






// RESTORED COMPONENTS
export const SettingsPage = ({
  darkMode,
  setDarkMode,
  userProfile,
  setUserProfile,
  userEmail,
  initialTab = "الملف الشخصي"
}: {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userProfile: any;
  setUserProfile: any;
  userEmail?: string;
  initialTab?: string;
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const isLocked = userProfile.fields_locked === true;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { supabase: sb } = await import('./lib/supabaseClient');
        const { data } = await sb.from('plans').select('*');
        if (data) setSubscriptionPlans(data);
      } catch (err) {
        console.error("Failed to fetch plans", err);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    if (!isLocked) {
      // Only validate CR/Tax if not already locked
      if (userProfile.entityType === 'company') {
        if (!userProfile.companyName?.trim()) {
          newErrors.companyName = "هذا الحقل مطلوب لإصدار الفواتير";
        }
        if (!userProfile.commercialRegistration?.trim()) {
          newErrors.cr = "هذا الحقل مطلوب لإصدار الفواتير";
        } else if (!/^\d{10}$/.test(userProfile.commercialRegistration)) {
          newErrors.cr = "يجب أن يتكون السجل التجاري من 10 أرقام بالضبط";
        }
        if (userProfile.taxNumber?.trim() && !/^3\d{13}3$/.test(userProfile.taxNumber)) {
          newErrors.tax = "يجب أن يتكون الرقم الضريبي من 15 رقماً ويبدأ وينتهي بالرقم 3 (معيار ZATCA)";
        }
        if (!userProfile.city?.trim()) {
          newErrors.city = "هذا الحقل مطلوب لإصدار الفواتير";
        }
      } else if (userProfile.entityType === 'freelance') {
        if (!userProfile.companyName?.trim()) {
          newErrors.companyName = "هذا الحقل مطلوب لإصدار الفواتير";
        }
        if (!userProfile.freelanceDocument?.trim()) {
          newErrors.freelance = "هذا الحقل مطلوب لإصدار الفواتير";
        }
        if (!userProfile.city?.trim()) {
          newErrors.city = "هذا الحقل مطلوب لإصدار الفواتير";
        }
      }
    } else {
      // Locked — only validate flexible fields
      if (!userProfile.companyName?.trim()) {
        newErrors.companyName = "هذا الحقل مطلوب";
      }
      if (!userProfile.city?.trim()) {
        newErrors.city = "هذا الحقل مطلوب";
      }
    }
    setErrors(newErrors);
  }, [userProfile.companyName, userProfile.commercialRegistration, userProfile.taxNumber, userProfile.freelanceDocument, userProfile.city, userProfile.entityType, isLocked]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockConfirmed, setLockConfirmed] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentHtml, setPaymentHtml] = useState("");

  // Locked field display component
  const LockedField = ({ value, label }: { value: string; label: string }) => (
    <div className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
      <Lock size={16} className="text-amber-500 shrink-0" />
      <span className="text-slate-700 dark:text-slate-300 font-bold flex-1 font-mono tracking-wider" dir="ltr">{value || "—"}</span>
      <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full whitespace-nowrap">مقفل · ZATCA</span>
    </div>
  );

  const executeSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const { supabase: sb } = await import('./lib/supabaseClient');
      const { data: { user } } = await sb.auth.getUser();
      if (!user) throw new Error('غير مسجل الدخول');

      const shouldLock = !isLocked &&
        (!!userProfile.commercialRegistration?.trim() || !!userProfile.freelanceDocument?.trim());

      const payload: any = {
        id: user.id,
        company_name: userProfile.companyName || userProfile.name || '',
        entity_type: userProfile.entityType,
        city: userProfile.city || null,
        subscription_plan: userProfile.subscription_tier || 'free',
        company_logo: userProfile.companyLogo || null,
      };

      if (!isLocked) {
        payload.commercial_registration = userProfile.commercialRegistration?.trim() || null;
        payload.freelance_document = userProfile.freelanceDocument?.trim() || null;
        payload.tax_number = userProfile.taxNumber?.trim() || null;
        if (shouldLock) {
          payload.fields_locked = true;
        }
      }

      const { error } = await sb.from('companies').upsert(payload, { onConflict: 'id' });
      if (error) throw error;

      // Update name and title in user_metadata
      const { error: updateError } = await sb.auth.updateUser({
        data: {
          full_name: userProfile.name || '',
          job_title: userProfile.title || ''
        }
      });
      if (updateError) console.error("Failed to update user_metadata", updateError);

      if (shouldLock) {
        setUserProfile({ ...userProfile, fields_locked: true });
      }
      setSaveSuccess(true);
      setShowLockModal(false);
      setLockConfirmed(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      const msg = err.message || 'خطأ غير متوقع';
      if (msg.includes('ZATCA_LOCKED')) {
        alert('🔒 رفض النظام: هذه الحقول مقفلة في قاعدة البيانات ولا يمكن تعديلها.');
      } else {
        alert('حدث خطأ أثناء الحفظ: ' + msg);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = () => {
    // If fields are not locked yet and CR or Freelance doc is filled → show legal modal
    const willLock = !isLocked &&
      (!!userProfile.commercialRegistration?.trim() || !!userProfile.freelanceDocument?.trim());
    if (willLock) {
      setLockConfirmed(false);
      setShowLockModal(true);
    } else {
      executeSave();
    }
  };


  const [billingCycle, setBillingCycle] = useState<'subscription' | 'one-time'>('subscription');
  const [hasActiveAd, setHasActiveAd] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const generatePaymentForm = async (packageId: string, isYearlyPlan: boolean) => {
    setShowPaymentModal(true);
    setPaymentHtml(""); // Clear old content

    try {
      const { supabase: sb } = await import('./lib/supabaseClient');
      const { data, error } = await sb.functions.invoke('neoleap-payment', {
        body: { action: 'initiate', customerId: userProfile.id, packageId, isYearly: isYearlyPlan }
      });

      if (error || !data || data.error) {
        console.error("Payment Error:", error || data?.error);
        alert("عذراً، حدث خطأ أثناء تجهيز بوابة الدفع. يرجى المحاولة لاحقاً.");
        setShowPaymentModal(false);
        return;
      }

      // إزالة أي Form سابق إن وجد
      const existingForm = document.getElementById('neoleap-raw-form');
      if (existingForm) existingForm.remove();

      // بناء النموذج كنص HTML خام
      const formHtml = `
        <form id="neoleap-raw-form" method="POST" action="${data.paymentUrl}" enctype="application/x-www-form-urlencoded" style="display: none;">
          <input type="hidden" name="id" value="${data.id}" />
          <input type="hidden" name="trandata" value="${data.trandata}" />
          <input type="hidden" name="responseURL" value="${data.responseURL}" />
          <input type="hidden" name="errorURL" value="${data.errorURL}" />
        </form>
      `;

      // حقن الكود مباشرة في الـ Body
      document.body.insertAdjacentHTML('beforeend', formHtml);

      // إرسال النموذج فوراً
      (document.getElementById('neoleap-raw-form') as HTMLFormElement).submit();

      // Cleanup after submit
      setTimeout(() => {
        const f = document.getElementById('neoleap-raw-form');
        if (f) f.remove();
        setShowPaymentModal(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ في الاتصال بالخادم.");
      setShowPaymentModal(false);
    }
  };

  const handleSubscribe = async (tier: string) => {
    // Determine the actual packageId matching the DB rows
    const packageId = `${tier}_${isYearly ? 'yearly' : 'monthly'}`;
    await generatePaymentForm(packageId, isYearly);
  };

  const handleBuyAd = async () => {
    await generatePaymentForm('single_job', false);
  };

  const handleConfirmPayment = () => {
    setShowPaymentModal(false);
    setPaymentHtml("");
    alert("تم تأكيد عملية الدفع بنجاح! \nتم إرسال إشعار للإدارة لتفعيل الباقة يدوياً في أقرب وقت.");
  };

  return (
    <>
      {/* ====== ZATCA Legal Confirmation Modal ====== */}
      <AnimatePresence>
        {showLockModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-[28px] shadow-2xl border border-amber-200 dark:border-amber-800/50 max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/50 px-8 py-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="font-black text-amber-800 dark:text-amber-300 text-base">⚠️ تنبيه قانوني — ZATCA</h3>
                  <p className="text-amber-600 dark:text-amber-400 text-xs font-bold mt-0.5">الامتثال لمعايير هيئة الزكاة والضريبة والجمارك</p>
                </div>
              </div>
              {/* Body */}
              <div className="px-8 py-6 space-y-5">
                <p className="text-slate-700 dark:text-slate-200 font-bold text-sm leading-relaxed">
                  البيانات الرسمية التي أدخلتها سيتم قفلها بعد الحفظ للامتثال لمتطلبات الفوترة، ولن تتمكن من تعديلها لاحقاً.
                </p>
                {/* Data Preview */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">البيانات المراد قفلها</p>

                  {userProfile.entityType === 'company' ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">السجل التجاري (CR)</span>
                      <span className="font-black text-navy dark:text-white font-mono tracking-wider text-sm" dir="ltr">{userProfile.commercialRegistration}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">وثيقة العمل الحر</span>
                      <span className="font-black text-navy dark:text-white font-mono tracking-wider text-sm" dir="ltr">{userProfile.freelanceDocument}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">الرقم الضريبي (Tax ID)</span>
                    <span className="font-black text-navy dark:text-white font-mono tracking-wider text-sm" dir="ltr">{userProfile.taxNumber || "غير مدخل (اختياري)"}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  هل أنت متأكد من صحة البيانات؟ في حال الخطأ، يتم التعديل حصراً عبر تذكرة دعم فني بعد التحقق من المستندات الرسمية.
                </p>
                {/* Mandatory Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={lockConfirmed}
                    onChange={(e) => setLockConfirmed(e.target.checked)}
                    className="w-5 h-5 rounded-lg border-2 border-slate-300 accent-amber-600 shrink-0 mt-0.5 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed group-hover:text-navy dark:group-hover:text-white transition-colors">
                    أقر بمراجعتي للبيانات وأنها صحيحة ونهائية
                  </span>
                </label>
              </div>
              {/* Footer */}
              <div className="px-8 pb-7 flex gap-3">
                <button
                  onClick={() => { setShowLockModal(false); setLockConfirmed(false); }}
                  className="flex-1 py-3 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-sm"
                >
                  مراجعة البيانات
                </button>
                <button
                  onClick={executeSave}
                  disabled={!lockConfirmed || isSaving}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${lockConfirmed && !isSaving
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/30 active:scale-95'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  {isSaving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />جاري القفل...</>
                  ) : (
                    <><Lock size={16} />تأكيد الحفظ النهائي</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-10">
        {" "}
        <header>
          {" "}
          <h1 className={`text-4xl font-bold mb-3 text-navy dark:text-white`}>
            إدارة الحساب
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
            {["الملف الشخصي", "بيانات المنشأة", "باقات فرز", "المظهر"].map((tab) => (
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
                        setUserProfile({ ...userProfile, companyLogo: URL.createObjectURL(e.target.files[0]) });
                      }
                    }} />
                    {userProfile.companyLogo ? (
                      <img src={userProfile.companyLogo} className="w-full h-full object-cover" alt="User Avatar" />
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
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy dark:text-slate-300">الاسم</label>
                    <input type="text" value={userProfile.name} onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy dark:text-slate-300">المسمى الوظيفي</label>
                    <input type="text" value={userProfile.title} onChange={(e) => setUserProfile({ ...userProfile, title: e.target.value })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-navy dark:text-slate-300">البريد الإلكتروني</label>
                    <input type="text" readOnly value={userEmail || "لا يوجد بريد مسجل"} className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 border rounded-2xl outline-none cursor-not-allowed font-medium select-none" />
                  </div>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className={`px-10 py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2 mt-4 ${saveSuccess ? 'bg-primary text-white' : 'bg-primary text-white hover:shadow-lg hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed'}`}
                >
                  {isSaving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />جاري الحفظ...</>
                  ) : saveSuccess ? (
                    <><CheckCircle size={18} />تم الحفظ بنجاح!</>
                  ) : (
                    'حفظ التغييرات'
                  )}
                </button>
              </div>
            )}

            {activeTab === "بيانات المنشأة" && (

              <div className="max-w-2xl space-y-8">
                {" "}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {" "}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-navy dark:text-slate-300">نوع الكيان</label>
                    <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 gap-1.5 rounded-2xl w-full">
                      <button type="button" onClick={() => setUserProfile({ ...userProfile, entityType: "company" })} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${userProfile.entityType === "company" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>جهة اعتبارية (شركة/مؤسسة)</button>
                      <button type="button" onClick={() => setUserProfile({ ...userProfile, entityType: "freelance" })} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${userProfile.entityType === "freelance" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>فرد مستقل (عمل حر)</button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2 group">
                    <label className="text-sm font-bold text-navy dark:text-slate-300">
                      {userProfile.entityType === "company" ? "اسم المنشأة" : "اسم الفرد / المشروع"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={userProfile.companyName || ""}
                      onChange={(e) => setUserProfile({ ...userProfile, companyName: e.target.value })}
                      placeholder={userProfile.entityType === "company" ? "شركة الحلول الذكية..." : "عبدالله محمد..."}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                    />
                    {errors.companyName && <p className="text-red-500 text-xs mt-1 font-bold transition-all">{errors.companyName}</p>}
                  </div>

                  {userProfile.entityType === "company" ? (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-slate-300 flex items-center gap-2">
                        رقم السجل التجاري (CR)
                        {!isLocked && <span className="text-red-500">*</span>}
                      </label>
                      {isLocked ? (
                        <LockedField value={userProfile.commercialRegistration || ""} label="CR" />
                      ) : (
                        <>
                          <input
                            type="text"
                            value={userProfile.commercialRegistration || ""}
                            onChange={(e) => setUserProfile({ ...userProfile, commercialRegistration: e.target.value })}
                            placeholder="1010XXXXXX"
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                            dir="ltr"
                          />
                          {errors.cr && <p className="text-red-500 text-xs mt-1 font-bold">{errors.cr}</p>}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 group">
                      <label className="text-sm font-bold text-navy dark:text-slate-300 flex items-center gap-2">
                        رقم وثيقة العمل الحر أو الهوية
                        {!isLocked && <span className="text-red-500">*</span>}
                      </label>
                      {isLocked ? (
                        <LockedField value={userProfile.freelanceDocument || ""} label="Freelance ID" />
                      ) : (
                        <>
                          <input
                            type="text"
                            value={userProfile.freelanceDocument || ""}
                            onChange={(e) => setUserProfile({ ...userProfile, freelanceDocument: e.target.value })}
                            placeholder="FL-XXXXXX"
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                            dir="ltr"
                          />
                          {errors.freelance && <p className="text-red-500 text-xs mt-1 font-bold transition-all">{errors.freelance}</p>}
                        </>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 group">
                    <label className="text-sm font-bold text-navy dark:text-slate-300">مدينة المقر الرئيسي (لأغراض الفوترة) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={userProfile.city || ""}
                      onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                      placeholder="الرياض، جدة..."
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1 font-bold transition-all">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy dark:text-slate-300 flex items-center gap-2">
                      الرقم الضريبي (Tax ID)
                      <span className="text-xs text-slate-400 font-normal bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">اختياري</span>
                    </label>
                    {isLocked ? (
                      <LockedField value={userProfile.taxNumber || ""} label="Tax ID" />
                    ) : (
                      <>
                        <input
                          type="text"
                          value={userProfile.taxNumber || ""}
                          onChange={(e) => setUserProfile({ ...userProfile, taxNumber: e.target.value })}
                          placeholder="3000XXXXXXXXX003"
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                          dir="ltr"
                          maxLength={15}
                        />
                        {errors.tax && <p className="text-red-500 text-xs mt-1 font-bold">{errors.tax}</p>}
                      </>
                    )}
                  </div>
                  {isLocked && (
                    <div className="md:col-span-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex items-start gap-3">
                      <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
                        الحقول المعلّمة بـ <span className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-amber-700 dark:text-amber-300">مقفل · ZATCA</span> محمية بموجب لوائح الفوترة الإلكترونية.
                        لأي تعديل، يُرجى التواصل مع الدعم الفني عبر تذكرة رسمية مرفقاً بها المستندات.
                      </p>
                    </div>
                  )}
                </div>{" "}
                <button
                  onClick={handleSaveProfile}
                  disabled={Object.keys(errors).length > 0 || isSaving}
                  className={`px-10 py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2 ${Object.keys(errors).length > 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500' : saveSuccess ? 'bg-primary text-white' : 'bg-primary text-white hover:shadow-lg hover:shadow-primary/30'}`}
                >
                  {isSaving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />جاري الحفظ...</>
                  ) : saveSuccess ? (
                    <><CheckCircle size={18} />تم الحفظ بنجاح!</>
                  ) : (
                    'حفظ التغييرات'
                  )}
                </button>{" "}
              </div>
            )}{" "}
            {activeTab === "باقات فرز" && (
              <div className="space-y-8 pb-10 flex flex-col items-center">

                {/* Header Toggles */}
                <div className="flex flex-col items-center gap-5 mb-6">

                  {/* Toggle Wrapper - Very Rectangular */}
                  <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex gap-1 shadow-inner border border-transparent dark:border-slate-700">
                    <button
                      onClick={() => setBillingCycle('subscription')}
                      className={`px-6 py-2.5 rounded-md text-sm font-bold transition-all ${billingCycle === 'subscription' ? 'bg-[#0D9488] text-white shadow-md' : 'text-slate-500 hover:text-navy dark:text-slate-400 dark:hover:text-white'}`}
                    >
                      اشتراكات مستمرة
                    </button>
                    <button
                      onClick={() => setBillingCycle('one-time')}
                      className={`px-6 py-2.5 rounded-md text-sm font-bold transition-all ${billingCycle === 'one-time' ? 'bg-[#0D9488] text-white shadow-md' : 'text-slate-500 hover:text-navy dark:text-slate-400 dark:hover:text-white'}`}
                    >
                      توظيف لمرة واحدة
                    </button>
                  </div>

                  {billingCycle === 'subscription' && (
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full flex gap-1 shadow-inner border border-slate-200/50 dark:border-slate-700 mt-2">
                      <button
                        onClick={() => setIsYearly(false)}
                        className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${!isYearly ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy dark:hover:text-white'}`}
                      >
                        دفع شهري
                      </button>
                      <button
                        onClick={() => setIsYearly(true)}
                        className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${isYearly ? 'bg-[#0D9488] text-white shadow-md' : 'text-slate-500 hover:text-navy dark:hover:text-white'}`}
                      >
                        دفع سنوي
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isYearly ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'}`}>وفر قيمة شهرين</span>
                      </button>
                    </div>
                  )}
                </div>

                {(() => {
                  const activeTier = userProfile?.subscription_tier;
                  const highlightedTier = (activeTier === 'startup' || activeTier === 'business' || activeTier === 'enterprise') ? activeTier : 'business';

                  const startupPlan = subscriptionPlans.find(p => p.id === `startup_${isYearly ? 'yearly' : 'monthly'}`);
                  const businessPlan = subscriptionPlans.find(p => p.id === `business_${isYearly ? 'yearly' : 'monthly'}`);
                  const enterprisePlan = subscriptionPlans.find(p => p.id === `enterprise_${isYearly ? 'yearly' : 'monthly'}`);

                  const startupPrice = startupPlan?.price.toLocaleString() || (isYearly ? '4,990' : '499');
                  const businessPrice = businessPlan?.price.toLocaleString() || (isYearly ? '14,990' : '1,499');
                  const enterprisePrice = enterprisePlan?.price.toLocaleString() || (isYearly ? '34,990' : '3,499');

                  const startupFeatures = startupPlan?.features || ["5 وظائف نشطة", isYearly ? "12,000 سيرة ذاتية سنوياً" : "1,000 سيرة ذاتية شهرياً", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"];
                  const businessFeatures = businessPlan?.features || ["15 وظيفة نشطة", isYearly ? "60,000 سيرة ذاتية سنوياً" : "5,000 سيرة ذاتية شهرياً", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"];
                  const enterpriseFeatures = enterprisePlan?.features || ["وظائف غير محدودة", isYearly ? "180,000 سيرة ذاتية سنوياً" : "15,000 سيرة ذاتية شهرياً", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"];

                  const showStartup = startupPlan ? startupPlan.is_active !== false : true;
                  const showBusiness = businessPlan ? businessPlan.is_active !== false : true;
                  const showEnterprise = enterprisePlan ? enterprisePlan.is_active !== false : true;

                  return billingCycle === 'subscription' && (
                    <div className="flex flex-col md:flex-row justify-center gap-4 items-center w-full max-w-5xl mx-auto mt-2">

                      {/* انطلاق (Right) */}
                      {showStartup && (
                        <div className={`w-full rounded-2xl flex flex-col items-center transition-all duration-300 py-6 px-5 cursor-default ${highlightedTier === 'startup' ? 'bg-gradient-to-b from-[#f4fcf9] to-white dark:from-teal-950/40 dark:to-slate-900 max-w-[260px] border border-[#0D9488]/40 ring-4 ring-[#0D9488]/10 shadow-[0_30px_60px_-15px_rgba(13,148,136,0.3)] md:-mt-4 relative z-10 antialiased' : 'bg-white dark:bg-slate-800 max-w-[240px] border border-[#0D9488]/30 border-b-[4px] dark:border-[#0D9488]/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-[#0D9488]/50 hover:shadow-[0_15px_40px_-10px_rgba(13,148,136,0.2)] hover:-translate-y-1 hover:z-20'}`}>
                          <h3 className={`${highlightedTier === 'startup' ? 'text-xl font-black text-[#0D9488]' : 'text-lg font-black text-navy dark:text-white'} mb-2`}>نمو</h3>
                          <p className="text-xs font-bold text-slate-600 mb-5 text-center leading-relaxed">الخطوة الأولى لبناء فريق عملك بكفاءة عالية.</p>

                          <div className="flex flex-col items-center mb-5 mt-1">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">{startupPrice}</span>
                            <span className="text-xs text-gray-500 mt-1">{isYearly ? 'ريال / سنة' : 'ريال / شهر'}</span>
                          </div>

                          <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full mb-6 text-center w-fit shadow-sm">
                            {isYearly ? 'احصل على شهرين مجاناً' : 'بدون التزام (ألغِ في أي وقت)'}
                          </div>

                          <ul className={`${highlightedTier === 'startup' ? 'space-y-3' : 'space-y-2'} mb-8 w-full px-1`}>
                            {startupFeatures.map((feature: string, idx: number) => (
                              <li key={idx} className={`flex items-center gap-2 ${highlightedTier === 'startup' ? 'text-[13px] font-bold text-slate-800 dark:text-slate-100' : 'text-xs font-semibold text-slate-700 dark:text-slate-300'}`}>
                                <CheckCircle size={highlightedTier === 'startup' ? 18 : 16} className="text-[#0D9488] shrink-0" strokeWidth={highlightedTier === 'startup' ? 2.5 : 2} />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {activeTier === 'startup' && (userProfile as any).subscription_is_yearly === isYearly ? (
                            <button className="relative w-full py-3 rounded-lg text-[13px] font-bold bg-gradient-to-r from-[#0D9488] via-[#2dd4bf] to-[#0D9488] animate-gradient-move text-white border-b-[4px] border-[#096159] shadow-inner cursor-default flex flex-col justify-center items-center overflow-hidden">
                              <div className="flex items-center gap-2 relative z-10">
                                <CheckCircle size={18} className="text-white" strokeWidth={2.5} />
                                <span>باقتك الحالية</span>
                              </div>
                              {(userProfile as any).subscription_end_date && <span className="text-[10px] font-normal opacity-90 mt-1 relative z-10">صلاحية: {new Date((userProfile as any).subscription_end_date).toLocaleDateString('ar-SA')}</span>}
                            </button>
                          ) : (
                            <button onClick={() => handleSubscribe('startup')} className={`w-full rounded-lg text-xs font-bold transition-all mt-auto py-3 ${highlightedTier === 'startup' ? 'bg-gradient-to-r from-[#0D9488] via-[#2dd4bf] to-[#0D9488] animate-gradient-move bg-[length:200%_auto] text-white shadow-[0_8px_20px_-6px_rgba(13,148,136,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(13,148,136,0.6)] hover:-translate-y-0.5' : 'bg-teal-50 dark:bg-teal-900/20 text-[#0D9488] dark:text-teal-400 border border-teal-100 dark:border-teal-800/50 hover:bg-[#0D9488] hover:text-white hover:border-[#0D9488] hover:shadow-md active:scale-95'}`}>
                              اختيار الباقة
                            </button>
                          )}
                        </div>
                      )}

                      {/* أعمال (Center) */}
                      {showBusiness && (
                        <div className={`w-full rounded-2xl flex flex-col items-center transition-all duration-300 py-6 px-5 cursor-default ${highlightedTier === 'business' ? 'bg-gradient-to-b from-[#f4fcf9] to-white dark:from-teal-950/40 dark:to-slate-900 max-w-[260px] border border-[#0D9488]/40 ring-4 ring-[#0D9488]/10 shadow-[0_30px_60px_-15px_rgba(13,148,136,0.3)] md:-mt-4 relative z-10 antialiased' : 'bg-white dark:bg-slate-800 max-w-[240px] border border-[#0D9488]/30 border-b-[4px] dark:border-[#0D9488]/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-[#0D9488]/50 hover:shadow-[0_15px_40px_-10px_rgba(13,148,136,0.2)] hover:-translate-y-1 hover:z-20'}`}>
                          <h3 className={`${highlightedTier === 'business' ? 'text-xl font-black text-[#0D9488]' : 'text-lg font-black text-navy dark:text-white'} mb-2`}>أعمال</h3>
                          <p className="text-xs font-bold text-slate-600 mb-5 text-center leading-relaxed">الأكثر طلباً للشركات لتسريع وتيرة التوظيف.</p>

                          <div className="flex flex-col items-center mb-5 mt-1">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">{businessPrice}</span>
                            <span className="text-xs text-gray-500 mt-1">{isYearly ? 'ريال / سنة' : 'ريال / شهر'}</span>
                          </div>

                          <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full mb-6 text-center w-fit shadow-sm">
                            {isYearly ? 'احصل على شهرين مجاناً' : 'الخيار الأكثر طلباً'}
                          </div>

                          <ul className={`${highlightedTier === 'business' ? 'space-y-3' : 'space-y-2'} mb-8 w-full px-1`}>
                            {businessFeatures.map((feature: string, idx: number) => (
                              <li key={idx} className={`flex items-center gap-2 ${highlightedTier === 'business' ? 'text-[13px] font-bold text-slate-800 dark:text-slate-100' : 'text-xs font-semibold text-slate-700 dark:text-slate-300'}`}>
                                <CheckCircle size={highlightedTier === 'business' ? 18 : 16} className="text-[#0D9488] shrink-0" strokeWidth={highlightedTier === 'business' ? 2.5 : 2} />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {activeTier === 'business' && (userProfile as any).subscription_is_yearly === isYearly ? (
                            <button className="relative w-full py-3 rounded-lg text-[13px] font-bold bg-gradient-to-r from-[#0D9488] via-[#2dd4bf] to-[#0D9488] animate-gradient-move text-white border-b-[4px] border-[#096159] shadow-inner cursor-default flex flex-col justify-center items-center overflow-hidden">
                              <div className="flex items-center gap-2 relative z-10">
                                <CheckCircle size={18} className="text-white" strokeWidth={2.5} />
                                <span>باقتك الحالية</span>
                              </div>
                              {(userProfile as any).subscription_end_date && <span className="text-[10px] font-normal opacity-90 mt-1 relative z-10">صلاحية: {new Date((userProfile as any).subscription_end_date).toLocaleDateString('ar-SA')}</span>}
                            </button>
                          ) : (
                            <button onClick={() => handleSubscribe('business')} className={`w-full rounded-lg text-xs font-bold transition-all mt-auto py-3 ${highlightedTier === 'business' ? 'bg-gradient-to-r from-[#0D9488] via-[#2dd4bf] to-[#0D9488] animate-gradient-move bg-[length:200%_auto] text-white shadow-[0_8px_20px_-6px_rgba(13,148,136,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(13,148,136,0.6)] hover:-translate-y-0.5' : 'bg-teal-50 dark:bg-teal-900/20 text-[#0D9488] dark:text-teal-400 border border-teal-100 dark:border-teal-800/50 hover:bg-[#0D9488] hover:text-white hover:border-[#0D9488] hover:shadow-md active:scale-95'}`}>
                              اختيار الباقة
                            </button>
                          )}
                        </div>
                      )}

                      {/* احترافية (Left) */}
                      {showEnterprise && (
                        <div className={`w-full rounded-2xl flex flex-col items-center transition-all duration-300 py-6 px-5 cursor-default ${highlightedTier === 'enterprise' ? 'bg-gradient-to-b from-[#f4fcf9] to-white dark:from-teal-950/40 dark:to-slate-900 max-w-[260px] border border-[#0D9488]/40 ring-4 ring-[#0D9488]/10 shadow-[0_30px_60px_-15px_rgba(13,148,136,0.3)] md:-mt-4 relative z-10 antialiased' : 'bg-white dark:bg-slate-800 max-w-[240px] border border-[#0D9488]/30 border-b-[4px] dark:border-[#0D9488]/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-[#0D9488]/50 hover:shadow-[0_15px_40px_-10px_rgba(13,148,136,0.2)] hover:-translate-y-1 hover:z-20'}`}>
                          <h3 className={`${highlightedTier === 'enterprise' ? 'text-xl font-black text-[#0D9488]' : 'text-lg font-black text-navy dark:text-white'} mb-2`}>الشركات الكبرى</h3>
                          <p className="text-xs font-bold text-slate-600 mb-5 text-center leading-relaxed">قدرات لا محدودة للمؤسسات الكبرى والتوظيف المكثف.</p>

                          <div className="flex flex-col items-center mb-5 mt-1">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">{enterprisePrice}</span>
                            <span className="text-xs text-gray-500 mt-1">{isYearly ? 'ريال / سنة' : 'ريال / شهر'}</span>
                          </div>

                          <div className={`bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full mb-6 text-center w-fit shadow-sm ${!isYearly && 'opacity-0 select-none'}`}>
                            احصل على شهرين مجاناً
                          </div>

                          <ul className={`${highlightedTier === 'enterprise' ? 'space-y-3' : 'space-y-2'} mb-8 w-full px-1`}>
                            {enterpriseFeatures.map((feature: string, idx: number) => (
                              <li key={idx} className={`flex items-center gap-2 ${highlightedTier === 'enterprise' ? 'text-[13px] font-bold text-slate-800 dark:text-slate-100' : 'text-xs font-semibold text-slate-700 dark:text-slate-300'}`}>
                                <CheckCircle size={highlightedTier === 'enterprise' ? 18 : 16} className="text-[#0D9488] shrink-0" strokeWidth={highlightedTier === 'enterprise' ? 2.5 : 2} />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {activeTier === 'enterprise' && (userProfile as any).subscription_is_yearly === isYearly ? (
                            <button className="relative w-full py-3 rounded-lg text-[13px] font-bold bg-gradient-to-r from-[#0D9488] via-[#2dd4bf] to-[#0D9488] animate-gradient-move text-white border-b-[4px] border-[#096159] shadow-inner cursor-default flex flex-col justify-center items-center overflow-hidden">
                              <div className="flex items-center gap-2 relative z-10">
                                <CheckCircle size={18} className="text-white" strokeWidth={2.5} />
                                <span>باقتك الحالية</span>
                              </div>
                              {(userProfile as any).subscription_end_date && <span className="text-[10px] font-normal opacity-90 mt-1 relative z-10">صلاحية: {new Date((userProfile as any).subscription_end_date).toLocaleDateString('ar-SA')}</span>}
                            </button>
                          ) : (
                            <button onClick={() => handleSubscribe('enterprise')} className={`w-full rounded-lg text-xs font-bold transition-all mt-auto py-3 ${highlightedTier === 'enterprise' ? 'bg-gradient-to-r from-[#0D9488] via-[#2dd4bf] to-[#0D9488] animate-gradient-move bg-[length:200%_auto] text-white shadow-[0_8px_20px_-6px_rgba(13,148,136,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(13,148,136,0.6)] hover:-translate-y-0.5' : 'bg-teal-50 dark:bg-teal-900/20 text-[#0D9488] dark:text-teal-400 border border-teal-100 dark:border-teal-800/50 hover:bg-[#0D9488] hover:text-white hover:border-[#0D9488] hover:shadow-md active:scale-95'}`}>
                              اختيار الباقة
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })()}

                {billingCycle === 'one-time' && (
                  <div className="flex justify-center w-full mt-2">
                    {/* التوظيف الفوري */}
                    <div className={`w-full rounded-2xl flex flex-col items-center transition-all duration-300 py-6 px-6 max-w-[260px] cursor-default ${hasActiveAd ? 'bg-gradient-to-b from-[#f4fcf9] to-white dark:from-teal-950/40 dark:to-slate-900 border border-[#0D9488]/40 ring-4 ring-[#0D9488]/10 shadow-[0_30px_60px_-15px_rgba(13,148,136,0.3)] md:-mt-2 relative z-10 antialiased' : 'bg-white dark:bg-slate-800 border border-[#0D9488]/30 border-b-[4px] dark:border-[#0D9488]/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-[#0D9488]/50 hover:shadow-[0_15px_40px_-10px_rgba(13,148,136,0.2)] hover:-translate-y-1'}`}>
                      <h3 className="text-xl font-black text-navy dark:text-white mb-2">التوظيف الفوري</h3>
                      <p className="text-xs font-bold text-slate-600 mb-4 text-center leading-relaxed">حل سريع وفعّال لاستقطاب كفاءة لمنصب واحد.</p>

                      <div className="flex items-end justify-center gap-1.5 mb-4 mt-1">
                        <span className="text-4xl font-black text-gray-900 dark:text-white leading-none">199</span>
                        <span className="text-xs font-bold text-slate-500 mb-1">ريال / إعلان</span>
                      </div>

                      <div className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-full mb-6 text-center w-fit shadow-sm">
                        دفع لمرة واحدة
                      </div>

                      <ul className="space-y-2 mb-6 w-full px-1">
                        {[
                          "إعلان وظيفي لمدة 45 يوم", "500 سيرة ذاتية للفرز", "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين"
                        ].map((feature, idx) => (
                          <li key={idx} className={`flex items-center gap-2 ${hasActiveAd ? 'text-[13px] font-bold text-slate-800 dark:text-slate-100' : 'text-[13px] font-semibold text-slate-700 dark:text-slate-300'}`}>
                            <CheckCircle size={hasActiveAd ? 18 : 16} className="text-[#0D9488] shrink-0" strokeWidth={hasActiveAd ? 2.5 : 2} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {hasActiveAd ? (
                        <button className="relative w-full py-3 rounded-lg text-[13px] font-bold bg-gradient-to-r from-[#0D9488] via-[#2dd4bf] to-[#0D9488] animate-gradient-move text-white border-b-[4px] border-[#096159] shadow-inner cursor-default mt-auto flex flex-col justify-center items-center overflow-hidden">
                          <div className="flex items-center gap-2 relative z-10">
                            <CheckCircle size={16} className="text-white" strokeWidth={2.5} />
                            <span>الإعلان الفعال</span>
                          </div>
                          {(userProfile as any).subscription_end_date && <span className="text-[10px] font-normal opacity-90 mt-1 relative z-10">صلاحية: {new Date((userProfile as any).subscription_end_date).toLocaleDateString('ar-SA')}</span>}
                        </button>
                      ) : (
                        <button onClick={handleBuyAd} className="w-full py-3 rounded-lg text-xs font-bold transition-all mt-auto bg-teal-50 dark:bg-teal-900/20 text-[#0D9488] dark:text-teal-400 border border-teal-100 dark:border-teal-800/50 hover:bg-[#0D9488] hover:text-white hover:border-[#0D9488] hover:shadow-md active:scale-95">
                          شراء إعلان
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
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

      {showPaymentModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 lg:p-10">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-full lg:h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-lg md:text-xl text-navy dark:text-white flex items-center gap-2">
                <Lock size={20} className="text-emerald-500" /> نافذة الدفع الآمن
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 w-full relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
              {paymentHtml ? (
                <iframe
                  srcDoc={paymentHtml}
                  className="w-full h-full border-none absolute inset-0"
                  title="بوابة الدفع"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 font-bold">
                  جاري التحميل...
                </div>
              )}
            </div>

            <div className="p-5 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                تتم عملية الدفع عبر خوادم Neoleap المشفرة والآمنة
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-6 py-3.5 font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex-1 sm:flex-none text-center"
                >
                  إلغاء العملية
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 flex-1 sm:flex-none"
                >
                  <CheckCircle size={18} /> تأكيد إتمام الدفع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export const ActiveJobs = ({
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
    navigator.clipboard.writeText(`${window.location.origin}/apply/${job.id}`);
    setCopiedId(job.id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  const getJobIcon = (title?: string | null) => {
    if (!title) return <Briefcase size={24} />;
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {" "}
        {jobs.map((job) => {
          const expired = isJobExpired(job);
          return (
            <motion.div
              key={job.id}
              style={{ zIndex: openDropdownId === job.id ? 20 : 1 }}
              whileHover={{ y: -5 }}
              onClick={() => job.status === "مسودة" ? onClone(job) : onManage(job)}
              className={`bg-white relative cursor-pointer dark:bg-slate-800 p-6 rounded-[24px] border border-white dark:border-slate-700 shadow-lg group flex flex-col transition-all shadow-slate-200/40 ${expired ? 'opacity-80 grayscale-[25%]' : ''
                }`}
            >
              {" "}
              <div className="flex items-start justify-between mb-5 gap-2">
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner-3d`}
                  >
                    {getJobIcon(job.title || job.campaignTitle)}
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={`text-lg font-bold mb-1 text-navy dark:text-white truncate`}
                      title={job.title || job.campaignTitle || "عنوان غير محدد"}
                    >
                      {job.title || job.campaignTitle || "عنوان غير محدد"}
                    </h3>
                    <p className={`text-sm font-medium text-slate-500 dark:text-slate-400 truncate`} title={job.company || "جهة غير محددة"}>
                      {job.company || "جهة غير محددة"}
                    </p>
                  </div>
                </div>
                <div
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${expired ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}
                >
                  {expired ? "منتهي/مغلق" : job.status}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 group flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-center text-primary transition-colors duration-300">
                      <Users size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">
                        المتقدمين
                      </p>
                      <p className="text-lg font-bold text-navy dark:text-white leading-none">
                        {job.applicants}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 group flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-center text-primary transition-colors duration-300">
                      <Briefcase size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">
                        نوع العمل
                      </p>
                      <p className="text-sm font-bold text-navy dark:text-white leading-none mt-1">
                        {job.type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50 mt-auto">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      job.status === "مسودة" ? onClone(job) : onManage(job);
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.95] bg-navy text-white shadow-lg shadow-navy/10`}
                  >
                    {" "}
                    {job.status === "مسودة" ? "إكمال المسودة" : "إدارة الوظيفة"}{" "}
                  </button>{" "}
                  <div className="relative">
                    {" "}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(
                          openDropdownId === job.id ? null : job.id,
                        );
                      }}
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
  decision?: "accepted" | "rejected" | "pending" | "interview" | "filtered";
  nominatedTo?: string;
  is_interview_completed?: boolean;
  interview_transcript?: string;
  interview_summary?: string;
  interview_score?: number;
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

export const FastScreening = () => {
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
