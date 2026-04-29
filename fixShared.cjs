const fs = require('fs');
let content = fs.readFileSync('src/Shared.tsx', 'utf-8');

// Add the prop to the destructuring
content = content.replace(
  '  onViewDetails,\r\n  talentPool,\r\n  onCrossNominate,\r\n}: {',
  '  onViewDetails,\r\n  talentPool,\r\n  onCrossNominate,\r\n  externalApplicants,\r\n}: {'
);

// Add the prop to the types
content = content.replace(
  '  talentPool: Applicant[];\r\n  onCrossNominate?: (applicant: Applicant) => void;\r\n}) => {',
  '  talentPool: Applicant[];\r\n  externalApplicants?: Applicant[];\r\n  onCrossNominate?: (applicant: Applicant) => void;\r\n}) => {'
);

const replacementLogic = `  const allPlatformApplicants = [...talentPool];

  if (externalApplicants) {
    externalApplicants.forEach(app => {
      if (!allPlatformApplicants.find(t => t.id === app.id)) {
        allPlatformApplicants.push({ ...app, job: app.job || "غير محدد" });
      }
    });
  }

  jobs.forEach(job => {`;

content = content.replace(
  '  const allPlatformApplicants = [...talentPool];\r\n  jobs.forEach(job => {',
  replacementLogic
);

fs.writeFileSync('src/Shared.tsx', content);
console.log('Modified Shared.tsx');
