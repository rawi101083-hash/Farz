const fs = require('fs');
let content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');

// 1. Update type
content = content.replace(
  '{ text: string; type: "yes_no" | "options"; options?: string[]; requiredAnswer: string }[]',
  '{ text: string; type: "yes_no" | "options" | "age_condition"; options?: string[]; requiredAnswer: string; minAge?: number; maxAge?: number }[]'
);

// 2. Add age_condition option
content = content.replace(
  '<option value="options" className="bg-white text-navy dark:bg-slate-800 dark:text-white">خيارات متعددة</option>',
  '<option value="options" className="bg-white text-navy dark:bg-slate-800 dark:text-white">خيارات متعددة</option>\n                                      <option value="age_condition" className="bg-white text-navy dark:bg-slate-800 dark:text-white">شرط العمر</option>'
);

// 3. Update inputs
content = content.replace(
  '{newKqType === "yes_no" ? (\n                                      <select',
  `{newKqType === "age_condition" ? (
                                      <div className="flex items-center gap-4">
                                        <input
                                          type="number"
                                          placeholder="الحد الأدنى (مثال: 21)"
                                          value={newKqMinAge}
                                          onChange={(e) => setNewKqMinAge(e.target.value ? Number(e.target.value) : "")}
                                          className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm"
                                        />
                                        <input
                                          type="number"
                                          placeholder="الحد الأعلى (اختياري)"
                                          value={newKqMaxAge}
                                          onChange={(e) => setNewKqMaxAge(e.target.value ? Number(e.target.value) : "")}
                                          className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl outline-none font-bold text-sm"
                                        />
                                      </div>
                                    ) : newKqType === "yes_no" ? (
                                      <select`
);

// 4. Update validation
content = content.replace(
  'if (newKqType !== "options" && !newKqRequiredAnswer) {\n                                        alert("يرجى إدخال نص السؤال وتحديد الإجابة المطلوبة للقبول!");\n                                        return;\n                                      }',
  `if (!newKqText.trim()) {\n                                        alert("يرجى إدخال نص السؤال!");\n                                        return;\n                                      }\n                                      if (newKqType === "age_condition") {\n                                        if (newKqMinAge === "") {\n                                          window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى تحديد الحد الأدنى للعمر!", type: "warning" } }));\n                                          return;\n                                        }\n                                      } else if (newKqType !== "options" && !newKqRequiredAnswer) {\n                                        alert("يرجى تحديد الإجابة المطلوبة للقبول!");\n                                        return;\n                                      }`
);

// 5. Update state update
content = content.replace(
  'setKnockoutQuestions([...knockoutQuestions, {\n                                        text: newKqText.trim(),\n                                        type: newKqType,\n                                        options: newKqType === "options" ? newKqOptions : undefined,\n                                        requiredAnswer: newKqRequiredAnswer\n                                      }]);\n                                      setNewKqText("");\n                                      setNewKqOptions([]);\n                                      setNewKqOptionInput("");',
  `setKnockoutQuestions([...knockoutQuestions, {\n                                        text: newKqText.trim(),\n                                        type: newKqType,\n                                        options: newKqType === "options" ? newKqOptions : undefined,\n                                        requiredAnswer: newKqType === "age_condition" ? "" : newKqRequiredAnswer,\n                                        minAge: newKqType === "age_condition" ? Number(newKqMinAge) : undefined,\n                                        maxAge: newKqType === "age_condition" && newKqMaxAge !== "" ? Number(newKqMaxAge) : undefined\n                                      }]);\n                                      setNewKqText("");\n                                      setNewKqOptions([]);\n                                      setNewKqOptionInput("");\n                                      setNewKqMinAge("");\n                                      setNewKqMaxAge("");`
);

// 6. Update list item rendering
content = content.replace(
  '<p className="text-xs text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded inline-block">الإجابة المطلوبة للقبول: {q.requiredAnswer}</p>',
  '<p className="text-xs text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded inline-block">{q.type === "age_condition" ? `العمر المطلوب: من ${q.minAge}${q.maxAge ? ` إلى ${q.maxAge}` : " فأكثر"}` : `الإجابة المطلوبة للقبول: ${q.requiredAnswer}`}</p>'
);

fs.writeFileSync('src/components/CreateJob.tsx', content);
console.log('Main CreateJob Knockout section updated successfully.');
