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
  ChevronDown, ChevronLeft, ChevronRight,
  Brain,
  Mic,
  Square,
  RotateCcw,
  CheckSquare,
  Pencil,
  AlertTriangle,
  Linkedin,
  Rocket,
  Headset,
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
import * as pdfjsLib from "pdfjs-dist";
import { supabase } from "../lib/supabaseClient";
import React, { useState, useEffect, useRef, Component, ErrorInfo, ReactNode, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import skillsDictionaryRaw from "../skillsDictionary.json";
import { FEATURE_FLAGS } from "../config";

import { MOCK_TEST_APPLICANTS } from "../mockData";
import { ActiveJobs, Reports, EmptyState, TalentPool, GlobalJobSelector, SettingsPage, Job, Applicant, ImageLightbox, LogoIcon } from '../Shared';
import { globalApplicantsCache } from "../lib/applicantsCache";
import BulkSendTemplatesModal from './BulkSendTemplatesModal';
import QuestionTemplatesManager from './QuestionTemplatesManager';

const CompactJobSelector = ({
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
    .filter((j) => {
      if (!search) return true;
      const term = search.toLowerCase();
      const titleMatch = (j.title || "").toLowerCase().includes(term);
      const companyMatch = (j.company || "").toLowerCase().includes(term);
      const numberMatch = j.job_number ? String(j.job_number).includes(term) : false;
      return titleMatch || companyMatch || numberMatch;
    })
    .slice(0, 50);

  const selectedJob = jobs.find((j) => j.id === selectedFilter);

  const formatJobLabel = (job: Job) => {
    const date = new Date(job.createdAt || Date.now());
    const dateStr = `${date.getMonth() + 1}/${date.getFullYear()}`;
    return (
      <div className="flex items-center justify-between w-full text-right gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-bold text-navy dark:text-white truncate max-w-[150px]" title={job.title || "إعلان وظائف"}>
            {job.title || "إعلان وظائف"}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            <span>{dateStr}</span>
            {job.job_number && (
              <>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="shrink-0 text-slate-400 dark:text-slate-500">رقم: {job.job_number}</span>
              </>
            )}
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${job.status === "نشط" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : job.status === "مغلق مؤقتاً" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"}`}>
          {job.status}
        </span>
      </div>
    );
  };

  return (
    <div className="relative z-[60]" ref={ref}>
      <div
        className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-[2px] border-slate-200 border-b-[4px] border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900 px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-[2px] active:mb-[2px] transition-all shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] h-[42px] min-w-[200px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-sm text-navy dark:text-white truncate">
          {selectedFilter === "all"
            ? "تصفية حسب الوظيفة: الكل"
            : `${selectedJob?.title || "كل الوظائف"}${selectedJob?.job_number ? ` (${selectedJob.job_number})` : ""}`}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 left-0 right-0 min-w-[300px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden"
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
            <div className="max-h-64 overflow-y-auto p-2 hide-scrollbar">
              <div
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all border-[2px] border-b-[4px] mb-2 active:translate-y-[2px] active:border-b-[2px] active:mb-[4px] hover:-translate-y-0.5 ${selectedFilter === "all" ? "bg-gradient-to-b from-primary/10 to-primary/20 text-primary font-bold border-primary/30 border-b-primary/40 shadow-[0_4px_10px_rgba(13,148,136,0.15)]" : "bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900 shadow-sm"}`}
                onClick={() => { onFilterChange("all"); setIsOpen(false); setSearch(""); }}
              >
                <div className="w-4 shrink-0">
                  {selectedFilter === "all" && <CheckCircle size={14} />}
                </div>
                <span className="text-sm font-bold">تصفية حسب الوظيفة: الكل</span>
              </div>
              {filteredJobs.map(job => (
                <div
                  key={job.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-[2px] border-b-[4px] mb-2 active:translate-y-[2px] active:border-b-[2px] active:mb-[4px] hover:-translate-y-0.5 ${selectedFilter === job.id ? "bg-gradient-to-b from-primary/5 to-primary/15 dark:from-primary/10 dark:to-primary/20 border-primary/30 border-b-primary/40 shadow-[0_4px_10px_rgba(13,148,136,0.15)]" : "bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900 shadow-sm"}`}
                  onClick={() => { onFilterChange(job.id); setIsOpen(false); setSearch(""); }}
                >
                  <div className="w-4 shrink-0">
                    {selectedFilter === job.id && <CheckCircle size={14} className="text-primary" />}
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
  );
};



export const Dashboard = ({
  onViewDetails,
  onCreateJob,
  onManageJob,
  onCloneJob,
  onDeactivateJob,
  onReactivateJob,
  onPreviewJob,
  jobs,
  isLoadingJobs = false,
  shortlistedIds,
  onToggleShortlist,
  darkMode,
  setDarkMode,
  userProfile,
  setUserProfile,
  userEmail,
  activeTab,
  setActiveTab,
  onShowOnboarding,
  talentPool,
  setTalentPool,
  onDeleteJob,
  onDeleteAllDrafts,
  pendingAction,
  clearPendingAction,
}: {
  onViewDetails: (app: Applicant) => void;
  onCreateJob: () => void;
  onManageJob: (job: Job, roleId?: string) => void;
  onCloneJob: (job: Job) => void;
  onDeactivateJob: (job: Job) => void;
  onReactivateJob?: (job: Job) => void;
  onPreviewJob: (job: Job) => void;
  jobs: Job[];
  isLoadingJobs?: boolean;
  shortlistedIds: string[];
  onToggleShortlist: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userProfile: any;
  setUserProfile: any;
  userEmail?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onShowOnboarding: () => void;
  talentPool?: Applicant[];
  setTalentPool: React.Dispatch<React.SetStateAction<Applicant[]>>;
  onDeleteJob?: (id: string) => void;
  onDeleteAllDrafts?: () => void;
  pendingAction?: { id: string; decision: string; isOffer?: boolean } | null;
  clearPendingAction?: () => void;
}) => {
  const handleLogout = () => {
    // 1. Instantly clear Supabase local auth tokens
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        localStorage.removeItem(key);
      }
    });
    // 2. Clear our local state
    sessionStorage.removeItem("sahab_active_step");
    localStorage.removeItem("sahab_jobs_db_v1");
    // 3. Sign out in background
    supabase.auth.signOut().catch(() => {});
    // 4. Instantly flip UI
    window.dispatchEvent(new Event('sahab_logout_immediate'));
  };

  const [isPending, startTransition] = useTransition();
  const pendingPoolUpdates = useRef(new Map<string, boolean>());
  const markInterviewSent = async (id: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, interview_sent: true } : a));
    const { error } = await supabase.from('applicants').update({ interview_sent: true }).eq('id', id);
    if (error) {
      console.warn("Could not sync interview_sent to backend:", error);
    }
  };

  const isInitialJobLoad = useRef(true);
  // Compute Limits
  const activeCount = jobs.filter(j => j.status === 'نشط').reduce((acc, j) => acc + (j.recordType === 'campaign' && j.roles ? j.roles.length : 1), 0);
  let rawPlan = userProfile?.subscription_tier || 'free';
  let plan = rawPlan;
  if (rawPlan.includes('startup') || rawPlan.includes('growth')) plan = 'startup';
  else if (rawPlan.includes('business')) plan = 'business';
  else if (rawPlan.includes('enterprise')) plan = 'enterprise';
  else if (rawPlan.includes('single_job') || rawPlan.includes('one-time')) plan = 'single_job';

  let daysLeft: number | null = null;
  if (userProfile?.subscription_end_date) {
    const end = new Date(userProfile.subscription_end_date);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [supportStatus, setSupportStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [supportFile, setSupportFile] = useState<File | null>(null);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportStatus("sending");

    try {
      const form = document.createElement('form');
      form.action = "https://formsubmit.co/farz101083@gmail.com";
      form.method = "POST";
      form.enctype = "multipart/form-data";
      form.target = "hidden_iframe";
      form.style.display = 'none';

      const inputs = [
        { name: "_subject", value: "رسالة دعم فني جديدة من منصة فرز" },
        { name: "email", value: userProfile?.email || userEmail || "غير محدد" },
        { name: "اسم المستخدم / الشركة", value: userProfile?.company_name || userProfile?.name || "غير محدد" },
        { name: "البريد الإلكتروني للعميل", value: userProfile?.email || userEmail || "غير محدد" },
        { name: "نص المشكلة", value: supportMessage },
        { name: "_captcha", value: "false" },
      ];

      inputs.forEach(inputData => {
        const input = document.createElement('input');
        input.type = "hidden";
        input.name = inputData.name;
        input.value = inputData.value;
        form.appendChild(input);
      });

      if (supportFile) {
        const fileInput = document.createElement('input');
        fileInput.type = "file";
        fileInput.name = "attachment";
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(supportFile);
        fileInput.files = dataTransfer.files;
        form.appendChild(fileInput);
      }

      let iframe = document.getElementById("hidden_iframe") as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.name = "hidden_iframe";
        iframe.id = "hidden_iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
      }

      document.body.appendChild(form);
      form.submit();

      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      }, 2000);

      setSupportStatus("success");
      setTimeout(() => {
        setIsSupportModalOpen(false);
        setSupportMessage("");
        setSupportFile(null);
        setSupportStatus("idle");
      }, 3000);
    } catch (error) {
      console.error(error);
      setSupportStatus("success");
      setTimeout(() => { setIsSupportModalOpen(false); setSupportMessage(""); setSupportFile(null); setSupportStatus("idle"); }, 3000);
    }
  };

  const [isYearlyDev, setIsYearlyDev] = useState(false);
  const isYearly = import.meta.env.DEV ? isYearlyDev : (userProfile?.is_yearly || false);

  let jobLimit = userProfile?.jobs_limit ?? 0;
  let cvLimit = userProfile?.cv_limit ?? 0;
  let interviewsLimit = userProfile?.interviews_limit ?? 0;

  const hasSubscribedBefore = !!(userProfile as any)?.subscription_end_date;
  const isExpired = daysLeft !== null && daysLeft <= 0;

  // Force override to 0 if they are on a free plan but have subscribed before and the trial has expired
  if (plan === 'free' && hasSubscribedBefore && isExpired) {
    jobLimit = 0;
    cvLimit = 0;
    interviewsLimit = 0;
  } else {
    if (!jobLimit) {
      if (plan === 'free') jobLimit = 1;
      else if (plan === 'one-time' || plan === 'single_job') jobLimit = 1;
      else if (plan === 'startup' || plan === 'growth') jobLimit = 3;
      else if (plan === 'business') jobLimit = 10;
      else if (plan === 'enterprise') jobLimit = 100;
    }
    if (!cvLimit) {
      if (plan === 'free') cvLimit = 50;
      else if (plan === 'one-time' || plan === 'single_job') cvLimit = 500;
      else if (plan === 'startup' || plan === 'growth') cvLimit = isYearly ? 12000 : 1000;
      else if (plan === 'business') cvLimit = isYearly ? 60000 : 5000;
      else if (plan === 'enterprise') cvLimit = isYearly ? 180000 : 15000;
    }
    if (!interviewsLimit) {
      if (plan === 'free') interviewsLimit = 1;
      else if (plan === 'one-time' || plan === 'single_job') interviewsLimit = 1;
      else if (plan === 'startup' || plan === 'growth') interviewsLimit = 100;
      else if (plan === 'business') interviewsLimit = 500;
      else if (plan === 'enterprise') interviewsLimit = 1500;
    }
  }
  const cvsUsed = userProfile?.used_cvs || 0;
  const extraCvs = userProfile?.extra_cv_credits || 0;
  let cvsRemaining = Math.max(0, cvLimit - cvsUsed) + extraCvs;
  const cvPercent = cvLimit > 0 ? (cvsRemaining / cvLimit) * 100 : 100;
  let cvColor = 'bg-primary';
  if (cvPercent < 20) cvColor = 'bg-red-500';
  else if (cvPercent <= 50) cvColor = 'bg-amber-500';

  const interviewsUsed = userProfile?.used_interviews || 0;
  let interviewsRemaining = Math.max(0, interviewsLimit - interviewsUsed);
  const interviewPercent = interviewsLimit > 0 ? (interviewsRemaining / interviewsLimit) * 100 : 100;
  let interviewColor = 'bg-primary';
  if (interviewPercent < 20) interviewColor = 'bg-red-500';
  else if (interviewPercent <= 50) interviewColor = 'bg-amber-500';
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [applicantSearchQuery, setApplicantSearchQuery] = useState("");
  const [jobFilter, setJobFilter] = useState(() => {
    try {
      return window.localStorage.getItem("sahab_dashboard_jobFilter") || "all";
    } catch {
      return "all";
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("sahab_dashboard_jobFilter", jobFilter);
    } catch { }
  }, [jobFilter]);
  const [decisionFilter, setDecisionFilter] = useState<"pending" | "interview" | "accepted" | "rejected" | "filtered" | "locked_fomo">(() => {
    try {
      return (sessionStorage.getItem("sahab_decision_filter") as any) || "pending";
    } catch {
      return "pending";
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem("sahab_decision_filter", decisionFilter);
    } catch { }
  }, [decisionFilter]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [crossNominateApplicant, setCrossNominateApplicant] = useState<Applicant | null>(null);
  const [crossNominateJobId, setCrossNominateJobId] = useState<string>("");
  const [addonsBoughtThisMonth, setAddonsBoughtThisMonth] = useState(() => {
    try {
      return parseInt(window.localStorage.getItem("addons_bought_this_month") || "0");
    } catch {
      return 0;
    }
  });
  const [showSoftUpgradeModal, setShowSoftUpgradeModal] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [isSmartSortOpen, setIsSmartSortOpen] = useState(false);
  const [smartSortState, setSmartSortState] = useState<"all" | "elite" | "latest" | "weak">(
    (localStorage.getItem("sahab_smart_sort") as any) || "all"
  );

  useEffect(() => {
    localStorage.setItem("sahab_smart_sort", smartSortState);
  }, [smartSortState]);


  const smartSortRef = useRef<HTMLDivElement>(null);
  const [subTab, setSubTab] = useState<"active" | "inactive" | "drafts" | "paused">("active");

  useEffect(() => {
    if (activeTab === "إدارة الوظائف") {
      setSubTab("active");
    }
  }, [activeTab]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('isSidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('isSidebarOpen', isSidebarOpen.toString());
  }, [isSidebarOpen]);

  const [displayCount, setDisplayCount] = useState(50);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 800) {
        setDisplayCount(prev => prev + 50);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [applicants, setApplicantsState] = useState<Applicant[]>(() => {
    try {
      const saved = localStorage.getItem("sahab_applicants_fast_cache");
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return [];
  });
  const [isLoadingApplicants, setIsLoadingApplicants] = useState<boolean>(true);

  // Load from IndexedDB instantly on mount
  useEffect(() => {
    import('../lib/applicantsCache').then(({ loadFromIDB }) => {
      loadFromIDB("cache_v1").then((cachedData) => {
        if (cachedData && Array.isArray(cachedData.applicants)) {
          setApplicantsState(prev => prev.length === 0 ? cachedData.applicants : prev);
          if (cachedData.applicants.length > 0) {
            setIsLoadingApplicants(false);
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!isLoadingApplicants) {
      const scrollY = sessionStorage.getItem('dashboardScroll');
      if (scrollY) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: parseInt(scrollY), behavior: 'instant' });
          sessionStorage.removeItem('dashboardScroll');
        });
      }
    }
  }, [isLoadingApplicants]);

  const setApplicants = (updater: any) => {
    setApplicantsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      setIsLoadingApplicants(true);
      try {
        const jobIds = jobs.map(j => j.id);
        if (jobIds.length === 0) {
          // If network dropped, jobs might be momentarily empty. Fallback to cache if available.
          if (globalApplicantsCache && globalApplicantsCache.length > 0) {
            setApplicantsState(globalApplicantsCache);
          } else {
            setApplicantsState([]);
          }
          setIsLoadingApplicants(false);
          return;
        }
        isInitialJobLoad.current = false;

        let mappedList: Applicant[] = [];
        const { data, error } = await supabase
          .from('applicants')
          .select('*')
          .in('job_id', jobIds)
          .order('created_at', { ascending: false });

        const latestDecisions = window.localStorage ? JSON.parse(window.localStorage.getItem("sahab_decisions") || "{}") : {};

        if (!error && data) {
          const filteredData = data.filter((raw: any) =>
            raw.decision !== 'CORRUPT_FILE_DO_NOT_SHOW' &&
            raw.decision !== 'processing' &&
            raw.decision !== 'failed'
          );

          mappedList = filteredData.map((raw: any) => {
            let actualJobTitle = "طلب غير محدد";
            const matchedJob = jobs.find(j => j.id === raw.job_id);
            let actualAskExpectedSalary = matchedJob?.askExpectedSalary;
            if (matchedJob) {
              if (matchedJob.recordType === 'campaign' && raw.job_context?.jobTitle) {
                actualJobTitle = raw.job_context.jobTitle;
                const matchedRole = matchedJob.roles?.find((r: any) => r.title === raw.job_context.jobTitle);
                actualAskExpectedSalary = matchedRole?.askExpectedSalary || matchedJob.askExpectedSalary;
              } else if (matchedJob.recordType === 'campaign' && raw.role_index !== undefined) {
                actualJobTitle = matchedJob.roles?.[raw.role_index]?.title || matchedJob.title || "طلب غير محدد";
                actualAskExpectedSalary = matchedJob.roles?.[raw.role_index]?.askExpectedSalary || matchedJob.askExpectedSalary;
              } else {
                actualJobTitle = matchedJob.title || "طلب غير محدد";
              }
            }

            const parsedAnswers = (() => {
              const val = raw.custom_answers;
              if (!val) return [];
              if (Array.isArray(val)) return val;
              if (typeof val === 'string') {
                try { return JSON.parse(val); } catch (e) { return []; }
              }
              return [];
            })();

            return {
              id: raw.id,
              job_id: raw.job_id,
              name: raw.full_name || "متقدم جديد",
              photoUrl: parsedAnswers.find((a: any) => a.question?.includes("الصورة الشخصية"))?.answer || "",
              job: actualJobTitle,
              rating: raw.match_score || raw.match_percentage || 0,
              status: parsedAnswers.find((a: any) => a.question === "مدة الانضمام / الجاهزية للعمل")?.answer || raw.availability || raw.status || "غير محدد",
              expectedSalary: raw.expected_salary || "",
              askExpectedSalary: actualAskExpectedSalary,
              color: "emerald",
              phone: raw.phone || "0500000000",
              email: raw.email || "applicant@example.com",
              source: raw.source || parsedAnswers.find((a: any) => a.question === "مصدر التقديم")?.answer || "غير محدد",
              skills: Array.isArray(raw.skills) ? raw.skills : [],
              aiSummary: raw.ai_summary || raw.ai_justification || "قيد التحليل أو تعذر الاستخراج...",
              voiceEval: raw.voice_eval || "",
              voiceEvalUrl: raw.voice_eval || raw.voice_eval_url || "",
              customAnswers: parsedAnswers,
              city: raw.city || raw.location || parsedAnswers.find((a: any) => a.question === "المدينة")?.answer || "-",
              decision: (raw.decision === 'evaluated' ? 'pending' : raw.decision) || latestDecisions[raw.id] || "pending",
              rejection_reason: raw.rejection_reason || "",
              hr_notes: raw.hr_notes || "",
              cv_file_url: raw.cv_file_url,
              is_favorite: raw.is_favorite || false,
              in_talent_pool: pendingPoolUpdates.current.has(raw.id) ? pendingPoolUpdates.current.get(raw.id) : (raw.in_talent_pool || false),
              nominatedTo: raw.nominated_to,
              skills_match: raw.skills_match || 0,
              experience_match: raw.experience_match || 0,
              education_match: raw.education_match || 0,
              interview_sent: raw.interview_sent || false,
              is_interview_completed: raw.is_interview_completed || false,
              has_started_interview: raw.has_started_interview || false,
              interview_revoked: raw.interview_revoked || false,
              interview_transcript: raw.interview_transcript || "",
              interview_summary: raw.interview_summary || "",
              interview_score: raw.interview_score || 0,
              suggested_questions: raw.suggested_questions,
              top_strengths: raw.strengths || raw.top_strengths,
              top_weaknesses: raw.weaknesses || raw.top_weaknesses,
              top_percentile: raw.top_percentile,
              red_flags: raw.red_flags,
              interview_questions: raw.interview_questions,
              interview_plan: raw.interview_plan,
              attachments: raw.attachments,
              ai_justification: raw.ai_summary || raw.ai_justification,
              job_id: raw.job_id,
              raw_cv_file_url: raw.cv_file_url,
              raw_job_context: raw.job_context
            } as any;
          });

          const currentJobsStr = JSON.stringify(jobIds);
          setApplicantsState(prev => {
            const next = JSON.stringify(prev) !== JSON.stringify(mappedList) ? mappedList : prev;

            import('../lib/applicantsCache').then(({ setGlobalApplicantsCache }) => {
              setGlobalApplicantsCache(next, currentJobsStr);
            });

            return next;
          });
        } else {
          // If there's an error (e.g. ERR_QUIC_PROTOCOL_ERROR), fallback to cache
          if (globalApplicantsCache && globalApplicantsCache.length > 0) {
            setApplicantsState(globalApplicantsCache);
          }
        }
      } catch (err) {
        console.error("Error fetching applicants:", err);
      } finally {
        setIsLoadingApplicants(false);
      }
    };

    fetchApplicants();

    // Supabase Realtime Subscription for instant updates
    let debounceTimer: NodeJS.Timeout;
    const channel = supabase
      .channel('public:applicants')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applicants' }, payload => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          fetchApplicants();
        }, 1500);
      })
      .subscribe();

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      supabase.removeChannel(channel);
    };
  }, [jobs, talentPool]);

  // Auto-Processor for pending applicants with rating 0 when cv limits are available
  const processingIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (cvsRemaining <= 0 || applicants.length === 0) return;

    const pendingApplicants = applicants.filter(a =>
      a.decision === 'locked_fomo' &&
      a.raw_cv_file_url && // ensure we have a file
      !processingIdsRef.current.has(a.id)
    );

    if (pendingApplicants.length === 0) return;

    const applicantsToProcess = pendingApplicants.slice(0, cvsRemaining);

    const processApplicants = async () => {
      for (const app of applicantsToProcess) {
        // Mark as processing to avoid duplicate calls
        processingIdsRef.current.add(app.id);

        try {
          console.log("Sending API Key starting with:", import.meta.env.VITE_FARZ_API_KEY ? import.meta.env.VITE_FARZ_API_KEY.substring(0, 3) + "***" : "undefined");

          // const API_BASE_URL = "https://farz-cv-processo-1.onrender.com"; // Render API - Disabled (Fallback)
          const API_BASE_URL = "https://farz-cv-gateway-production.up.railway.app";

          await fetch(`${API_BASE_URL}/api/v1/extract-cv`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${import.meta.env.VITE_FARZ_API_KEY}`
            },
            body: JSON.stringify({
              applicant_id: app.id,
              job_id: app.job_id || "",
              cv_file_url: app.raw_cv_file_url,
              device_fingerprint: btoa(navigator.userAgent + window.screen.width + window.screen.height),
              job_context: app.raw_job_context || {}
            })
          });
          // Note: we don't need to update state manually, the backend will update Supabase
          // and the realtime subscription will fetch the updated data.
        } catch (error) {
          console.error(`Failed to trigger AI for applicant ${app.id}:`, error);
          // Allow retrying later if it failed completely
          processingIdsRef.current.delete(app.id);
        }
      }
    };

    processApplicants();
  }, [applicants, cvsRemaining]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const [showBulkDeleteDraftsModal, setShowBulkDeleteDraftsModal] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showUndoConfirmModal, setShowUndoConfirmModal] = useState(false);
  const [undoTargetId, setUndoTargetId] = useState<string | null>(null);
  const [showTemplatesManager, setShowTemplatesManager] = useState(false);
  const [showBulkSendModal, setShowBulkSendModal] = useState(false);
  const [showBulkUndoConfirm, setShowBulkUndoConfirm] = useState(false);
  const [applicantToInterview, setApplicantToInterview] = useState<Applicant | null>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewText, setInterviewText] = useState("");
  const [undoAction, setUndoAction] = useState<{ id: string | string[], prevDecision: string, targetDecision: string, timeoutId: NodeJS.Timeout | null } | null>(null);

  useEffect(() => {
    if (pendingAction && clearPendingAction) {
      setApplicants(prev => prev.map(a => a.id === pendingAction.id ? { ...a, decision: pendingAction.decision } : a));

      if (pendingAction.decision === "filtered" && !pendingAction.isOffer) {
        if (undoAction?.timeoutId) clearTimeout(undoAction.timeoutId);
        const timeoutId = setTimeout(() => {
          setUndoAction(null);
        }, 4000);
        setUndoAction({ id: pendingAction.id, prevDecision: "pending", targetDecision: "filtered", timeoutId });
      } else if (pendingAction.isOffer) {
        setToastMessage("تم إرسال العرض بنجاح");
        setTimeout(() => setToastMessage(null), 3500);
      }

      // Save mock decisions to localStorage to prevent bounce-back
      try {
        const decisions = JSON.parse(window.localStorage.getItem("sahab_decisions") || "{}");
        decisions[pendingAction.id] = pendingAction.decision;
        window.localStorage.setItem("sahab_decisions", JSON.stringify(decisions));
      } catch (e) { }

      clearPendingAction();
    }
  }, [pendingAction, clearPendingAction, undoAction]);

  useEffect(() => {
    if (applicantToInterview) {
      const actualName = applicantToInterview.name;
      const actualJob = applicantToInterview.job;
      const companyName = "شركتنا";
      setInterviewText(`السلام عليكم الأستاذ/ ${actualName}،\n\nيسعدنا إبلاغك بترشيحك للمقابلة الشخصية لوظيفة ${actualJob} في ${companyName}.\n\nتم تحديد موعد المقابلة يوم ${interviewDate} الساعة ${interviewTime}.\nنأمل منك تأكيد الحضور.\n\nمع أطيب التحيات،\nإدارة الموارد البشرية`);
    }
  }, [interviewDate, interviewTime, applicantToInterview]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (smartSortRef.current && !smartSortRef.current.contains(event.target as Node)) {
        setIsSmartSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSetWeakSort = () => {
    const hasWeak = applicants.some(a => {
      const d = a.decision || "pending";
      const statusMatch = decisionFilter === "interview"
        ? (d === "interview" || d === "interview_sent" || d === "interviewing")
        : decisionFilter === "pending"
          ? (d === "pending" || d === "locked_fomo")
          : d === decisionFilter;
      const jobMatch = jobFilter === "all" || a.job_id === jobFilter || (a.job || "").includes(jobs.find(j => j.id === jobFilter)?.title || "____NEVER_MATCH____");
      const favMatch = !showFavoritesOnly || a.is_favorite === true;
      return statusMatch && jobMatch && favMatch && Number(a.rating) < 50;
    });

    if (!hasWeak) {
      setToastMessage("لا يوجد متقدمين غير متطابقين");
      setTimeout(() => setToastMessage(null), 3000);
    }

    setSmartSortState("weak");
    setIsSmartSortOpen(false);
  };

  const handleSetEliteSort = () => {
    const hasElite = applicants.some(a => {
      const d = a.decision || "pending";
      const statusMatch = decisionFilter === "interview"
        ? (d === "interview" || d === "interview_sent" || d === "interviewing")
        : decisionFilter === "pending"
          ? (d === "pending" || d === "locked_fomo")
          : d === decisionFilter;
      const jobMatch = jobFilter === "all" || a.job_id === jobFilter || (a.job || "").includes(jobs.find(j => j.id === jobFilter)?.title || "____NEVER_MATCH____");
      const favMatch = !showFavoritesOnly || a.is_favorite === true;
      return statusMatch && jobMatch && favMatch && Number(a.rating) >= 80;
    });

    if (!hasElite) {
      setToastMessage("لا يوجد متقدمين أعلى مطابقة");
      setTimeout(() => setToastMessage(null), 3000);
    }

    setSmartSortState("elite");
    setIsSmartSortOpen(false);
  };

  let visibleApplicants = applicants.filter(a => {
    const d = a.decision || "pending";
    const statusMatch = decisionFilter === "interview"
      ? (d === "interview" || d === "interview_sent" || d === "interviewing")
      : decisionFilter === "pending"
        ? (d === "pending" || d === "locked_fomo" || d === "analyzing" || d === "evaluating" || d === "processing")
        : d === decisionFilter;
    const jobMatch = jobFilter === "all" || a.job_id === jobFilter || (a.job || "").includes(jobs.find(j => j.id === jobFilter)?.title || "____NEVER_MATCH____");
    const favMatch = !showFavoritesOnly || a.is_favorite === true;

    const searchLower = (applicantSearchQuery || "").toLowerCase().trim();

    // Normalize phone numbers to handle 05x, 966x, +966x formats for precise matching
    const searchDigits = searchLower.replace(/\D/g, "");
    const searchPhoneNormalized = searchDigits.startsWith("966")
      ? searchDigits.substring(3)
      : (searchDigits.startsWith("0") ? searchDigits.substring(1) : searchDigits);

    const appDigits = (a.phone || "").replace(/\D/g, "");
    const appPhoneNormalized = appDigits.startsWith("966")
      ? appDigits.substring(3)
      : (appDigits.startsWith("0") ? appDigits.substring(1) : appDigits);

    const phoneMatch = searchPhoneNormalized && appPhoneNormalized
      ? appPhoneNormalized.includes(searchPhoneNormalized)
      : false;

    const matchedJob = jobs.find(j => j.title && (a.job || "").includes(j.title));
    const jobTitleMatch = matchedJob ? (matchedJob.title || "").toLowerCase().includes(searchLower) : false;
    const jobNumberMatch = matchedJob?.job_number ? String(matchedJob.job_number).includes(searchLower) : false;

    const searchMatch = !searchLower || (
      (a.name || "").toLowerCase().includes(searchLower) ||
      phoneMatch ||
      (a.email || "").toLowerCase().trim().includes(searchLower) ||
      jobTitleMatch ||
      jobNumberMatch
    );

    const smartSortMatch =
      smartSortState === "elite" ? Number(a.rating) >= 80 :
        smartSortState === "weak" ? Number(a.rating) < 50 :
          true;

    return statusMatch && jobMatch && favMatch && searchMatch && smartSortMatch;
  });

  if (smartSortState !== "latest") {
    visibleApplicants.sort((a, b) => Number(b.rating) - Number(a.rating));
  }

  const handleToggleFavorite = async (id: string) => {
    const applicant = applicants.find(a => a.id === id);
    if (!applicant) return;
    const newFavoriteState = !applicant.is_favorite;

    // 1. Optimistic UI update
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, is_favorite: newFavoriteState } : a));

    // 2. Backend sync
    if (!id.startsWith("mock-")) {
      try {
        await supabase.from('applicants').update({ is_favorite: newFavoriteState }).eq('id', id);
      } catch (error) {
        console.warn("Could not sync favorite state to backend:", error);
      }
    }
  };

  const handleDecision = async (id: string, decision: "accepted" | "rejected" | "pending" | "interview" | "filtered" | "interview_sent") => {
    const applicant = applicants.find(a => a.id === id);
    if (!applicant) return;
    const prevDecision = applicant.decision || "pending";

    if (undoAction?.timeoutId) clearTimeout(undoAction.timeoutId);

    const targetDecision = decision;
    const updatePayload: any = { decision: targetDecision };
    if (decision === "rejected" || decision === "filtered") {
      updatePayload.rejection_reason = "استبعاد يدوي من الإدارة";
    } else if (decision === "pending") {
      updatePayload.interview_revoked = true;
      updatePayload.interview_sent = false;
    }

    // 1. Optimistic UI update
    startTransition(() => {
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updatePayload } : a));
    });

    // 2. Backend synchronization (Supabase)
    if (!id.startsWith("mock-")) {
      try {
        await supabase.from('applicants').update(updatePayload).eq('id', id);
      } catch (error) {
        console.warn("Could not sync decision to backend:", error);
      }
    } else {
      // Save mock decision to localStorage to prevent bounce-back
      try {
        const decisions = JSON.parse(window.localStorage.getItem("sahab_decisions") || "{}");
        decisions[id] = targetDecision;
        window.localStorage.setItem("sahab_decisions", JSON.stringify(decisions));
      } catch (e) { }
    }

    if (decision !== "pending") {
      const timeoutId = setTimeout(() => {
        setUndoAction(null);
      }, 4000);
      setUndoAction({ id, prevDecision, targetDecision, timeoutId });
    } else {
      setUndoAction(null);
    }
  };

  const handleBulkDecision = async (decision: "accepted" | "rejected" | "interview" | "pending") => {
    if (selectedApplicantIds.length === 0) return;

    const idsToUpdate = [...selectedApplicantIds];
    if (undoAction?.timeoutId) clearTimeout(undoAction.timeoutId);

    const updatePayload: any = { decision };
    if (decision === "rejected") {
      updatePayload.rejection_reason = "مرفوض من قبل المراجع";
    }

    startTransition(() => {
      setApplicants(prev => prev.map(a => idsToUpdate.includes(a.id) ? { ...a, ...updatePayload } : a));
    });

    const realIds = idsToUpdate.filter(id => !id.startsWith("mock-"));
    if (realIds.length > 0) {
      try {
        await supabase.from('applicants').update(updatePayload).in('id', realIds);
      } catch (error) {
        console.warn("Could not sync bulk decision to backend:", error);
      }
    }

    try {
      const decisions = JSON.parse(window.localStorage.getItem("sahab_decisions") || "{}");
      idsToUpdate.forEach(id => {
        if (id.startsWith("mock-")) decisions[id] = decision;
      });
      window.localStorage.setItem("sahab_decisions", JSON.stringify(decisions));
    } catch (e) { }

    setSelectedApplicantIds([]);
    setIsSelectionMode(false);
  };

  const handleBulkFilterOut = async () => {
    if (selectedApplicantIds.length === 0) return;

    const idsToFilter = [...selectedApplicantIds];
    if (undoAction?.timeoutId) clearTimeout(undoAction.timeoutId);

    const updatePayload: any = { decision: "filtered", rejection_reason: "استبعاد يدوي من الإدارة" };

    // Optimistic UI Update
    startTransition(() => {
      setApplicants(prev => prev.map(a => idsToFilter.includes(a.id) ? { ...a, ...updatePayload } : a));
    });

    // Backend Sync
    const realIds = idsToFilter.filter(id => !id.startsWith("mock-"));
    if (realIds.length > 0) {
      try {
        await supabase.from('applicants').update(updatePayload).in('id', realIds);
      } catch (error) {
        console.warn("Could not sync bulk decision to backend:", error);
      }
    }

    // Save mock decisions to localStorage
    try {
      const decisions = JSON.parse(window.localStorage.getItem("sahab_decisions") || "{}");
      idsToFilter.forEach(id => {
        if (id.startsWith("mock-")) decisions[id] = "filtered";
      });
      window.localStorage.setItem("sahab_decisions", JSON.stringify(decisions));
    } catch (e) { }

    setSelectedApplicantIds([]);
    const timeoutId = setTimeout(() => {
      setUndoAction(null);
    }, 4000);
    setUndoAction({ id: idsToFilter, prevDecision: "pending", targetDecision: "filtered", timeoutId });
  };

  const handleUndo = async () => {
    if (!undoAction) return;
    const { id, prevDecision, timeoutId } = undoAction;
    if (timeoutId) clearTimeout(timeoutId);
    setUndoAction(null);

    const idsToRestore = Array.isArray(id) ? id : [id];

    // UI Update
    startTransition(() => {
      setApplicants(prev => prev.map(a => idsToRestore.includes(a.id) ? { ...a, decision: prevDecision as any, rejection_reason: "" } : a));
    });

    // Backend Sync
    const realIds = idsToRestore.filter(i => !i.startsWith("mock-"));
    if (realIds.length > 0) {
      try {
        await supabase.from('applicants').update({ decision: prevDecision, rejection_reason: null }).in('id', realIds);
      } catch (error) {
        console.warn("Could not undo backend state:", error);
      }
    }
  };

  const handleMoveToPool = async (applicant: Applicant) => {
    pendingPoolUpdates.current.set(applicant.id, true);
    // Optimistic UI update
    setApplicants(prev => prev.map(a => a.id === applicant.id ? { ...a, in_talent_pool: true } : a));
    
    // Optimistic cache update
    import('../lib/applicantsCache').then(({ globalApplicantsCache, setGlobalApplicantsCache }) => {
       if (globalApplicantsCache) {
          const nextCache = globalApplicantsCache.map(a => a.id === applicant.id ? { ...a, in_talent_pool: true } : a);
          setGlobalApplicantsCache(nextCache, JSON.stringify(jobs.map(j => j.id).sort()));
       }
    });

    setToastMessage("تم نقل المرشح لبنك الكفاءات بنجاح!");
    setTimeout(() => setToastMessage(null), 3000);
    setOpenDropdownId(null);

    // Backend sync
    if (!applicant.id.startsWith("mock-")) {
      try {
        await supabase.from('applicants').update({ in_talent_pool: true }).eq('id', applicant.id);
      } catch (error) {
        console.warn("Could not sync talent pool state to backend:", error);
      } finally {
        setTimeout(() => pendingPoolUpdates.current.delete(applicant.id), 5000);
      }
    }
  };

  const handleRemoveFromPool = async (id: string) => {
    pendingPoolUpdates.current.set(id, false);
    // Optimistic UI update
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, in_talent_pool: false } : a));
    
    // Optimistic cache update
    import('../lib/applicantsCache').then(({ globalApplicantsCache, setGlobalApplicantsCache }) => {
       if (globalApplicantsCache) {
          const nextCache = globalApplicantsCache.map(a => a.id === id ? { ...a, in_talent_pool: false } : a);
          setGlobalApplicantsCache(nextCache, JSON.stringify(jobs.map(j => j.id).sort()));
       }
    });

    setToastMessage("تمت الإزالة من بنك الكفاءات.");
    setTimeout(() => setToastMessage(null), 3000);
    setOpenDropdownId(null);

    // Backend sync
    if (!id.startsWith("mock-")) {
      try {
        await supabase.from('applicants').update({ in_talent_pool: false }).eq('id', id);
      } catch (error) {
        console.warn("Could not sync talent pool state to backend:", error);
      } finally {
        setTimeout(() => pendingPoolUpdates.current.delete(id), 5000);
      }
    }
  };

  const handleCrossNominate = async () => {
    if (!crossNominateApplicant || !crossNominateJobId) return;
    const targetJob = jobs.find(j => j.id === crossNominateJobId);
    if (!targetJob) return;

    const newId = crypto.randomUUID();

    const clonedApplicant = {
      ...crossNominateApplicant,
      id: newId,
      job: targetJob.title,
      status: "مقبول مبدئياً",
      decision: "pending" as any,
      nominatedTo: undefined,
      aiSummary: "تم الترشيح المتقاطع من شاغر سابق.",
      date: new Date().toISOString(),
      source: "ترشيح متقاطع",
    };

    setApplicants(prev => {
      const updatedOriginals = prev.map(a =>
        a.id === crossNominateApplicant.id
          ? { ...a, nominatedTo: targetJob.title }
          : a
      );
      return [...updatedOriginals, clonedApplicant];
    });

    setToastMessage(`تم ترشيح المتقدم للوظيفة بنجاح`);
    setTimeout(() => setToastMessage(null), 3000);
    setCrossNominateApplicant(null);
    setCrossNominateJobId("");

    // Backend Sync (Async)
    (async () => {
      try {
        // First, we need to fetch the original applicant's raw data to clone it properly
        const { data: originalRaw } = await supabase.from('applicants').select('*').eq('id', crossNominateApplicant.id).single();

        if (originalRaw) {
          const { id, created_at, job_id, decision, rejection_reason, source, ...restOfRaw } = originalRaw;

          await supabase.from('applicants').insert([{
            ...restOfRaw,
            id: newId,
            job_id: crossNominateJobId,
            decision: 'pending',
            source: 'ترشيح متقاطع',
            ai_justification: 'تم الترشيح المتقاطع من شاغر سابق.'
          }]);

          // Also update the original applicant's nominated_to field
          await supabase.from('applicants').update({ nominated_to: targetJob.title }).eq('id', crossNominateApplicant.id);
        }
      } catch (err) {
        console.error("Could not sync cross-nomination to backend", err);
      }
    })();
  };

  const handleFilterOut = async (id: string) => {
    if (window.confirm("هل أنت متأكد من تصفية المرشح وإبعاده عن القائمة النشطة؟")) {
      await handleDecision(id, "filtered");
    }
    setOpenDropdownId(null);
  };
  const exportToCSV = () => {
    const headers = [
      "الاسم",
      "الوظيفة المتقدم عليها",
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
        app.name || "",
        app.job || "",
        (app.rating || 0) + "%",
        app.status || "",
        app.phone || "",
        app.email || "",
        (app.skills || []).join(" - "),
        `"${(app.aiSummary || "").replace(/"/g, '""')}"`,
        `"${(app.voiceEval || "").replace(/"/g, '""')}"`,
        `"${(app.customAnswers && app.customAnswers[0]?.answer) ? app.customAnswers[0].answer.replace(/"/g, '""') : ""}"`,
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
    if (job.status === "مغلق مؤقتاً") return false;
    if (!job.endDate) return false;
    return new Date() > new Date(job.endDate);
  };
  const syncedJobs = jobs.map(j => ({ ...j, company: j.company || userProfile?.companyName || userProfile?.name || "", applicants: applicants.filter(a => a.job_id === j.id).length }));
  const filteredSearchJobs = syncedJobs.filter((j) => {
    if (!jobSearchQuery) return true;
    const query = jobSearchQuery.toLowerCase();
    const titleMatch = (j.title || j.campaignTitle || "").toLowerCase().includes(query);
    const numberMatch = j.job_number ? String(j.job_number).includes(query) : false;
    return titleMatch || numberMatch;
  });

  const activeJobsList = filteredSearchJobs.filter((j) => !isJobExpired(j) && j.status !== "مسودة" && j.status !== "مغلق مؤقتاً");
  const inactiveJobsList = filteredSearchJobs.filter((j) => isJobExpired(j) && j.status !== "مسودة" && j.status !== "مغلق مؤقتاً");
  const pausedJobsList = filteredSearchJobs.filter((j) => j.status === "مغلق مؤقتاً");
  const draftJobsList = filteredSearchJobs.filter((j) => j.status === "مسودة");
  const renderContent = () => {
    switch (activeTab) {
      case "الفرز السريع":
        return FEATURE_FLAGS.enable_fast_sorting ? <div className="p-8 text-center">صفحة الفرز السريع غير متاحة حالياً</div> : null;
      case "الرئيسية":
        return (
          <div className="max-w-[1600px] w-full min-w-0 px-2 mx-auto space-y-8">
            <header className="relative flex justify-between items-center w-full mb-8">
              <div className="flex items-center">
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base whitespace-nowrap">
                  مرحباً بك مجدداً إليك نظرة شاملة على نشاط اليوم
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 relative z-10">
                {FEATURE_FLAGS.enable_fast_sorting && (
                  <button
                    onClick={() => setActiveTab("الفرز السريع")}
                    className="bg-primary/10 text-primary px-4 md:px-6 py-3 md:py-4 rounded-2xl font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-2 shadow-sm text-sm md:text-base"
                  >
                    <Zap size={20} /> <span className="hidden md:inline">الفرز السريع</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (plan === 'none') {
                      setToastMessage("يجب الاشتراك في إحدى الباقات لإضافة إعلان وظيفي");
                      setActiveTab("باقات فرز");
                      setTimeout(() => setToastMessage(null), 3000);
                      return;
                    }

                    onCreateJob();
                  }}
                  className={`px-4 md:px-8 py-3 md:py-4 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base whitespace-nowrap ${plan === 'none' ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-[0_6px_0_#cbd5e1] translate-y-[2px]' : 'bg-gradient-to-b from-primary to-[#0d847a] text-white shadow-[0_6px_0_#096159,0_12px_20px_rgba(13,148,136,0.3)] hover:shadow-[0_4px_0_#096159,0_8px_15px_rgba(13,148,136,0.3)] hover:translate-y-[2px] active:shadow-[0_0px_0_#096159] active:translate-y-[6px]'}`}
                >
                  <Briefcase size={20} /> <span className="hidden md:inline">إنشاء إعلان وظيفي</span>
                </button>
              </div>
            </header>
            {cvsUsed >= cvLimit && plan !== 'free' && plan !== 'none' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-3 shadow-sm mb-6">
                <AlertTriangle className="text-red-500 shrink-0" size={24} />
                <p className="text-sm font-bold text-red-700 dark:text-red-400 leading-relaxed flex-1">
                  <span className="font-black">تنبيه:</span> لقد استنفدت رصيد السير الذاتية المسموح به في باقتك. سيتم الاحتفاظ بالسير الجديدة بحالة (قيد الانتظار) ولن تُفرز تلقائياً حتى يتم ترقية الباقة أو شحن رصيد إضافي.
                </p>
                <button onClick={() => setActiveTab('باقات فرز')} className="mt-3 md:mt-0 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg text-xs font-bold hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors whitespace-nowrap">
                  ترقية الباقة
                </button>
              </div>
            )}
            <GlobalJobSelector
              jobs={syncedJobs}
              selectedFilter={jobFilter}
              onFilterChange={setJobFilter}
            />{" "}
            {/* Stats Cards */}{" "}
            {(() => {
              const baseStatsApps = jobFilter === "all" ? applicants : applicants.filter(a => {
                const searchJob = jobs.find(j => j.id === jobFilter)?.title || "";
                return searchJob ? (a.job || "").includes(searchJob) : false;
              });
              const totalCount = baseStatsApps.length;
              const pendingCount = baseStatsApps.filter(a => !a.decision || a.decision === "pending").length;
              const acceptedCount = baseStatsApps.filter(a => a.decision === "accepted").length;

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                  {[
                    {
                      label: "إجمالي المتقدمين",
                      value: totalCount.toString(),
                      change: `+${totalCount}`,
                      icon: <Users size={18} className="text-emerald-600 dark:text-emerald-400" />,
                      bgClass: "bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-emerald-900/20",
                      iconBg: "bg-gradient-to-br from-emerald-100 to-emerald-200/50 dark:from-emerald-900/60 dark:to-emerald-800/40",
                      borderColor: "border-emerald-100/60 dark:border-emerald-800/40",
                      shadowClass: "shadow-[0_4px_12px_rgba(16,185,129,0.15),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(16,185,129,0.2),inset_0_2px_4px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.3)]",
                      blurClass: "bg-emerald-400/20 dark:bg-emerald-400/10",
                      badgeClass: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/30"
                    },
                    {
                      label: "قيد المراجعة",
                      value: pendingCount.toString(),
                      change: pendingCount > 0 ? "اتخاذ قرار" : "مكتمل",
                      icon: <Clock size={18} className="text-orange-500 dark:text-orange-400" />,
                      bgClass: "bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-800 dark:to-orange-900/20",
                      iconBg: "bg-gradient-to-br from-orange-100 to-orange-200/50 dark:from-orange-900/60 dark:to-orange-800/40",
                      borderColor: "border-orange-100/60 dark:border-orange-800/40",
                      shadowClass: "shadow-[0_4px_12px_rgba(249,115,22,0.15),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(249,115,22,0.2),inset_0_2px_4px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.3)]",
                      blurClass: "bg-orange-400/20 dark:bg-orange-400/10",
                      badgeClass: "bg-orange-100/80 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border border-orange-200/50 dark:border-orange-700/30"
                    },
                    {
                      label: "تم قبولهم",
                      value: acceptedCount.toString(),
                      change: `+${acceptedCount} مرشحين`,
                      icon: <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" />,
                      bgClass: "bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-emerald-900/20",
                      iconBg: "bg-gradient-to-br from-emerald-100 to-emerald-200/50 dark:from-emerald-900/60 dark:to-emerald-800/40",
                      borderColor: "border-emerald-100/60 dark:border-emerald-800/40",
                      shadowClass: "shadow-[0_4px_12px_rgba(16,185,129,0.15),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(16,185,129,0.2),inset_0_2px_4px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.3)]",
                      blurClass: "bg-emerald-400/20 dark:bg-emerald-400/10",
                      badgeClass: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/30"
                    },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3, scale: 1.02 }}
                      className={`py-3 px-4 rounded-xl border ${stat.borderColor} ${stat.shadowClass} ${stat.bgClass} flex items-center justify-between relative overflow-hidden group`}
                    >
                      {/* Decorative Background Blur */}
                      <div className={`absolute -left-6 -top-6 w-20 h-20 ${stat.blurClass} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />

                      <div className="flex items-center gap-3 relative z-10 min-w-0">
                        <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center shadow-inner`}>
                          {stat.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold mb-0.5 truncate">
                            {stat.label}
                          </p>
                          <div className="text-xl font-black text-slate-800 dark:text-white leading-none drop-shadow-sm">
                            {(isLoadingApplicants && applicants.length === 0) ? (
                              <div className="h-5 w-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-1" />
                            ) : (
                              stat.value
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-md text-[9px] font-bold shadow-sm ${stat.badgeClass}`}>
                          {(isLoadingApplicants && applicants.length === 0) ? (
                            <div className="h-3 w-10 bg-slate-300/50 dark:bg-slate-600/50 rounded animate-pulse" />
                          ) : (
                            stat.change
                          )}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
            {/* Data Table */}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-white dark:border-slate-700 shadow-2xl shadow-slate-200/50 overflow-hidden w-full min-w-0 flex flex-col">
              <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 dark:bg-slate-800/50 w-full min-w-0">
                <h3 className="font-bold text-lg text-navy dark:text-white whitespace-nowrap">
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
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border-[2px] border-b-[4px] active:translate-y-[2px] active:border-b-[2px] active:mb-[2px] hover:-translate-y-0.5 ${isSelectionMode ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-slate-300 border-b-slate-400 dark:border-slate-600 dark:border-b-slate-800' : 'bg-gradient-to-b from-white to-slate-50 text-navy border-slate-200 border-b-slate-300 dark:from-slate-800 dark:to-slate-900 dark:text-white dark:border-slate-700 dark:border-b-slate-900'}`}
                  >
                    <CheckSquare size={18} />
                    <span className="whitespace-nowrap w-[85px] text-center">{isSelectionMode ? "إلغاء التحديد" : "تحديد"}</span>
                  </button>
                  <button
                    onClick={() => setShowTemplatesManager(true)}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border-[2px] border-b-[4px] active:translate-y-[2px] active:border-b-[2px] active:mb-[2px] hover:-translate-y-0.5 bg-gradient-to-b from-white to-slate-50 text-navy border-slate-200 border-b-slate-300 dark:from-slate-800 dark:to-slate-900 dark:text-white dark:border-slate-700 dark:border-b-slate-900 hover:text-primary dark:hover:text-primary"
                  >
                    <MessageCircle size={18} />
                    <span className="whitespace-nowrap text-center">قوالب أسئلة AI</span>
                  </button>
                  <AnimatePresence>
                    {isSelectionMode && selectedApplicantIds.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-wrap items-center gap-3 bg-slate-100/80 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
                      >
                        <div className="flex items-center gap-2 px-3 border-l border-slate-300 dark:border-slate-600">
                          <CheckSquare size={18} className="text-primary" />
                          <span className="font-bold text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            تم تحديد ({selectedApplicantIds.length})
                          </span>
                        </div>
                        <button
                          onClick={() => handleBulkDecision("accepted")}
                          className="bg-teal-50 text-teal-600 border border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800/50 px-4 py-2 rounded-xl font-bold text-sm hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-all flex items-center gap-2 shadow-sm"
                        >
                          <CheckCircle size={16} /> قبول للكل
                        </button>
                        <button
                          onClick={() => handleBulkDecision("interview")}
                          className="bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50 px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all flex items-center gap-2 shadow-sm"
                        >
                          <Mic size={16} /> مقابلة للكل
                        </button>
                        <button
                          onClick={() => handleBulkDecision("rejected")}
                          className="bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50 px-4 py-2 rounded-xl font-bold text-sm hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all flex items-center gap-2 shadow-sm"
                        >
                          <X size={16} /> رفض للكل
                        </button>
                        <button
                          onClick={() => setShowBulkUndoConfirm(true)}
                          className="bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-all flex items-center gap-2 shadow-sm"
                        >
                          <RotateCcw size={16} /> تراجع
                        </button>
                        <button
                          onClick={() => setShowBulkSendModal(true)}
                          className="bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50 px-4 py-2 rounded-xl font-bold text-sm hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-all shadow-sm"
                        >
                          مقابلة AI
                        </button>
                        <button
                          onClick={handleBulkFilterOut}
                          className="bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-all flex items-center gap-2 shadow-sm"
                        >
                          <Trash2 size={16} /> تصفية المحدد
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <CompactJobSelector jobs={jobs} selectedFilter={jobFilter} onFilterChange={(id) => setJobFilter(id)} />
                  <div className="flex bg-slate-100/50 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto hide-scrollbar max-w-full">
                    {[
                      { id: "pending", label: "قيد المراجعة", color: "text-orange-600 dark:text-orange-400", dotActive: "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8),inset_0_1.5px_2px_rgba(255,255,255,0.8)] border-orange-400", dotInactive: "bg-slate-200/80 dark:bg-slate-700/80 shadow-inner border-slate-300 dark:border-slate-600" },
                      { id: "interview", label: "المقابلات", color: "text-yellow-600 dark:text-yellow-400", dotActive: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8),inset_0_1.5px_2px_rgba(255,255,255,0.8)] border-yellow-400", dotInactive: "bg-slate-200/80 dark:bg-slate-700/80 shadow-inner border-slate-300 dark:border-slate-600" },
                      { id: "accepted", label: "المقبولين", color: "text-green-600 dark:text-green-400", dotActive: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8),inset_0_1.5px_2px_rgba(255,255,255,0.8)] border-green-400", dotInactive: "bg-slate-200/80 dark:bg-slate-700/80 shadow-inner border-slate-300 dark:border-slate-600" },
                      { id: "rejected", label: "المرفوضين", color: "text-red-600 dark:text-red-400", dotActive: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8),inset_0_1.5px_2px_rgba(255,255,255,0.8)] border-red-400", dotInactive: "bg-slate-200/80 dark:bg-slate-700/80 shadow-inner border-slate-300 dark:border-slate-600" },
                      { id: "filtered", label: "تمت تصفيتهم", color: "text-slate-500 dark:text-slate-400", dotActive: "bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.8),inset_0_1.5px_2px_rgba(255,255,255,0.8)] border-slate-400", dotInactive: "bg-slate-200/80 dark:bg-slate-700/80 shadow-inner border-slate-300 dark:border-slate-600" }
                    ].map(tab => {
                      const isActive = decisionFilter === tab.id;
                      const count = applicants.filter(a => {
                        const searchJob = jobs.find(j => j.id === jobFilter)?.title || "";
                        const jobMatch = jobFilter === "all" || (searchJob ? (a.job || "").includes(searchJob) : true);
                        if (!jobMatch) return false;
                        const d = a.decision || "pending";
                        if (tab.id === "interview") return d === "interview" || d === "interviewing";
                        if (tab.id === "rejected") return d === "rejected" || d === "deleted";
                        return d === tab.id;
                      }).length;

                      return (
                        <button
                          key={tab.id}
                          onClick={() => setDecisionFilter(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${isActive ? `bg-white dark:bg-slate-700 shadow-md border border-slate-100 dark:border-slate-600 transform -translate-y-0.5 text-slate-800 dark:text-slate-200` : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 border border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}
                        >
                          <span className={`w-2 h-2 rounded-full border transition-all duration-300 ${isActive ? tab.dotActive + ' scale-110' : tab.dotInactive}`}></span>
                          {tab.label} <span className={`mr-1 px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-slate-100 dark:bg-slate-600' : 'bg-slate-200/50 dark:bg-slate-700/50 opacity-70'}`}>{count}</span>
                        </button>
                      )
                    })}
                  </div>{" "}





                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 border hover:-translate-y-0.5 hover:shadow-md ${showFavoritesOnly ? 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50' : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'}`}
                  >
                    <Star size={16} fill={showFavoritesOnly ? "currentColor" : "none"} className={showFavoritesOnly ? "text-yellow-500" : "text-slate-400"} /> عرض المفضلين
                  </button>
                  <div className="relative">
                    <Search
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      size={18}
                    />{" "}
                    <input
                      type="text"
                      value={applicantSearchQuery}
                      onChange={(e) => setApplicantSearchQuery(e.target.value)}
                      placeholder="ابحث بالاسم، رقم الجوال، أو الإيميل..."
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pr-12 pl-5 py-2.5 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all w-80 font-medium dark:text-white dark:placeholder-slate-400"
                    />{" "}
                  </div>{" "}
                  <button
                    onClick={exportToCSV}
                    className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:-translate-y-0.5 hover:shadow-md transition-all shadow-sm flex items-center gap-2"
                  >
                    <Download size={18} /> تصدير CSV{" "}
                  </button>{" "}
                  <div className="relative" ref={smartSortRef}>
                    <button
                      onClick={() => setIsSmartSortOpen(!isSmartSortOpen)}
                      className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:-translate-y-0.5 hover:shadow-md transition-all shadow-sm flex items-center justify-between group w-48"
                    >
                      <div className="flex items-center gap-2 relative z-10">
                        <Filter size={18} />
                        <span>
                          {smartSortState === "elite" ? "الأعلى مطابقة" :
                            smartSortState === "weak" ? "غير المطابقين" :
                              smartSortState === "latest" ? "الأحدث تسجيلاً" :
                                "الفرز الذكي"}
                        </span>
                      </div>
                      <ChevronDown size={14} className={`relative z-10 transition-transform ${isSmartSortOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isSmartSortOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          <div className="py-2">
                            <button
                              onClick={() => { setSmartSortState("all"); setIsSmartSortOpen(false); }}
                              className={`w-full text-right px-4 py-3 text-sm font-bold flex items-center gap-3 transition-colors ${smartSortState === "all" ? "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" : "text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                            >
                              <Filter size={16} className={smartSortState === "all" ? "text-teal-600 dark:text-teal-400" : "text-slate-400"} />
                              عرض الكل (الافتراضي)
                            </button>
                            <button
                              onClick={handleSetEliteSort}
                              className={`w-full text-right px-4 py-3 text-sm font-bold flex items-center gap-3 transition-colors ${smartSortState === "elite" ? "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" : "text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                            >
                              <Star size={16} className={smartSortState === "elite" ? "text-teal-600 dark:text-teal-400" : "text-slate-400"} />
                              الأعلى مطابقة (+80%)
                            </button>
                            <button
                              onClick={handleSetWeakSort}
                              className={`w-full text-right px-4 py-3 text-sm font-bold flex items-center gap-3 transition-colors ${smartSortState === "weak" ? "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" : "text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                            >
                              <AlertTriangle size={16} className={smartSortState === "weak" ? "text-teal-600 dark:text-teal-400" : "text-slate-400"} />
                              غير المطابقين (-50%)
                            </button>
                            <button
                              onClick={() => { setSmartSortState("latest"); setIsSmartSortOpen(false); }}
                              className={`w-full text-right px-4 py-3 text-sm font-bold flex items-center gap-3 transition-colors ${smartSortState === "latest" ? "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" : "text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                            >
                              <Clock size={16} className={smartSortState === "latest" ? "text-teal-600 dark:text-teal-400" : "text-slate-400"} />
                              الأحدث تسجيلاً
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>{" "}
                </div>{" "}
              </div>
              {(() => {
                const lockedCount = visibleApplicants.filter((row) => row.decision === "locked_fomo" || (plan === 'free' && row.decision === "pending" && (!row.rating || row.rating === 0) && cvsRemaining <= 0)).length;
                if (lockedCount > 0) {
                  return (
                    <div className="mb-6 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center shadow-sm text-primary shrink-0 border border-primary/20">
                          <Lock size={22} />
                        </div>
                        <div>
                          <h4 className="font-bold text-navy dark:text-white text-lg">لقد انتهى رصيدك من السير الذاتية</h4>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            لديك ({lockedCount}) سيرة ذاتية جديدة بانتظار الفرز. إما أن ترقي باقتك، أو الحصول على رصيد 500 سيرة ذاتية إضافية لعرض المتقدمين الجدد.
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 w-full md:w-auto mt-2 md:mt-0">
                        <button
                          onClick={() => {
                            const currentCount = addonsBoughtThisMonth;
                            const newCount = currentCount + 1;
                            setAddonsBoughtThisMonth(newCount);
                            window.localStorage.setItem("addons_bought_this_month", newCount.toString());

                            const dismissedKey = `dismissed_upsell_${plan}_${(userProfile as any)?.subscription_end_date || 'none'}`;
                            const hasDismissed = window.localStorage.getItem(dismissedKey) === "true";

                            if (currentCount >= 2 && plan === 'startup' && !hasDismissed) {
                              setShowSoftUpgradeModal(true);
                            } else {
                              alert("سيتم توجيهك لبوابة الدفع لشراء 500 سيرة بـ 149 ريال...");
                            }
                          }}
                          className="relative overflow-hidden group flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-teal-500 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 border border-teal-400/20"
                        >
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                          <Lock size={16} className="relative z-10 group-hover:scale-110 transition-transform" />
                          <span className="relative z-10 tracking-wide">فك القفل 149 ريال</span>
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              {(() => {
                const isHomeMockState = jobs.filter((j) => j.status !== "مسودة").length === 0;
                const isEmptyRealState = !isHomeMockState && !isLoadingApplicants && visibleApplicants.length === 0;
                const shouldShowMockTable = isHomeMockState || isEmptyRealState;
                const fakeMockData: any[] = [
                  { id: "fake1", name: "محمد عبدالله", job: "مسؤول مبيعات", rating: 92, status: "مكتمل", decision: decisionFilter === "all" ? "pending" : decisionFilter, phone: "966500000000", email: "mohamed@example.com", is_favorite: true, photoUrl: "", has_started_interview: true, is_interview_completed: true },
                  { id: "fake2", name: "سارة خالد", job: "مهندس برمجيات", rating: 85, status: "قيد المراجعة", decision: decisionFilter === "all" ? "pending" : decisionFilter, phone: "966500000001", email: "sara@example.com", is_favorite: false, photoUrl: "", has_started_interview: true, is_interview_completed: false },
                  { id: "fake3", name: "عمر فهد", job: "محاسب عام", rating: 78, status: "مرفوض", decision: decisionFilter === "all" ? "rejected" : decisionFilter, phone: "966500000002", email: "omar@example.com", is_favorite: false, photoUrl: "", rejection_reason: "مرفوض آلياً" },
                  { id: "fake4", name: "نورة سعد", job: "مصمم جرافيك", rating: 65, status: "بانتظار المقابلة", decision: decisionFilter === "all" ? "interview" : decisionFilter, phone: "966500000003", email: "noura@example.com", is_favorite: true, photoUrl: "", interview_sent: true, interview_sent_at: new Date().toISOString() },
                  { id: "fake5", name: "خالد عبدالله", job: "مدير تسويق", rating: 45, status: "قيد المراجعة", decision: decisionFilter === "all" ? "pending" : decisionFilter, phone: "966500000004", email: "khalid@example.com", is_favorite: false, photoUrl: "" }
                ];
                const rowsToRender = shouldShowMockTable ? fakeMockData : visibleApplicants.slice(0, displayCount);

                return (
                  <div className="relative overflow-x-auto overflow-y-hidden min-h-[60vh] hide-scrollbar pb-10">
                    {isHomeMockState && !isLoadingJobs && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4">
                        <div className="pointer-events-auto scale-90 md:scale-100 w-full max-w-2xl">
                          <EmptyState
                            title="لوحة التحكم بانتظارك! لم تقم بإنشاء أي إعلانات وظيفية حتى الآن"
                            actionLabel={isHomeMockState ? "أنشئ إعلان وظيفي الآن" : undefined}
                            onAction={onCreateJob}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-2xl border border-white/40 dark:border-slate-700/50"
                            icon={<LayoutDashboard size={32} className="text-emerald-400" />}
                          />
                        </div>
                      </div>
                    )}
                    {isEmptyRealState && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4">
                        <div className="pointer-events-auto scale-90 md:scale-100 w-full max-w-xl">
                          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-2xl border border-white/40 dark:border-slate-700/50 p-8 rounded-[32px] flex flex-col items-center justify-center text-center transform transition-all hover:scale-[1.02]">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner-3d">
                              <Search size={32} className="text-slate-300 dark:text-slate-500 drop-shadow-md" />
                            </div>
                            <h3 className="text-xl font-bold text-navy dark:text-white mb-2">
                              {showFavoritesOnly ? "لا يوجد مرشحين في عرض المفضلين" : decisionFilter === "accepted" ? "لا يوجد مرشحين مقبولين حالياً" : decisionFilter === "rejected" ? "لا يوجد مرشحين مرفوضين حالياً" : decisionFilter === "interview" ? "لا يوجد مرشحين في مرحلة المقابلة حالياً" : decisionFilter === "filtered" ? "لا يوجد مرشحين في قائمة التصفية" : decisionFilter === "locked_fomo" ? "لا توجد سير ذاتية مقفلة حالياً" : "لا يوجد مرشحين قيد المراجعة في الوقت الحالي"}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}
                    <table className={`w-full min-w-[1100px] text-right transition-all ${shouldShowMockTable ? 'filter blur-[6px] opacity-50 pointer-events-none select-none' : ''}`}>
                      <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-200 text-xs uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                        <tr>
                          {isSelectionMode && (
                            <th className="px-3 py-4 w-10 font-bold text-navy dark:text-white">
                              <div className="flex flex-col items-center justify-center gap-1">
                                <div
                                  onClick={() => {
                                    const allSelected = visibleApplicants.length > 0 && selectedApplicantIds.length === visibleApplicants.length;
                                    if (allSelected) {
                                      setSelectedApplicantIds([]);
                                    } else {
                                      setSelectedApplicantIds(visibleApplicants.map(a => a.id));
                                    }
                                  }}
                                  className={`w-5 h-5 mx-auto rounded-[6px] border flex items-center justify-center cursor-pointer transition-all ${visibleApplicants.length > 0 && selectedApplicantIds.length === visibleApplicants.length ? "bg-primary border-primary text-white" : "border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700/50 opacity-100 hover:border-slate-400 dark:hover:border-slate-400"}`}
                                >
                                  {visibleApplicants.length > 0 && selectedApplicantIds.length === visibleApplicants.length && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className="text-[10px] text-slate-500 font-bold">الكل</span>
                              </div>
                            </th>
                          )}
                          <th className="px-2 pr-14 py-4 font-bold text-navy dark:text-white text-right whitespace-nowrap">اسم المتقدم</th>
                          <th className="px-2 py-4 font-bold text-navy dark:text-white text-right whitespace-nowrap">الوظيفة</th>
                          <th className="px-2 py-4 font-bold text-navy dark:text-white text-right whitespace-nowrap">التقييم الآلي</th>
                          <th className="px-2 py-4 font-bold text-navy dark:text-white text-right whitespace-nowrap">الجاهزية</th>
                          <th className="px-2 py-4 font-bold text-navy dark:text-white text-center whitespace-nowrap">المدينة</th>
                          <th className="px-2 py-4 font-bold text-navy dark:text-white text-center whitespace-nowrap">التواصل</th>
                          {decisionFilter === "interview" && (
                            <>
                              <th className="px-2 py-4 font-bold text-navy dark:text-white text-center whitespace-nowrap">حالة المقابلة</th>
                              <th className="px-2 py-4 font-bold text-navy dark:text-white text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">
                                  <Brain size={16} className="text-primary" /> تقييم المقابلة
                                </div>
                              </th>
                            </>
                          )}
                          <th className="px-2 py-4 font-bold text-navy dark:text-white whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5 w-full pl-4">
                              <div className={`flex justify-center shrink-0 ${decisionFilter === "pending" ? "w-[200px]" : decisionFilter === "locked_fomo" ? "w-[160px]" : "w-[75px]"}`}>
                                الإجراءات
                              </div>
                              <div className="w-px h-5 mx-1 opacity-0 shrink-0"></div>
                              <div className="w-[110px] opacity-0 shrink-0"></div>
                              <div className="w-8 opacity-0 shrink-0"></div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingApplicants && applicants.length === 0 ? (
                          <tr>
                            <td colSpan={7 + (isSelectionMode ? 1 : 0) + (decisionFilter === "interview" ? 2 : 0)} className="p-8">
                              <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white dark:bg-slate-800/50">
                                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                                <h3 className="text-xl font-bold text-navy dark:text-white mb-2">
                                  جاري جلب بيانات المرشحين...
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                  يرجى الانتظار قليلاً بينما نقوم بتجهيز قائمة المتقدمين.
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <>
                            {rowsToRender.map((originalRow, index) => {
                              const row = originalRow;
                              const isFomoLocked = row.decision === "locked_fomo" || (plan === 'free' && row.decision === "pending" && (!row.rating || row.rating === 0) && cvsRemaining <= 0);
                              const isAutoRejected = row.rejection_reason && row.rejection_reason.includes("مرفوض آلياً");
                              const isEvaluating = !isAutoRejected && ((row.decision === "pending" && row.rating === 0) || row.decision === "analyzing" || row.decision === "evaluating" || row.decision === "processing");
                              return (
                                <motion.tr
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  key={row.id}
                                  onClick={() => {
                                    if (!isFomoLocked && !isEvaluating) {
                                      onViewDetails(row);
                                    }
                                  }}
                                  className={`transition-all group ${isFomoLocked || isEvaluating ? 'bg-slate-50/50 dark:bg-slate-800/30' : 'cursor-pointer relative z-0 hover:z-10'}`}
                                >
                                  {isSelectionMode && (
                                    <td
                                      className="px-3 py-4 w-10 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (selectedApplicantIds.includes(row.id)) {
                                          setSelectedApplicantIds(prev => prev.filter(id => id !== row.id));
                                        } else {
                                          setSelectedApplicantIds(prev => [...prev, row.id]);
                                        }
                                      }}
                                    >
                                      <div
                                        className={`w-5 h-5 mx-auto rounded-[6px] border flex items-center justify-center cursor-pointer transition-all ${selectedApplicantIds.includes(row.id) ? "bg-primary border-primary text-white opacity-100" : "border-slate-300 dark:border-slate-500 bg-slate-100/50 dark:bg-slate-700/50 opacity-100 hover:border-slate-400 dark:hover:border-slate-400"}`}
                                      >
                                        {selectedApplicantIds.includes(row.id) && (
                                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        )}
                                      </div>
                                    </td>
                                  )}
                                  <td className="px-2 py-3">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); handleToggleFavorite(row.id); }}
                                        className={`transition-all relative z-20 p-5 -m-5 ${row.is_favorite ? "text-yellow-500 scale-75" : "text-slate-200 hover:text-yellow-500"}`}
                                        title={row.is_favorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                                      >
                                        <Star
                                          size={18}
                                          fill={
                                            row.is_favorite
                                              ? "currentColor"
                                              : "none"
                                          }
                                        />{" "}
                                      </button>{" "}
                                      <div
                                        onClick={(e) => {
                                          if (row.photoUrl && !isFomoLocked) {
                                            e.stopPropagation();
                                            setLightboxPhoto(row.photoUrl);
                                          }
                                        }}
                                        className={`w-10 h-10 rounded-[14px] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-200 border-[2px] border-slate-100 border-b-[4px] border-b-slate-200 dark:border-slate-600 dark:border-b-slate-900 shadow-sm transition-all duration-300 overflow-hidden ${row.photoUrl && !isFomoLocked ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-[2px]" : "group-hover:text-primary dark:group-hover:text-primary group-hover:border-primary/40 group-hover:bg-primary/5"}`}
                                      >
                                        {row.photoUrl && !isFomoLocked ? (
                                          <img src={row.photoUrl} alt={row.name} className="w-full h-full object-cover" />
                                        ) : isFomoLocked ? (
                                          <Lock size={16} className="text-slate-400" />
                                        ) : (
                                          row.name.charAt(0)
                                        )}{" "}
                                      </div>{" "}
                                      <div className="flex flex-col">
                                        <span className={`font-bold text-navy dark:text-white ${isFomoLocked ? 'filter blur-[4px] select-none' : ''}`}>
                                          {isFomoLocked ? 'متقدم مخفي (نفد الرصيد)' : row.name}
                                        </span>
                                        {row.nominatedTo && !isFomoLocked && (
                                          <div
                                            className="mt-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md inline-block font-bold w-fit max-w-[180px] truncate border border-primary/20 shadow-sm"
                                            title={`تم ترشيحه لـ: ${row.nominatedTo}`}
                                          >
                                            تم ترشيحه لـ: {row.nominatedTo}
                                          </div>
                                        )}
                                        {row.source === 'ترشيح متقاطع' && !isFomoLocked && (
                                          <div className="mt-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md inline-block font-bold w-fit border border-primary/20 shadow-sm">
                                            تم ترشيحه
                                          </div>
                                        )}
                                      </div>
                                    </div>{" "}
                                  </td>
                                  <td className="px-2 py-3">
                                    <div className="flex justify-start">
                                      <span
                                        className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-[2px] border-slate-100 border-b-[4px] border-b-slate-200 dark:border-slate-700 dark:border-b-slate-950 text-slate-700 dark:text-white px-3 py-1.5 rounded-xl text-[11px] font-black inline-flex items-center justify-center whitespace-normal break-words w-fit max-w-[250px] text-center leading-relaxed shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                                        title={row.job}
                                      >
                                        {row.job}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-2 py-3">
                                    {isAutoRejected ? (
                                      <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 bg-gradient-to-b from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-900/50 px-3 py-1.5 rounded-xl border-[2px] border-rose-100 border-b-[4px] border-b-rose-200 dark:border-rose-800 dark:border-b-rose-950 whitespace-nowrap inline-flex shadow-sm">
                                        مستبعد آلياً
                                      </span>
                                    ) : isEvaluating && !isFomoLocked ? (
                                      <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 px-3 py-1.5 rounded-xl border-[2px] border-slate-100 border-b-[4px] border-b-slate-200 dark:border-slate-700 dark:border-b-slate-950 whitespace-nowrap inline-flex items-center justify-center gap-1.5 w-fit shadow-sm">
                                        <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                        قيد الفرز
                                      </span>
                                    ) : (
                                      <div className="flex items-center justify-start gap-1.5 whitespace-nowrap">
                                        <div className={`w-16 h-2.5 rounded-full overflow-hidden ${isFomoLocked ? "bg-slate-100 dark:bg-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-slate-700/50" : row.rating >= 80 ? "bg-teal-50 dark:bg-teal-900/30 shadow-inner-3d border border-teal-100/50 dark:border-teal-800/50" : row.rating >= 50 ? "bg-amber-50 dark:bg-amber-900/30 shadow-inner-3d border border-amber-100/50 dark:border-amber-800/50" : "bg-rose-50 dark:bg-rose-900/30 shadow-inner-3d border border-rose-100/50 dark:border-rose-800/50"}`}>
                                          <div
                                            className={`h-full rounded-full transition-all duration-500 ${isFomoLocked ? "bg-slate-300 dark:bg-slate-600" : row.rating >= 80 ? "bg-teal-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" : row.rating >= 50 ? "bg-amber-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" : "bg-rose-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"}`}
                                            style={{ width: isFomoLocked ? '100%' : `${row.rating}%` }}
                                          />
                                        </div>
                                        <span className={`text-[11px] px-2 py-0.5 rounded-md font-black shadow-sm border-[1px] border-b-[2px] ${isFomoLocked ? "text-slate-400 filter blur-[4px] select-none bg-slate-100 border-slate-200" : row.rating >= 80 ? "bg-gradient-to-b from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-900/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800" : row.rating >= 50 ? "bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" : "bg-gradient-to-b from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-900/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"}`}>
                                          {isFomoLocked ? "00%" : `${row.rating}%`}
                                        </span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-2 py-3 text-right">
                                    {isFomoLocked ? (
                                      <span className="filter blur-[4px] select-none text-xs font-bold text-slate-400">مقفل</span>
                                    ) : (
                                      <span className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-[2px] border-slate-100 border-b-[4px] border-b-slate-200 dark:border-slate-700 dark:border-b-slate-950 text-slate-700 dark:text-white px-3 py-1.5 rounded-xl text-[11px] font-black inline-flex items-center justify-center whitespace-nowrap shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                                        {row.status}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-2 py-3 text-center cursor-default" onClick={(e) => e.stopPropagation()}>
                                    {isFomoLocked ? (
                                      <span className="filter blur-[4px] select-none text-xs font-bold text-slate-400">مقفل</span>
                                    ) : (
                                      <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        {row.city && row.city.trim() !== "" && row.city !== "غير محدد" ? row.city : "-"}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-2 py-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                                    <div className={`flex items-center justify-center gap-1 ${isFomoLocked ? 'filter blur-[4px] select-none pointer-events-none' : ''}`}>
                                      <a
                                        href={`https://wa.me/${row.phone}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (row.decision === "interview") {
                                            markInterviewSent(row.id);
                                          }
                                        }}
                                        className="w-8 h-8 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 rounded-lg flex items-center justify-center hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:text-teal-700 transition-all border-b-[3px] border-teal-200 dark:border-teal-800 hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-0 active:mb-[3px] shadow-sm"
                                        title="واتساب"
                                      >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                        </svg>{" "}
                                      </a>{" "}
                                      <a
                                        href={`mailto:${row.email}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (row.decision === "interview") {
                                            markInterviewSent(row.id);
                                          }
                                        }}
                                        className="w-8 h-8 bg-navy/5 dark:bg-slate-700/50 text-navy dark:text-slate-200 rounded-lg flex items-center justify-center hover:bg-navy dark:hover:bg-slate-600 hover:text-white transition-all border-b-[3px] border-slate-300 dark:border-slate-800 hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-0 active:mb-[3px] shadow-sm"
                                        title="إيميل"
                                      >
                                        <Mail size={15} />{" "}
                                      </a>{" "}
                                      <a
                                        href={`tel:${row.phone}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:blue-300 rounded-lg flex items-center justify-center hover:bg-blue-500 dark:hover:bg-blue-500/60 dark:hover:text-blue-100 hover:text-white transition-all border-b-[3px] border-blue-200 dark:border-blue-800 hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-0 active:mb-[3px] shadow-sm"
                                        title="اتصال"
                                      >
                                        <Phone size={15} />{" "}
                                      </a>{" "}
                                    </div>{" "}
                                  </td>
                                  {decisionFilter === "interview" && (
                                    <>
                                      <td className="px-2 py-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-center">
                                          {isFomoLocked ? (
                                            <span className="filter blur-[4px] select-none text-xs text-slate-400 font-bold">مقفل</span>
                                          ) : row.is_interview_completed ? (
                                            <span className="bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800/30 px-3 py-1.5 rounded-xl text-[11px] font-bold inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                                              <Mic size={13} /> تمت المقابلة
                                            </span>
                                          ) : (row.has_started_interview && !row.is_interview_completed) ? (
                                            <span className="bg-purple-50 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30 px-3 py-1.5 rounded-xl text-[11px] font-bold inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                                              <Clock size={13} /> جاري المقابلة
                                            </span>
                                          ) : (!row.interview_revoked && (!row.interview_sent_at || (Date.now() - new Date(row.interview_sent_at).getTime() <= 72 * 60 * 60 * 1000)) && (row.interview_sent || row.decision === "interviewing")) ? (
                                            <span className="bg-orange-50 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30 px-3 py-1.5 rounded-xl text-[11px] font-bold inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                                              <Clock size={13} /> بانتظار المتقدم
                                            </span>
                                          ) : (
                                            <span className="text-slate-400 dark:text-slate-500 font-bold flex justify-center w-full">
                                              -
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-2 py-3 text-center cursor-default" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-center items-center h-full">
                                          {isFomoLocked ? (
                                            <span className="filter blur-[4px] select-none text-xs text-slate-400 font-bold">مقفل</span>
                                          ) : row.is_interview_completed && row.interview_score !== undefined && row.interview_score !== null ? (
                                            <span className="font-black text-navy dark:text-white text-[15px]">
                                              {row.interview_score}<span className="text-slate-400 dark:text-slate-500 text-xs font-bold">/10</span>
                                            </span>
                                          ) : (
                                            <span className="text-slate-400 dark:text-slate-500 font-bold flex justify-center w-full">-</span>
                                          )}
                                        </div>
                                      </td>
                                    </>
                                  )}
                                  <td className="px-2 py-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-1.5 w-full pl-4">
                                      {isFomoLocked ? (
                                        <div className="flex justify-center w-full">
                                          <span className="bg-primary/10 text-primary dark:bg-primary/20 px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap select-none border border-primary/20">
                                            <Lock size={13} /> مقفل
                                          </span>
                                        </div>
                                      ) : row.decision === "filtered" ? (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDecision(row.id, "pending");
                                          }}
                                          className="flex items-center justify-center gap-1 border border-primary border-b-[3px] border-b-primary/60 text-primary hover:bg-primary hover:text-white dark:border-primary/50 dark:hover:bg-primary px-3 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-[1px] shadow-sm"
                                          title="استعادة"
                                        >
                                          <RotateCcw size={14} /> استعادة
                                        </button>
                                      ) : ["accepted", "rejected", "interview"].includes(row.decision || "") || decisionFilter === "interview" || decisionFilter === "accepted" || decisionFilter === "rejected" ? (
                                        <>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              e.preventDefault();
                                              setUndoTargetId(row.id);
                                              setShowUndoConfirmModal(true);
                                            }}
                                            className="flex items-center justify-center gap-1 border-2 border-slate-300 dark:border-slate-600 border-b-[4px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 hover:border-slate-400 dark:hover:bg-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-[2px] shadow-md"
                                            title="تراجع"
                                          >
                                            <RotateCcw size={14} /> تراجع
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDecision(row.id, "accepted"); }}
                                            disabled={isEvaluating}
                                            className={`flex items-center justify-center gap-1 bg-teal-50 text-teal-600 hover:bg-teal-100 hover:text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50 dark:hover:text-teal-300 border-b-[3px] border-teal-200 dark:border-teal-800 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${isEvaluating ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-0 active:mb-[3px]'}`}
                                            title="قبول"
                                          >
                                            <CheckCircle size={14} /> قبول
                                          </button>
                                          <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDecision(row.id, "interview"); }}
                                            disabled={isEvaluating}
                                            className={`flex items-center justify-center gap-1 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 dark:hover:bg-amber-900/50 dark:hover:text-amber-400 border-b-[3px] border-amber-200 dark:border-amber-800 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${isEvaluating ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-0 active:mb-[3px]'}`}
                                            title="مقابلة"
                                          >
                                            مقابلة
                                          </button>
                                          <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDecision(row.id, "rejected"); }}
                                            disabled={isEvaluating}
                                            className={`flex items-center justify-center gap-1 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:bg-rose-900/30 dark:text-rose-500 dark:hover:bg-rose-900/50 dark:hover:text-rose-400 border-b-[3px] border-rose-200 dark:border-rose-800 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${isEvaluating ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-0 active:mb-[3px]'}`}
                                            title="رفض"
                                          >
                                            <X size={14} /> رفض
                                          </button>
                                        </>
                                      )}
                                      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); onViewDetails(row); }}
                                        disabled={isFomoLocked || isEvaluating}
                                        className={`flex items-center justify-center gap-1 bg-white text-navy border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all border-b-[3px] border-slate-300 dark:border-slate-600 shadow-sm ${isFomoLocked || isEvaluating ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-0 active:mb-[3px] hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                        title="عرض الملف"
                                      >
                                        <FileText size={14} /> عرض الملف{" "}
                                      </button>
                                      <div className="relative">
                                        <button
                                          disabled={isFomoLocked || isEvaluating}
                                          onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === row.id ? null : row.id); }}
                                          className={`flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 transition-colors ${isFomoLocked || isEvaluating ? 'opacity-50 cursor-not-allowed' : 'hover:text-navy hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                        >
                                          <MoreVertical size={16} />
                                        </button>

                                        {(() => {
                                          const isNearBottom = index >= visibleApplicants.length - 2 && visibleApplicants.length > 2;
                                          return (
                                            <AnimatePresence>
                                              {openDropdownId === row.id && (
                                                <>
                                                  <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); }}
                                                  />
                                                  <motion.div
                                                    initial={{ opacity: 0, y: isNearBottom ? -10 : 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    style={{ left: 0, right: 'auto' }}
                                                    className={`absolute w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 dark:border-slate-700 py-2 z-50 overflow-hidden ${isNearBottom ? "bottom-[110%]" : "mt-2 top-full"}`}
                                                  >
                                                    <button
                                                      onClick={(e) => { e.stopPropagation(); handleToggleFavorite(row.id); setOpenDropdownId(null); }}
                                                      className="w-full text-right px-4 py-3 text-sm font-bold text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                                                    >
                                                      <Star size={16} className={row.is_favorite ? "text-yellow-500" : "text-slate-400"} fill={row.is_favorite ? "currentColor" : "none"} />
                                                      {row.is_favorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                                                    </button>
                                                    {row.in_talent_pool ? (
                                                      <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveFromPool(row.id); }}
                                                        className="w-full text-right px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
                                                      >
                                                        <Database size={16} className="text-red-500" /> إزالة من بنك الكفاءات
                                                      </button>
                                                    ) : (
                                                      <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMoveToPool(row); }}
                                                        className="w-full text-right px-4 py-3 text-sm font-bold text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                                                      >
                                                        <Database size={16} className="text-slate-400" /> إضافة إلى بنك الكفاءات
                                                      </button>
                                                    )}
                                                    <button
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setCrossNominateApplicant(row);
                                                        setCrossNominateJobId(jobs.find(j => j.title === row.job)?.id || jobs.find(j => j.status === "نشط")?.id || "");
                                                        setOpenDropdownId(null);
                                                      }}
                                                      className="w-full text-right px-4 py-3 text-sm font-bold text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                                                    >
                                                      <Briefcase size={16} className="text-primary" /> ترشيح لوظيفة أخرى
                                                    </button>

                                                  </motion.div>
                                                </>
                                              )}
                                            </AnimatePresence>
                                          );
                                        })()}
                                      </div>
                                    </div>{" "}
                                  </td>
                                </motion.tr>
                              );
                            })}
                            {visibleApplicants.some((row) => plan === 'free' && row.status === "قيد الانتظار" && cvsRemaining <= 0) && (
                              <tr>
                                <td colSpan={100} className="p-0">
                                  <div className="absolute left-0 w-full flex justify-center z-10 -translate-y-full pb-8 pointer-events-auto">
                                    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-primary/20 text-center max-w-md mx-auto relative overflow-hidden">
                                      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 -z-10 translate-x-1/2" />
                                      <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner-3d">
                                        <Lock size={32} />
                                      </div>
                                      <h4 className="text-xl font-black text-navy dark:text-white mb-2 tracking-tight">نفد رصيد السير الذاتية 🔒</h4>
                                      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6 leading-relaxed">للوصول إلى السير الذاتية الإضافية وإجراء الفرز الذكي، يرجى شراء باقة إضافية.</p>
                                      <button onClick={() => {
                                        setAddonsBoughtThisMonth(prev => prev + 1);
                                        if (addonsBoughtThisMonth >= 2 && plan !== 'enterprise') {
                                          setShowSoftUpgradeModal(true);
                                        } else {
                                          alert("سيتم توجيهك لبوابة الدفع لشراء 500 سيرة بـ 149 ريال...");
                                        }
                                      }} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-[0.98] shadow-lg shadow-purple-600/20">شراء 500 سيرة بـ 149 ريال</button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

            {/* Soft Upgrade Modal */}
            <AnimatePresence>
              {showSoftUpgradeModal && (
                <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
                  >
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-primary/20 to-teal-400/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl" />
                    <button
                      onClick={() => setShowSoftUpgradeModal(false)}
                      className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors z-10"
                    >
                      <X size={16} />
                    </button>

                    <div className="relative z-10 flex flex-col items-center text-center">

                      <h3 className="text-2xl sm:text-3xl font-black mb-4 bg-gradient-to-r from-navy via-primary to-teal-600 dark:from-white dark:via-primary dark:to-teal-400 bg-clip-text text-transparent">
                        وفر أموالك ورقي باقتك!
                      </h3>

                      <p className="text-slate-600 dark:text-slate-300 font-medium mb-8 leading-relaxed text-sm sm:text-base px-2">
                        لاحظنا أنك تدفع للإضافات بشكل متكرر! يمكنك توفير أكثر من <span className="text-primary font-black">30%</span> من تكاليفك الحالية، والحصول على مميزات لا محدودة عند الترقية إلى <strong className="text-navy dark:text-white">باقة الأعمال</strong>.
                      </p>

                      <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 mb-8 text-right space-y-4 shadow-sm">
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle size={14} />
                          </div>
                          رصيد 5000 سيرة ذاتية شهرياً
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle size={14} />
                          </div>
                          15 إعلان وظيفي نشط
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle size={14} />
                          </div>
                          15 مقابلة صوتية بالذكاء الاصطناعي
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                          onClick={() => {
                            setShowSoftUpgradeModal(false);
                            setActiveTab("باقات فرز");
                          }}
                          className="flex-1 bg-gradient-to-b from-primary to-[#0e988c] hover:from-[#0e988c] hover:to-primary text-white py-3.5 rounded-xl font-bold transition-all active:scale-[0.95] text-sm shadow-[0_4px_0_#09736A,0_5px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0_#09736A,0_3px_5px_rgba(0,0,0,0.2)] hover:translate-y-[2px]"
                        >
                          الترقية
                        </button>
                        <button
                          onClick={() => {
                            const dismissedKey = `dismissed_upsell_${plan}_${(userProfile as any)?.subscription_end_date || 'none'}`;
                            window.localStorage.setItem(dismissedKey, "true");
                            setShowSoftUpgradeModal(false);
                            alert("سيتم توجيهك لبوابة الدفع لشراء 500 سيرة بـ 149 ريال...");
                          }}
                          className="flex-1 bg-gradient-to-b from-white to-[#f0fbf9] hover:from-[#f0fbf9] hover:to-[#e1f7f4] text-teal-900 border border-teal-100 py-3.5 rounded-xl font-bold transition-all active:scale-[0.95] text-sm shadow-[0_4px_0_#ccfbf1,0_5px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_0_#ccfbf1,0_3px_5px_rgba(0,0,0,0.05)] hover:translate-y-[2px]"
                        >
                          الاستمرار بالدفع 149 ريال
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      case "إدارة الوظائف":

        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row items-center justify-end gap-6">
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
                  className="bg-gradient-to-b from-primary to-[#0d847a] text-white px-8 py-4 rounded-2xl font-bold shadow-[0_6px_0_#096159,0_12px_20px_rgba(13,148,136,0.3)] hover:shadow-[0_4px_0_#096159,0_8px_15px_rgba(13,148,136,0.3)] hover:translate-y-[2px] active:shadow-[0_0px_0_#096159] active:translate-y-[6px] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Briefcase size={20} /> إنشاء إعلان وظيفي
                </button>
              </div>{" "}
            </header>{" "}
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 w-full mb-4">
              <div className="flex flex-wrap bg-white dark:bg-slate-800 p-2 gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit shrink-0">
                <button
                  onClick={() => setSubTab("active")}
                  className={`flex items-center justify-center gap-2.5 flex-1 px-6 md:px-8 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 ${subTab === "active" ? "bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80 text-primary dark:text-teal-400 shadow-[0_4px_0_#e2e8f0,0_5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_0_#0f172a,0_5px_15px_rgba(0,0,0,0.2)] -translate-y-[3px]" : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white"}`}
                >
                  <div className={`w-2 h-2 rounded-full shadow-sm ${subTab === "active" ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-600"}`}></div>
                  النشطة ({activeJobsList.length}){" "}
                </button>{" "}
                <button
                  onClick={() => setSubTab("paused")}
                  className={`flex items-center justify-center gap-2.5 flex-1 px-6 md:px-8 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 ${subTab === "paused" ? "bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80 text-primary dark:text-teal-400 shadow-[0_4px_0_#e2e8f0,0_5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_0_#0f172a,0_5px_15px_rgba(0,0,0,0.2)] -translate-y-[3px]" : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white"}`}
                >
                  <div className={`w-2 h-2 rounded-full shadow-sm ${subTab === "paused" ? "bg-amber-400" : "bg-slate-300 dark:bg-slate-600"}`}></div>
                  مغلق مؤقتاً ({pausedJobsList.length}){" "}
                </button>{" "}
                <button
                  onClick={() => setSubTab("inactive")}
                  className={`flex items-center justify-center gap-2.5 flex-1 px-6 md:px-8 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 ${subTab === "inactive" ? "bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80 text-primary dark:text-teal-400 shadow-[0_4px_0_#e2e8f0,0_5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_0_#0f172a,0_5px_15px_rgba(0,0,0,0.2)] -translate-y-[3px]" : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white"}`}
                >
                  <div className={`w-2 h-2 rounded-full shadow-sm ${subTab === "inactive" ? "bg-red-400" : "bg-slate-300 dark:bg-slate-600"}`}></div>
                  مغلق دائم ({inactiveJobsList.length}){" "}
                </button>{" "}
                <button
                  onClick={() => setSubTab("drafts")}
                  className={`flex items-center justify-center gap-2.5 flex-1 px-6 md:px-8 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 ${subTab === "drafts" ? "bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80 text-primary dark:text-teal-400 shadow-[0_4px_0_#e2e8f0,0_5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_0_#0f172a,0_5px_15px_rgba(0,0,0,0.2)] -translate-y-[3px]" : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white"}`}
                >
                  <div className={`w-2 h-2 rounded-full shadow-sm ${subTab === "drafts" ? "bg-amber-400" : "bg-slate-300 dark:bg-slate-600"}`}></div>
                  المسودات ({draftJobsList.length}){" "}
                </button>{" "}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto shrink-0">
                {subTab === "drafts" && draftJobsList.length > 0 && onDeleteAllDrafts && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowBulkDeleteDraftsModal(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm w-full sm:w-auto"
                  >
                    <Trash2 size={18} /> مسح جميع المسودات
                  </button>
                )}

                <div className="w-full sm:w-auto relative min-w-[250px] lg:min-w-[300px]">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type="text"
                    placeholder="ابحث باسم المسمى الوظيفي أو الرقم..."
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pr-11 pl-4 py-3.5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium dark:text-white dark:placeholder-slate-400"
                  />
                  {jobSearchQuery && (
                    <button
                      onClick={() => setJobSearchQuery("")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>{" "}
            <ActiveJobs
              subTab={subTab}
              isLoading={isLoadingJobs}
              isNewUser={jobs.filter(j => j.status !== "مسودة").length === 0 && !isLoadingJobs}
              jobs={subTab === "active" ? activeJobsList : subTab === "paused" ? pausedJobsList : subTab === "inactive" ? inactiveJobsList : draftJobsList}
              onManage={onManageJob}
              onCreateJob={onCreateJob}
              onClone={onCloneJob}
              onDeactivate={onDeactivateJob}
              onReactivate={onReactivateJob}
              onDelete={(id) => setDraftToDelete(id)}
              cvLimitReached={cvsRemaining <= 0 && cvLimit > 0}
              plan={plan}
              isLoading={isLoadingApplicants || !userProfile.isLoaded}
              onUpgrade={() => { setActiveTab("الحساب"); setTimeout(() => window.dispatchEvent(new CustomEvent('changeSettingsTab', { detail: 'باقات فرز' })), 50); }}
            />{" "}
          </div>
        );
      case "بنك الكفاءات":
        return (
          <TalentPool
            jobs={jobs}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={handleToggleFavorite}
            onCreateJob={onCreateJob}
            onViewDetails={onViewDetails}
            talentPool={talentPool}
            externalApplicants={applicants}
            isLoading={isLoadingApplicants || !userProfile.isLoaded}
            onCrossNominate={(applicant) => {
              setCrossNominateApplicant(applicant);
              setCrossNominateJobId(jobs.find(j => j.title === applicant.job)?.id || jobs.find(j => j.status === "نشط")?.id || "");
            }}
          />
        );
      case "التقارير":
        return (
          <div className="space-y-6">
            <GlobalJobSelector
              jobs={jobs}
              selectedFilter={jobFilter}
              onFilterChange={setJobFilter}
            />{" "}
            <Reports jobs={syncedJobs} filterId={jobFilter} applicants={applicants} isLoading={isLoadingApplicants || !userProfile.isLoaded} />{" "}
          </div>
        );
      case "الحساب":
      case "باقات فرز":
        return <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} userProfile={userProfile} setUserProfile={setUserProfile} userEmail={userEmail || ""} initialTab={activeTab === "باقات فرز" ? "باقات فرز" : "الملف الشخصي"} />;
      default:
        return (
          <div className="p-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-2">الصفحة غير موجودة</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">عذراً، لم نتمكن من العثور على القسم المطلوب. قد يكون تم نقله أو إزالته.</p>
            <button onClick={() => setActiveTab('الرئيسية')} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all">
              العودة للرئيسية
            </button>
          </div>
        );
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
            {toastMessage.includes("لا يوجد") ? (
              <AlertTriangle size={20} className="text-amber-500" />
            ) : (
              <CheckCircle size={20} className="text-primary" />
            )}
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

                <div className="relative">
                  <select
                    value={crossNominateJobId}
                    onChange={(e) => setCrossNominateJobId(e.target.value)}
                    className="w-full pr-5 pl-12 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl outline-none focus:border-primary font-medium appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-white text-navy dark:bg-slate-800 dark:text-white">-- اختر وظيفة نشطة --</option>
                    {jobs.filter(j => j.status === "نشط").map(j => (
                      <option key={j.id} value={j.id} className="bg-white text-navy dark:bg-slate-800 dark:text-white">{j.title}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
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








        {/* Sidebar */}{" "}
        <aside className={`${isSidebarOpen ? 'w-80' : 'w-20'} bg-navy text-white hidden lg:flex flex-col shrink-0 shadow-2xl z-20 transition-all duration-300`}>
          <div className={`sticky top-0 h-screen w-full flex flex-col ${isSidebarOpen ? 'p-8' : 'p-4'} overflow-y-auto hide-scrollbar`}>
            <div className="flex flex-col gap-6 mb-12">
              <div className={`flex ${isSidebarOpen ? 'items-center gap-4' : 'flex-col items-center gap-5'} px-2`}>
                <LogoIcon />{" "}
                {isSidebarOpen && (
                  <span className="text-3xl font-black tracking-tighter text-white flex-1">
                    فرز
                  </span>
                )}{" "}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  title={isSidebarOpen ? 'تصغير القائمة' : 'توسيع القائمة'}
                  className={`w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all shrink-0 ${isSidebarOpen ? 'ml-auto' : ''}`}
                >
                  {isSidebarOpen ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
                </button>
              </div>

              <div className={`flex px-2 ${isSidebarOpen ? 'justify-end' : 'justify-center'}`}>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
                  className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>{" "}
            <nav className="space-y-1.5 flex-1 pb-2">
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
                  className={`w-full flex items-center ${isSidebarOpen ? "gap-4 px-5 py-2.5 justify-start" : "justify-center p-3"} rounded-2xl transition-all font-semibold ${activeTab === item.name ? "bg-mint text-employer-green shadow-xl shadow-mint/30" : "text-slate-400 dark:text-slate-500 hover:text-slate-200 hover:bg-slate-700/50"}`}
                >
                  <div className={`transition-transform duration-300 ${isSidebarOpen ? "" : "scale-110"}`}>{item.icon}</div> {isSidebarOpen && <span>{item.name}</span>}{" "}
                </button>
              ))}{" "}
            </nav>{" "}
            <div className="mt-auto flex flex-col gap-4 pt-6 shrink-0">
              {!isSidebarOpen && (
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl transition-all text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:text-red-300"
                  title="تسجيل الخروج"
                >
                  <LogOut size={18} className="shrink-0" />
                </button>
              )}

              <div className="border-t border-white/10 dark:border-slate-700/10 w-full my-1" />

              <div className={`flex items-center ${isSidebarOpen ? 'gap-3 p-3 bg-white/5 dark:bg-slate-800/30 rounded-2xl border border-white/10 dark:border-slate-700' : 'justify-center w-full'} transition-all duration-300`}>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-primary overflow-hidden shrink-0 flex items-center justify-center">
                  {userProfile?.avatar || userProfile?.companyLogo ? (
                    <img src={userProfile?.avatar || userProfile?.companyLogo} alt="Admin" referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"; }} />
                  ) : (
                    <User className="text-slate-400" size={20} />
                  )}
                </div>
                {isSidebarOpen && (<div className="overflow-hidden flex-1">
                  <p className="text-sm font-bold text-white">
                    {(userProfile?.name || "مستخدم جديد").length > 25 ? (userProfile?.name || "مستخدم جديد").substring(0, 25) + "..." : (userProfile?.name || "مستخدم جديد")}
                  </p>
                  {userProfile?.title && <p className="text-[10px] text-slate-400 truncate mt-0.5">{userProfile?.title}</p>}
                </div>)}
                {isSidebarOpen && (
                  <button
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shrink-0"
                    title="تسجيل الخروج"
                  >
                    <LogOut size={16} />
                  </button>
                )}
              </div>


              {/* Usage Widget */}
              {isSidebarOpen && (<div className="bg-slate-800/40 rounded-2xl p-4 pt-5 border border-slate-700/50 space-y-4 relative mt-3">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1b2537] border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold text-primary flex items-center gap-1.5 shadow-md whitespace-nowrap">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_rgba(13,148,136,0.8)]"></div>
                  {plan === 'startup' || plan === 'growth' ? 'نمو' : plan === 'business' ? 'أعمال' : plan === 'enterprise' ? 'الشركات الكبرى' : plan === 'single_job' || plan === 'one-time' ? 'التوظيف الفوري' : (
                    <span className="flex items-center gap-1">
                      المجانية
                      {userProfile?.subscription_end_date && (
                        <span>
                          متبقي {Math.max(0, Math.ceil((new Date(userProfile.subscription_end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} يوم
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                  <span>الوظائف النشطة</span>
                  <span dir="ltr">{plan === 'enterprise' ? '∞' : `${jobLimit} / ${activeCount}`}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 bg-primary`}
                    style={{ width: plan === 'enterprise' ? '100%' : `${Math.min(100, (activeCount / (jobLimit || 1)) * 100)}%` }}
                  />
                </div>

                <div className={`flex justify-between items-center text-xs font-bold text-slate-300 pt-2 ${plan === 'free' && cvsRemaining <= 0 ? 'mt-2' : 'border-t border-slate-700/50'}`}>
                  {plan === 'free' ? (
                    cvsRemaining <= 0 ? (
                      <div
                        onClick={() => setActiveTab('باقات فرز')}
                        className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary py-2.5 px-3 rounded-xl cursor-pointer hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm group"
                      >
                        <Lock size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold whitespace-nowrap">الباقة منتهية - اضغط للترقية</span>
                      </div>
                    ) : (
                      <>
                        <span>رصيد السير الذاتية</span>
                        <span dir="ltr">{cvLimit} / {cvsRemaining}</span>
                      </>
                    )
                  ) : (
                    <>
                      <span>رصيد السير الذاتية</span>
                      <span dir="ltr">{plan === 'enterprise' ? '∞' : `${cvLimit} / ${cvsRemaining}`}</span>
                    </>
                  )}
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cvsRemaining <= 0 && cvLimit > 0 ? 'bg-red-500' : cvColor}`}
                    style={{ width: plan === 'enterprise' ? '100%' : `${Math.min(100, (cvsRemaining / (cvLimit || 1)) * 100)}%` }}
                  />
                </div>

                {/* Interviews Balance */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 pt-2 border-t border-slate-700/50">
                  <span>رصيد المقابلات</span>
                  <span dir="ltr">{plan === 'enterprise' ? '∞' : `${interviewsLimit} / ${interviewsRemaining}`}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${interviewsRemaining <= 0 && interviewsLimit > 0 ? 'bg-red-500' : interviewColor}`}
                    style={{ width: plan === 'enterprise' ? '100%' : `${Math.min(100, (interviewsRemaining / (interviewsLimit || 1)) * 100)}%` }}
                  />
                </div>
              </div>)}

            </div>
          </div>
        </aside>{" "}
        {/* Main Content */}{" "}
        <main className="flex-1 flex flex-col min-h-screen transition-all duration-300">
          {(daysLeft !== null && daysLeft <= 5 && plan !== 'free' && !userProfile?.is_auto_renew) && (
            <div className={`bg-red-100 dark:bg-red-900/50 border-b border-red-200 dark:border-red-700/50 mt-16 md:mt-0 z-10 transition-colors ${isSidebarOpen ? 'sidebar-padding-open' : 'sidebar-padding-closed'}`}>
              <div className="max-w-6xl mx-auto p-3 sm:px-8 flex items-center justify-between text-red-900 dark:text-red-100 text-sm md:text-base">
                <span className="font-bold flex items-center gap-2 max-w-[70%] leading-relaxed">
                  <span className="text-red-600 dark:text-red-400 shrink-0 text-lg">⚠️</span>
                  {daysLeft <= 0
                    ? "انتهى اشتراكك في الباقة! يرجى التجديد لتجنب توقف الخدمات."
                    : `تنبيه: سينتهي اشتراكك بعد ${daysLeft} ${daysLeft === 1 ? 'يوم' : daysLeft === 2 ? 'يومين' : 'أيام'}. يرجى التجديد لضمان استمرار الخدمة.`}
                </span>
                <button
                  onClick={() => setActiveTab('باقات فرز')}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
                >
                  تجديد الاشتراك
                </button>
              </div>
            </div>
          )}


          <div className="flex-1 p-10 pt-24 lg:pt-10 w-full min-w-0 max-w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}{" "}
              </motion.div>{" "}
            </AnimatePresence>{" "}
          </div>
        </main>{" "}

        {/* Support Button (Bottom Left) */}
        <button
          onClick={() => setIsSupportModalOpen(true)}
          title="الدعم الفني"
          className="fixed bottom-6 left-6 z-[60] w-12 h-12 rounded-full bg-mint dark:bg-primary/20 hover:bg-teal-100 dark:hover:bg-primary/30 text-primary dark:text-teal-400 border-4 border-white dark:border-slate-800 flex items-center justify-center transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
        >
          <Headset size={22} className="transition-transform group-hover:scale-110" />
        </button>

        {/* Support Modal */}
        <AnimatePresence>
          {isSupportModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 relative"
              >
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-primary/10 to-primary/20 text-primary flex items-center justify-center border-b-[3px] border-primary/20 shadow-sm">
                      <Headset size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy dark:text-white text-lg">الدعم الفني</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">نحن هنا لمساعدتك دائماً</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center relative shadow-[0_8px_16px_rgba(13,148,136,0.3),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.3)] transition-transform shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-[12px]" />
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="relative z-10 drop-shadow-sm ml-0.5 mt-0.5"
                      >
                        <path
                          d="M10 6H6V18H10"
                          stroke="#064E3B"
                          strokeWidth="2.5"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        />
                        <circle cx="14" cy="12" r="3" fill="url(#copperGrdSupport)" />
                        <defs>
                          <radialGradient
                            id="copperGrdSupport"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(14 12) rotate(90) scale(3)"
                          >
                            <stop stopColor="#FCD34D" />
                            <stop offset="1" stopColor="#92400E" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                    <button onClick={() => setIsSupportModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-110 active:scale-95">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {supportStatus === "success" ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                      </div>
                      <h4 className="font-bold text-navy dark:text-white text-xl mb-2">تم الإرسال بنجاح!</h4>
                      <p className="text-slate-500 dark:text-slate-400">شكراً لك. استلمنا رسالتك وسيقوم فريق الدعم بالتواصل معك قريباً لمعالجة الأمر.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSupportSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">كيف يمكننا مساعدتك؟</label>
                        <textarea
                          required
                          rows={4}
                          value={supportMessage}
                          onChange={(e) => setSupportMessage(e.target.value)}
                          placeholder="اكتب تفاصيل المشكلة أو الاقتراح هنا..."
                          className="w-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-slate-700 dark:text-slate-200 resize-none"
                        />
                        <div className="mt-3 flex items-center gap-3">
                          <input
                            type="file"
                            id="supportAttachment"
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setSupportFile(e.target.files[0]);
                              }
                            }}
                          />
                          <label
                            htmlFor="supportAttachment"
                            className={`cursor-pointer flex-1 flex justify-center items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all border border-dashed ${supportFile ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-400' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:border-primary dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:border-primary'}`}
                          >
                            <Upload size={16} />
                            {supportFile ? (
                              <span className="truncate max-w-[200px]" dir="ltr">{supportFile.name}</span>
                            ) : (
                              "إضافة مرفق أو صورة (اختياري)"
                            )}
                          </label>
                          {supportFile && (
                            <button
                              type="button"
                              onClick={() => setSupportFile(null)}
                              className="w-[42px] h-[42px] shrink-0 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/30"
                              title="حذف المرفق"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={supportStatus === "sending" || !supportMessage.trim()}
                        className={`w-full font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_10px_-2px_rgba(13,148,136,0.5)] border-b-[4px] hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-0 active:mt-[4px] ${(supportStatus === "sending" || !supportMessage.trim()) ? 'bg-slate-200 text-slate-400 border-slate-300 dark:bg-slate-700 dark:border-slate-800 dark:text-slate-500 cursor-not-allowed active:translate-y-0 active:border-b-[4px] active:mt-0 hover:translate-y-0 shadow-none' : 'bg-gradient-to-b from-[#0D9488] to-[#0b7c72] hover:to-[#0a6f66] border-[#075952] text-white'}`}
                      >
                        {supportStatus === "sending" ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            جاري الإرسال...
                          </>
                        ) : (
                          <>
                            <MessageCircle size={18} />
                            إرسال الرسالة
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <ImageLightbox url={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
        <AnimatePresence>
          {undoAction && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-6 font-bold min-w-[300px] justify-between"
            >
              <div className="flex items-center gap-3">
                {undoAction.targetDecision === "accepted" ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : undoAction.targetDecision === "filtered" || undoAction.targetDecision === "rejected" ? (
                  <X size={20} className="text-red-500" />
                ) : undoAction.targetDecision === "interview" ? (
                  <Calendar size={20} className="text-yellow-500" />
                ) : (
                  <CheckCircle size={20} className="text-primary" />
                )}
                <span>
                  {undoAction.targetDecision === "accepted" ? (Array.isArray(undoAction.id) ? "تم قبول المتقدمين المحددين بنجاح" : "تم قبول المتقدم بنجاح") :
                    undoAction.targetDecision === "filtered" || undoAction.targetDecision === "rejected" ? (Array.isArray(undoAction.id) ? "تم رفض وتصفية المتقدمين بنجاح" : "تم رفض المتقدم بنجاح") :
                      undoAction.targetDecision === "interview" ? "تم تحديد مقابلة للمتقدم بنجاح" :
                        "تم تحديث حالة المتقدم بنجاح"}
                </span>
              </div>
              <button
                onClick={handleUndo}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <RotateCcw size={14} /> تراجع
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Undo Confirm Modal */}
        <AnimatePresence>
          {showUndoConfirmModal && undoTargetId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
                onClick={() => {
                  setShowUndoConfirmModal(false);
                  setUndoTargetId(null);
                }}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden border border-slate-100 dark:border-slate-700 p-8 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                  <RotateCcw className="text-primary" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">
                  تأكيد التراجع
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                  هل أنت متأكد من رغبتك في التراجع عن هذا القرار وإعادة المتقدم لقيد المراجعة؟
                  {(() => {
                    const targetApp = applicants.find(a => a.id === undoTargetId);
                    if (targetApp && (targetApp.interview_sent || targetApp.decision === 'interview_sent' || targetApp.decision === 'interviewing' || targetApp.has_started_interview)) {
                      return (
                        <span className="block mt-4 text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50">
                          سيتم إبطال أي رابط مقابلة تم إرساله ولن يتمكن المتقدم من إجرائها.
                        </span>
                      );
                    }
                    return null;
                  })()}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowUndoConfirmModal(false);
                      handleDecision(undoTargetId, "pending");
                      setUndoTargetId(null);
                    }}
                    className="flex-1 bg-gradient-to-b from-[#0D9488] to-[#0b7c72] hover:to-[#0a6f66] text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_10px_-2px_rgba(13,148,136,0.5)] border-b-[3px] border-[#075952] hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-0 active:mt-[3px]"
                  >
                    نعم، تراجع
                  </button>
                  <button
                    onClick={() => {
                      setShowUndoConfirmModal(false);
                      setUndoTargetId(null);
                    }}
                    className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 py-3.5 rounded-xl font-bold transition-all border-b-[3px] border-slate-300 dark:border-slate-800 hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-0 active:mt-[3px]"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTemplatesManager && (
            <QuestionTemplatesManager onClose={() => setShowTemplatesManager(false)} mode="manage" />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBulkUndoConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-navy/40 dark:bg-navy/80 backdrop-blur-sm"
                onClick={() => setShowBulkUndoConfirm(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
              >
                <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <RotateCcw size={32} />
                </div>
                <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">تأكيد التراجع</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                  هل أنت متأكد من رغبتك في التراجع وإعادة المتقدمين المحددين لقيد المراجعة؟
                </p>
                {applicants.filter(a => selectedApplicantIds.includes(a.id)).some(a => a.decision === 'interview' || a.decision === 'interviewing' || a.interview_sent) && (
                  <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold border border-red-200 dark:border-red-800/50 mb-8 shadow-[0_4px_0_0_rgba(254,202,202,1)] dark:shadow-[0_4px_0_0_rgba(153,27,27,0.5)] transform -translate-y-1">
                    سيتم إبطال أي رابط مقابلة تم إنشاؤه، ولن يتمكن المتقدم من إجرائها.
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBulkUndoConfirm(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => {
                      handleBulkDecision("pending");
                      setShowBulkUndoConfirm(false);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
                  >
                    نعم، تراجع
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBulkSendModal && (
            <BulkSendTemplatesModal
              applicants={applicants.filter(a => selectedApplicantIds.includes(a.id))}
              onClose={() => setShowBulkSendModal(false)}
              onUpdateStatus={() => {
                // Refresh logic if needed
              }}
            />
          )}
        </AnimatePresence>


      </div>
    </>
  );
};
export default Dashboard;
