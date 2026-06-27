import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Sparkles, CheckCircle, Zap, Play, MessageCircle, FileText, Linkedin, Mail, Phone, Send, X, Trash2, Edit2, Calendar, DollarSign, Ban, AlertTriangle, FileDigit, ImageIcon, Video, Paperclip, ExternalLink, Mic, RefreshCw, Target } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.062-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.8 11.8 0 0 0-3.48-8.413Z" />
  </svg>
);

const ApplicantDetails = ({ onBack, applicant, job, onStatusUpdate, userProfile, isSharedView = false }: { onBack: () => void, applicant?: any, job?: any, onStatusUpdate?: (id: string, decision: string, isOffer?: boolean) => void, userProfile?: any, isSharedView?: boolean }) => {
  const [activeTab, setActiveTab] = useState<"analysis" | "requirements" | "interview" | "notes" | "ai_settings">("analysis");
  const [isAILoading, setIsAILoading] = useState(false);
  const [isFullscreenCV, setIsFullscreenCV] = useState(false);

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showAcceptOptions, setShowAcceptOptions] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [interviewLang, setInterviewLang] = useState<'ar' | 'en'>('ar');

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [interviewTime, setInterviewTime] = useState("10:00");
  const [interviewText, setInterviewText] = useState("");

  const [dynamicPercentile, setDynamicPercentile] = useState<number | null>(null);

  // AI Interview Custom Questions State
  const [showInterviewQuestionsModal, setShowInterviewQuestionsModal] = useState(false);
  const [interviewQuestion1, setInterviewQuestion1] = useState("");
  const [interviewQuestion2, setInterviewQuestion2] = useState("");
  const [interviewSendMethod, setInterviewSendMethod] = useState<'whatsapp' | 'email' | null>(null);
  const [isSavingQuestions, setIsSavingQuestions] = useState(false);
  const [pendingInterviewsCount, setPendingInterviewsCount] = useState(0);

  useEffect(() => {
    if (!userProfile?.id) return;
    const fetchPending = async () => {
      const { data: companyJobs } = await supabase.from('jobs').select('id').eq('company_id', userProfile.id);
      if (!companyJobs || companyJobs.length === 0) return;
      const jobIds = companyJobs.map((j: any) => j.id);

      const { count } = await supabase
        .from('applicants')
        .select('id', { count: 'exact', head: true })
        .in('job_id', jobIds)
        .eq('decision', 'interviewing')
        .eq('has_started_interview', false)
        .neq('interview_revoked', true);

      setPendingInterviewsCount(count || 0);
    };
    fetchPending();
  }, [userProfile?.id, isSavingQuestions, applicant?.interview_revoked]);

  useEffect(() => {
    if (!job?.id || !applicant?.id) return;
    const fetchScores = async () => {
      const { data } = await supabase
        .from('applicants')
        .select('match_percentage')
        .eq('job_id', job.id)
        .neq('decision', 'CORRUPT_FILE_DO_NOT_SHOW');

      if (data && data.length > 0) {
        const scores = data.map((d: any) => d.match_percentage || 0).sort((a: number, b: number) => b - a);
        const currentScore = applicant.match_percentage || applicant.rating || 0;

        if (!scores.includes(currentScore)) {
          scores.push(currentScore);
          scores.sort((a: number, b: number) => b - a);
        }

        const rank = scores.indexOf(currentScore) + 1;
        const total = scores.length;
        const betterThanCount = Math.max(0, total - rank);
        const pct = total > 1 ? Math.round((betterThanCount / total) * 100) : 100;

        setDynamicPercentile(pct);
      }
    };
    fetchScores();
  }, [job?.id, applicant?.id, applicant?.match_percentage, applicant?.rating]);

  const REJECTION_REASONS = [
    "غير مطابق للشروط",
    "لم يجتز المقابلة",
    "توقعات الراتب غير متوافقة",
    "الخبرة غير كافية",
    "انسحاب المتقدم",
    "أخرى"
  ];

  const [proposedSalary, setProposedSalary] = useState(applicant?.expectedSalary || "يُحدد لاحقاً");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  });

  type NoteItem = { id: string; text: string; date: string; author: string };
  const [notesList, setNotesList] = useState<NoteItem[]>([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (applicant?.id) {
      if (applicant.hr_notes) {
        if (Array.isArray(applicant.hr_notes)) {
          setNotesList(applicant.hr_notes);
        } else if (typeof applicant.hr_notes === 'string') {
          try {
            const parsedNotes = JSON.parse(applicant.hr_notes);
            setNotesList(Array.isArray(parsedNotes) ? parsedNotes : []);
          } catch (e) {
            setNotesList([]);
          }
        } else {
          setNotesList([]);
        }
      } else {
        setNotesList([]);
      }
    }
  }, [applicant?.id, applicant?.hr_notes]);

  const handleSaveNote = async () => {
    if (!applicant?.id || !newNoteText.trim()) return;
    setIsSavingNote(true);
    setIsNoteSaved(false);

    const newNoteObj: NoteItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      text: newNoteText.trim(),
      date: new Date().toISOString(),
      author: "مسؤول التوظيف"
    };

    const updatedNotes = [...notesList, newNoteObj];
    setNotesList(updatedNotes);
    setNewNoteText("");

    // Backend Sync
    try {
      const { error } = await supabase
        .from('applicants')
        .update({ hr_notes: JSON.stringify(updatedNotes) })
        .eq('id', applicant.id);

      if (error) {
        console.warn("Supabase Sync Failed:", error);
      }
    } catch (err) {
      console.warn("Could not save note to Supabase", err);
    } finally {
      setIsSavingNote(false);
      setIsNoteSaved(true);
      setTimeout(() => setIsNoteSaved(false), 3000);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!applicant?.id) return;

    const updatedNotes = notesList.filter(n => n.id !== noteId);
    setNotesList(updatedNotes);

    // Backend Sync
    try {
      const { error } = await supabase
        .from('applicants')
        .update({ hr_notes: JSON.stringify(updatedNotes) })
        .eq('id', applicant.id);

      if (error) {
        console.warn("Supabase Sync Failed:", error);
      }
    } catch (err) {
      console.warn("Could not delete note from Supabase", err);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!applicant?.id || !editNoteText.trim()) return;

    const updatedNotes = notesList.map(n => n.id === noteId ? { ...n, text: editNoteText.trim(), date: new Date().toISOString() } : n);
    setNotesList(updatedNotes);
    setEditingNoteId(null);
    setEditNoteText("");

    // Backend Sync
    try {
      await supabase
        .from('applicants')
        .update({ hr_notes: JSON.stringify(updatedNotes) })
        .eq('id', applicant.id);
    } catch (err) {
      console.warn("Could not update note in Supabase", err);
    }
  };

  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const plan = userProfile?.subscription_tier || 'free';
  let interviewsLimit = userProfile?.interviews_limit ?? 0;
  if (!interviewsLimit) {
    if (plan === 'free' || plan === 'one-time') interviewsLimit = 0;
    else if (plan === 'startup' || plan === 'growth') interviewsLimit = 100;
    else if (plan === 'business') interviewsLimit = 500;
    else if (plan === 'enterprise') interviewsLimit = 1500;
  }
  const interviewsUsed = userProfile?.used_interviews || 0;
  const interviewsRemaining = Math.max(0, interviewsLimit - interviewsUsed);
  const overbooked = pendingInterviewsCount >= interviewsRemaining && interviewsRemaining > 0;

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleSilentAccept = async () => {
    if (!applicant) return;
    try {
      await supabase.from('applicants').update({ decision: 'accepted' }).eq('id', applicant.id);
      if (onStatusUpdate) onStatusUpdate(applicant.id, 'accepted', false);
      onBack();
    } catch (err) { console.error(err); }
  };

  const handleReject = async () => {
    if (!applicant) return;
    try {
      await supabase.from('applicants').update({ decision: 'filtered', rejection_reason: 'استبعاد يدوي من الإدارة' }).eq('id', applicant.id);
      if (onStatusUpdate) onStatusUpdate(applicant.id, 'filtered', false);
      onBack();
    } catch (err) { console.error(err); }
  };

  const handleSendOfferDB = async () => {
    if (!applicant) return;
    try {
      await supabase.from('job_offers').insert([{
        applicant_id: applicant.id,
        offer_message: offerText,
        proposed_salary: Number(proposedSalary.replace(/\D/g, '')) || 0,
        start_date: startDate,
        status: 'pending'
      }]);
      await supabase.from('applicants').update({ decision: 'accepted' }).eq('id', applicant.id);
      if (onStatusUpdate) onStatusUpdate(applicant.id, 'accepted', true);
      onBack();
    } catch (err) { console.error(err); }
  };


  const handleUpdateDecision = async (newDecision: string, reason: string = "") => {
    if (!applicant) return;

    // Optimistic UI Update
    applicant.decision = newDecision as any;
    if (reason) applicant.rejection_reason = reason;
    setIsFullscreenCV(prev => prev); // force re-render

    let decisionText = newDecision;
    if (newDecision === "accepted") decisionText = "المقبولين";
    else if (newDecision === "rejected") decisionText = "المرفوضين";
    else if (newDecision === "interview" || newDecision === "interviewing") decisionText = "المقابلات";

    setToastMessage(`تم نقل المتقدم إلى قائمة ${decisionText} بنجاح!`);
    setTimeout(() => setToastMessage(null), 3000);

    // Backend Sync
    try {
      await supabase
        .from('applicants')
        .update({ decision: newDecision, rejection_reason: reason })
        .eq('id', applicant.id);
    } catch (err) {
      console.warn("Could not sync decision to Supabase:", err);
    }
  };

  const [offerText, setOfferText] = useState("");
  // Simulated candidate data for conditional rendering of contact info
  const candidate = {
    linkedin: applicant?.linkedin || "",
    whatsapp: applicant?.phone || "966500000000",
    email: applicant?.email || "ahmed@example.com",
    phone: applicant?.phone || "966500000000",
    expectedSalary: "6000",
    jobSalaryRange: "5000 إلى 8000"
  };




  const safeParseArray = (val: any) => {
    if (!val) return [];
    if (typeof val === 'string') {
      try { val = JSON.parse(val); } catch (e) { return []; }
    }
    if (!Array.isArray(val)) return [val];
    return val.map(item => {
      if (typeof item === 'string') {
        try { return JSON.parse(item); } catch (e) { return item; }
      }
      return item;
    });
  };

  const isAutoRejected = applicant?.rejection_reason && applicant.rejection_reason.includes("مرفوض آلياً");
  const actualMatch = applicant?.matchScore ?? applicant?.rating ?? 0;
  const displayMatch = actualMatch > 1 ? actualMatch : Math.round(actualMatch * 100);
  const strokeOffsetMatch = actualMatch > 1 ? actualMatch / 100 : actualMatch;
  const actualName = applicant?.name ?? "راوي عاصم برناوي";
  const actualJob = applicant?.job ?? "مهندس برمجيات أول";
  const actualSummary = applicant?.ai_justification ?? applicant?.aiSummary ?? "";
  const actualStrengths = safeParseArray(applicant?.top_strengths);
  const actualWeaknesses = safeParseArray(applicant?.top_weaknesses);
  const topPercentile = dynamicPercentile || applicant?.top_percentile;
  const redFlags = safeParseArray(applicant?.red_flags);

  let rawQuestions = applicant?.interview_questions;
  if (!rawQuestions || (Array.isArray(rawQuestions) && rawQuestions.length === 0) || (typeof rawQuestions === 'string' && rawQuestions.length < 5)) {
    rawQuestions = applicant?.suggested_questions || applicant?.interview_plan;
  }
  const interviewQuestions = safeParseArray(rawQuestions);

  const attachments = safeParseArray(applicant?.attachments);

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-teal-500";
    if (score >= 50) return "text-amber-500";
    return "text-rose-500";
  };
  const matchColorClass = getMatchColor(displayMatch);

  const skillsMatch = applicant?.skills_match || 0;
  const expMatch = applicant?.experience_match || 0;
  const eduMatch = applicant?.education_match || 0;

  const getBarColor = (val: number) => {
    if (val >= 80) return "bg-emerald-500";
    if (val >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };



  const companyName = applicant?.companyName || applicant?.company || "شركتنا";

  useEffect(() => {
    setOfferText(`السلام عليكم الأستاذ/ ${actualName}،\n\nيسعدنا إبلاغك بقبولك المبدئي لوظيفة ${actualJob} في ${companyName}، براتب شهري قدره ${applicant?.expectedSalary || "يُحدد لاحقاً"}.\n\nنأمل تأكيد المباشرة في تاريخ: ${startDate}.\n\nمع أطيب التحيات،\nإدارة الموارد البشرية`);
  }, [startDate, actualName, actualJob, applicant?.expectedSalary, companyName]);

  useEffect(() => {
    setInterviewText(`السلام عليكم الأستاذ/ ${actualName}،\n\nيسعدنا إبلاغك بترشيحك للمقابلة الشخصية لوظيفة ${actualJob} في ${companyName}.\n\nتم تحديد موعد المقابلة يوم ${interviewDate} الساعة ${interviewTime}.\nنأمل منك تأكيد الحضور.\n\nمع أطيب التحيات،\nإدارة الموارد البشرية`);
  }, [interviewDate, interviewTime, actualName, actualJob, companyName]);

  useEffect(() => {
    setInterviewText(`السلام عليكم الأستاذ/ ${actualName}،\n\nيسعدنا إبلاغك بترشيحك للمقابلة الشخصية لوظيفة ${actualJob} في ${companyName}.\n\nتم تحديد موعد المقابلة يوم ${interviewDate} الساعة ${interviewTime}.\nنأمل منك تأكيد الحضور.\n\nمع أطيب التحيات،\nإدارة الموارد البشرية`);
  }, [interviewDate, interviewTime, actualName, actualJob, companyName]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8 pt-24 lg:pt-10">
      {" "}
      <div className="max-w-7xl mx-auto">
        {" "}
        <div className="flex flex-col gap-4 mb-8">
          {/* Top Row: Back Button & Primary Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 w-full">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onBack(); }}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary font-bold transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-primary transition-all">
                <ArrowLeft size={18} className="rotate-180" />
              </div>
              العودة للوحة التحكم
            </button>

            {!isSharedView && (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => { if (applicant) setShowOfferModal(true); }}
                  className="bg-primary hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-transparent"
                >
                  <Send size={16} /> قبول وإرسال عرض
                </button>

                <button
                  onClick={handleReject}
                  className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 border border-red-100 dark:border-red-900/30 hover:border-transparent"
                >
                  <X size={16} /> رفض
                </button>

                <button
                  onClick={handleSilentAccept}
                  className="bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white dark:bg-teal-900/20 dark:text-teal-400 dark:hover:bg-teal-600 dark:hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 border border-teal-100 dark:border-teal-900/30 hover:border-transparent"
                >
                  <CheckCircle size={16} /> قبول
                </button>
              </div>
            )}
          </div>
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {" "}
          {/* Right Column - AI Analysis & Audio (6 columns) */}{" "}
          <div className="lg:col-span-5 space-y-8 order-1 lg:order-2 lg:min-h-[900px]">
            {" "}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white dark:border-slate-700 relative overflow-hidden">
              {" "}
              <div className="flex flex-col items-center justify-center text-center mb-8">
                <h2 className="text-4xl font-black text-navy dark:text-white mb-3 tracking-tight">
                  {actualName}
                </h2>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-primary font-bold text-base px-5 py-2 bg-primary/10 border border-primary/20 rounded-full shadow-sm">
                    {actualJob}
                  </p>
                </div>
              </div>{" "}
              {!isAutoRejected && (
                <div className="bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-[32px] p-8 mb-8 flex flex-col items-center relative overflow-hidden">
                  {/* Subtle Background Glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                  <div className="relative w-28 h-28 mb-5 group">
                    <svg className="w-full h-full drop-shadow-sm transition-transform duration-500 group-hover:scale-105" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="matchGradient-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2dd4bf" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                        <linearGradient id="matchGradient-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                        <linearGradient id="matchGradient-rose" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fb7185" />
                          <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                      </defs>
                      <circle
                        className="text-slate-100 dark:text-slate-800 stroke-current shadow-inner"
                        strokeWidth="6"
                        cx="50"
                        cy="50"
                        r="42"
                        fill="transparent"
                        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" }}
                      />
                      <motion.circle
                        strokeWidth="6"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="42"
                        fill="transparent"
                        stroke={displayMatch >= 80 ? "url(#matchGradient-teal)" : displayMatch >= 50 ? "url(#matchGradient-amber)" : "url(#matchGradient-rose)"}
                        style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.15))" }}
                        strokeDasharray="263.89"
                        initial={{ strokeDashoffset: 263.89 }}
                        animate={{ strokeDashoffset: 263.89 * (1 - strokeOffsetMatch) }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-0.5">
                      <span className={`text-3xl font-bold ${matchColorClass}`}>
                        {displayMatch}%
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                        مطابقة
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 mb-8 w-full z-10">
                    <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-[20px] text-sm font-bold border ${displayMatch >= 80 ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-800/30' : displayMatch >= 50 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/30'} shadow-[0_4px_10px_rgba(0,0,0,0.03)]`}>
                      {displayMatch >= 80 ? <CheckCircle size={16} /> : displayMatch >= 50 ? <AlertTriangle size={16} /> : <X size={16} />}
                      {displayMatch >= 80 ? "توافق عالي جداً" : displayMatch >= 50 ? "توافق جيد" : "توافق منخفض"}
                    </div>

                    {topPercentile && (
                      <div className="relative w-full max-w-[200px] mt-2">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-slate-200/60 dark:border-slate-700/60"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white dark:bg-slate-800 px-3 text-[13px] font-bold text-slate-500 dark:text-slate-400">
                            أفضل من <span className="text-primary font-black">{topPercentile}%</span> من المتقدمين
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full space-y-4 mt-2 pt-6 border-t border-slate-100 dark:border-slate-700/50 relative z-10">
                    {[
                      { label: "تطابق المهارات", val: skillsMatch, delay: 0.3 },
                      { label: "تطابق الخبرة", val: expMatch, delay: 0.4 },
                      { label: "تطابق التعليم", val: eduMatch, delay: 0.5 },
                    ].map((item, idx) => (
                      <div key={idx} className="w-full group">
                        <div className="flex justify-between items-end mb-2 px-1">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{item.label}</span>
                          <span className="text-sm font-black text-navy dark:text-white">{item.val}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-3 p-[2px] shadow-inner border border-slate-200/50 dark:border-slate-700/50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.val}%` }}
                            transition={{ duration: 1, delay: item.delay }}
                            className={`h-full rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.1)] ${item.val >= 80 ? 'bg-gradient-to-r from-teal-400 to-teal-500' : item.val >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-rose-400 to-rose-500'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-[20px] mb-8 border border-slate-100 dark:border-slate-700/50 gap-1.5">
                <button
                  onClick={() => setActiveTab("analysis")}
                  className={`flex-1 min-w-fit py-3 px-2 sm:px-4 text-xs lg:text-sm font-bold rounded-2xl transition-all active:translate-y-[4px] active:border-b-0 active:shadow-none ${activeTab === "analysis" ? "bg-white dark:bg-slate-700 text-primary shadow-md border-b-[4px] border-slate-200 dark:border-slate-800" : "bg-transparent text-slate-500 dark:text-slate-400 border-b-[4px] border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"}`}
                >
                  المطابقة والتحليل
                </button>
                <button
                  onClick={() => setActiveTab("requirements")}
                  className={`flex-1 min-w-fit py-3 px-2 sm:px-4 text-xs lg:text-sm font-bold rounded-2xl transition-all active:translate-y-[4px] active:border-b-0 active:shadow-none ${activeTab === "requirements" ? "bg-white dark:bg-slate-700 text-primary shadow-md border-b-[4px] border-slate-200 dark:border-slate-800" : "bg-transparent text-slate-500 dark:text-slate-400 border-b-[4px] border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"}`}
                >
                  نموذج التقديم
                </button>
                {!isAutoRejected && (
                  <button
                    onClick={() => setActiveTab("interview")}
                    className={`flex-1 min-w-fit py-3 px-2 sm:px-4 text-xs lg:text-sm font-bold rounded-2xl transition-all active:translate-y-[4px] active:border-b-0 active:shadow-none ${activeTab === "interview" ? "bg-white dark:bg-slate-700 text-primary shadow-md border-b-[4px] border-slate-200 dark:border-slate-800" : "bg-transparent text-slate-500 dark:text-slate-400 border-b-[4px] border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"}`}
                  >
                    خطة المقابلة
                  </button>
                )}
                {!isSharedView && !isAutoRejected && (
                  <button
                    onClick={() => setActiveTab("ai_settings")}
                    className={`flex-1 min-w-fit py-3 px-2 sm:px-4 text-xs lg:text-sm font-bold rounded-2xl transition-all active:translate-y-[4px] active:border-b-0 active:shadow-none ${activeTab === "ai_settings" ? "bg-white dark:bg-slate-700 text-primary shadow-md border-b-[4px] border-slate-200 dark:border-slate-800" : "bg-transparent text-slate-500 dark:text-slate-400 border-b-[4px] border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"}`}
                  >
                    إعداد الذكاء الاصطناعي
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`flex-1 min-w-fit py-3 px-2 sm:px-4 text-xs lg:text-sm font-bold rounded-2xl transition-all active:translate-y-[4px] active:border-b-0 active:shadow-none ${activeTab === "notes" ? "bg-white dark:bg-slate-700 text-primary shadow-md border-b-[4px] border-slate-200 dark:border-slate-800" : "bg-transparent text-slate-500 dark:text-slate-400 border-b-[4px] border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"}`}
                >
                  ملاحظات
                </button>
              </div>

              <div className="min-h-[700px] w-full">
                {activeTab === "analysis" && isAILoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-6"></div>
                    <h3 className="text-xl font-bold text-navy dark:text-white mb-2">جاري تحليل البيانات بواسطة نظام فرز... ⏳</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">يقوم النظام بقراءة وتقييم البيانات حالياً.</p>
                  </motion.div>
                )}
                {activeTab === "analysis" && !isAILoading && isAutoRejected && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-16 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 rounded-[32px]">
                    <Ban size={48} className="text-rose-500/50 mb-4" />
                    <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400">مستبعد آلياً</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-center px-4 max-w-lg leading-relaxed">تم استبعاد المتقدم تلقائياً لعدم اجتيازه الأسئلة الاستبعادية.</p>
                  </motion.div>
                )}
                {activeTab === "analysis" && !isAILoading && !isAutoRejected && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                    {applicant?.expectedSalary && (applicant?.askExpectedSalary === "open" || applicant?.askExpectedSalary === "ranges") && (
                      <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm mb-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/30">
                          <DollarSign size={16} />
                        </div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          الراتب المتوقع بناءً على إجابة المتقدم: <span className="text-navy dark:text-white font-black ml-1 text-sm">{applicant.expectedSalary} {applicant.expectedSalary.toString().includes("ريال") ? "" : "ريال"}</span>
                        </p>
                      </div>
                    )}

                    {applicant?.is_interview_completed && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/10 border-2 border-b-[6px] border-emerald-200 dark:border-emerald-800/50 p-6 rounded-[32px] mb-6 shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
                        <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2 drop-shadow-sm">
                          <Mic size={20} className="text-emerald-600 dark:text-emerald-400" /> التسجيل الصوتي للمقابلة
                        </h3>
                        <div className="flex flex-col gap-4">
                          {applicant?.voiceEvalUrl ? (
                            <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)]">
                              <span className="block text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-3">استمع للمقابلة الصوتية:</span>
                              <audio controls src={applicant.voiceEvalUrl} className="w-full outline-none rounded-lg drop-shadow-sm" />
                            </div>
                          ) : (
                            <div className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-inner">
                              <span className="block text-sm font-medium text-slate-500 dark:text-slate-400">جاري معالجة التسجيل الصوتي، يرجى الانتظار...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border-2 border-b-[6px] border-slate-200 dark:border-slate-700/80 shadow-sm">
                      <h3 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center gap-2">
                        <Sparkles size={20} className="text-primary" /> ملخص المطابقة
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {actualSummary || applicant?.aiSummary || "لا يوجد ملخص متاح حالياً"}
                      </p>
                    </div>

                    {redFlags && redFlags.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/10 border-2 border-b-[6px] border-red-200 dark:border-red-800/50 p-6 rounded-[32px] shadow-sm">
                        <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                          رادار التحذيرات
                        </h4>
                        <ul className="space-y-2">
                          {redFlags.map((flagObj: any, i: number) => {
                            const flagText = typeof flagObj === 'string' ? flagObj : (flagObj.point || "");
                            const evidenceText = typeof flagObj === 'string' ? "" : (flagObj.evidence || "");
                            if (!flagText) return null;
                            return (
                              <li key={i} className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                <div>
                                  <p className="text-sm text-red-800 dark:text-red-300/90 leading-relaxed font-bold">{flagText}</p>
                                  {evidenceText && (
                                    <details className="mt-1.5 group cursor-pointer">
                                      <summary className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors list-none [&::-webkit-details-marker]:hidden">
                                        <svg className="w-3 h-3 group-open:rotate-90 transition-transform text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                        عرض الدليل
                                      </summary>
                                      <p className="text-[13px] text-slate-600 dark:text-slate-300 italic mt-2 font-medium pr-3 border-r-2 border-red-200 dark:border-red-800/50 py-1" dir="ltr text-left">
                                        {evidenceText.toString().replace(/^["']|["']$/g, '').trim()}
                                      </p>
                                    </details>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-[#F0FDF4] dark:bg-green-900/10 border-2 border-b-[6px] border-green-200 dark:border-green-800/50 p-6 rounded-[32px] shadow-sm">
                        <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                          نقاط القوة
                        </h4>
                        <ul className="space-y-4">
                          {actualStrengths.map((strObj: any, i: number) => {
                            const strengthText = typeof strObj === 'string' ? strObj : (strObj.point || strObj.strength || "");
                            const evidenceText = typeof strObj === 'string' ? "" : (strObj.evidence || "");
                            if (!strengthText) return null;
                            return (
                              <li key={i} className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                <div>
                                  <p className="text-sm text-green-800 dark:text-green-300/90 leading-relaxed font-bold">{strengthText}</p>
                                  {evidenceText && (
                                    <details className="mt-1.5 group cursor-pointer">
                                      <summary className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 hover:text-green-500 transition-colors list-none [&::-webkit-details-marker]:hidden">
                                        <svg className="w-3 h-3 group-open:rotate-90 transition-transform text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                        عرض الدليل
                                      </summary>
                                      <p className="text-[13px] text-slate-600 dark:text-slate-300 italic mt-2 font-medium pr-3 border-r-2 border-green-200 dark:border-green-800/50 py-1" dir="ltr text-left">
                                        {evidenceText.toString().replace(/^["']|["']$/g, '').trim()}
                                      </p>
                                    </details>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="bg-[#FFF7ED] dark:bg-orange-900/10 border-2 border-b-[6px] border-orange-200 dark:border-orange-800/50 p-6 rounded-[32px] shadow-sm">
                        <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                          نقاط الضعف
                        </h4>
                        <ul className="space-y-2">
                          {actualWeaknesses.map((weakObj: any, i: number) => {
                            const weakText = typeof weakObj === 'string' ? weakObj : (weakObj.point || "");
                            const evidenceText = typeof weakObj === 'string' ? "" : (weakObj.evidence || "");
                            if (!weakText) return null;
                            return (
                              <li key={i} className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                                <div>
                                  <p className="text-sm text-orange-800 dark:text-orange-300/90 leading-relaxed font-bold">{weakText}</p>
                                  {evidenceText && (
                                    <details className="mt-1.5 group cursor-pointer">
                                      <summary className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 hover:text-orange-500 transition-colors list-none [&::-webkit-details-marker]:hidden">
                                        <svg className="w-3 h-3 group-open:rotate-90 transition-transform text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                        عرض الدليل
                                      </summary>
                                      <p className="text-[13px] text-slate-600 dark:text-slate-300 italic mt-2 font-medium pr-3 border-r-2 border-orange-200 dark:border-orange-800/50 py-1" dir="ltr text-left">
                                        {evidenceText.toString().replace(/^["']|["']$/g, '').trim()}
                                      </p>
                                    </details>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "requirements" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                    {/* إجابات المتقدم على الأسئلة المخصصة */}
                    {(() => {
                      const answers = safeParseArray(applicant?.custom_answers || applicant?.customAnswers);
                      let regularAnswers = answers.filter((a: any) => !a?.isKnockout && a?.answer && a.answer.toString().trim() !== "");

                      if (candidate.email && !regularAnswers.some(a => a.question === "البريد الإلكتروني")) {
                        regularAnswers = [{ question: "البريد الإلكتروني", answer: candidate.email }, ...regularAnswers];
                      }
                      if (candidate.phone && !regularAnswers.some(a => a.question === "رقم الجوال")) {
                        let formattedPhone = candidate.phone;
                        if (formattedPhone.startsWith("5")) {
                          formattedPhone = "0" + formattedPhone;
                        }
                        regularAnswers = [{ question: "رقم الجوال", answer: formattedPhone }, ...regularAnswers];
                      }

                      const knockoutAnswers = answers.filter((a: any) => a?.isKnockout);
                      const jobKnockoutQuestions = safeParseArray(job?.knockoutQuestions);

                      return (
                        <>
                          {/* أسئلة الاستبعاد المباشر */}
                          {knockoutAnswers.length > 0 && (
                            <div className="bg-rose-50/50 dark:bg-rose-900/10 border-2 border-b-[6px] border-rose-200 dark:border-rose-800/50 p-6 rounded-[32px] mt-6 shadow-sm">
                              <h4 className="font-bold text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
                                <Ban size={18} /> إجابات أسئلة الاستبعاد المباشر (Knockout)
                              </h4>
                              <div className="space-y-4">
                                {knockoutAnswers.map((ansObj: any, i: number) => (
                                  <div key={i} className="p-4 rounded-2xl shadow-sm border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">السؤال {i + 1}: {ansObj.question}</p>
                                    <p className="text-sm font-bold text-navy dark:text-white leading-relaxed whitespace-pre-wrap">{ansObj.answer}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* أسئلة نموذج التقديم */}
                          {regularAnswers.length > 0 && (
                            <div className="bg-primary/5 border-2 border-b-[6px] border-primary/20 p-6 rounded-[32px] mt-6 shadow-sm">
                              <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                                <MessageCircle size={18} /> إجابات أسئلة نموذج التقديم
                              </h4>
                              <div className="space-y-4">
                                {regularAnswers.map((ans: any, i: number) => (
                                  <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">السؤال {i + 1}: {ans.question}</p>
                                    {typeof ans.answer === 'string' && (ans.answer.startsWith('http://') || ans.answer.startsWith('https://')) && !ans.answer.includes(' ') ? (
                                      <a href={ans.answer} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-1 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                        عرض المرفق / الرابط
                                      </a>
                                    ) : (
                                      <p className="text-sm font-bold text-navy dark:text-white leading-relaxed whitespace-pre-wrap">{ans.answer}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    {/* المرفقات (Attachments) */}
                    {attachments.length > 0 && (
                      <div className="bg-slate-50/50 dark:bg-slate-800/20 border-2 border-b-[6px] border-slate-200 dark:border-slate-700/80 p-6 rounded-[32px] mt-6 shadow-sm">
                        <h4 className="font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
                          <FileDigit size={18} /> المرفقات المستلمة
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {attachments.map((att: any, i: number) => (
                            <a key={i} href={att.url || att.link} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 transition-colors group">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                  {att.type === 'image' ? <ImageIcon size={14} /> : att.type === 'video' ? <Video size={14} /> : <Paperclip size={14} />}
                                </div>
                                <span className="text-sm font-bold text-navy dark:text-white truncate">{att.name || `مرفق ${i + 1}`}</span>
                              </div>
                              <ExternalLink size={14} className="text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "notes" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border-2 border-b-[6px] border-slate-200 dark:border-slate-700/80 w-full flex flex-col shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-navy dark:text-white">ملاحظات داخلية</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">خاصة بفريق التوظيف (سجل الملاحظات)</p>
                        </div>
                      </div>

                      <div className="mb-6 space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {notesList.map((note) => (
                          <div key={note.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative group">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{note.author}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{new Date(note.date).toLocaleString('ar-SA')}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      setEditingNoteId(note.id);
                                      setEditNoteText(note.text);
                                    }}
                                    className="p-1.5 text-slate-300 hover:text-blue-500 transition-colors bg-white dark:bg-slate-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                    title="تعديل الملاحظة"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => setNoteToDelete(note.id)}
                                    className="p-1.5 text-slate-300 hover:text-red-500 transition-colors bg-white dark:bg-slate-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                                    title="حذف الملاحظة"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                            {noteToDelete === note.id ? (
                              <div className="space-y-3 mt-2 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                                <p className="text-sm font-bold text-red-600 dark:text-red-400">هل أنت متأكد من حذف هذه الملاحظة نهائياً؟</p>
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => setNoteToDelete(null)} className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">إلغاء</button>
                                  <button onClick={() => { handleDeleteNote(note.id); setNoteToDelete(null); }} className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">نعم، احذفها</button>
                                </div>
                              </div>
                            ) : editingNoteId === note.id ? (
                              <div className="space-y-3 mt-2">
                                <textarea
                                  value={editNoteText}
                                  onChange={(e) => setEditNoteText(e.target.value)}
                                  rows={3}
                                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-medium outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                                />
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => setEditingNoteId(null)} className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">إلغاء</button>
                                  <button onClick={() => handleUpdateNote(note.id)} disabled={!editNoteText.trim() || editNoteText === note.text} className="px-4 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">حفظ التعديل</button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                            )}
                          </div>
                        ))}
                        {notesList.length === 0 && (
                          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm font-bold bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            لا توجد ملاحظات مسجلة حتى الآن.
                          </div>
                        )}
                      </div>

                      <div className="relative pt-4 border-t border-slate-200 dark:border-slate-700">
                        <textarea
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          placeholder="إضافة ملاحظة جديدة..."
                          rows={3}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm font-medium outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-none mb-4"
                        />

                        <div className="flex justify-end">
                          <button
                            onClick={handleSaveNote}
                            disabled={isSavingNote || !newNoteText.trim()}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:translate-y-[4px] active:border-b-0 active:shadow-none ${isNoteSaved
                              ? "bg-green-500 text-white border-b-[4px] border-green-700"
                              : "bg-primary text-white border-b-[4px] border-[#1d827b] hover:bg-primary/90 hover:border-[#15615c] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-[4px]"
                              }`}
                          >
                            {isSavingNote ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري الحفظ...
                              </>
                            ) : isNoteSaved ? (
                              <>
                                <CheckCircle size={16} /> تم الحفظ بنجاح
                              </>
                            ) : (
                              <>
                                إضافة الملاحظة
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "interview" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="bg-primary/5 border-2 border-b-[6px] border-primary/20 p-5 rounded-[24px] mb-6 shadow-sm">
                      <p className="text-sm font-bold text-primary flex items-center gap-3">
                        <Target size={20} />
                        أسئلة تكتيكية مصممة للتركيز على الفجوات ونقاط التقييم الحرجة:
                      </p>
                    </div>
                    {(() => {
                      let questions = interviewQuestions;

                      // Flatten in case safeParseArray returns nested arrays (e.g., [ [{q: "..."}] ])
                      if (Array.isArray(questions)) {
                        questions = questions.flat(Infinity);
                      }

                      if (!questions || questions.length === 0) {
                        return (
                          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 text-center py-8">
                            لا توجد أسئلة مقترحة حالياً.
                          </p>
                        );
                      }

                      return questions.map((item: any, idx: number) => {
                        const qText = typeof item === 'string' ? item : (item.q || item.question || item.text || item.question_text || item.content || item.title || "");
                        const rText = typeof item === 'string' ? "" : (item.purpose || item.reason || item.objective || item.justification || item.description || "");

                        if (!qText) return null;

                        return (
                          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border-2 border-b-[6px] border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 transition-all">
                            <h4 className="font-bold text-navy dark:text-white mb-4 text-sm leading-loose flex items-start gap-3">
                              <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="pt-1">{qText}</span>
                            </h4>
                            {rText && (
                              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 block px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700 mt-2 leading-loose">
                                <span className="text-primary mr-1 text-sm bg-primary/10 px-3 py-1.5 rounded-lg ml-2 inline-block">الهدف من السؤال</span>
                                {rText}
                              </p>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </motion.div>
                )}

                {activeTab === "ai_settings" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm">
                      <h3 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center gap-2">
                        <Sparkles size={20} className="text-primary" /> المقابلة بالذكاء الاصطناعي
                      </h3>

                      {applicant?.decision !== "interview" && applicant?.decision !== "interviewing" && (
                        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-4">هذا المتقدم غير مرشح للمقابلة حالياً. هل ترغب بترشيحه الآن؟</p>
                          <button
                            onClick={() => {
                              if (!applicant || !onStatusUpdate) return;
                              setIsScheduling(true);
                              setTimeout(async () => {
                                try {
                                  await supabase.from('applicants').update({ decision: 'interview' }).eq('id', applicant.id);
                                  applicant.decision = "interview";
                                  setToastMessage("تم نقل المتقدم إلى قائمة المقابلات بنجاح!");
                                  setTimeout(() => setToastMessage(null), 3000);
                                  onStatusUpdate(applicant.id, "interview");
                                } catch (err) {
                                  console.error("Failed to nominate to AI interview", err);
                                } finally {
                                  setIsScheduling(false);
                                }
                              }, 600);
                            }}
                            disabled={isScheduling}
                            className={`px-8 py-3 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 border ${isScheduling ? "bg-yellow-50 text-yellow-400 border-yellow-100 cursor-wait dark:bg-yellow-900/20 dark:text-yellow-600 dark:border-yellow-900/20" : "bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-600 dark:hover:text-white border-yellow-100 dark:border-yellow-900/50 hover:border-transparent"}`}
                          >
                            {isScheduling ? (
                              <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> جاري النقل...</>
                            ) : (
                              <><Calendar size={16} /> ترشيح لمقابلة AI</>
                            )}
                          </button>
                        </div>
                      )}

                      {(applicant?.decision === "interview" || applicant?.decision === "interviewing") && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 w-full shadow-inner">
                          <div className="flex flex-col gap-6">

                            <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm w-max">
                              <span className="text-sm font-bold text-slate-500 dark:text-slate-400 px-2">لغة المقابلة:</span>
                              <select
                                value={interviewLang}
                                onChange={(e) => setInterviewLang(e.target.value as 'ar' | 'en')}
                                className="text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-primary font-bold text-navy dark:text-white cursor-pointer w-48"
                              >
                                <option value="ar">العربية 🇸🇦</option>
                                <option value="en">English 🇺🇸</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                              <button
                                onClick={() => {
                                  if (interviewsRemaining === 0) {
                                    setToastMessage("رصيد المقابلات صفر، لا يمكنك إرسال رابط أو إعادة فتح الرابط.");
                                    setTimeout(() => setToastMessage(null), 3000);
                                    return;
                                  }
                                  setInterviewSendMethod('whatsapp');
                                  setShowInterviewQuestionsModal(true);
                                }}
                                className="bg-[#25D366] text-white hover:bg-[#1DA851] px-5 py-3 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 border border-transparent w-full whitespace-nowrap"
                              >
                                <WhatsAppIcon size={18} /> إرسال عبر واتساب
                              </button>

                              <button
                                onClick={() => {
                                  if (interviewsRemaining === 0) {
                                    setToastMessage("رصيد المقابلات صفر، لا يمكنك إرسال رابط أو إعادة فتح الرابط.");
                                    setTimeout(() => setToastMessage(null), 3000);
                                    return;
                                  }
                                  setInterviewSendMethod('email');
                                  setShowInterviewQuestionsModal(true);
                                }}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-900/30 hover:border-transparent w-full whitespace-nowrap"
                              >
                                <Mail size={18} /> إرسال بالإيميل
                              </button>

                              <button
                                onClick={async () => {
                                  if (interviewsRemaining === 0) {
                                    setToastMessage("رصيد المقابلات صفر، لا يمكنك إرسال رابط أو إعادة فتح الرابط.");
                                    setTimeout(() => setToastMessage(null), 3000);
                                    return;
                                  }
                                  if (!window.confirm("تنبيه: هذا المتقدم قد أجرى المقابلة مسبقاً. هل تريد تأكيد فك القفل وإعادة فتح المقابلة له؟")) return;
                                  try {
                                    await supabase.from('applicants').update({ has_started_interview: false, is_interview_completed: false, interview_revoked: false }).eq('id', applicant.id);
                                    if (applicant) { applicant.has_started_interview = false; applicant.is_interview_completed = false; applicant.interview_revoked = false; }
                                    if (onStatusUpdate) onStatusUpdate(applicant.id, applicant.decision || 'interview', false);
                                    alert("تم فك القفل بنجاح، يمكنك الآن إعادة إرسال الرابط.");
                                  } catch (err) { alert("حدث خطأ أثناء فك القفل."); }
                                }}
                                className="bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white dark:bg-amber-900/20 dark:text-amber-400 px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-amber-100 dark:border-amber-900/30 hover:border-transparent w-full"
                              >
                                <RefreshCw size={18} /> إعادة فتح الرابط
                              </button>

                              {((applicant?.decision === 'interview_sent' || applicant?.interview_sent || applicant?.decision === 'interviewing') && !applicant?.has_started_interview && !applicant?.interview_revoked) && (
                                <button
                                  onClick={async () => {
                                    if (!window.confirm("تم إرسال رابط المقابلة مسبقاً. إذا لم يتجاوب المتقدم، يمكنك سحب الرابط لاسترجاع الحجز.\n\nهل أنت متأكد من سحب وإلغاء الرابط؟")) return;
                                    try {
                                      await supabase.from('applicants').update({ interview_revoked: true }).eq('id', applicant.id);
                                      if (applicant) applicant.interview_revoked = true;
                                      setPendingInterviewsCount(prev => Math.max(0, prev - 1));
                                      alert("تم إلغاء الرابط بنجاح.");
                                    } catch (err) { console.error(err); }
                                  }}
                                  className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-800 w-full"
                                >
                                  <Ban size={18} /> سحب وإلغاء الرابط
                                </button>
                              )}
                            </div>

                            {applicant?.interview_revoked && (
                              <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-bold py-3 px-5 rounded-xl flex items-center gap-2 border border-slate-200 dark:border-slate-700 w-max mt-2">
                                <Ban size={18} /> تم سحب وإلغاء رابط المقابلة لهذا المتقدم.
                              </div>
                            )}

                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>{" "}
          </div>{" "}
          {/* Left Column - CV Viewer (7 columns) */}{" "}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col gap-6">
            {" "}
            <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white dark:border-slate-700 h-[1050px] flex flex-col overflow-hidden">
              {" "}
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                {" "}
                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 border-b-[4px] shadow-sm">
                  {" "}
                  <FileText
                    size={20}
                    className="text-slate-400 dark:text-slate-500"
                  />{" "}
                  <span className="font-bold text-navy dark:text-white">
                    السيرة الذاتية - {applicant?.name || "متقدم"}.pdf
                  </span>{" "}
                </div>{" "}
                {applicant?.cv_file_url ? (
                  <a 
                    href={applicant.cv_file_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    download={`CV_${applicant?.name || 'Applicant'}`}
                    className="text-primary font-bold text-sm hover:underline cursor-pointer"
                  >
                    تحميل الملف
                  </a>
                ) : (
                  <span className="text-slate-400 font-bold text-sm">
                    تحميل الملف
                  </span>
                )}{" "}
              </div>{" "}
              <div className="flex-1 bg-slate-100 mx-8 mt-8 mb-4 rounded-[32px] border-2 border-slate-200 dark:border-slate-700 overflow-hidden relative flex flex-col justify-end">
                {applicant?.cv_file_url ? (
                  applicant.cv_file_url.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) ? (
                    <img src={applicant.cv_file_url} className="absolute inset-0 w-full h-full object-contain bg-slate-50/50 dark:bg-slate-800 rounded-[30px] p-4" alt="CV" />
                  ) : (
                    <iframe src={applicant.cv_file_url + "#toolbar=0&view=FitH"} className="absolute inset-0 w-full h-full border-none bg-white rounded-[30px]" />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold bg-white dark:bg-slate-800 rounded-[30px]">
                    لا توجد سيرة ذاتية مرفوعة (أو جاري معالجتها)
                  </div>
                )}
              </div>
              <div className="flex justify-center mb-6">
                {applicant?.cv_file_url ? (
                  <button onClick={() => setIsFullscreenCV(true)} className="bg-slate-800 dark:bg-slate-700 text-white border-b-[4px] border-slate-950 dark:border-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900 hover:border-black transition-all shadow-md active:translate-y-[4px] active:border-b-0 active:shadow-none cursor-pointer">
                    <FileText size={18} /> عرض المستند بالحجم الكامل
                  </button>
                ) : (
                  <button disabled className="bg-slate-300 dark:bg-slate-700 text-white border-b-[4px] border-slate-400 dark:border-slate-800 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md cursor-not-allowed opacity-50">
                    <FileText size={18} /> عرض المستند بالحجم الكامل
                  </button>
                )}
              </div>

              {/* Contact Icons - Bottom of CV Wrapper */}
              <div className="flex items-center justify-center gap-3 px-8 pb-8">
                {candidate.linkedin && typeof candidate.linkedin === 'string' && candidate.linkedin.trim() !== "" && candidate.linkedin !== "null" && candidate.linkedin !== "undefined" && (
                  <a href={candidate.linkedin.startsWith('http') ? candidate.linkedin : `https://${candidate.linkedin}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#0A66C2]/10 text-[#0A66C2] border-b-[4px] border-[#0A66C2]/30 rounded-xl flex items-center justify-center hover:bg-[#0A66C2] hover:border-[#0A66C2]/60 hover:text-white transition-all shadow-sm active:translate-y-[4px] active:border-b-0 active:shadow-none" title="لينكد إن">
                    <Linkedin size={20} />
                  </a>
                )}
                {candidate.whatsapp && (
                  <a href={`https://wa.me/${candidate.whatsapp}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 border-b-[4px] border-green-200 dark:border-green-800 rounded-xl flex items-center justify-center hover:bg-green-500 hover:border-green-600 hover:text-white transition-all shadow-sm active:translate-y-[4px] active:border-b-0 active:shadow-none" title="واتساب">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                  </a>
                )}
                {candidate.email && (
                  <a href={`mailto:${candidate.email}`} className="w-10 h-10 bg-navy/5 dark:bg-slate-700/50 text-navy dark:text-slate-200 border-b-[4px] border-navy/20 dark:border-slate-800 rounded-xl flex items-center justify-center hover:bg-navy dark:hover:bg-slate-600 hover:border-navy/40 dark:hover:border-slate-900 hover:text-white transition-all shadow-sm active:translate-y-[4px] active:border-b-0 active:shadow-none" title="إيميل">
                    <Mail size={20} />
                  </a>
                )}
                {candidate.phone && (
                  <a href={`tel:${candidate.phone}`} className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-b-[4px] border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:border-blue-600 hover:text-white transition-all shadow-sm active:translate-y-[4px] active:border-b-0 active:shadow-none" title="اتصال">
                    <Phone size={20} />
                  </a>
                )}
              </div>
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}

      {/* Fullscreen CV Modal */}
      <AnimatePresence>
        {isFullscreenCV && applicant?.cv_file_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-slate-900/95 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between p-6 bg-slate-900 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FileText size={24} className="text-primary" /> السيرة الذاتية - {actualName}
              </h3>
              <button
                onClick={() => setIsFullscreenCV(false)}
                className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-red-500/20 flex items-center justify-center transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 w-full h-full p-4 md:p-8">
              {applicant.cv_file_url.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) ? (
                <img src={applicant.cv_file_url} className="w-full h-full object-contain rounded-2xl bg-transparent" alt="CV" />
              ) : (
                <iframe src={applicant.cv_file_url + "#toolbar=0&view=FitH"} className="w-full h-full rounded-2xl bg-white border-none" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      <AnimatePresence>
        {showOfferModal && (
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
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-2">
                  <Send size={24} className="text-primary" /> إرسال عرض العمل الذكي
                </h3>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الراتب المقترح</label>
                  <input
                    type="text"
                    value={proposedSalary}
                    onChange={(e) => setProposedSalary(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary font-medium mb-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تاريخ المباشرة المتوقع</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نص العرض (قابل للتعديل)</label>
                  <textarea
                    value={offerText}
                    onChange={(e) => setOfferText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary font-medium resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSendOfferDB}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-md"
                >
                  <Send size={20} /> إرسال العرض وحفظه
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-navy text-white px-6 py-4 border border-slate-700/50 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 font-bold"
          >
            {toastMessage.includes("صفر") ? (
              <Ban size={20} className="text-red-400" />
            ) : (
              <CheckCircle size={20} className="text-primary" />
            )}
            <span className={toastMessage.includes("صفر") ? "text-red-100" : ""}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInterviewQuestionsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-[32px] p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowInterviewQuestionsModal(false)}
                className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Mic size={28} />
              </div>

              <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">
                أسئلة المقابلة الإضافية (اختياري)
              </h3>

              {/* Overbooking Warning */}
              {interviewsRemaining === 0 && (
                <div className="mb-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 p-5 rounded-[24px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-rose-850 dark:text-rose-350">
                  <div className="flex gap-3">
                    <Ban size={20} className="shrink-0 mt-0.5 text-rose-550" />
                    <p className="text-sm font-bold leading-relaxed">
                      تنبيه: رصيد المقابلات المتاح لديك (صفر). يمكنك إرسال الروابط، لكنها لن تعمل مع المتقدمين ولن يتمكنوا من بدء المقابلة حتى تقوم بترقية الباقة أو شحن الرصيد.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onBack) onBack();
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('changeTab', { detail: 'الحساب' }));
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent('changeSettingsTab', { detail: 'باقات فرز' }));
                        }, 50);
                      }, 50);
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shrink-0 transition-all shadow-md shadow-rose-550/15"
                  >
                    شحن الرصيد / ترقية الباقة
                  </button>
                </div>
              )}
              {overbooked && (
                <div className="mb-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-5 rounded-[24px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-amber-850 dark:text-amber-350">
                  <div className="flex gap-3">
                    <AlertTriangle size={20} className="shrink-0 mt-0.5 text-amber-550" />
                    <p className="text-sm font-bold leading-relaxed">
                      تنبيه: رصيدك المتبقي ({interviewsRemaining}) مقابلات، ولديك ({pendingInterviewsCount}) دعوات معلقة لم تُستخدم بعد. أول ({interviewsRemaining}) متقدمين سيدخلون سيتم قبولهم، وسيُعطل الرابط تلقائياً عن البقية.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onBack) onBack();
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('changeTab', { detail: 'الحساب' }));
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent('changeSettingsTab', { detail: 'باقات فرز' }));
                        }, 50);
                      }, 50);
                    }}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shrink-0 transition-all shadow-md shadow-amber-550/15"
                  >
                    ترقية الباقة
                  </button>
                </div>
              )}
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                هل ترغب في إضافة سؤالين محددين ليقوم الذكاء الاصطناعي بطرحهما على المتقدم أثناء المقابلة؟
              </p>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">السؤال الأول (مخصص):</label>
                  <input
                    type="text"
                    value={interviewQuestion1}
                    onChange={(e) => setInterviewQuestion1(e.target.value)}
                    placeholder="مثال: كيف تعاملت مع عميل غاضب في السابق؟"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">السؤال الثاني (مخصص):</label>
                  <input
                    type="text"
                    value={interviewQuestion2}
                    onChange={(e) => setInterviewQuestion2(e.target.value)}
                    placeholder="مثال: اشرح لي تجربة قمت فيها بإدارة فريق عمل."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowInterviewQuestionsModal(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-2xl font-bold transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={async () => {
                    setIsSavingQuestions(true);
                    try {
                      const q = [];
                      if (interviewQuestion1.trim()) q.push(interviewQuestion1.trim());
                      if (interviewQuestion2.trim()) q.push(interviewQuestion2.trim());

                      if (q.length > 0) {
                        await supabase
                          .from('applicants')
                          .update({
                            client_interview_questions: q,
                            interview_sent: true,
                            interview_sent_at: new Date().toISOString(),
                            interview_revoked: false
                          })
                          .eq('id', applicant?.id);
                      } else {
                        await supabase
                          .from('applicants')
                          .update({
                            interview_sent: true,
                            interview_sent_at: new Date().toISOString(),
                            interview_revoked: false
                          })
                          .eq('id', applicant?.id);
                      }

                      // Update locally
                      if (applicant) {
                        applicant.interview_sent = true;
                        applicant.interview_sent_at = new Date().toISOString();
                        applicant.interview_revoked = false;
                      }
                      if (onStatusUpdate) {
                        // Notify parent of the update implicitly (no decision change)
                      }

                      const link = `${window.location.origin}/interview/${applicant?.id}?lang=${interviewLang}`;
                      if (interviewSendMethod === 'whatsapp') {
                        const text = `مرحباً ${actualName}، ندعوك لإجراء مقابلة الذكاء الاصطناعي الفورية عبر الرابط التالي:\n${link}`;
                        window.open(`https://wa.me/${candidate.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
                      } else {
                        const subject = `دعوة لمقابلة الذكاء الاصطناعي - ${companyName}`;
                        const body = `مرحباً ${actualName}،\n\nندعوك لإجراء مقابلة الذكاء الاصطناعي الفورية عبر الرابط التالي:\n${link}\n\nمع التوفيق.`;
                        window.location.href = `mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      }

                      setShowInterviewQuestionsModal(false);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsSavingQuestions(false);
                    }
                  }}
                  disabled={isSavingQuestions}
                  className={`flex-1 py-3.5 rounded-2xl font-bold transition-all text-white flex items-center justify-center gap-2 ${interviewSendMethod === 'whatsapp' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} ${isSavingQuestions ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isSavingQuestions ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {interviewSendMethod === 'whatsapp' ? <MessageCircle size={18} /> : <Mail size={18} />}
                      إرسال المقابلة
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ApplicantDetails;
