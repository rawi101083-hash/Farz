const fs = require('fs');
let p = 'src/components/Dashboard.tsx';
let data = fs.readFileSync(p, 'utf8');

// Convert all line endings to CRLF
data = data.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');

fs.writeFileSync(p, data, 'utf8');
console.log("Line endings fixed");
