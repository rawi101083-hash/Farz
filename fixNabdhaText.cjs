const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldNabdhaText = 'مثال: نبحث عن موظف طموح لإدارة علاقات العملاء في فرعنا الرئيسي...';
const newNabdhaText = '(مثال: برمجة التطبيقات، إدارة مشاريع معينة، متابعة الملفات...)';

code = code.replace(new RegExp(oldNabdhaText.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'), 'g'), newNabdhaText);

// Let's also check if the other text `توجيهات إضافية لمحرك الفرز` has any placeholder issues
// The user explicitly only mentioned `نبذة عن الدور` in this audio message.

fs.writeFileSync('src/App.tsx', code, 'utf8');
