const fs = require('fs');
const content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');
const lines = content.split(/\r?\n/);
let startIdx = -1;
let endIdx = -1;
for(let i=1900; i<lines.length; i++) {
  if (lines[i].includes('createJobType !== "quick_link" && (')) {
    startIdx = i;
  }
  if (startIdx !== -1 && lines[i].includes('إعدادات الفرز المتقدمة')) {
    for(let j=i-1; j>startIdx; j--) {
      if (lines[j].includes('</>')) {
        endIdx = j + 1;
        break;
      }
    }
    break;
  }
}
console.log('Start:', startIdx + 1, 'End:', endIdx + 1);
