const fs = require('fs');
let content = fs.readFileSync('src/components/JobApplication.tsx', 'utf-8');

// Fix 1: birthDate input
const targetBirthDate = [
  '              <div className="space-y-3">',
  '                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">',
  '                  تاريخ الميلاد <span className="text-red-500">*</span>',
  '                </label>',
  '                <input',
  '                  required',
  '                  name="birthDate"',
  '                  type="date"',
  '                  lang="en-US"',
  '                  dir="ltr"',
  '                  value={formDataState.birthDate}',
  '                  onChange={handleInputChange}',
  '                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-left"',
  '                />',
  '              </div>'
].join('\\r\\n');

const replaceBirthDate = [
  '              <div className="space-y-3">',
  '                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">',
  '                  تاريخ الميلاد <span className="text-red-500">*</span>',
  '                </label>',
  '                <input',
  '                  required',
  '                  name="birthDate"',
  '                  type="date"',
  '                  value={formDataState.birthDate}',
  '                  onChange={handleInputChange}',
  '                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"',
  '                />',
  '              </div>'
].join('\\r\\n');

if (content.includes(targetBirthDate)) {
  content = content.replace(targetBirthDate, replaceBirthDate);
  console.log('Fixed birthDate');
} else {
  // Try LF
  const targetLF = targetBirthDate.replace(/\\r\\n/g, '\\n');
  const replaceLF = replaceBirthDate.replace(/\\r\\n/g, '\\n');
  if (content.includes(targetLF)) {
    content = content.replace(targetLF, replaceLF);
    console.log('Fixed birthDate (LF)');
  } else {
    console.log('Failed to fix birthDate');
  }
}

// Fix 2: add availability
const lines = content.split('\\n');
let insertIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('name="expectedSalary"')) {
    insertIdx = i - 7;
    break;
  }
}

if (insertIdx !== -1) {
  const availabilityHTML = [
    '              <div className="space-y-3">',
    '                <label className="text-sm font-bold text-navy dark:text-white mr-1 flex items-center gap-1">',
    '                  مدة الانضمام / الجاهزية للعمل <span className="text-red-500">*</span>',
    '                </label>',
    '                <input',
    '                  required',
    '                  name="availability"',
    '                  type="text"',
    '                  value={(formDataState as any).availability || ""}',
    '                  onChange={handleInputChange}',
    '                  placeholder="مثال: فوري، أسبوعين، شهر"',
    '                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"',
    '                />',
    '              </div>'
  ];
  
  if (lines[insertIdx].includes('\\r')) {
    lines.splice(insertIdx, 0, availabilityHTML.join('\\r\\n'));
  } else {
    lines.splice(insertIdx, 0, availabilityHTML.join('\\n'));
  }
  
  content = lines.join('\\n');
  console.log('Added availability');
} else {
  console.log('Failed to add availability');
}

fs.writeFileSync('src/components/JobApplication.tsx', content);
