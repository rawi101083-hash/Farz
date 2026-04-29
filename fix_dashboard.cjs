const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove window.confirm for filtered -> pending
content = content.replace(
  /onClick=\{\(\) => \{\s*if\s*\(window\.confirm\("هل ترغب في استعادة المتقدم وإعادته لقائمة المراجعة\?"\)\)\s*\{\s*handleDecision\(row\.id,\s*"pending"\);\s*\}\s*\}\}/g,
  'onClick={(e) => { e.stopPropagation(); handleDecision(row.id, "pending"); }}'
);

// 2. Remove window.confirm for interview/rejected/accepted -> pending
content = content.replace(
  /onClick=\{\(\) => \{\s*if\s*\(window\.confirm\("هل أنت متأكد من رغبتك في التراجع عن هذا القرار وإعادته لقيد المراجعة\?"\)\)\s*\{\s*handleDecision\(row\.id,\s*"pending"\);\s*\}\s*\}\}/g,
  'onClick={(e) => { e.stopPropagation(); handleDecision(row.id, "pending"); }}'
);

// 3. Remove interview modal block (the whole button)
content = content.replace(
  /\{row\.decision === "interview" && \(\s*<button[\s\S]*?إرسال دعوة\s*<\/button>\s*\)\}/g,
  ''
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done modifying Dashboard.tsx');
