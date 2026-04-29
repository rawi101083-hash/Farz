const fs = require('fs');
const content = fs.readFileSync('src/App_test.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('createJobType === "single"')) {
    console.log(`Line ${i+1}:`);
    for (let j = Math.max(0, i-2); j <= Math.min(lines.length-1, i+2); j++) {
      console.log(`  ${j+1}: ${lines[j].trim()}`);
    }
  }
});
