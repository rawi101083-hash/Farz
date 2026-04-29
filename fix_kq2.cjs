const fs = require('fs');
let content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');

// 1. Add age_condition option to select in ManageJobModal
content = content.replace(
  '<option value="yes_no">نعم / لا</option>\n                            <option value="options">خيارات متعددة</option>',
  '<option value="yes_no">نعم / لا</option>\n                            <option value="options">خيارات متعددة</option>\n                            <option value="age_condition">شرط العمر</option>'
);

// 2. Add Age inputs conditionally in ManageJobModal
content = content.replace(
  '<div className="md:col-span-2 flex items-end">',
  `{newKqType === "age_condition" && (
                          <div className="md:col-span-12 flex gap-4 mt-2">
                            <input type="number" disabled={isLocked} value={newKqMinAge} onChange={(e) => setNewKqMinAge(e.target.value ? Number(e.target.value) : "")} placeholder="الحد الأدنى (مثال: 21)" className="w-1/2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm" />
                            <input type="number" disabled={isLocked} value={newKqMaxAge} onChange={(e) => setNewKqMaxAge(e.target.value ? Number(e.target.value) : "")} placeholder="الحد الأعلى (اختياري)" className="w-1/2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm" />
                          </div>
                        )}
                        <div className="md:col-span-2 flex items-end">`
);

// 3. Update onClick logic in ManageJobModal Add button
content = content.replace(
  'onClick={(e) => { e.preventDefault(); if (!newKqText.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى إدخال نص السؤال!", type: "warning" } })); return; } setKnockoutQuestions([...knockoutQuestions, { text: newKqText.trim(), type: newKqType, options: newKqType === "options" ? newKqOptions : undefined, requiredAnswer: newKqType === "yes_no" ? "نعم" : newKqOptions[0] }]); setNewKqText(""); }}',
  'onClick={(e) => { e.preventDefault(); if (!newKqText.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى إدخال نص السؤال!", type: "warning" } })); return; } if (newKqType === "age_condition" && newKqMinAge === "") { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى تحديد الحد الأدنى للعمر!", type: "warning" } })); return; } setKnockoutQuestions([...knockoutQuestions, { text: newKqText.trim(), type: newKqType, options: newKqType === "options" ? newKqOptions : undefined, requiredAnswer: newKqType === "age_condition" ? "" : (newKqType === "yes_no" ? "نعم" : newKqOptions[0]), minAge: newKqType === "age_condition" ? Number(newKqMinAge) : undefined, maxAge: newKqType === "age_condition" && newKqMaxAge !== "" ? Number(newKqMaxAge) : undefined }]); setNewKqText(""); setNewKqMinAge(""); setNewKqMaxAge(""); }}'
);

// 4. Update rendered item in ManageJobModal
content = content.replace(
  '<p className="text-xs text-slate-500">{q.type === "yes_no" ? "نعم/لا" : "خيارات متعددة"} - الإجابة المطلوبة: <span className="font-bold text-primary">{q.requiredAnswer}</span></p></div>',
  '<p className="text-xs text-slate-500">{q.type === "age_condition" ? `شرط العمر: من ${q.minAge}${q.maxAge ? ` إلى ${q.maxAge}` : " فأكثر"}` : `${q.type === "yes_no" ? "نعم/لا" : "خيارات متعددة"} - الإجابة المطلوبة:`} {q.type !== "age_condition" && <span className="font-bold text-primary">{q.requiredAnswer}</span>}</p></div>'
);

fs.writeFileSync('src/components/CreateJob.tsx', content);
console.log('ManageJobModal Knockout section updated successfully.');
