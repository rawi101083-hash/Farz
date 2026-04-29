const fs = require('fs');

let lines = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8').split(/\r?\n/);

const startIdx = lines.findIndex(l => l.includes('<div className="grid gap-4">'));
let endIdx = -1;

for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].includes('{!showRoleForm && (')) {
        endIdx = i;
        break;
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const replacementLines = \`                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
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
                              تعديل
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(r.id)}
                              className="bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center flex-1 sm:flex-none"
                              title="حذف الشاغر"
                            >
                               حذف
                            </button>
                          </div>
                        </div>
                      ))}{" "}
                    </div>{" "}\`.split('\\n');

    lines.splice(startIdx, endIdx - startIdx, ...replacementLines);
    fs.writeFileSync('src/components/CreateJob.tsx', lines.join('\\n'));
    console.log("Updated via splice.");
} else {
    console.log("Indices not found", startIdx, endIdx);
}
