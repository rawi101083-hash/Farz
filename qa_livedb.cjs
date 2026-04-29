const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Rewrite mockApplicants array block entirely (Lines 8440 to 8522 approx) 
// The target is the entire array `const mockApplicants: Applicant[] = [...];`
const mockStartStr = 'const mockApplicants: Applicant[] = [';
const mockStartIdx = c.indexOf(mockStartStr);

let mockEndIdx = mockStartIdx;
let brackets = 0;
let initialized = false;

for (let i = mockStartIdx; i < c.length; i++) {
  if (c[i] === '[') { brackets++; initialized = true; }
  else if (c[i] === ']') { brackets--; }
  if (initialized && brackets === 0) {
    mockEndIdx = i + 1; // get past closing bracket ']'
    // let's skip the optional semicolon if it exists
    if (c[mockEndIdx] === ';') { mockEndIdx++; }
    break;
  }
}

const getApplicantsInjection = `const getApplicantsList = (): Applicant[] => {
  try {
    const dataStr = window.localStorage.getItem('applicantsList');
    if (dataStr) {
      return JSON.parse(dataStr);
    }
  } catch(e) {}
  return [];
};
const saveApplicantsList = (list: Applicant[]) => {
  window.localStorage.setItem('applicantsList', JSON.stringify(list));
};
const mockApplicants: Applicant[] = getApplicantsList();`;

if (mockStartIdx !== -1) {
  c = c.substring(0, mockStartIdx) + getApplicantsInjection + c.substring(mockEndIdx);
} else {
  console.log("Could not find mockApplicants");
}

// 2. Wrap setApplicants inside Dashboard to sync with localStorage and poll for new
let dashboardHookTarget = `  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);`;
let dashboardHookReplace = `  const [applicants, setApplicantsState] = useState<Applicant[]>(getApplicantsList());

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
c = c.replace(dashboardHookTarget, dashboardHookReplace);

// 3. Insert real-time saving logic to Webhook form success
// Inside target `window.localStorage.setItem('mock_n8n_response', JSON.stringify(data));`
const saveWebhookResponseTarget = `window.localStorage.setItem('mock_n8n_response', JSON.stringify(data));
       console.log("Background n8n AI Analysis completed.");`;

const saveWebhookResponseReplace = `window.localStorage.setItem('mock_n8n_response', JSON.stringify(data));
       console.log("Background n8n AI Analysis completed.");
       
       // push new applicant live
       try {
          const listStr = window.localStorage.getItem('applicantsList');
          const list = listStr ? JSON.parse(listStr) : [];
          list.push({
            id: 'app_' + Date.now(),
            name: n8nPayload.applicant_name || "متقدم جديد",
            job: n8nPayload.jobTitle || "تدريب",
            rating: data.match_percentage || 0,
            status: "فوري",
            color: "teal",
            aiSummary: data.ai_justification || "",
            skills: n8nPayload.targetSkills || [],
            decision: "pending",
            voiceEval: "",
            phone: submitData.phone || "0500000000",
            email: submitData.email || "applicant@example.com",
            customAnswers: [],
            expectedSalary: submitData.expectedSalary || ""
          });
          window.localStorage.setItem('applicantsList', JSON.stringify(list));
       } catch(e) {}`;

// Since there is a catch block as well with fallbackData, let's inject it there too
const saveFallbackResponseTarget = `window.localStorage.setItem('mock_n8n_response', JSON.stringify(fallbackData));`;

const saveFallbackResponseReplace = `window.localStorage.setItem('mock_n8n_response', JSON.stringify(fallbackData));
       // push new applicant live
       try {
          const listStr = window.localStorage.getItem('applicantsList');
          const list = listStr ? JSON.parse(listStr) : [];
          list.push({
            id: 'app_' + Date.now(),
            name: n8nPayload.applicant_name || "متقدم جديد",
            job: n8nPayload.jobTitle || "تدريب",
            rating: fallbackData.match_percentage || 0,
            status: "فوري",
            color: "teal",
            aiSummary: fallbackData.ai_justification || "",
            skills: n8nPayload.targetSkills || [],
            decision: "pending",
            voiceEval: "",
            phone: submitData.phone || "0500000000",
            email: submitData.email || "applicant@example.com",
            customAnswers: [],
            expectedSalary: submitData.expectedSalary || ""
          });
          window.localStorage.setItem('applicantsList', JSON.stringify(list));
       } catch(e) {}`;

c = c.replace(saveWebhookResponseTarget, saveWebhookResponseReplace);
c = c.replace(saveFallbackResponseTarget, saveFallbackResponseReplace);

fs.writeFileSync('src/App.tsx', c);
console.log("Memory DB integrated.");
