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
  | "manageJob";
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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-8 text-center bg-white dark:bg-slate-800 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700 shadow-sm"
  >
    <div className="mb-6 flex justify-center">
      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center ring-4 ring-slate-50 dark:ring-slate-800/30">
        <Search size={28} strokeWidth={1.5} />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-navy dark:text-white mb-4 max-w-md leading-relaxed text-center">
      {title}
    </h3>
    <button
      onClick={onAction}
      className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-3 mt-4"
    >
      {actionLabel} <Plus size={20} />
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
  const avgTime = validJobsCount > 0 ? Math.round(totalDays / validJobsCount) : 0;

  const glassStyleStr = { backgroundColor: "rgba(25, 168, 145, 0.40)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(25, 168, 145, 0.60)" };

  const COLORS = ["rgba(25, 168, 145, 0.40)", "rgba(25, 168, 145, 0.40)", "rgba(25, 168, 145, 0.40)", "rgba(25, 168, 145, 0.40)"];
  return (
    <div className="space-y-6 pb-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-3 text-navy dark:text-white">
          التقارير والتحليلات
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
            icon: <Users size={20} />,
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
            icon: <Briefcase size={20} />,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "متوسط وقت التوظيف",
            value: `${avgTime} يوم`,
            icon: <Clock size={20} />,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-white dark:border-slate-700 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center"
          >
            <div
              className={`w-12 h-12 ${metric.bg} ${metric.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner-3d`}
            >
              {metric.icon}{" "}
            </div>{" "}
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mb-2">
              {metric.label}
            </p>{" "}
            <h3 className="text-3xl font-black text-navy dark:text-white">
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
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceOfHireData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="rgba(25, 168, 145, 0.60)"
                  strokeWidth={1}
                >
                  {sourceOfHireData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}{" "}
                </Pie>{" "}
                <Tooltip
                  cursor={{ fill: 'transparent' }}
}} /></PieChart></ResponsiveContainer></div></div></div></div>);
};