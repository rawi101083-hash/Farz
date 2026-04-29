const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/csvContent\.join\("\n"\)/g, 'csvContent.join("\\n")');

fs.writeFileSync('src/App.tsx', c);
