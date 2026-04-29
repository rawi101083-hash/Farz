const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

const dashboardHookTarget = `  const [applicants, setApplicantsState] = useState<Applicant[]>(getApplicantsList());

  const setApplicants = (updater: any) => {
    setApplicantsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveApplicantsList(next);
      return next;
    });
  };

  useEffect(() => {
    const intv = setInterval(() => {
       const newList = getApplicantsList();
       setApplicantsState(prev => {
         if (JSON.stringify(prev) !== JSON.stringify(newList)) {
           return newList;
         }
         return prev;
       });
    }, 2000);
    return () => clearInterval(intv);
  }, []);`;

const dashboardHookReplace = `  const [applicants, setApplicantsState] = useState<Applicant[]>([]);

  const setApplicants = (updater: any) => {
    setApplicantsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data, error } = await supabase
          .from('applicants')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error || !data) return;
        
        const mappedList: Applicant[] = data.map((raw: any) => ({
           id: raw.id,
           name: raw.full_name || "متقدم جديد",
           job: jobs.find(j => j.id === raw.job_id)?.title || raw.job_id || "تدريب",
           rating: raw.match_percentage || 0,
           status: "فوري",
           color: "emerald",
           phone: raw.phone || "0500000000",
           email: raw.email || "applicant@example.com",
           skills: [],
           aiSummary: raw.ai_justification || "قيد التحليل أو تعذر الاستخراج...",
           voiceEval: "",
           customAnswers: [],
           decision: "pending",
           expectedSalary: "",
           cv_file_url: raw.cv_file_url,
           top_strengths: Array.isArray(raw.top_strengths) ? raw.top_strengths : [],
           top_weaknesses: Array.isArray(raw.top_weaknesses) ? raw.top_weaknesses : []
        }));
        
        setApplicantsState(prev => JSON.stringify(prev) !== JSON.stringify(mappedList) ? mappedList : prev);
      } catch (err) {}
    };

    fetchApplicants();
    const intv = setInterval(fetchApplicants, 5000);
    return () => clearInterval(intv);
  }, [jobs]);`;

c = c.replace(dashboardHookTarget, dashboardHookReplace);

// We need to also add support to view the PDF file inside ApplicantDetails. Wait, we have the CV Text tab:
// Let's replace the tab content target:
const cvTabTarget = `                <button
                  onClick={() => setActiveTab("cv")}
                  className={\`min-w-[120px] flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap \${activeTab === "cv" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}\`}
                >
                  النص الأصلي للسيرة
                </button>`;

const cvTabReplace = `                <button
                  onClick={() => setActiveTab("cv")}
                  className={\`min-w-[120px] flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap \${activeTab === "cv" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}\`}
                >
                  السيرة الذاتية (PDF)
                </button>`;

const cvTabContentTarget = `{activeTab === "cv" && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 whitespace-pre-wrap font-medium text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {candidate?.cv_text || "تعذر استخراج النص الخاص بالسيرة الذاتية."}
                  </div>
                </motion.div>
              )}`;

const cvTabContentReplace = `{activeTab === "cv" && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-6">
                  {candidate?.cv_file_url ? (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 h-[600px] overflow-hidden relative">
                      <iframe 
                        src={candidate.cv_file_url} 
                        className="w-full h-full border-0 absolute inset-0"
                        title="CV PDF Viewer"
                      />
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 text-center text-slate-500">
                      لا يوجد ملف PDF متاح لهذا المتقدم.
                    </div>
                  )}
                </motion.div>
              )}`;

c = c.replace(cvTabTarget, cvTabReplace);
c = c.replace(cvTabContentTarget, cvTabContentReplace);

fs.writeFileSync('src/App.tsx', c);
console.log("Dashboard Supabase integration complete!");
