const fs = require('fs');
let s = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
s = s.replace('onClick={onViewDetails}', 'onClick={() => onViewDetails(row)}');
fs.writeFileSync('src/components/Dashboard.tsx', s);
console.log('done replacement');
