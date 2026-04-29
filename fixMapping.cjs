const fs = require('fs');
let lines = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8').split('\n');
const start = lines.findIndex(l => l.includes('const { data, error } = await supabase'));
const end = lines.findIndex(l => l.includes('setApplicantsState(prev => JSON.stringify(prev) !== JSON.stringify(combinedList) ? combinedList : prev);'));

if (start !== -1 && end !== -1) {
  const newBlock = `        const { data, error } = await supabase
          .from('applicants')
          .select('*')
          .order('created_at', { ascending: false });

        // 2. Read decisions AFTER the async query, preventing async race condition wipes!
        const latestDecisions = window.localStorage ? JSON.parse(window.localStorage.getItem("sahab_decisions") || "{}") : {};

        if (!error && data) {
          mappedList = data.map((raw: any) => {
            let actualJobTitle = "طلب غير محدد";
            const matchedJob = jobs.find(j => j.id === raw.job_id);
            if (matchedJob) {
              if (matchedJob.recordType === 'campaign' && raw.role_index !== undefined) {
                actualJobTitle = matchedJob.roles?.[raw.role_index]?.title || matchedJob.title || "طلب غير محدد";
              } else {
                actualJobTitle = matchedJob.title || "طلب غير محدد";
              }
            }

            return {
              id: raw.id,
              name: raw.full_name || "متقدم جديد",
              job: actualJobTitle,
              rating: raw.match_score || raw.match_percentage || 0,
              status: "فوري",
              color: "emerald",
              phone: raw.phone || "0500000000",
              email: raw.email || "applicant@example.com",
              skills: Array.isArray(raw.skills) ? raw.skills : [],
              aiSummary: raw.ai_justification || "قيد التحليل أو تعذر الاستخراج...",
              voiceEval: "",
              voiceEvalUrl: raw.voice_eval_url || "",
              customAnswers: [],
              decision: latestDecisions[raw.id] || "pending",
              expectedSalary: "",
              cv_file_url: raw.cv_file_url,
              top_strengths: Array.isArray(raw.strengths) ? raw.strengths : Array.isArray(raw.top_strengths) ? raw.top_strengths : [],
              top_weaknesses: Array.isArray(raw.weaknesses) ? raw.weaknesses : Array.isArray(raw.top_weaknesses) ? raw.top_weaknesses : []
            };
          });
        }

        const combinedList = [...mappedList].map(app => ({
          ...app,
          decision: latestDecisions[app.id] || app.decision || "pending"
        }));
        
        setApplicantsState(prev => JSON.stringify(prev) !== JSON.stringify(combinedList) ? combinedList : prev);`;

  lines.splice(start, end - start + 1, newBlock);
  fs.writeFileSync('src/components/Dashboard.tsx', lines.join('\n'));
  console.log('Fixed successfully');
} else {
  console.log('Indexes not found', start, end);
}
