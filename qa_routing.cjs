const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

const targetInit = `  const [step, setStep] = useState<FlowStep>("landing");
  const [viewedApplicant, setViewedApplicant] = useState<Applicant | null>(null);`;

const replaceInit = `
  // Router Interception Logic
  let initialStep: FlowStep = "landing";
  let applyJobTarget: Job | null = null;
  const initialPath = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') : "/";

  if (initialPath.startsWith('/apply/')) {
    const applyJobIdFromUrl = initialPath.split('/')[2];
    if (applyJobIdFromUrl) {
      initialStep = "publicJob"; // Will render the public applicant landing
      const savedJobsList = typeof localStorage !== 'undefined' ? localStorage.getItem("mock_jobs_db") : null;
      if (savedJobsList) {
         try {
           const parsedJobs = JSON.parse(savedJobsList);
           applyJobTarget = parsedJobs.find((j: any) => j.id === applyJobIdFromUrl) || null;
         } catch(e){}
      }
    }
  }

  const [step, setStep] = useState<FlowStep>(initialStep);
  const [selectedJob, setSelectedJob] = useState<Job | null>(applyJobTarget);
  const [viewedApplicant, setViewedApplicant] = useState<Applicant | null>(null);`;

c = c.replace(targetInit, replaceInit);

// I must remove the duplicate `const [selectedJob, setSelectedJob]` that is defined later.
const targetDupSelect = `  }, []);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [clonedJob, setClonedJob] = useState<Job | null>(null);`;

const replaceDupSelect = `  }, []);
  
  const [clonedJob, setClonedJob] = useState<Job | null>(null);`;

if(c.includes("  const [selectedJob, setSelectedJob] = useState<Job | null>(null);")) {
  c = c.replace(targetDupSelect, replaceDupSelect);
}

fs.writeFileSync('src/App.tsx', c);
console.log("Routing fixed!");
