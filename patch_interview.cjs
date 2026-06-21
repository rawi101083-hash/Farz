const fs = require('fs');
let p = 'src/components/Dashboard.tsx';
let data = fs.readFileSync(p, 'utf8');

let fixed = false;

// Fix 1
const search1 = `              has_started_interview: raw.has_started_interview || false,
              interview_transcript: raw.interview_transcript || "",`;
const replace1 = `              has_started_interview: raw.has_started_interview || false,
              interview_revoked: raw.interview_revoked || false,
              interview_transcript: raw.interview_transcript || "",`;

if (data.includes(search1)) {
  data = data.replace(search1, replace1);
  fixed = true;
}

// Fix 2
const search2 = `) : (row.interview_sent || row.decision === "interviewing") ? (`;
const replace2 = `) : (!row.interview_revoked && (row.interview_sent || row.decision === "interviewing")) ? (`;

if (data.includes(search2)) {
  data = data.replace(search2, replace2);
  fixed = true;
}

if (fixed) {
  fs.writeFileSync(p, data, 'utf8');
  console.log("Patched successfully");
} else {
  console.log("Could not find targets");
}
