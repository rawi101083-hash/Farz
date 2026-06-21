const fs = require('fs');
let p = 'src/components/Dashboard.tsx';
let data = fs.readFileSync(p, 'utf8');

const searchStr = 'has_started_interview: raw.has_started_interview || false,';
const replaceStr = 'has_started_interview: raw.has_started_interview || false,\n              interview_revoked: raw.interview_revoked || false,';

if (data.includes(searchStr)) {
  data = data.replace(searchStr, replaceStr);
  fs.writeFileSync(p, data, 'utf8');
  console.log("Success");
} else {
  console.log("Not found");
}
