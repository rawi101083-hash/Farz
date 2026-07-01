/** * @license * SPDX-License-Identifier: Apache-2.0 */
import { skillsDictionary, getUserSavedSkills, saveUserSkills, SAUDI_CITIES, SearchableSelect, VerificationModal, FlowStep, Job, PreviewModal, Applicant } from "./Shared";
import SuperAdmin from './components/SuperAdmin';
import JobApplication from './components/JobApplication';
import ApplicantDetails from './components/ApplicantDetails';
import Dashboard from './components/Dashboard';
import CreateJob from './components/CreateJob';
import { ManageJob } from './components/ManageJob';
import { SharedManagementView } from './components/SharedManagementView';
import { InterviewRoom } from './components/InterviewRoom';
import SeekerProfile from './components/SeekerProfile';
import { WelcomeSlidesModal } from './components/WelcomeSlidesModal';
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
import { supabase } from "./lib/supabaseClient";
import { motion, AnimatePresence } from "motion/react";
import { Users, Database, CheckCircle, AlertTriangle, Play, FileText, Clock, Sparkles, ShieldCheck, Zap, ArrowLeft, ArrowRight, ArrowUp, Briefcase, LogOut, Lock, Mail, CreditCard, Calendar, Phone, Copy, ExternalLink, MapPin, Share2, Save, Star, X, Plus, Info, GraduationCap, Target, Moon, Sun, Eye, EyeOff, Building2, User, Mic, BarChart2, BrainCircuit, Gift } from 'lucide-react';
import QRCode from 'react-qr-code';
import skillsDictionaryRaw from "./skillsDictionary.json";
import featureAiInterviewImg from './assets/feature_ai_interview.png';
import featureDashboardImg from './assets/feature_dashboard.png';
import featureJobsImg from './assets/feature_jobs.png';
import featureTalentPoolImg from './assets/feature_talent_pool.png';
import featureQuickApplyImg from './assets/feature_quick_apply.png';
;
const OnboardingModal = ({ isOpen, onClose, userProfile, setUserProfile, onPublishDraft }: { isOpen: boolean; onClose: () => void; userProfile: any; setUserProfile: any; onPublishDraft?: () => void; }) => {
  const [entityType, setEntityType] = useState<"company" | "freelance">(
    userProfile?.freelanceDocument ? "freelance" : (userProfile?.commercialRegistration ? "company" : (userProfile?.entityType || "company"))
  );
  const [companyName, setCompanyName] = useState(userProfile.companyName || "");
  const [crNumber, setCrNumber] = useState(userProfile?.commercialRegistration || "");
  const [freelanceDoc, setFreelanceDoc] = useState(userProfile?.freelanceDocument || "");
  const [contactPhone, setContactPhone] = useState(userProfile?.contactPhone || "");
  const [city, setCity] = useState(userProfile?.city || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEntityType(userProfile?.freelanceDocument ? "freelance" : (userProfile?.commercialRegistration ? "company" : (userProfile?.entityType || "company")));
      setCompanyName(userProfile?.companyName || userProfile?.name || "");
      setCrNumber(userProfile?.commercialRegistration || "");
      setFreelanceDoc(userProfile?.freelanceDocument || "");
      setContactPhone(userProfile?.contactPhone || "");
      setCity(userProfile?.city || "");
      setError("");
    }
  }, [isOpen, userProfile]);

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
        <h3 className="text-2xl font-bold text-center text-navy dark:text-white mb-3">خطوة أخيرة لنشر إعلانك!</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-6 text-sm leading-relaxed">
          يرجى استكمال بيانات الكيان الخاص بك لنتمكن من عرضها للمتقدمين ونشر تفاصيل الشواغر الخاصة بك.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={async (e) => {
          e.preventDefault();
          setError("");

          if (entityType === "company") {
            if (!companyName.trim()) return setError("اسم المنشأة مطلوب");
            if (!/^\d{10}$/.test(crNumber.trim())) return setError("رقم السجل التجاري يجب أن يتكون من 10 أرقام");
            if (!contactPhone.trim()) return setError("رقم جوال المنشأة مطلوب");
            if (!/^(05\d{8}|9665\d{8})$/.test(contactPhone.trim())) return setError("رقم الجوال يجب أن يبدأ بـ 05 (10 أرقام) أو 9665 (12 رقم)");
            if (!city.trim()) return setError("المدينة مطلوبة");
          } else {
            if (!companyName.trim()) return setError("الاسم الثلاثي مطلوب");
            if (!/^FL-\d{6,15}$/i.test(freelanceDoc.trim())) return setError("رقم الوثيقة يجب أن يبدأ بـ FL- يليه أرقام");
            if (!contactPhone.trim()) return setError("رقم الجوال مطلوب");
            if (!/^(05\d{8}|9665\d{8})$/.test(contactPhone.trim())) return setError("رقم الجوال يجب أن يبدأ بـ 05 (10 أرقام) أو 9665 (12 رقم)");
            if (!city.trim()) return setError("المدينة مطلوبة");
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
            const { supabase: sb } = await import('./lib/supabaseClient');
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

          window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "تم حفظ البيانات بنجاح", type: "success" } }));

          if (onPublishDraft) {
            onPublishDraft();
          }
          onClose();
        }} className="space-y-4">

          {(!userProfile?.hasExplicitEntityType && !userProfile?.commercialRegistration && !userProfile?.freelanceDocument) && (
            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 gap-1.5 rounded-2xl w-full mb-4">
              <button type="button" onClick={() => setEntityType("company")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${entityType === "company" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>جهة اعتبارية</button>
              <button type="button" onClick={() => setEntityType("freelance")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${entityType === "freelance" ? "bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm" : "text-slate-500"}`}>عمل حر (مستقل)</button>
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">{entityType === "company" ? "اسم المنشأة المعتمد" : "الاسم الثلاثي المعتمد"}</label>
            <input required type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder={entityType === "company" ? "مؤسسة التقنية البسيطة..." : "مثال: عبدالله محمد..."} className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 font-medium dark:text-white transition-all" />
          </div>

          {entityType === "company" ? (
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">رقم السجل التجاري (CR)</label>
              <input required type="text" value={crNumber} onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 10) setCrNumber(val);
              }} maxLength={10} minLength={10} placeholder="1010123456" className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 font-medium dark:text-white text-left transition-all" dir="ltr" />
            </div>
          ) : (
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">رقم وثيقة العمل الحر</label>
              <input required type="text" value={freelanceDoc} onChange={e => {
                let val = e.target.value.toUpperCase();
                if (val.length > 0 && !val.startsWith('FL-')) {
                  val = 'FL-' + val.replace(/^FL-?/i, '');
                }
                setFreelanceDoc(val);
              }} placeholder="FL-XXXXXX" className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 font-medium dark:text-white text-left transition-all" dir="ltr" />
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">
              {entityType === "company" ? "رقم جوال المنشأة" : "رقم الجوال"}
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
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 mr-1">المدينة</label>
            <input required type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="الرياض، جدة..." className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 font-medium dark:text-white transition-all" />
          </div>

          <button type="submit" className="w-full py-4 mt-6 bg-gradient-to-l from-primary to-primary/90 text-white rounded-2xl font-bold text-lg shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15),inset_0_2px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.3)] active:translate-y-0 transition-all flex items-center justify-center">
            حفظ
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
import { prefetchApplicantProfile } from './components/JobApplication';

// ⚠️ هام جداً (تحذير من نظام المعاينة الحية):
// أي تعديل على تصميم أو هيكل هذا المكون (PublicJobPage) يجب أن تقوم بنسخه ولصقه كنسخة طبق الأصل 
// داخل ملف (src/components/CreateJob.tsx) لكي تتطابق صفحة المتقدمين الحقيقية مع المعاينة.
const PublicJobPage = ({
  job,
  selectedRoleId,
  onSelectRole,
  onApply,
  onBackToCampaign,
  initialIsLoggedIn = false
}: {
  job: Job;
  selectedRoleId?: string | null;
  onSelectRole?: (roleId: string) => void;
  onApply: (mode: "fast" | "normal") => void;
  onBackToCampaign?: () => void;
  initialIsLoggedIn?: boolean;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      if (session) {
        prefetchApplicantProfile();
      }
    };

    checkSession();
    window.addEventListener('focus', checkSession);
    window.addEventListener('pageshow', checkSession);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      window.removeEventListener('focus', checkSession);
      window.removeEventListener('pageshow', checkSession);
      subscription.unsubscribe();
    };
  }, []);
  if (job.status === "مسودة") {
    return (
      <div className="min-h-screen bg-bg dark:bg-navy flex items-center justify-center p-6">
        <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-xl max-w-lg w-full border border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">الإعلان غير متاح</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">عذراً، هذا الإعلان غير متاح.</p>
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
          <div className="px-6 pt-5 pb-4 md:px-10 md:pt-6 md:pb-4 bg-navy text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex justify-between items-start w-full mb-3">
                {isCampaign && selectedRoleId && onBackToCampaign ? (
                  <button
                    onClick={onBackToCampaign}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm w-fit"
                  >
                    <ArrowRight size={16} /> العودة لقائمة الوظائف
                  </button>
                ) : <div></div>}
                {isLoggedIn ? (
                  <a
                    href={`/profile?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                    className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full transition-all shadow-sm mr-auto whitespace-nowrap"
                  >
                    <User size={16} className="text-teal-400" /> ملفي المهني
                  </a>
                ) : (
                  <a
                    href={`/profile?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                    className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full transition-all shadow-sm mr-auto whitespace-nowrap"
                  >
                    <User size={16} className="text-teal-400" /> تسجيل دخول
                  </a>
                )}
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 p-0 backdrop-blur rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm ${job.companyLogo ? "bg-white dark:bg-slate-800/10 border border-white dark:border-slate-700/10" : "bg-white/5 border border-white/10"}`}>
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={`شعار ${job.company}`}
                      className="w-full h-full object-cover rounded-[inherit] drop-shadow-sm"
                    />
                  ) : (
                    <Briefcase size={28} className="text-primary/80 drop-shadow-sm" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-slate-300 font-bold text-sm drop-shadow-sm">
                      {displayCompany}
                    </p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                      <ShieldCheck size={12} className={job.entityType === "freelance" ? "text-blue-400" : "text-emerald-400"} />
                      {job.entityType === "freelance" ? "مستقل معتمد" : "مؤسسة معتمدة"}
                    </span>
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
                  {((activeRole?.locations?.length ? activeRole.locations : job.locations?.length ? job.locations : (activeRole?.location || job.location) ? [activeRole?.location || job.location] : []) as string[]).filter(loc => loc !== "لا يشترط / كافة المدن").map((loc, idx) => (
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
                  {!(activeRole?.isSalaryHidden ?? job.isSalaryHidden) && Boolean(activeRole?.salaryMin || job.salaryMin) && String(activeRole?.salaryMin || job.salaryMin) !== "0" && (
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
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300">
                            <Clock size={14} /> {role.type}
                          </span>
                        )}
                        {!role.isSalaryHidden && Boolean(role.salaryMin) && String(role.salaryMin) !== "0" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CreditCard size={14} /> {role.salaryMin} {role.salaryMax ? `- ${role.salaryMax}` : ''} ريال
                          </span>
                        ) : null}
                      </div>
                      <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
                        <span className="font-bold text-primary">التقديم على هذه الوظيفة</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-8 text-center px-4">
                  <p className="text-slate-400 dark:text-slate-500 text-[11px] leading-relaxed">
                    ملاحظة: بتقديمك على هذه الوظيفة، أنت توافق على مشاركة بياناتك ومرفقاتك مع الشركة الموظفة.
                  </p>
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

                  {(activeRole?.roleSummary || job.roleSummary || activeRole?.description || job.description) && (
                    <div>
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> نبذة عن الدور
                      </h3>
                      <div className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap text-base">
                        {activeRole?.roleSummary || job.roleSummary || activeRole?.description || job.description}
                      </div>
                    </div>
                  )}

                  {((activeRole?.targetMajors?.length ?? 0) > 0 || (job.targetMajors?.length ?? 0) > 0) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> التخصصات المطلوبة
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {(activeRole?.targetMajors || job.targetMajors || []).map((major, i) => (
                          <span key={i} className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-xl text-sm font-bold border border-teal-100 dark:border-teal-800 shadow-sm">
                            {major}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(activeRole?.responsibilities || job.responsibilities) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المهام والمسؤوليات
                      </h3>
                      <ul className="space-y-3 list-none px-2">
                        {(activeRole?.responsibilities || job.responsibilities || '').split('\n').filter((r: string) => r.trim()).map((res: string, i: number) => {
                          const cleanLine = res.trim();
                          const hasBullet = /^[-•*]/.test(cleanLine) || /^\d+\./.test(cleanLine);
                          return (
                            <li key={i} className="flex gap-3 items-start text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">
                              {!hasBullet && <span className="mt-2 text-[0.4rem] text-slate-400 shrink-0">{"\u25CF"}</span>}
                              <span>{cleanLine}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {(activeRole?.qualifications || job.qualifications) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المؤهلات والمتطلبات
                      </h3>
                      <ul className="space-y-3 list-none px-2">
                        {(activeRole?.qualifications || job.qualifications || '').split('\n').filter((q: string) => q.trim()).map((qual: string, i: number) => {
                          const cleanLine = qual.trim();
                          const hasBullet = /^[-•*]/.test(cleanLine) || /^\d+\./.test(cleanLine);
                          return (
                            <li key={i} className="flex gap-3 items-start text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">
                              {!hasBullet && <span className="mt-2 text-[0.4rem] text-slate-400 shrink-0">{"\u25CF"}</span>}
                              <span>{cleanLine}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {((activeRole?.skills?.length ?? 0) > 0 || (job.skills?.length ?? 0) > 0) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المهارات
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {(activeRole?.skills || job.skills || []).map((skill: string) => (
                          <span key={skill} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-600 shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {((activeRole?.languages?.length ?? 0) > 0 || (job.languages?.length ?? 0) > 0) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> اللغات
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {(activeRole?.languages || job.languages || []).map((lang: string) => (
                          <span key={lang} className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-xl text-sm font-bold border border-teal-100 dark:border-teal-800 shadow-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(activeRole?.benefits || job.benefits) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المميزات
                      </h3>
                      <ul className="space-y-3 list-none px-2">
                        {(activeRole?.benefits || job.benefits || '').split('\n').filter((b: string) => b.trim()).map((ben: string, i: number) => {
                          const cleanLine = ben.replace(/\(اختياري\)/g, '').trim();
                          const hasBullet = /^[-•*]/.test(cleanLine) || /^\d+\./.test(cleanLine);
                          return (
                            <li key={i} className="flex gap-3 items-start text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">
                              {!hasBullet && <span className="mt-2 text-[0.4rem] text-slate-400 shrink-0">{"\u25CF"}</span>}
                              <span>{cleanLine}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  <div className="pt-12 pb-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                    <button onClick={() => onApply('fast')} className="w-full flex bg-primary text-white py-4 rounded-2xl text-lg font-bold hover:bg-teal-600 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] items-center justify-center gap-2">
                      <Zap size={20} className="fill-white" /> التقديم السريع
                    </button>
                    <button onClick={() => onApply('normal')} className="w-full flex bg-white dark:bg-slate-800 text-navy dark:text-white border-2 border-slate-200 dark:border-slate-700 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98] items-center justify-center gap-2">
                      <FileText size={20} /> التقديم العادي
                    </button>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] leading-relaxed">
                      ملاحظة: بتقديمك على هذه الوظيفة، أنت توافق على مشاركة بياناتك ومرفقاتك مع الشركة الموظفة.
                    </p>
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
  onOpenBookingModal,
}: {
  setStep: (s: FlowStep) => void;
  currentStep: FlowStep;
  onOpenBookingModal?: () => void;
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
            <div className="flex items-center gap-2 text-[15px] font-medium text-slate-800 dark:text-slate-200">
              {" "}
              {[
                { id: "features", label: "المميزات" },
                { id: "contact", label: "تواصل معنا" },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`px-4 py-2 rounded-xl transition-all border-b-2 border-transparent hover:-translate-y-0.5 hover:shadow-md ${activeSection === link.id ? "text-primary bg-primary/5 font-bold border-primary/20" : "hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary hover:border-slate-200 dark:hover:border-slate-700"}`}
                >
                  {" "}
                  {link.label}{" "}
                </a>
              ))}{" "}
              <button
                onClick={() => window.location.href = '/profile?returnUrl=/?step=landing'}
                className="text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 transition-all px-4 py-2 rounded-xl flex items-center shadow-sm border border-slate-200 dark:border-slate-700 border-b-2 hover:-translate-y-0.5 hover:shadow-md active:scale-95 ml-2"
              >
                الملف المهني
              </button>
              <button
                onClick={onOpenBookingModal}
                className="text-sm font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all px-4 py-2 rounded-xl hidden sm:flex items-center ml-2 border-b-2 border-primary/20 hover:border-teal-700 shadow-[0_4px_10px_rgba(13,148,136,0.1)] hover:shadow-[0_6px_15px_rgba(13,148,136,0.2)] hover:-translate-y-0.5 active:scale-95"
              >
                احجز اجتماع
              </button>
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
        <div className="flex items-center gap-4 relative">
          {" "}
          {currentStep === "landing" && (
            <button
              onClick={() => setStep("login")}
              className="text-[15px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:text-primary dark:hover:text-primary transition-all px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 border-b-2 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
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
              className="bg-gradient-to-b from-[#10857b] to-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_4px_12px_rgba(13,148,136,0.2)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.3)] hover:-translate-y-1 active:scale-95 border-b-[3px] border-teal-900"
            >
              {" "}
              إنشاء حساب{" "}
            </button>
          )}{" "}
          {currentStep === "landing" && (
            <div className="absolute -bottom-10 right-24 hidden lg:flex items-center justify-center gap-1.5 opacity-90 pointer-events-none w-max -rotate-12">
              <span className="text-sm font-bold text-primary">للشركات</span>
              <ArrowUp size={16} strokeWidth={2} className="text-primary/70" />
            </div>
          )}
        </div>{" "}
      </div>{" "}
    </nav>
  );
};
const LoginPage = ({
  onLogin,
  onBack,
  initialMode = "login"
}: {
  onLogin: () => void;
  onBack: () => void;
  initialMode?: "login" | "register";
}) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [entityType, setEntityType] = useState<"company" | "freelance">("company");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [authStep, setAuthStep] = useState<"initial" | "otp" | "new_password">("initial");
  const [otpType, setOtpType] = useState<"signup" | "recovery" | null>(null);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isResent, setIsResent] = useState(false);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (!email) return;
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: otpType || 'signup',
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;

      setIsResent(true);
      setResendTimer(60);
      setTimeout(() => setIsResent(false), 3000);
    } catch (err: any) {
      console.error("Resend error:", err);
      let errorMsg = "حدث خطأ أثناء إعادة إرسال الكود. يرجى المحاولة مرة أخرى.";
      if (err.message?.toLowerCase().includes("rate limit") || err.message?.toLowerCase().includes("too many requests")) {
        errorMsg = "تم تجاوز الحد المسموح للإرسال. يرجى المحاولة بعد قليل.";
      }
      setIsError(true);
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const { data: userExists } = await supabase.rpc('check_user_exists', { lookup_email: email });

      if (userExists === false) {
        setIsError(true);
        setMessage("عذراً، هذا الحساب غير مسجل لدينا.");
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setAuthStep("otp");
      setOtpType("recovery");
      setMessage("تم إرسال رمز التحقق المكون من 6 أرقام لبريدك الإلكتروني.");
      setIsError(false);
      if (resendTimer === 0) setResendTimer(60);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setIsError(true);
      if (err.message === "Failed to fetch") {
        setMessage("تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.");
      } else {
        setMessage(err.message || "حدث خطأ أثناء إرسال الرابط. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === "register" && !name) return;
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              entity_type: entityType
            }
          }
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            // Trick: User already exists. Verify their password instead of rejecting!
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (signInError) {
              throw new Error("البريد الإلكتروني مسجل مسبقاً، وكلمة المرور غير صحيحة. يرجى إدخال كلمة المرور الصحيحة للربط الدخول.");
            }
            // Password is correct! Let them in.
            await supabase.auth.updateUser({ data: { entity_type: entityType, name } });
            onLogin();
            return;
          }
          throw error;
        }

        setAuthStep("otp");
        setOtpType("signup");
        setMessage("تم إرسال رمز التحقق المكون من 6 أرقام لبريدك الإلكتروني.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        onLogin();
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setIsError(true);

      let errorMsg = "حدث خطأ أثناء المصادقة. يرجى المحاولة مرة أخرى.";
      if (err.message === "Invalid login credentials") {
        errorMsg = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      } else if (err.message.includes("User already registered")) {
        errorMsg = "عذراً، هذا الحساب مسجل مسبقاً! يرجى الذهاب لصفحة تسجيل الدخول.";
      } else if (err.message.toLowerCase().includes("rate limit")) {
        errorMsg = "تم تجاوز الحد المسموح لرسائل الإيميل من Supabase. يرجى إيقاف خيار (Confirm Email) من إعدادات لوحة تحكم Supabase.";
      } else if (err.message === "Failed to fetch") {
        errorMsg = "تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.";
      } else if (err.message) {
        errorMsg = err.message;
      }

      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: otpType as "signup" | "recovery",
      });
      if (error) throw error;

      if (otpType === "signup") {
        onLogin();
      } else if (otpType === "recovery") {
        setAuthStep("new_password");
        setMessage("تم التحقق بنجاح! أدخل كلمة المرور الجديدة.");
        setPassword(""); // Clear it so they can enter the new one
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setIsError(true);
      setMessage("الكود غير صحيح أو منتهي الصلاحية.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMessage("تم تغيير كلمة المرور بنجاح!");
      onLogin();
    } catch (err: any) {
      console.error("Update password error:", err);
      setIsError(true);
      setMessage(err.message || "حدث خطأ أثناء تغيير كلمة المرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
      {/* Right Side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-teal-900 text-white p-12 flex-col justify-center items-center text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="mb-8 flex justify-center">
            <div className="scale-[1.15]">
              <LogoIcon />
            </div>
          </div>
          <h1 className="text-[40px] font-bold mb-5 leading-tight tracking-tight text-white">
            مرحباً بك في بوابة فرز
          </h1>
          <p className="text-[17px] text-white/95 leading-relaxed font-medium text-center max-w-[380px]">
            أدر عمليات التوظيف بفعالية، وفرز آلاف المتقدمين بضغطة زر واحدة.
          </p>
        </motion.div>
      </div>

      {/* Left Side - Form */}
      <div className="md:w-1/2 bg-white dark:bg-slate-800 p-12 flex flex-col justify-center items-center relative overflow-y-auto">
        <button
          onClick={onBack}
          className="absolute top-8 right-8 flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 py-2 px-4 rounded-xl font-bold text-sm transition-all shadow-sm"
        >
          <ArrowRight size={18} /> العودة للرئيسية
        </button>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md my-auto pt-16 pb-8"
        >
          {(isForgotPassword || authStep !== "initial") && (
            <button
              onClick={() => { setIsForgotPassword(false); setAuthStep("initial"); setOtpType(null); setOtp(""); setMessage(""); setIsError(false); }}
              className="flex items-center text-sm font-bold text-slate-500 hover:text-primary mb-6 transition-colors"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة
            </button>
          )}
          <div className="mb-10 text-center md:text-right">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">
              {authStep === "otp" ? "التحقق من البريد الإلكتروني" : authStep === "new_password" ? "تعيين كلمة المرور الجديدة" : isForgotPassword ? "استعادة كلمة المرور" : mode === "register" ? "إنشاء حساب جديد" : "تسجيل الدخول"}
            </h2>
            {authStep === "initial" && isForgotPassword && (
              <p className="text-slate-500 font-medium mt-2">
                أدخل بريدك الإلكتروني وسنرسل لك رمزاً من 6 أرقام لإعادة تعيين كلمة المرور.
              </p>
            )}
            {authStep === "otp" && (
              <p className="text-slate-500 font-medium mt-2">
                أدخل كود التحقق المكون من 6 أرقام المرسل إلى <strong className="text-slate-800 dark:text-white" dir="ltr">{email}</strong>
              </p>
            )}
          </div>

          <form onSubmit={authStep === "otp" ? handleVerifyOtp : authStep === "new_password" ? handleUpdatePassword : isForgotPassword ? handleResetPassword : handleAuth} className="space-y-5">
            {authStep === "otp" ? (
              <div>
                <input
                  type="text"
                  className="focus:ring-teal-700 focus:border-teal-700 block w-full sm:text-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl py-4 border text-center tracking-[1em] text-slate-800 dark:text-white font-bold transition-all shadow-sm"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            ) : authStep === "new_password" ? (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-primary z-10" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-12 pl-12 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm dark:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#0f172a_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-primary dark:hover:text-primary/80 transition-colors z-10"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {!isForgotPassword && mode === "register" && (
                  <>
                    <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl mb-6 border border-slate-200/50 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setEntityType("company")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${entityType === "company" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"}`}
                      >
                        <Building2 size={18} /> شركة / جهة اعتبارية
                      </button>
                      <button
                        type="button"
                        onClick={() => setEntityType("freelance")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${entityType === "freelance" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"}`}
                      >
                        <User size={18} /> فرد / عمل حر
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        {entityType === "company" ? "اسم الشركة / الجهة" : "الاسم الكامل"}
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-primary"
                          size={20}
                        />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-4 pl-12 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm dark:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#0f172a_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                          placeholder={entityType === "company" ? "اسم الشركة أو الجهة" : "الاسم الكامل"}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-primary"
                      size={20}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-4 pl-12 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm dark:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#0f172a_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                      placeholder={entityType === "company" && mode === "register" ? "name@company.com" : "name@example.com"}
                      dir="ltr"
                    />
                  </div>
                </div>

                {!isForgotPassword && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                        كلمة المرور
                      </label>
                      {mode === "login" && (
                        <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">
                          نسيت كلمة المرور؟
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-primary z-10"
                        size={20}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-12 pl-12 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm dark:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#0f172a_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                        placeholder="••••••••"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-primary dark:hover:text-primary/80 transition-colors z-10"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {message && (
              <div className={`p-4 rounded-xl text-sm font-bold ${isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (authStep === "otp" && otp.length !== 6) || (authStep === "new_password" && !password) || (authStep === "initial" && (!email || (!isForgotPassword && !password) || (!isForgotPassword && mode === "register" && !name)))}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-[#10857b] hover:bg-teal-700 transition-all shadow-sm disabled:opacity-70 disabled:cursor-default"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : authStep === "otp" ? (
                "التحقق من الكود"
              ) : authStep === "new_password" ? (
                "تغيير كلمة المرور"
              ) : isForgotPassword ? (
                "إرسال رمز التحقق"
              ) : mode === "register" ? (
                "إنشاء حساب"
              ) : (
                "تسجيل الدخول"
              )}
            </button>

            {!isForgotPassword && authStep === "initial" && (
              <div className="mt-6 text-center">
                {mode === "login" ? (
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    ليس لديك حساب؟ <button type="button" onClick={() => setMode("register")} className="text-primary hover:text-primary/80 transition-colors">إنشاء حساب جديد</button>
                  </div>
                ) : (
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    لديك حساب بالفعل؟ <button type="button" onClick={() => setMode("login")} className="text-primary hover:text-primary/80 transition-colors">تسجيل الدخول</button>
                  </div>
                )}
              </div>
            )}

            {authStep === "otp" && (
              <div className="mt-6 text-center text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">لم يصلك الكود؟ </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || isResent || resendTimer > 0}
                  className={`font-bold transition-colors disabled:opacity-50 ${isResent ? 'text-emerald-600' : resendTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-primary hover:text-primary/80'}`}
                >
                  {isResent ? 'تم الإرسال ✓' : resendTimer > 0 ? `إعادة إرسال (${resendTimer})` : 'إعادة إرسال'}
                </button>
              </div>
            )}
          </form>

          <div className="mt-12 pt-8 text-center flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 justify-center">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">Powered By</span>
              <div className="flex items-center justify-center">
                <div className="scale-[0.6] -mx-1"><LogoIcon /></div>
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-400/70 dark:text-slate-500/70">
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
const LandingPage = ({ onStart, onOpenBookingModal }: { onStart: () => void; onOpenBookingModal?: () => void }) => {
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
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-2 bg-white dark:bg-slate-800/90 backdrop-blur-md border border-slate-100 dark:border-slate-700 px-6 py-2.5 rounded-full text-sm font-bold text-primary mb-10 shadow-[0_8px_20px_rgba(13,148,136,0.15)] shadow-primary/10 border-b-4 border-b-primary/10"
        >
          {" "}
          <Target size={16} /> ارتقِ بعمليات الموارد البشرية{" "}
        </motion.div>{" "}
        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-semibold mt-6 mb-8 lg:mb-10 leading-snug lg:leading-[1.4] text-navy dark:text-white tracking-tight text-center relative z-10">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-600 font-bold drop-shadow-sm hover:scale-105 inline-block transition-transform cursor-default">فرز</span>.. الجيل الجديد لـ{" "}
          <span className="relative inline-block mt-2">
            أتمتة الموارد البشرية
            <svg
              className="absolute -bottom-4 -left-[5%] w-[110%] h-6 text-primary/40"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                d="M0 5 Q 25 -2, 50 5 T 100 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-14 max-w-3xl mx-auto leading-relaxed font-medium text-center">
          نظام ATS متكامل يقود رحلة توظيفك بالكامل؛ يجذب الكفاءات بتقديم سريع، ويحلل السير الذاتية بعمق، ويجري المقابلات آلياً ليمنحك أفضل المرشحين
        </p>{" "}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          {" "}
          <motion.button
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            onClick={onStart}
            className="w-full sm:w-auto bg-gradient-to-b from-[#10857b] to-teal-700 text-white px-14 py-5 rounded-[24px] text-xl font-bold shadow-[0_8px_30px_rgba(13,148,136,0.3)] hover:shadow-[0_10px_40px_rgba(13,148,136,0.4)] transition-all hover:-translate-y-1.5 active:scale-95 flex items-center justify-center gap-3 group border-b-4 border-teal-900"
          >
            {" "}
            ابدأ مجاناً الآن{" "}
            <ArrowLeft
              size={22}
              className="group-hover:-translate-x-2 transition-transform"
            />{" "}
          </motion.button>{" "}
          <motion.button
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            onClick={() => setShowVideoModal(true)}
            className="w-full sm:w-auto bg-white dark:bg-slate-800/50 backdrop-blur-md text-navy dark:text-white border-2 border-slate-100 dark:border-slate-700 px-10 py-5 rounded-[24px] text-xl font-bold hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xl shadow-slate-200/20 active:scale-95 inline-flex items-center justify-center gap-3 group"
          >
            {" "}
            <div className="bg-primary/10 p-2 rounded-full group-hover:scale-110 transition-transform">
              <Play
                size={18}
                className="text-primary fill-primary"
              />{" "}
            </div>
            شاهد كيف نعمل{" "}
          </motion.button>{" "}
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
            كيف توظف مع <span className="text-primary">فرز</span>؟
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
            قدرات تقنية متقدمة لعملية التوظيف
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {" "}
          {[
            {
              title: "قاعدة بيانات حية (ATS)",
              desc: "الوصول إلى آلاف الكفاءات المحدثة باستمرار والجاهزة للانضمام لفريقك، مع إدارة متكاملة لخط سير المرشحين.",
              icon: (
                <Database className="text-primary fill-primary/20" size={32} />
              ),
              color: "bg-primary/10",
            },
            {
              title: "مقابلات بالذكاء الاصطناعي",
              desc: "إجراء مقابلات مبرمجة ومؤتمتة بالذكاء الاصطناعي لتقييم المهارات التقنية والشخصية بدقة وبدون تحيز.",
              icon: <Mic className="text-primary fill-primary/20" size={32} />,
              color: "bg-primary/10",
            },
            {
              title: "تجربة تقديم سلسة تمنع تسرب المرشحين",
              desc: "مسار تقديم ذكي ومختصر يرفع معدلات اكتمال الطلبات، ليضمن لك عدم خسارة أي موهبة متميزة.",
              icon: <FileText className="text-primary fill-primary/20" size={32} />,
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
        className="max-w-7xl mx-auto mb-40 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] p-16 md:p-24 relative overflow-hidden border border-slate-100 dark:border-slate-700"
      >
        {" "}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] dark:opacity-5" />{" "}
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6 leading-tight">الفرز اليدوي انتهى. لغة الأرقام تتحدث</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium mb-16 max-w-3xl mx-auto">نظام <span className="font-bold text-primary">فرز</span> ليس مجرد أداة، بل هو ترقية كاملة لقسم الموارد البشرية لديك</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-10 text-center shadow-sm card-3d">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">3 ثوانٍ فقط</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">لتحليل السيرة واستخراج البيانات</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-10 text-center shadow-sm card-3d">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">100% دقة مطابقة</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">خوارزميات ترشح الكفاءات بدون تحيز</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-10 text-center shadow-sm card-3d">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">القضاء على الهدر</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">وفر وقتك المهدر في الفرز اليدوي</p>
            </div>
          </div>
        </div>{" "}
      </section>{" "}
      {/* Contact Section */}{" "}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mt-32 mb-32 bg-primary/5 rounded-[40px] p-12 relative overflow-hidden shadow-sm border border-primary/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 text-center">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white mb-4">
              جاهز لأتمتة التوظيف في شركتك؟
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium text-lg mt-4">
              انضم للشركات الرائدة التي تبني فرق عمل استثنائية بوقت وجهد أقل وبدقة متناهية
            </p>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <button onClick={onOpenBookingModal} className="bg-primary text-white px-12 py-4 rounded-xl text-lg font-bold hover:bg-teal-600 hover:shadow-lg transition-all active:scale-95">
              احجز عرضا توضيحيا
            </button>
          </div>
        </div>
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
              className="relative w-full max-w-6xl max-h-[90vh] bg-slate-50 dark:bg-slate-900 rounded-[24px] md:rounded-[40px] shadow-2xl overflow-y-auto border border-slate-200 dark:border-slate-800"
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="sticky top-4 right-4 md:top-6 md:right-6 float-left ml-4 mt-4 w-12 h-12 bg-white dark:bg-slate-800 hover:bg-red-500 transition-colors rounded-full flex items-center justify-center text-slate-800 dark:text-white hover:text-white z-50 shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <X size={24} />
              </button>

              <div className="p-8 md:p-16 clear-both">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-navy dark:text-white mb-6">كيف تعمل منصة فرز؟</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                    نظام ATS متكامل يقود رحلة توظيفك بالكامل؛ يجذب الكفاءات، يحلل السير الذاتية، ويجري المقابلات آلياً ليوفر لك أفضل المرشحين.
                  </p>
                </div>

                <div className="space-y-24">
                  {/* Feature 1: AI Interview */}
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6 text-right w-full">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0">
                        <Mic size={32} />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center md:text-right">تقييم آلي ومقابلات صوتية ذكية</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed text-center md:text-right">
                        دع الذكاء الاصطناعي يتولى إجراء المقابلات المبدئية مع المرشحين نيابة عنك. تتبع حالة كل مرشح، استعرض التقييم الآلي، وتواصل معهم بضغطة زر.
                      </p>
                    </div>
                    <div className="flex-1 w-full relative">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 group">
                        <div className="h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center px-4 gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="relative">
                          <img src={featureAiInterviewImg} alt="المقابلات الذكية" className="w-full h-auto object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature 2: Dashboard */}
                  <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="flex-1 space-y-6 text-right w-full">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0">
                        <BarChart2 size={32} />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center md:text-right">لوحة قيادة متكاملة لقرارات أذكى</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed text-center md:text-right">
                        تابع مسار التوظيف بالكامل من مكان واحد. إحصائيات دقيقة ومباشرة لمصادر التوظيف ومؤشرات مطابقة المتقدمين لتتخذ قراراتك بناءً على بيانات حقيقية.
                      </p>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800">
                        <div className="h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center px-4 gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <img src={featureDashboardImg} alt="لوحة التحكم" className="w-full h-auto object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Feature 3: Job Management */}
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6 text-right w-full">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0">
                        <Briefcase size={32} />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center md:text-right">إدارة مرنة للوظائف ومسار التوظيف</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed text-center md:text-right">
                        أنشئ إعلاناتك الوظيفية، تحكم في حالاتها، وتابع أعداد المتقدمين لكل وظيفة بكل سهولة واحترافية من خلال واجهة موحدة.
                      </p>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800">
                        <div className="h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center px-4 gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <img src={featureJobsImg} alt="إدارة الوظائف" className="w-full h-auto object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Feature 4: Talent Pool */}
                  <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="flex-1 space-y-6 text-right w-full">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0">
                        <BrainCircuit size={32} />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center md:text-right">بنك الكفاءات لحفظ المواهب</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed text-center md:text-right">
                        احتفظ بالسير الذاتية للمتقدمين المفضلين لديك في بنك كفاءات خاص بك للعودة إليهم لاحقاً. ابنِ قاعدة مواهب قوية تضمن لك عدم ضياع أي كفاءة مميزة، واختصر وقت التوظيف المستقبلي.
                      </p>
                    </div>
                    <div className="flex-1 w-full relative">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 group">
                        <div className="h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center px-4 gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="relative">
                          <img src={featureTalentPoolImg} alt="بنك الكفاءات" className="w-full h-auto object-cover" />
                          {/* Blur Overlay for privacy */}
                          <div className="absolute inset-0 backdrop-blur-[2px] bg-white/5 dark:bg-black/5 pointer-events-none transition-all duration-500 group-hover:backdrop-blur-0"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature 5: Quick Apply */}
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6 text-right w-full">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0">
                        <Zap size={32} />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center md:text-right">تقديم سريع يقلص تسرب المتقدمين</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed text-center md:text-right">
                        تجربة تقديم سلسة وسريعة بخطوات معدودة. تضمن لك تقليل معدل خروج المتقدمين وزيادة نسبة استكمال طلبات التوظيف لأقصى حد.
                      </p>
                    </div>
                    <div className="flex-1 w-full relative">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800">
                        <div className="h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center px-4 gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="relative">
                          <img src={featureQuickApplyImg} alt="تقديم سريع" className="w-full h-auto object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>{" "}
          </motion.div>
        )}{" "}
      </AnimatePresence>{" "}
      <motion.a
        href="https://wa.me/message/IAOWRM4I5MJAL1"
        target="_blank"
        rel="noopener noreferrer"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-6 right-6 z-[9999] bg-primary text-white p-3.5 rounded-full no-underline shadow-[0_8px_20px_rgba(13,148,136,0.3)] hover:opacity-90 transition-all flex items-center justify-center group"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="relative z-10 group-hover:scale-110 transition-transform">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.a>
    </div>
  );
};

const MOCK_EXPIRATION_TIME = new Date("2026-04-22T21:00:00+03:00").getTime();
const initialMockApplicants: Applicant[] = Date.now() < MOCK_EXPIRATION_TIME ? [
  { id: "m1", name: "خالد السالم", job: "مهندس برمجيات أول", rating: 95, photoUrl: "https://i.pravatar.cc/150?u=m1", status: "فوري", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", phone: "966500000001", email: "khaled@example.com", skills: ["React", "Node.js", "System Design"], aiSummary: "مرشح استثنائي يمتلك خبرة عميقة في تصميم النظم الكبيرة.", voiceEval: "نبرة واثقة وتواصل احترافي ممتاز", customAnswers: [] },
  { id: "m2", name: "سارة عبدالله", job: "مصمم واجهات وتجربة مستخدم (UI/UX)", rating: 88, photoUrl: "https://i.pravatar.cc/150?u=m2", status: "أسبوعين", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", phone: "966500000002", email: "sara@example.com", skills: ["Figma", "Prototyping", "User Research"], aiSummary: "فهم عالي لاحتياجات المستخدمين مع معرض أعمال مبهر.", voiceEval: "تواصل فعّال وقدرة جيدة على شرح العمليات المنطقية", customAnswers: [] },
  { id: "m3", name: "مشاري القحطاني", job: "مدير مشاريع تقنية", rating: 82, photoUrl: "https://i.pravatar.cc/150?u=m3", status: "شهر", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", phone: "966500000003", email: "meshari@example.com", skills: ["Agile", "Scrum", "Jira"], aiSummary: "يمتلك مهارات قيادية ممتازة، ولكن يحتاج لتدريب إضافي على الأدوات الحديثة.", voiceEval: "نبرة قيادية وحازمة", customAnswers: [] },
  { id: "m4", name: "نورة الدوسري", job: "عالمة بيانات", rating: 91, photoUrl: "https://i.pravatar.cc/150?u=m4", status: "فوري", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", phone: "966500000004", email: "noura@example.com", skills: ["Python", "Machine Learning", "SQL"], aiSummary: "قدرة تحليلية قوية وخبرة مميزة في معالجة البيانات وبناء النماذج.", voiceEval: "هادئة ومنطقية جداً", customAnswers: [] },
  { id: "m5", name: "ياسر الحربي", job: "مطور تطبيقات هواتف", rating: 75, photoUrl: "https://i.pravatar.cc/150?u=m5", status: "شهرين", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400", phone: "966500000005", email: "yasser@example.com", skills: ["Flutter", "Dart", "Firebase"], aiSummary: "مهارات جيدة في بناء التطبيقات، لكن المهارات الأمنية تحتاج لتحسين.", voiceEval: "شغوف ومندفع", customAnswers: [] }
] : [];

const UpdatePasswordPage = ({ onComplete }: { onComplete: () => void }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      setIsError(true);
      setMessage("كلمتا المرور غير متطابقتين.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage("تم تحديث كلمة المرور بنجاح! سيتم تحويلك الآن...");
      setIsError(false);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || "حدث خطأ أثناء تحديث كلمة المرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] z-0"></div>
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">تحديث كلمة المرور</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">الرجاء إدخال كلمة المرور الجديدة لحسابك</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">كلمة المرور الجديدة</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-12 pl-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm text-left"
                dir="ltr"
                required
                minLength={6}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تأكيد كلمة المرور</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-12 pl-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm text-left"
                dir="ltr"
                required
                minLength={6}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold ${isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 disabled:opacity-70 disabled:cursor-default"
          >
            {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "تحديث كلمة المرور"}
          </button>
        </form>
      </div>
    </div>
  );
};

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-red-400 z-[10000] font-light text-4xl w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md">
        &times;
      </button>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] relative shadow-2xl flex flex-col overflow-hidden"
      >

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-[5000]">
            <div className="animate-spin mb-6">
              <LogoIcon />
            </div>
            <h3 className="text-xl font-bold text-navy animate-pulse">جاري عرض مواعيد فرز...</h3>
          </div>
        )}

        <iframe
          src="https://calendar.google.com/appointments/schedules/AcZssZ23hdcsfWvLfxKZLZw_UewmtjWQvj6JYrsjOkVGed9XcDPRs0Gim8_m9pHrqmvH1_IN8Z05byHM?gv=true"
          style={{ border: 0, width: '100%', height: '100%', borderRadius: '16px', opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}
          frameBorder="0"
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [talentPool, setTalentPool] = useState<Applicant[]>([]);
  const [applicantSelectedRoleId, setApplicantSelectedRoleId] = useState<string | null>(null);
  const [selectedApplicantForDetails, setSelectedApplicantForDetails] = useState<Applicant | null>(() => {
    const saved = sessionStorage.getItem("sahab_selected_applicant");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (selectedApplicantForDetails) {
      sessionStorage.setItem("sahab_selected_applicant", JSON.stringify(selectedApplicantForDetails));
    } else {
      sessionStorage.removeItem("sahab_selected_applicant");
    }
  }, [selectedApplicantForDetails]);
  const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    title: "",
    avatar: "",
    companyLogo: "",
    commercialRegistration: "",
    freelanceDocument: "",
    taxNumber: "",
    subscription_tier: "free",
    subscription_end_date: "",
    subscription_is_yearly: false,
    entityType: "company",
    city: "",
    used_cvs: 0,
    cv_limit: 0,
    extra_cv_credits: 0,
    fields_locked: false,
    isLoaded: false,
    hasExplicitEntityType: false,
  });

  const verifyCompanySession = async (currentSession: any, isInitial: boolean = false) => {
    if (!currentSession) return;

    setSession(currentSession);
    setUser(currentSession.user || null);

    if (isInitial) {
      if (!window.location.pathname.startsWith('/apply/') && !window.location.pathname.startsWith('/profile') && !window.location.pathname.startsWith('/share/') && !window.location.pathname.startsWith('/interview/')) {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('step') === 'landing') {
          setStep('landing');
        } else {
          const savedStep = sessionStorage.getItem('sahab_active_step');
          if (savedStep && savedStep !== "landing" && savedStep !== "login" && savedStep !== "registerCompany") {
            setStep(savedStep as FlowStep);
          } else {
            setStep("dashboard");
          }
        }
      }
      setIsCheckingAuth(false);
    } else {
      if (!window.location.pathname.startsWith('/apply/') && !window.location.pathname.startsWith('/profile') && !window.location.pathname.startsWith('/share/') && !window.location.pathname.startsWith('/interview/')) {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('step') === 'landing') {
          setStep('landing');
        } else {
          const savedStep = sessionStorage.getItem('sahab_active_step');
          setStep(prevStep => {
            if (prevStep === "updatePassword") return "updatePassword";
            if (["landing", "login", "registerCompany"].includes(prevStep)) {
              return (savedStep as FlowStep) || "dashboard";
            }
            return prevStep;
          });
        }
      }
    }
  };

  const [step, setStep] = useState<FlowStep>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('step') === 'landing') return 'landing';
    if (window.location.pathname.startsWith("/profile")) return "seeker-profile";
    if (window.location.pathname.startsWith("/interview/")) return "interview";
    if (window.location.pathname.startsWith("/share/")) return "share";
    return window.location.pathname.startsWith("/apply/") ? "form" : "landing";
  });
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [dashboardTab, setDashboardTab] = useState(() => {
    return sessionStorage.getItem("sahab_dashboard_tab") || "الرئيسية";
  });

  useEffect(() => {
    sessionStorage.setItem("sahab_dashboard_tab", dashboardTab);
  }, [dashboardTab]);

  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setDashboardTab(customEvent.detail);
      }
    };
    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, []);
  const [dashboardPendingAction, setDashboardPendingAction] = useState<{ id: string, decision: string, isOffer?: boolean } | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("sahab_dark_mode") === "true";
  });
  const [showOnboardingGlobal, setShowOnboardingGlobal] = useState(false);
  const [globalPendingDraftId, setGlobalPendingDraftId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showWelcomeSlides, setShowWelcomeSlides] = useState(false);
  const [showWelcomeGift, setShowWelcomeGift] = useState(false);
  useEffect(() => {
    localStorage.setItem("sahab_dark_mode", String(darkMode));
    if (window.location.pathname.startsWith("/apply/") || window.location.pathname.startsWith("/interview/")) {
      document.documentElement.classList.remove("dark");
      return;
    }
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [globalToastMessage, setGlobalToastMessage] = useState<{ message: string; type: "success" | "warning" | "error" } | null>(null);
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<any>;
      if (customEvent.detail) {
        if (typeof customEvent.detail === 'string') {
          setGlobalToastMessage({ message: customEvent.detail, type: "success" });
        } else {
          setGlobalToastMessage({ message: customEvent.detail.message, type: customEvent.detail.type || "success" });
        }
        setTimeout(() => setGlobalToastMessage(null), 3500);
      }
    };
    window.addEventListener("showToast", handler);
    return () => window.removeEventListener("showToast", handler);
  }, []);

  useEffect(() => {
    const handler = () => setShowBookingModal(true);
    const onboardingHandler = () => setShowOnboardingGlobal(true);
    window.addEventListener("openBookingModal", handler);
    window.addEventListener("showOnboardingGlobal", onboardingHandler);
    return () => {
      window.removeEventListener("openBookingModal", handler);
      window.removeEventListener("showOnboardingGlobal", onboardingHandler);
    };
  }, []);
  const [selectedJob, setSelectedJob] = useState<Job | null>(() => {
    const saved = sessionStorage.getItem("sahab_selected_job");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (selectedJob) {
      sessionStorage.setItem("sahab_selected_job", JSON.stringify(selectedJob));
    } else {
      sessionStorage.removeItem("sahab_selected_job");
    }
  }, [selectedJob]);
  const [clonedJob, setClonedJob] = useState<Job | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [previewJobState, setPreviewJobState] = useState<Job | null>(null);
  const [applyMode, setApplyMode] = useState<"fast" | "normal">("normal");
  const [createJobType, setCreateJobType] = useState<"single" | "campaign" | "quick_link">(
    "single",
  );
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem("sahab_jobs_db_v1");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load jobs from localStorage", e);
    }
    return [];
  });

  useEffect(() => {
    if (session && step && step !== "landing" && step !== "login" && step !== "registerCompany") {
      sessionStorage.setItem("sahab_active_step", step);
    }
    
    if (!window.location.pathname.startsWith('/apply/') && !window.location.pathname.startsWith('/profile') && !window.location.pathname.startsWith('/share/') && !window.location.pathname.startsWith('/interview/')) {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('step') && searchParams.get('step') !== step) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [step, session]);

  // Jobs fetching moved to user-dependent useEffect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session && !window.location.pathname.startsWith('/apply/') && !window.location.pathname.startsWith('/profile') && !window.location.pathname.startsWith('/share/') && !window.location.pathname.startsWith('/interview/')) {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('step') === 'landing') {
          setStep('landing');
        } else {
          const savedStep = sessionStorage.getItem('sahab_active_step');
          if (savedStep && savedStep !== "landing" && savedStep !== "login" && savedStep !== "registerCompany") {
            setStep(savedStep as FlowStep);
          } else {
            setStep("dashboard");
          }
        }
      }
      setIsCheckingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Supabase Auth Event:", _event);

      // Prevent network drops from falsely logging out the user
      if (_event === 'SIGNED_OUT' && !navigator.onLine) {
        console.warn("Ignored SIGNED_OUT event because the browser is offline.");
        return;
      }

      setSession(session);
      setUser(session?.user || null);

      if (_event === 'PASSWORD_RECOVERY') {
        setStep("updatePassword");
      } else if (_event === 'TOKEN_REFRESHED' || _event === 'SIGNED_IN') {
        if (session && !window.location.pathname.startsWith('/apply/') && !window.location.pathname.startsWith('/profile') && !window.location.pathname.startsWith('/share/') && !window.location.pathname.startsWith('/interview/')) {
          const searchParams = new URLSearchParams(window.location.search);
          if (searchParams.get('step') === 'landing') {
            setStep('landing');
          } else {
            const savedStep = sessionStorage.getItem('sahab_active_step');
            setStep(prevStep => {
              if (prevStep === "updatePassword") return "updatePassword";
              if (["landing", "login", "registerCompany"].includes(prevStep)) {
                return (savedStep as FlowStep) || "dashboard";
              }
              return prevStep;
            });
          }
        }
      } else if (session && !window.location.pathname.startsWith('/apply/') && !window.location.pathname.startsWith('/profile') && !window.location.pathname.startsWith('/share/') && !window.location.pathname.startsWith('/interview/')) {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('step') === 'landing') {
          setStep('landing');
        } else {
          const savedStep = sessionStorage.getItem('sahab_active_step');
          setStep(prevStep => {
            if (prevStep === "updatePassword") return "updatePassword";
            if (["landing", "login", "registerCompany"].includes(prevStep)) {
              return (savedStep as FlowStep) || "dashboard";
            }
            return prevStep;
          });
        }
      } else if (!session && !window.location.pathname.startsWith('/apply/') && !window.location.pathname.startsWith('/profile') && !window.location.pathname.startsWith('/share/') && !window.location.pathname.startsWith('/interview/')) {
        if (_event === 'SIGNED_OUT') {
          sessionStorage.removeItem("sahab_active_step");
          sessionStorage.removeItem("sahab_dashboard_tab");
          sessionStorage.removeItem("sahab_selected_applicant");
          sessionStorage.removeItem("sahab_selected_job");
          sessionStorage.removeItem("sahab_decision_filter");
          sessionStorage.removeItem("sahab_job_filter");
          setStep("landing");
          localStorage.removeItem("sahab_jobs_db_v1");
          localStorage.removeItem("sahab_applicants_fast_cache");
          localStorage.removeItem("sahab_decisions");
          setJobs([]);
          setUserProfile({
            id: "",
            name: "",
            title: "",
            companyName: "",
            entityType: "company",
            commercialRegistration: "",
            freelanceDocument: "",
            taxNumber: "",
            city: "",
            companyLogo: "",
            subscription_tier: "free",
            subscription_end_date: null,
            subscription_is_yearly: false,
            used_cvs: 0,
            fields_locked: false,
            cv_limit: 0,
            jobs_limit: 0,
            interviews_limit: 0,
            used_jobs: 0,
            used_interviews: 0,
            extra_cv_credits: 0,
            extra_interview_credits: 0,
            addons_bought_this_month: 0,
            isLoaded: false,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let handleOnline: () => void;

    if (user && user.id) {
      const fetchCompanyProfile = async () => {
        try {
          const { data, error } = await supabase.from('companies').select('*').eq('id', user.id).single();
          if (data && !error) {
            const isProfileComplete = !!(data.company_name && data.city);

            const rawPlan = data.subscription_plan || "free";
            let normalizedPlan = rawPlan.replace('_yearly', '').replace('_monthly', '');
            if (normalizedPlan === 'single_job') normalizedPlan = 'one-time';
            const isYearly = rawPlan.includes('_yearly');

            setUserProfile(prev => ({
              ...prev,
              id: user.id,
              name: user.user_metadata?.full_name || prev.name,
              title: user.user_metadata?.job_title || prev.title,
              companyName: data.company_name || prev.name,
              entityType: data.entity_type || user.user_metadata?.entity_type || prev.entityType,
              hasExplicitEntityType: !!(data.entity_type || user.user_metadata?.entity_type),
              commercialRegistration: data.commercial_registration || prev.commercialRegistration,
              freelanceDocument: data.freelance_document || prev.freelanceDocument,
              taxNumber: data.tax_number || prev.taxNumber,
              city: data.city || prev.city,
              companyLogo: data.company_logo || prev.companyLogo,
              contactEmail: data.contact_email || user.email || prev.contactEmail,
              contactPhone: data.contact_phone || prev.contactPhone,
              subscription_tier: normalizedPlan,
              subscription_end_date: data.subscription_end_date || null,
              subscription_is_yearly: isYearly,
              is_auto_renew: data.is_auto_renew || false,
              used_cvs: data.used_cvs || 0,
              fields_locked: data.fields_locked || false,
              cv_limit: data.cv_limit || 0,
              jobs_limit: data.jobs_limit || 0,
              interviews_limit: data.interviews_limit || 0,
              used_jobs: data.used_jobs || 0,
              used_interviews: data.used_interviews || 0,
              extra_cv_credits: data.extra_cv_credits || 0,
              extra_interview_credits: data.extra_interview_credits || 0,
              addons_bought_this_month: data.addons_bought_this_month || 0,
              isLoaded: true,
            }));



            // Force Settings tab if profile is incomplete
            if (!isProfileComplete) {
              setDashboardTab("الحساب");
            }
          } else if (!navigator.onLine || (error && error.message.toLowerCase().includes('fetch'))) {
            // If it's a network error or offline, do NOT set isLoaded: true. Let it spin.
            return;
          } else {
            // Handle new user so we don't get stuck in loading
            setUserProfile(prev => ({
              ...prev,
              id: user.id,
              name: user.user_metadata?.full_name || prev.name,
              entityType: user.user_metadata?.entity_type || prev.entityType,
              hasExplicitEntityType: !!user.user_metadata?.entity_type,
              isLoaded: true
            }));

            // Welcome Slides Logic (ONLY for brand new accounts)
            const hasSeenWelcome = localStorage.getItem(`welcome_slides_seen_${user.id}`);
            const isPublicCandidatePage = window.location.pathname.startsWith('/apply/') || window.location.pathname.startsWith('/profile') || window.location.pathname.startsWith('/share/') || window.location.pathname.startsWith('/interview/');
            if (!hasSeenWelcome && !isPublicCandidatePage) {
              setShowWelcomeSlides(true);
            }

            setDashboardTab("الحساب");
          }
        } catch (err: any) {
          console.error("Error fetching company profile:", err);
          if (!navigator.onLine || (err && err.message && err.message.toLowerCase().includes('fetch'))) return;
          setUserProfile(prev => ({ ...prev, id: user.id, name: user.user_metadata?.full_name || prev.name, isLoaded: true }));
          setDashboardTab("الحساب");
        }
      };

      const fetchUserJobs = async () => {
        try {
          const { data, error } = await supabase.from('jobs').select('*').eq('company_id', user.id).order('created_at', { ascending: false });
          if (data && !error) {
            const mappedDbJobs: Job[] = data.map((raw: any) => ({
              id: raw.id,
              company_id: raw.company_id,
              title: raw.title,
              recordType: raw.record_type || 'single',
              company: raw.department || raw.company_name || "",
              companyLogo: raw.company_logo || null,
              department: raw.department || "",
              location: raw.location || "",
              type: raw.type || "",
              types: Array.isArray(raw.types) ? raw.types : [],
              autoRejectCity: raw.auto_reject_city || false,
              autoRejectQualification: raw.auto_reject_qualification || false,
              autoRejectExperience: raw.auto_reject_experience || false,
              experience: raw.experience_level || "",
              qualification: raw.qualification || "",
              description: raw.description || "",
              responsibilities: raw.responsibilities || "",
              qualifications: raw.qualifications_details || "",
              targetMajors: Array.isArray(raw.target_majors) ? raw.target_majors : [],
              targetSkills: Array.isArray(raw.target_skills) ? raw.target_skills : [],
              requiredLanguages: Array.isArray(raw.required_languages) ? raw.required_languages : [],
              salaryMin: raw.salary_min || 0,
              salaryMax: raw.salary_max || 0,
              hideSalary: raw.hide_salary || false,
              knockoutQuestions: Array.isArray(raw.knockout_questions) ? raw.knockout_questions : [],
              customQuestions: Array.isArray(raw.custom_questions) ? raw.custom_questions : [],
              customAttachments: Array.isArray(raw.custom_attachments) ? raw.custom_attachments : [],
              aiInstructions: raw.ai_instructions || "",
              status: raw.status || "مسودة",
              createdAt: raw.created_at ? raw.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              applicants: 0,
              visits_count: raw.visits_count || 0,
              directUpload: raw.direct_upload || false,
              roles: Array.isArray(raw.roles) ? raw.roles : [],
              aiOverrideFields: raw.ai_override_fields || undefined,
              job_number: raw.job_number
            }));

            setJobs(prevJobs => {
              const drafts = prevJobs.filter(j => j.status === "مسودة" && j.company_id === user.id && !mappedDbJobs.find(dbj => dbj.id === j.id));
              return [...drafts, ...mappedDbJobs];
            });
          }
        } catch (err) {
          console.warn("Failed to fetch jobs from Supabase", err);
        }
      };
      handleOnline = () => {
        if (!navigator.onLine) return;
        fetchCompanyProfile();
        fetchUserJobs();
      };
      window.addEventListener('online', handleOnline);

      fetchCompanyProfile();
      fetchUserJobs();
    }

    return () => {
      if (handleOnline) {
        window.removeEventListener('online', handleOnline);
      }
    };
  }, [user?.id]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/apply/')) {
      const jobId = path.split('/')[2];

      const fetchJobDirectly = async () => {
        const { data, error } = await supabase.from('jobs').select('*').eq('id', jobId).single();
        if (data && !error) {
          const fetchedJob = {
            id: data.id,
            company_id: data.company_id,
            title: data.title,
            recordType: data.record_type || 'single',
            company: data.department || data.company_name || "",
            companyLogo: data.company_logo || null,
            department: data.department || "",
            location: data.location || "",
            type: data.type || "",
            experience: data.experience_level || "",
            qualification: data.qualification || "",
            description: data.description || "",
            responsibilities: data.responsibilities || "",
            qualifications: data.qualifications_details || "",
            targetMajors: Array.isArray(data.target_majors) ? data.target_majors : [],
            targetSkills: Array.isArray(data.target_skills) ? data.target_skills : [],
            requiredLanguages: Array.isArray(data.required_languages) ? data.required_languages : [],
            salaryMin: data.salary_min || 0,
            salaryMax: data.salary_max || 0,
            hideSalary: data.hide_salary || false,
            knockoutQuestions: Array.isArray(data.knockout_questions) ? data.knockout_questions : [],
            customQuestions: Array.isArray(data.custom_questions) ? data.custom_questions : [],
            customAttachments: Array.isArray(data.custom_attachments) ? data.custom_attachments : [],
            aiInstructions: data.ai_instructions || "",
            status: data.status || "مسودة",
            createdAt: data.created_at ? data.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            applicants: 0,
            directUpload: data.direct_upload || false,
            roles: Array.isArray(data.roles) ? data.roles : [],
            aiOverrideFields: data.ai_override_fields || undefined,
            job_number: data.job_number
          };
          setSelectedJob(fetchedJob as Job);
          setStep(
            fetchedJob.directUpload || fetchedJob.roles?.some((r: any) => r.directUpload) || fetchedJob.roles?.[0]?.directUpload
              ? 'form'
              : 'publicJob'
          );
        } else {
          // Fallback to local storage if not synced
          const localData = localStorage.getItem("sahab_jobs_db_v1");
          if (localData) {
            const localJobs = JSON.parse(localData);
            const jobFound = localJobs.find((j: any) => j.id === jobId);
            if (jobFound) {
              setSelectedJob(jobFound);
              setStep(
                jobFound.directUpload || jobFound.roles?.some((r: any) => r.directUpload) || jobFound.roles?.[0]?.directUpload
                  ? 'form'
                  : 'publicJob'
              );
              return;
            }
          }
          setStep('notFound');
        }
      };

      fetchJobDirectly();
    } else if (path.startsWith('/share/')) {
      setStep('share');
    } else if (path.startsWith('/interview/')) {
      setStep('interview');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sahab_jobs_db_v1", JSON.stringify(jobs));
  }, [jobs]);
  const handleAutoSaveDraft = (
    jobData: Omit<Job, "id" | "applicants" | "status" | "createdAt" | "draftId">,
    existingDraftId: string | null
  ) => {
    const jobIdToUse = (existingDraftId && existingDraftId.length > 30) ? existingDraftId : crypto.randomUUID();

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

  const handleCreateJob = async (
    jobData: Omit<Job, "id" | "applicants" | "status" | "createdAt" | "draftId">,
    existingDraftId?: string
  ) => {
    // const isComplete = Boolean(userProfile.commercialRegistration || userProfile.freelanceDocument);

    // -- Bypass: تعليق كود إجبار اكتمال بيانات الشركة --
    // يتم تجاوز التحقق مؤقتًا ونشر الوظيفة مباشرة
    const isComplete = true;

    // الحفاظ على حالة الوظيفة إذا تم طلب الحفظ كمسودة، وإلا نستخدم الحالة المحددة
    const incomingStatus = (jobData as any).status;
    const resolvedStatus = incomingStatus ? incomingStatus : (isComplete ? "نشط" : "مسودة");

    const jobIdToUse = (existingDraftId && existingDraftId.length > 30) ? existingDraftId : crypto.randomUUID();

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

    // Backend Sync (Supabase)
    try {
      const actualCompanyId = session?.user?.id || "00000000-0000-0000-0000-000000000000";
      const jobForDB = {
        id: newJob.id,
        company_id: actualCompanyId,
        title: newJob.title,
        record_type: newJob.recordType || 'single',
        department: newJob.company || newJob.department,
        location: newJob.location,
        type: newJob.type,
        types: newJob.types || [],
        auto_reject_city: newJob.autoRejectCity || false,
        auto_reject_qualification: newJob.autoRejectQualification || false,
        auto_reject_experience: newJob.autoRejectExperience || false,
        experience_level: newJob.experience,
        qualification: newJob.qualification,
        description: newJob.description,
        responsibilities: newJob.responsibilities,
        qualifications_details: newJob.qualifications,
        target_majors: newJob.targetMajors,
        target_skills: newJob.targetSkills,
        required_languages: newJob.requiredLanguages,
        salary_min: newJob.salaryMin === "" ? null : Number(newJob.salaryMin) || null,
        salary_max: newJob.salaryMax === "" ? null : Number(newJob.salaryMax) || null,
        hide_salary: newJob.hideSalary,
        knockout_questions: newJob.knockoutQuestions,
        custom_questions: newJob.customQuestions,
        custom_attachments: newJob.customAttachments,
        ai_instructions: newJob.aiInstructions,
        status: newJob.status,
        created_at: new Date().toISOString(),
        direct_upload: newJob.directUpload || false,
        roles: newJob.roles || [],
        ai_override_fields: newJob.aiOverrideFields || undefined,
        company_logo: newJob.companyLogo || null,
        start_date: newJob.startDate,
        end_date: newJob.endDate
      };
      const { error } = await supabase.from('jobs').upsert([jobForDB]);
      if (error) {
        console.error("Supabase Error saving job:", error);
        alert("فشل حفظ الوظيفة في قاعدة البيانات، يرجى المحاولة مرة أخرى: " + error.message);
      }
    } catch (err: any) {
      console.error("Could not sync job to Supabase:", err);
      alert("فشل الاتصال بقاعدة البيانات. يرجى التحقق من اتصالك والمحاولة مجدداً.");
    }

    // إذا كانت الوظيفة ستحفظ كمسودة صراحةً، لا ننتقل لصفحة النجاح
    if (resolvedStatus === "مسودة") {
      return jobIdToUse;
    }

    if (isComplete) {
      setSelectedJob(newJob);
      setClonedJob(null);
      setStep("jobSuccess");
      return null;
    } else {
      /*
      setGlobalPendingDraftId(jobIdToUse);
      setShowOnboardingGlobal(true);
      return jobIdToUse; // return draft id to CreateJob so it doesn't create multiple drafts
      */
      return null;
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
  const handleDeactivateJob = async (job: Job) => {
    const updatedJobs = jobs.map((j) =>
      j.id === job.id ? { ...j, status: "مغلق" as const } : j,
    );
    setJobs(updatedJobs);

    // Backend Sync
    try {
      await supabase.from('jobs').update({ status: 'مغلق', closed_at: new Date().toISOString() }).eq('id', job.id);
    } catch (err) {
      console.error("Could not deactivate job in backend", err);
    }
  };

  const handleReactivateJob = async (job: Job) => {
    const updatedJobs = jobs.map((j) =>
      j.id === job.id ? { ...j, status: "نشط" as const, createdAt: new Date().toISOString().split("T")[0] } : j,
    );
    setJobs(updatedJobs);

    // Backend Sync
    try {
      await supabase.from('jobs').update({ status: 'نشط', closed_at: null }).eq('id', job.id);
    } catch (err) {
      console.error("Could not reactivate job in backend", err);
    }
  };


  const startJobCreation = (
    type: "single" | "campaign" | "quick_link",
    initialJobData: Job | null = null,
  ) => {
    // Check Subscription Limits
    const activeCount = jobs.filter(j => j.status === 'نشط').length;
    let limit = userProfile?.jobs_limit || 0;
    if (!limit) {
      if (userProfile?.subscription_tier === 'free') limit = 1;
      else if (userProfile?.subscription_tier === 'one-time') limit = 1;
      else if (userProfile?.subscription_tier === 'startup' || userProfile?.subscription_tier === 'growth') limit = 3;
      else if (userProfile?.subscription_tier === 'business') limit = 10;
      else if (userProfile?.subscription_tier === 'enterprise') limit = Infinity;
    }
    if (userProfile?.subscription_tier === 'enterprise') limit = Infinity;
    if (limit === 0) {
      alert("عذراً، يجب عليك اختيار باقة اشتراك لتمكين إضافة الإعلانات.");
      setDashboardTab("باقات فرز");
      setStep("dashboard");
      return;
    }

    if (activeCount >= limit) {
      alert("عذراً، لقد وصلت للحد الأقصى للوظائف المسموح بها في باقتك الحالية. يرجى ترقية باقتك للتمكن من إضافة وظائف جديدة.");
      setDashboardTab("باقات فرز");
      setStep("dashboard");
      return;
    }

    setCreateJobType(type);
    setClonedJob(initialJobData);

    setStep("createJob");
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500" />;
  }

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
        <Navbar setStep={setStep} currentStep={step} onOpenBookingModal={() => setShowBookingModal(true)} />
      )}{" "}
      {" "}

      <WelcomeSlidesModal isOpen={showWelcomeSlides} onClose={() => {
        setShowWelcomeSlides(false);
        if (session?.user?.id) {
          localStorage.setItem(`welcome_slides_seen_${session.user.id}`, 'true');
        }
        // Show the beautiful welcome gift modal!
        setShowWelcomeGift(true);
      }} />

      {/* Welcome Gift Notification Banner */}
      <AnimatePresence>
        {showWelcomeGift && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] p-4 w-full max-w-2xl pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-2xl border border-primary/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right pointer-events-auto"
            >
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 shadow-inner">
                <Gift size={28} className="animate-bounce" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-navy dark:text-white mb-1">
                  مرحباً بك في فرززز! 🎉
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  لقد منحناك <strong className="text-primary">50 سيرة ذاتية مجانية</strong> بالإضافة إلى <strong className="text-primary">مقابلة بالذكاء الاصطناعي</strong>. ابدأ رحلتك الآن وجرب النظام.
                </p>
              </div>

              <button
                onClick={() => setShowWelcomeGift(false)}
                className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-600 transition-all shadow-[0_4px_15px_rgb(13,148,136,0.3)] active:scale-95 shrink-0"
              >
                حسناً
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            className={`fixed top-8 left-1/2 z-[999] border px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm md:text-base whitespace-nowrap ${globalToastMessage.type === 'warning' ? 'bg-orange-50 text-orange-700 border-orange-200' : globalToastMessage.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-900 border-slate-700 text-white'}`}
          >
            {globalToastMessage.type === 'warning' ? <AlertTriangle size={20} className="text-orange-500" /> : globalToastMessage.type === 'error' ? <AlertTriangle size={20} className="text-red-500" /> : <CheckCircle size={20} className="text-primary" />}
            {globalToastMessage.message}
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
              <LandingPage onStart={() => setStep("registerCompany")} onOpenBookingModal={() => setShowBookingModal(true)} />
            )}{" "}

            {step === "dashboard" && !userProfile.isLoaded ? (
              <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center">
                  <div className="animate-spin [animation-duration:2s] scale-150 drop-shadow-xl">
                    <LogoIcon />
                  </div>
                </div>
              </div>
            ) : (step === "dashboard" || step === "applicantDetails") && (
              <div className={step === "applicantDetails" ? "hidden" : "block"}>
                <Dashboard
                  activeTab={dashboardTab}
                  setActiveTab={setDashboardTab}
                  userEmail={session?.user?.email || ""}
                  onViewDetails={(app) => {
                    sessionStorage.setItem('dashboardScroll', window.scrollY.toString());
                    setSelectedApplicantForDetails(app);
                    setStep("applicantDetails");
                  }}
                  onCreateJob={() => {
                    setClonedJob(null);
                    startJobCreation("single");
                  }}
                  onManageJob={(job, selectedRoleId) => {
                    setSelectedJob(job);
                    if (selectedRoleId) {
                      setApplicantSelectedRoleId(selectedRoleId);
                    } else {
                      setApplicantSelectedRoleId(null);
                    }
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
                  onDeleteJob={async (id) => {
                    setJobs(prev => {
                      const newJobs = prev.filter(j => j.id !== id);
                      localStorage.setItem("sahab_jobs_db_v1", JSON.stringify(newJobs));
                      return newJobs;
                    });
                    try {
                      await supabase.from('jobs').delete().eq('id', id);
                    } catch (err) {
                      console.error("Failed to delete job from Supabase:", err);
                    }
                  }}
                  onDeleteAllDrafts={async () => {
                    const draftIds = jobs.filter(j => j.status === "مسودة").map(j => j.id);
                    setJobs(prev => prev.filter(j => j.status !== "مسودة"));
                    if (draftIds.length > 0) {
                      try {
                        await supabase.from('jobs').delete().in('id', draftIds);
                      } catch (err) {
                        console.error("Failed to delete drafts from Supabase:", err);
                      }
                    }
                  }}
                  pendingAction={dashboardPendingAction}
                  clearPendingAction={() => setDashboardPendingAction(null)}
                />
              </div>
            )}{" "}
            {step === "updatePassword" && (
              <UpdatePasswordPage onComplete={() => setStep("dashboard")} />
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
            {step === "superAdmin" && <SuperAdmin />}{" "}
            {step === "applicantDetails" && (
              <ApplicantDetails
                onBack={() => setStep("dashboard")}
                applicant={selectedApplicantForDetails}
                job={jobs.find(j => j.id === selectedApplicantForDetails?.job_id || j.title === selectedApplicantForDetails?.job)}
                userProfile={userProfile}
                onStatusUpdate={(id, decision, isOffer) => setDashboardPendingAction({ id, decision, isOffer })}
                onUpdateApplicant={(id, updates) => {
                  setSelectedApplicantForDetails(prev => prev && prev.id === id ? { ...prev, ...updates } : prev);
                }}
              />
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
                jobs={jobs}
              />
            )}{" "}
            {step === "manageJob" && selectedJob && (
              <ErrorBoundary>
                <ManageJob
                  job={{ ...selectedJob, company: selectedJob.company || userProfile.companyName || "لم تُحدد" }}
                  onBack={() => setStep("dashboard")}
                  onUpdate={(updatedJob, stayOnPage) => {
                    setJobs(
                      jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j)),
                    );
                    if (!stayOnPage) {
                      setStep("dashboard");
                    } else {
                      setSelectedJob(updatedJob);
                    }
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
                onPreview={() => setPreviewJobState(selectedJob)}
              />
            )}{" "}
            {["form", "publicJob"].includes(step) && !selectedJob && window.location.pathname.startsWith('/apply/') && (
              <div className="flex items-center justify-center min-h-[80vh] w-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-slate-200 dark:border-slate-700 border-b-4 border-primary"></div>
              </div>
            )}
            {step === "publicJob" && selectedJob && (
              <PublicJobPage
                job={selectedJob}
                selectedRoleId={applicantSelectedRoleId}
                onSelectRole={(id) => setApplicantSelectedRoleId(id)}
                onBackToCampaign={() => setApplicantSelectedRoleId(null)}
                onApply={(mode) => {
                  setApplyMode(mode);
                  setStep("form");
                }}
              />
            )}
            {step === "form" && selectedJob && (
              <ErrorBoundary>
                <JobApplication
                  job={selectedJob}
                  selectedRoleId={applicantSelectedRoleId}
                  applyMode={applyMode}
                  onBackToJobs={() => {
                    setStep("publicJob");
                    setApplicantSelectedRoleId(null);
                  }}
                  onSubmit={() => setStep("dashboard")}
                />
              </ErrorBoundary>
            )}
            {step === "share" && (
              <SharedManagementView jobId={window.location.pathname.split('/')[2]} />
            )}
            {step === "interview" && (
              <InterviewRoom applicantId={window.location.pathname.split('/')[2]} onBack={() => window.location.href = '/'} />
            )}
            {step === "seeker-profile" && (
              <SeekerProfile />
            )}
            {step === "notFound" && (
              <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4" dir="rtl">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-2xl border border-slate-100 dark:border-slate-700 text-center">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">الوظيفة غير متاحة</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                    عذراً، لم نتمكن من العثور على هذه الوظيفة. قد تكون الوظيفة قديمة وتم إغلاقها، أو أن الرابط غير صحيح.
                  </p>
                </div>
              </div>
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
      <BookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </div>
  );
}
