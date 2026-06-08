import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Lock, Info, Users, X, Plus, Calendar, Sparkles, 
  CheckCircle, Save, Share2, MapPin, Briefcase, FileText, 
  CreditCard, Upload, ExternalLink, Mic, Clock, Ban, Eye, FileDigit, Link, Send, Copy, Settings, RefreshCw, Zap, AlertTriangle, Target, ClipboardList, Trash2, CheckSquare, Square, Image as ImageIcon, Video, Paperclip, RotateCcw
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { skillsDictionary, getUserSavedSkills, saveUserSkills, Job, VerificationModal } from '../Shared';
import { supabase } from "../lib/supabaseClient";

export const ManageJob = ({
  job,
  onBack,
  onUpdate,
  onDelete,
  onClone,
}: {
  job: Job;
  onBack: () => void;
  onUpdate: (job: Job) => void;
  onDelete: (id: string) => void;
  onClone?: (job: Job) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"أرشيف الوصف الوظيفي" | "إعدادات الوظيفة" | "متطلبات التقديم">("أرشيف الوصف الوظيفي");
  const isLocked = job.status === "نشط" && job.applicants > 0;

  // Archive Fields (Read-Only)
  const title = job.title || job.campaignTitle || "";
  const company = job.company || "";
  const singleRole = job.roles?.[0];
  const description = job.description || job.campaignDescription || singleRole?.description || "";
  const roleSummary = job.roleSummary || singleRole?.roleSummary || description;
  const responsibilities = job.responsibilities || singleRole?.responsibilities || "";
  const qualificationsText = job.qualifications || singleRole?.qualifications || "";
  const benefits = job.benefits || singleRole?.benefits || "";
  const jobType = job.type || singleRole?.type || "دوام كامل";
  const jobLocation = job.location || job.city || singleRole?.location || "لم تُحدد";
  const experience = job.experience || singleRole?.experience || "لا يشترط خبرة";
  const qualification = job.qualification || "ثانوي";
  const rawSkills = (job.skills && job.skills.length > 0) ? job.skills : (singleRole?.skills || []);
  const selectedSkills = Array.isArray(rawSkills) ? rawSkills : (typeof rawSkills === 'string' ? [rawSkills] : []);
  const rawLanguages = (job.languages && job.languages.length > 0) ? job.languages : (singleRole?.languages || []);
  const selectedLanguages = Array.isArray(rawLanguages) ? rawLanguages : (typeof rawLanguages === 'string' ? [rawLanguages] : []);
  const rawMajors = (job.targetMajors && job.targetMajors.length > 0) ? job.targetMajors : (singleRole?.targetMajors || []);
  const targetMajors = Array.isArray(rawMajors) ? rawMajors : [];

  // Settings Fields (Editable)
  const [location, setLocation] = useState(job.location || "");
  const [type, setType] = useState(job.type || "دوام كامل");
  const [salaryMin, setSalaryMin] = useState(job.salaryMin || "");
  const [salaryMax, setSalaryMax] = useState(job.salaryMax || "");
  const [isSalaryHidden, setIsSalaryHidden] = useState(job.isSalaryHidden || false);
  const [askExpectedSalary, setAskExpectedSalary] = useState(job.askExpectedSalary || false);
  
  const defaultStart = new Date().toISOString().slice(0, 16);
  const defaultEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const [startDate, setStartDate] = useState(job.startDate || defaultStart);
  const [endDate, setEndDate] = useState(job.endDate || defaultEnd);
  const [isOpenEnded, setIsOpenEnded] = useState(!job.endDate);
  
  // Custom Settings (Merged)
  const [welcomeUIMessage, setWelcomeUIMessage] = useState(job.welcomeUIMessage || "");
  const [portalTitle, setPortalTitle] = useState(job.portalTitle || "");
  const [fontFamily, setFontFamily] = useState(job.fontFamily || "cairo");
  const [aiInstructions, setAiInstructions] = useState(job.aiInstructions || (job as any).ai_instructions || "");

  // Status
  const [status, setStatus] = useState(job.status || "نشط");

  // Manual Unlock State
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockMode, setUnlockMode] = useState<"initial" | "select_people">("initial");
  const [lockedApplicants, setLockedApplicants] = useState<any[]>([]);
  const [selectedLockedIds, setSelectedLockedIds] = useState<string[]>([]);
  const [searchLocked, setSearchLocked] = useState("");
  const [isLoadingLocked, setIsLoadingLocked] = useState(false);

  const fetchLockedApplicants = async () => {
    setIsLoadingLocked(true);
    try {
      const { data, error } = await supabase.from('applicants')
        .select('id, full_name, email, decision, created_at, is_cooldown_bypassed')
        .eq('job_id', job.id)
        .neq('decision', 'CORRUPT_FILE_DO_NOT_SHOW');
      if (data) setLockedApplicants(data);
    } catch(e) {
      console.error(e);
    } finally {
      setIsLoadingLocked(false);
    }
  };

  // Questions & Attachments
  const [knockoutQuestions, setKnockoutQuestions] = useState<{ text: string; type: "yes_no" | "options"; options?: string[]; requiredAnswer: string }[]>(job.knockoutQuestions || []);
  const [customQuestions, setCustomQuestions] = useState<{ text: string; type: string; options?: string[]; required?: boolean }[]>(job.customQuestions || []);
  const [requiredAttachments, setRequiredAttachments] = useState<string[]>(job.requiredAttachments || ["السيرة الذاتية PDF"]);
  const [customAttachments, setCustomAttachments] = useState<CustomAttachment[]>(job.customAttachments || []);

  const [newCustomQuestion, setNewCustomQuestion] = useState("");
  const [newCustomQuestionType, setNewCustomQuestionType] = useState("نص");
  const [newCustomQuestionRequired, setNewCustomQuestionRequired] = useState(false);
  const [newCustomQuestionOptions, setNewCustomQuestionOptions] = useState<string[]>(["", ""]);

  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newAttachmentType, setNewAttachmentType] = useState<"file" | "link" | "image" | "video" | "document" | "mixed_file">("file");
  const [newAttachmentRequired, setNewAttachmentRequired] = useState(false);

  const toggleRequiredAttachment = (item: string) => {
    setRequiredAttachments(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const addCustomQuestion = () => {
    if (!newCustomQuestion.trim()) return;
    const q = { text: newCustomQuestion.trim(), type: newCustomQuestionType, required: newCustomQuestionRequired, options: newCustomQuestionType === "خيارات متعددة" ? newCustomQuestionOptions.filter(o => o.trim() !== "") : undefined };
    setCustomQuestions([...customQuestions, q]);
    setNewCustomQuestion("");
    setNewCustomQuestionOptions(["", ""]);
    setNewCustomQuestionRequired(false);
  };

  const removeCustomQuestion = (idx: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== idx));
  };

  const addCustomAttachment = () => {
    if (!newAttachmentName.trim()) return;
    setCustomAttachments([...customAttachments, { attachment_name: newAttachmentName.trim(), attachment_type: newAttachmentType as any, required: newAttachmentRequired }]);
    setNewAttachmentName("");
    setNewAttachmentRequired(false);
  };

  const removeCustomAttachment = (idx: number) => {
    setCustomAttachments(customAttachments.filter((_, i) => i !== idx));
  };

  
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);

  const [passedCount, setPassedCount] = useState<number | null>(null);
  const [totalAppsCount, setTotalAppsCount] = useState<number | null>(null);

  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { count: passed, error: err1 } = await supabase
          .from('applicants')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', job.id)
          .not('decision', 'in', '("filtered", "rejected", "CORRUPT_FILE_DO_NOT_SHOW")');
        
        if (!err1 && passed !== null) {
          setPassedCount(passed);
        }

        const { count: total, error: err2 } = await supabase
          .from('applicants')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', job.id)
          .neq('decision', 'CORRUPT_FILE_DO_NOT_SHOW');

        if (!err2 && total !== null) {
          setTotalAppsCount(total);
        }
      } catch (err) {}
    };
    fetchCounts();
  }, [job.id]);

  // Knockout Input state
  const [newKqText, setNewKqText] = useState("");
  const [newKqAnswer, setNewKqAnswer] = useState("نعم");

  const handleUpdate = async (e?: React.FormEvent, isKnockoutWarningApproved = false) => {
    if (e) e.preventDefault();
    
    // If saving knockout questions, show warning first
    if (activeTab === "متطلبات التقديم" && !isKnockoutWarningApproved) {
      setShowWarningModal(true);
      return;
    }

    if (!isOpenEnded && endDate && new Date(endDate) <= new Date(startDate)) {
      alert("تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء");
      return;
    }

    const updatedJob = {
      ...job,
      location,
      type,
      salaryMin,
      salaryMax,
      isSalaryHidden,
      askExpectedSalary,
      startDate,
      endDate: isOpenEnded ? undefined : endDate,
      status,
      knockoutQuestions,
      customQuestions,
      requiredAttachments,
      customAttachments,
      welcomeUIMessage,
      portalTitle,
      fontFamily,
      aiInstructions
    };

    try {
      const { error } = await supabase.from('jobs').update({
        location: updatedJob.location,
        type: updatedJob.type,
        salary_min: updatedJob.salaryMin === "" ? null : Number(updatedJob.salaryMin) || null,
        salary_max: updatedJob.salaryMax === "" ? null : Number(updatedJob.salaryMax) || null,
        hide_salary: updatedJob.isSalaryHidden,
        start_date: updatedJob.startDate,
        end_date: updatedJob.endDate,
        status: updatedJob.status,
        knockout_questions: updatedJob.knockoutQuestions,
        custom_questions: updatedJob.customQuestions,
        required_attachments: updatedJob.requiredAttachments,
        custom_attachments: updatedJob.customAttachments,
        welcome_ui_message: updatedJob.welcomeUIMessage,
        portal_title: updatedJob.portalTitle,
        font_family: updatedJob.fontFamily,
        ai_instructions: updatedJob.aiInstructions
      }).eq('id', updatedJob.id);
      
      if (error) throw error;
      
      onUpdate(updatedJob);
      setShowWarningModal(false);
      alert("تم حفظ التعديلات بنجاح!");
    } catch (err: any) {
      console.error("Supabase update error:", err);
      if (err.message?.includes('LIMIT_REACHED') || err.details?.includes('LIMIT_REACHED')) {
        alert("لقد وصلت للحد الأقصى للوظائف النشطة في باقتك. الرجاء إغلاق وظيفة أخرى أولاً.");
        setStatus(job.status || "مغلق");
      } else {
        alert("حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.");
      }
    }
  };

  const addKnockoutQuestion = () => {
    if (!newKqText.trim()) return;
    setKnockoutQuestions([...knockoutQuestions, { text: newKqText.trim(), type: "yes_no", requiredAnswer: newKqAnswer }]);
    setNewKqText("");
  };

  const applyLink = window.location.origin + "/apply/" + job.id;
  const shareText = `تم الإعلان عن شاغر: ${title} في ${company}.\nالتقديم من خلال الرابط: ${applyLink}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم النسخ للحافظة!");
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8 pt-24 lg:pt-10">
      <div className="max-w-6xl mx-auto relative z-[100]">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onBack()}
              className="w-10 h-10 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary transition-all"
            >
              <ArrowLeft size={20} className="rotate-180" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-navy dark:text-white">{title}</h1>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50 rounded-full text-xs font-bold shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  الفرز الذكي نشط
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">{company}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => window.location.href = `/?jobFilter=${job.id}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-navy/20 hover:bg-slate-800 transition-all active:scale-95"
            >
              المرشحون لهذه الوظيفة <ArrowLeft size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50"
            >
              
              {/* TABS */}
              <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar pb-0">
                {(["أرشيف الوصف الوظيفي", "إعدادات الوظيفة", "متطلبات التقديم"] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 font-bold text-sm md:text-base px-4 border-b-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                  >
                    {tab === "أرشيف الوصف الوظيفي" && <Lock size={14} className="inline-block ml-1 opacity-70" />}
                    {tab === "إعدادات الوظيفة" && <Settings size={14} className="inline-block ml-1 opacity-70" />}
                    {tab === "متطلبات التقديم" && <ClipboardList size={14} className="inline-block ml-1 opacity-70" />}
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB 1: ARCHIVE (READ ONLY) */}
              {activeTab === "أرشيف الوصف الوظيفي" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-500 p-4 rounded-l-xl mb-6 flex items-start gap-3">
                    <Lock className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <p className="text-amber-800 dark:text-amber-400 font-bold text-sm leading-relaxed">
                      البيانات في هذا القسم مقفلة للقراءة فقط للحفاظ على استقرار أوزان ومقاييس الذكاء الاصطناعي الذي تم بناء الفرز بناءً عليها. لتعديلها، قم بتكرار الوظيفة كإعلان جديد.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-400 font-bold mb-1">المسمى الوظيفي</p>
                      <p className="font-bold text-navy dark:text-white">{title || "لم تُحدد"}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-400 font-bold mb-1">الجهة / الشركة</p>
                      <p className="font-bold text-navy dark:text-white">{company || "لم تُحدد"}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-400 font-bold mb-1">سنوات الخبرة</p>
                      <p className="font-bold text-navy dark:text-white">{experience}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-400 font-bold mb-1">الحد الأدنى للمؤهل</p>
                      <p className="font-bold text-navy dark:text-white">{qualification}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-400 font-bold mb-1">نوع العمل</p>
                      <p className="font-bold text-navy dark:text-white">{jobType}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-400 font-bold mb-1">مقر العمل</p>
                      <p className="font-bold text-navy dark:text-white">{jobLocation}</p>
                    </div>
                  </div>

                  {roleSummary && (
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 mt-6">
                      <p className="text-xs text-slate-400 font-bold mb-3 flex items-center gap-1"><FileText size={14}/> نبذة عن الدور</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{roleSummary}</p>
                    </div>
                  )}

                  {responsibilities && (
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 mt-4">
                      <p className="text-xs text-slate-400 font-bold mb-3 flex items-center gap-1"><CheckCircle size={14}/> المهام والمسؤوليات</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{responsibilities}</p>
                    </div>
                  )}

                  {qualificationsText && (
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 mt-4">
                      <p className="text-xs text-slate-400 font-bold mb-3 flex items-center gap-1"><CheckCircle size={14}/> المتطلبات (الشروط والخبرات)</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{qualificationsText}</p>
                    </div>
                  )}

                  {benefits && (
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 mt-4">
                      <p className="text-xs text-slate-400 font-bold mb-3 flex items-center gap-1"><Sparkles size={14}/> المميزات (Perks)</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{benefits}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {targetMajors.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-400 font-bold mb-3">التخصصات المستهدفة</p>
                        <div className="flex flex-wrap gap-2">
                          {targetMajors.map(major => <span key={major} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl text-sm font-bold">{major}</span>)}
                        </div>
                      </div>
                    )}
                    {selectedSkills.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-400 font-bold mb-3">المهارات والتفضيلات</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSkills.map(skill => <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-bold">{skill}</span>)}
                        </div>
                      </div>
                    )}
                    {selectedLanguages.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-400 font-bold mb-3">اللغات المطلوبة</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedLanguages.map(lang => <span key={lang} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-xl text-sm font-bold">{lang}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: SETTINGS (EDITABLE) */}
              {activeTab === "إعدادات الوظيفة" && (
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6" onSubmit={handleUpdate}>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2">نوع العمل</label>
                      <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary font-bold text-navy dark:text-white">
                        <option>دوام كامل</option><option>دوام جزئي</option><option>عن بعد</option><option>تدريب</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2">مقر العمل</label>
                      <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-navy dark:text-white" required />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <label className="text-sm font-bold text-navy dark:text-white mr-2 block">ميزانية الراتب</label>
                    <div className="flex items-center gap-4">
                      <input type="number" placeholder="الحد الأدنى" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 text-navy dark:text-white font-medium" />
                      <span className="font-bold text-slate-400">-</span>
                      <input type="number" placeholder="الحد الأعلى" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 text-navy dark:text-white font-medium" />
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                      <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input type="checkbox" checked={isSalaryHidden} onChange={(e) => setIsSalaryHidden(e.target.checked)} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء الراتب عن المتقدمين (للفرز الآلي فقط)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input type="checkbox" checked={askExpectedSalary} onChange={(e) => setAskExpectedSalary(e.target.checked)} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">سؤال المتقدم عن الراتب المتوقع</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-navy dark:text-white">جدولة الإعلان</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs font-bold text-slate-500">إعلان مستمر</span>
                        <input type="checkbox" checked={isOpenEnded} onChange={(e) => setIsOpenEnded(e.target.checked)} className="w-4 h-4 rounded text-primary" />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 text-navy dark:text-white font-medium" />
                      {!isOpenEnded && (
                        <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 text-navy dark:text-white font-medium" />
                      )}
                    </div>
                  </div>
                  
                  {/* Additional Settings that were moved here */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                     <h4 className="font-bold text-navy dark:text-white mb-2">تخصيص الواجهة والفرز الذكي</h4>
                     <div className="space-y-2 mb-4 bg-primary/5 border border-primary/20 p-4 rounded-xl">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-2"><Sparkles size={16} className="text-primary"/> توجيهات إضافية لمحرك الفرز (AI Instructions)</label>
                      <textarea value={aiInstructions} onChange={e => setAiInstructions(e.target.value)} placeholder="مثال: يرجى تقليل نسبة المتقدم إذا لم يكن يملك خبرة في برنامج فوتوشوب، أو ارفع نسبة المتقدم إذا كان يحمل شهادة PMP..." className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-navy dark:text-white min-h-[100px]"></textarea>
                     </div>
                     <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2">رسالة الترحيب</label>
                      <input type="text" value={welcomeUIMessage} onChange={e => setWelcomeUIMessage(e.target.value)} placeholder="مثال: يسعدنا انضمامك لفريقنا..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-navy dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2">عنوان بوابة التقديم</label>
                      <input type="text" value={portalTitle} onChange={e => setPortalTitle(e.target.value)} placeholder="مثال: بوابة التوظيف الموحدة" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-navy dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2">نوع الخط</label>
                      <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-navy dark:text-white">
                        <option value="cairo">Cairo (الافتراضي)</option>
                        <option value="tajawal">Tajawal</option>
                        <option value="ibm">IBM Plex Sans Arabic</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-primary text-white py-4 mt-8 rounded-2xl text-lg font-bold hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    <Save size={20} /> حفظ التحديثات
                  </button>
                </motion.form>
              )}

              {/* TAB 3: APPLICATION REQUIREMENTS (EDITABLE WITH WARNING) */}
              {activeTab === "متطلبات التقديم" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex gap-4">
                    <Info className="text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-navy dark:text-white mb-1">أسئلة الاستبعاد المباشر (Knockout)</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        يتم طرح هذه الأسئلة للمتقدم بصيغة (نعم/لا). إذا أجاب بخلاف "الإجابة المطلوبة"، سيتم استبعاده فوراً من المنافسة وتوفير تكلفة تحليله.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {knockoutQuestions.length === 0 ? (
                      <p className="text-center py-8 text-slate-400 font-medium">لا توجد أسئلة استبعاد مضافة</p>
                    ) : (
                      knockoutQuestions.map((kq, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                          <div>
                            <p className="font-bold text-sm text-navy dark:text-white mb-1">{kq.text}</p>
                            <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">الشرط لاجتياز الفرز: {kq.requiredAnswer}</span>
                          </div>
                          <button onClick={() => setKnockoutQuestions(knockoutQuestions.filter((_, i) => i !== idx))} className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <input type="text" value={newKqText} onChange={e => setNewKqText(e.target.value)} placeholder="مثال: هل تمتلك رخصة قيادة سارية؟" className="flex-1 w-full sm:w-auto px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary text-sm font-medium dark:text-white" />
                    <select value={newKqAnswer} onChange={e => setNewKqAnswer(e.target.value)} className="w-24 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm text-center dark:text-white">
                      <option>نعم</option>
                      <option>لا</option>
                    </select>
                    <button onClick={addKnockoutQuestion} className="bg-navy text-white px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 font-bold text-sm">
                      <Plus size={16} /> إضافة
                    </button>
                  </div>

                  {/* Required Attachments */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mt-6">
                    <h3 className="text-lg font-bold text-navy dark:text-white mb-4">المرفقات الأساسية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["السيرة الذاتية PDF", "خطاب المقدمة/Cover Letter", "معرض الأعمال/Portfolio", "فيديو تعريفي قصير"].map((item) => (
                        <label key={item} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={requiredAttachments.includes(item)}
                            onChange={() => item !== "السيرة الذاتية PDF" && toggleRequiredAttachment(item)}
                            disabled={item === "السيرة الذاتية PDF"}
                            className="w-5 h-5 text-primary rounded border-slate-300 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                          />
                          <span className={`font-medium text-sm ${item === "السيرة الذاتية PDF" ? "text-slate-400" : "text-navy dark:text-white"}`}>
                            {item}
                            {item === "السيرة الذاتية PDF" && <span className="text-xs text-red-500 mr-2">(إلزامي للفرز)</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Custom Questions */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mt-6">
                    <h3 className="text-lg font-bold text-navy dark:text-white mb-4">الأسئلة الإضافية</h3>
                    <div className="space-y-4">
                      {customQuestions.map((q, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl gap-4">
                          <div className="space-y-1 flex-1">
                            <p className="font-bold text-navy dark:text-white text-sm">{q.text}</p>
                            <p className="text-xs text-primary font-medium flex items-center gap-1.5">
                              نوع الإجابة: {q.type}
                              <span className="text-slate-300">•</span>
                              <span className={q.required ? "text-red-500" : "text-slate-400"}>
                                {q.required ? "إلزامي" : "اختياري"}
                              </span>
                            </p>
                            {q.type === "خيارات متعددة" && q.options && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {q.options.map((opt, oIdx) => (
                                  <span key={oIdx} className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomQuestion(idx)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      
                      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 shrink-0">
                          <input
                            type="checkbox"
                            checked={newCustomQuestionRequired}
                            onChange={(e) => setNewCustomQuestionRequired(e.target.checked)}
                            className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary/20 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-navy dark:text-white">إلزامي؟</span>
                        </div>
                        <input
                          type="text"
                          value={newCustomQuestion}
                          onChange={(e) => setNewCustomQuestion(e.target.value)}
                          placeholder="اكتب السؤال هنا..."
                          className="flex-1 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white w-full"
                        />
                        <select
                          value={newCustomQuestionType}
                          onChange={(e) => setNewCustomQuestionType(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white w-full md:w-[130px]"
                        >
                          <option value="نص">نص</option>
                          <option value="نعم/لا">نعم/لا</option>
                          <option value="خيارات متعددة">خيارات</option>
                        </select>
                        <button
                          type="button"
                          onClick={addCustomQuestion}
                          disabled={!newCustomQuestion.trim()}
                          className="px-6 py-3 w-full md:w-auto bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> إضافة
                        </button>
                      </div>
                      {newCustomQuestionType === "خيارات متعددة" && (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {newCustomQuestionOptions.map((opt, oIdx) => (
                            <input
                              key={oIdx}
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...newCustomQuestionOptions];
                                newOpts[oIdx] = e.target.value;
                                if (oIdx === newOpts.length - 1 && e.target.value.trim() !== "") {
                                  newOpts.push("");
                                }
                                setNewCustomQuestionOptions(newOpts);
                              }}
                              placeholder={`الخيار ${oIdx + 1}`}
                              className="w-full bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:border-primary dark:text-white"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Custom Attachments */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mt-6 mb-8">
                    <h3 className="text-lg font-bold text-navy dark:text-white mb-4">المرفقات المخصصة</h3>
                    <div className="space-y-4">
                      {customAttachments.map((att, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl gap-4">
                          <div className="space-y-1 flex-1">
                            <p className="font-bold text-navy dark:text-white text-sm">{att.attachment_name}</p>
                            <p className="text-xs text-primary font-medium flex items-center gap-1.5">
                              نوع المرفق: {att.attachment_type === "file" ? "ملف (PDF/Doc)" : att.attachment_type === "image" ? "صورة" : att.attachment_type === "video" ? "فيديو" : att.attachment_type === "link" ? "رابط" : "أخرى"}
                              <span className="text-slate-300">•</span>
                              <span className={att.required ? "text-red-500" : "text-slate-400"}>
                                {att.required ? "إلزامي" : "اختياري"}
                              </span>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomAttachment(idx)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}

                      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 shrink-0">
                          <input
                            type="checkbox"
                            checked={newAttachmentRequired}
                            onChange={(e) => setNewAttachmentRequired(e.target.checked)}
                            className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary/20 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-navy dark:text-white">إلزامي؟</span>
                        </div>
                        <input
                          type="text"
                          value={newAttachmentName}
                          onChange={(e) => setNewAttachmentName(e.target.value)}
                          placeholder="اسم المرفق المطلوب..."
                          className="flex-1 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white w-full"
                        />
                        <select
                          value={newAttachmentType}
                          onChange={(e) => setNewAttachmentType(e.target.value as any)}
                          className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white w-full md:w-[130px]"
                        >
                          <option value="file">ملف</option>
                          <option value="image">صورة</option>
                          <option value="video">فيديو</option>
                          <option value="link">رابط</option>
                        </select>
                        <button
                          type="button"
                          onClick={addCustomAttachment}
                          disabled={!newAttachmentName.trim()}
                          className="px-6 py-3 w-full md:w-auto bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> إضافة
                        </button>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => handleUpdate(undefined, false)} className="w-full bg-primary text-white py-4 mt-8 rounded-2xl text-lg font-bold hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    <Save size={20} /> حفظ التحديثات
                  </button>
                </motion.div>
              )}

            </motion.div>
          </div>

          {/* SIDEBAR: DASHBOARD & ACTIONS */}
          <div className="space-y-6">
            
            {/* Quick Actions (Status & Duplicate) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50">
              <h3 className="font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
                <Settings size={18} className="text-primary"/> أدوات الإغلاق
              </h3>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 mb-4">
                <div>
                  <p className="font-bold text-navy dark:text-white text-sm">الحالة: <span className={status === "نشط" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>{status}</span></p>
                </div>
                <button 
                  onClick={() => {
                    const newStatus = status === "نشط" ? "مغلق" : "نشط";
                    setStatus(newStatus);
                    setTimeout(() => document.getElementById("hidden-submit")?.click(), 100);
                  }} 
                  className={`w-14 h-7 rounded-full relative transition-all shadow-inner focus:outline-none focus:ring-4 focus:ring-primary/20 ${status === "نشط" ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${status === "نشط" ? "left-1" : "left-8"}`} />
                </button>
                <form onSubmit={handleUpdate} className="hidden"><button id="hidden-submit" type="submit"></button></form>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowUnlockModal(true);
                  setUnlockMode("initial");
                  setSelectedLockedIds([]);
                  setSearchLocked("");
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 p-3 rounded-2xl font-bold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors mb-4"
              >
                <RotateCcw size={16} /> فتح التقديم يدوياً (فك حظر 90 يوم)
              </button>

              {onClone && (
                <button
                  onClick={() => {
                    setStatus("مغلق");
                    onClone({ ...job, status: "مغلق" });
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 p-3 rounded-2xl font-bold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                >
                  <Copy size={16} /> إغلاق الإعلان وتكراره
                </button>
              )}
            </div>

            {/* Funnel Analytics */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50">
              <h3 className="font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
                <Target size={18} className="text-primary"/> معدل التحويل
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Eye size={14} className="text-primary"/> الزيارات</span>
                  <span className="font-bold text-navy dark:text-white">{job.visits_count || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Users size={14} className="text-primary"/> إجمالي المتقدمين</span>
                  <span className="font-bold text-navy dark:text-white">{totalAppsCount !== null ? totalAppsCount : job.applicants}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5"><CheckCircle size={14} className="text-primary"/> المجتازين للفرز</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{passedCount !== null ? passedCount : "..."}</span>
                </div>
              </div>
            </div>

            {/* Share Hub */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50">
              <h3 className="font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
                <Share2 size={18} className="text-primary"/> مركز النشر
              </h3>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center mb-4">
                <div className="bg-white p-3 rounded-xl shadow-sm mb-3">
                  <QRCode value={applyLink} size={120} level="H" fgColor="#0F172A" />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">رمز التقديم السريع (QR)</p>
              </div>

              <div className="space-y-3">
                <button onClick={() => copyToClipboard(applyLink)} className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600">
                  <Link size={16} className="text-slate-400" /> نسخ رابط التقديم المباشر
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 bg-[#25D366]/10 text-[#25D366] px-3 py-2 rounded-xl font-bold text-xs hover:bg-[#25D366]/20 transition-colors">
                    <Send size={14} /> WhatsApp
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 bg-[#1DA1F2]/10 text-[#1DA1F2] px-3 py-2 rounded-xl font-bold text-xs hover:bg-[#1DA1F2]/20 transition-colors">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568 4.692 4.692 0 0 1-2.104.08 4.661 4.661 0 0 0 4.352 3.234 9.348 9.348 0 0 1-5.786 1.995 9.5 9.5 0 0 1-1.112-.065 13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41z"/></svg>
                    X/Twitter
                  </a>
                </div>
                <button onClick={() => copyToClipboard(`${window.location.origin}/share/${job.id}`)} className="w-full flex items-center justify-center gap-2 bg-navy/5 text-navy dark:bg-white/5 dark:text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-navy/10 dark:hover:bg-white/10 transition-colors border border-navy/10 dark:border-white/10 mt-4">
                  <Lock size={14} className="opacity-70" /> الرابط السري للإدارة (مشاركة للقراءة)
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100 dark:border-slate-700"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-2">
                  {unlockMode === "initial" ? "فتح التقديم يدوياً" : "تحديد المتقدمين"}
                </h3>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {unlockMode === "initial" ? (
                  <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300 mb-6 font-medium leading-relaxed">
                      هل ترغب في فك حظر الـ 90 يوماً لجميع المتقدمين السابقين على هذه الوظيفة، أم لأشخاص معينين فقط؟
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          const { data, error } = await supabase.from('applicants').update({ is_cooldown_bypassed: true }).eq('job_id', job.id).neq('decision', 'CORRUPT_FILE_DO_NOT_SHOW').select('id');
                          if (error) throw error;
                          if (data && data.length > 0) {
                            window.dispatchEvent(new CustomEvent('showToast', { detail: { message: `تم فك الحظر عن ${data.length} متقدمين بنجاح`, type: "success" }}));
                          } else {
                            window.dispatchEvent(new CustomEvent('showToast', { detail: { message: "لا يوجد متقدمين محظورين لهذه الوظيفة حالياً", type: "info" }}));
                          }
                          setShowUnlockModal(false);
                        } catch(e: any) {
                          alert("حدث خطأ: " + e.message);
                        }
                      }}
                      className="w-full p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <Users size={18} /> فتح للكل
                    </button>
                    <button
                      onClick={() => {
                        setUnlockMode("select_people");
                        fetchLockedApplicants();
                      }}
                      className="w-full p-4 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <Target size={18} /> لأشخاص معينين
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="ابحث بالاسم أو الإيميل..."
                      value={searchLocked}
                      onChange={e => setSearchLocked(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-navy dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                    
                    {isLoadingLocked ? (
                      <div className="flex justify-center p-8">
                        <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-b-primary rounded-full"></div>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {lockedApplicants.filter(a => (a.full_name || "").toLowerCase().includes(searchLocked.toLowerCase()) || (a.email || "").toLowerCase().includes(searchLocked.toLowerCase())).length === 0 ? (
                          <div className="text-center p-4 text-slate-500">لا يوجد نتائج</div>
                        ) : (
                          lockedApplicants.filter(a => (a.full_name || "").toLowerCase().includes(searchLocked.toLowerCase()) || (a.email || "").toLowerCase().includes(searchLocked.toLowerCase())).map(applicant => (
                            <label key={applicant.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedLockedIds.includes(applicant.id)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedLockedIds(prev => [...prev, applicant.id]);
                                  else setSelectedLockedIds(prev => prev.filter(id => id !== applicant.id));
                                }}
                                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                              />
                              <div className="flex-1">
                                <p className="font-bold text-sm text-navy dark:text-white">{applicant.full_name || "متقدم"}</p>
                                <p className="text-xs text-slate-500">{applicant.email}</p>
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {unlockMode === "select_people" && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                  <button
                    onClick={async () => {
                      if (selectedLockedIds.length === 0) return alert("الرجاء تحديد شخص واحد على الأقل");
                      try {
                        const { data, error } = await supabase.from('applicants').update({ is_cooldown_bypassed: true }).in('id', selectedLockedIds).select('id');
                        if (error) throw error;
                        window.dispatchEvent(new CustomEvent('showToast', { detail: { message: `تم فك الحظر عن ${data?.length || 0} متقدمين بنجاح`, type: "success" }}));
                        setShowUnlockModal(false);
                      } catch(e: any) {
                        alert("حدث خطأ: " + e.message);
                      }
                    }}
                    disabled={selectedLockedIds.length === 0}
                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    تأكيد الفتح ({selectedLockedIds.length})
                  </button>
                  <button
                    onClick={() => setUnlockMode("initial")}
                    className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    رجوع
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white dark:border-slate-700">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-center text-navy dark:text-white mb-3">تنبيه هام جداً</h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-8 text-sm leading-relaxed font-medium">
                التعديل على أسئلة الاستبعاد سيتم تطبيقه على المتقدمين الجدد فقط. المتقدمون السابقون لن تتأثر طلباتهم ولن يتم استبعادهم بأثر رجعي للحفاظ على دقة التقييم. هل أنت متأكد من الحفظ؟
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowWarningModal(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">إلغاء</button>
                <button onClick={() => handleUpdate(undefined, true)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">تأكيد الحفظ</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
