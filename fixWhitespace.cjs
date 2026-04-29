const fs = require('fs');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const fixedLines = lines.filter(line => line.trim() !== '{" "}');
  fs.writeFileSync(filePath, fixedLines.join('\n'));
  console.log('Fixed', filePath);
}

fixFile('src/components/Dashboard.tsx');
fixFile('src/Shared.tsx');
fixFile('src/components/JobApplication.tsx');
fixFile('src/components/SuperAdmin.tsx');
