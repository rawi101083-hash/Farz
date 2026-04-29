const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

const tStart = c.indexOf('const ApplicantDetails = ({ onBack }: { onBack: () => void }) => {');
if (tStart === -1) {
  console.log("Could not find start!");
  process.exit(1);
}
// We will replace up to the closing audio tag we know is there
const tEnd = c.indexOf('{activeTab === "audio" && (', tStart);
if (tEnd === -1) {
  console.log("Could not find end!");
  process.exit(1);
}

const originalBlock = c.substring(tStart, tEnd);

const newBlock = `const ApplicantDetails = ({ candidate, onBack }: { candidate: Applicant; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<"analysis" | "audio" | "questions" | "cv">("analysis");
  
  const getMatchColorClass = (rating: number) => {
    if (rating >= 80) return "text-green-500";
    if (rating >= 50) return "text-orange-500";
    return "text-red-500";
  };
  const colorClass = getMatchColorClass(candidate?.rating || 0);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8 pt-24 lg:pt-10">
      {" "}
      <div className="max-w-7xl mx-auto">
        {" "}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onBack(); }}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary font-bold mb-8 transition-colors group"
        >
          {" "}
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 flex items-center justify-center group-hover:border-primary transition-all">
            {" "}
            <ArrowLeft size={18} className="rotate-180" />{" "}
          </div>{" "}
          العودة للوحة التحكم{" "}
        </button>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {" "}
          {/* Right Column - AI Analysis & Audio (6 columns) */}{" "}
          <div className="lg:col-span-5 space-y-8 order-1 lg:order-2">
            {" "}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white dark:border-slate-700 relative overflow-hidden">
              {" "}
              <div className="absolute top-0 left-0 w-full h-2 bg-primary/20" />{" "}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <h2 className="text-4xl font-bold text-navy dark:text-white mb-2">
                      {candidate?.name || "متقدم"}
                    </h2>{" "}
                    <p className="text-primary font-bold text-lg">
                      {candidate?.job || "الوظيفة"}
                    </p>{" "}
                  </div>
                </div>{" "}
              <div className="flex flex-col items-center justify-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] mb-10 border border-slate-100 dark:border-slate-700">
                {" "}
                <div className="relative w-40 h-40 mb-6">
                  {" "}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {" "}
                    <circle
                      className="text-slate-200 stroke-current"
                      strokeWidth="8"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    />{" "}
                    <circle
                      className={\`\${colorClass} stroke-current\`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - ((candidate?.rating || 0) / 100))}
                    />{" "}
                  </svg>{" "}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {" "}
                    <span className="text-3xl font-bold text-navy dark:text-white">
                      {candidate?.rating || 0}%
                    </span>{" "}
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      مطابقة
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <p className="text-navy dark:text-white font-bold text-center px-4">
                  {(candidate?.rating || 0) >= 80 ? "توافق عالي جداً مع متطلبات الوظيفة" : (candidate?.rating || 0) >= 50 ? "توافق متوسط مع متطلبات الوظيفة" : "توافق ضعيف ومستبعد"}
                </p>{" "}
              </div>{" "}
              <div className="flex bg-slate-50 dark:bg-slate-800/30 p-1.5 rounded-2xl mb-8 border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("analysis")}
                  className={\`min-w-[120px] flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap \${activeTab === "analysis" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}\`}
                >
                  المطابقة والتحليل
                </button>
                <button
                  onClick={() => setActiveTab("audio")}
                  className={\`min-w-[120px] flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap \${activeTab === "audio" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}\`}
                >
                  الردود الصوتية
                </button>
                <button
                  onClick={() => setActiveTab("cv")}
                  className={\`min-w-[120px] flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap \${activeTab === "cv" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}\`}
                >
                  عرض السيرة
                </button>
              </div>

              {activeTab === "analysis" && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-6">
                  
                  {candidate?.expectedSalary && (
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                      <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">
                        💰 <span className="text-slate-500 dark:text-slate-400">الراتب المتوقع للمتقدم هو</span> ({candidate.expectedSalary})
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center gap-2">
                      <Sparkles size={20} className="text-primary" /> التوصية النهائية
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {candidate?.aiSummary || "لا توجد ملخصات نهائية."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#F0FDF4] dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 p-6 rounded-[32px]">
                       <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                         <CheckCircle size={18} /> أبرز نقاط القوة
                       </h4>
                       <ul className="space-y-2">
                         {(candidate?.top_strengths || []).length > 0 ? (candidate.top_strengths || []).map((str, idx) => (
                           <li key={idx} className="flex gap-2 text-sm text-green-800 dark:text-green-300/90 leading-relaxed font-bold">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                             {str}
                           </li>
                         )) : <li className="text-sm text-green-800/50">لا توجد تفاصيل</li>}
                       </ul>
                    </div>

                    <div className="bg-[#FFF7ED] dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 p-6 rounded-[32px]">
                       <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                         <Zap size={18} /> فجوات ونقاط الانتباه
                       </h4>
                       <ul className="space-y-2">
                         {(candidate?.top_weaknesses || []).length > 0 ? (candidate.top_weaknesses || []).map((str, idx) => (
                           <li key={idx} className="flex gap-2 text-sm text-orange-800 dark:text-orange-300/90 leading-relaxed font-bold">
                             <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                             {str}
                           </li>
                         )) : <li className="text-sm text-orange-800/50">لا توجد تفاصيل</li>}
                       </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "cv" && (
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
              )}
              
              `;

c = c.slice(0, tStart) + newBlock + c.slice(tEnd);

// Fix the instantiation
c = c.replace('<ApplicantDetails onBack={() => setStep("dashboard")} candidate={viewedApplicant as Applicant} />',
              '<ApplicantDetails onBack={() => setStep("dashboard")} candidate={viewedApplicant as Applicant} />');

fs.writeFileSync('src/App.tsx', c);
console.log("ApplicantDetails dynamic data successfully applied!");
