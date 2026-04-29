const fs = require('fs');
let content = fs.readFileSync('src/components/CreateJob.tsx', 'utf-8');

// For main CreateJob component
content = content.replace(
  'if (newKqType === "age_condition") {\n                                        if (newKqMinAge === "") {\n                                          window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى تحديد الحد الأدنى للعمر!", type: "warning" } }));\n                                          return;\n                                        }\n                                      } else if (newKqType !== "options" && !newKqRequiredAnswer) {\n                                        alert("يرجى تحديد الإجابة المطلوبة للقبول!");\n                                        return;\n                                      }',
  'if (newKqType !== "options" && newKqType !== "age_condition" && !newKqRequiredAnswer) {\n                                        alert("يرجى تحديد الإجابة المطلوبة للقبول!");\n                                        return;\n                                      }'
);

// For ManageJobModal
content = content.replace(
  'onClick={(e) => { e.preventDefault(); if (!newKqText.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى إدخال نص السؤال!", type: "warning" } })); return; } if (newKqType === "age_condition" && newKqMinAge === "") { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى تحديد الحد الأدنى للعمر!", type: "warning" } })); return; } setKnockoutQuestions([...knockoutQuestions, { text: newKqText.trim(), type: newKqType, options: newKqType === "options" ? newKqOptions : undefined, requiredAnswer: newKqType === "age_condition" ? "" : (newKqType === "yes_no" ? "نعم" : newKqOptions[0]), minAge: newKqType === "age_condition" ? Number(newKqMinAge) : undefined, maxAge: newKqType === "age_condition" && newKqMaxAge !== "" ? Number(newKqMaxAge) : undefined }]); setNewKqText(""); setNewKqMinAge(""); setNewKqMaxAge(""); }}',
  'onClick={(e) => { e.preventDefault(); if (!newKqText.trim()) { window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "يرجى إدخال نص السؤال!", type: "warning" } })); return; } setKnockoutQuestions([...knockoutQuestions, { text: newKqText.trim(), type: newKqType, options: newKqType === "options" ? newKqOptions : undefined, requiredAnswer: newKqType === "age_condition" ? "" : (newKqType === "yes_no" ? "نعم" : newKqOptions[0]), minAge: newKqType === "age_condition" && newKqMinAge !== "" ? Number(newKqMinAge) : undefined, maxAge: newKqType === "age_condition" && newKqMaxAge !== "" ? Number(newKqMaxAge) : undefined }]); setNewKqText(""); setNewKqMinAge(""); setNewKqMaxAge(""); }}'
);

// We need to also adjust the placeholder in ManageJobModal min age field to be optional
content = content.replace(
  'placeholder="الحد الأدنى (مثال: 21)" className="w-1/2 px-4 py-3 bg-white dark:bg-slate-900',
  'placeholder="الحد الأدنى (اختياري)" className="w-1/2 px-4 py-3 bg-white dark:bg-slate-900'
);

// We need to also adjust the placeholder in Main CreateJob min age field to be optional
content = content.replace(
  'placeholder="الحد الأدنى (مثال: 21)"',
  'placeholder="الحد الأدنى (اختياري)"'
);

// Adjust the display logic for age condition in the list
// Previous: `شرط العمر: من ${q.minAge}${q.maxAge ? \` إلى ${q.maxAge}\` : " فأكثر"}`
// We want it to be smart based on what is present
content = content.replace(
  '`شرط العمر: من ${q.minAge}${q.maxAge ? \\` إلى ${q.maxAge}\\` : " فأكثر"}`',
  '`شرط العمر: ` + (q.minAge && q.maxAge ? (q.minAge === q.maxAge ? `يساوي ${q.minAge} سنة` : `بين ${q.minAge} و ${q.maxAge} سنة`) : q.minAge ? `أكبر من أو يساوي ${q.minAge}` : q.maxAge ? `أصغر من أو يساوي ${q.maxAge}` : "أي عمر")'
);
// Replace it globally in case there are multiple
content = content.split('`شرط العمر: من ${q.minAge}${q.maxAge ? \\` إلى ${q.maxAge}\\` : " فأكثر"}`').join('`شرط العمر: ` + (q.minAge && q.maxAge ? (q.minAge === q.maxAge ? `يساوي ${q.minAge} سنة` : `بين ${q.minAge} و ${q.maxAge} سنة`) : q.minAge ? `أكبر من أو يساوي ${q.minAge}` : q.maxAge ? `أصغر من أو يساوي ${q.maxAge}` : "أي عمر")');

// Wait, I used string replace, so we need to make sure the backticks don't escape.
fs.writeFileSync('src/components/CreateJob.tsx', content);
