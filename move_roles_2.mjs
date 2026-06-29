import fs from 'fs';

let code = fs.readFileSync('src/components/CreateJob.tsx', 'utf8');
const lines = code.split(/\r?\n/);

let startIdx = 2188;
let endIdx = 2283;

console.log('Found block from', startIdx, 'to', endIdx);
const block = lines.slice(startIdx, endIdx + 1);

// Remove block
const newLines = [...lines.slice(0, startIdx), ...lines.slice(endIdx + 1)];

let insertIdx = -1;
for (let i = 3600; i < newLines.length; i++) {
    if (newLines[i] && newLines[i].includes('mt-8 pt-8 border-t border-slate-200 dark:border-slate-800')) {
        insertIdx = i;
        break;
    }
}

if (insertIdx !== -1) {
    console.log('Inserting at', insertIdx);
    const finalLines = [...newLines.slice(0, insertIdx), ...block, ...newLines.slice(insertIdx)];
    fs.writeFileSync('src/components/CreateJob.tsx', finalLines.join('\n'));
    console.log('Done');
} else {
    console.log('Insert point not found');
}
