import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Job, Applicant, ImageLightbox } from "../Shared";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Search, FileText, X, Phone, Mail, Building2, Save, Sparkles } from "lucide-react";

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
          .order('created_at', { ascending: false });

        if (appData && !appError) {
          const mappedList: Applicant[] = appData
            .filter((raw: any) => !raw.decision || raw.decision === "pending")
            .map((raw: any) => ({
            id: raw.id,
            name: raw.full_name || "متقدم جديد",
            job: raw.job_title || jobData?.title || "طلب غير محدد",
            rating: raw.match_score || raw.match_percentage || 0,
            status: raw.availability || raw.status || "غير محدد",
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
          } as any));
          
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
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto min-h-[50vh] p-1">
            <table className="w-full text-right border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300 text-xs uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-5 font-bold text-navy dark:text-white text-right whitespace-nowrap rounded-tr-2xl">اسم المتقدم</th>
                  <th className="px-6 py-5 font-bold text-navy dark:text-white text-right whitespace-nowrap">التقييم الآلي</th>
                  <th className="px-6 py-5 font-bold text-navy dark:text-white text-right whitespace-nowrap">الجاهزية</th>
                  <th className="px-6 py-5 font-bold text-navy dark:text-white text-center whitespace-nowrap rounded-tl-2xl">ملف المرشح</th>
                </tr>
              </thead>
              <tbody>
                {visibleApplicants.length === 0 ? (
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
                  visibleApplicants.map((app) => (
                    <tr key={app.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-navy dark:text-white text-base truncate max-w-[200px]">
                          {app.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${Number(app.rating) >= 80 ? 'text-green-600' : Number(app.rating) >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                            {app.rating}%
                          </span>
                          <div className="flex-1 max-w-[100px] h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${Number(app.rating) >= 80 ? 'bg-green-500' : Number(app.rating) >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${app.rating}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-block px-3 py-1.5 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => setSelectedApplicant(app)}
                            className="px-5 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-navy dark:text-white hover:border-primary hover:text-primary transition-all flex items-center gap-2 shadow-sm"
                          >
                            <FileText size={16} /> عرض الملف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Applicant Details Modal (Read-Only) */}
      <AnimatePresence>
        {selectedApplicant && (
          <ApplicantDetailsModal 
            applicant={selectedApplicant} 
            onClose={() => {
              setSelectedApplicant(null);
              // Refresh applicants to get updated notes
              setApplicants(prev => [...prev]);
            }}
            setLightboxPhoto={setLightboxPhoto}
            onNotesUpdated={(notes) => {
              setApplicants(prev => prev.map(a => a.id === selectedApplicant.id ? { ...a, hr_notes: notes } : a));
              setSelectedApplicant(prev => prev ? { ...prev, hr_notes: notes } : null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ApplicantDetailsModal = ({ applicant, onClose, setLightboxPhoto, onNotesUpdated }: { applicant: Applicant; onClose: () => void; setLightboxPhoto: (url: string) => void; onNotesUpdated: (notes: string) => void }) => {
  const [activeTab, setActiveTab] = useState<"details" | "notes">("details");
  const [notes, setNotes] = useState(applicant.hr_notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('applicants')
        .update({ hr_notes: notes })
        .eq('id', applicant.id);
        
      if (!error) {
        setSaveMessage("تم حفظ الملاحظات بنجاح!");
        onNotesUpdated(notes);
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("حدث خطأ أثناء الحفظ.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-xl">
              {applicant.name?.charAt(0) || "م"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white">{applicant.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-500 font-medium">{applicant.job}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className={`text-sm font-bold ${Number(applicant.rating) >= 80 ? 'text-green-600' : 'text-amber-500'}`}>مُطابق بنسبة {applicant.rating}%</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-4 px-6 font-bold text-sm border-b-2 transition-colors ${activeTab === "details" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            تفاصيل المرشح
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`py-4 px-6 font-bold text-sm border-b-2 transition-colors ${activeTab === "notes" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            الملاحظات الإدارية
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {activeTab === "details" ? (
            <div className="space-y-8">
              {/* AI Summary */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/50">
                <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                  <Sparkles size={18} /> التوصية الآلية
                </h3>
                <p className="text-indigo-800/80 dark:text-indigo-200 leading-relaxed text-sm">
                  {applicant.aiSummary}
                </p>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">المهارات</h4>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills && applicant.skills.length > 0 ? applicant.skills.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium">
                        {s}
                      </span>
                    )) : <span className="text-slate-400 text-sm">لا توجد مهارات مسجلة</span>}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">التواصل</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Phone size={16} className="text-slate-400" /> <span dir="ltr">{applicant.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Mail size={16} className="text-slate-400" /> <span>{applicant.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">المرفقات</h4>
                <div className="flex flex-wrap gap-4">
                  {applicant.cv_file_url ? (
                    <a href={applicant.cv_file_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary transition-colors group">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-navy dark:text-white group-hover:text-primary transition-colors">السيرة الذاتية</p>
                        <p className="text-xs text-slate-500">PDF Document</p>
                      </div>
                    </a>
                  ) : <span className="text-slate-400 text-sm">لا توجد سيرة ذاتية مرفقة</span>}
                  
                  {applicant.attachments?.map((att: any, i: number) => (
                    <div key={i} onClick={() => setLightboxPhoto(att.url)} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary transition-colors group cursor-pointer">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-navy dark:text-white group-hover:text-primary transition-colors">مرفق إضافي {i+1}</p>
                        <p className="text-xs text-slate-500">Image / Document</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50 mb-6">
                <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">
                  هذه الملاحظات سرية وتظهر للإدارة فقط، ولن يتمكن المرشح من الإطلاع عليها.
                </p>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="اكتب ملاحظاتك عن المرشح هنا..."
                className="w-full h-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${saveMessage.includes('خطأ') ? 'text-red-500' : 'text-emerald-500'}`}>
                  {saveMessage}
                </span>
                <button
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-70"
                >
                  {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save size={18} /> حفظ الملاحظات</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
