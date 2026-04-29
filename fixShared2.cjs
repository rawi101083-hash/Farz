const fs = require('fs');
let content = fs.readFileSync('src/Shared.tsx', 'utf-8');

// 1. Add externalApplicants to destructuring
content = content.replace(
  '  onViewDetails,\r\n  talentPool,\r\n  onCrossNominate,\r\n}: {',
  '  onViewDetails,\r\n  talentPool,\r\n  onCrossNominate,\r\n  externalApplicants,\r\n}: {'
);

// 2. Add externalApplicants to types
content = content.replace(
  '  talentPool: Applicant[];\r\n  onCrossNominate?: (applicant: Applicant) => void;\r\n}) => {',
  '  talentPool: Applicant[];\r\n  externalApplicants?: Applicant[];\r\n  onCrossNominate?: (applicant: Applicant) => void;\r\n}) => {'
);

// 3. Update the applicants merge logic
const replacementLogic = `  const allPlatformApplicants = [...talentPool];

  // 1. Add from local mock jobs if they are shortlisted
  jobs.forEach(job => {
    if (job.applicantsList) {
      job.applicantsList.forEach(app => {
        if (shortlistedIds.includes(app.id)) {
          if (!allPlatformApplicants.find(t => t.id === app.id)) {
            allPlatformApplicants.push({ ...app, job: job.title || "غير محدد" });
          }
        }
      });
    }
  });

  // 2. Add from external Supabase applicants if they are shortlisted
  if (externalApplicants) {
    externalApplicants.forEach(app => {
      if (shortlistedIds.includes(app.id)) {
        if (!allPlatformApplicants.find(t => t.id === app.id)) {
          allPlatformApplicants.push({ ...app, job: app.job || "غير محدد" });
        }
      }
    });
  }`;

content = content.replace(
  /  const allPlatformApplicants = \[\.\.\.talentPool\];\s+jobs\.forEach\(job => \{\s+if \(job\.applicantsList\) \{\s+job\.applicantsList\.forEach\(app => \{\s+if \(!allPlatformApplicants\.find\(t => t\.id === app\.id\)\) \{\s+allPlatformApplicants\.push\(app\);\s+\}\s+\}\);\s+\}\s+\}\);/,
  replacementLogic
);

fs.writeFileSync('src/Shared.tsx', content);
console.log('Modified Shared.tsx');
