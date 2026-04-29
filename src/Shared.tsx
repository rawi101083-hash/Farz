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
    className="flex flex-col items-center justify-center py-24 px-8 text-center bg-white dark:bg-slate-800 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-700 shadow-sm"
  >
    <div className="relative mb-10">
      <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center relative z-10">
        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[32px] shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-300">
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
      {title}{" "}
    </h3>{" "}
    <button
      onClick={onAction}
      className="bg-mint dark:bg-[#065f46] text-employer-green dark:text-[#a7f3d0] px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#34d399] transition-all shadow-xl shadow-mint/20 active:scale-95 flex items-center gap-3 mt-4"
    >
      {actionLabel} <Plus size={20} />{" "}
    </button>{" "}
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
    <div className="fixed inset-0 z-[100] bg-slate-100 dark:bg-slate-900 flex flex-col">
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
        className="pr-12 pl-10 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer flex items-center justify-between hover:border-primary/50 transition-all min-w-[160px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-navy dark:text-white truncate max-w-[120px]">
          {selectedFilter === "all" ? "المهارة" : selectedFilter}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
      
    return matchesJob && matchesSkill && matchesSearch;
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-600 dark:text-teal-400 drop-shadow-[0_0_5px_rgba(13,148,136,0.3)] group-hover:scale-110 transition-transform pointer-events-none"
                size={18}
              />{" "}
              <select className="pr-12 pl-10 py-4 bg-teal-50/50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none cursor-pointer font-bold min-w-[160px] text-teal-800 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-teal-900/40">
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
          <div className="col-span-full py-20 text-center bg-white dark:bg-slate-800 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
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
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl cursor-pointer flex items-center justify-between hover:border-primary/50 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="font-bold text-sm text-navy dark:text-white truncate">
                {selectedFilter === "all" ? "كل الوظائف" : (selectedJob?.title || "كل الوظائف")}
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
  const mediumQualityCount = relevantApplicants.filter(a => { const r = a.rating || a.match_percentage || 0; return r >= 50 && r < 80; }).length;
  const lowQualityCount = relevantApplicants.filter(a => { const r = a.rating || a.match_percentage || 0; return r < 50; }).length;

  const qualityIndexData = [
    { name: "كفاءة عالية (80%+)", value: highQualityCount, fill: "#22c55e", stroke: "#166534" },
    { name: "متوسطة (50-79%)", value: mediumQualityCount, fill: "#eab308", stroke: "#854d0e" },
    { name: "ضعيفة (<50%)", value: lowQualityCount, fill: "#ef4444", stroke: "#991b1b" }
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

  const COLORS = ["#3b82f6", "#f97316", "#8b5cf6", "#0d9488"]; // Blue, Orange, Purple, Teal (App Green)
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
            color: "text-teal-600",
            bg: "bg-teal-50",
            subtitle: totalApplicants > 0 ? (
              <span className="flex items-center gap-1.5 justify-center">
                <Sparkles size={14} className="text-emerald-500 fill-emerald-500" />
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
            <h3 className="text-3xl font-bold text-navy dark:text-white">
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
                  stroke="none"
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
                <defs>
                  <linearGradient id="pipelineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={1} />
                  </linearGradient>
                  <filter id="barShadowPipeline" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0d9488" floodOpacity="0.3" />
                  </filter>
                </defs>
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
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 min-w-[140px] text-right" dir="rtl">
                          <p className="font-bold text-slate-500 dark:text-slate-400 mb-2 text-xs">{label}</p>
                          <p className="text-teal-600 dark:text-teal-400 font-black text-sm flex items-center gap-1">{payload[0].value} متقدماً</p>
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
                  fill="url(#pipelineGrad)" 
                  radius={12} 
                  barSize={30} 
                  filter="url(#barShadowPipeline)" 
                >
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
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={1} />
                  </linearGradient>
                  <filter id="emeraldShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10b981" floodOpacity="0.3" />
                  </filter>

                  <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={1} />
                  </linearGradient>
                  <filter id="amberShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.3" />
                  </filter>

                  <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb7185" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={1} />
                  </linearGradient>
                  <filter id="roseShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#f43f5e" floodOpacity="0.3" />
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
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 min-w-[140px] text-right" dir="rtl">
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
                  background={{ fill: '#f8fafc', radius: 12 }}
                >
                  {qualityIndexData.map((entry, index) => {
                    let fillId = "url(#emeraldGrad)";
                    let filterId = "url(#emeraldShadow)";
                    if (entry.name.includes("متوسطة")) {
                       fillId = "url(#amberGrad)";
                       filterId = "url(#amberShadow)";
                    } else if (entry.name.includes("ضعيفة")) {
                       fillId = "url(#roseGrad)";
                       filterId = "url(#roseShadow)";
                    }
                    return <Cell key={"cell-" + index} fill={fillId} filter={filterId} />;
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
  setUserProfile
}: {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userProfile: any;
  setUserProfile: any;
}) => {
  const [activeTab, setActiveTab] = useState("الملف الشخصي");
  const [isYearly, setIsYearly] = useState(false);
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
          {["الملف الشخصي", "ملف الشركة", "باقات فرز", "المظهر"].map((tab) => (
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
                      setUserProfile({ ...userProfile, avatar: URL.createObjectURL(e.target.files[0]) });
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
                  <input type="text" value={userProfile.name} onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-navy dark:text-slate-300">المسمى الوظيفي</label>
                  <input type="text" value={userProfile.title} onChange={(e) => setUserProfile({ ...userProfile, title: e.target.value })} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-white border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" />
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
                    <button type="button" onClick={() => setUserProfile({ ...userProfile, entityType: "company" })} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${userProfile.entityType === "company" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>جهة اعتبارية (شركة/مؤسسة)</button>
                    <button type="button" onClick={() => setUserProfile({ ...userProfile, entityType: "freelance" })} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${userProfile.entityType === "freelance" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>فرد مستقل (عمل حر)</button>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-navy dark:text-slate-300">
                    {userProfile.entityType === "company" ? "اسم المنشأة" : "الاسم الثلاثي المعتمد"}
                  </label>
                  <input
                    type="text"
                    value={userProfile.companyName || ""}
                    onChange={(e) => setUserProfile({ ...userProfile, companyName: e.target.value })}
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
                      onChange={(e) => setUserProfile({ ...userProfile, commercialRegistration: e.target.value })}
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
                      onChange={(e) => setUserProfile({ ...userProfile, freelanceDocument: e.target.value })}
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
                    onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
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
                    onChange={(e) => setUserProfile({ ...userProfile, taxNumber: e.target.value })}
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
          {activeTab === "باقات فرز" && (
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-black text-navy dark:text-white">باقات الاشتراك</h2>
                <p className="text-slate-500 font-medium">اختر الباقة التي تناسب حجم أعمالك واحتياجك الوظيفي</p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <span className={`text-sm font-bold ${!isYearly ? "text-primary" : "text-slate-400"}`}>شهري</span>
                  <button 
                    onClick={() => setIsYearly(!isYearly)}
                    className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors"
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-primary transition-all ${isYearly ? "left-1" : "right-1"}`} />
                  </button>
                  <span className={`text-sm font-bold ${isYearly ? "text-primary" : "text-slate-400"}`}>سنوي <span className="text-emerald-500 text-xs ml-1">(وفر قيمة شهرين)</span></span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-6 items-center">
                {/* 1. انطلاق */}
                <div className="w-full max-w-[340px] bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20">
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-2">انطلاق</h3>
                  <p className="text-sm text-slate-500 mb-6">للشركات الناشئة والصغيرة</p>
                  <div className="mb-6">
                    <span className="text-4xl font-black text-navy dark:text-white">{isYearly ? "4,990" : "499"}</span>
                    <span className="text-slate-400 font-bold ml-1">ريال / {isYearly ? "سنوياً" : "شهرياً"}</span>
                  </div>
                  {isYearly && <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-lg w-fit mb-6">وفر قيمة شهرين!</div>}
                  <ul className="space-y-4 mb-8">
                    {[
                      "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين", "نشر وظيفتين نشطة", "فرز 500 سيرة ذاتية"
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shrink-0"><CheckCircle size={12} /></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 rounded-2xl font-bold bg-slate-50 text-navy hover:bg-slate-100 transition-colors border border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    {userProfile?.subscription_tier === 'startup' ? 'باقتك الحالية' : 'اشترك الآن'}
                  </button>
                </div>

                {/* 2. أعمال */}
                <div className="w-full max-w-[360px] bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-primary shadow-2xl shadow-primary/20 relative transform md:-translate-y-4">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">الأكثر شيوعاً</div>
                  <h3 className="text-2xl font-black text-navy dark:text-white mb-2">أعمال</h3>
                  <p className="text-sm text-slate-500 mb-6">للشركات المتوسطة والمتنامية</p>
                  <div className="mb-6">
                    <span className="text-5xl font-black text-primary">{isYearly ? "14,990" : "1,499"}</span>
                    <span className="text-slate-400 font-bold ml-1">ريال / {isYearly ? "سنوياً" : "شهرياً"}</span>
                  </div>
                  {isYearly && <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-lg w-fit mb-6">وفر 2,990 ريال!</div>}
                  <ul className="space-y-4 mb-8">
                    {[
                      "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين", "نشر 10 وظائف نشطة", "فرز 5,000 سيرة ذاتية", "تصدير البيانات", "دعم فني أولوية"
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><CheckCircle size={12} /></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 rounded-2xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    {userProfile?.subscription_tier === 'business' ? 'باقتك الحالية' : 'اشترك الآن'}
                  </button>
                </div>

                {/* 3. شركات كبرى */}
                <div className="w-full max-w-[340px] bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20">
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-2">احترافية</h3>
                  <p className="text-sm text-slate-500 mb-6">للمنظمات ذات التوظيف الكثيف</p>
                  <div className="mb-6">
                    <span className="text-4xl font-black text-navy dark:text-white">{isYearly ? "34,990" : "3,499"}</span>
                    <span className="text-slate-400 font-bold ml-1">ريال / {isYearly ? "سنوياً" : "شهرياً"}</span>
                  </div>
                  {isYearly && <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-lg w-fit mb-6">وفر قيمة شهرين!</div>}
                  <ul className="space-y-4 mb-8">
                    {[
                      "لوحة تحكم متكاملة", "تقارير فرز دقيقة", "أرشفة بيانات المتقدمين", "نشر وظائف غير محدود", "فرز سير ذاتية غير محدود", "واجهة برمجة تطبيقات API", "مدير حساب مخصص"
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shrink-0"><CheckCircle size={12} /></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 rounded-2xl font-bold bg-slate-50 text-navy hover:bg-slate-100 transition-colors border border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    {userProfile?.subscription_tier === 'enterprise' ? 'باقتك الحالية' : 'تواصل معنا'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center py-6">
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-1/4"></div>
                <span className="px-4 text-slate-400 text-sm font-bold">أو</span>
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-1/4"></div>
              </div>

              {/* One-Time Plan Banner */}
              <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-navy text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden mb-12">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="z-10 relative">
                  <div className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold w-fit mb-3 border border-white/20">الدفع لمرة واحدة</div>
                  <h3 className="text-2xl font-black mb-2">باقة الإعلان الواحد</h3>
                  <p className="text-slate-300 text-sm max-w-sm">مثالية إذا كان لديك احتياج فوري لتوظيف منصب واحد ولا ترغب بالالتزام باشتراك شهري. تتضمن فرز 50 سيرة ذاتية.</p>
                </div>
                <div className="flex flex-col items-center md:items-end z-10 relative shrink-0">
                  <div className="mb-4 text-center md:text-right">
                    <span className="text-4xl font-black">199</span>
                    <span className="text-slate-300 font-bold ml-1">ريال / للإعلان</span>
                  </div>
                  <button className="px-8 py-3 rounded-2xl font-bold bg-white text-navy hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" /> شراء الإعلان
                  </button>
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
