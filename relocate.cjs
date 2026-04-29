const fs = require('fs');
const content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');
const lines = content.split(/\r?\n/);

let startIdx = -1;
let endIdx = -1;

for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('text-sm font-bold text-navy dark:text-white mr-2 block') && lines[i].includes('نطاق الراتب المتوقع (ريال)')) {
    startIdx = i - 1; 
    break;
  }
}

if (startIdx !== -1) {
  let divCount = 0;
  for(let i=startIdx; i<lines.length; i++) {
    if (lines[i].includes('<div')) divCount += (lines[i].match(/<div/g) || []).length;
    if (lines[i].includes('</div')) divCount -= (lines[i].match(/<\/div/g) || []).length;
    
    if (divCount <= 0 && i >= startIdx) {
      endIdx = i;
      break;
    }
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  const salaryBlock = lines.slice(startIdx, endIdx + 1).join('\n');
  const wrappedBlock = `
                <div className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-bold text-navy dark:text-white text-lg mb-4">إعدادات الراتب</h3>
${salaryBlock}
                  </div>
                </div>`;

  lines.splice(startIdx, endIdx - startIdx + 1);

  let injectIdx = -1;
  for(let i=0; i<lines.length; i++) {
    if (lines[i].includes('المميزات <span className="text-slate-400 font-normal text-xs ml-1">(اختياري)</span>')) {
      for(let j=i; j<i+15; j++) {
        if (lines[j].includes('</div>')) {
          if (lines[j+1].includes('</div>')) {
            injectIdx = j + 1;
            break;
          }
        }
      }
      break;
    }
  }

  if (injectIdx !== -1) {
    lines.splice(injectIdx + 1, 0, wrappedBlock);
    fs.writeFileSync('src/components/CreateJob.tsx', lines.join('\n'));
    console.log('SUCCESS: Moved salary block to injectIdx', injectIdx);
  } else {
    console.log('FAIL: Could not find injection point');
  }
} else {
  console.log('FAIL: Could not find salary block boundaries');
}
