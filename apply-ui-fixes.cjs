const fs = require('fs');
let txt = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove Sidebar Dark Mode Toggle Button
const themeBtnRegex = /<button\s+onClick=\{\(\) => setDarkMode\(!darkMode\)\}[\s\S]*?<\/button>\s*/;
txt = txt.replace(themeBtnRegex, '');

// 2. Fix the Table header contrast (Settings Tab or Main Table)
// User said: "صفحة الإعدادات (تبويب الباقة): رؤوس الجدول" -> wait, does Settings Package Tab have a table?
// Let's check if there is a table in Settings Package Tab... Wait, earlier the user talked about "تبويب الباقة" having users limit (e.g. 1,240 / 5,000). But there is NO TABLE with "اسم المتقدم، المسمى الوظيفي" in Settings! 
// "اسم المتقدم، المسمى الوظيفي" are exactly the columns in the `TalentPool` or `ActiveJobs` table.
// I will deepen ALL table headers `th` 
txt = txt.replace(
  /th className="px-8 py-5 font-bold"/g,
  'th className="px-8 py-5 font-bold bg-[#F8FAFC] dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white"'
);
txt = txt.replace(
  /thead className="bg-\[#F8FAFC\]"/g,
  'thead className="bg-[#F8FAFC] dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-navy dark:text-white"'
);
txt = txt.replace(
  /<th className="px-6 py-4 font-bold text-slate-500">/g,
  '<th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-300 bg-[#F8FAFC] dark:bg-slate-900">'
);

// 3. Fix white backgrounds in the table (badges like Cashier, Immediate)
// Found at line 5208: <span className="bg-slate-100 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold">
txt = txt.replace(
  /className="bg-slate-100 text-slate-600 dark:text-slate-300 px-3 py-1\.5 rounded-lg text-xs font-bold"/g,
  'className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white px-3 py-1.5 rounded-lg text-xs font-bold"'
);
// And also this avatar block might be white: 
// <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500
txt = txt.replace(
  /className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 shadow-inner-3d group-hover:bg-white dark:bg-slate-800 transition-colors"/g,
  'className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-200 shadow-inner-3d group-hover:bg-white dark:hover:bg-slate-600 transition-colors"'
);
// And in TalentPool line 3961:
txt = txt.replace(
  /className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 shadow-inner-3d group-hover:bg-primary\/10 group-hover:text-primary transition-colors"/g,
  'className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center font-bold text-slate-500 dark:text-slate-200 shadow-inner-3d group-hover:bg-primary/10 group-hover:text-primary transition-colors"'
);

// 4. Fix Talent Pool page
// Tab texts (Select menus):
txt = txt.replace(
  /select className="pr-12 pl-10 py-4 bg-slate-50 dark:bg-slate-800\/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary\/10 focus:border-primary transition-all appearance-none cursor-pointer font-medium min-w-\[160px\]"/g,
  'select className="pr-12 pl-10 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer font-medium min-w-[160px] dark:text-white"'
);
// Skills cards (SQL, Python): <span className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 ...
txt = txt.replace(
  /className="bg-slate-50 dark:bg-slate-800\/50 text-slate-500 dark:text-slate-400 dark:text-slate-500 px-3 py-1 rounded-lg text-\[10px\] font-bold border border-slate-100 dark:border-slate-700\/50"/g,
  'className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-white px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-100 dark:border-slate-600"'
);

// 5. Green Alerts: bg-mint text-employer-green
txt = txt.replace(
  /className="bg-mint text-employer-green /g,
  'className="bg-mint dark:bg-[#065f46] text-employer-green dark:text-[#a7f3d0] '
);
// Another variant:
txt = txt.replace(
  /text-xs font-bold text-employer-green/g,
  'text-xs font-bold text-employer-green dark:text-green-300'
);
txt = txt.replace(
  /text-employer-green font-bold/g,
  'text-employer-green dark:text-green-300 font-bold'
);


fs.writeFileSync('src/App.tsx', txt, 'utf8');
console.log('UI Fixes Applied Successfuly!');
