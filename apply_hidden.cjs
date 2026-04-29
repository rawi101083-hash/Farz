const fs = require('fs');
let content = fs.readFileSync('src/components/JobApplication.tsx', 'utf-8');

// Replace all `<option value="" ...` to have `disabled hidden` if they don't already
const lines = content.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<option value=""')) {
    // If it already has disabled but not hidden
    if (lines[i].includes('disabled') && !lines[i].includes('hidden')) {
      lines[i] = lines[i].replace('disabled', 'disabled hidden');
    } else if (!lines[i].includes('disabled')) {
      lines[i] = lines[i].replace('<option value=""', '<option value="" disabled hidden');
    }
  }
}

fs.writeFileSync('src/components/JobApplication.tsx', lines.join('\n'));
