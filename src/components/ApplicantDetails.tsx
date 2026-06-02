import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Sparkles, CheckCircle, Zap, Play, MessageCircle, FileText, Linkedin, Mail, Phone, Send, X, Trash2, Edit2, Calendar, DollarSign, Ban, AlertTriangle, FileDigit, ImageIcon, Video, Paperclip, ExternalLink, Mic, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const ApplicantDetails = ({ onBack, applicant, job, onStatusUpdate, userProfile }: { onBack: () => void, applicant?: any, job?: any, onStatusUpdate?: (id: string, decision: string, isOffer?: boolean) => void, userProfile?: any }) => {
  const [activeTab, setActiveTab] = useState<"analysis" | "requirements" | "interview" | "notes">("analysis");
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
        try {
          const parsedNotes = JSON.parse(applicant.hr_notes);
          setNotesList(Array.isArray(parsedNotes) ? parsedNotes : []);
        } catch (e) {
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
  const interviewQuestions = safeParseArray(applicant?.interview_questions);
  const attachments = safeParseArray(applicant?.attachments);

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
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
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (applicant) setShowOfferModal(true); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Send size={16} /> قبول وإرسال عرض
            </button>
            <button
              onClick={handleSilentAccept}
              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900/50 dark:hover:bg-emerald-600 dark:hover:text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 hover:border-transparent"
            >
              <CheckCircle size={16} /> قبول
            </button>
            {(applicant?.decision === "interview" || applicant?.decision === "interviewing") && (
              <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">لغة الذكاء الاصطناعي:</span>
                  <select
                    value={interviewLang}
                    onChange={(e) => setInterviewLang(e.target.value as 'ar' | 'en')}
                    className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md px-2 py-1 outline-none focus:border-primary"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setInterviewSendMethod('whatsapp'); setShowInterviewQuestionsModal(true); }}
                    className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50 dark:hover:bg-green-600 dark:hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
                  >
                    <MessageCircle size={16} /> إرسال المقابلة (واتساب)
                  </button>
                  <button
                    onClick={() => { setInterviewSendMethod('email'); setShowInterviewQuestionsModal(true); }}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50 dark:hover:bg-blue-600 dark:hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
                  >
                    <Mail size={16} /> إرسال المقابلة (إيميل)
                  </button>
                  <button
                    onClick={async () => {
                      if (!window.confirm("تنبيه: هذا المتقدم قد أجرى المقابلة مسبقاً. هل تريد تأكيد فك القفل وإعادة فتح المقابلة له؟")) return;
                      try {
                        await supabase
                          .from('applicants')
                          .update({ has_started_interview: false, is_interview_completed: false })
                          .eq('id', applicant.id);
                        if (applicant) {
                          applicant.has_started_interview = false;
                          applicant.is_interview_completed = false;
                        }
                        setToastMessage("تم فتح الرابط للمتقدم بنجاح!");
                        setTimeout(() => setToastMessage(null), 3000);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border border-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900/50 dark:hover:bg-orange-600 dark:hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={16} /> إعادة فتح المقابلة
                  </button>
                </div>
              </div>
            )}
            {applicant?.decision !== "interview" && applicant?.decision !== "interviewing" && (
              <button
                onClick={() => {
                  if (!applicant || !onStatusUpdate) return;
                  setIsScheduling(true);
                  setTimeout(() => {
                    onStatusUpdate(applicant.id, "interview");
                    setIsScheduling(false);
                  }, 800);
                }}
                disabled={isScheduling}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 border ${isScheduling ? "bg-yellow-50 text-yellow-400 border-yellow-100 cursor-wait dark:bg-yellow-900/20 dark:text-yellow-600 dark:border-yellow-900/20" : "bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-600 dark:hover:text-white border-yellow-100 dark:border-yellow-900/50 hover:border-transparent"}`}
              >
                {isScheduling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    جاري النقل...
                  </>
                ) : (
                  <>
                    <Calendar size={16} /> مقابلة
                  </>
                )}
              </button>
            )}
            <button
              onClick={handleReject}
              className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-600 dark:hover:text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 hover:border-transparent"
            >
              <X size={16} /> رفض
            </button>
          </div>
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {" "}
          {/* Right Column - AI Analysis & Audio (6 columns) */}{" "}
          <div className="lg:col-span-5 space-y-8 order-1 lg:order-2 lg:min-h-[900px]">
            {" "}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white dark:border-slate-700 relative overflow-hidden">
              {" "}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-4xl font-bold text-navy dark:text-white mb-2">
                    {actualName}
                  </h2>{" "}
                  <div className="flex items-center flex-wrap gap-3">
                    <p className="text-primary font-bold text-lg">
                      {actualJob}
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-[32px] p-8 mb-8 flex flex-col items-center relative overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <div className="relative w-32 h-32 mb-6">
                  <svg className="w-full h-full drop-shadow-sm" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    <circle
                      className="text-slate-200 dark:text-slate-700/50 stroke-current"
                      strokeWidth="6"
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                    />
                    <motion.circle
                      className={`${matchColorClass} stroke-current`}
                      strokeWidth="6"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke="url(#matchGradient)"
                      strokeDasharray="263.89"
                      initial={{ strokeDashoffset: 263.89 }}
                      animate={{ strokeDashoffset: 263.89 * (1 - strokeOffsetMatch) }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-black ${matchColorClass}`}>
                      {displayMatch}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                      مطابقة
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 mb-8 w-full z-10">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border ${displayMatch >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30' : displayMatch >= 50 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/30'} shadow-sm`}>
                    {displayMatch >= 80 ? <CheckCircle size={16} /> : displayMatch >= 50 ? <AlertTriangle size={16} /> : <X size={16} />}
                    {displayMatch >= 80 ? "ملاءمة عالية جداً" : displayMatch >= 50 ? "ملاءمة جزئية" : "غير مطابق"}
                  </div>

                  {topPercentile && (
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                      أفضل من <span className="text-primary">{topPercentile}%</span> من المتقدمين
                    </span>
                  )}
                </div>

                <div className="w-full space-y-4 z-10">
                  <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-transform hover:-translate-y-0.5">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-600 dark:text-slate-300">تطابق المهارات</span>
                      <span className="text-navy dark:text-white">{skillsMatch}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${skillsMatch}%` }} transition={{ duration: 1, delay: 0.3 }} className={`h-full rounded-full ${getBarColor(skillsMatch)}`} />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-transform hover:-translate-y-0.5">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-600 dark:text-slate-300">تطابق الخبرة</span>
                      <span className="text-navy dark:text-white">{expMatch}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${expMatch}%` }} transition={{ duration: 1, delay: 0.4 }} className={`h-full rounded-full ${getBarColor(expMatch)}`} />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-transform hover:-translate-y-0.5">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-600 dark:text-slate-300">تطابق التعليم</span>
                      <span className="text-navy dark:text-white">{eduMatch}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${eduMatch}%` }} transition={{ duration: 1, delay: 0.5 }} className={`h-full rounded-full ${getBarColor(eduMatch)}`} />
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-[20px] mb-8 border border-slate-100 dark:border-slate-700/50 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <button
                  onClick={() => setActiveTab("analysis")}
                  className={`min-w-[120px] flex-1 py-3 px-4 text-xs lg:text-sm font-bold rounded-2xl transition-all whitespace-nowrap ${activeTab === "analysis" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"}`}
                >
                  المطابقة والتحليل
                </button>
                <button
                  onClick={() => setActiveTab("requirements")}
                  className={`min-w-[120px] flex-1 py-3 px-4 text-xs lg:text-sm font-bold rounded-2xl transition-all whitespace-nowrap ${activeTab === "requirements" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"}`}
                >
                  متطلبات التقديم
                </button>
                <button
                  onClick={() => setActiveTab("interview")}
                  className={`min-w-[120px] flex-1 py-3 px-4 text-xs lg:text-sm font-bold rounded-2xl transition-all whitespace-nowrap ${activeTab === "interview" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"}`}
                >
                  خطة المقابلة
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`min-w-[120px] flex-1 py-3 px-4 text-xs lg:text-sm font-bold rounded-2xl transition-all whitespace-nowrap ${activeTab === "notes" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"}`}
                >
                  ملاحظات الفريق
                </button>
              </div>

              {activeTab === "analysis" && isAILoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-6"></div>
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-2">جاري تحليل البيانات بواسطة نظام فرز... ⏳</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">يقوم النظام بقراءة وتقييم البيانات حالياً.</p>
                </motion.div>
              )}
              {activeTab === "analysis" && !isAILoading && (
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
                    <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 p-6 rounded-[32px] mb-6">
                      <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
                        <Mic size={20} /> تقرير المقابلة الصوتية (AI)
                      </h3>
                      <div className="flex flex-col gap-4 mb-4">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 w-fit">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">التقييم النهائي:</span>
                          <span className="text-lg font-black text-purple-600 dark:text-purple-400">{applicant?.interview_score || "-"} / 10</span>
                        </div>

                        {applicant?.voiceEvalUrl && (
                          <div className="w-full bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">التسجيل الصوتي للمقابلة:</span>
                            <audio controls src={applicant.voiceEvalUrl} className="w-full h-10 outline-none" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-purple-100 dark:border-purple-800/20">
                          <h4 className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-2">ملخص المقابلة</h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                            {applicant?.interview_summary || "لا يوجد ملخص."}
                          </p>
                        </div>

                        {applicant?.interview_transcript && (
                          <div className="bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-purple-100 dark:border-purple-800/20 max-h-60 overflow-y-auto custom-scrollbar">
                            <h4 className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-2">التفريغ النصي للمحادثة (Transcript)</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-wrap">
                              {applicant.interview_transcript}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center gap-2">
                      <Sparkles size={20} className="text-primary" /> ملخص المطابقة
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {actualSummary || applicant?.aiSummary || "لا يوجد ملخص متاح حالياً"}
                    </p>
                  </div>

                  {redFlags && redFlags.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 p-6 rounded-[32px]">
                      <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                        <AlertTriangle size={18} /> رادار التحذيرات (Red Flags 🚩)
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
                                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 font-medium">"{evidenceText}"</p>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#F0FDF4] dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 p-6 rounded-[32px]">
                      <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                        <CheckCircle size={18} /> أبرز نقاط القوة والأدلة 🔎
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
                                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 font-medium">"{evidenceText}"</p>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="bg-[#FFF7ED] dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 p-6 rounded-[32px]">
                      <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                        <Zap size={18} /> فجوات ونقاط الانتباه
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
                                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 font-medium">"{evidenceText}"</p>
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
                        {jobKnockoutQuestions.length > 0 && (
                          <div className="bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 p-6 rounded-[32px] mt-6">
                            <h4 className="font-bold text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
                              <Ban size={18} /> إجابات أسئلة الاستبعاد المباشر (Knockout)
                            </h4>
                            <div className="space-y-4">
                              {jobKnockoutQuestions.map((kq: any, i: number) => {
                                const kqText = typeof kq === 'string' ? kq : (kq?.text || "");
                                const ansObj = knockoutAnswers.find((a: any) => a.question === kqText);
                                const isAnswered = kqText.includes("تجريبي") ? false : !!ansObj;
                                return (
                                  <div key={i} className={"p-4 rounded-2xl shadow-sm border " + (isAnswered ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700" : "bg-slate-50 dark:bg-slate-800/50 border-dashed border-slate-200 dark:border-slate-600 opacity-80")}>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">السؤال {i + 1}: {kqText}</p>
                                    {isAnswered ? (
                                      <p className="text-sm font-bold text-navy dark:text-white leading-relaxed whitespace-pre-wrap">{ansObj.answer}</p>
                                    ) : (
                                      <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 mt-1">
                                        <span className="text-[11px] font-bold">لم يُطرح عليه هذا السؤال (قدم قبل التحديث)</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* أسئلة نموذج التقديم */}
                        {regularAnswers.length > 0 && (
                          <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 p-6 rounded-[32px] mt-6">
                            <h4 className="font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2">
                              <MessageCircle size={18} /> إجابات أسئلة نموذج التقديم
                            </h4>
                            <div className="space-y-4">
                              {regularAnswers.map((ans: any, i: number) => (
                                <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">السؤال {i + 1}: {ans.question}</p>
                                  <p className="text-sm font-bold text-navy dark:text-white leading-relaxed whitespace-pre-wrap">{ans.answer}</p>
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
                    <div className="bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-700/50 p-6 rounded-[32px] mt-6">
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
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 w-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
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
                          className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isNoteSaved
                            ? "bg-green-500 text-white"
                            : "bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-5 rounded-[24px] mb-6">
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-3">
                      <MessageCircle size={20} />
                      أسئلة هجومية / تكتيكية مصممة للتركيز على الفجوات ونقاط التقييم الحرجة:
                    </p>
                  </div>
                  {(() => {
                    const questions = interviewQuestions;
                    if (!questions || questions.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700/50 border-dashed">
                          <MessageCircle size={40} className="text-slate-300 dark:text-slate-600 mb-4" />
                          <h3 className="text-lg font-bold text-navy dark:text-white mb-2">لا توجد أسئلة مقترحة حالياً</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
                            لم يتم إضافة أسئلة مقترحة لهذا المتقدم حتى الآن.
                          </p>
                        </div>
                      );
                    }

                    return questions.map((item: any, idx: number) => {
                      const qText = typeof item === 'string' ? item : (item.q || item.question || "");
                      const rText = typeof item === 'string' ? "" : (item.purpose || item.reason || item.objective || "");

                      if (!qText) return null;

                      return (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="font-bold text-navy dark:text-white mb-4 text-sm leading-relaxed flex items-start gap-3">
                            <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="pt-1">{qText}</span>
                          </h4>
                          {rText && (
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 inline-block px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 mt-2">
                              <span className="text-primary mr-1 text-sm bg-primary/10 px-2 py-0.5 rounded-lg ml-2">الهدف من السؤال</span>
                              {rText}
                            </p>
                          )}
                        </div>
                      );
                    });
                  })()}
                </motion.div>
              )}
            </div>{" "}
          </div>{" "}
          {/* Left Column - CV Viewer (7 columns) */}{" "}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col gap-6">
            {" "}
            <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white dark:border-slate-700 h-[1050px] flex flex-col overflow-hidden">
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
                    السيرة الذاتية - {applicant?.name || "متقدم"}.pdf
                  </span>{" "}
                </div>{" "}
                <button className="text-primary font-bold text-sm hover:underline">
                  تحميل الملف
                </button>{" "}
              </div>{" "}
              <div className="flex-1 bg-slate-100 mx-8 mt-8 mb-4 rounded-[32px] border-2 border-slate-200 dark:border-slate-700 overflow-hidden relative flex flex-col justify-end">
                {applicant?.cv_file_url ? (
                  applicant.cv_file_url.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) ? (
                    <img src={applicant.cv_file_url} className="absolute inset-0 w-full h-full object-contain bg-slate-50/50 dark:bg-slate-800 rounded-[30px] p-4" alt="CV" />
                  ) : (
                    <iframe src={applicant.cv_file_url + "#toolbar=0"} className="absolute inset-0 w-full h-full border-none bg-white rounded-[30px]" />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold bg-white dark:bg-slate-800 rounded-[30px]">
                    لا توجد سيرة ذاتية مرفوعة (أو جاري معالجتها)
                  </div>
                )}
              </div>
              <div className="flex justify-center mb-6">
                {applicant?.cv_file_url ? (
                  <button onClick={() => setIsFullscreenCV(true)} className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-md cursor-pointer">
                    <FileText size={18} /> عرض المستند بالحجم الكامل
                  </button>
                ) : (
                  <button disabled className="bg-slate-300 dark:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md cursor-not-allowed opacity-50">
                    <FileText size={18} /> عرض المستند بالحجم الكامل
                  </button>
                )}
              </div>

              {/* Contact Icons - Bottom of CV Wrapper */}
              <div className="flex items-center justify-center gap-3 px-8 pb-8">
                {candidate.linkedin && typeof candidate.linkedin === 'string' && candidate.linkedin.trim() !== "" && candidate.linkedin !== "null" && candidate.linkedin !== "undefined" && (
                  <a href={candidate.linkedin.startsWith('http') ? candidate.linkedin : `https://${candidate.linkedin}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#0A66C2]/10 text-[#0A66C2] rounded-xl flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm" title="لينكد إن">
                    <Linkedin size={20} />
                  </a>
                )}
                {candidate.whatsapp && (
                  <a href={`https://wa.me/${candidate.whatsapp}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm" title="واتساب">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
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
                <iframe src={applicant.cv_file_url} className="w-full h-full rounded-2xl bg-white border-none" />
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-navy text-white px-6 py-3 rounded-xl shadow-2xl z-[100] flex items-center gap-3 font-bold"
          >
            <CheckCircle size={20} className="text-primary" />
            {toastMessage}
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
                          .update({ client_interview_questions: q, decision: 'interviewing' })
                          .eq('id', applicant?.id);
                      } else {
                        await supabase
                          .from('applicants')
                          .update({ decision: 'interviewing' })
                          .eq('id', applicant?.id);
                      }

                      // Update locally
                      if (applicant) applicant.decision = 'interviewing';
                      if (onStatusUpdate) onStatusUpdate(applicant.id, 'interviewing', false);

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
