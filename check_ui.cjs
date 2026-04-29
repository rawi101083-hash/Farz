const fs = require('fs');
const txt = fs.readFileSync('src/App.tsx', 'utf8');

const lines = txt.split('\n');
let start = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const CreateJob')) {
    start = i;
  }
  if (start > -1 && i > start && i < start + 1200) {
    if (lines[i].includes('type="submit"')) {
      console.log('Found submit at line ' + (i+1));
      console.log('Lines around it:');
      for (let j = i - 10; j <= i + 5; j++) {
        console.log(j+1 + ': ' + lines[j].trim());
      }
      break; // stop after first submit in CreateJob
    }
  }
}
