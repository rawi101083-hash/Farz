const fs = require('fs');
let p = 'src/components/Dashboard.tsx';
let data = fs.readFileSync(p, 'utf8');

// The string we are looking for
const searchStr = ') : (row.interview_sent || row.decision === "interviewing") ? (';
const replaceStr = ') : (!row.interview_revoked && (row.interview_sent || row.decision === "interviewing")) ? (';

if (data.includes(searchStr)) {
  data = data.replace(searchStr, replaceStr);
  fs.writeFileSync(p, data, 'utf8');
  console.log("Success");
} else {
  console.log("Not found");
}
