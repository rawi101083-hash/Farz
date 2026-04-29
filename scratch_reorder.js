const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf-8').split('\n');

let startCust = lines.findIndex(l => l.includes('{/* Custom Attachments Section */}'));
let endCust = startCust;
let divCount = 0;
let started = false;

// Simple loop to find end of custom attachments div? No, we know it ends at 1136 and starts at 1016.
let customAttachments = lines.slice(startCust, startCust + 121).join('\n');
lines.splice(startCust - 2, 123);

let startQues = lines.findIndex(l => l.includes('{/* Questions Accordion */}'));
customAttachments = customAttachments.replace('<div className=\"pb-6\">', '<div>');

lines.splice(startQues, 0, customAttachments + '\n');
fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Done!');
