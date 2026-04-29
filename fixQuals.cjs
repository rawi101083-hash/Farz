const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// remove required from qualifications
code = code.replace(/required=\{createJobType === "single" \|\| createJobType === "quick_link"\}/g, '');

// double check for other "Benefits... " placeholders
code = code.replace(/placeholder="Benefits\.\.\."/g, 'placeholder="(أدخل المميزات الإضافية للوظيفة كالتأمين أو العمولات...)"');

fs.writeFileSync('src/App.tsx', code, 'utf8');
