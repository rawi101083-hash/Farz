const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/TO_REPLACE_NABDHA/g, 'placeholder="مثال: نبحث عن موظف طموح لإدارة علاقات العملاء في فرعنا الرئيسي..."');

fs.writeFileSync('src/App.tsx', code, 'utf8');
