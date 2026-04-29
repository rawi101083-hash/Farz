const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/value=\{benefits\} placeholder="\(أدخل المميزات الإضافية للوظيفة كالتأمين أو العمولات\.\.\.\)"([^]+?)placeholder="([^"]+)"/g, 'value={benefits} placeholder="(أدخل المميزات الإضافية للوظيفة كالتأمين أو العمولات...)"$1');

fs.writeFileSync('src/App.tsx', code, 'utf8');
