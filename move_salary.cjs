const fs = require('fs');
const file = 'src/components/CreateJob.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const startIdx = 2608;
const endIdx = 2770;
const extracted = lines.slice(startIdx, endIdx);

lines.splice(startIdx, endIdx - startIdx);
extracted[0] = extracted[0].replace('className="', 'className="md:col-span-2 ');

lines.splice(2006, 0, ...extracted);

fs.writeFileSync(file, lines.join('\n'));
console.log('Done!');
