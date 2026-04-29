const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="absolute top-0 right-0 bottom-0 w-1\.5 bg-primary\/20 group-hover:bg-primary transition-colors duration-300" \/>\s*<div className="pr-3 flex-1">\s*<div className="flex items-center gap-3">\s*<div className="w-10 h-10 rounded-xl bg-primary\/10 dark:bg-primary\/20 flex items-center justify-center shrink-0">\s*<Briefcase size=\{20\} className="text-primary dark:text-indigo-300" \/>\s*<\/div>\s*<div>\s*<p className="font-bold text-lg text-navy dark:text-white flex items-center gap-2">\s*\{r\.title\}\s*<\/p>\s*<div className="flex flex-wrap items-center gap-3 mt-1\.5 text-xs font-medium text-slate-500 dark:text-slate-400">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\{" "\}/g;

const newMarkup = `<div className="absolute top-0 right-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
                          <div className="pr-4 flex-1">
                            <p className="font-bold text-[15px] text-navy dark:text-white mb-1">
                              {r.title}
                            </p>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {r.description || "لا يوجد وصف إضافي (يتم الاعتماد على الذكاء الاصطناعي)"}
                            </p>
                          </div>{" "}`;

code = code.replace(regex, newMarkup);

fs.writeFileSync('src/App.tsx', code, 'utf8');
