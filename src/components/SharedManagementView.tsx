import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Job, Applicant, ImageLightbox, EmptyState } from "../Shared";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Search, FileText, X, Phone, Mail, Building2, Save, Sparkles, Database } from "lucide-react";
import ApplicantDetails from "./ApplicantDetails";

export const SharedManagementView = ({ jobId }: { jobId: string }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch Job
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (jobData && !jobError) {
          const mappedJob: Job = {
            id: jobData.id,
            company_id: jobData.company_id,
            title: jobData.title,
            recordType: jobData.record_type || 'single',
            company: jobData.department || jobData.company_name || "",
            department: jobData.department || "",
            location: jobData.location || "",
            type: jobData.type || "",
            types: Array.isArray(jobData.types) ? jobData.types : [],
            experience: jobData.experience_level || "",
            qualification: jobData.qualification || "",
            description: jobData.description || "",
            responsibilities: jobData.responsibilities || "",
            status: jobData.status || "نشط",
            createdAt: jobData.created_at ? jobData.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            applicants: 0,
            roles: Array.isArray(jobData.roles) ? jobData.roles : []
          };
          setJob(mappedJob);
        }

        // Fetch Applicants
        const { data: appData, error: appError } = await supabase
          .from('applicants')
          .select('*')
          .eq('job_id', jobId)
          .neq('decision', 'CORRUPT_FILE_DO_NOT_SHOW')
          .order('created_at', { ascending: false });

        if (appData && !appError) {
          const mappedList: Applicant[] = appData
            .map((raw: any) => {
              const parsedAnswers = Array.isArray(raw.custom_answers) ? raw.custom_answers : [];
              return {
                id: raw.id,
                name: raw.full_name || "متقدم جديد",
                job: raw.job_title || jobData?.title || "طلب غير محدد",
                rating: raw.match_score || raw.match_percentage || 0,
                status: parsedAnswers.find((a: any) => a.question === "مدة الانضمام / الجاهزية للعمل")?.answer || raw.availability || raw.status || "غير محدد",
            phone: raw.phone || "",
            email: raw.email || "",
            skills: Array.isArray(raw.skills) ? raw.skills : [],
            aiSummary: raw.ai_justification || "قيد التحليل...",
            cv_file_url: raw.cv_file_url,
            hr_notes: raw.hr_notes || "",
            attachments: raw.attachments,
            education_match: raw.education_match || 0,
            experience_match: raw.experience_match || 0,
            skills_match: raw.skills_match || 0,
            top_strengths: raw.strengths || raw.top_strengths,
            top_weaknesses: raw.weaknesses || raw.top_weaknesses,
            customAnswers: parsedAnswers,
            linkedin: (parsedAnswers.find((a: any) => a.question === "رابط لينكد إن")?.answer) || raw.linkedin || ""
          } as any});
          
          setApplicants(mappedList);
        }
      } catch (err) {
        console.error("Error fetching shared data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const visibleApplicants = applicants.filter(a => {
    const searchLower = searchQuery.toLowerCase().trim();
    if (!searchLower) return true;
    return (
      (a.name && a.name.toLowerCase().includes(searchLower)) ||
      (a.phone && a.phone.includes(searchLower)) ||
      (a.email && a.email.toLowerCase().includes(searchLower))
    );
  }).sort((a, b) => Number(b.rating) - Number(a.rating));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-bold text-navy dark:text-white mb-2">جاري جلب بيانات المرشحين...</h3>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8">
        <h3 className="text-xl font-bold text-red-600 mb-2">عذراً، الوظيفة غير موجودة أو تم حذفها.</h3>
        <p className="text-slate-500">يرجى التأكد من صحة الرابط.</p>
      </div>
    );
  }

  if (selectedApplicant) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ApplicantDetails
            applicant={selectedApplicant}
            job={job}
            onBack={() => {
              setSelectedApplicant(null);
              // Refresh applicants if needed
              setApplicants(prev => [...prev]);
            }}
            isSharedView={true}
            onStatusUpdate={(id, decision) => {
              // Provide an empty stub for onStatusUpdate since actions are hidden
              // but the component might still need the prop to exist.
            }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 font-cairo" dir="rtl">
      {lightboxPhoto && (
        <ImageLightbox image={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-navy dark:text-white mb-3 tracking-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> {job.company || "جهة غير محددة"}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span> {job.location || "عن بعد"}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> إجمالي المرشحين: {applicants.length}</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="ابحث باسم المتقدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-3 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-navy dark:text-white placeholder:font-medium"
            />
          </div>
        </div>

        {/* Table Container */}
        {(() => {
          const isHomeMockState = applicants.length === 0 && !searchQuery;
          return (
            <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              {isHomeMockState && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/10 dark:bg-slate-900/50 backdrop-blur-[6px] px-4">
                  <div className="pointer-events-auto w-full max-w-xl">
                    <EmptyState
                      title="بنك الكفاءات بانتظارك! لم تقم بإضافة أي مرشحين حتى الآن."
                      actionLabel="العودة لإدارة الوظائف"
                      onAction={() => window.history.back()}
                      icon={<Database size={32} className="text-emerald-400 drop-shadow-md" />}
                      className="bg-white/95 dark:bg-slate-800/95 shadow-2xl border-white/50"
                    />
                  </div>
                </div>
              )}
              <div className="overflow-x-auto min-h-[50vh] p-1">
                <table className={`w-full text-right border-collapse transition-all ${isHomeMockState ? 'filter blur-[5px] opacity-60 pointer-events-none select-none' : ''}`}>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-200 text-xs uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-5 font-bold text-navy dark:text-white text-right whitespace-nowrap rounded-tr-2xl">اسم المتقدم</th>
                      <th className="px-6 py-5 font-bold text-navy dark:text-white text-right whitespace-nowrap">التقييم الآلي</th>
                      <th className="px-6 py-5 font-bold text-navy dark:text-white text-right whitespace-nowrap">الجاهزية</th>
                      <th className="px-6 py-5 font-bold text-navy dark:text-white text-center whitespace-nowrap rounded-tl-2xl">ملف المرشح</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isHomeMockState ? (
                      <>
                        {[1, 2, 3, 4, 5, 6].map((_, i) => (
                          <tr key={i} className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[14px] bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <div className="w-16 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                              </div>
                            </td>
                            <td className="px-6 py-4"><div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td>
                            <td className="px-6 py-4"><div className="w-24 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl mx-auto animate-pulse"></div></td>
                          </tr>
                        ))}
                      </>
                    ) : visibleApplicants.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner">
                              <Search size={32} className="text-slate-300 dark:text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-navy dark:text-white mb-2">لا يوجد مرشحين</h3>
                            <p className="text-slate-500 font-medium">لم يتم العثور على أي مرشح مطابق لبحثك.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                  <AnimatePresence>
                    {visibleApplicants.map((app) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={app.id} 
                        onClick={() => setSelectedApplicant(app)} 
                        className="transition-colors group hover:bg-slate-50 dark:bg-slate-800/80 cursor-pointer border-b border-slate-100 dark:border-slate-700/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 whitespace-nowrap">
                            <div
                              onClick={(e) => {
                                if ((app as any).photoUrl) {
                                  e.stopPropagation();
                                  setLightboxPhoto((app as any).photoUrl);
                                }
                              }}
                              className={`w-10 h-10 rounded-[14px] bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-200 shadow-inner-3d transition-colors overflow-hidden ${(app as any).photoUrl ? "cursor-pointer hover:opacity-80" : "group-hover:text-primary dark:group-hover:text-primary group-hover:bg-primary/10 dark:group-hover:bg-primary/20"}`}
                            >
                              {(app as any).photoUrl ? (
                                <img src={(app as any).photoUrl} alt={app.name} className="w-full h-full object-cover" />
                              ) : (
                                app.name.charAt(0)
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-navy dark:text-white text-base">
                                {app.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-start gap-1.5 whitespace-nowrap">
                            <div className={`w-16 h-2.5 rounded-full overflow-hidden ${Number(app.rating) >= 80 ? "bg-teal-50 dark:bg-teal-900/30 shadow-inner-3d" : Number(app.rating) >= 50 ? "bg-amber-50 dark:bg-amber-900/30 shadow-inner-3d" : "bg-rose-50 dark:bg-rose-900/30 shadow-inner-3d"}`}>
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${Number(app.rating) >= 80 ? "bg-teal-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" : Number(app.rating) >= 50 ? "bg-amber-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" : "bg-rose-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"}`}
                                style={{ width: `${app.rating}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${Number(app.rating) >= 80 ? "text-teal-600 dark:text-teal-400" : Number(app.rating) >= 50 ? "text-amber-600 dark:text-amber-500" : "text-rose-600 dark:text-rose-500"}`}>
                              {app.rating}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">
                          {app.status}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center w-full">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedApplicant(app); }}
                              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:border-primary/50 dark:hover:border-primary/50 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 group-hover:-translate-y-0.5 group-hover:shadow-md"
                            >
                              <FileText size={14} /> عرض الملف
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
        );
        })()}
      </div>
    </div>
  );
};
