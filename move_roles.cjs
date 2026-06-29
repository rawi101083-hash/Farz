const fs = require('fs');
let code = fs.readFileSync('src/components/CreateJob.tsx', 'utf8');
const lines = code.split(/\r?\n/);

let startIdx = -1;
let endIdx = -1;

for (let i = 2170; i < 2200; i++) {
    if (lines[i] && lines[i].includes('{adType === "campaign" && roles.length > 0 && (')) {
        startIdx = i;
        break;
    }
}

if (startIdx !== -1) {
    for (let i = startIdx; i < startIdx + 150; i++) {
        if (lines[i] && lines[i].includes(')}{' + ' ' + '}')) {
            endIdx = i;
            break;
        }
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    console.log('Found block from', startIdx, 'to', endIdx);
    const block = lines.slice(startIdx, endIdx + 1);
    
    // Remove block
    const newLines = [...lines.slice(0, startIdx), ...lines.slice(endIdx + 1)];
    
    let insertIdx = -1;
    for (let i = 3500; i < newLines.length; i++) {
        if (newLines[i] && newLines[i].includes('className="flex flex-col md:flex-row items-center justify-end gap-3 mt-8 pt-8 border-t')) {
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
} else {
    console.log('Block bounds not found');
}
