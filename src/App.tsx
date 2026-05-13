/** * @license * SPDX-License-Identifier: Apache-2.0 */
import { skillsDictionary, getUserSavedSkills, saveUserSkills, SAUDI_CITIES, SearchableSelect, VerificationModal, FlowStep, Job, PreviewModal, Applicant } from "./Shared";
import SuperAdmin from './components/SuperAdmin';
import JobApplication from './components/JobApplication';
import ApplicantDetails from './components/ApplicantDetails';
import Dashboard from './components/Dashboard';
import CreateJob from './components/CreateJob';
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
import { Users, Database, CheckCircle, AlertTriangle, Play, FileText, Clock, Sparkles, ShieldCheck, Zap, ArrowLeft, ArrowRight, Briefcase, LogOut, Lock, Mail, CreditCard, Calendar, Phone, Copy, ExternalLink, MapPin, Share2, Save, Star, X, Plus, Info, GraduationCap, Target, Moon, Sun } from 'lucide-react';
import skillsDictionaryRaw from "./skillsDictionary.json";
;
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
      <div className="min-h-screen bg-bg dark:bg-navy flex items-center justify-center p-6">
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
    <div className="min-h-screen bg-bg dark:bg-navy pt-32 pb-20 px-4">
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
                      <div className="flex flex-wrap gap-2">
                        {(activeRole?.targetMajors || job.targetMajors || []).map((major, i) => (
                          <span key={i} className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-100/50 dark:border-blue-800/20 shadow-sm transition-all hover:-translate-y-0.5">
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
                      <ul className="space-y-4 list-none">
                        {(activeRole?.responsibilities || job.responsibilities || '').split('\n').filter(r => r.trim()).map((res, i) => (
                          <li key={i} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-base">
                            <div className="mt-1 shrink-0 bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                              <CheckCircle size={16} strokeWidth={2.5} />
                            </div>
                            <span className="leading-relaxed pt-0.5">{res.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(activeRole?.qualifications || job.qualifications) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المؤهلات والمتطلبات
                      </h3>
                      <ul className="space-y-4 list-disc list-inside px-2">
                        {(activeRole?.qualifications || job.qualifications || '').split('\n').filter(q => q.trim()).map((qual, i) => (
                          <li key={i} className="text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">
                            {qual.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(activeRole?.skills?.length || job.skills?.length || activeRole?.languages?.length || job.languages?.length) ? (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المهارات واللغات
                      </h3>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2 flex-1">
                          {(activeRole?.skills || job.skills || []).map((skill: string) => (
                            <span key={skill} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-600 shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                        {((activeRole?.languages || job.languages || []).length > 0) && (
                          <div className="flex flex-wrap gap-2 mr-auto">
                            {(activeRole?.languages || job.languages || []).map((lang: string) => (
                              <span key={lang} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl text-sm font-bold border border-blue-200 dark:border-blue-800 shadow-sm">
                                {lang}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {(activeRole?.benefits || job.benefits) && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-navy dark:text-white mb-5 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> المميزات
                      </h3>
                      <ul className="space-y-4 list-none">
                        {(activeRole?.benefits || job.benefits || '').split('\n').filter(b => b.trim()).map((ben, i) => (
                          <li key={i} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-base">
                            <div className="mt-1 shrink-0 bg-primary/10 p-1.5 rounded-full text-primary">
                              <Sparkles size={16} strokeWidth={2.5} />
                            </div>
                            <span className="leading-relaxed pt-0.5">{ben.replace(/\(اختياري\)/g, '').trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-12 pb-4">
                    <button onClick={onApply} className="w-full max-w-md mx-auto flex bg-primary text-white py-5 rounded-2xl text-xl font-bold hover:bg-teal-600 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] items-center justify-center gap-3">
                      التقديم على هذه الوظيفة
                    </button>
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
const ManageJob = ({
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
  const [activeTab, setActiveTab] = useState<"التفاصيل" | "متطلبات الفرز" | "الإعدادات">("التفاصيل");
  const isLocked = job.status === "نشط" && job.applicants > 0;

  const [title, setTitle] = useState(job.title || job.campaignTitle || "");
  const [company, setCompany] = useState(job.company || "");
  const [location, setLocation] = useState(job.location || "");
  const [experience, setExperience] = useState(job.experience || "لا يشترط خبرة");
  const [qualification, setQualification] = useState(job.qualification || "ثانوي");
  const [salaryMin, setSalaryMin] = useState(job.salaryMin || "");
  const [salaryMax, setSalaryMax] = useState(job.salaryMax || "");
  const [isSalaryHidden,
    setIsSalaryHidden] = useState(job.isSalaryHidden || false);
  const [askExpectedSalary, setAskExpectedSalary] = useState(job.askExpectedSalary || false);
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

  // New States added for the Refactored Tabs Flow
  const [responsibilities, setResponsibilities] = useState(job.responsibilities || "");
  const [targetMajors, setTargetMajors] = useState<string[]>(job.targetMajors || []);
  const [customMajor, setCustomMajor] = useState("");
  const [customQuestions, setCustomQuestions] = useState<{ text: string; type: string; options?: string[]; required?: boolean }[]>(job.customQuestions || []);
  const [knockoutQuestions, setKnockoutQuestions] = useState<{ text: string; type: "yes_no" | "options"; options?: string[]; requiredAnswer: string }[]>(job.knockoutQuestions || []);

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
      targetMajors,
      responsibilities,
      customQuestions,
      knockoutQuestions,
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
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onBack(); }}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary font-bold transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white flex items-center justify-center group-hover:border-primary transition-all">
              <ArrowLeft size={18} className="rotate-180" />
            </div>
            العودة للوحة التحكم
          </button>

          {onClone && (
            <button
              onClick={() => onClone(job)}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
              title="نسخ بيانات هذه الوظيفة لإنشاء مسودة جديدة"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              تكرار الوظيفة
            </button>
          )}
        </div>
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
              <h2 className="text-3xl font-bold text-navy dark:text-white mb-6">
                إدارة الوظيفة: {job.title}
              </h2>

              <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar pb-0">
                {["التفاصيل", "متطلبات الفرز", "الإعدادات"].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 font-bold text-lg px-4 border-b-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                  >
                    {tab}
                    {tab === "متطلبات الفرز" && isLocked && <Lock size={14} className="inline-block ml-2 text-amber-500" />}
                  </button>
                ))}
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                {isLocked && activeTab === "متطلبات الفرز" && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-500 p-4 rounded-l-xl mb-6">
                    <p className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-2 text-sm">
                      <Lock size={18} /> تم قفل تعديل متطلبات الفرز لوجود متقدمين، وذلك للحفاظ على دقة تم تقييم نظام الفرز الآلي. لتعديلها يرجى تكرار الوظيفة.
                    </p>
                  </div>
                )}

                {activeTab === "التفاصيل" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">المسمى الوظيفي <span className="text-red-500">*</span></label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">الشركة / الفرع <span className="text-red-500">*</span></label>
                        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">
                        نبذة عن الدور <span className="text-slate-400 font-normal text-xs ml-1">(اختياري)</span>
                        <span className="relative group inline-flex items-center ml-1">
                          <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                          <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                            ترك هذا الحقل فارغاً سيجعل محرك نظام الفرز يعتمد على المعايير القياسية للمسمى الوظيفي. لتقييم أدق، أضف نبذة مختصرة.
                            <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                          </div>
                        </span>
                      </label>
                      <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none" placeholder="مثال: نبحث عن موظف طموح لإدارة علاقات العملاء في فرعنا الرئيسي..." />

                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">
                        المهام والمسؤوليات <span className="text-slate-400 font-normal text-xs ml-1">(اختياري)</span>
                        <span className="relative group inline-flex items-center ml-1">
                          <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                          <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                            يفضل إضافتها في شكل نقاط للوظائف الإدارية أو المتخصصة لرفع دقة مطابقة نظام الفرز الآلي.
                            <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                          </div>
                        </span>
                      </label>
                      <textarea rows={4} value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none" placeholder="مثال: - تحقيق أهداف المبيعات الشهرية. - إعداد تقارير الأداء..." />

                    </div>
                  </motion.div>
                )}

                {activeTab === "متطلبات الفرز" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`space-y-6 ${isLocked ? 'opacity-80' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">سنوات الخبرة المطلوبة <span className="text-red-500">*</span></label>
                        <select disabled={isLocked} value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-4 py-3 bg-slate-50 disabled:bg-slate-100 disabled:opacity-70 dark:bg-slate-800/50 dark:disabled:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-navy dark:text-white cursor-pointer disabled:cursor-not-allowed">
                          <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">لا يشترط خبرة</option>
                          <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">1-3 سنوات</option>
                          <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">3-5 سنوات</option>
                          <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">5+ سنوات</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">الحد الأدنى للمؤهل <span className="text-red-500">*</span></label>
                        <select disabled={isLocked} required value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full px-4 py-3 bg-slate-50 disabled:bg-slate-100 disabled:opacity-70 dark:bg-slate-800/50 dark:disabled:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-navy dark:text-white cursor-pointer disabled:cursor-not-allowed">
                          <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">لا يشترط مؤهل</option>
                          <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ثانوي</option>
                          <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">دبلوم</option>
                          <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">بكالوريوس</option>
                          <option className="bg-white text-navy dark:bg-slate-800 dark:text-white">ماجستير</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <label className="text-sm font-bold text-navy dark:text-white flex items-center gap-1 mb-2">
                        التخصصات المستهدفة <span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>
                        <span className="relative group inline-flex items-center ml-1">
                          <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                          <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                            اترك الحقل فارغاً إذا كانت الوظيفة تقبل جميع التخصصات لتوسيع نطاق المتقدمين في نظام الفرز الآلي.
                            <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                          </div>
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {targetMajors.map((major) => (
                          <span key={major} className={`bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-xl text-sm flex items-center gap-2 ${isLocked ? 'opacity-80' : ''}`}>
                            {major} {!isLocked && <button type="button" onClick={() => setTargetMajors(targetMajors.filter(l => l !== major))}><X size={12} /></button>}
                          </span>
                        ))}
                      </div>
                      {!isLocked && (
                        <div className="relative">
                          <input type="text" value={customMajor} onChange={(e) => setCustomMajor(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (customMajor.trim() && !targetMajors.includes(customMajor.trim())) { setTargetMajors([...targetMajors, customMajor.trim()]); setCustomMajor(""); } } }} placeholder="أضف تخصصاً واضغط Enter..." className="w-full pr-5 pl-12 py-3 bg-slate-50 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 rounded-xl outline-none dark:text-white text-sm" />
                          <button type="button" onClick={() => { if (customMajor.trim() && !targetMajors.includes(customMajor.trim())) { setTargetMajors([...targetMajors, customMajor.trim()]); setCustomMajor(""); } }} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 p-1 hover:text-primary"><Plus size={18} /></button>
                        </div>
                      )}

                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700 relative">
                      <label className="text-sm font-bold text-navy dark:text-white flex items-center gap-1 mb-2">
                        المهارات والتفضيلات <span className="text-slate-400 font-normal ml-1 text-xs">(اختياري)</span>
                        <span className="relative group inline-flex items-center ml-1">
                          <Info size={14} className="text-slate-400 group-hover:text-primary transition-colors cursor-help" />
                          <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                            تحديد المهارات التقنية الدقيقة يجعل نظام الفرز الآلي أكثر صرامة ودقة.
                            <div className="absolute right-2 top-full w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1.5"></div>
                          </div>
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl">
                        {selectedSkills.length === 0 && <span className="text-sm text-slate-400 py-2">لم يتم اختيار مهارات...</span>}
                        {selectedSkills.map((skill) => (
                          <span key={skill} className={`flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm ${isLocked ? 'opacity-80' : ''}`}>
                            {skill} {!isLocked && <button type="button" onClick={() => toggleSkill(skill)}><X size={14} /></button>}
                          </span>
                        ))}
                      </div>
                      {!isLocked && (
                        <div className="relative">
                          <input type="text" value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(e); } }} placeholder="أضف مهارة..." className="w-full pr-5 pl-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl outline-none focus:border-primary transition-all" />
                          <button type="button" onClick={addCustomSkill} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 p-1 hover:text-primary"><Plus size={18} /></button>
                        </div>
                      )}

                    </div>

                    <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                      <label className="text-sm font-bold text-navy dark:text-white mr-1 block">
                        اللغات المطلوبة <span className="text-slate-400 font-normal ml-1">(اختياري)</span>
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedLanguages.map((lang) => (
                          <span key={lang} className={`bg-primary text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm ${isLocked ? 'opacity-80' : ''}`}>
                            {lang}
                            {!isLocked && <button type="button" onClick={() => setSelectedLanguages(selectedLanguages.filter(l => l !== lang))}><X size={12} /></button>}
                          </span>
                        ))}
                      </div>
                      {!isLocked && (
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
                      )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <label className="text-sm font-bold text-navy dark:text-white mr-1 block flex items-center gap-2">
                        الأسئلة التقييمية للاستبعاد
                        <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-200 dark:border-amber-800/50 flex items-center gap-1">
                          <Lock size={10} /> للقراءة فقط
                        </span>
                      </label>
                      {knockoutQuestions.length === 0 && customQuestions.length === 0 && (
                        <p className="text-sm text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl font-medium border border-slate-200 dark:border-slate-700">لا توجد أسئلة مضافة.</p>
                      )}

                      <div className="space-y-3">
                        {knockoutQuestions.map((kq, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl relative">
                            <Lock size={14} className="absolute left-4 top-4 text-slate-400" />
                            <p className="font-bold text-sm text-navy dark:text-white pr-2 border-r-4 border-red-400 mb-2">{kq.text}</p>
                            <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 px-2 py-1 rounded inline-block">إجابة الاستبعاد المطلوبة: {kq.requiredAnswer}</span>
                          </div>
                        ))}
                        {customQuestions.map((q, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl relative">
                            <Lock size={14} className="absolute left-4 top-4 text-slate-400" />
                            <p className="font-bold text-sm text-navy dark:text-white pr-2 border-r-4 border-primary mb-2">{q.text}</p>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded inline-block">{q.type} - {q.required ? 'إلزامي' : 'اختياري'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "الإعدادات" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">نوع العمل <span className="text-red-500">*</span></label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-navy dark:text-white appearance-none cursor-pointer">
                          <option>دوام كامل</option><option>دوام جزئي</option><option>عن بعد</option><option>تدريب</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-navy dark:text-white mr-2 flex items-center gap-1">مقر العمل (المدينة) <span className="text-red-500">*</span></label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-navy dark:text-white font-medium" required />
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <label className="text-sm font-bold text-navy dark:text-white flex items-center gap-2">
                          <Calendar size={18} className="text-primary" /> إعلان مستمر (مفتوح دائماً)
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" className="sr-only peer" checked={isOpenEnded} onChange={(e) => setIsOpenEnded(e.target.checked)} />
                          <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-navy dark:text-white mr-2">بدء التقديم</label>
                          <input type="datetime-local" lang="en" style={{ fontFamily: 'Arial' }} value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 text-navy dark:text-white font-medium" dir="ltr" />
                        </div>
                        {!isOpenEnded && (
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-navy dark:text-white mr-2">انتهاء التقديم</label>
                            <input type="datetime-local" lang="en" style={{ fontFamily: 'Arial' }} value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 text-navy dark:text-white font-medium" dir="ltr" />
                          </div>
                        )}
                      </div>
                      {isOpenEnded && <p className="text-sm text-slate-500 font-bold bg-primary/5 p-3 rounded-xl border border-primary/10 mt-2 flex items-center gap-2"><Sparkles size={16} className="text-primary" /> سيبقى الإعلان متاحاً للتقديم حتى يتم إغلاقه يدوياً.</p>}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700">
                      <label className="text-sm font-bold text-navy dark:text-white mr-2 block">ميزانية الوظيفة / الراتب</label>
                      <div className="flex items-center gap-4">
                        <input type="number" required placeholder="الحد الأدنى للراتب" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 text-navy dark:text-white font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-sans" />
                        <span className="font-bold text-slate-400">-</span>
                        <input type="number" placeholder="الحد الأعلى للراتب - اختياري" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 outline-none rounded-xl border border-slate-200 dark:border-slate-700 text-navy dark:text-white font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-sans" />
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <input type="checkbox" className="sr-only peer" checked={isSalaryHidden} onChange={(e) => setIsSalaryHidden(e.target.checked)} />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                        <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">إخفاء الراتب عن المتقدمين (يُستخدم للفرز الآلي فقط)</span>
                      </label>
                      <label className="relative inline-flex flex-1 items-center cursor-pointer select-none mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 mr-2">
                        <input type="checkbox" className="sr-only peer" checked={askExpectedSalary} onChange={(e) => setAskExpectedSalary(e.target.checked)} />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-[1.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform dark:border-slate-600 peer-checked:bg-primary shrink-0"></div>
                        <span className="mr-3 text-sm font-bold text-slate-700 dark:text-slate-300">سؤال المتقدم عن راتبه المتوقع (يُظهر قائمة خيارات في نموذج التقديم)</span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 mt-8 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${status === "نشط" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`}>
                          <CheckCircle size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-navy dark:text-white text-lg">حالة الإعلان: <span className={status === "نشط" ? "text-green-600 dark:text-green-400" : ""}>{status}</span></p>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">انقر للتبديل إلى {status === "نشط" ? "مغلق" : "نشط"}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setStatus(status === "نشط" ? "مغلق" : "نشط")} className={`w-16 h-8 rounded-full relative transition-all shadow-inner focus:outline-none focus:ring-4 focus:ring-primary/20 ${status === "نشط" ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${status === "نشط" ? "left-1" : "left-9"}`} />
                      </button>
                    </div>
                  </motion.div>
                )}

                <button type="submit" className="w-full bg-primary text-white py-4 mt-8 rounded-2xl text-lg font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                  <Save size={22} /> حفظ وتحديث البيانات
                </button>
              </form>
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
                      // const verified = localStorage.getItem("company_verified") === "true";
                      /* if (!verified) {
                        setShowVerificationModal(true);
                        return;
                      } */
                      navigator.clipboard.writeText(
                        `${window.location.origin}/apply/${job.id}`,
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
            `${window.location.origin}/apply/${job.id}`,
          );
          alert("تم نسخ الرابط وتفعيل الحساب بنجاح!");
        }}
      />
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
            <div className="flex items-center gap-2 text-[15px] font-medium text-slate-800">
              {" "}
              {[
                { id: "features", label: "المميزات" },
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
              <button
                onClick={onOpenBookingModal}
                className="text-sm font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all px-4 py-2 rounded-xl hidden sm:flex items-center ml-2 shadow-sm"
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
  initialMode = "login"
}: {
  onLogin: () => void;
  onBack: () => void;
  initialMode?: "login" | "register";
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setMessage("تم إرسال رابط إعادة تعيين كلمة المرور بنجاح! يرجى مراجعة بريدك الإلكتروني.");
      setIsError(false);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setIsError(true);
      setMessage(err.message || "حدث خطأ أثناء إرسال الرابط. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      if (initialMode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
        // Optional: auto login right after signup
        // onLogin(); 
      } else {
        const { error } = await supabase.auth.signInWithPassword({
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
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
      {/* Right Side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-[#129B81] text-white p-12 flex-col justify-center items-center text-center relative overflow-hidden">
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
      <div className="md:w-1/2 bg-white dark:bg-slate-800 p-12 flex flex-col justify-center items-center relative">
        <button
          onClick={onBack}
          className="absolute top-8 right-8 flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
        >
          <ArrowRight size={18} /> العودة للرئيسية
        </button>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center md:text-right">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">
              {isForgotPassword ? "استعادة كلمة المرور" : initialMode === "register" ? "إنشاء حساب شركة" : "تسجيل الدخول"}
            </h2>
            {isForgotPassword && (
              <p className="text-slate-500 font-medium mt-2">
                أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
              </p>
            )}
          </div>

          <form onSubmit={isForgotPassword ? handleResetPassword : handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                البريد الإلكتروني للشركة
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-4 pl-12 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                  placeholder="name@company.com"
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
                  {initialMode === "login" && (
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">
                      نسيت كلمة المرور؟
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-4 pl-12 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                </div>
              </div>
            )}

            {message && (
              <div className={`p-4 rounded-xl text-sm font-bold ${isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || (!isForgotPassword && !password)}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-black hover:bg-black/90 transition-all shadow-xl shadow-black/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isForgotPassword ? "إرسال رابط الاستعادة" : initialMode === "register" ? "إنشاء حساب" : "تسجيل الدخول"
              )}
            </button>
            {isForgotPassword && (
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setMessage(""); setIsError(false); }}
                className="w-full py-4 px-6 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all"
              >
                العودة لتسجيل الدخول
              </button>
            )}
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              نظام فرز المتقدم للتوظيف &copy; {new Date().getFullYear()}
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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-white dark:border-slate-700 px-6 py-2.5 rounded-full text-sm font-bold text-primary mb-10 shadow-xl shadow-primary/5"
        >
          {" "}
          <Target size={16} /> ارتقِ بعمليات الموارد البشرية{" "}
        </motion.div>{" "}
        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-semibold mt-6 mb-8 lg:mb-10 leading-snug lg:leading-[1.4] text-navy dark:text-white tracking-tight text-center">
          {" "}
          فلتر آلاف المتقدمين في ثوانٍ، <br />{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-600 relative font-bold inline-block mt-2">
            {" "}
            واتخذ قرار التوظيف بثقة تامة{" "}
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
        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-14 max-w-3xl mx-auto leading-relaxed font-medium text-center">
          {" "}
          تخلص من الفرز اليدوي المرهق. منصة (فرز) تقرأ وتصنف السير الذاتية بمختلف صيغها، لتستخرج لك الكفاءات المطابقة لمعاييرك، مما يمنحك الوقت الكافي لاختيار الأنسب لثقافة شركتك.{" "}
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
              title: "محرك استخراج البيانات (Data Parsing)",
              desc: "تحويل السير الذاتية المعقدة بمختلف صيغها إلى بيانات منظمة وجداول جاهزة للتحليل في ثوانٍ.",
              icon: <FileText className="text-primary fill-primary/20" size={32} />,
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
        className="max-w-7xl mx-auto mb-40 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] p-16 md:p-24 relative overflow-hidden border border-slate-100 dark:border-slate-700"
      >
        {" "}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] dark:opacity-5" />{" "}
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6 leading-tight">الفرز اليدوي انتهى. لغة الأرقام تتحدث.</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium mb-16 max-w-3xl mx-auto">نظام (فرز) ليس مجرد أداة، بل هو ترقية كاملة لقسم الموارد البشرية لديك.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-10 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">3 ثوانٍ فقط</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">لتحليل السيرة واستخراج البيانات.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-10 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">99% دقة مطابقة</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">خوارزميات ترشح الكفاءات بدون تحيز.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-10 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase size={32} />
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">القضاء على الهدر</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">وفر ميزانيتك المهدرة في الفرز اليدوي.</p>
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
              انضم للشركات الرائدة التي تبني فرق عمل استثنائية بوقت وجهد أقل وبدقة متناهية.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <button onClick={onOpenBookingModal} className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-2xl text-lg font-bold hover:shadow-[0_10px_30px_rgba(13,148,136,0.3)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
              <Calendar size={22} /> احجز عرضاً توضيحياً
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
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-8">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Play size={32} className="text-slate-500 ml-2" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">شاهد كيف نعمل</h3>
                <p className="text-slate-400 text-lg text-center max-w-sm">(مساحة مخصصة لعرض فيديو توضيحي قصير أو صورة متحركة GIF مدتها 10-12 ثانية)</p>
              </div>{" "}
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
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-4 pl-12 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                dir="ltr"
                required
                minLength={6}
                placeholder="••••••••"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تأكيد كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pr-4 pl-12 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                dir="ltr"
                required
                minLength={6}
                placeholder="••••••••"
              />
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
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "حفظ كلمة المرور"}
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
  const [talentPool, setTalentPool] = useState<Applicant[]>([]);
  const [applicantSelectedRoleId, setApplicantSelectedRoleId] = useState<string | null>(null);
  const [selectedApplicantForDetails, setSelectedApplicantForDetails] = useState<Applicant | null>(null);
  const [userProfile, setUserProfile] = useState({
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
    cvs_processed_count: 0,
    fields_locked: false,
  });
  const [step, setStep] = useState<FlowStep>(() => {
    return window.location.pathname.startsWith("/apply/") ? "form" : "landing";
  });
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [dashboardTab, setDashboardTab] = useState("الرئيسية");
  const [dashboardPendingAction, setDashboardPendingAction] = useState<{ id: string, decision: string, isOffer?: boolean } | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("sahab_dark_mode") === "true";
  });
  const [showOnboardingGlobal, setShowOnboardingGlobal] = useState(false);
  const [globalPendingDraftId, setGlobalPendingDraftId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  useEffect(() => {
    localStorage.setItem("sahab_dark_mode", String(darkMode));
    if (window.location.pathname.startsWith("/apply/")) {
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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [clonedJob, setClonedJob] = useState<Job | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [previewJobState, setPreviewJobState] = useState<Job | null>(null);
  const [createJobType, setCreateJobType] = useState<"single" | "campaign" | "quick_link">(
    "single",
  );
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
        if (data && !error) {
          const mappedDbJobs: Job[] = data.map((raw: any) => ({
            id: raw.id,
            company_id: raw.company_id,
            title: raw.title,
            recordType: raw.record_type || 'single',
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
            directUpload: raw.direct_upload || false,
            roles: Array.isArray(raw.roles) ? raw.roles : []
          }));

          setJobs(prevJobs => {
            const drafts = prevJobs.filter(j => j.status === "مسودة" && !mappedDbJobs.find(dbj => dbj.id === j.id));
            return [...drafts, ...mappedDbJobs];
          });
        }
      } catch (err) {
        console.warn("Failed to fetch jobs from Supabase", err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session && !window.location.pathname.startsWith('/apply/')) {
        // Restore last tab from sessionStorage (Deep Linking)
        const savedTab = sessionStorage.getItem('sahab_last_tab');
        if (savedTab) {
          setDashboardTab(savedTab);
          sessionStorage.removeItem('sahab_last_tab');
        }
        setStep("dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Supabase Auth Event:", _event);
      setSession(session);
      setUser(session?.user || null);
      
      if (_event === 'PASSWORD_RECOVERY') {
        setStep("updatePassword");
      } else if (_event === 'TOKEN_REFRESHED' || _event === 'SIGNED_IN') {
        if (session && !window.location.pathname.startsWith('/apply/')) {
          // Restore saved tab on re-login after session timeout
          const savedTab = sessionStorage.getItem('sahab_last_tab');
          if (savedTab) {
            setDashboardTab(savedTab);
            sessionStorage.removeItem('sahab_last_tab');
          }
          setStep(prevStep => {
            if (prevStep === "updatePassword") return "updatePassword";
            if (["landing", "login", "registerCompany"].includes(prevStep)) return "dashboard";
            return prevStep;
          });
        }
      } else if (session && !window.location.pathname.startsWith('/apply/')) {
        setStep(prevStep => {
          if (prevStep === "updatePassword") return "updatePassword";
          if (["landing", "login", "registerCompany"].includes(prevStep)) return "dashboard";
          return prevStep;
        });
      } else if (!session && !window.location.pathname.startsWith('/apply/')) {
        if (_event === 'SIGNED_OUT') {
          // Save current tab before logout for session timeout scenarios
          setDashboardTab(prev => {
            sessionStorage.setItem('sahab_last_tab', prev);
            return prev;
          });
          setStep("landing");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.id) {
      const fetchCompanyProfile = async () => {
        try {
          const { data, error } = await supabase.from('companies').select('*').eq('id', user.id).single();
          if (data && !error) {
            const isProfileComplete = !!(data.company_name && data.city);
            setUserProfile(prev => ({
              ...prev,
              name: user.user_metadata?.full_name || prev.name,
              title: user.user_metadata?.job_title || prev.title,
              companyName: data.company_name || prev.name,
              entityType: data.entity_type || prev.entityType,
              commercialRegistration: data.commercial_registration || prev.commercialRegistration,
              freelanceDocument: data.freelance_document || prev.freelanceDocument,
              taxNumber: data.tax_number || prev.taxNumber,
              city: data.city || prev.city,
              companyLogo: data.company_logo || prev.companyLogo,
              subscription_tier: data.subscription_plan || "free",
              subscription_end_date: data.subscription_end_date || prev.subscription_end_date,
              subscription_is_yearly: localStorage.getItem('subscription_is_yearly') === 'true',
              cvs_processed_count: data.cvs_processed_count || 0,
              fields_locked: data.fields_locked || false,
            }));
            // Force Settings tab if profile is incomplete
            if (!isProfileComplete) {
              setDashboardTab("الحساب");
            }
          }
        } catch (err) {
          console.error("Error fetching company profile:", err);
        }
      };
      fetchCompanyProfile();
    }
  }, [user]);

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
                roles: Array.isArray(data.roles) ? data.roles : []
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
             alert("عذراً! لم يتم العثور على الوظيفة في قاعدة البيانات. \nالسبب إما أن الوظيفة قديمة ولم تُحفظ بنجاح، أو أن إعدادات (RLS) في Supabase تمنع الزوار من قراءة الوظائف.");
             setStep('landing');
         }
      };
      
      fetchJobDirectly();
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
    if (resolvedStatus !== "مسودة") {
      try {
        const actualCompanyId = session?.user?.id || "00000000-0000-0000-0000-000000000000";
        const jobForDB = {
          id: newJob.id,
          company_id: actualCompanyId,
          title: newJob.title,
          record_type: newJob.recordType || 'single',
          department: newJob.department,
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
          roles: newJob.roles || []
        };
        const { error } = await supabase.from('jobs').insert([jobForDB]);
        if (error) {
          console.error("Supabase Error saving job:", error);
          alert("فشل حفظ الوظيفة في قاعدة البيانات، يرجى المحاولة مرة أخرى: " + error.message);
        }
      } catch (err: any) {
        console.error("Could not sync job to Supabase:", err);
        alert("فشل الاتصال بقاعدة البيانات. يرجى التحقق من اتصالك والمحاولة مجدداً.");
      }
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
    const activeCount = jobs.filter(j => j.status === 'نشط' || j.status === 'مسودة').length;
    let limit = 0;
    if (userProfile.subscription_tier === 'one-time') limit = 1;
    else if (userProfile.subscription_tier === 'growth') limit = 3;
    else if (userProfile.subscription_tier === 'business') limit = 10;
    else if (userProfile.subscription_tier === 'enterprise') limit = Infinity;
    
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

            {step === "dashboard" && (
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
                    localStorage.setItem("sahab_jobs_db_v1", JSON.stringify(newJobs));
                    return newJobs;
                  });
                }}
                onDeleteAllDrafts={() => {
                  setJobs(prev => prev.filter(j => j.status !== "مسودة"));
                }}
                pendingAction={dashboardPendingAction}
                clearPendingAction={() => setDashboardPendingAction(null)}
              />
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
                onStatusUpdate={(id, decision, isOffer) => setDashboardPendingAction({ id, decision, isOffer })}
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
                onApply={() => setStep("form")}
              />
            )}
            {step === "form" && selectedJob && (
              <JobApplication
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
      <BookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </div>
  );
}
