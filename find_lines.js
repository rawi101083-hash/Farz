const fs = require('fs');
const lines = fs.readFileSync('src/Shared.tsx', 'utf8').split(/\r?\n/);
let start = lines.findIndex(l => l.includes('activeTab === "باقات فرز"'));
let end = lines.findIndex((l, i) => i > start && l.includes('activeTab === "المظهر"'));
console.log('start', start);
console.log('end', end);
