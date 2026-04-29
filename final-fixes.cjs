const fs = require('fs');
const path = './src/App.tsx';
let txt = fs.readFileSync(path, 'utf8');

// 1. Fix global background missing dark mode
txt = txt.replace(
  /<div className="flex min-h-screen bg-\[#F1F5F9\]">/g,
  '<div className="flex min-h-screen bg-[#F1F5F9] dark:bg-[#0B1120]">'
);

txt = txt.replace(
  /<div className="fixed inset-0 z-\[100\] bg-\[#F1F5F9\] flex flex-col">/g,
  '<div className="fixed inset-0 z-[100] bg-[#F1F5F9] dark:bg-[#0B1120] flex flex-col">'
);

txt = txt.replace(
  /className=\{`min-h-screen transition-colors duration-500 bg-\[#F1F5F9\] dark:bg-\[#0F172A\]/g,
  'className={`min-h-screen transition-colors duration-500 bg-[#F1F5F9] dark:bg-[#0B1120]'
);

// 2. Remove Dark Mode Button from the Sidebar
const darkModeBtnRegex = /<button\s+onClick=\{\(\) => setDarkMode\(!darkMode\)\}\s+className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl text-slate-500 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-navy dark:hover:text-white transition-all font-bold group">[\s\S]*?<\/button>\s*<button\s+onClick=\{\(\) => window\.location\.reload\(\)\}/;

txt = txt.replace(darkModeBtnRegex, '<button onClick={() => window.location.reload()}');

// Make the text in the Sidebar profile 'white' in dark mode if not already
txt = txt.replace(
  /<p className="text-sm font-bold truncate">/g,
  '<p className="text-sm font-bold truncate text-navy dark:text-white">'
);
txt = txt.replace(
  /<p className="text-sm font-bold truncate text-navy">/g,
  '<p className="text-sm font-bold truncate text-navy dark:text-white">'
);

fs.writeFileSync(path, txt, 'utf8');
console.log('Final fixes applied!');
