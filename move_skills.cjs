const fs = require('fs');
const content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');
const lines = content.split(/\r?\n/);

let skillsStartIdx = -1;
for(let i=0; i<2500; i++) {
  if (lines[i] && lines[i].includes('المهارات المستهدفة')) {
    // trace back to the div wrapper
    for(let j=i; j>i-10; j--) {
      if (lines[j] && lines[j].includes('<div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700/60 mt-8">')) {
        skillsStartIdx = j;
        break;
      }
    }
    break;
  }
}

let langsEndIdx = -1;
if (skillsStartIdx !== -1) {
  for(let i=skillsStartIdx; i<2500; i++) {
    if (lines[i] && lines[i].includes('المرفقات المخصصة - اختياري')) {
      for(let j=i; j>i-10; j--) {
        if (lines[j] && lines[j].includes('<div className="border border-slate-200')) {
          langsEndIdx = j - 2; // right before `<div><div className="border...`
          break;
        }
      }
      break;
    }
  }
}

if (skillsStartIdx !== -1 && langsEndIdx !== -1) {
  const blockLines = lines.splice(skillsStartIdx, langsEndIdx - skillsStartIdx + 1);

  const wrappedBlock = [
    '                {createJobType !== "quick_link" && (',
    '                  <>',
    ...blockLines,
    '                  </>',
    '                )}'
  ];

  let insertIdx = -1;
  for(let i=0; i<2500; i++) {
    if (lines[i] && lines[i].includes('المميزات <span className="text-slate-400')) {
      for(let j=i; j>i-10; j--) {
        if (lines[j] && lines[j].includes('<div className="space-y-3">')) {
          insertIdx = j;
          break;
        }
      }
      break;
    }
  }

  if (insertIdx !== -1) {
    lines.splice(insertIdx, 0, ...wrappedBlock);
    fs.writeFileSync('src/components/CreateJob.tsx', lines.join('\n'));
    console.log('Successfully moved Skills and Languages! Inserted at', insertIdx);
  } else {
    console.log('Could not find insertIdx');
  }
} else {
  console.log('Could not find bounds: ', skillsStartIdx, langsEndIdx);
}
