const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');


const oldRegex = /<div\s*key=\{r\.id\}\s*className="group relative p-5 bg-white dark:bg-slate-800\/80 border border-slate-200 dark:border-slate-700\/60 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0\.5 transition-all duration-300 overflow-hidden"\s*>\s*<div className="absolute top-0 right-0 bottom-0 w-1\.5 bg-primary\/20 group-hover:bg-primary transition-colors duration-300" \/>\s*<div className="pr-4 flex-1">\s*<p className="font-bold text-\[15px\] text-navy dark:text-white mb-1">\s*\{r\.title\}\s*<\/p>\s*<p className="text-\[13px\] text-slate-500 dark:text-slate-400 line-clamp-1">\s*\{r\.description \|\| "لا يوجد وصف إضافي \(يتم الاعتماد على الذكاء الاصطناعي\)"\}\s*<\/p>\s*<\/div>\{" "\}/g;

const newMarkup = `<div
                          key={r.id}
                          className="group relative px-6 py-6 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 bottom-0 w-2.5 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
                          <div className="pr-6 flex-1">
                            <p className="font-bold text-lg md:text-xl text-navy dark:text-white">
                              {r.title}
                            </p>
                          </div>{" "}`;

code = code.replace(oldRegex, newMarkup);

fs.writeFileSync('src/App.tsx', code, 'utf8');
