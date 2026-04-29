const fs = require('fs');
const content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');
const lines = content.split(/\r?\n/);

let wrongBlockStart = -1;
let wrongBlockEnd = -1;

for (let i = 2800; i < 2830; i++) {
  if (lines[i] && lines[i].includes('نطاق الراتب المتوقع (ريال)')) {
    wrongBlockStart = i - 1; // get the <label> line? Wait, looking at my previous log:
    // 2817: <div className="bg-white border-slate-200 dark:bg-slate-800 p-8 rounded-[32px] border dark:border-slate-700 space-y-6">
    // 2818: <label className="text-sm font-bold text-navy dark:text-white mr-2 block">نطاق الراتب المتوقع (ريال)
    // The previous script just pasted the raw lines without any wrapper div.
    // The raw lines started with `                  <div className="space-y-2">`
    // Let's find the start of the raw lines exactly.
    for (let j = i; j >= i - 5; j--) {
      if (lines[j].includes('<div className="space-y-2">')) {
        wrongBlockStart = j;
        break;
      }
    }
    break;
  }
}

if (wrongBlockStart !== -1) {
  let divCount = 0;
  for (let i = wrongBlockStart; i < lines.length; i++) {
    divCount += (lines[i].match(/<div/g) || []).length;
    divCount -= (lines[i].match(/<\/div/g) || []).length;
    
    // BUT WAIT! The original block was 2 sibling divs:
    // <div className="space-y-2">...</div>
    // <div className="relative mt-3 flex items-center">...</div>
    // <div className="mt-5 p-4 rounded-2xl...</div>
    // The previous script extracted `divCount` until it became 0. 
    // Wait, the original script extracted the <div className="space-y-2"> up to its close? No, let's look at `relocate.cjs` logic:
    // startIdx was the line BEFORE "نطاق الراتب المتوقع". Which was `<div className="space-y-2">`.
    // It counted divs until divCount <= 0.
    // Actually, in `relocate.cjs`:
    // It started from <div className="space-y-2">.
    // The entire settings block might have been enclosed in `activeTab !== "settings"`...
    // Let me find the exact end. The end is right before `<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">`
    // Let's search for `التواريخ والجدولة` inside the `wrongBlock` area.
    
    if (lines[i].includes('التواريخ والجدولة') && lines[i].includes('Calendar className=')) {
      // The grid div is two lines above this
      wrongBlockEnd = i - 3;
      break;
    }
  }
}

if (wrongBlockStart !== -1 && wrongBlockEnd !== -1) {
  let wrongBlockLines = lines.splice(wrongBlockStart, wrongBlockEnd - wrongBlockStart + 1);
  console.log('Removed misplaced settings block from', wrongBlockStart, 'to', wrongBlockEnd);

  // Find the right place to put it:
  // Inside EditJobModal (starts around 3600), search for `<div className={activeTab !== "settings" ? "hidden" : "space-y-6"}>`
  let injectIdx = -1;
  for (let i = 3600; i < lines.length; i++) {
    if (lines[i].includes('activeTab !==') && lines[i].includes('settings')) {
      injectIdx = i; // Inject right after this line
      break;
    }
  }

  if (injectIdx !== -1) {
    lines.splice(injectIdx + 1, 0, ...wrongBlockLines);
    fs.writeFileSync('src/components/CreateJob.tsx', lines.join('\n'));
    console.log('Successfully restored settings block at line', injectIdx);
  } else {
    console.log('FAIL: Could not find settings tab injection point in EditJobModal');
  }
} else {
  console.log('FAIL: Could not find misplaced block bounds');
}
