const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf-8').split('\n');

let startCust = lines.findIndex(l => l.includes('{/* Custom Attachments Section */}'));
let endCust = lines.findIndex((l, idx) => idx > startCust && l.includes('{createJobType === "campaign" && ('));

let customAttachmentsLines = lines.slice(startCust, endCust - 2); 
lines.splice(startCust - 3, customAttachmentsLines.length + 3);

let startQues = lines.findIndex(l => l.includes('{/* Questions Accordion */}'));

let customStr = customAttachmentsLines.join('\n');
customStr = customStr.replace('<div className=\"pb-6\">', '<div>');

lines.splice(startQues, 0, customStr + '\n');
fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Reordered successfully!');
