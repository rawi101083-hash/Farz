const fs = require('fs');

let txt = fs.readFileSync('src/App.tsx', 'utf8');

// Fix broken opacity classes
txt = txt.replace(/dark:bg-slate-800\/50\/50/g, 'dark:bg-slate-800/50');
txt = txt.replace(/dark:bg-slate-800\/50\/80/g, 'dark:bg-slate-800/80');

// Fix the exact sidebar button removal by slicing lines or replacing exact
const lines = txt.split('\n');
const newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('onClick={() => setDarkMode(!darkMode)}') && line.includes('<button')) {
    skip = true;
    // Look back and pop the <button line if we found onClick inside the button on same line. Wait!
    // In our file, <button is on one line, onClick on the next.
  }
}

// Safer exact match replace
let startIndex = txt.indexOf('<button\n            onClick={() => setDarkMode(!darkMode)}');
if (startIndex !== -1) {
   let endIndex = txt.indexOf('</button>', startIndex);
   if (endIndex !== -1) {
       let toRemove = txt.substring(startIndex, endIndex + '</button>'.length);
       txt = txt.replace(toRemove, '');
       console.log('Removed Theme Button Successfully.');
   }
}

// What if the \n whitespace was different? Let's use a regex carefully.
txt = txt.replace(/<button\s+onClick=\{\(\) => setDarkMode\(!darkMode\)\}[\s\S]*?<\/button>/, '');

fs.writeFileSync('src/App.tsx', txt, 'utf8');
