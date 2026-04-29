const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/\.split\(\/\[,\n\s*،\]\/\)/g, '.split(/[,\\n،]/)');

fs.writeFileSync('src/App.tsx', c);
