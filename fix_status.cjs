const fs = require('fs');

let s = fs.readFileSync('src/components/JobApplication.tsx', 'utf-8');
s = s.replace('status: "جديد"', '');
fs.writeFileSync('src/components/JobApplication.tsx', s);

let s2 = fs.readFileSync('test_db_webhook.js', 'utf-8');
s2 = s2.replace('status: "جديد"', '');
fs.writeFileSync('test_db_webhook.js', s2);

console.log("Status removed!");
