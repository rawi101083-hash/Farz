const fs = require('fs');
let lines = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8').split('\n');

if (!lines.find(l => l.includes('MOCK_TEST_APPLICANTS'))) {
  const insertIndex = lines.findIndex(l => l.includes('import { ActiveJobs'));
  if (insertIndex !== -1) {
    lines.splice(insertIndex, 0, 'import { MOCK_TEST_APPLICANTS } from "../mockData";');
  }
}

const fetchStart = lines.findIndex(l => l.includes('const fetchApplicants = async () => {'));
if (fetchStart !== -1) {
  const mappedListIndex = lines.findIndex((l, i) => i > fetchStart && l.includes('const combinedList = [...mappedList]'));
  if (mappedListIndex !== -1) {
    const injection = `        
        if (!localStorage.getItem("mock_expiration_24h")) {
          localStorage.setItem("mock_expiration_24h", (Date.now() + 24 * 60 * 60 * 1000).toString());
        }
        const exp = parseInt(localStorage.getItem("mock_expiration_24h") || "0");
        if (Date.now() < exp) {
          mappedList = [...MOCK_TEST_APPLICANTS, ...mappedList];
        }
`;
    lines.splice(mappedListIndex, 0, injection);
    fs.writeFileSync('src/components/Dashboard.tsx', lines.join('\n'));
    console.log('Injected successfully');
  } else {
    console.log('Could not find mappedListIndex');
  }
} else {
  console.log('Could not find fetchApplicants');
}
