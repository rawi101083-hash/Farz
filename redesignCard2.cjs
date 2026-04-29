const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The markup string currently looks somewhat like this depending on previous edits:
// <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
// <div className="pr-3 flex-1">
//   <p className="font-bold text-lg text-navy dark:text-white flex items-center gap-2">
//     {r.title}
//   </p>{" "}
//   <p className="text-sm text-slate-500 dark:text-slate-300 line-clamp-1 mt-1">
//     {r.description}
//   </p>{" "}
// </div>{" "}

const regexOldCardContent = /<div className="absolute top-0 right-0 bottom-0 w-1\.5 bg-primary\/20 group-hover:bg-primary transition-colors duration-300" \/>\s*<div className="pr-3 flex-1">\s*<p className="font-bold text-lg text-navy dark:text-white flex items-center gap-2">\s*\{r\.title\}\s*<\/p>\{" "\}\s*<p className="text-sm text-slate-500 dark:text-slate-300 line-clamp-1 mt-1">\s*\{r\.description\}\s*<\/p>\{" "\}\s*<\/div>\{" "\}/g;

const newCardContent = `<div className="absolute top-0 right-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
                          <div className="pr-3 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                                <Briefcase size={20} className="text-primary dark:text-indigo-300" />
                              </div>
                              <div>
                                <p className="font-bold text-lg text-navy dark:text-white flex items-center gap-2">
                                  {r.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                  {r.location && (
                                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md">
                                      <MapPin size={12} className="text-slate-400 dark:text-slate-500" /> {r.location}
                                    </span>
                                  )}
                                  {r.type && (
                                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md">
                                      <Briefcase size={12} className="text-slate-400 dark:text-slate-500" /> {r.type}
                                    </span>
                                  )}
                                  {r.experience && (
                                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md">
                                      <Clock size={12} className="text-slate-400 dark:text-slate-500" /> {r.experience}
                                    </span>
                                  )}
                                  {!r.location && !r.type && r.description && (
                                     <span className="line-clamp-1 text-slate-500 max-w-sm">{r.description}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>{" "}`;

code = code.replace(regexOldCardContent, newCardContent);

fs.writeFileSync('src/App.tsx', code, 'utf8');
