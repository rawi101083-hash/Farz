const fs = require('fs');
const content = fs.readFileSync('src/components/JobApplication.tsx', 'utf-8');
const lines = content.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<option value=""')) {
    console.log(i + 1, lines[i].trim());
  }
}
