const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add expectedSalary to candidate mock if not present
if (!code.includes('expectedSalary: 6000')) {
  code = code.replace(
    /linkedin: "https:\/\/linkedin.com\/in\/ahmed",\s*whatsapp: "966500000000",/,
    'linkedin: "https://linkedin.com/in/ahmed",\n    expectedSalary: 6000,\n    whatsapp: "966500000000",'
  );
}

// Replace `applicant` with `candidate`
code = code.replace(/\{applicant\.expectedSalary && \(/g, '{candidate?.expectedSalary && (');

// Now replace the activeRole snippet, but we must use a regex or exact string
const badgeTextRegex = /\(\{applicant\.expectedSalary\} ريال\) \{activeRole\?\.[^}]+\}/g;
code = code.replace(badgeTextRegex, '({candidate?.expectedSalary} ريال)');


fs.writeFileSync('src/App.tsx', code, 'utf8');
