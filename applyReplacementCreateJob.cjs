const fs = require('fs');
let content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');
const replacement = fs.readFileSync('replacement.txt', 'utf-8');

const startIndex = content.indexOf('            ) : (\n              <>\n                {job.recordType !== "campaign"');
const endIndex = content.indexOf('              </>\n            )}\n          </div>\n        </motion.div>');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex + 19); 
  
  if (content.includes('GraduationCap') && !content.match(/import\s*{[^}]*GraduationCap[^}]*}\s*from\s*['"]lucide-react['"]/)) {
    content = content.replace(/import\s*{([^}]*)}\s*from\s*['"]lucide-react['"];/, (match, p1) => {
      if (!p1.includes('GraduationCap')) {
        return `import { ${p1}, GraduationCap } from 'lucide-react';`;
      }
      return match;
    });
  }

  fs.writeFileSync('src/components/CreateJob.tsx', content);
  console.log('Replaced successfully in CreateJob.tsx');
} else {
  console.log('Indexes not found', startIndex, endIndex);
}
