const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
if (content.includes('GraduationCap') && !content.match(/import\s*{[^}]*GraduationCap[^}]*}\s*from\s*['"]lucide-react['"]/)) {
  content = content.replace(/import\s*{([^}]*)}\s*from\s*['"]lucide-react['"];/, (match, p1) => {
    if (!p1.includes('GraduationCap')) {
      return `import { ${p1}, GraduationCap } from 'lucide-react';`;
    }
    return match;
  });
  fs.writeFileSync('src/App.tsx', content);
  console.log('Added GraduationCap import');
} else {
  console.log('GraduationCap already imported or not found');
}
