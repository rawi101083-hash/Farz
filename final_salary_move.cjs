const fs = require('fs');
const content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');
const lines = content.split(/\r?\n/);

// The block to cut is from line 1711 to 1830 (indices 1710 to 1829)
// It is 120 lines long.
const blockLines = lines.splice(1710, 120);

// We want to wrap the block in a new Card UI.
// The block already has `<div className="mt-6 space-y-3">` and `ميزانية الوظيفة / الراتب`.
// We will replace the title inside the block or wrap the whole block in a Card.

const wrappedBlock = [
  '                <div className="space-y-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">',
  '                  <h3 className="font-bold text-navy dark:text-white text-lg mb-4">إعدادات الراتب</h3>',
  ...blockLines,
  '                </div>'
];

// After splicing 120 lines, the old line 1912 is now line (1912 - 120) = 1792.
// Line 1792 is index 1791 (the `</div>` that closes "التفاصيل الوظيفية").
// We insert our wrappedBlock right after this line.
lines.splice(1792, 0, ...wrappedBlock);

fs.writeFileSync('src/components/CreateJob.tsx', lines.join('\n'));
console.log('Successfully moved the salary block to be below التفاصيل الوظيفية');
