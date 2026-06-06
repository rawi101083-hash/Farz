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
  Mic,
  Square,
  RotateCcw,
  CheckSquare,
  Pencil,
  AlertTriangle,
  Linkedin,
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
import React, { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import skillsDictionaryRaw from "../skillsDictionary.json";
import { FEATURE_FLAGS } from "../config";

import { MOCK_TEST_APPLICANTS } from "../mockData";
import { ActiveJobs, Reports, EmptyState, TalentPool, GlobalJobSelector, SettingsPage, Job, Applicant, ImageLightbox, LogoIcon } from '../Shared';

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
          <span className="font-bold text-navy dark:text-white truncate max-w-[150px]">{job.title || "إعلان وظائف"}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{dateStr}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${job.status === "نشط" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"}`}>
          {job.status}
        </span>
      </div>
    );
  };

  return (
    <div className="relative z-[60]" ref={ref}>
      <div
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl cursor-pointer flex items-center justify-between hover:border-primary/50 transition-colors h-[42px] min-w-[200px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-sm text-navy dark:text-white truncate">
          {selectedFilter === "all" ? "تصفية حسب الوظيفة: الكل" : (selectedJob?.title || "كل الوظائف")}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
            <div className="max-h-64 overflow-y-auto p-2 scrollbar-thin">
              <div
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${selectedFilter === "all" ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"}`}
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
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedFilter === job.id ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
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
  // Compute Limits
  const activeCount = jobs.filter(j => j.status === 'نشط' || j.status === 'مسودة').length;
  const isPreviewMode = Date.now() < 1777221464725;
  let plan = userProfile?.subscription_tier || 'free';
  if (isPreviewMode) plan = 'free';

  const [isYearlyDev, setIsYearlyDev] = useState(false);
  const isYearly = import.meta.env.DEV ? isYearlyDev : (userProfile?.is_yearly || false);

  let jobLimit = userProfile?.jobs_limit ?? 0;
  let cvLimit = userProfile?.cv_limit ?? 0;
  let interviewsLimit = userProfile?.interviews_limit ?? 0;

  if (!jobLimit) {
    if (plan === 'free') jobLimit = 0;
    else if (plan === 'one-time') jobLimit = 1;
    else if (plan === 'startup' || plan === 'growth') jobLimit = 3;
    else if (plan === 'business') jobLimit = 10;
    else if (plan === 'enterprise') jobLimit = 100;
  }
  if (!cvLimit) {
    if (plan === 'free') cvLimit = 0;
    else if (plan === 'one-time') cvLimit = 500;
    else if (plan === 'startup' || plan === 'growth') cvLimit = isYearly ? 12000 : 1000;
    else if (plan === 'business') cvLimit = isYearly ? 60000 : 5000;
    else if (plan === 'enterprise') cvLimit = isYearly ? 180000 : 15000;
  }
  if (!interviewsLimit) {
    if (plan === 'free' || plan === 'one-time') interviewsLimit = 0;
    else if (plan === 'startup' || plan === 'growth') interviewsLimit = 100;
    else if (plan === 'business') interviewsLimit = 500;
    else if (plan === 'enterprise') interviewsLimit = 1500;
  }
  const cvsUsed = userProfile?.cvs_processed_count || 0;
  let cvsRemaining = Math.max(0, cvLimit - cvsUsed);
  if (isPreviewMode) cvsRemaining = 0;
  const cvPercent = cvLimit > 0 ? (cvsRemaining / cvLimit) * 100 : 100;
  let cvColor = 'bg-primary';
  if (cvPercent < 20) cvColor = 'bg-red-500';
  else if (cvPercent <= 50) cvColor = 'bg-amber-500';

  const interviewsUsed = userProfile?.used_interviews || 0;
  let interviewsRemaining = Math.max(0, interviewsLimit - interviewsUsed);
  if (isPreviewMode) interviewsRemaining = 0;
  const interviewPercent = interviewsLimit > 0 ? (interviewsRemaining / interviewsLimit) * 100 : 100;
  let interviewColor = 'bg-primary';
  if (interviewPercent < 20) interviewColor = 'bg-red-500';
  else if (interviewPercent <= 50) interviewColor = 'bg-amber-500';
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [applicantSearchQuery, setApplicantSearchQuery] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [decisionFilter, setDecisionFilter] = useState<"pending" | "interview" | "accepted" | "rejected" | "filtered" | "locked_fomo">("pending");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [crossNominateApplicant, setCrossNominateApplicant] = useState<Applicant | null>(null);
  const [crossNominateJobId, setCrossNominateJobId] = useState<string>("");
  const [addonsBoughtThisMonth, setAddonsBoughtThisMonth] = useState(0);
  const [showSoftUpgradeModal, setShowSoftUpgradeModal] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [isSmartSortOpen, setIsSmartSortOpen] = useState(false);
  const [smartSortState, setSmartSortState] = useState<"all" | "elite" | "latest" | "weak">(
    (localStorage.getItem("sahab_smart_sort") as any) || "all"
  );

  useEffect(() => {
    localStorage.setItem("sahab_smart_sort", smartSortState);
  }, [smartSortState]);

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (userEmail) {
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal_" + userEmail);
      if (!hasSeenWelcome) {
        setShowWelcomeModal(true);
      }
    }
  }, [userEmail]);

  const handleCloseWelcomeModal = () => {
    if (userEmail) {
      localStorage.setItem("hasSeenWelcomeModal_" + userEmail, "true");
    }
    setShowWelcomeModal(false);
  };
  const smartSortRef = useRef<HTMLDivElement>(null);
  const [subTab, setSubTabState] = useState<"active" | "inactive" | "drafts">(() => {
    return (localStorage.getItem("dashboardSubTab") as "active" | "inactive" | "drafts") || "active";

  });
  const setSubTab = (tab: "active" | "inactive" | "drafts") => {
    setSubTabState(tab);
    localStorage.setItem("dashboardSubTab", tab);
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('isSidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('isSidebarOpen', isSidebarOpen.toString());
  }, [isSidebarOpen]);
  const [applicants, setApplicantsState] = useState<Applicant[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState<boolean>(true);

    // Load from IndexedDB instantly on mount
  useEffect(() => {
    import('../lib/applicantsCache').then(({ loadFromIDB }) => {
      loadFromIDB("cache_v1").then((cachedData) => {
        if (cachedData && Array.isArray(cachedData.applicants)) {
          setApplicantsState(prev => prev.length === 0 ? cachedData.applicants : prev);
          setIsLoadingApplicants(false);
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
      try {
        const jobIds = jobs.map(j => j.id);
        if (jobIds.length === 0) {
          setApplicantsState([]);
          setIsLoadingApplicants(false);
          return;
        }

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
              if (matchedJob.recordType === 'campaign' && raw.role_index !== undefined) {
                actualJobTitle = matchedJob.roles?.[raw.role_index]?.title || matchedJob.title || "طلب غير محدد";
                actualAskExpectedSalary = matchedJob.roles?.[raw.role_index]?.askExpectedSalary || matchedJob.askExpectedSalary;
              } else {
                actualJobTitle = matchedJob.title || "طلب غير محدد";
              }
            }

            return {
              id: raw.id,
              name: raw.full_name || "متقدم جديد",
              job: actualJobTitle,
              rating: raw.match_score || raw.match_percentage || 0,
              status: (Array.isArray(raw.custom_answers) ? raw.custom_answers.find((a: any) => a.question === "مدة الانضمام / الجاهزية للعمل")?.answer : null) || raw.availability || raw.status || "غير محدد",
              expectedSalary: raw.expected_salary || "",
              askExpectedSalary: actualAskExpectedSalary,
              color: "emerald",
              phone: raw.phone || "0500000000",
              email: raw.email || "applicant@example.com",
              source: raw.source || "غير محدد",
              skills: Array.isArray(raw.skills) ? raw.skills : [],
              aiSummary: raw.ai_summary || raw.ai_justification || "قيد التحليل أو تعذر الاستخراج...",
              voiceEval: raw.voice_eval || "",
              voiceEvalUrl: raw.voice_eval || raw.voice_eval_url || "",
              customAnswers: raw.custom_answers,
              decision: (raw.decision === 'evaluated' ? 'pending' : raw.decision) || latestDecisions[raw.id] || "pending",
              rejection_reason: raw.rejection_reason || "",
              hr_notes: raw.hr_notes || "",
              cv_file_url: raw.cv_file_url,
              is_favorite: raw.is_favorite || false,
              in_talent_pool: raw.in_talent_pool || false,
              skills_match: raw.skills_match || 0,
              experience_match: raw.experience_match || 0,
              education_match: raw.education_match || 0,
              is_interview_completed: raw.is_interview_completed || false,
              interview_transcript: raw.interview_transcript || "",
              interview_summary: raw.interview_summary || "",
              interview_score: raw.interview_score || 0,
              suggested_questions: raw.suggested_questions,
              top_strengths: raw.strengths || raw.top_strengths,
              top_weaknesses: raw.weaknesses || raw.top_weaknesses,
              top_percentile: raw.top_percentile,
              red_flags: raw.red_flags,
              interview_questions: raw.interview_questions,
              attachments: raw.attachments,
              ai_justification: raw.ai_summary || raw.ai_justification
            } as any;
          });
        }

        // Fake applicants logic has been permanently removed based on user request.


        setApplicantsState(prev => {
          const next = JSON.stringify(prev) !== JSON.stringify(mappedList) ? mappedList : prev;
          
          import('../lib/applicantsCache').then(({ setGlobalApplicantsCache }) => {
            setGlobalApplicantsCache(next, currentJobsStr);
          });
          
          return next;
        });
      } catch (err) {
        console.error("Error fetching applicants:", err);
      } finally {
        setIsLoadingApplicants(false);
      }
    };

    fetchApplicants();
    
    // Supabase Realtime Subscription for instant updates without looping
    // Supabase Realtime Subscription for instant updates
    const channel = supabase
      .channel('public:applicants')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applicants' }, payload => {
        fetchApplicants();
      })
      .subscribe();

    return () => {
      
      supabase.removeChannel(channel);
    };
  }, [jobs, talentPool]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const [showBulkDeleteDraftsModal, setShowBulkDeleteDraftsModal] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
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
      const statusMatch = d === decisionFilter;
      const jobMatch = jobFilter === "all" || (a.job || "").includes(jobs.find(j => j.id === jobFilter)?.title || "");
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
      const statusMatch = d === decisionFilter;
      const jobMatch = jobFilter === "all" || (a.job || "").includes(jobs.find(j => j.id === jobFilter)?.title || "");
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
      ? (d === "interview" || d === "interviewing") 
      : d === decisionFilter;
    const jobMatch = jobFilter === "all" || (a.job || "").includes(jobs.find(j => j.id === jobFilter)?.title || "");
    const favMatch = !showFavoritesOnly || a.is_favorite === true;

    const searchLower = (applicantSearchQuery || "").toLowerCase().trim();
    const searchMatch = !searchLower || (
      a.name?.toLowerCase().includes(searchLower) ||
      a.phone?.includes(searchLower) ||
      a.email?.toLowerCase().includes(searchLower)
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

  const handleDecision = async (id: string, decision: "accepted" | "rejected" | "pending" | "interview" | "filtered") => {
    const applicant = applicants.find(a => a.id === id);
    if (!applicant) return;
    const prevDecision = applicant.decision || "pending";

    if (undoAction?.timeoutId) clearTimeout(undoAction.timeoutId);

    const targetDecision = decision;
    const updatePayload: any = { decision: targetDecision };
    if (decision === "rejected" || decision === "filtered") {
      updatePayload.rejection_reason = "استبعاد يدوي من الإدارة";
    }

    // 1. Optimistic UI update
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updatePayload } : a));

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

  const handleBulkFilterOut = async () => {
    if (selectedApplicantIds.length === 0) return;

    const idsToFilter = [...selectedApplicantIds];
    if (undoAction?.timeoutId) clearTimeout(undoAction.timeoutId);

    const updatePayload: any = { decision: "filtered", rejection_reason: "استبعاد يدوي من الإدارة" };

    // Optimistic UI Update
    setApplicants(prev => prev.map(a => idsToFilter.includes(a.id) ? { ...a, ...updatePayload } : a));

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
    setApplicants(prev => prev.map(a => idsToRestore.includes(a.id) ? { ...a, decision: prevDecision as any, rejection_reason: "" } : a));

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
    // Optimistic UI update
    setApplicants(prev => prev.map(a => a.id === applicant.id ? { ...a, in_talent_pool: true } : a));
    setToastMessage("تم نقل المرشح لبنك الكفاءات بنجاح!");
    setTimeout(() => setToastMessage(null), 3000);
    setOpenDropdownId(null);
    
    // Backend sync
    if (!applicant.id.startsWith("mock-")) {
      try {
        await supabase.from('applicants').update({ in_talent_pool: true }).eq('id', applicant.id);
      } catch (error) {
        console.warn("Could not sync talent pool state to backend:", error);
      }
    }
  };

  const handleRemoveFromPool = async (id: string) => {
    // Optimistic UI update
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, in_talent_pool: false } : a));
    setToastMessage("تمت الإزالة من بنك الكفاءات.");
    setTimeout(() => setToastMessage(null), 3000);
    setOpenDropdownId(null);
    
    // Backend sync
    if (!id.startsWith("mock-")) {
      try {
        await supabase.from('applicants').update({ in_talent_pool: false }).eq('id', id);
      } catch (error) {
        console.warn("Could not sync talent pool state to backend:", error);
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
    };

    setApplicants(prev => [...prev, clonedApplicant]);

    // Backend Sync
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
      }
    } catch (err) {
      console.error("Could not sync cross-nomination to backend", err);
    }

    setToastMessage(`تم ترشيح المتقدم للوظيفة بنجاح`);
    setTimeout(() => setToastMessage(null), 3000);
    setCrossNominateApplicant(null);
    setCrossNominateJobId("");
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
  const syncedJobs = jobs.map(j => ({ ...j, company: j.company || userProfile?.companyName || userProfile?.name || "", applicants: applicants.filter(a => (a.job || "").includes(j.title || "")).length }));
  const filteredSearchJobs = syncedJobs.filter((j) =>
    !jobSearchQuery ||
    (j.title || j.campaignTitle || "").toLowerCase().includes(jobSearchQuery.toLowerCase())
  );

  const activeJobsList = filteredSearchJobs.filter((j) => !isJobExpired(j) && j.status !== "مسودة");
  const inactiveJobsList = filteredSearchJobs.filter((j) => isJobExpired(j) && j.status !== "مسودة");
  const draftJobsList = filteredSearchJobs.filter((j) => j.status === "مسودة");
  const renderContent = () => {
    switch (activeTab) {
      case "الفرز السريع":
        return FEATURE_FLAGS.enable_fast_sorting ? <div className="p-8 text-center">صفحة الفرز السريع غير متاحة حالياً</div> : null;
      case "الرئيسية":
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="relative flex justify-between items-center w-full mb-8">
              <div className="flex items-center">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
                  className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white flex items-center justify-center transition-all"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
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
                    if (plan === 'free' || plan === 'none') {
                      setToastMessage("يجب الاشتراك في إحدى الباقات لإضافة إعلان وظيفي");
                      setActiveTab("باقات فرز");
                      setTimeout(() => setToastMessage(null), 3000);
                      return;
                    }
                    if (activeCount >= jobLimit) {
                      setToastMessage(`وصلت للحد الأقصى للوظائف المسموحة في باقتك (${jobLimit} وظائف)`);
                      setTimeout(() => setToastMessage(null), 3000);
                      return;
                    }
                    onCreateJob();
                  }}
                  className={`px-4 md:px-8 py-3 md:py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm md:text-base whitespace-nowrap ${(plan === 'free' || plan === 'none') ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-primary text-white hover:shadow-lg hover:shadow-primary/30'}`}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-inner-3d`}
                        >
                          {stat.icon}{" "}
                        </div>{" "}
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl ${stat.change.includes("+") ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                        >
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
              <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 dark:bg-slate-800/50">
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
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${isSelectionMode ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 border border-transparent' : 'bg-white text-navy border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700'}`}
                  >
                    <CheckSquare size={18} />
                    <span className="whitespace-nowrap w-[85px] text-center">{isSelectionMode ? "إلغاء التصفية" : "تصفية"}</span>
                  </button>
                  <AnimatePresence>
                    {isSelectionMode && selectedApplicantIds.length > 0 && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={handleBulkFilterOut}
                        className="bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/50 transition-all flex items-center gap-2"
                      >
                        <Trash2 size={18} /> تصفية المحدد ({selectedApplicantIds.length})
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <CompactJobSelector jobs={jobs} selectedFilter={jobFilter} onFilterChange={(id) => setJobFilter(id)} />
                  <div className="flex bg-slate-100/50 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto hide-scrollbar max-w-full">
                    {[
                      { id: "pending", label: "قيد المراجعة", color: "text-navy dark:text-white" },
                      { id: "interview", label: "المقابلات", color: "text-yellow-600 dark:text-yellow-400" },
                      { id: "accepted", label: "المقبولين", color: "text-green-600 dark:text-green-400" },
                      { id: "rejected", label: "المرفوضين", color: "text-red-600 dark:text-red-400" },
                      { id: "filtered", label: "تمت تصفيتهم", color: "text-slate-500 dark:text-slate-400" },
                      { id: "locked_fomo", label: "مقفل (سير إضافية)", color: "text-purple-600 dark:text-purple-400" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setDecisionFilter(tab.id as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${decisionFilter === tab.id ? `bg-white dark:bg-slate-700 shadow-sm ${tab.color}` : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                      >
                        {tab.label}
                        {tab.id === "locked_fomo" && (
                          <Lock size={12} className="inline ml-1 mb-0.5" />
                        )}
                      </button>
                    ))}
                  </div>{" "}





          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 border ${showFavoritesOnly ? 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'}`}
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
                    className="bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-100 dark:hover:bg-green-900/60 transition-all shadow-sm flex items-center gap-2"
                  >
                    <Download size={18} /> تصدير CSV{" "}
                  </button>{" "}
                  <div className="relative" ref={smartSortRef}>
                    <button
                      onClick={() => setIsSmartSortOpen(!isSmartSortOpen)}
                      className={`relative hover:from-indigo-500 hover:to-purple-500 text-white border border-indigo-400/50 dark:border-indigo-500/30 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-between overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-600 w-48`}
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-2xl" />
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
                              className={`w-full text-right px-4 py-3 text-sm font-bold flex items-center gap-3 transition-colors ${smartSortState === "all" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                            >
                              <Filter size={16} className={smartSortState === "all" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"} />
                              عرض الكل (الافتراضي)
                            </button>
                            <button
                              onClick={handleSetEliteSort}
                              className={`w-full text-right px-4 py-3 text-sm font-bold flex items-center gap-3 transition-colors ${smartSortState === "elite" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                            >
                              <Star size={16} className={smartSortState === "elite" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"} />
                              الأعلى مطابقة (+80%)
                            </button>
                            <button
                              onClick={handleSetWeakSort}
                              className={`w-full text-right px-4 py-3 text-sm font-bold flex items-center gap-3 transition-colors ${smartSortState === "weak" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                            >
                              <AlertTriangle size={16} className={smartSortState === "weak" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"} />
                              غير المطابقين (-50%)
                            </button>
                            <button
                              onClick={() => { setSmartSortState("latest"); setIsSmartSortOpen(false); }}
                              className={`w-full text-right px-4 py-3 text-sm font-bold flex items-center gap-3 transition-colors ${smartSortState === "latest" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                            >
                              <Clock size={16} className={smartSortState === "latest" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"} />
                              الأحدث تسجيلاً
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="overflow-x-auto min-h-[60vh]">
                <table className="w-full text-right">
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
                              className={`w-5 h-5 mx-auto rounded-[6px] border flex items-center justify-center cursor-pointer transition-all ${visibleApplicants.length > 0 && selectedApplicantIds.length === visibleApplicants.length ? "bg-primary border-primary text-white" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-50 hover:opacity-100 hover:border-slate-400"}`}
                            >
                              {visibleApplicants.length > 0 && selectedApplicantIds.length === visibleApplicants.length && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold">الكل</span>
                          </div>
                        </th>
                      )}
                      <th className="px-2 pr-14 py-4 font-bold text-navy dark:text-white text-right whitespace-nowrap">اسم المتقدم</th>
                      <th className="px-2 py-4 font-bold text-navy dark:text-white text-right whitespace-nowrap">الوظيفة المقدم إليها</th>
<th className="px-2 py-4 font-bold text-navy dark:text-white text-right whitespace-nowrap">التقييم الآلي</th>
                      <th className="px-2 py-4 font-bold text-navy dark:text-white text-right whitespace-nowrap">الجاهزية</th>
                      <th className="px-2 py-4 font-bold text-navy dark:text-white text-center whitespace-nowrap">معلومات التواصل</th>
                      {decisionFilter === "interview" && (
                        <th className="px-2 py-4 font-bold text-navy dark:text-white text-center whitespace-nowrap">حالة المقابلة</th>
                      )}
                      <th className="px-2 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 w-max ml-auto pl-4">
                          <div className="flex justify-center text-navy dark:text-white font-bold w-[200px]">
                            الإجراءات
                          </div>
                          <div className="w-px h-5 mx-1 opacity-0"></div>
                          <div className="w-[126px] opacity-0"></div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length === 0 ? (
                      <tr>
                        <td colSpan={isSelectionMode ? 7 : 6} className="p-0">
                          <EmptyState
                            title="لوحة التحكم بانتظارك! لم تقم بإنشاء أي شواغر وظيفية حتى الآن."
                            actionLabel="أنشئ إعلان وظيفي الآن"
                            onAction={onCreateJob}
                          />
                        </td>
                      </tr>
                    ) : isLoadingApplicants && applicants.length === 0 ? (
                      <tr>
                        <td colSpan={isSelectionMode ? 7 : 6} className="p-8">
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
                    ) : visibleApplicants.length === 0 ? (
                      <tr>
                        <td colSpan={isSelectionMode ? 7 : 6} className="p-0">
                          <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white dark:bg-slate-800/50">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner-3d">
                              <Search size={32} className="text-slate-300 dark:text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-navy dark:text-white mb-2">
                              {decisionFilter === "accepted" ? "لا يوجد مرشحين مقبولين حالياً" : decisionFilter === "rejected" ? "لا يوجد مرشحين مرفوضين حالياً" : decisionFilter === "interview" ? "لا يوجد مرشحين في مرحلة المقابلة حالياً" : decisionFilter === "filtered" ? "لا يوجد مرشحين في قائمة التصفية" : decisionFilter === "locked_fomo" ? "لا توجد سير ذاتية مقفلة حالياً" : "لا يوجد مرشحين قيد المراجعة في الوقت الحالي"}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                              لم يتم العثور على أي مرشح مطابق لخيارات التصفية الحالية.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {visibleApplicants.map((row, index) => {
                          const isFomoLocked = row.decision === "locked_fomo" || (plan === 'free' && (row.status === "قيد الانتظار" || (isPreviewMode && index > 0)) && cvsRemaining <= 0);
                          return (
                            <motion.tr
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              key={row.id}
                              onClick={() => {
                                if (!isFomoLocked) {
                                  onViewDetails(row);
                                }
                              }}
                              className={`transition-colors group ${isFomoLocked ? 'bg-slate-50/50 dark:bg-slate-800/30' : 'hover:bg-slate-50 dark:bg-slate-800/80 cursor-pointer'}`}
                            >
                              {isSelectionMode && (
                                <td className="px-3 py-4 w-10">
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
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    )}
                                  </div>
                                </td>
                              )}
                              <td className="px-2 py-3">
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(row.id); }}
                                    className={`transition-all ${row.is_favorite ? "text-yellow-500 scale-75" : "text-slate-200 hover:text-yellow-500"}`}
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
                                    className={`w-10 h-10 rounded-[14px] bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-200 shadow-inner-3d transition-colors overflow-hidden ${row.photoUrl && !isFomoLocked ? "cursor-pointer hover:opacity-80" : "group-hover:text-primary dark:group-hover:text-primary group-hover:bg-primary/10 dark:group-hover:bg-primary/20"}`}
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
                                    {isFomoLocked && (
                                      <div className="mt-1 text-[10px] bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md inline-block font-bold w-fit border border-purple-100 dark:border-purple-800/30 shadow-sm">
                                        خبرة: {row.voiceEval || "غير محدد"}
                                      </div>
                                    )}
                                    {row.nominatedTo && !isFomoLocked && (
                                      <div className="mt-1 text-[10px] bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md inline-block font-bold w-fit border border-blue-100 dark:border-blue-800/30 shadow-sm">
                                        🔄 تم ترشيحه لـ: {row.nominatedTo}
                                      </div>
                                    )}
                                  </div>
                                </div>{" "}
                              </td>{" "}
                              <td className="px-2 py-3">
                                <div className="flex justify-start">
                                  <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white px-2 py-1 rounded-md text-[11px] font-bold inline-flex items-center justify-center whitespace-nowrap w-fit">
                                    {row.job}{" "}
                                  </span>{" "}
                                </div>
                              </td>{" "}
                              <td className="px-2 py-3">
                                <div className="flex items-center justify-start gap-1.5 whitespace-nowrap">
                                  <div className="w-12 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${isFomoLocked ? "bg-slate-300 dark:bg-slate-600" : row.rating >= 80 ? "bg-primary" : row.rating >= 50 ? "bg-orange-500" : "bg-red-500"}`}
                                      style={{ width: isFomoLocked ? '100%' : `${row.rating}%` }}
                                    />{" "}
                                  </div>{" "}
                                  <span className={`text-sm font-bold ${isFomoLocked ? "text-slate-400 filter blur-[4px] select-none" : row.rating >= 80 ? "text-primary" : row.rating >= 50 ? "text-orange-600 dark:text-orange-400" : "text-red-600 dark:text-red-400"}`}>
                                    {isFomoLocked ? "00%" : `${row.rating}%`}
                                  </span>{" "}
                                </div>{" "}
                              </td>{" "}
                              <td className="px-2 py-3 text-xs text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap text-right">
                                {isFomoLocked ? <span className="filter blur-[4px] select-none">مقفل</span> : row.status}
                              </td>{" "}
                              <td className="px-2 py-3">
                                <div className={`flex items-center justify-center gap-1 ${isFomoLocked ? 'filter blur-[4px] select-none pointer-events-none' : ''}`}>
                                  <a
                                    href={`https://wa.me/${row.phone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-8 h-8 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-lg flex items-center justify-center hover:bg-green-500 dark:hover:bg-green-500/60 dark:hover:text-green-100 hover:text-white transition-all shadow-sm"
                                    title="واتساب"
                                  >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                    </svg>{" "}
                                  </a>{" "}
                                  <a
                                    href={`mailto:${row.email}`}
                                    className="w-8 h-8 bg-navy/5 dark:bg-slate-700/50 text-navy dark:text-slate-200 rounded-lg flex items-center justify-center hover:bg-navy dark:hover:bg-slate-600 hover:text-white transition-all shadow-sm"
                                    title="إيميل"
                                  >
                                    <Mail size={15} />{" "}
                                  </a>{" "}
                                  <a
                                    href={`tel:${row.phone}`}
                                    className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg flex items-center justify-center hover:bg-blue-500 dark:hover:bg-blue-500/60 dark:hover:text-blue-100 hover:text-white transition-all shadow-sm"
                                    title="اتصال"
                                  >
                                    <Phone size={15} />{" "}
                                  </a>{" "}
                                </div>{" "}
                              </td>{" "}
                              {decisionFilter === "interview" && (
                                <td className="px-2 py-3">
                                  <div className="flex justify-center">
                                    {isFomoLocked ? (
                                      <span className="filter blur-[4px] select-none text-xs text-slate-400 font-bold">مقفل</span>
                                    ) : row.is_interview_completed ? (
                                      <span className="bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800/30 px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
                                        <Mic size={14} /> تمت المقابلة
                                      </span>
                                    ) : row.decision === "interviewing" ? (
                                      <span className="bg-purple-50 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30 px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
                                        <Clock size={14} /> جاري المقابلة
                                      </span>
                                    ) : (
                                      <span className="bg-transparent text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center justify-center min-w-[80px]">
                                        لا يوجد
                                      </span>
                                    )}
                                  </div>
                                </td>
                              )}
                              <td className="px-2 py-3">
                                <div className="flex items-center justify-end gap-1.5 w-max ml-auto pl-4">
                                  {isFomoLocked ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setAddonsBoughtThisMonth(prev => prev + 1);
                                        if (addonsBoughtThisMonth >= 2 && plan !== 'enterprise') {
                                          setShowSoftUpgradeModal(true);
                                        } else {
                                          alert("سيتم توجيهك لبوابة الدفع لشراء 500 سيرة بـ 149 ريال...");
                                        }
                                      }}
                                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg animate-pulse"
                                    >
                                      <Lock size={14} /> فك القفل (149 ريال)
                                    </button>
                                  ) : row.decision === "filtered" ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDecision(row.id, "pending");
                                      }}
                                      className="flex items-center justify-center gap-1 border border-primary text-primary hover:bg-primary hover:text-white dark:border-primary/50 dark:hover:bg-primary px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                                      title="استعادة"
                                    >
                                      <RotateCcw size={14} /> استعادة
                                    </button>
                                  ) : row.decision && row.decision !== "pending" ? (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          if (window.confirm("هل أنت متأكد من رغبتك في التراجع عن هذا القرار وإعادته لقيد المراجعة؟")) {
                                            handleDecision(row.id, "pending");
                                          }
                                        }}
                                        className="flex items-center justify-center gap-1 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 hover:border-slate-400 dark:hover:bg-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                                        title="تراجع"
                                      >
                                        <RotateCcw size={14} /> تراجع
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDecision(row.id, "accepted"); }}
                                        className="flex items-center justify-center gap-1 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                                        title="قبول"
                                      >
                                        <CheckCircle size={14} /> قبول
                                      </button>
                                      <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDecision(row.id, "interview"); }}
                                        className="flex items-center justify-center gap-1 bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-600 dark:hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                                        title="مقابلة"
                                      >
                                        مقابلة
                                      </button>
                                      <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDecision(row.id, "rejected"); }}
                                        className="flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                                        title="رفض"
                                      >
                                        <X size={14} /> رفض
                                      </button>
                                    </>
                                  )}
                                  <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onViewDetails(row); }}
                                    disabled={isFomoLocked}
                                    className={`flex items-center justify-center gap-1 bg-white text-navy border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${isFomoLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title="عرض الملف"
                                  >
                                    <FileText size={14} /> عرض الملف{" "}
                                  </button>
                                  <div className="relative">
                                    <button
                                      disabled={isFomoLocked}
                                      onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === row.id ? null : row.id); }}
                                      className={`flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-navy hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${isFomoLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
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

                                              </motion.div>
                                            </>
                                          )}
                                        </AnimatePresence>
                                      );
                                    })()}
                                  </div>
                                </div>{" "}
                              </td>{" "}
                            </motion.tr>
                          );
                        })}
                        {visibleApplicants.some((row, index) => plan === 'free' && (row.status === "قيد الانتظار" || (isPreviewMode && index > 0)) && cvsRemaining <= 0) && (
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
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
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
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                    <button
                      onClick={() => setShowSoftUpgradeModal(false)}
                      className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors z-10"
                    >
                      <X size={16} />
                    </button>
                    
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                      <TrendingUp size={32} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-navy dark:text-white mb-4">
                      استخدامك عالي! وفر أموالك 🚀
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 font-medium mb-6 leading-relaxed">
                      لاحظنا أنك قمت بشراء إضافات متعددة مؤخراً. يمكنك توفير أكثر من 30% من تكاليفك عند الترقية إلى باقة الأعمال بدلاً من شراء الإضافات المتكررة.
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <CheckCircle size={16} className="text-emerald-500" /> 5000 سيرة ذاتية شهرياً
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <CheckCircle size={16} className="text-emerald-500" /> 10 إعلانات وظيفية
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <CheckCircle size={16} className="text-emerald-500" /> مدير حساب مخصص
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowSoftUpgradeModal(false);
                          setActiveTab("الحساب");
                          setTimeout(() => window.dispatchEvent(new CustomEvent('changeSettingsTab', { detail: 'باقات فرز' })), 50);
                        }}
                        className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-all"
                      >
                        الترقية للوفر
                      </button>
                      <button
                        onClick={() => {
                          setShowSoftUpgradeModal(false);
                          alert("سيتم توجيهك لبوابة الدفع لشراء 500 سيرة بـ 149 ريال...");
                        }}
                        className="flex-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                      >
                        الاستمرار كإضافة
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      case "إدارة الوظائف":
        if (jobs.length === 0) {
          return (
            <div className="w-full flex items-center justify-center min-h-[75vh]">
              <div className="text-center max-w-4xl mx-auto p-12 md:p-20 bg-white dark:bg-slate-800 rounded-[48px] shadow-2xl shadow-primary/10 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent -z-10" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

                <div className="w-28 h-28 bg-white dark:bg-slate-700 text-primary rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 transform -rotate-6 border border-slate-50 dark:border-slate-600 relative z-10">
                  <Rocket size={56} className="text-primary drop-shadow-md" />
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-navy dark:text-white leading-tight mb-6">
                  {plan === 'free' ? (
                    <>أهلاً بك! ابدأ الآن بنشر إعلانك الأول <span className="text-primary">مجاناً</span> 🚀</>
                  ) : (
                    <>أهلاً بك في منصة <span className="text-primary">التوظيف الذكي</span> 🚀</>
                  )}
                </h1>

                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                  {plan === 'free' ? "احصل على أول 50 سيرة ذاتية مفروزة بتقنيات الذكاء الاصطناعي مجاناً بالكامل. نحن هنا لنسهل عليك رحلة البحث عن أفضل الكفاءات واختيار الأنسب لفريقك." : "نحن هنا لنسهل عليك رحلة البحث عن أفضل الكفاءات وتقييم المتقدمين بتقنيات الذكاء الاصطناعي بكل احترافية."}
                </p>

                <div className="relative z-10">
                  <button onClick={onCreateJob} className="bg-primary text-white px-10 md:px-14 py-5 md:py-6 rounded-3xl font-black text-xl md:text-2xl hover:bg-primary-dark transition-all active:scale-[0.98] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 mx-auto group">
                    <Briefcase size={28} className="group-hover:scale-110 transition-transform" />
                    {plan === 'free' ? "أنشئ إعلانك الأول الآن" : "أنشئ وظيفتك الأولى الآن"}
                  </button>
                  {plan === 'free' && (
                    <p className="mt-6 text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
                      <CheckCircle size={16} className="text-emerald-500" /> لا يتطلب بطاقة ائتمانية للبدء
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        }
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
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase size={20} /> إنشاء إعلان وظيفي
                </button>
              </div>{" "}
            </header>{" "}
            <div className="flex flex-wrap items-center justify-between gap-4 w-full mb-2">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-wrap bg-white dark:bg-slate-800 p-2 gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
                  <button
                    onClick={() => setSubTab("active")}
                    className={`flex items-center justify-center gap-2.5 flex-1 px-6 md:px-8 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${subTab === "active" ? "bg-navy text-white shadow-md" : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white"}`}
                  >
                    <div className={`w-2 h-2 rounded-full shadow-sm ${subTab === "active" ? "bg-emerald-400" : "bg-primary"}`}></div>
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
                </div>

                {subTab === "drafts" && draftJobsList.length > 0 && onDeleteAllDrafts && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowBulkDeleteDraftsModal(true);
                    }}
                    className="flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
                  >
                    <Trash2 size={18} /> مسح جميع المسودات
                  </button>
                )}
              </div>{" "}

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1 md:flex-none justify-end">
                <div className="flex-1 md:flex-none relative min-w-[250px]">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type="text"
                    placeholder="ابحث باسم المسمى الوظيفي..."
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pr-11 pl-4 py-3 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium dark:text-white dark:placeholder-slate-400"
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
              jobs={subTab === "active" ? activeJobsList : subTab === "inactive" ? inactiveJobsList : draftJobsList}
              onManage={onManageJob}
              onCreateJob={onCreateJob}
              onClone={onCloneJob}
              onDeactivate={subTab === "active" ? onDeactivateJob : undefined}
              onReactivate={subTab === "inactive" ? onReactivateJob : undefined}
              onDelete={(id) => setDraftToDelete(id)}
              cvLimitReached={cvsRemaining <= 0 && cvLimit > 0}
              plan={plan}
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
            onCrossNominate={(applicant) => {
              setCrossNominateApplicant(applicant);
              setCrossNominateJobId(jobs.find(j => j.status === "نشط")?.id || "");
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
            <Reports jobs={syncedJobs} filterId={jobFilter} applicants={applicants} />{" "}
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








        {/* Sidebar */}{" "}
        <aside className={`${isSidebarOpen ? 'w-80 p-8' : 'w-20 p-4'} bg-navy text-white hidden lg:flex flex-col fixed h-full right-0 shadow-2xl z-20 transition-all duration-300`}>
          <div className="flex items-center gap-4 mb-16 px-2">
            <LogoIcon />{" "}
            {isSidebarOpen && (
            <span className="text-3xl font-black tracking-tighter text-white flex-1">
              فرز
            </span>
          )}{" "}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? 'تصغير القائمة' : 'توسيع القائمة'}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all shrink-0"
            >
              {isSidebarOpen ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>
          </div>{" "}
          <nav className="space-y-3 flex-1 pb-6">
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
                className={`w-full flex items-center ${isSidebarOpen ? "gap-4 px-5 py-4 justify-start" : "justify-center p-4"} rounded-2xl transition-all font-semibold ${activeTab === item.name ? "bg-mint text-employer-green shadow-xl shadow-mint/30" : "text-slate-400 dark:text-slate-500 hover:text-slate-200 hover:bg-slate-700/50"}`}
              >
                <div className={`transition-transform duration-300 ${isSidebarOpen ? "" : "scale-110"}`}>{item.icon}</div> {isSidebarOpen && <span>{item.name}</span>}{" "}
              </button>
            ))}{" "}
          </nav>{" "}
          <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-white dark:border-slate-700/10 shrink-0">
            <div className={`flex items-center ${isSidebarOpen ? 'gap-3 p-3 bg-white/5 dark:bg-slate-800/30 rounded-2xl border border-white/10 dark:border-slate-700' : 'justify-center w-full'} transition-all duration-300`}>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-primary overflow-hidden shrink-0 flex items-center justify-center">
                {userProfile?.avatar || userProfile?.companyLogo ? (
                  <img src={userProfile?.avatar || userProfile?.companyLogo} alt="Admin" referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"; }} />
                ) : (
                  <User className="text-slate-400" size={20} />
                )}
              </div>
            {isSidebarOpen && ( <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-white" title={userProfile?.name || "مستخدم جديد"}>
                  {(userProfile?.name || "مستخدم جديد").length > 25 ? (userProfile?.name || "مستخدم جديد").substring(0, 25) + "..." : (userProfile?.name || "مستخدم جديد")}
                </p>
                {userProfile?.title && <p className="text-[10px] text-slate-400 truncate mt-0.5">{userProfile?.title}</p>}
            </div> )}
            {isSidebarOpen && <button
                onClick={async () => await supabase.auth.signOut()}
                className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shrink-0"
                title="تسجيل الخروج"
              >
                <LogOut size={16} />
            </button>}
            </div>


            {/* Usage Widget */}
{isSidebarOpen && ( <div className="bg-slate-800/40 rounded-2xl p-4 pt-5 border border-slate-700/50 space-y-4 relative mt-3">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1b2537] border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold text-primary flex items-center gap-1.5 shadow-md whitespace-nowrap">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_rgba(13,148,136,0.8)]"></div>
                {plan === 'startup' || plan === 'growth' ? 'نمو' : plan === 'business' ? 'أعمال' : plan === 'enterprise' ? 'الشركات الكبرى' : 'المجانية'}
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <span>الوظائف النشطة</span>
                <span>{plan === 'enterprise' ? '∞' : `${activeCount} / ${jobLimit}`}</span>
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
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 text-red-400 py-2.5 px-2 rounded-xl cursor-pointer hover:from-red-500/20 hover:to-orange-500/20 transition-all active:scale-95 shadow-sm group"
                    >
                      <Lock size={14} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-bold">انتهت الفترة التجريبية! بادر بالترقية الآن</span>
                    </div>
                  ) : (
                    <>
                      <span>الباقة التجريبية</span>
                      <span>{cvLimit - cvsRemaining} / {cvLimit}</span>
                    </>
                  )
                ) : (
                  <>
                    <span>رصيد السير الذاتية</span>
                    <span>{plan === 'enterprise' ? '∞' : `${cvsRemaining} / ${cvLimit}`}</span>
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
                <span>{plan === 'enterprise' ? '∞' : `${interviewsRemaining} / ${interviewsLimit}`}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${interviewsRemaining <= 0 && interviewsLimit > 0 ? 'bg-red-500' : interviewColor}`}
                  style={{ width: plan === 'enterprise' ? '100%' : `${Math.min(100, (interviewsRemaining / (interviewsLimit || 1)) * 100)}%` }}
                />
              </div>
</div> )}

          </div>
        </aside>{" "}
        {/* Main Content */}{" "}
        <main className={`flex-1 ${isSidebarOpen ? 'lg:pr-80' : 'lg:pr-20'} flex flex-col min-h-screen transition-all duration-300`}>
          {(userProfile?.isLoaded && !userProfile?.commercialRegistration && !userProfile?.freelanceDocument) && (
            <div className="bg-amber-100 dark:bg-amber-900/50 border-b border-amber-200 dark:border-amber-700/50 mt-16 md:mt-0 z-10 transition-colors">
              <div className="max-w-6xl mx-auto p-3 sm:px-8 flex items-center justify-between text-amber-900 dark:text-amber-100 text-sm md:text-base">
                <span className="font-bold flex items-center gap-2 max-w-[70%] leading-relaxed">
                  <ShieldCheck size={20} className="text-orange-600 dark:text-orange-400 shrink-0" /> أهلاً بك! لتتمكن من نشر إعلاناتك الوظيفية، يرجى استكمال بيانات الكيان القانونية.
                </span>
                <button
                  onClick={onShowOnboarding}
                  className="shrink-0 bg-orange-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-orange-500 px-4 py-2 md:px-5 md:py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors mr-auto"
                >
                  استكمال البيانات
                </button>
              </div>
            </div>
          )}
          <div className="flex-1 p-10 pt-24 lg:pt-10 w-full max-w-[100vw]">
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

        {/* Welcome Modal for First-Time Users */}
        <AnimatePresence>
          {showWelcomeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ perspective: '1000px' }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={handleCloseWelcomeModal}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateX: 20, y: 40 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateX: -20, y: 40 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                className="bg-white dark:bg-slate-800 rounded-[32px] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative z-10 w-full max-w-[400px] text-center border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-primary to-teal-600" />

                <div className="mx-auto flex justify-center mb-6 mt-2">
                  <div className="scale-[1.8] origin-center">
                    <LogoIcon />
                  </div>
                </div>

                <h2 className="text-[22px] font-black text-navy dark:text-white mb-3 tracking-tight">
                  مرحباً بك في منصة فرز، {(userProfile?.name || "مستخدم جديد").length > 20 ? (userProfile?.name || "مستخدم جديد").substring(0, 20) + "..." : (userProfile?.name || "مستخدم جديد")}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium px-2">
                  مساحتك جاهزة. ابدأ الآن في فرز المتقدمين واختيار أفضل الكفاءات بضغطة زر.
                </p>

                <button
                  onClick={handleCloseWelcomeModal}
                  className="w-full bg-gradient-to-r from-primary to-teal-600 text-white font-bold py-3.5 rounded-2xl hover:shadow-[0_8px_25px_rgba(13,148,136,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all flex justify-center items-center gap-2"
                >
                  ابدأ الآن
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
export default Dashboard;
