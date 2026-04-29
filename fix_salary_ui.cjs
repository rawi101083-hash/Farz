const fs = require('fs');
const content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');
const lines = content.split(/\r?\n/);

// 1. Find the block that I mistakenly injected at line 1913.
// It starts with <h3 className="font-bold text-navy dark:text-white text-lg mb-4">إعدادات الراتب</h3>
let wrongBlockStart = -1;
let wrongBlockEnd = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('إعدادات الراتب')) {
    // The start of the block is the <div className="space-y-6 mt-6"> two lines above
    wrongBlockStart = i - 2;
    break;
  }
}

if (wrongBlockStart !== -1) {
  let divCount = 0;
  for (let i = wrongBlockStart; i < lines.length; i++) {
    divCount += (lines[i].match(/<div/g) || []).length;
    divCount -= (lines[i].match(/<\/div/g) || []).length;
    if (divCount === 0 && i >= wrongBlockStart) {
      wrongBlockEnd = i;
      break;
    }
  }
}

// 2. Extract and remove the wrong block
let wrongBlockLines = [];
if (wrongBlockStart !== -1 && wrongBlockEnd !== -1) {
  wrongBlockLines = lines.splice(wrongBlockStart, wrongBlockEnd - wrongBlockStart + 1);
  console.log('Removed wrong block from', wrongBlockStart, 'to', wrongBlockEnd);
}

// 3. Find the Settings tab injection point
// We will look for <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
// which is exactly where the salary block used to be right above it.
let settingsInjectIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('التواريخ والجدولة') && lines[i].includes('Calendar className=')) {
    // The grid div is two lines above this label
    settingsInjectIdx = i - 2;
    break;
  }
}

if (settingsInjectIdx !== -1 && wrongBlockLines.length > 0) {
  // We need to strip the <div className="space-y-6 mt-6"> and <div><h3...إعدادات الراتب</h3> from the beginning
  // and the closing </div></div> from the end of the wrong block.
  let cleanedBlock = wrongBlockLines.slice(4, wrongBlockLines.length - 2);
  lines.splice(settingsInjectIdx, 0, ...cleanedBlock);
  console.log('Restored settings tab block at', settingsInjectIdx);
}

// 4. Now find the correct salary block (the one at line 1711)
let desktopSalaryStart = -1;
let desktopSalaryEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('ميزانية الوظيفة / الراتب')) {
    desktopSalaryStart = i - 1; // <div className="mt-6 space-y-3">
    break;
  }
}

if (desktopSalaryStart !== -1) {
  let divCount = 0;
  for (let i = desktopSalaryStart; i < lines.length; i++) {
    divCount += (lines[i].match(/<div/g) || []).length;
    divCount -= (lines[i].match(/<\/div/g) || []).length;
    if (divCount === 0 && i >= desktopSalaryStart) {
      desktopSalaryEnd = i;
      break;
    }
  }
}

// 5. Extract the desktop salary block
let desktopSalaryLines = [];
if (desktopSalaryStart !== -1 && desktopSalaryEnd !== -1) {
  desktopSalaryLines = lines.splice(desktopSalaryStart, desktopSalaryEnd - desktopSalaryStart + 1);
  console.log('Removed desktop salary block from', desktopSalaryStart, 'to', desktopSalaryEnd);
}

// 6. Find the injection point below "التفاصيل الوظيفية"
let desktopInjectIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('التفاصيل الوظيفية') && !lines[i].includes('إعدادات الراتب')) {
    let divCount = 0;
    // We are at <h3...التفاصيل الوظيفية</h3> which is line i.
    // The parent is <div> at i-1. The parent's parent is <div className="space-y-6 mt-6"> at i-2.
    // We want to find the end of the <div> at i-1.
    for (let j = i - 1; j < lines.length; j++) {
      divCount += (lines[j].match(/<div/g) || []).length;
      divCount -= (lines[j].match(/<\/div/g) || []).length;
      if (divCount === 0 && j >= i - 1) {
        desktopInjectIdx = j;
        break;
      }
    }
    break;
  }
}

if (desktopInjectIdx !== -1 && desktopSalaryLines.length > 0) {
  const wrappedBlock = [
    '                  <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 lg:p-8 mt-8 border border-slate-200 dark:border-slate-700 shadow-xl relative">',
    '                    <h3 className="font-bold text-navy dark:text-white text-xl mb-6 flex items-center gap-2">',
    '                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
    '                      إعدادات الراتب',
    '                    </h3>',
    ...desktopSalaryLines,
    '                  </div>'
  ];
  lines.splice(desktopInjectIdx + 1, 0, ...wrappedBlock);
  console.log('Injected desktop salary block at', desktopInjectIdx + 1);
}

fs.writeFileSync('src/components/CreateJob.tsx', lines.join('\n'));
console.log('All done!');
