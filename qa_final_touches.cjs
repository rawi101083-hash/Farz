const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add timeout state and logic to ApplicantDetails
const targetDetailsHook = `  const [activeTab, setActiveTab] = useState<"analysis" | "audio" | "questions">("analysis");
  const [n8nAnalysis, setN8nAnalysis] = useState<any>(null);

  useEffect(() => {
    // Poll for the n8n JSON result from local storage
    const interval = setInterval(() => {
      const dataStr = window.localStorage.getItem('mock_n8n_response');
      if (dataStr) {
        try {
          setN8nAnalysis(JSON.parse(dataStr));
          clearInterval(interval);
        } catch(e){}
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);`;

const replaceDetailsHook = `  const [activeTab, setActiveTab] = useState<"analysis" | "audio" | "questions">("analysis");
  const [n8nAnalysis, setN8nAnalysis] = useState<any>(null);
  const [isAnalysisTimeout, setIsAnalysisTimeout] = useState(false);

  useEffect(() => {
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 2000;
      if (elapsed > 45000) {
        setIsAnalysisTimeout(true);
        clearInterval(interval);
        return;
      }
      const dataStr = window.localStorage.getItem('mock_n8n_response');
      if (dataStr) {
        try {
          const parsed = JSON.parse(dataStr);
          if (parsed && parsed.match_percentage !== undefined) {
             setN8nAnalysis(parsed);
             clearInterval(interval);
          }
        } catch(e){}
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);`;

c = c.replace(targetDetailsHook, replaceDetailsHook);

// 2. Add Timeout UI to ApplicantDetails
const targetLoadingUI = `{!n8nAnalysis ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700">
                      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                      <p className="text-primary font-bold text-lg animate-pulse">جاري تحليل البيانات بواسطة الذكاء الاصطناعي...</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">يعمل محرك الفرز على تدقيق السيرة الذاتية واستخراج التوصيات.</p>
                    </div>
                  ) : (`;

const replaceLoadingUI = `{!n8nAnalysis ? (
                    isAnalysisTimeout ? (
                      <div className="flex flex-col items-center justify-center p-12 bg-rose-50 dark:bg-rose-900/10 rounded-[32px] border border-rose-100 dark:border-rose-800/30">
                        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-800/50 rounded-full flex items-center justify-center mb-4 text-rose-500">
                           <AlertTriangle size={32} />
                        </div>
                        <p className="text-rose-600 dark:text-rose-400 font-bold text-lg text-center">
                          ⚠️ فشل الاتصال بمحرك التحليل.
                        </p>
                        <p className="text-sm text-rose-500/80 dark:text-rose-500 mt-2 text-center font-medium">
                          يرجى قراءة السيرة الذاتية يدوياً من المرفقات.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700">
                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                        <p className="text-primary font-bold text-lg animate-pulse">جاري تحليل البيانات بواسطة الذكاء الاصطناعي...</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">يعمل محرك الفرز على تدقيق السيرة الذاتية واستخراج التوصيات.</p>
                      </div>
                    )
                  ) : (`;

c = c.replace(targetLoadingUI, replaceLoadingUI);


// 3. Clear cv_text memory leak
const targetClearCV = `    setFormStep("success");
    setIsSubmitting(false);

    // Background fetch to n8n`;

const replaceClearCV = `    setFormStep("success");
    setIsSubmitting(false);
    
    // Memory Leak Protection: Clear the CV text string from state immediately
    setExtractedCvText("");

    // Background fetch to n8n`;

c = c.replace(targetClearCV, replaceClearCV);

fs.writeFileSync('src/App.tsx', c);
console.log("Memory leak and timeout fixed.");
