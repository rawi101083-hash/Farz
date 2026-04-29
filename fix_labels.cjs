const fs = require('fs');
let content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');

content = content.replace(
  '<div className="grid grid-cols-2 gap-4">\n                                     <select',
  `<div className="grid grid-cols-2 gap-4">
                                     <div>
                                       <label className="text-xs font-bold text-slate-500 mb-1 block">نوع السؤال</label>
                                       <select`
);

content = content.replace(
  '<option value="age_condition" className="bg-white text-navy dark:bg-slate-800 dark:text-white">شرط العمر</option>\n                                     </select>',
  '<option value="age_condition" className="bg-white text-navy dark:bg-slate-800 dark:text-white">شرط العمر</option>\n                                       </select>\n                                     </div>'
);

content = content.replace(
  '{newKqType === "age_condition" ? (\n                                       <div className="flex items-center gap-4">',
  `{newKqType === "age_condition" ? (
                                       <div>
                                         <label className="text-xs font-bold text-slate-500 mb-1 block">شروط العمر</label>
                                         <div className="flex items-center gap-4">`
);

content = content.replace(
  'className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm"\n                                         />\n                                       </div>\n                                     ) : newKqType === "yes_no" ? (\n                                       <select',
  `className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm"
                                         />
                                         </div>
                                       </div>
                                     ) : newKqType === "yes_no" ? (
                                       <div>
                                         <label className="text-xs font-bold text-slate-500 mb-1 block">الإجابة المطلوبة</label>
                                         <select`
);

content = content.replace(
  '<option value="لا" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الإجابة المطلوبة للقَبول: لا</option>\n                                       </select>\n                                     ) : (\n                                       <select',
  `<option value="لا" className="bg-white text-navy dark:bg-slate-800 dark:text-white">الإجابة المطلوبة للقَبول: لا</option>
                                         </select>
                                       </div>
                                     ) : (
                                       <div>
                                         <label className="text-xs font-bold text-slate-500 mb-1 block">الإجابة المطلوبة</label>
                                         <select`
);

content = content.replace(
  '<option key={i} value={opt} className="bg-white text-navy dark:bg-slate-800 dark:text-white">{opt}</option>\n                                         ))}\n                                       </select>\n                                     )}',
  `<option key={i} value={opt} className="bg-white text-navy dark:bg-slate-800 dark:text-white">{opt}</option>
                                         ))}
                                         </select>
                                       </div>
                                     )}`
);

fs.writeFileSync('src/components/CreateJob.tsx', content);
