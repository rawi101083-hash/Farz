const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Interface update
const intfTarget = `interface Applicant {
  id: string;`;
const intfReplace = `interface Applicant {
  id: string;
  cv_text?: string;
  top_strengths?: string[];
  top_weaknesses?: string[];`;
c = c.replace(intfTarget, intfReplace);

// 2. Dashboard prop types
const propTarget1 = `onViewDetails: () => void;`;
const propReplace1 = `onViewDetails: (app: Applicant) => void;`;
c = c.replaceAll(propTarget1, propReplace1);

const propTarget2 = `onViewDetails={onViewDetails}`;
const propReplace2 = `onViewDetails={() => onViewDetails(row)}`;
// We have to be careful with exact lines in DashboardTab and ManageJob
// Actually, let's just use regex or targeted replace for onViewDetails

// Let's find exactly where onViewDetails is passed in App.tsx
if (c.includes(`onViewDetails={() => setStep("applicantDetails")}`)) {
  c = c.replace(`onViewDetails={() => setStep("applicantDetails")}`, `onViewDetails={(app) => { setViewedApplicant(app); setStep("applicantDetails"); }}`);
}

// Add state in App
if (!c.includes('const [viewedApplicant, setViewedApplicant]')) {
  c = c.replace(`const [step, setStep] = useState<FlowStep>("landing");`, `const [step, setStep] = useState<FlowStep>("landing");\n  const [viewedApplicant, setViewedApplicant] = useState<Applicant | null>(null);`);
}

// Applicant Details
const compTarget = `const ApplicantDetails = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<"analysis" | "audio" | "questions">("analysis");
  
  // Simulated candidate data for conditional rendering of contact info
  const candidate = {
    linkedin: "https://linkedin.com/in/ahmed",
    expectedSalary: "6000 - 8000",
    whatsapp: "966500000000",
    email: "ahmed@example.com",
    phone: "966500000000"
  };`;
const compReplace = `const ApplicantDetails = ({ onBack, candidate }: { onBack: () => void, candidate: Applicant }) => {
  const [activeTab, setActiveTab] = useState<"analysis" | "cv" | "audio" | "questions">("analysis");`;
c = c.replace(compTarget, compReplace);

// Inject prop in App render
c = c.replace(`<ApplicantDetails onBack={() => setStep("dashboard")} />`, `<ApplicantDetails onBack={() => setStep("dashboard")} candidate={viewedApplicant as Applicant} />`);

// Applicant Details Tabs rendering
const tabsTarget = `<button
                  onClick={() => setActiveTab("analysis")}
                  className={\`min-w-[120px] flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap \${activeTab === "analysis" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}\`}
                >
                  المطابقة والتحليل
                </button>
                <button
                  onClick={() => setActiveTab("audio")}`;
const tabsReplace = `<button
                  onClick={() => setActiveTab("analysis")}
                  className={\`min-w-[120px] flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap \${activeTab === "analysis" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}\`}
                >
                  المطابقة والتحليل
                </button>
                <button
                  onClick={() => setActiveTab("cv")}
                  className={\`min-w-[120px] flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap \${activeTab === "cv" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}\`}
                >
                  النص الأصلي للسيرة
                </button>
                <button
                  onClick={() => setActiveTab("audio")}`;
c = c.replace(tabsTarget, tabsReplace);

// Applicant Details content updates
const contentTarget = `<div className="bg-[#F0FDF4] dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 p-6 rounded-[32px]">
                       <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                         <CheckCircle size={18} /> أبرز نقاط القوة
                       </h4>
                       <ul className="space-y-2">
                         <li className="flex gap-2 text-sm text-green-800 dark:text-green-300/90 leading-relaxed font-bold">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                           خبرة متقدمة في تطوير تطبيقات الويب باستخدام React, Node.js, TypeScript, و AWS
                         </li>
                         <li className="flex gap-2 text-sm text-green-800 dark:text-green-300/90 leading-relaxed font-bold">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                           قدرات قيادية مثبتة في إدارة الفرق وتسليم المشاريع التقنية
                         </li>
                       </ul>
                    </div>

                    <div className="bg-[#FFF7ED] dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 p-6 rounded-[32px]">
                       <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                         <Zap size={18} /> فجوات ونقاط الانتباه
                       </h4>
                       <ul className="space-y-2">
                         <li className="flex gap-2 text-sm text-orange-800 dark:text-orange-300/90 leading-relaxed font-bold">
                           <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                           غير واضح مستوى إتقانه لتصميم قواعد البيانات NoSQL بحسب السيرة الذاتية
                         </li>
                         <li className="flex gap-2 text-sm text-orange-800 dark:text-orange-300/90 leading-relaxed font-bold">
                           <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                           قد يطالب براتب يتخطى ميزانية الوظيفة بناءً على سنوات خبرته
                         </li>
                       </ul>
                    </div>`;

const contentReplace = `<div className="bg-[#F0FDF4] dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 p-6 rounded-[32px]">
                       <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                         <CheckCircle size={18} /> أبرز نقاط القوة
                       </h4>
                       <ul className="space-y-2">
                         {candidate?.top_strengths?.map((str, i) => (
                           <li key={i} className="flex gap-2 text-sm text-green-800 dark:text-green-300/90 leading-relaxed font-bold">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                             {str}
                           </li>
                         ))}
                       </ul>
                    </div>

                    <div className="bg-[#FFF7ED] dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 p-6 rounded-[32px]">
                       <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                         <Zap size={18} /> فجوات ونقاط الانتباه
                       </h4>
                       <ul className="space-y-2">
                         {candidate?.top_weaknesses?.map((wk, i) => (
                           <li key={i} className="flex gap-2 text-sm text-orange-800 dark:text-orange-300/90 leading-relaxed font-bold">
                             <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                             {wk}
                           </li>
                         ))}
                       </ul>
                    </div>`;
c = c.replace(contentTarget, contentReplace);

const tabCVTarget = `{activeTab === "audio" && (`;
const tabCVReplace = `{activeTab === "cv" && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 whitespace-pre-wrap font-medium text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {candidate?.cv_text || "تعذر استخراج النص الخاص بالسيرة الذاتية."}
                  </div>
                </motion.div>
              )}
              {activeTab === "audio" && (`;
c = c.replace(tabCVTarget, tabCVReplace);

// Remove mock "candidate" properties scattered in ApplicantDetails
c = c.replace(`{candidate?.expectedSalary && (`, `{candidate.expectedSalary && (`);
c = c.replace(`({candidate?.expectedSalary})`, `({candidate.expectedSalary})`);
c = c.replaceAll(`{candidate.whatsapp}`, `{candidate.phone}`);
c = c.replace(`أحمد علي`, `{candidate.name}`);
c = c.replace(`مهندس برمجيات أول</p>`, `{candidate.job}</p>`);
c = c.replace(`يُظهر المتقدم قدرات تقنية وقيادية قوية في تطوير البرمجيات. لزيادة دقة القرار، ينصح بالتركيز في المقابلة على خبرة الواجهات الخلفية وطلب أمثلة عملية حول نتائج المشاريع التي تفاعل معها بشكل مباشر.`, `{candidate.aiSummary}`);
c = c.replace(`90%`, `{candidate.rating}%`);
c = c.replace(`1 - 0.9`, `1 - (candidate.rating / 100)`);
c = c.replaceAll(`https://linkedin.com/in/ahmed`, `https://linkedin.com/in/`);

fs.writeFileSync('src/App.tsx', c);
console.log("App Details wired!");
