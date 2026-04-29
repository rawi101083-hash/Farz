const fs = require('fs');

let content = fs.readFileSync('src/components/JobApplication.tsx', 'utf-8');

// The exact string to remove is:
//     }, 1500);
content = content.replace("    }, 1500);", "");

fs.writeFileSync('src/components/JobApplication.tsx', content);
console.log('Fixed syntax error in JobApplication.tsx');
