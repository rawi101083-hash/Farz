const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The original UI card snippet:
const oldCardRegex = /className="p-4 bg-primary\/5 dark:bg-primary\/10 border border-primary\/20 dark:border-primary\/30 rounded-2xl flex items-center justify-between shadow-sm"\s*>\s*\{\" \"\}\s*<div>\s*\{\" \"\}\s*<p className="font-bold text-navy dark:text-white">/g;

const newCardMarkup = `className="group relative p-5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
                          <div className="pr-3 flex-1">
                            <p className="font-bold text-lg text-navy dark:text-white flex items-center gap-2">`;

code = code.replace(oldCardRegex, newCardMarkup);

fs.writeFileSync('src/App.tsx', code, 'utf8');
