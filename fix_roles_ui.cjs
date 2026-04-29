const fs = require('fs');

let content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');

const targetStr = `<div className="grid gap-4">
                      {roles.map((r) => (
                        <div
                          key={r.id}
                          className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl flex items-center justify-between shadow-sm"
                        >
                          {" "}
                          <div>
                            {" "}
                            <p className="font-bold text-navy dark:text-white">
                              {r.title}
                            </p>{" "}
                            <p className="text-sm text-slate-500 dark:text-slate-300 line-clamp-1 mt-1">
                              {r.description}
                            </p>{" "}
                          </div>{" "}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                handleEditRole(r as any);
                                setShowRoleForm(true);
                              }}
                              className="bg-white text-navy border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                              title="تعديل الشاغر"
                            >
                              {" "}
                              <Edit size={16} />{" "}
                            </button>{" "}
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(r.id)}
                              className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-900/30 dark:text-red-400 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm"
                              title="حذف الشاغر"
                            >
                              {" "}
                              <Trash2 size={16} />{" "}
                            </button>{" "}
                          </div>
                        </div>
                      ))}{" "}
                    </div>`;

// Strip all styling layout spaces and newlines from the file content and the target
// To do this properly, we use regex that matches standard elements.

const matchRegex = /<div className="grid gap-4">\s*\{roles\.map\(\(r\) => \(\s*<div\s*key=\{r\.id\}\s*className="p-4 bg-primary\/5 dark:bg-primary\/10 border border-primary\/20 dark:border-primary\/30 rounded-2xl flex items-center justify-between shadow-sm"\s*>\s*\{" "\}\s*<div>\s*\{" "\}\s*<p className="font-bold text-navy dark:text-white">\s*\{r\.title\}\s*<\/p>\{" "\}\s*<p className="text-sm text-slate-500 dark:text-slate-300 line-clamp-1 mt-1">\s*\{r\.description\}\s*<\/p>\{" "\}\s*<\/div>\{" "\}\s*<div className="flex items-center gap-2">\s*<button\s*type="button"\s*onClick=\{\(\) => \{\s*handleEditRole\(r as any\);\s*setShowRoleForm\(true\);\s*\}\}\s*className="bg-white text-navy border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-2 py-1\.5 rounded-lg text-xs font-bold transition-all shadow-sm"\s*title="تعديل الشاغر"\s*>\s*\{" "\}\s*<Edit size=\{16\} \/>\{" "\}\s*<\/button>\{" "\}\s*<button\s*type="button"\s*onClick=\{\(\) => handleDeleteRole\(r\.id\)\}\s*className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-900\/30 dark:text-red-400 px-2 py-1\.5 rounded-lg text-\[10px\] font-bold transition-all shadow-sm"\s*title="حذف الشاغر"\s*>\s*\{" "\}\s*<Trash2 size=\{16\} \/>\{" "\}\s*<\/button>\{" "\}\s*<\/div>\s*<\/div>\s*\)\)\}\{" "\}\s*<\/div>/g;

const replacement = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {roles.map((r) => (
                        <div
                          key={r.id}
                          className="group relative bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between gap-4 overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-2 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                          <div className="pr-3 flex-1 flex flex-col">
                            <h4 className="text-lg font-bold text-navy dark:text-white group-hover:text-primary transition-colors truncate">
                              {r.title}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                              {r.description || "لا يوجد وصف مدخل لهذه الوظيفة"}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4 mt-auto">
                              {r.location && <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">{r.location}</span>}
                              {r.type && <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">{r.type}</span>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 pr-3 pt-3 mt-2 border-t border-slate-100 dark:border-slate-700/50 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                handleEditRole(r as any);
                                setShowRoleForm(true);
                              }}
                              className="bg-white text-primary border border-primary/20 hover:bg-primary/5 dark:bg-slate-800 dark:text-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center flex-1 sm:flex-none"
                              title="تعديل الشاغر"
                            >
                              <Edit size={14} className="ml-1" /> تعديل
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(r.id)}
                              className="bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center flex-1 sm:flex-none"
                              title="حذف الشاغر"
                            >
                              <Trash2 size={14} className="ml-1" /> حذف
                            </button>
                          </div>
                        </div>
                      ))}{" "}
                    </div>`;

if (matchRegex.test(content)) {
    content = content.replace(matchRegex, replacement);
    fs.writeFileSync('src/components/CreateJob.tsx', content);
    console.log("Updated roles list UI.");
} else {
    console.log("Regex not matched!");
}
